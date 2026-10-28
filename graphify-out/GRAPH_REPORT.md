# Graph Report - UmbraDB

## Corpus Check
- 1011 files · ~1,483,692 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10686 nodes · 31476 edges · 330 communities (298 shown, 32 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2539 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `f2d0c10043b6dc07` (1011 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- db/errors.ts
- adapter-fixtures.ts
- UmbraError
- transform-checks.ts
- Process
- cursor-table.test.ts
- networks.ts
- validation.ts
- browser/build.ts
- block-fetch-decode.test.ts
- opt-out.test.ts
- version.negative-control.test.ts
- private/lockstep-wait.test.ts
- code-registry.ts
- binding.test.ts
- version-checks.ts
- module-api.test.ts
- pg-tx-history-adapter.ts
- Lockstep
- containers.test.ts
- PrivateTransport
- check-required-tests.ts
- legacy-excluded.test.ts
- .read
- fixtures/configuration.ts
- core-private-source.ts
- PrivateBlockSource
- node-bridge.ts
- core-block-fetch/metadata.ts
- recovery.test.ts
- src/db/postgres.ts
- node-source.test.ts
- test/postgres/setup.ts
- shims.test.ts
- version-table.ts
- node/socket.ts
- .value
- admin-harness.ts
- PortSocket
- transaction-history-storage.property.test.ts
- lockstep-refusals.test.ts
- public-database.ts
- ingest-faults.test.ts
- JsonValue
- NodeClient
- ws-mutual-tls.test.ts
- loop.ts
- statementsOf
- 10. Node client and ingest
- checkShape
- web-lock.ts
- Design — Sprint 1: project setup + TemporalKV
- client.test.ts
- no-indexer-or-wallet-sdk.test.ts
- worker-threads.test.ts
- identity.ts
- .from
- worker-threads-worker.ts
- buffer.ts
- Worker
- scale-value.ts
- ChromeTab
- host.ts
- builder.test.ts
- sha256
- api-server.test.ts
- Roadmap for the missing formalization
- postgres-image.test.ts
- postgres-image.ts
- node-format.ts
- stats.ts
- ChildReader
- loop.test.ts
- ledger/plain-data.ts
- config-check.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- ledger/ledger-tasks.test.ts
- adapter.ts
- CrashWorkerHandle
- FinalizedLoop
- cbor.ts
- process-admin.ts
- core-block-parsed.ts
- private/backends.ts
- https.ts
- NodeFS
- ref_node_fs
- process-context.test.ts
- range.test.ts
- change-capture.ts
- contract-data-checks.ts
- process-build.ts
- core-transport.ts
- ingest
- validate.test.ts
- declaration.ts
- backup/restore.ts
- mapping.ts
- fetch-fixtures.ts
- declaration
- backup/backup.ts
- range.ts
- core-block-commit.test.ts
- browser.test.ts
- spawnChild
- runner/process.ts
- config/history.ts
- code
- core-contract-logs-fast.ts
- BlockRef
- cli-fixtures.ts
- NodeBlockSource
- PgTransactionHistoryStorage
- slow-block-harness.ts
- deterministic-postgresql/index.ts
- interfaces/transaction-history-storage.ts
- tape/index.ts
- 5. Runner
- process-backends.ts
- cli/command.ts
- intake.test.ts
- height-versioned.test.ts
- lifecycle.test.ts
- transport-faults.test.ts
- ModuleDeclaration
- InMemoryBlockSource
- version
- vitest
- boundary.test.ts
- graph.ts
- real-tapes.ts
- core-settings.ts
- chain-events-source.test.ts
- .concat
- snapshot.test.ts
- column-rules.ts
- config/plain-data.ts
- retirement.test.ts
- net.test.ts
- page.ts
- pglite-server.ts
- restore-private.ts
- core-ledger-state.ts
- T
- validate.ts
- TransactionHistoryEntry
- cold-boot-recovery.integration.test.ts
- ADDED Requirements
- .position
- graph.py
- refused
- ADDED Requirements
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- .boolean
- migrations
- .slowBlockMs
- mutation-per-adapter.mjs
- twox.ts
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- pack-install.mjs
- schemaName
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- midnight-env — reproducible PREPROD dev environment
- read-only-checks.ts
- fresh-instance.mjs
- crash-worker.ts
- leanProblems
- fn
- history
- .put
- Storage Algebra Lean Formalization — Approved Design and Status
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- core-private-source.test.ts
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
- package.json
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB
- stryker.conf.json
- chain_archive lineage
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- UmbraDB module guide
- ADDED Requirements
- REMOVED Requirements
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — Sprint 4: Watermarks
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
- Full-Chain Storage
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Security policy & threat model
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0-infosec-signoff
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-infosec-signoff
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- Vendored ledger builds
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00023 — The blocks table's height partitions end at 5,000,000
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- bug-report.md
- feature-request.md
- GC architecture and query-tracing: research findings
- manifest.json
- 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Requirement: RN-13 SIGTERM stops cleanly
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- peerDependenciesMeta
- repository
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bin
- post-block-update/oracle/run.sh
- state-trees/oracle/run.sh
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB V1.0.0 Implementation Guideline
- README.md
- post-block-update/oracle/main.rs
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 318 edges
2. `UmbraError` - 299 edges
3. `ModuleDeclaration` - 170 edges
4. `FinalizedLoop` - 120 edges
5. `NodeClient` - 105 edges
6. `InMemoryBlockSource` - 105 edges
7. `Database` - 97 edges
8. `BlockRef` - 93 edges
9. `ReadHandle` - 85 edges
10. `5. Runner` - 78 edges

## Surprising Connections (you probably didn't know these)
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?` --references--> `Buffer`  [INFERRED]
  docs/research/a1-unbounded-bytea-insert.md → browser/src/shims/buffer.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (330 total, 32 thin omitted)

### Community 0 - "db/errors.ts"
Cohesion: 0.03
Nodes (152): ConfiguredDatabase, PostgresOptions, BlockWriteHandle, Database, ReadOnlyDatabase, ReadOptions, SchemaWriteHandle, Transaction (+144 more)

### Community 1 - "adapter-fixtures.ts"
Cohesion: 0.03
Nodes (148): LedgerReleasePackage, ApplyInput, LedgerPackageOptions, StoredNode, V9Logs, Freeable, LoadAdapter, Upstream (+140 more)

### Community 10 - "UmbraError"
Cohesion: 0.03
Nodes (67): LoadedConfig, LoadOptions, databaseTarget, ReadDatabaseOptions, Job, JobQueue, Held, PgliteLockUse (+59 more)

### Community 100 - "transform-checks.ts"
Cohesion: 0.10
Nodes (18): Failure, Variant, baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape(), expectVariantOutput(), forkRecords() (+10 more)

### Community 102 - "Process"
Cohesion: 0.12
Nodes (6): CoreTransport, Process, readIdentity(), messageOf(), nodeClientClosed(), pause()

### Community 103 - "cursor-table.test.ts"
Cohesion: 0.08
Nodes (27): cursorTable, CursorTableOptions, CursorValue, cursorDatabase, Access, Block, BlockFails, Counts (+19 more)

### Community 105 - "networks.ts"
Cohesion: 0.07
Nodes (32): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, Answers (+24 more)

### Community 106 - "validation.ts"
Cohesion: 0.07
Nodes (31): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+23 more)

### Community 107 - "browser/build.ts"
Cohesion: 0.08
Nodes (27): BrowserBuild, BrowserBuildOptions, BrowserControl, pageBench, PageServer, browserLedgerEntry(), browserPlugin(), buildBrowser() (+19 more)

### Community 109 - "block-fetch-decode.test.ts"
Cohesion: 0.10
Nodes (29): ExtrinsicCall, PalletSpec, blake2b256(), compress(), rotateRight(), words(), blockTimeOf(), callOf() (+21 more)

### Community 11 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (74): CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions (+66 more)

### Community 112 - "version.negative-control.test.ts"
Cohesion: 0.12
Nodes (15): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, MetadataSelector, Select, Walk, OwnStateMetadata (+7 more)

### Community 113 - "private/lockstep-wait.test.ts"
Cohesion: 0.09
Nodes (20): Report, ExpectedWait, SkipsUnseen, WaitsInTransaction, ReportRelay, RetargetProxy, a117Problems(), firstWait() (+12 more)

### Community 114 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 118 - "binding.test.ts"
Cohesion: 0.12
Nodes (25): builtInNetwork, A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), a113Problems() (+17 more)

### Community 119 - "version-checks.ts"
Cohesion: 0.16
Nodes (23): CountingNode, Answers, toHex(), H(), blockWith(), copyVendoredLedger(), expectBadVersionDigestHalts(), expectEveryPackageFileChecked() (+15 more)

### Community 12 - "module-api.test.ts"
Cohesion: 0.03
Nodes (78): ModuleApiServer, ModuleApiStart, StartedModuleApi, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart (+70 more)

### Community 120 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 123 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 124 - "containers.test.ts"
Cohesion: 0.11
Nodes (19): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+11 more)

### Community 127 - "PrivateTransport"
Cohesion: 0.12
Nodes (9): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), readFailure(), reject(), resolve() (+1 more)

### Community 128 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 129 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 13 - ".read"
Cohesion: 0.03
Nodes (98): ChangeKind, tableChanges, TouchedRow, Chain, ChainOptions, DigestRow, Op, States (+90 more)

### Community 130 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (19): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, StartRun, core(), databaseOf(), defineConfig() (+11 more)

### Community 131 - "core-private-source.ts"
Cohesion: 0.13
Nodes (21): ChainCheck, PrivateChecks, PrivateIntakeOptions, PublicConfiguration, PublicIdentity, PublicSide, PublicItem, readCursor() (+13 more)

### Community 134 - "PrivateBlockSource"
Cohesion: 0.11
Nodes (7): PrivateBlockSource, SourceTransport, PublicDatabase, PublicWakes, lockstepBehind(), readPrivateRow(), publicConfigChanged()

### Community 135 - "node-bridge.ts"
Cohesion: 0.13
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 138 - "core-block-fetch/metadata.ts"
Cohesion: 0.23
Nodes (15): MetadataPallet, MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata() (+7 more)

### Community 139 - "recovery.test.ts"
Cohesion: 0.14
Nodes (20): CommitOutcome, HeldHeight, ProcessStatus, A43Observation, AlwaysLost, DropsHeld, Fault, Recorded (+12 more)

### Community 14 - "src/db/postgres.ts"
Cohesion: 0.05
Nodes (84): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, DriverError, Outcome, PostgresOptions, Role (+76 more)

### Community 140 - "node-source.test.ts"
Cohesion: 0.12
Nodes (12): Fetching, Opened, Recorder, cursorRead(), following(), open(), quiet(), sameHash() (+4 more)

### Community 142 - "test/postgres/setup.ts"
Cohesion: 0.14
Nodes (21): Cancellable, CrashHook, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker(), backendPid() (+13 more)

### Community 143 - "shims.test.ts"
Cohesion: 0.12
Nodes (10): Buffer, Hash, createHash(), join(), normalize(), resolve(), delimiter, sep (+2 more)

### Community 144 - "version-table.ts"
Cohesion: 0.16
Nodes (22): ConfiguredLedgerTable, LedgerPin, LedgerRow, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins() (+14 more)

### Community 145 - "node/socket.ts"
Cohesion: 0.13
Nodes (13): Connection, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure, connectWebSocket(), "on-compute"(), DEFAULT_HEARTBEAT_MS (+5 more)

### Community 147 - ".value"
Cohesion: 0.26
Nodes (7): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 15 - "admin-harness.ts"
Cohesion: 0.04
Nodes (79): adminRoutes, AdminEndpoint, AdminPart, AdminView, ReadinessFacts, CoreLedgerVersion, LedgerPackageIdentity, ProcessState (+71 more)

### Community 150 - "PortSocket"
Cohesion: 0.16
Nodes (9): PortSocket, pair(), 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix, Contract states and contract logs, Requirement: RN-15 Module APIs are registered once, at startup (+1 more)

### Community 151 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 152 - "lockstep-refusals.test.ts"
Cohesion: 0.22
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+10 more)

### Community 155 - "public-database.ts"
Cohesion: 0.25
Nodes (18): PublicSideOptions, TransportPosition, readConfigHash(), readConfigRows(), openPublicDatabase(), openPublicSide(), pollingWakes(), present() (+10 more)

### Community 157 - "ingest-faults.test.ts"
Cohesion: 0.16
Nodes (14): ProcessCondition, A84Observation, LoggedRetry, OutageObservation, RetrySample, a84Tape(), discarded(), fastClient() (+6 more)

### Community 158 - "JsonValue"
Cohesion: 0.12
Nodes (17): JsonValue, 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file) (+9 more)

### Community 16 - "NodeClient"
Cohesion: 0.06
Nodes (61): NodeSourceOptions, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription, Waiter (+53 more)

### Community 165 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (12): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+4 more)

### Community 17 - "loop.ts"
Cohesion: 0.03
Nodes (74): PointName, ResolvedRange, CallbackFailure, EntryBoundary, PointSchedule, ProcessReason, ReasonCode, Unwrapped (+66 more)

### Community 171 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 172 - "10. Node client and ingest"
Cohesion: 0.14
Nodes (12): ConfiguredGenesis, configuredGenesisOf(), 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 3. Block source and ingest, Design — CORE-ARCH: the standalone indexer's core architecture (+4 more)

### Community 174 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 178 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 179 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.15
Nodes (13): Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4a. Error translation (`src/postgres/errors.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV (+5 more)

### Community 18 - "client.test.ts"
Cohesion: 0.03
Nodes (52): Answer, FakeNode, Handler, Received, recorded, ManualTimers, TapeCall, result() (+44 more)

### Community 183 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 184 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 189 - "identity.ts"
Cohesion: 0.27
Nodes (12): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+4 more)

### Community 19 - ".from"
Cohesion: 0.05
Nodes (87): LedgerEvent, StateSummary, TransactionResult, VmLog, transactionSpec, ledgerItemsSeen, SeenLoad, RestartEvent (+79 more)

### Community 191 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 192 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 198 - "scale-value.ts"
Cohesion: 0.18
Nodes (10): MetadataField, MetadataType, Primitive, canonicalJson(), hexOf(), littleEndian(), BIT_STORES, INTEGERS (+2 more)

### Community 2 - "host.ts"
Cohesion: 0.03
Nodes (105): LoadLedger, RetainedState, LedgerName, ApplyOutput, ChainOutcome, LedgerPackage, LedgerTask, LedgerTaskBlock (+97 more)

### Community 20 - "builder.test.ts"
Cohesion: 0.04
Nodes (45): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step, Frame (+37 more)

### Community 207 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 21 - "api-server.test.ts"
Cohesion: 0.04
Nodes (63): ReadHandle, ApiRegistry, FieldSchema, Lifetime, PointCallbacks, ChainDataAnswer, ChainDataView, HttpHandler (+55 more)

### Community 213 - "Roadmap for the missing formalization"
Cohesion: 0.20
Nodes (9): Key, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec (+1 more)

### Community 218 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 219 - "postgres-image.ts"
Cohesion: 0.28
Nodes (5): BenchEnv, PG_SETTINGS, container, { guarded, fixture }, POSTGRES_IMAGE

### Community 22 - "node-format.ts"
Cohesion: 0.06
Nodes (59): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+51 more)

### Community 220 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 23 - "loop.test.ts"
Cohesion: 0.05
Nodes (65): HeightFailure, LockstepWait, Contexts, Faults, LostCommit, Outcomes, Seen, AtGate (+57 more)

### Community 237 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 24 - "config-check.ts"
Cohesion: 0.04
Nodes (69): ConfiguredDatabaseOptions, CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, TypeCheckFinding (+61 more)

### Community 246 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 25 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.04
Nodes (73): SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, bindLedgerTasks(), boundHost() (+65 more)

### Community 26 - "adapter.ts"
Cohesion: 0.04
Nodes (65): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+57 more)

### Community 27 - "FinalizedLoop"
Cohesion: 0.05
Nodes (23): PointRun, Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, Batching, WaitingInRead (+15 more)

### Community 28 - "cbor.ts"
Cohesion: 0.04
Nodes (74): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+66 more)

### Community 29 - "process-admin.ts"
Cohesion: 0.06
Nodes (73): ConfigFacts, OpenedConfig, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, DigestRow, ModuleFacts (+65 more)

### Community 3 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (158): BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions, TransactionParser, ChainTransaction, ChainEvent (+150 more)

### Community 30 - "private/backends.ts"
Cohesion: 0.05
Nodes (54): PrivateBackend, SessionSeen, TestDatabase, A162Options, a162Run, HeaderSeen, Pause, Q142Observation (+46 more)

### Community 31 - "ref_node_fs"
Cohesion: 0.07
Nodes (52): BackupBackend, killedRestore, TickerConfig, ledgerBackup, Pem, withNodeRoot(), catalogOf(), hashOf() (+44 more)

### Community 32 - "process-context.test.ts"
Cohesion: 0.04
Nodes (45): ItemDeclaration, ProcessContext, Revision, EntryRange, ResolvedGraph, StartedModuleApi, MisuseListener, ProcessContexts (+37 more)

### Community 33 - "range.test.ts"
Cohesion: 0.05
Nodes (41): ConnectSocket, Script, ScriptedNode, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+33 more)

### Community 34 - "change-capture.ts"
Cohesion: 0.05
Nodes (57): CaptureColumn, CapturedTable, CaptureState, GuardTableRow, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules (+49 more)

### Community 35 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (65): ContractStateRow, CoreContractStatesOptions, CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+57 more)

### Community 36 - "process-build.ts"
Cohesion: 0.07
Nodes (59): coreEntry, BlockHeader, NodeClientOptions, CrashEvent, CrashJob, IngestOptions, SourceClass, watched (+51 more)

### Community 37 - "core-transport.ts"
Cohesion: 0.04
Nodes (59): Session, TransportLimits, TransportTls, Committed, Hello, MessageFault, MessageType, Parsed (+51 more)

### Community 38 - "ingest"
Cohesion: 0.07
Nodes (60): FixtureRun, ingest, TasksRun, SweepModel, TableSnapshot, FixtureNode, FakeState, RefusalData (+52 more)

### Community 39 - "validate.test.ts"
Cohesion: 0.04
Nodes (62): CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+54 more)

### Community 4 - "declaration.ts"
Cohesion: 0.03
Nodes (116): DefinedModule, KnownPointsOnly, TableDeclaration, ProcessConfig, ProcessHandle, AdminRun, gate, ProbeRecord (+108 more)

### Community 40 - "backup/restore.ts"
Cohesion: 0.05
Nodes (55): crossedError, openedProcess, PgliteDump, RestoreChain, RestoreInput, RestoreTarget, BackupText, messageAdmin() (+47 more)

### Community 41 - "mapping.ts"
Cohesion: 0.05
Nodes (49): ResultColumn, ResultType, Case, HeldRead, Job, Outcome, Reads, Step (+41 more)

### Community 42 - "fetch-fixtures.ts"
Cohesion: 0.08
Nodes (59): EventSpec, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded, FetchSeen (+51 more)

### Community 43 - "declaration"
Cohesion: 0.06
Nodes (60): GraphInput, PointArguments, PastFaultCase, RefusalCase, CallEvent, resolveGraph(), contractLogs(), declaration() (+52 more)

### Community 44 - "backup/backup.ts"
Cohesion: 0.06
Nodes (57): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+49 more)

### Community 45 - "range.ts"
Cohesion: 0.05
Nodes (61): BoundaryBlockReading, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange, Final, Height (+53 more)

### Community 46 - "core-block-commit.test.ts"
Cohesion: 0.04
Nodes (49): StandInOptions, Commit, Committed, CheckTarget, CliBackend, Snapshot, TestBackend, AlwaysLanded (+41 more)

### Community 47 - "browser.test.ts"
Cohesion: 0.06
Nodes (57): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, ProcessName, StatusBody, Cdp (+49 more)

### Community 48 - "spawnChild"
Cohesion: 0.04
Nodes (54): ParentJob, Kill, Orphaned, SourceFile, LockResult, ReportedTest, dockerExec(), guardPid() (+46 more)

### Community 49 - "runner/process.ts"
Cohesion: 0.05
Nodes (43): Bound, ChainSource, CoreChainBinding, CoreChainFacts, NodeWait, WaitingListener, LedgerTable, RetryCode (+35 more)

### Community 5 - "config/history.ts"
Cohesion: 0.03
Nodes (119): CoreVersion, CoreSettings, versionEntry, ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext, HistoryInput (+111 more)

### Community 50 - "code"
Cohesion: 0.04
Nodes (62): Migration, up(), code(), name, Added, 2. Forward-only / no-downgrade migration contract, `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes (+54 more)

### Community 52 - "core-contract-logs-fast.ts"
Cohesion: 0.06
Nodes (53): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+45 more)

### Community 53 - "BlockRef"
Cohesion: 0.06
Nodes (31): BlockHeaderItem, BlockEventSource, BodyExtrinsic, BlockItemSource, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, QueuedBlock (+23 more)

### Community 54 - "cli-fixtures.ts"
Cohesion: 0.06
Nodes (42): CheckStep, ConfigCheckReport, cliProject, RunningCommand, statsConfig, configCheck(), configText(), coreSettings() (+34 more)

### Community 55 - "NodeBlockSource"
Cohesion: 0.07
Nodes (15): HeadWait, NodeBlockSource, Prefetch, NodeSubscription, NodeHeader, PreparedBlock, QueueRunner, EventsRunner (+7 more)

### Community 56 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (52): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation) (+44 more)

### Community 57 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (48): BlockContext, HeightActivity, SlowBlockEvent, StatusBody, Times, Wait, askedSource, BodyRead (+40 more)

### Community 58 - "deterministic-postgresql/index.ts"
Cohesion: 0.06
Nodes (38): Settings, Run, Job, WorkerEvent, Outcome, commitHeight(), fresh(), expectNeverCutOffNorHung() (+30 more)

### Community 59 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (40): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, JsonEncoded (+32 more)

### Community 6 - "tape/index.ts"
Cohesion: 0.05
Nodes (101): Recorded, Link, TapeBuilderOptions, RecordingProblem, TapeError, TapeProblem, TransformError, TransformProblem (+93 more)

### Community 60 - "5. Runner"
Cohesion: 0.07
Nodes (52): Callback, ParallelPoint, AppendsVersion, Recorder, CheckName, GraphSpec, ModuleSpec, TESTED (+44 more)

### Community 61 - "process-backends.ts"
Cohesion: 0.08
Nodes (42): SignalTarget, SourceShared, A169Observation, SourceOf, ProcessBackend, A167Observation, CheckOf, NodeWatch (+34 more)

### Community 62 - "cli/command.ts"
Cohesion: 0.06
Nodes (46): RestoreSeams, Environment, BackupCommandOptions, BackupOutcome, CommandHandler, CommandIo, MainProcess, commandTarget (+38 more)

### Community 64 - "intake.test.ts"
Cohesion: 0.08
Nodes (44): PrivateSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation, A116Observation, TestLink (+36 more)

### Community 65 - "height-versioned.test.ts"
Cohesion: 0.07
Nodes (36): heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Control, StoredVersion, Block, BlockFails, Counts (+28 more)

### Community 66 - "lifecycle.test.ts"
Cohesion: 0.07
Nodes (31): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer, AdminSnapshot (+23 more)

### Community 68 - "transport-faults.test.ts"
Cohesion: 0.08
Nodes (35): Message, TestCertificates, Ended, rawClient, codeOf(), splitAddress(), startCoreTransport(), hexOf() (+27 more)

### Community 69 - "ModuleDeclaration"
Cohesion: 0.07
Nodes (36): AdminStarter, ChainCheckInput, privateIntake, RunOptions, RunSeams, SignalSource, stopSignal, ModuleDeclaration (+28 more)

### Community 7 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (87): InMemoryBlockSource, InMemoryItems, Wait, Job, WorkerEvent, A77Observation, A78Observation, A78Refusal (+79 more)

### Community 70 - "version"
Cohesion: 0.04
Nodes (47): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+39 more)

### Community 71 - "vitest"
Cohesion: 0.05
Nodes (27): Lockfile, Manifest, Upstream, Leftover, RemovedName, filesUnder(), patchesOf(), patchText() (+19 more)

### Community 72 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 73 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, HeightRange, MidChain, Missing, RangeCheck (+40 more)

### Community 75 - "real-tapes.ts"
Cohesion: 0.08
Nodes (37): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+29 more)

### Community 76 - "core-settings.ts"
Cohesion: 0.06
Nodes (42): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+34 more)

### Community 77 - "chain-events-source.test.ts"
Cohesion: 0.07
Nodes (17): NodeCallOptions, RecordingClient, NodeRunResult, Outage, TapeClock, TapeNode, withDevelopmentOptIn(), open() (+9 more)

### Community 78 - ".concat"
Cohesion: 0.05
Nodes (32): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+24 more)

### Community 79 - "snapshot.test.ts"
Cohesion: 0.09
Nodes (33): AllowedDetail, RevisionSettings, RedactableConfig, RedactionForms, redactor, SecretForm, TextPattern, fieldKinds (+25 more)

### Community 8 - "column-rules.ts"
Cohesion: 0.02
Nodes (105): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+97 more)

### Community 80 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (33): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, sameRow(), copyArray() (+25 more)

### Community 81 - "retirement.test.ts"
Cohesion: 0.07
Nodes (39): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), manifestProblems(), mutationProblems() (+31 more)

### Community 82 - "net.test.ts"
Cohesion: 0.08
Nodes (21): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade (+13 more)

### Community 87 - "page.ts"
Cohesion: 0.06
Nodes (32): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, Scope, CallMethod, FromProcessWorker (+24 more)

### Community 88 - "pglite-server.ts"
Cohesion: 0.08
Nodes (28): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, Report, Job (+20 more)

### Community 89 - "restore-private.ts"
Cohesion: 0.10
Nodes (31): BackupDatabase, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, PublicCore (+23 more)

### Community 9 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (88): CoreLedgerStateOptions, LedgerStateItem, retainedStates, CoreRevision, GreyPicker, GreyView, SweepPhase, SweepState (+80 more)

### Community 91 - "T"
Cohesion: 0.06
Nodes (37): Absent, n(), T(), input(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 4. Transaction / Lease — the control algebra the other three run inside (+29 more)

### Community 93 - "validate.ts"
Cohesion: 0.10
Nodes (38): HistoryFinding, CursorRule, Finding, Issue, Plain, FieldKind, coreSettingsSchema(), pathOf() (+30 more)

### Community 96 - "TransactionHistoryEntry"
Cohesion: 0.09
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema (+5 more)

### Community 97 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (24): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+16 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 235 - ".position"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 101 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 110 - "refused"
Cohesion: 0.07
Nodes (31): refused(), When a callback fails, 7. Storage helpers, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness (+23 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): `transaction_history`, 1. Schema, ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins (+15 more)

### Community 153 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (17): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface (+9 more)

### Community 154 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 159 - "migrations"
Cohesion: 0.11
Nodes (16): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Migrations, 6. Storage helpers, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes (+8 more)

### Community 163 - ".slowBlockMs"
Cohesion: 0.14
Nodes (14): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+6 more)

### Community 177 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 182 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 194 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 202 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 206 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 232 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 234 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.29
Nodes (7): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 289 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 290 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 301 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 302 - "leanProblems"
Cohesion: 0.50
Nodes (4): leanImports(), leanProblems(), leanTheorems(), retiredLean()

### Community 51 - "fn"
Cohesion: 0.04
Nodes (61): fn(), 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 4. Wiring `PgTemporalKV`'s `opts.tx`, 5. Error translation additions (`src/postgres/errors.ts`) (+53 more)

### Community 63 - "history"
Cohesion: 0.05
Nodes (54): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+46 more)

### Community 67 - ".put"
Cohesion: 0.04
Nodes (48): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+40 more)

### Community 92 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.05
Nodes (39): attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop (+31 more)

### Community 95 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (34): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change) (+26 more)

### Community 99 - "core-private-source.test.ts"
Cohesion: 0.06
Nodes (12): publicLockstepOf(), height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PUBLIC_POLL_MS (+4 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-16 Chain-data reads name their view and height, Requirement: RN-1 The main program is a fixed sequence of points, Requirement: RN-2 The runner does only its five duties (+25 more)

### Community 115 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (30): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+22 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+23 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+20 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+19 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 133 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 137 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 141 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 146 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.09
Nodes (17): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+9 more)

### Community 148 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 160 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.11
Nodes (16): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+8 more)

### Community 161 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 162 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 164 - "chain_archive lineage"
Cohesion: 0.12
Nodes (17): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, CheckpointStore tables, How the two lineages coexist (+9 more)

### Community 166 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+8 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 169 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 170 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 173 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 175 - "UmbraDB module guide"
Cohesion: 0.13
Nodes (14): Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Private modules, Reading through `db`, Running a module with the `umbradb` command, Start and stop heights (+6 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 180 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 185 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 186 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 188 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 190 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 196 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 197 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 2. `set`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 200 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 201 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 203 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 204 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 208 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 209 - "Full-Chain Storage"
Cohesion: 0.20
Nodes (9): 1. Overview / purpose, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 3. Semantic decode: `chain-archive-sync/tx-replay-decoder.ts`, 4. How to run it, 5. Acceptance criteria status, 6. Known limitations (+1 more)

### Community 210 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 211 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 212 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 214 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 215 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 216 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 217 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 221 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 222 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 223 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 224 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 225 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 226 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 227 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 2. Envelope module (Pg-only — required gate), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 228 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 231 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 233 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 236 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 238 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 239 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 240 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 241 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 242 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 243 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 244 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 245 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 248 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 249 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 250 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 251 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 252 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 253 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 254 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 255 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 256 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 257 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 258 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 259 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 260 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 261 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 262 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 263 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 264 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 266 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 267 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 268 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 269 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 270 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 271 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 272 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 273 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 274 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 275 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 276 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 277 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 278 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 279 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 280 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 281 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 282 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 283 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 284 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 285 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.40
Nodes (4): 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 286 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 287 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 288 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 291 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 292 - "00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor"
Cohesion: 0.50
Nodes (3): 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor, Evidence, Suggested fix

### Community 293 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 294 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 295 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 296 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 297 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 298 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.50
Nodes (4): Requirement: RN-13 SIGTERM stops cleanly, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable, Scenario: SIGTERM while the loop waits on an unreachable node

### Community 299 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 300 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 307 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 308 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 74 - "ADDED Requirements"
Cohesion: 0.04
Nodes (49): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+41 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 86 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.05
Nodes (35): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+27 more)

### Community 90 - "README.md"
Cohesion: 0.06
Nodes (30): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased], 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx` (+22 more)

### Community 94 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-3339`, `RFC-7693`, `RFC-7693`, `RFC-3339`, `RFC-8949` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3677 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `db/errors.ts`, `adapter-fixtures.ts`, `host.ts`, `core-block-parsed.ts`, `declaration.ts`, `config/history.ts`, `tape/index.ts`, `InMemoryBlockSource`, `column-rules.ts`, `core-ledger-state.ts`, `UmbraError`, `opt-out.test.ts`, `module-api.test.ts`, `.read`, `src/db/postgres.ts`, `admin-harness.ts`, `NodeClient`, `loop.ts`, `client.test.ts`, `.from`, `builder.test.ts`, `api-server.test.ts`, `node-format.ts`, `loop.test.ts`, `config-check.ts`, `ledger/ledger-tasks.test.ts`, `adapter.ts`, `cbor.ts`, `private/backends.ts`, `ref_node_fs`, `process-context.test.ts`, `range.test.ts`, `change-capture.ts`, `contract-data-checks.ts`, `process-build.ts`, `core-transport.ts`, `ingest`, `validate.test.ts`, `backup/restore.ts`, `mapping.ts`, `fetch-fixtures.ts`, `declaration`, `backup/backup.ts`, `core-block-commit.test.ts`, `browser.test.ts`, `spawnChild`, `runner/process.ts`, `BlockRef`, `cli-fixtures.ts`, `slow-block-harness.ts`, `deterministic-postgresql/index.ts`, `interfaces/transaction-history-storage.ts`, `5. Runner`, `process-backends.ts`, `cli/command.ts`, `intake.test.ts`, `height-versioned.test.ts`, `lifecycle.test.ts`, `transport-faults.test.ts`, `ModuleDeclaration`, `boundary.test.ts`, `real-tapes.ts`, `core-settings.ts`, `chain-events-source.test.ts`, `snapshot.test.ts`, `config/plain-data.ts`, `retirement.test.ts`, `net.test.ts`, `pglite-server.ts`, `restore-private.ts`, `cold-boot-recovery.integration.test.ts`, `core-private-source.test.ts`, `transform-checks.ts`, `cursor-table.test.ts`, `networks.ts`, `validation.ts`, `browser/build.ts`, `block-fetch-decode.test.ts`, `version.negative-control.test.ts`, `private/lockstep-wait.test.ts`, `code-registry.ts`, `binding.test.ts`, `version-checks.ts`, `pg-tx-history-adapter.ts`, `Lockstep`, `containers.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `package.json`, `node-bridge.ts`, `recovery.test.ts`, `node-source.test.ts`, `test/postgres/setup.ts`, `shims.test.ts`, `transaction-history-storage.property.test.ts`, `lockstep-refusals.test.ts`, `ingest-faults.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `web-lock.ts`, `excluded-not-exported.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `facade-merge-loader.ts`, `postgres-image.test.ts`?**
  _High betweenness centrality (0.255) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-7693`, `RFC-7693` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `db/errors.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02597306496966109 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `db/errors.ts`, `host.ts`, `core-private-source.ts`, `declaration.ts`, `config/history.ts`, `PrivateBlockSource`, `InMemoryBlockSource`, `tape/index.ts`, `core-ledger-state.ts`, `opt-out.test.ts`, `module-api.test.ts`, `.read`, `src/db/postgres.ts`, `node-source.test.ts`, `version-table.ts`, `NodeClient`, `loop.ts`, `shims.test.ts`, `client.test.ts`, `api-server.test.ts`, `loop.test.ts`, `config-check.ts`, `ledger/ledger-tasks.test.ts`, `lockstep-refusals.test.ts`, `public-database.ts`, `cbor.ts`, `process-admin.ts`, `ingest-faults.test.ts`, `ref_node_fs`, `process-context.test.ts`, `private/backends.ts`, `change-capture.ts`, `FinalizedLoop`, `process-build.ts`, `core-transport.ts`, `validate.test.ts`, `backup/restore.ts`, `mapping.ts`, `statementsOf`, `backup/backup.ts`, `declaration`, `core-block-commit.test.ts`, `checkShape`, `range.ts`, `runner/process.ts`, `web-lock.ts`, `UmbraDB module guide`, `core-contract-logs-fast.ts`, `BlockRef`, `NodeBlockSource`, `slow-block-harness.ts`, `deterministic-postgresql/index.ts`, `identity.ts`, `cli/command.ts`, `height-versioned.test.ts`, `transport-faults.test.ts`, `ModuleDeclaration`, `graph.ts`, `core-settings.ts`, `sha256`, `config/plain-data.ts`, `snapshot.test.ts`, `validate.ts`, `10. Node client and ingest`, `core-private-source.test.ts`, `cursor-table.test.ts`, `validation.ts`, `version.negative-control.test.ts`, `binding.test.ts`, `version-checks.ts`, `PrivateTransport`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `adapter-fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.029748584967750426 - nodes in this community are weakly interconnected._