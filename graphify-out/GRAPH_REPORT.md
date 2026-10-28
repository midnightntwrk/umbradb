# Graph Report - UmbraDB

## Corpus Check
- 1015 files · ~1,486,674 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10823 nodes · 32087 edges · 317 communities (287 shown, 30 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2583 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `c34bc9ebd6e9d2cf` (1015 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- admin-harness.ts
- column-rules.ts
- UmbraError
- .value
- node-fields-harness.ts
- vendored-ledger-v9.test.ts
- release-version.test.ts
- pg-tx-history-adapter.ts
- test/postgres/setup.ts
- browser/build.ts
- core-block-fetch/metadata.ts
- PrivateTransport
- process-admin.ts
- code-registry.ts
- Lockstep
- ws-mutual-tls.test.ts
- process-worker.ts
- restore-private.ts
- db/api.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- node-run.ts
- ref_node_url
- BlockRef
- adapter-fixtures.ts
- version-table.ts
- node-bridge.ts
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- Design — Sprint 1: project setup + TemporalKV
- type-check.ts
- shims.test.ts
- ModuleDeclaration
- block-fetch-decode.test.ts
- worker-storage.test.ts
- HeightRun
- run.test.ts
- validate.ts
- key-handling-checks.ts
- describeNodeStoreExports
- InMemoryTransactionHistoryStorage
- node-source.ts
- childRefKeys
- documents.test.ts
- PortSocket
- cbor.ts
- BlockItems
- statementsOf
- FinalizedLoop
- checkShape
- package-identity.test.ts
- ledger-checks.ts
- web-lock.ts
- fetch-fixtures.ts
- history.property.test.ts
- cli/restore.ts
- RuntimeMetadata
- core-transport.ts
- worker-threads-worker.ts
- buffer.ts
- Worker
- client.test.ts
- ledger/types.ts
- transport-intake.test.ts
- TapeAnswers
- sha256
- loop.test.ts
- stats.ts
- NodeClient
- HeldHeight
- ledger/plain-data.ts
- worker-threads.test.ts
- backup-fixtures.ts
- mutation-evidence.d.mts
- module-api.test.ts
- builder.negative-control.test.ts
- AsyncLocalStorage
- .from
- worker-threads-host.ts
- LedgerPackage
- .read
- writer-lock-checks.ts
- https.ts
- core-block-parsed.ts
- NodeFS
- TickerProcess
- InMemoryBlockSource
- process-context.test.ts
- contract-modules.test.ts
- interfaces/transaction-history-storage.ts
- ledger/ledger-tasks.test.ts
- api-server.test.ts
- core-ledger-state.ts
- range.ts
- core-private-source.ts
- browser.test.ts
- contract-data-checks.ts
- chain-placement.test.ts
- change-capture.ts
- backup/backup.ts
- PgTransactionHistoryStorage
- code
- slow-block-harness.ts
- order.property.test.ts
- NodeBlockSource
- devnet-upgrade.test.ts
- node.test.ts
- migrate.ts
- spawnChild
- boundary.test.ts
- height-versioned.test.ts
- crash.test.ts
- database-fixtures.ts
- mapping.ts
- ref_node_fs
- graph.ts
- cold-boot-recovery.integration.test.ts
- tape/index.ts
- ledger-sweep.test.ts
- binding.test.ts
- retirement.test.ts
- builds.ts
- ref_node_crypto
- TransactionHistoryStorage
- ledger/load.ts
- config/history.ts
- private/backends.ts
- config-hash-checks.ts
- intake.test.ts
- graph.test.ts
- net.test.ts
- Process
- version-checks.ts
- lockstep-refusals.test.ts
- page.ts
- runner/process.ts
- node-format.ts
- chrome.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- version
- validation.ts
- ingest-harness.ts
- networks.ts
- .concat
- vitest
- backup/restore.ts
- ADDED Requirements
- Design — Sprint 3: CheckpointStore
- 3. Block source and ingest
- migrations
- .slowBlockMs
- T
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- .boolean
- UmbraDB module guide
- backupAtStop
- mutation-per-adapter.mjs
- attempt
- twox.ts
- UmbraDB third-party component inventory (SBOM)
- pack-install.mjs
- path.ts
- Design — CORE-ARCH: the standalone indexer's core architecture
- Performance — design
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- crash-worker.ts
- history
- fn
- .put
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- core-private-source.test.ts
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- Requirements
- ADDED Requirements
- package.json
- ROADMAP.md
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- stryker.conf.json
- Storage Layer Interface Specification
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- Security policy & threat model
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- compilerOptions
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- Design — Sprint 4: Watermarks
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- UmbraDB software supply-chain directory
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Design — Sprint 2: Transaction/Lease
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Tasks — Sprint 4: Watermarks
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
- Proposal — Sprint 1: project setup + TemporalKV
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
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true
- bug-report.md
- feature-request.md
- GC architecture and query-tracing: research findings
- manifest.json
- Vendored ledger builds
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
- post-block-update/oracle/main.rs
- ADDED Requirements
- UmbraDB
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 327 edges
2. `UmbraError` - 301 edges
3. `ModuleDeclaration` - 172 edges
4. `FinalizedLoop` - 120 edges
5. `NodeClient` - 113 edges
6. `InMemoryBlockSource` - 105 edges
7. `Database` - 97 edges
8. `BlockRef` - 94 edges
9. `ReadHandle` - 85 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Review notes` --references--> `JsonValue`  [INFERRED]
  design/design-interfaces.md → src/private/messages.ts
- `Evidence` --references--> `ManualTimers`  [INFERRED]
  docs/issues/00016-heartbeat-above-timer-limit.md → test/node/manual-timers.ts
- `4. Prioritized artifacts (dependency order)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  design/sprint-5-recommendation.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (317 total, 30 thin omitted)

### Community 0 - "admin-harness.ts"
Cohesion: 0.02
Nodes (210): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+202 more)

### Community 1 - "column-rules.ts"
Cohesion: 0.02
Nodes (185): CaptureColumn, CheckedMigration, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, CatalogColumn (+177 more)

### Community 10 - "UmbraError"
Cohesion: 0.03
Nodes (93): LoadedConfig, LoadOptions, PostgresOptions, DatabaseState, ReadDatabaseOptions, ReadOptions, DurabilityProbeOptions, DurabilityViolation (+85 more)

### Community 100 - ".value"
Cohesion: 0.14
Nodes (17): MetadataField, MetadataType, Primitive, ScaleReader, ValueReader, blockTimeOf(), bytesArgument(), decodeChainEvents() (+9 more)

### Community 101 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (26): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+18 more)

### Community 102 - "vendored-ledger-v9.test.ts"
Cohesion: 0.13
Nodes (30): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, freeAll(), runInFreshInstance(), bigCell() (+22 more)

### Community 103 - "release-version.test.ts"
Cohesion: 0.11
Nodes (33): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+25 more)

### Community 104 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 106 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 107 - "browser/build.ts"
Cohesion: 0.09
Nodes (24): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+16 more)

### Community 108 - "core-block-fetch/metadata.ts"
Cohesion: 0.18
Nodes (21): ExtrinsicCall, MetadataPallet, MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, callOf(), callVariants() (+13 more)

### Community 109 - "PrivateTransport"
Cohesion: 0.12
Nodes (8): HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), rowsOf(), unrefTimer()

### Community 11 - "process-admin.ts"
Cohesion: 0.04
Nodes (112): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, RevisionSettings, DigestRow (+104 more)

### Community 110 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 112 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 113 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (21): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+13 more)

### Community 116 - "process-worker.ts"
Cohesion: 0.12
Nodes (21): ConfiguredDatabase, ConfiguredDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, CommittedHeight, PgliteOptions, messageAdmin(), databaseOptions() (+13 more)

### Community 119 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+14 more)

### Community 12 - "db/api.ts"
Cohesion: 0.03
Nodes (81): Database, ReadOnlyDatabase, Settings, TestBackend, TestDatabase, Case, Run, Job (+73 more)

### Community 120 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 121 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 122 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 124 - "node-run.ts"
Cohesion: 0.11
Nodes (18): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, NodeRunResult, databaseOf(), withDevelopmentOptIn(), coreConfiguration() (+10 more)

### Community 127 - "ref_node_url"
Cohesion: 0.10
Nodes (13): Row, failures(), refusal(), thrown(), valueOf(), CORE_SETTINGS, REPOSITORY, CONFIG (+5 more)

### Community 128 - "BlockRef"
Cohesion: 0.15
Nodes (7): BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, failingSource(), flakySource()

### Community 13 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (108): ApplyInput, recordedGenesis, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot (+100 more)

### Community 133 - "version-table.ts"
Cohesion: 0.14
Nodes (24): ConfiguredLedgerTable, LedgerPin, LedgerRow, LedgerSelection, LedgerTableIssue, VersionedBlock, ledgerTableRule(), ledgerTableIssuesOf() (+16 more)

### Community 134 - "node-bridge.ts"
Cohesion: 0.13
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 136 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (14): BackupText, createReadStream(), firstLine(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst() (+6 more)

### Community 137 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.09
Nodes (22): Key, Sql, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap (+14 more)

### Community 138 - "type-check.ts"
Cohesion: 0.16
Nodes (15): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), isRegularFile(), packageType(), typeCheckFile() (+7 more)

### Community 139 - "shims.test.ts"
Cohesion: 0.12
Nodes (14): databaseTarget, crossedError, StartRun, Buffer, Hash, hexOf(), jsonSafe(), createHash() (+6 more)

### Community 14 - "ModuleDeclaration"
Cohesion: 0.03
Nodes (107): ProcessAdminOptions, AdminStarter, CoreChainFacts, privateIntake, RestoreBase, Environment, BackupCommandOptions, BackupOutcome (+99 more)

### Community 141 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 142 - "worker-storage.test.ts"
Cohesion: 0.15
Nodes (15): NodeStore, StoredNode, EngineOptions, StagenetBlockJson, StagenetFixtureJson, Nodes, bytes(), at() (+7 more)

### Community 145 - "HeightRun"
Cohesion: 0.10
Nodes (9): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, WaitsInTransaction (+1 more)

### Community 149 - "run.test.ts"
Cohesion: 0.11
Nodes (14): RunningCommand, statsConfig, write(), adminPortIn(), exitWithin(), headAt(), reachHead(), runHere() (+6 more)

### Community 15 - "validate.ts"
Cohesion: 0.03
Nodes (113): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, HistoryFinding, ConfigRule, CursorRule, EntryRef, Finding (+105 more)

### Community 150 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 151 - "describeNodeStoreExports"
Cohesion: 0.16
Nodes (5): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), sortedHex()

### Community 152 - "InMemoryTransactionHistoryStorage"
Cohesion: 0.16
Nodes (7): MergeEntriesFn, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 154 - "node-source.ts"
Cohesion: 0.11
Nodes (12): CoreBlockItems, BlockLedgerSource, NodeSourceOptions, Prefetch, LedgerBinding, NodeSubscription, PreparedBlock, SourceNodeView (+4 more)

### Community 155 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 158 - "documents.test.ts"
Cohesion: 0.19
Nodes (16): MarkdownLink, TextFile, changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems(), markdownLinks(), notAPath() (+8 more)

### Community 159 - "PortSocket"
Cohesion: 0.18
Nodes (7): PortSocket, pair(), 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix, Contract states and contract logs

### Community 16 - "cbor.ts"
Cohesion: 0.03
Nodes (108): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+100 more)

### Community 167 - "BlockItems"
Cohesion: 0.15
Nodes (9): QueuedBlock, BlockItems, EagerItems, EagerLoop, KeptItems, KeptLoop, reporting(), P (+1 more)

### Community 168 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 17 - "FinalizedLoop"
Cohesion: 0.04
Nodes (56): HeightRange, ResolvedRange, LateUse, Callback, EntryBoundary, ParallelPoint, PointArguments, PointRun (+48 more)

### Community 170 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 175 - "package-identity.test.ts"
Cohesion: 0.27
Nodes (12): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+4 more)

### Community 176 - "ledger-checks.ts"
Cohesion: 0.30
Nodes (14): LedgerEvent, TransactionResult, ledgerItemsSeen, a107Problems(), a99Problems(), blockZeroProblems(), eventRows(), expectedStates() (+6 more)

### Community 177 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 18 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (96): ProcessCondition, ArgType, BlockOptions, CallSpec, RUNTIME, Decoded, FetchSeen, CrashEvent (+88 more)

### Community 181 - "history.property.test.ts"
Cohesion: 0.20
Nodes (11): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+3 more)

### Community 182 - "cli/restore.ts"
Cohesion: 0.20
Nodes (10): RestoreChain, RestoreSeams, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreJob, chainOf(), runRestore() (+2 more)

### Community 188 - "RuntimeMetadata"
Cohesion: 0.21
Nodes (3): MetadataNode, RuntimeMetadata, OwnStateMetadata

### Community 19 - "core-transport.ts"
Cohesion: 0.04
Nodes (93): ResultColumn, Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, Message (+85 more)

### Community 190 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 191 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 2 - "client.test.ts"
Cohesion: 0.02
Nodes (132): Connection, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, Boundary, HandSocket (+124 more)

### Community 20 - "ledger/types.ts"
Cohesion: 0.04
Nodes (78): LoadLedger, TransactionParser, LedgerStateItem, RetainedState, LedgerName, ApplyOutput, ChainOutcome, LedgerPackageOptions (+70 more)

### Community 203 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 205 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 21 - "loop.test.ts"
Cohesion: 0.04
Nodes (87): EntryRange, LockstepWait, LoopEnd, WaitingInRead, Contexts, SilentHalt, Faults, LostCommit (+79 more)

### Community 214 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 22 - "NodeClient"
Cohesion: 0.06
Nodes (65): CoreChainBinding, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter, NodeRuntimeVersion (+57 more)

### Community 220 - "HeldHeight"
Cohesion: 0.28
Nodes (5): CommitOutcome, HeldHeight, Outcomes, AlwaysLost, DropsHeld

### Community 228 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 23 - "backup-fixtures.ts"
Cohesion: 0.05
Nodes (72): CommandHandler, CommandIo, MainProcess, BackupBackend, BackupDatabase, killedRestore, TickerConfig, cliProject (+64 more)

### Community 239 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 24 - "module-api.test.ts"
Cohesion: 0.03
Nodes (77): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ModuleTableOptions, Connection, HeadersArgument, ModuleApiServer (+69 more)

### Community 240 - "builder.negative-control.test.ts"
Cohesion: 0.29
Nodes (3): Failure, Variant, WrongRecording

### Community 25 - ".from"
Cohesion: 0.04
Nodes (73): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+65 more)

### Community 258 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 26 - "LedgerPackage"
Cohesion: 0.05
Nodes (39): LedgerEventKind, LedgerPackage, LedgerTask, LedgerTaskBlock, StateHandle, EvictionRefused, LedgerEngine, LedgerTaskFailed (+31 more)

### Community 27 - ".read"
Cohesion: 0.04
Nodes (76): Chain, ChainOptions, DigestRow, Op, States, TableName, identityRow(), captured() (+68 more)

### Community 28 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (63): Held, PgliteLockUse, PostgresOptions, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport (+55 more)

### Community 29 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (71): Call, SlowStep, TestLoaderData, blockBodyOf(), blockParsedItemOf(), blockParsedOf(), chainHashOf(), coreBlockParsedOnParse() (+63 more)

### Community 3 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (163): InMemoryBlockSource, LoopInput, ProcessHandle, ProcessingEnd, ProcessStatus, SignalTarget, Job, Flaky (+155 more)

### Community 30 - "process-context.test.ts"
Cohesion: 0.05
Nodes (44): Bound, ResolvedGraph, StartedModuleApi, MisuseListener, MisuseReports, ProcessContexts, ProcessContextsInput, ProcessItems (+36 more)

### Community 31 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (63): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+55 more)

### Community 32 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.04
Nodes (55): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+47 more)

### Community 33 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (57): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, bindLedgerTasks(), boundHost(), frozen() (+49 more)

### Community 34 - "api-server.test.ts"
Cohesion: 0.04
Nodes (42): ReadHandle, PointCallbacks, ChainDataAnswer, ChainDataView, HttpHandler, HttpRoute, AddsExtensions, AddsHeaders (+34 more)

### Community 35 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (58): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions, blockHeaderOf(), ledgerVersionOf(), boundLedgerParser() (+50 more)

### Community 36 - "range.ts"
Cohesion: 0.05
Nodes (54): Refusal, TapeBuilder, Arguments, Command, Final, Height, RangeRecording, RangeStats (+46 more)

### Community 37 - "core-private-source.ts"
Cohesion: 0.06
Nodes (46): ChainCheck, ChainCheckInput, ConfiguredGenesis, PrivateBlockSource, PrivateChecks, PrivateShared, PrivateSourceOptions, SourceTransport (+38 more)

### Community 38 - "browser.test.ts"
Cohesion: 0.07
Nodes (58): BrowserBuild, Reachable, RestoreAttempt, PageBackup, pageBench, PageEvent, PageRestore, ProcessName (+50 more)

### Community 39 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (58): ContractStateRow, CoreContractStatesOptions, CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+50 more)

### Community 4 - "chain-placement.test.ts"
Cohesion: 0.03
Nodes (162): BlockEventSource, BodyExtrinsic, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions, ChainTransaction (+154 more)

### Community 40 - "change-capture.ts"
Cohesion: 0.05
Nodes (48): CapturedTable, CaptureState, GuardTableRow, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule (+40 more)

### Community 41 - "backup/backup.ts"
Cohesion: 0.08
Nodes (53): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+45 more)

### Community 42 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (48): TransactionHistoryEntry, PgTransactionHistoryStorage, encodeStoredEntry(), rowToEntry(), reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built) (+40 more)

### Community 43 - "code"
Cohesion: 0.04
Nodes (57): Migration, up(), code(), name, Added, 8. Migration, §2.1 — Building, §2.2 — Evidence for reviews (+49 more)

### Community 44 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (50): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+42 more)

### Community 45 - "order.property.test.ts"
Cohesion: 0.05
Nodes (50): ProcessContext, CallEvent, Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, ids() (+42 more)

### Community 46 - "NodeBlockSource"
Cohesion: 0.08
Nodes (14): HeadWait, NodeBlockSource, NodeBlock, NodeHeader, QueueRunner, EventsRunner, NoWindow, Refetches (+6 more)

### Community 47 - "devnet-upgrade.test.ts"
Cohesion: 0.06
Nodes (46): Side, FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+38 more)

### Community 49 - "node.test.ts"
Cohesion: 0.05
Nodes (17): Metadata, Step, Frame, RawClient, Failure, Variant, TapeClock, expectAnswersByOccurrence() (+9 more)

### Community 5 - "migrate.ts"
Cohesion: 0.03
Nodes (133): BlockWriteHandle, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+125 more)

### Community 50 - "spawnChild"
Cohesion: 0.05
Nodes (45): ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, dockerExec(), guardPid() (+37 more)

### Community 52 - "boundary.test.ts"
Cohesion: 0.08
Nodes (44): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+36 more)

### Community 53 - "height-versioned.test.ts"
Cohesion: 0.05
Nodes (37): cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, Access, Block, BlockFails (+29 more)

### Community 54 - "crash.test.ts"
Cohesion: 0.06
Nodes (40): PointName, CallbackFailure, ProcessReason, ReasonCode, Unwrapped, HeightFailure, Misuse, SlowBlockCondition (+32 more)

### Community 55 - "database-fixtures.ts"
Cohesion: 0.06
Nodes (33): CheckTarget, CliBackend, Snapshot, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase (+25 more)

### Community 56 - "mapping.ts"
Cohesion: 0.07
Nodes (37): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+29 more)

### Community 57 - "ref_node_fs"
Cohesion: 0.05
Nodes (35): Finding, RepositoryFile, Pem, TestCertificates, ReportedTest, canPin(), pinViolations(), repositoryFiles() (+27 more)

### Community 58 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 59 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (30): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+22 more)

### Community 6 - "tape/index.ts"
Cohesion: 0.03
Nodes (119): Recorded, Failure, Variant, Link, TapeBuilderOptions, CompletenessRange, RecordingError, RecordingProblem (+111 more)

### Community 60 - "ledger-sweep.test.ts"
Cohesion: 0.08
Nodes (28): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, NodeBatch, Block, MemoryTables (+20 more)

### Community 61 - "binding.test.ts"
Cohesion: 0.08
Nodes (42): PrivateIntakeOptions, A165Options, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding (+34 more)

### Community 62 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 63 - "builds.ts"
Cohesion: 0.08
Nodes (39): PrivateProcess, PrivateRefusal, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, Pause, Q142Observation (+31 more)

### Community 65 - "ref_node_crypto"
Cohesion: 0.07
Nodes (25): BenchEnv, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer() (+17 more)

### Community 66 - "TransactionHistoryStorage"
Cohesion: 0.05
Nodes (40): TransactionHistoryStorage, Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook (+32 more)

### Community 68 - "ledger/load.ts"
Cohesion: 0.08
Nodes (26): AdapterSpec, LedgerRelease, LedgerReleasePackage, V9Logs, LoadAdapter, AdapterWorkerRequest, loadLedgerPackage(), createV8Adapter() (+18 more)

### Community 7 - "config/history.ts"
Cohesion: 0.03
Nodes (157): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, coreEntry, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry (+149 more)

### Community 70 - "private/backends.ts"
Cohesion: 0.09
Nodes (27): startHashDecision, PrivateBackend, SessionSeen, InstancesOptions, instancesRun, A112Observation, Wiring, startStop() (+19 more)

### Community 71 - "config-hash-checks.ts"
Cohesion: 0.07
Nodes (21): Report, A162Options, a162Run, HeaderSeen, HeldLink, HoldingRelay, ReportRelay, RetargetProxy (+13 more)

### Community 72 - "intake.test.ts"
Cohesion: 0.09
Nodes (28): PrivateSeen, A114Observation, A116Observation, TestLink, A155Observation, Outcome, startPublicCore(), a114Problems() (+20 more)

### Community 73 - "graph.test.ts"
Cohesion: 0.07
Nodes (37): GraphInput, PastFaultCase, RefusalCase, Pipeline, schemaPlan(), resolveGraph(), blockAt(), logsProvider() (+29 more)

### Community 74 - "net.test.ts"
Cohesion: 0.08
Nodes (20): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade (+12 more)

### Community 76 - "Process"
Cohesion: 0.11
Nodes (9): CoreTransport, RetryCode, Process, RetryCondition, messageOf(), namedStartDb(), nodeClientClosed(), pause() (+1 more)

### Community 77 - "version-checks.ts"
Cohesion: 0.11
Nodes (34): CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk, Answers, toHex() (+26 more)

### Community 78 - "lockstep-refusals.test.ts"
Cohesion: 0.10
Nodes (38): LockstepCondition, PublicCore, A118Observation, MismatchObservation, ExpectedWait, WaitSample, hashAt(), inMemoryBlock() (+30 more)

### Community 79 - "page.ts"
Cohesion: 0.06
Nodes (32): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, Scope, CallMethod, FromProcessWorker (+24 more)

### Community 8 - "runner/process.ts"
Cohesion: 0.02
Nodes (110): BlockHeaderItem, BlockItemSource, CoreBlockHeader, ChainSource, NodeWait, WaitingListener, EntryBuilder, builtInNetwork (+102 more)

### Community 81 - "node-format.ts"
Cohesion: 0.12
Nodes (24): Child, Reader, Readable, Reader, TableNode, node(), childKey(), concat() (+16 more)

### Community 82 - "chrome.ts"
Cohesion: 0.09
Nodes (21): Cdp, CdpEvent, ChromeBrowser, ChromeTab, Download, PageRequest, continueTo(), endedText() (+13 more)

### Community 85 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.05
Nodes (39): Absent, 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 1. Executive conclusion, 2.1 Historical implementation baseline (+31 more)

### Community 86 - "version"
Cohesion: 0.06
Nodes (36): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+28 more)

### Community 89 - "validation.ts"
Cohesion: 0.06
Nodes (33): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+25 more)

### Community 9 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (144): RestoreInput, MetadataBlock, RuntimeMetadataEntry, BlockHeader, NodeClientOptions, SourceShared, FixtureRun, ingest (+136 more)

### Community 93 - "networks.ts"
Cohesion: 0.07
Nodes (33): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, Answers (+25 more)

### Community 95 - ".concat"
Cohesion: 0.07
Nodes (23): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+15 more)

### Community 96 - "vitest"
Cohesion: 0.06
Nodes (9): Upstream, filesUnder(), patchesOf(), patchText(), settings, ledgerDir, VERSIONS, CORE_ARCH (+1 more)

### Community 99 - "backup/restore.ts"
Cohesion: 0.12
Nodes (31): PublicIdentity, Checked, PublicSide, RestoreTarget, isBlockLedgerSource(), bytesOf(), configuredGenesisOf(), publicNotStarted() (+23 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 140 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.09
Nodes (20): 4.3 `transactions` — metadata only, raw bytes via blob reference, 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+12 more)

### Community 92 - "3. Block source and ingest"
Cohesion: 0.06
Nodes (32): refused(), hexOf(), When a callback fails, The node on `/status`, 7. Storage helpers, 3. Block source and ingest, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener (+24 more)

### Community 131 - "migrations"
Cohesion: 0.08
Nodes (23): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Migrations, ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser (+15 more)

### Community 146 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 147 - "T"
Cohesion: 0.11
Nodes (20): T(), input(), 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 5. Testable-law deliverable (fast-check + Vitest), 6. On not adding a Merkle/authenticated data structure (+12 more)

### Community 153 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (17): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface (+9 more)

### Community 156 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 160 - "UmbraDB module guide"
Cohesion: 0.11
Nodes (17): params(), Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Private modules, Process items and APIs, Reading through `db` (+9 more)

### Community 171 - "backupAtStop"
Cohesion: 0.14
Nodes (13): backupAtStop(), A backup at the core's stop, A private process and a changed public configuration, Backups, Restoring a backup, The database, UmbraDB operator guide, What a backup holds (+5 more)

### Community 174 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 178 - "attempt"
Cohesion: 0.16
Nodes (13): attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop (+5 more)

### Community 183 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 199 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 204 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 221 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 222 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.25
Nodes (6): 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence, 15. Relation to the existing design documents, 9.2 Browser build (BR), 9. Backups and browser, Design — CORE-ARCH: the standalone indexer's core architecture

### Community 227 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 232 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.29
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 288 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 48 - "history"
Cohesion: 0.05
Nodes (52): integer(), history(), revision(), Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Scenario: A call with an already-aborted signal is rejected before any database work, Scenario: A label given at save time is returned by history and load (+44 more)

### Community 51 - "fn"
Cohesion: 0.04
Nodes (51): fn(), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly (+43 more)

### Community 64 - ".put"
Cohesion: 0.05
Nodes (43): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+35 more)

### Community 84 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (34): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change) (+26 more)

### Community 88 - "core-private-source.test.ts"
Cohesion: 0.06
Nodes (10): height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PRIVATE_CORE_DIGEST, ACK_OF_CORE (+2 more)

### Community 90 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+20 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 117 - "Full-Chain Storage — Design"
Cohesion: 0.07
Nodes (27): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs, 3.5 Dust generation + ledger events (generic) (+19 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 123 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 126 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 129 - "ROADMAP.md"
Cohesion: 0.08
Nodes (18): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+10 more)

### Community 130 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.08
Nodes (18): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Superseded — see `Formal/STORAGE_ALGEBRA.md`, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan (+10 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 135 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 144 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 161 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 162 - "Storage Layer Interface Specification"
Cohesion: 0.12
Nodes (16): 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.1 Transaction/Lease layer (+8 more)

### Community 163 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 164 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 165 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 166 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 169 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 172 - "Security policy & threat model"
Cohesion: 0.13
Nodes (13): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+5 more)

### Community 173 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 179 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 180 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 184 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 185 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 186 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 189 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 193 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.17
Nodes (12): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4.2 — The 1.0.0 tag gate, §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did (+4 more)

### Community 194 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 195 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 196 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 5. Full-sync soak + load-under-concurrent-prune (G10), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring (+3 more)

### Community 197 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 198 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 200 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 201 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 206 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 207 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 208 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 209 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 210 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure, Design — Sprint 2: Transaction/Lease (+1 more)

### Community 211 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 212 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 213 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 215 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 216 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 217 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 218 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 219 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 223 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 224 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 225 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 226 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 230 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 231 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 233 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 234 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 235 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 236 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 237 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 238 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 242 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 243 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 244 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 245 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 246 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 247 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 248 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 249 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 250 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 251 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 252 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 253 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 254 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 255 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 256 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 257 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 259 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 260 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 261 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 262 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 263 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 264 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 265 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 266 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 267 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 268 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 269 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 270 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 271 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 272 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 273 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 274 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 275 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 276 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 277 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 278 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 279 - "Vendored ledger builds"
Cohesion: 0.40
Nodes (4): Rebuilding, Updating a version, Vendored ledger builds, What the patches add

### Community 280 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 281 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 282 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 283 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 284 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 285 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.50
Nodes (4): Requirement: RN-13 SIGTERM stops cleanly, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable, Scenario: SIGTERM while the loop waits on an unreachable node

### Community 286 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 287 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 293 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 294 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 67 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+32 more)

### Community 83 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 91 - "UmbraDB"
Cohesion: 0.05
Nodes (35): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased] (+27 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Requirement: RN-1 The main program is a fixed sequence of points (+27 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8949` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3698 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `admin-harness.ts`, `column-rules.ts`, `client.test.ts`, `InMemoryBlockSource`, `chain-placement.test.ts`, `migrate.ts`, `tape/index.ts`, `config/history.ts`, `runner/process.ts`, `ingest-harness.ts`, `UmbraError`, `process-admin.ts`, `db/api.ts`, `adapter-fixtures.ts`, `ModuleDeclaration`, `validate.ts`, `cbor.ts`, `fetch-fixtures.ts`, `core-transport.ts`, `ledger/types.ts`, `loop.test.ts`, `NodeClient`, `backup-fixtures.ts`, `module-api.test.ts`, `.from`, `.read`, `writer-lock-checks.ts`, `core-block-parsed.ts`, `process-context.test.ts`, `contract-modules.test.ts`, `interfaces/transaction-history-storage.ts`, `ledger/ledger-tasks.test.ts`, `api-server.test.ts`, `core-ledger-state.ts`, `browser.test.ts`, `contract-data-checks.ts`, `change-capture.ts`, `backup/backup.ts`, `slow-block-harness.ts`, `order.property.test.ts`, `devnet-upgrade.test.ts`, `node.test.ts`, `spawnChild`, `boundary.test.ts`, `height-versioned.test.ts`, `crash.test.ts`, `database-fixtures.ts`, `mapping.ts`, `ref_node_fs`, `cold-boot-recovery.integration.test.ts`, `ledger-sweep.test.ts`, `binding.test.ts`, `retirement.test.ts`, `builds.ts`, `ref_node_crypto`, `ledger/load.ts`, `private/backends.ts`, `intake.test.ts`, `graph.test.ts`, `net.test.ts`, `version-checks.ts`, `lockstep-refusals.test.ts`, `node-format.ts`, `core-private-source.test.ts`, `validation.ts`, `networks.ts`, `node-fields-harness.ts`, `vendored-ledger-v9.test.ts`, `release-version.test.ts`, `pg-tx-history-adapter.ts`, `test/postgres/setup.ts`, `browser/build.ts`, `PrivateTransport`, `code-registry.ts`, `Lockstep`, `ws-mutual-tls.test.ts`, `restore-private.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `package.json`, `ref_node_url`, `node-bridge.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `type-check.ts`, `shims.test.ts`, `block-fetch-decode.test.ts`, `worker-storage.test.ts`, `run.test.ts`, `key-handling-checks.ts`, `documents.test.ts`, `BlockItems`, `statementsOf`, `mutation-per-adapter.mjs`, `package-identity.test.ts`, `web-lock.ts`, `history.property.test.ts`, `twox.ts`, `transport-intake.test.ts`, `worker-threads.test.ts`, `builder.negative-control.test.ts`?**
  _High betweenness centrality (0.240) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.019776714513556618 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `BlockRef`, `column-rules.ts`, `admin-harness.ts`, `client.test.ts`, `InMemoryBlockSource`, `migrate.ts`, `version-table.ts`, `config/history.ts`, `runner/process.ts`, `ingest-harness.ts`, `tape/index.ts`, `shims.test.ts`, `process-admin.ts`, `db/api.ts`, `ModuleDeclaration`, `validate.ts`, `cbor.ts`, `FinalizedLoop`, `fetch-fixtures.ts`, `core-transport.ts`, `loop.test.ts`, `NodeClient`, `module-api.test.ts`, `node-source.ts`, `.read`, `writer-lock-checks.ts`, `LedgerPackage`, `process-context.test.ts`, `contract-modules.test.ts`, `UmbraDB module guide`, `ledger/ledger-tasks.test.ts`, `api-server.test.ts`, `core-ledger-state.ts`, `range.ts`, `core-private-source.ts`, `statementsOf`, `backup/backup.ts`, `checkShape`, `backupAtStop`, `change-capture.ts`, `slow-block-harness.ts`, `NodeBlockSource`, `package-identity.test.ts`, `web-lock.ts`, `height-versioned.test.ts`, `cli/restore.ts`, `crash.test.ts`, `mapping.ts`, `graph.ts`, `binding.test.ts`, `private/backends.ts`, `intake.test.ts`, `graph.test.ts`, `sha256`, `version-checks.ts`, `lockstep-refusals.test.ts`, `core-private-source.test.ts`, `validation.ts`, `3. Block source and ingest`, `backup/restore.ts`, `PrivateTransport`, `process-worker.ts`, `ref_node_url`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `column-rules.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.016710875331564987 - nodes in this community are weakly interconnected._