# Graph Report - UmbraDB

## Corpus Check
- 1028 files · ~1,500,085 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10967 nodes · 32487 edges · 361 communities (317 shown, 44 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2600 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `da4db39aed32523f` (1028 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- migrate.ts
- InMemoryBlockSource
- ref_node_fs
- PrivateTransport
- FinalizedLoop
- .concat
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- postgres/transaction-history-storage.ts
- postgres-image.test.ts
- browser/build.ts
- node-fields-harness.ts
- process-worker.ts
- BlockRef
- code-registry.ts
- version.negative-control.test.ts
- Lockstep
- test/postgres/setup.ts
- shims.test.ts
- state-trees.test.ts
- crash.test.ts
- db/errors.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- interfaces/transaction-history-storage.ts
- api-server.ts
- openPglite
- adapter-fixtures.ts
- pglite.ts
- Writer
- PgliteDatabase
- fixtures/configuration.ts
- mapping.ts
- pglite-lock.ts
- ws-mutual-tls.test.ts
- refused-configuration.test.ts
- version-table.ts
- block-fetch-decode.test.ts
- package-identity.test.ts
- lockstep-refusals.test.ts
- column-rules.ts
- transaction-history-storage.property.test.ts
- InMemoryTransactionHistoryStorage
- documents.test.ts
- text.test.ts
- .#process
- core-transport.ts
- FakeNode
- statementsOf
- PortSocket
- process-admin.ts
- config/plain-data.test.ts
- attempt
- read-height.property.test.ts
- validate.ts
- cursor-table.property.test.ts
- web-lock.ts
- Design — Sprint 1: project setup + TemporalKV
- no-indexer-or-wallet-sdk.test.ts
- NodeClient
- Worker
- pglite-outside-reads.ts
- history.property.test.ts
- declaration.ts
- contract-data-checks.ts
- worker-threads-worker.ts
- buffer.ts
- fetch-fixtures.ts
- Connection
- EntryBoundary
- TapeAnswers
- tape/index.ts
- Roadmap for the missing formalization
- .#schedule
- ProcessItems
- stats.ts
- ledger/types.ts
- builder.test.ts
- ledger/plain-data.ts
- worker-threads.test.ts
- ingest-harness.ts
- mutation-evidence.d.mts
- .close
- AsyncLocalStorage
- core-config.test.ts
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- browser.test.ts
- ledger-tapes.ts
- worker-threads-host.ts
- runner/process.ts
- config/history.ts
- transform-checks.ts
- spawnChild
- aborted
- SkipsAfterReconnect
- adapter.ts
- BackupSignals
- CliBackend
- https.ts
- NodeFS
- node-format.ts
- TickerProcess
- admin-harness.ts
- PausesInsideTheHeight
- SkipsLockstep
- WaitingInRead
- ItemsAfterWrite
- FailingAfter
- NeverClears
- ReadHandle
- NoRedelivery
- CommitsTheBoundary
- backup/backup.ts
- NodeBlockSource
- core-ledger-state.ts
- PgTransactionHistoryStorage
- core-block-parsed.ts
- config-check.ts
- process-backends.ts
- .from
- module-tables.ts
- ledger-sweep.test.ts
- restore-private.ts
- cli/command.ts
- range.ts
- loop.ts
- LedgerHost
- slow-block-harness.ts
- vitest
- worker-storage.test.ts
- sweep-tapes.ts
- host.ts
- private/backends.ts
- cbor.ts
- range.test.ts
- column-refusals.test.ts
- chain-process.test.ts
- src/db/postgres.ts
- intake.test.ts
- binding.test.ts
- graph.ts
- boundary.test.ts
- changes.property.test.ts
- version
- writer-lock-checks.ts
- builds.ts
- api-server.test.ts
- retirement.test.ts
- checkShape
- contract-modules.test.ts
- real-tapes.ts
- Process
- net.test.ts
- client.test.ts
- core-settings.ts
- private/lockstep-wait.test.ts
- ledger-tasks-checks.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- cbor.property.test.ts
- networks.ts
- UmbraError
- pg-tx-history-adapter.ts
- page.ts
- version-checks.ts
- release-version.test.ts
- 4. Schema design
- .connected
- .configHash
- ADDED Requirements
- T
- ledger/ledger-tasks.test.ts
- .slowBlockMs
- mapping.test.ts
- mutation-per-adapter.mjs
- fault
- call
- twox.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- UmbraDB third-party component inventory (SBOM)
- facade-merge-loader.ts
- scoped-review-manifest
- refused
- path.ts
- Performance — design
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- parseJsonLossless
- parameterText
- orphan-watcher.mjs
- fresh-instance.mjs
- history
- fn
- code
- .put
- core-private-source.test.ts
- graph.py
- cold-boot-recovery.integration.test.ts
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ROADMAP.md
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Full-Chain Storage — Design
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- Scalability ceilings (v1.0.0)
- ADDED Requirements
- ADDED Requirements
- UmbraDB
- stryker.conf.json
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- Storage Layer Interface Specification
- Roadmap
- UmbraDB module guide
- Security policy & threat model
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- Design — Sprint 4: Watermarks
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- Design — v1.1.0: Quint model checking
- explore.md
- UmbraDB software supply-chain directory
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
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
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 4: Watermarks
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
- 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone
- 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- Problem
- 00023 — The blocks table's height partitions end at 5,000,000
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00026 — A configuration's `core` revisions may name different networks
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true
- 00045 — Mutual TLS does not bind a certificate to an instance id
- 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy
- 00047 — Resource limits are per message or connection, not per service
- 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance
- 00049 — A141's "within 2 s" on PostgreSQL fails once under load
- 00050 — A165's race step on PostgreSQL with a transport failed once under load
- bug-report.md
- feature-request.md
- Tasks — Sprint 1: project setup + TemporalKV
- GC architecture and query-tracing: research findings
- manifest.json
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Requirement: CF-4 Every field is data, operational or secret
- Requirement: PP-2 A private database is bound to one public database
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
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
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json

## God Nodes (most connected - your core abstractions)
1. `vitest` - 332 edges
2. `UmbraError` - 303 edges
3. `ModuleDeclaration` - 173 edges
4. `FinalizedLoop` - 131 edges
5. `NodeClient` - 113 edges
6. `InMemoryBlockSource` - 110 edges
7. `Database` - 97 edges
8. `BlockRef` - 94 edges
9. `ReadHandle` - 85 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
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

## Communities (361 total, 44 thin omitted)

### Community 0 - "migrate.ts"
Cohesion: 0.02
Nodes (167): ReadOptions, Transaction, CapturedTable, AppliedRow, Runnable, Settling, StartupInput, CheckedMigration (+159 more)

### Community 1 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (155): Database, ReadOnlyDatabase, EntryRange, GraphInput, ResolvedGraph, InMemoryBlockSource, LockstepWait, LoopInput (+147 more)

### Community 10 - "ref_node_fs"
Cohesion: 0.05
Nodes (89): BackupBackend, BackupDatabase, killedRestore, TickerConfig, BackupOnSignal, LoopClass, Pausable, PausableConfig (+81 more)

### Community 100 - "PrivateTransport"
Cohesion: 0.11
Nodes (10): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), readFailure(), reject(), resolve() (+2 more)

### Community 101 - "FinalizedLoop"
Cohesion: 0.11
Nodes (8): FinalizedLoop, Startup, SkipsUnseen, WaitsInTransaction, DropsHeld, NeverClears, runFinalized(), runWatched()

### Community 102 - ".concat"
Cohesion: 0.08
Nodes (20): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+12 more)

### Community 103 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.07
Nodes (24): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+16 more)

### Community 104 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (20): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow() (+12 more)

### Community 105 - "postgres-image.test.ts"
Cohesion: 0.11
Nodes (23): BenchEnv, RepositoryFile, canPin(), pinViolations(), repositoryFiles(), dockerIndependentOracles(), fail(), main() (+15 more)

### Community 106 - "browser/build.ts"
Cohesion: 0.09
Nodes (24): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+16 more)

### Community 108 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (23): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a168Problems(), a168Run() (+15 more)

### Community 109 - "process-worker.ts"
Cohesion: 0.13
Nodes (22): ProcessView, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, openedProcess, messageAdmin() (+14 more)

### Community 11 - "BlockRef"
Cohesion: 0.03
Nodes (75): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, QueuedBlock, LedgerBinding, BlockItems, LateUse (+67 more)

### Community 110 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 112 - "version.negative-control.test.ts"
Cohesion: 0.12
Nodes (12): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, MetadataSelector, Select, OwnStateMetadata, contentStateOf() (+4 more)

### Community 113 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 114 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 115 - "shims.test.ts"
Cohesion: 0.11
Nodes (14): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, Buffer, Hash, sha256, PgliteOptions, databaseOptions() (+6 more)

### Community 116 - "state-trees.test.ts"
Cohesion: 0.09
Nodes (23): OracleState, OracleVersion, stateBytes(), stateTreesProblems(), written(), exported(), free(), ledger() (+15 more)

### Community 118 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 12 - "db/errors.ts"
Cohesion: 0.03
Nodes (79): PostgresOptions, CommittedHeight, ReadTimeoutSetting, ErrorCode, ErrorDetails, Snapshot, Settings, TestBackend (+71 more)

### Community 120 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 121 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 122 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 124 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (19): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, EntryContentSchema, EntryLifecycleSchema (+11 more)

### Community 126 - "api-server.ts"
Cohesion: 0.11
Nodes (24): HeadersArgument, ModuleApiServer, ModuleApiServerOptions, answerHead(), coreHeaders(), coreHeadersResponse(), isCoreHeader(), listenModuleApi() (+16 more)

### Community 128 - "openPglite"
Cohesion: 0.11
Nodes (20): ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresOptions, Job, open(), pgliteNeedsDevelopmentOptIn() (+12 more)

### Community 13 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (99): DeployTx, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+91 more)

### Community 130 - "pglite.ts"
Cohesion: 0.09
Nodes (17): Job, Outcome, ServerErrorFields, Job, statementRefused(), classifyPgliteError(), nestedCall(), classifyDriverError() (+9 more)

### Community 131 - "Writer"
Cohesion: 0.12
Nodes (7): BoundedRead, Session, Writer, commitRolledBack(), queryTimeout(), allowMultiStatement(), rollBack()

### Community 134 - "PgliteDatabase"
Cohesion: 0.18
Nodes (5): JobQueue, PgliteDatabase, handleClosed(), failedEarlier(), openOn()

### Community 136 - "fixtures/configuration.ts"
Cohesion: 0.12
Nodes (17): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration() (+9 more)

### Community 137 - "mapping.ts"
Cohesion: 0.14
Nodes (21): ResultColumn, ResultType, isInfinity(), malformed(), malformedArray(), parseArrayText(), parseBigint(), parseBoolean() (+13 more)

### Community 138 - "pglite-lock.ts"
Cohesion: 0.15
Nodes (18): Held, PgliteLockUse, Job, acquirePgliteLock(), directoryPath(), lockHeld(), openFailed(), pgliteLockFile() (+10 more)

### Community 139 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (18): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+10 more)

### Community 14 - "refused-configuration.test.ts"
Cohesion: 0.03
Nodes (102): ProcessConfig, AdminRun, Answered, gate, Observation, Start, Validator, Refusal (+94 more)

### Community 144 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 147 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+9 more)

### Community 148 - "package-identity.test.ts"
Cohesion: 0.16
Nodes (18): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+10 more)

### Community 149 - "lockstep-refusals.test.ts"
Cohesion: 0.20
Nodes (19): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+11 more)

### Community 15 - "column-rules.ts"
Cohesion: 0.02
Nodes (100): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+92 more)

### Community 150 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 151 - "InMemoryTransactionHistoryStorage"
Cohesion: 0.16
Nodes (7): MergeEntriesFn, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 155 - "documents.test.ts"
Cohesion: 0.19
Nodes (16): MarkdownLink, TextFile, changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems(), markdownLinks(), notAPath() (+8 more)

### Community 156 - "text.test.ts"
Cohesion: 0.16
Nodes (9): BackupText, createReadStream(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir (+1 more)

### Community 159 - ".#process"
Cohesion: 0.12
Nodes (5): LoopObserver, cursorText(), isBlock(), isRetryable(), sameBytes()

### Community 16 - "core-transport.ts"
Cohesion: 0.03
Nodes (95): Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, Message, MessageFault (+87 more)

### Community 167 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 168 - "PortSocket"
Cohesion: 0.21
Nodes (6): PortSocket, pair(), 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 17 - "process-admin.ts"
Cohesion: 0.04
Nodes (92): ConfigFacts, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter (+84 more)

### Community 172 - "config/plain-data.test.ts"
Cohesion: 0.16
Nodes (9): Row, plainDataWith(), failures(), refusal(), thrown(), valueOf(), A26, files (+1 more)

### Community 174 - "attempt"
Cohesion: 0.15
Nodes (14): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+6 more)

### Community 178 - "read-height.property.test.ts"
Cohesion: 0.20
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+2 more)

### Community 18 - "validate.ts"
Cohesion: 0.03
Nodes (97): coreEntry, RedactionForms, SecretForm, TextPattern, ConfigRule, CursorRule, EntryRef, Finding (+89 more)

### Community 180 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 181 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 182 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.15
Nodes (13): Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4a. Error translation (`src/postgres/errors.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV (+5 more)

### Community 189 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 19 - "NodeClient"
Cohesion: 0.05
Nodes (67): NodeSourceOptions, CoreChainBinding, HeadSubscriber, NodeCallOptions, NodeClient, Pending, State, Subscription (+59 more)

### Community 197 - "pglite-outside-reads.ts"
Cohesion: 0.28
Nodes (9): LoadOutcome, OutsideRead, Traced, expectNoOutsideReads(), outsideReads(), runUnderReadLoad(), turn(), windows() (+1 more)

### Community 198 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 2 - "declaration.ts"
Cohesion: 0.03
Nodes (145): OpenedFacts, RestoreBase, ConfigCheckOptions, ConfigHashRow, HistoryCheck, HistoryInput, HistoryRule, SchemaWriteHandle (+137 more)

### Community 20 - "contract-data-checks.ts"
Cohesion: 0.04
Nodes (95): CoreContractLogsFastOptions, UnsureLog, UnsureReason, CoreContractLogsFullOptions, ContractStateRow, CoreContractStatesOptions, Manifest, Restored (+87 more)

### Community 200 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 201 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 21 - "fetch-fixtures.ts"
Cohesion: 0.05
Nodes (95): ProcessCondition, Scenario, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded (+87 more)

### Community 215 - "Connection"
Cohesion: 0.35
Nodes (4): Connection, errorMessage(), encodeJson(), hex()

### Community 216 - "EntryBoundary"
Cohesion: 0.22
Nodes (3): EntryBoundary, SkipsStartAtRestart, StartsAtEveryRevision

### Community 217 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 22 - "tape/index.ts"
Cohesion: 0.05
Nodes (58): Link, TapeBuilderOptions, RecordingProblem, readRequest, RequestId, Json, NotJsonError, Connection (+50 more)

### Community 220 - "Roadmap for the missing formalization"
Cohesion: 0.20
Nodes (9): Key, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec (+1 more)

### Community 227 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 23 - "ledger/types.ts"
Cohesion: 0.05
Nodes (68): LoadLedger, TransactionParser, LedgerStateItem, LedgerName, AdapterSpec, LedgerRelease, LedgerReleasePackage, ApplyInput (+60 more)

### Community 24 - "builder.test.ts"
Cohesion: 0.04
Nodes (45): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+37 more)

### Community 242 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 25 - "ingest-harness.ts"
Cohesion: 0.05
Nodes (82): RestoreInput, ingest, IngestOptions, SourceClass, watched, Call, SeenLoad, RestartEvent (+74 more)

### Community 253 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 254 - ".close"
Cohesion: 0.33
Nodes (3): Outage, quietConnect(), withNode()

### Community 26 - "core-config.test.ts"
Cohesion: 0.04
Nodes (68): adminRoutes, AdminStartOptions, AdminEndpoint, AdminPart, ReadinessFacts, CommandBuildOptions, ProcessState, StatusFacts (+60 more)

### Community 261 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 27 - "browser.test.ts"
Cohesion: 0.05
Nodes (74): BrowserBuild, Reachable, RestoreAttempt, PageBackup, pageBench, PageEvent, PageRestore, ProcessName (+66 more)

### Community 28 - "ledger-tapes.ts"
Cohesion: 0.05
Nodes (85): BlockSpec, EventSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+77 more)

### Community 280 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 29 - "runner/process.ts"
Cohesion: 0.04
Nodes (57): Bound, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait, WaitingListener, LedgerTable, RetryCode (+49 more)

### Community 3 - "config/history.ts"
Cohesion: 0.02
Nodes (147): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder (+139 more)

### Community 30 - "transform-checks.ts"
Cohesion: 0.05
Nodes (70): Failure, Variant, TapeError, TapeProblem, TransformError, TransformProblem, DisconnectRecord, FaultRecord (+62 more)

### Community 31 - "spawnChild"
Cohesion: 0.03
Nodes (72): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+64 more)

### Community 311 - "aborted"
Cohesion: 0.40
Nodes (3): DoesNotHold, EndsTheRun, aborted()

### Community 32 - "adapter.ts"
Cohesion: 0.04
Nodes (68): ContractLog, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+60 more)

### Community 33 - "node-format.ts"
Cohesion: 0.06
Nodes (56): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+48 more)

### Community 34 - "admin-harness.ts"
Cohesion: 0.05
Nodes (63): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminAnswer, AdminSnapshot, AdminView (+55 more)

### Community 35 - "ReadHandle"
Cohesion: 0.05
Nodes (44): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, Migration (+36 more)

### Community 36 - "backup/backup.ts"
Cohesion: 0.06
Nodes (64): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, ManifestHistoryRow, ManifestMigration, ManifestTool (+56 more)

### Community 37 - "NodeBlockSource"
Cohesion: 0.05
Nodes (25): HeadWait, NodeBlockSource, Prefetch, NodeHeader, PreparedBlock, QueueRunner, EventsRunner, NoWindow (+17 more)

### Community 38 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (60): RetainedState, retainedStates, CoreRevision, blockHeaderOf(), ledgerVersionOf(), boundLedgerParser(), workerParser(), applyBlock() (+52 more)

### Community 39 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (57): TransactionHistoryEntry, TransactionHistoryStorage, PgTransactionHistoryStorage, encodeStoredEntry(), rowToEntry(), Added, 1. Decisive scope, 2. Live-sync conformance test plan (+49 more)

### Community 4 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (121): BlockEventSource, BodyExtrinsic, ExtrinsicCall, BlockBody, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry (+113 more)

### Community 40 - "config-check.ts"
Cohesion: 0.04
Nodes (54): CheckFinding, CheckStep, ConfigCheckReport, StepName, StepReport, StepStatus, DatabaseState, TypeCheckFinding (+46 more)

### Community 41 - "process-backends.ts"
Cohesion: 0.06
Nodes (46): A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore (+38 more)

### Community 42 - ".from"
Cohesion: 0.05
Nodes (61): Json, recordedGenesis, Side, FoundTape, a91Problems(), a92Problems(), a93Problems(), parsedRows() (+53 more)

### Community 43 - "module-tables.ts"
Cohesion: 0.05
Nodes (52): CaptureColumn, CaptureState, CanonicalEncodingFailure, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTableOptions, PageOptions (+44 more)

### Community 45 - "ledger-sweep.test.ts"
Cohesion: 0.06
Nodes (31): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, ChildReader, NodeBatch, Block (+23 more)

### Community 46 - "restore-private.ts"
Cohesion: 0.06
Nodes (49): privateIntake, RestoreOutcome, RunOptions, SignalSource, stopSignal, LoadOptions, FileProcess, privateBackup (+41 more)

### Community 47 - "cli/command.ts"
Cohesion: 0.06
Nodes (45): CommandHandler, CommandIo, MainProcess, CommandResult, RunningCommand, statsConfig, backupArguments(), backupCommand() (+37 more)

### Community 49 - "range.ts"
Cohesion: 0.05
Nodes (53): NodeSubscription, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange (+45 more)

### Community 5 - "loop.ts"
Cohesion: 0.03
Nodes (113): ConfigFinding, PointName, HeightRange, Callback, CallbackFailure, ParallelPoint, PointArguments, PointRun (+105 more)

### Community 50 - "LedgerHost"
Cohesion: 0.06
Nodes (35): LedgerHost, LedgerWorkerFailure, NodeDatabase, NodeReader, SlowStep, TestLoaderData, isEvictionRefused(), errorOf() (+27 more)

### Community 51 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (49): BlockItemSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+41 more)

### Community 52 - "vitest"
Cohesion: 0.05
Nodes (39): Lockfile, Manifest, Upstream, Leftover, RemovedName, ReportedTest, filesUnder(), patchesOf() (+31 more)

### Community 53 - "worker-storage.test.ts"
Cohesion: 0.09
Nodes (23): LedgerTask, NodeStore, StoredNode, EngineOptions, LedgerEngine, LedgerTaskFailed, Nodes, hexOf() (+15 more)

### Community 54 - "sweep-tapes.ts"
Cohesion: 0.09
Nodes (49): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData (+41 more)

### Community 55 - "host.ts"
Cohesion: 0.06
Nodes (38): LedgerLoader, LedgerWorkerModule, InThreadLedgerOptions, LedgerActivity, LedgerWorkerOptions, ParseRequest, Pending, SentParses (+30 more)

### Community 56 - "private/backends.ts"
Cohesion: 0.07
Nodes (34): PrivateBackend, SessionSeen, PrivateProcess, A162Options, a162Run, HeaderSeen, InstancesOptions, instancesRun (+26 more)

### Community 57 - "cbor.ts"
Cohesion: 0.08
Nodes (46): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+38 more)

### Community 58 - "range.test.ts"
Cohesion: 0.05
Nodes (27): ScriptedNode, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, RangeOptions, quietConnect() (+19 more)

### Community 59 - "column-refusals.test.ts"
Cohesion: 0.07
Nodes (30): ModuleTable, DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase(), hashOf() (+22 more)

### Community 6 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (114): ProcessHandle, ProcessStatus, Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal (+106 more)

### Community 60 - "src/db/postgres.ts"
Cohesion: 0.08
Nodes (41): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, DriverError, Outcome, Role, WriterSession (+33 more)

### Community 61 - "intake.test.ts"
Cohesion: 0.09
Nodes (40): PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation, A116Observation (+32 more)

### Community 63 - "binding.test.ts"
Cohesion: 0.07
Nodes (42): startHashDecision, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding, Created (+34 more)

### Community 64 - "graph.ts"
Cohesion: 0.07
Nodes (49): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+41 more)

### Community 65 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+34 more)

### Community 66 - "changes.property.test.ts"
Cohesion: 0.06
Nodes (44): ChangeKind, tableChanges, TouchedRow, Op, States, TableName, digestBlock(), encodeCanonical() (+36 more)

### Community 67 - "version"
Cohesion: 0.05
Nodes (46): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Scenario: The kv_current HOT ratio is measured and recorded under the soak workload, Scenario: The kv_current table reports fillfactor=90 after migration, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`) (+38 more)

### Community 68 - "writer-lock-checks.ts"
Cohesion: 0.11
Nodes (36): WriterProcess, WorkerEvent, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf(), startWriterProcess() (+28 more)

### Community 69 - "builds.ts"
Cohesion: 0.07
Nodes (34): PrivateIntakeOptions, PublicWakes, A165Options, PrivateOptions, PrivateRefusal, Pause, Q142Observation, A155Observation (+26 more)

### Community 7 - "api-server.test.ts"
Cohesion: 0.03
Nodes (101): ModuleApiServer, ModuleApiStart, StartedModuleApi, ModuleApiStart, StartedModuleApi, ChainDataAnswer, ChainDataView, LoopEnd (+93 more)

### Community 70 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 72 - "checkShape"
Cohesion: 0.07
Nodes (36): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+28 more)

### Community 73 - "contract-modules.test.ts"
Cohesion: 0.07
Nodes (34): FastLogReader, LogSite, Program, V9Raw, LogItem, TransactionResult, VmLog, Freeable (+26 more)

### Community 74 - "real-tapes.ts"
Cohesion: 0.08
Nodes (35): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+27 more)

### Community 76 - "Process"
Cohesion: 0.10
Nodes (7): CoreTransport, PauseHold, Process, SignalTarget, messageOf(), nodeClientClosed(), nodeSignals()

### Community 79 - "net.test.ts"
Cohesion: 0.08
Nodes (20): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade (+12 more)

### Community 8 - "client.test.ts"
Cohesion: 0.03
Nodes (76): Connection, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket (+68 more)

### Community 80 - "core-settings.ts"
Cohesion: 0.06
Nodes (37): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+29 more)

### Community 82 - "private/lockstep-wait.test.ts"
Cohesion: 0.08
Nodes (21): Report, ExpectedWait, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, a117Problems(), firstWait() (+13 more)

### Community 83 - "ledger-tasks-checks.ts"
Cohesion: 0.10
Nodes (33): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, ProcessBackend, countMainThreadParses(), plainWatchModule() (+25 more)

### Community 85 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.05
Nodes (39): Absent, 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 1. Executive conclusion, 2.1 Historical implementation baseline (+31 more)

### Community 88 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (35): CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, hex() (+27 more)

### Community 89 - "networks.ts"
Cohesion: 0.07
Nodes (34): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+26 more)

### Community 9 - "UmbraError"
Cohesion: 0.04
Nodes (103): LoadedConfig, LoadOptions, ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, PrivateShared, PrivateSourceOptions (+95 more)

### Community 93 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (25): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+17 more)

### Community 96 - "page.ts"
Cohesion: 0.07
Nodes (28): PageState, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog(), backUp(), beginCore() (+20 more)

### Community 97 - "version-checks.ts"
Cohesion: 0.14
Nodes (28): Boundary, CallRecord, CountingNode, UpgradeCase, Walk, Answers, toHex(), H() (+20 more)

### Community 98 - "release-version.test.ts"
Cohesion: 0.11
Nodes (33): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+25 more)

### Community 170 - "4. Schema design"
Cohesion: 0.14
Nodes (14): 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design, v4 rewrite — the rollover runbook, rebuilt from four reproduced failures, run end-to-end for real (+6 more)

### Community 212 - ".connected"
Cohesion: 0.22
Nodes (7): A private process and a changed public configuration, The database, The node on `/status`, UmbraDB operator guide, 7. Storage helpers, Requirement: AE-5 `/status` and `/config` contents, Scenario: Before the first block

### Community 263 - ".configHash"
Cohesion: 0.33
Nodes (5): Private modules, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration

### Community 111 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): 2. Database API, ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+20 more)

### Community 123 - "T"
Cohesion: 0.09
Nodes (24): n(), T(), input(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside (+16 more)

### Community 127 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.10
Nodes (20): boundHost(), frozen(), resultsOf(), withItems(), withLedgerTaskPoints(), withLedgerTasks(), applyBlock(), at() (+12 more)

### Community 145 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 158 - "mapping.test.ts"
Cohesion: 0.15
Nodes (7): mapRows(), mapValue(), oid(), identity(), RESULT_COLUMNS, RESULT_TYPES, RFC-3339

### Community 179 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 183 - "fault"
Cohesion: 0.14
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 188 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 194 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.15
Nodes (11): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 3. Modules (+3 more)

### Community 202 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.17
Nodes (11): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+3 more)

### Community 203 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 210 - "scoped-review-manifest"
Cohesion: 0.20
Nodes (10): explain(), explainRefusal(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation (+2 more)

### Community 211 - "refused"
Cohesion: 0.22
Nodes (11): refused(), cursorRead(), following(), When a callback fails, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Scenario: A fault of the build's declarations ends the process, Scenario: A refused configuration ends the process (+3 more)

### Community 236 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 241 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 246 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 258 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 276 - "parameterText"
Cohesion: 0.47
Nodes (6): arrayLiteral(), hexOf(), invalidParameter(), isPlainObject(), jsonText(), parameterText()

### Community 277 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 312 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 44 - "history"
Cohesion: 0.04
Nodes (62): history(), revision(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+54 more)

### Community 48 - "fn"
Cohesion: 0.04
Nodes (59): fn(), 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure (+51 more)

### Community 62 - "code"
Cohesion: 0.04
Nodes (48): up(), code(), name, 8. Migration, §2.4 — Public surface, contracts, and DX (G1–G4, G20), 15. Relation to the existing design documents, Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface (+40 more)

### Community 71 - ".put"
Cohesion: 0.05
Nodes (43): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+35 more)

### Community 87 - "core-private-source.test.ts"
Cohesion: 0.06
Nodes (11): height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), CORE_PRIVATE_SOURCE_MIGRATIONS, PUBLIC_POLL_MS (+3 more)

### Community 90 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 95 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (22): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), isPlainObject(), mergeSections(), referenceMergeEntries() (+14 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+23 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 132 - "ROADMAP.md"
Cohesion: 0.08
Nodes (18): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+10 more)

### Community 133 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 135 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: one storage instance is bound to exactly one wallet at construction, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract (+15 more)

### Community 141 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.09
Nodes (17): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+9 more)

### Community 142 - "Full-Chain Storage — Design"
Cohesion: 0.09
Nodes (21): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+13 more)

### Community 143 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need, Requirement: PP-6 Lockstep instances process each height at that height (+12 more)

### Community 152 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.11
Nodes (16): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased] (+8 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 157 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 160 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 162 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (17): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+9 more)

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

### Community 169 - "Storage Layer Interface Specification"
Cohesion: 0.12
Nodes (15): 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.1 Transaction/Lease layer (+7 more)

### Community 171 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 173 - "UmbraDB module guide"
Cohesion: 0.13
Nodes (14): Contract states and contract logs, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Reading through `db`, Running a module with the `umbradb` command, Start and stop heights (+6 more)

### Community 175 - "Security policy & threat model"
Cohesion: 0.13
Nodes (13): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+5 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+6 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 184 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 185 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 191 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 192 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 193 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 196 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 199 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 204 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 205 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 206 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 207 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 208 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 209 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 213 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 214 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.18
Nodes (10): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds, 8. CI (+2 more)

### Community 218 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 219 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 221 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 222 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 223 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 224 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 228 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 229 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 230 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 231 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.22
Nodes (8): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Problem, Suggested fix, Suggested fix

### Community 232 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 233 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 234 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 2. Envelope module (Pg-only — required gate), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 235 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 237 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 238 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 239 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 240 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 244 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 245 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 247 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 248 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 249 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 250 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 251 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 252 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 256 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 257 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 259 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 260 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 262 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 264 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 265 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 266 - "Proposal — Sprint 4: Watermarks"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes, Why

### Community 267 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 268 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 269 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 270 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 271 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 272 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 273 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 274 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 275 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 278 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 279 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 281 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 282 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 283 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 284 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 285 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 286 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 287 - "00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone"
Cohesion: 0.40
Nodes (4): 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone, Problem, Resolution, Suggested fix

### Community 288 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 289 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 290 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 291 - "Problem"
Cohesion: 0.40
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 292 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 293 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 294 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 295 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 296 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 297 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 298 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 299 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 300 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 301 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 302 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 303 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 304 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 305 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 306 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 307 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 308 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 309 - "Tasks — Sprint 1: project setup + TemporalKV"
Cohesion: 0.40
Nodes (4): 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV

### Community 310 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 314 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 315 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.50
Nodes (3): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Problem, Suggested fix

### Community 316 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 317 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 318 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 319 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 320 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 321 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 322 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.50
Nodes (4): Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases

### Community 323 - "Requirement: PP-2 A private database is bound to one public database"
Cohesion: 0.50
Nodes (4): Requirement: PP-2 A private database is bound to one public database, Scenario: Configured for another network, Scenario: Pointed at another public database, Scenario: The public core never started

### Community 324 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 325 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 75 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 84 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-16 Chain-data reads name their view and height, Requirement: RN-1 The main program is a fixed sequence of points (+29 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+29 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 99 - "package.json"
Cohesion: 0.06
Nodes (33): bin, umbradb, bugs, url, description, optional, engines, node (+25 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3752 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `migrate.ts`, `InMemoryBlockSource`, `declaration.ts`, `config/history.ts`, `core-block-parsed.ts`, `loop.ts`, `chain-process.test.ts`, `api-server.test.ts`, `client.test.ts`, `ref_node_fs`, `BlockRef`, `db/errors.ts`, `adapter-fixtures.ts`, `refused-configuration.test.ts`, `column-rules.ts`, `core-transport.ts`, `process-admin.ts`, `validate.ts`, `NodeClient`, `contract-data-checks.ts`, `fetch-fixtures.ts`, `tape/index.ts`, `ledger/types.ts`, `builder.test.ts`, `ingest-harness.ts`, `core-config.test.ts`, `browser.test.ts`, `ledger-tapes.ts`, `runner/process.ts`, `transform-checks.ts`, `spawnChild`, `adapter.ts`, `node-format.ts`, `admin-harness.ts`, `ReadHandle`, `backup/backup.ts`, `NodeBlockSource`, `core-ledger-state.ts`, `config-check.ts`, `process-backends.ts`, `.from`, `module-tables.ts`, `ledger-sweep.test.ts`, `restore-private.ts`, `cli/command.ts`, `LedgerHost`, `slow-block-harness.ts`, `worker-storage.test.ts`, `sweep-tapes.ts`, `host.ts`, `private/backends.ts`, `range.test.ts`, `column-refusals.test.ts`, `src/db/postgres.ts`, `intake.test.ts`, `binding.test.ts`, `boundary.test.ts`, `changes.property.test.ts`, `writer-lock-checks.ts`, `builds.ts`, `retirement.test.ts`, `contract-modules.test.ts`, `real-tapes.ts`, `net.test.ts`, `core-settings.ts`, `private/lockstep-wait.test.ts`, `ledger-tasks-checks.ts`, `core-private-source.test.ts`, `cbor.property.test.ts`, `networks.ts`, `pg-tx-history-adapter.ts`, `cold-boot-recovery.integration.test.ts`, `version-checks.ts`, `release-version.test.ts`, `package.json`, `postgres/transaction-history-storage.ts`, `postgres-image.test.ts`, `browser/build.ts`, `node-fields-harness.ts`, `code-registry.ts`, `version.negative-control.test.ts`, `Lockstep`, `test/postgres/setup.ts`, `shims.test.ts`, `state-trees.test.ts`, `crash.test.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `ledger/ledger-tasks.test.ts`, `openPglite`, `pglite.ts`, `ws-mutual-tls.test.ts`, `block-fetch-decode.test.ts`, `package-identity.test.ts`, `lockstep-refusals.test.ts`, `transaction-history-storage.property.test.ts`, `documents.test.ts`, `text.test.ts`, `mapping.test.ts`, `statementsOf`, `config/plain-data.test.ts`, `read-height.property.test.ts`, `mutation-per-adapter.mjs`, `cursor-table.property.test.ts`, `web-lock.ts`, `excluded-not-exported.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `pglite-outside-reads.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `worker-threads.test.ts`?**
  _High betweenness centrality (0.241) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.019230769230769232 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `openPglite`, `migrate.ts`, `pglite.ts`, `config/history.ts`, `Writer`, `loop.ts`, `PgliteDatabase`, `api-server.test.ts`, `chain-process.test.ts`, `mapping.ts`, `pglite-lock.ts`, `BlockRef`, `db/errors.ts`, `client.test.ts`, `refused-configuration.test.ts`, `declaration.ts`, `version-table.ts`, `core-transport.ts`, `validate.ts`, `NodeClient`, `contract-data-checks.ts`, `parameterText`, `package-identity.test.ts`, `process-admin.ts`, `fetch-fixtures.ts`, `ingest-harness.ts`, `core-config.test.ts`, `lockstep-refusals.test.ts`, `tape/index.ts`, `runner/process.ts`, `mapping.test.ts`, `InMemoryBlockSource`, `transform-checks.ts`, `ReadHandle`, `backup/backup.ts`, `NodeBlockSource`, `core-ledger-state.ts`, `statementsOf`, `config-check.ts`, `module-tables.ts`, `config/plain-data.test.ts`, `UmbraDB module guide`, `restore-private.ts`, `range.ts`, `ref_node_fs`, `slow-block-harness.ts`, `web-lock.ts`, `sweep-tapes.ts`, `aborted`, `cbor.ts`, `src/db/postgres.ts`, `binding.test.ts`, `graph.ts`, `changes.property.test.ts`, `writer-lock-checks.ts`, `builds.ts`, `checkShape`, `core-private-source.test.ts`, `version-checks.ts`, `PrivateTransport`, `FinalizedLoop`, `version.negative-control.test.ts`, `shims.test.ts`, `ledger/types.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `InMemoryBlockSource` be split into smaller, more focused modules?**
  _Cohesion score 0.025290105412348305 - nodes in this community are weakly interconnected._