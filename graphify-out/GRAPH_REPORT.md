# Graph Report - UmbraDB

## Corpus Check
- 1000 files · ~1,469,948 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10592 nodes · 30966 edges · 334 communities (297 shown, 37 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2474 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `bcfcb45522b32214` (1000 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- config/history.ts
- admin-harness.ts
- tape/index.ts
- order.property.test.ts
- code-registry.ts
- browser/build.ts
- core-chain-events.ts
- postgres/transaction-history-storage.ts
- Lockstep
- adapter-fixtures.ts
- private/lockstep-wait.test.ts
- child-processes.test.ts
- containers.test.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- crash.test.ts
- fixtures/configuration.ts
- pg-tx-history-adapter.ts
- UmbraError
- HeightRun
- ProcessContexts
- test/postgres/setup.ts
- shims.test.ts
- client.test.ts
- block-fetch-decode.test.ts
- core-block-fetch/metadata.ts
- key-handling-checks.ts
- PortSocket
- childRefKeys
- ReadHandle
- lockstep-refusals.test.ts
- postgres-image.test.ts
- describeNodeStoreExports
- JsonValue
- backup/restore.ts
- FakeNode
- ws-mutual-tls.test.ts
- contract-data-checks.ts
- transcripts.ts
- statementsOf
- ChromeTab
- type-check.ts
- browser-harness.ts
- chrome.ts
- web-lock.ts
- .from
- Design — Sprint 1: project setup + TemporalKV
- catalog.ts
- read-height.property.test.ts
- launchPrivate
- no-indexer-or-wallet-sdk.test.ts
- worker-threads.test.ts
- host.ts
- midnight-env — reproducible PREPROD dev environment
- history.property.test.ts
- worker-threads-worker.ts
- buffer.ts
- Worker
- range.ts
- ref_node_fs
- loop.test.ts
- ledger/plain-data.test.ts
- sha256
- Roadmap for the missing formalization
- api-server.test.ts
- extrinsics.ts
- transport-intake.test.ts
- stats.ts
- page-server.ts
- checkParent
- HeldHeight
- .name
- builder.test.ts
- vendored-ledger-files.test.ts
- writer-lock-checks.ts
- mutation-evidence.d.mts
- child-processes.parent.ts
- AsyncLocalStorage
- core-ledger-state.ts
- intake.test.ts
- CrashWorkerHandle
- FinalizedLoop
- PgTransactionHistoryStorage
- core-transport.ts
- exitWithin
- ingest-harness.ts
- NodeBlockSource
- SignalSource
- CliBackend
- https.ts
- NodeFS
- ledger/ledger-tasks.test.ts
- LedgerPackage
- transform-checks.ts
- backup/backup.ts
- declaration
- core-block-parsed.ts
- client.ts
- version-checks.ts
- module-tables.ts
- ledger/types.ts
- chain-process.test.ts
- validation.test.ts
- .#open
- column-rules.test.ts
- networks.ts
- process-harness.ts
- slow-block-harness.ts
- PointName
- runner/process.ts
- sweep-tapes.ts
- mapping.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- column-rules.ts
- checks.test.ts
- graph.ts
- version
- interfaces/transaction-history-storage.ts
- boundary.test.ts
- ModuleDeclaration
- worker-storage.test.ts
- module-api.test.ts
- cold-boot-recovery.integration.test.ts
- loop.ts
- core-settings.ts
- transport-faults.test.ts
- ledger-sweep.test.ts
- cbor.ts
- private/backends.ts
- migrate.ts
- real-tapes.ts
- zero-timeouts-checks.ts
- retirement.test.ts
- process-worker.ts
- .concat
- NodeClient
- vitest
- page.ts
- cbor.property.test.ts
- node-format.ts
- .value
- events-fixtures.ts
- messages.ts
- fetch-fixtures.ts
- TransactionHistoryEntry
- net.test.ts
- vendored-ledger-v9.test.ts
- browser.test.ts
- process-context.test.ts
- binding.test.ts
- .position
- .configHash
- ADDED Requirements
- refused
- .query
- ledger-storage-checks.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- mutation-per-adapter.mjs
- twox.ts
- Full-Chain Storage
- UmbraDB third-party component inventory (SBOM)
- pack-install.mjs
- Design — CORE-ARCH: the standalone indexer's core architecture
- .put
- path.ts
- committedProblems
- orphan-watcher.mjs
- crash-worker.ts
- leanProblems
- fs.ts
- history
- code
- fn
- UmbraDB module guide
- graph.py
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- package.json
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- UmbraDB
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- Design — Sprint 4: Watermarks
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Design — v1.1.0: Quint model checking
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- conformance-gate.mjs
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- Backups
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Tasks — Sprint 4: Watermarks
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
- 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask
- 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- bug-report.md
- feature-request.md
- GC architecture and query-tracing: research findings
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- Requirement: RN-13 SIGTERM stops cleanly
- peerDependenciesMeta
- repository
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- engines
- post-block-update/oracle/run.sh
- state-trees/oracle/run.sh
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB V1.0.0 Implementation Guideline
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 312 edges
2. `UmbraError` - 296 edges
3. `ModuleDeclaration` - 168 edges
4. `FinalizedLoop` - 118 edges
5. `NodeClient` - 102 edges
6. `InMemoryBlockSource` - 101 edges
7. `Database` - 97 edges
8. `BlockRef` - 93 edges
9. `ReadHandle` - 85 edges
10. `5. Runner` - 75 edges

## Surprising Connections (you probably didn't know these)
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Evidence` --references--> `ManualTimers`  [INFERRED]
  docs/issues/00016-heartbeat-above-timer-limit.md → test/node/manual-timers.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (334 total, 37 thin omitted)

### Community 0 - "config/history.ts"
Cohesion: 0.02
Nodes (236): CoreVersion, coreEntry, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+228 more)

### Community 1 - "admin-harness.ts"
Cohesion: 0.02
Nodes (195): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminStartOptions, AdminAnswer, AdminEndpoint (+187 more)

### Community 10 - "tape/index.ts"
Cohesion: 0.03
Nodes (94): Recorded, Refusal, Failure, Variant, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions (+86 more)

### Community 100 - "order.property.test.ts"
Cohesion: 0.10
Nodes (30): CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce(), checkParallelWaits() (+22 more)

### Community 101 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 102 - "browser/build.ts"
Cohesion: 0.09
Nodes (24): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+16 more)

### Community 105 - "core-chain-events.ts"
Cohesion: 0.11
Nodes (25): BlockEventSource, systemEventsKey(), boundEventSource(), chainEventsItemOf(), chainEventsOf(), coreChainEventsOnFetch(), metadataView(), writeEventRows() (+17 more)

### Community 106 - "postgres/transaction-history-storage.ts"
Cohesion: 0.11
Nodes (18): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+10 more)

### Community 109 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 11 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (115): ApplyOutput, StateSummary, DeployTx, LedgerHeight, Upstream, contractFixture, Ledger, RawPackage (+107 more)

### Community 110 - "private/lockstep-wait.test.ts"
Cohesion: 0.12
Nodes (18): Report, ExpectedWait, ReportRelay, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf() (+10 more)

### Community 111 - "child-processes.test.ts"
Cohesion: 0.09
Nodes (23): Kill, Orphaned, SourceFile, guardPid(), alive(), bystander(), childrenOf(), commandOf() (+15 more)

### Community 112 - "containers.test.ts"
Cohesion: 0.11
Nodes (19): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+11 more)

### Community 114 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 115 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 116 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 117 - "crash.test.ts"
Cohesion: 0.12
Nodes (22): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+14 more)

### Community 118 - "fixtures/configuration.ts"
Cohesion: 0.12
Nodes (19): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration() (+11 more)

### Community 119 - "pg-tx-history-adapter.ts"
Cohesion: 0.12
Nodes (21): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+13 more)

### Community 12 - "UmbraError"
Cohesion: 0.03
Nodes (79): LoadedConfig, LoadOptions, PostgresOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadTimeoutSetting (+71 more)

### Community 122 - "HeightRun"
Cohesion: 0.08
Nodes (11): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, LateRedelivery, SkipsStartAtRestart, CommitsDespiteLastWrite (+3 more)

### Community 123 - "ProcessContexts"
Cohesion: 0.11
Nodes (6): MisuseReports, ProcessContexts, ProcessItems, names(), providesProcessItem(), sealed()

### Community 124 - "test/postgres/setup.ts"
Cohesion: 0.13
Nodes (23): Cancellable, CrashHook, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker(), backendPid() (+15 more)

### Community 129 - "shims.test.ts"
Cohesion: 0.12
Nodes (13): crossedError, StartRun, Buffer, Hash, hexOf(), jsonSafe(), createHash(), HEX (+5 more)

### Community 13 - "client.test.ts"
Cohesion: 0.03
Nodes (78): Connection, NodeCallOptions, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers (+70 more)

### Community 132 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 133 - "core-block-fetch/metadata.ts"
Cohesion: 0.13
Nodes (18): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive, RuntimeMetadataView (+10 more)

### Community 137 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 138 - "PortSocket"
Cohesion: 0.17
Nodes (6): Emitter, PortSocket, pair(), Contract states and contract logs, Requirement: RN-15 Module APIs are registered once, at startup, Scenario: Two modules claim one path

### Community 139 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 14 - "ReadHandle"
Cohesion: 0.02
Nodes (88): BlockWriteHandle, ReadHandle, OwnPart, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+80 more)

### Community 140 - "lockstep-refusals.test.ts"
Cohesion: 0.21
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+10 more)

### Community 142 - "postgres-image.test.ts"
Cohesion: 0.13
Nodes (14): BenchEnv, RepositoryFile, canPin(), pinViolations(), repositoryFiles(), PG_SETTINGS, container, { guarded, fixture } (+6 more)

### Community 145 - "describeNodeStoreExports"
Cohesion: 0.17
Nodes (5): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), sortedHex()

### Community 146 - "JsonValue"
Cohesion: 0.12
Nodes (17): JsonValue, 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file) (+9 more)

### Community 15 - "backup/restore.ts"
Cohesion: 0.03
Nodes (66): PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, SourceTransport, PublicConfiguration, PublicDatabase, PublicIdentity, PublicWakes (+58 more)

### Community 158 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 16 - "contract-data-checks.ts"
Cohesion: 0.04
Nodes (101): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, UnsureReason, CoreContractLogsFullOptions (+93 more)

### Community 161 - "transcripts.ts"
Cohesion: 0.21
Nodes (12): Program, V9Raw, bytesOfHex(), decode(), decoded(), freeGot(), literalAt(), logSitesOf() (+4 more)

### Community 162 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 165 - "type-check.ts"
Cohesion: 0.19
Nodes (10): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), CONFIG (+2 more)

### Community 167 - "browser-harness.ts"
Cohesion: 0.27
Nodes (13): ProcessName, backupThrough(), call(), eventsOf(), eventWhen(), logOf(), pageWhen(), restoreThrough() (+5 more)

### Community 168 - "chrome.ts"
Cohesion: 0.23
Nodes (11): Cdp, CdpEvent, Download, PageRequest, chrome(), chrome(), chromePath(), chromeVersion() (+3 more)

### Community 169 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 17 - ".from"
Cohesion: 0.03
Nodes (88): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+80 more)

### Community 170 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.15
Nodes (13): Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4a. Error translation (`src/postgres/errors.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV (+5 more)

### Community 173 - "catalog.ts"
Cohesion: 0.18
Nodes (13): CatalogColumn, CatalogOptions, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference, defaultCatalog() (+5 more)

### Community 175 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 176 - "launchPrivate"
Cohesion: 0.21
Nodes (10): Pause, Q142Observation, SkipsLockstep, launchPrivate(), poll(), PRIVATE_ROWS_SQL(), pauseGate(), pausing() (+2 more)

### Community 178 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 179 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 18 - "host.ts"
Cohesion: 0.05
Nodes (67): LoadLedger, RetainedState, LedgerName, LedgerTask, ParsedTransaction, StateHandle, AppliedState, ApplyBlock (+59 more)

### Community 182 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 185 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 187 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 188 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 19 - "range.ts"
Cohesion: 0.03
Nodes (70): ScriptedNode, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, Arguments, Command (+62 more)

### Community 2 - "ref_node_fs"
Cohesion: 0.02
Nodes (170): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName (+162 more)

### Community 20 - "loop.test.ts"
Cohesion: 0.04
Nodes (71): LockstepWait, SlowBlockEvent, Contexts, Faults, LostCommit, Seen, AtGate, LoopClass (+63 more)

### Community 200 - "ledger/plain-data.test.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 202 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 206 - "Roadmap for the missing formalization"
Cohesion: 0.20
Nodes (9): Key, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec (+1 more)

### Community 21 - "api-server.test.ts"
Cohesion: 0.04
Nodes (65): ApiRegistry, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ChainDataAnswer, HttpHandler, HttpRoute (+57 more)

### Community 210 - "extrinsics.ts"
Cohesion: 0.27
Nodes (8): BodyExtrinsic, ExtrinsicCall, BlockBody, blockTimeOf(), callOf(), callVariants(), isCompactU64(), TIMESTAMP

### Community 212 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 213 - "page-server.ts"
Cohesion: 0.28
Nodes (6): BrowserBuild, pageBench, PageServer, servePage(), ISOLATION_HEADERS, TYPES

### Community 219 - "checkParent"
Cohesion: 0.28
Nodes (8): AlwaysLanded, checkParent(), hex(), sameBytes(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 225 - "HeldHeight"
Cohesion: 0.28
Nodes (5): CommitOutcome, HeldHeight, Outcomes, AlwaysLost, DropsHeld

### Community 23 - "builder.test.ts"
Cohesion: 0.04
Nodes (42): Answer, Handler, Received, ConnectionFrames, Failure, Variant, WrongRecording, Metadata (+34 more)

### Community 232 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 24 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (60): Held, PgliteLockUse, PostgresOptions, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport (+52 more)

### Community 243 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 244 - "child-processes.parent.ts"
Cohesion: 0.29
Nodes (6): ParentJob, child, CHILDREN, exited, job, lines

### Community 25 - "core-ledger-state.ts"
Cohesion: 0.04
Nodes (64): BlockLedgerSource, LedgerBinding, LedgerStateItem, retainedStates, CoreRevision, ContractKeys, bindLedgerParser(), boundLedgerParser() (+56 more)

### Community 26 - "intake.test.ts"
Cohesion: 0.05
Nodes (58): PrivateBackend, PrivateProcess, PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals (+50 more)

### Community 27 - "FinalizedLoop"
Cohesion: 0.06
Nodes (17): PointRun, FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, WaitingInRead, ItemsAfterWrite, FailingAfter (+9 more)

### Community 28 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (62): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order) (+54 more)

### Community 29 - "core-transport.ts"
Cohesion: 0.05
Nodes (43): PublicSide, PublicSideOptions, Session, TransportLimits, TransportTls, Hello, HelloAck, Read (+35 more)

### Community 3 - "ingest-harness.ts"
Cohesion: 0.02
Nodes (191): ProcessAdminOptions, Manifest, Restored, BlockHeader, LoopInput, ProcessingEnd, ProcessStatus, Ran (+183 more)

### Community 30 - "NodeBlockSource"
Cohesion: 0.07
Nodes (21): HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, QueuedBlock, NodeSubscription, NodeBlock, NodeHeader (+13 more)

### Community 31 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (57): LedgerTaskBlock, CallArgsItem, CallArguments, taskSeen, V9Raw, bindLedgerTasks(), boundHost(), frozen() (+49 more)

### Community 32 - "LedgerPackage"
Cohesion: 0.07
Nodes (26): LedgerEventKind, LedgerPackage, LedgerEngine, LedgerTaskFailed, hexOf(), idOf(), same(), sameBytes() (+18 more)

### Community 33 - "transform-checks.ts"
Cohesion: 0.07
Nodes (46): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, turns() (+38 more)

### Community 35 - "backup/backup.ts"
Cohesion: 0.07
Nodes (56): BackupInput, BackupSeams, BackupTarget, BackupFacts, ManifestHistoryRow, ManifestMigration, ManifestTool, DumpInput (+48 more)

### Community 36 - "declaration"
Cohesion: 0.06
Nodes (52): GraphInput, PastFaultCase, RefusalCase, Pipeline, schemaName(), module(), keysModule(), contractLogs() (+44 more)

### Community 37 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (60): BlockParsedOptions, TransactionParser, ChainTransaction, ChainEvent, EventPhase, ScaleValue, ledgerVersionOf(), decodeExtrinsics() (+52 more)

### Community 38 - "client.ts"
Cohesion: 0.08
Nodes (49): State, Subscription, NodeRuntimeVersion, NodeCallMethod, SubscribeMethod, SocketFailure, Final, backoffDelay() (+41 more)

### Community 39 - "version-checks.ts"
Cohesion: 0.08
Nodes (38): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, LedgerTable (+30 more)

### Community 4 - "module-tables.ts"
Cohesion: 0.02
Nodes (167): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, CanonicalEncodingError, ChangeKind, tableChanges, TouchedRow (+159 more)

### Community 40 - "ledger/types.ts"
Cohesion: 0.06
Nodes (47): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, ApplyInput, LedgerPackageOptions, V9Logs, LoadAdapter (+39 more)

### Community 41 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (46): BackupWritten, Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation (+38 more)

### Community 42 - "validation.test.ts"
Cohesion: 0.05
Nodes (48): DeclarationRule, Shape, Case, ShapeCase, Stats, checkItem(), checkLedgerTasks(), checkShape() (+40 more)

### Community 43 - ".#open"
Cohesion: 0.07
Nodes (24): ConfigFinding, CoreTransport, RetryCode, Heartbeat, Process, RetryCondition, isBlockEventSource(), configurationRefused() (+16 more)

### Community 44 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (35): columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+27 more)

### Community 45 - "networks.ts"
Cohesion: 0.05
Nodes (54): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+46 more)

### Community 46 - "process-harness.ts"
Cohesion: 0.07
Nodes (41): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, Bound, ModuleTableOptions, Revision, ResolvedGraph (+33 more)

### Community 47 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (46): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+38 more)

### Community 48 - "PointName"
Cohesion: 0.05
Nodes (35): ItemSink, PointName, BlockItems, LateUse, CallbackFailure, PointArguments, ReasonCode, Unwrapped (+27 more)

### Community 5 - "runner/process.ts"
Cohesion: 0.02
Nodes (119): AdminStarter, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, CoreLedgerVersion (+111 more)

### Community 51 - "sweep-tapes.ts"
Cohesion: 0.10
Nodes (44): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData (+36 more)

### Community 52 - "mapping.ts"
Cohesion: 0.06
Nodes (38): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+30 more)

### Community 53 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.04
Nodes (53): Absent, Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel (+45 more)

### Community 54 - "column-rules.ts"
Cohesion: 0.04
Nodes (53): AllowedRule, Because, DesignRow, PlacedRefusal, RefusalCode, RefusalOptions, RefusedRule, RuleBase (+45 more)

### Community 55 - "checks.test.ts"
Cohesion: 0.06
Nodes (34): GuardTableRow, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, RelationFacts, optOut (+26 more)

### Community 56 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck (+40 more)

### Community 57 - "version"
Cohesion: 0.04
Nodes (47): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+39 more)

### Community 58 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (38): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus (+30 more)

### Community 59 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 6 - "ModuleDeclaration"
Cohesion: 0.03
Nodes (165): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, RevisionSettings, AdminServer (+157 more)

### Community 60 - "worker-storage.test.ts"
Cohesion: 0.07
Nodes (35): ChainOutcome, NodeStore, StoredNode, Thread, BridgeServer, bridgeStore, Growable, CallTx (+27 more)

### Community 62 - "module-api.test.ts"
Cohesion: 0.06
Nodes (40): ChainDataView, ApiError, ApiRequest, ApiResponse, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight() (+32 more)

### Community 63 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (30): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+22 more)

### Community 64 - "loop.ts"
Cohesion: 0.09
Nodes (42): HeightRange, ResolvedRange, Callback, EntryBoundary, ParallelPoint, PointSchedule, HeightActivity, Invoke (+34 more)

### Community 65 - "core-settings.ts"
Cohesion: 0.06
Nodes (43): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys (+35 more)

### Community 66 - "transport-faults.test.ts"
Cohesion: 0.08
Nodes (32): Message, MessageType, Pem, TestCertificates, Ended, rawClient, mutualTlsOptions(), hexOf() (+24 more)

### Community 67 - "ledger-sweep.test.ts"
Cohesion: 0.08
Nodes (28): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, NodeBatch, Block, MemoryTables (+20 more)

### Community 68 - "cbor.ts"
Cohesion: 0.09
Nodes (38): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+30 more)

### Community 69 - "private/backends.ts"
Cohesion: 0.09
Nodes (35): SessionSeen, PrivateOptions, A162Options, a162Run, HeaderSeen, InstancesOptions, instancesRun, A112Observation (+27 more)

### Community 7 - "migrate.ts"
Cohesion: 0.03
Nodes (154): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner (+146 more)

### Community 70 - "real-tapes.ts"
Cohesion: 0.07
Nodes (36): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+28 more)

### Community 71 - "zero-timeouts-checks.ts"
Cohesion: 0.08
Nodes (34): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+26 more)

### Community 73 - "retirement.test.ts"
Cohesion: 0.07
Nodes (39): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), manifestProblems(), mutationProblems() (+31 more)

### Community 74 - "process-worker.ts"
Cohesion: 0.09
Nodes (30): privateIntake, BackupText, CommandBuildOptions, NodeRunResult, adminAnswer(), messageAdmin(), withDevelopmentOptIn(), useNetwork() (+22 more)

### Community 75 - ".concat"
Cohesion: 0.05
Nodes (30): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+22 more)

### Community 78 - "NodeClient"
Cohesion: 0.12
Nodes (14): CoreChainBinding, HeadSubscriber, NodeClient, Pending, Waiter, connectionFailure, NodeMethod, Opened (+6 more)

### Community 8 - "vitest"
Cohesion: 0.02
Nodes (100): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, DatabaseState, ReadDatabaseOptions, ConfiguredDatabaseOptions, CommittedHeight, Database (+92 more)

### Community 82 - "page.ts"
Cohesion: 0.06
Nodes (32): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, Scope, CallMethod, FromProcessWorker (+24 more)

### Community 83 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (37): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+29 more)

### Community 84 - "node-format.ts"
Cohesion: 0.12
Nodes (24): Child, Reader, Readable, Reader, TableNode, node(), childKey(), concat() (+16 more)

### Community 85 - ".value"
Cohesion: 0.18
Nodes (17): TypeDef, ScaleError, ScaleReader, ValueReader, decodeExtrinsic(), field(), pallet(), readRuntimeMetadata() (+9 more)

### Community 87 - "events-fixtures.ts"
Cohesion: 0.13
Nodes (28): Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, metadataWith(), metadataV14() (+20 more)

### Community 89 - "messages.ts"
Cohesion: 0.07
Nodes (32): Committed, MessageFault, Parsed, bytesOf(), decodeParameter(), decodeValue(), describe(), elementType() (+24 more)

### Community 9 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (137): BlockParsed, ProcessCondition, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec (+129 more)

### Community 91 - "TransactionHistoryEntry"
Cohesion: 0.09
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 92 - "net.test.ts"
Cohesion: 0.09
Nodes (19): NetworkBroker, IncomingMessage, Server, NetworkMessage, Frame, Listener, PortUpgrade, RawData (+11 more)

### Community 93 - "vendored-ledger-v9.test.ts"
Cohesion: 0.12
Nodes (30): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, freeAll(), runInFreshInstance(), bigCell() (+22 more)

### Community 96 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 98 - "process-context.test.ts"
Cohesion: 0.08
Nodes (21): MisuseListener, PublishRefusal, AcceptsDuplicates, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, a74Problems() (+13 more)

### Community 99 - "binding.test.ts"
Cohesion: 0.11
Nodes (26): TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), a113Problems() (+18 more)

### Community 230 - ".position"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 252 - ".configHash"
Cohesion: 0.33
Nodes (5): Private modules, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration

### Community 125 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): `transaction_history`, 1. Schema, ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins (+15 more)

### Community 131 - "refused"
Cohesion: 0.10
Nodes (21): refused(), When a callback fails, 7. Storage helpers, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness (+13 more)

### Community 141 - ".query"
Cohesion: 0.23
Nodes (18): a76Problems(), heightsIn(), a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows(), expectedStates() (+10 more)

### Community 144 - "ledger-storage-checks.ts"
Cohesion: 0.23
Nodes (18): a100Problems(), a102Problems(), a104KeyProblems(), a104Scenario(), bytesOf(), contractNodeKeys(), heldHeights(), heldNodeProblems() (+10 more)

### Community 149 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (16): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+8 more)

### Community 157 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.15
Nodes (13): 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix, 16. Whole system, 5. Runner, Requirement: RN-17 A slow block is reported, never cut off, Scenario: A slow callback (+5 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.12
Nodes (14): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+6 more)

### Community 166 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 177 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 190 - "Full-Chain Storage"
Cohesion: 0.17
Nodes (11): store(), 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 3. Semantic decode: `chain-archive-sync/tx-replay-decoder.ts`, 4. How to run it (+3 more)

### Community 195 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 201 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 214 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.22
Nodes (7): 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 9.2 Browser build (BR), 9. Backups and browser, Design — CORE-ARCH: the standalone indexer's core architecture

### Community 22 - ".put"
Cohesion: 0.03
Nodes (77): n(), T(), input(), "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres (+69 more)

### Community 227 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 245 - "committedProblems"
Cohesion: 0.48
Nodes (7): committedProblems(), count(), landedProblems(), neitherProblems(), parsesBefore(), processedAgainProblems(), text()

### Community 264 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 303 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 304 - "leanProblems"
Cohesion: 0.50
Nodes (4): leanImports(), leanProblems(), leanTheorems(), retiredLean()

### Community 34 - "history"
Cohesion: 0.04
Nodes (65): integer(), history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+57 more)

### Community 49 - "code"
Cohesion: 0.04
Nodes (52): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21), The catalog, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog (+44 more)

### Community 50 - "fn"
Cohesion: 0.04
Nodes (51): fn(), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly (+43 more)

### Community 79 - "UmbraDB module guide"
Cohesion: 0.05
Nodes (40): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Reading through `db` (+32 more)

### Community 90 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+23 more)

### Community 104 - "Full-Chain Storage — Design"
Cohesion: 0.07
Nodes (29): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs, 3.5 Dust generation + ledger events (generic) (+21 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+20 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 121 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 127 - "package.json"
Cohesion: 0.08
Nodes (24): bin, umbradb, bugs, url, description, exports, files, homepage (+16 more)

### Community 128 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 134 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.09
Nodes (17): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+9 more)

### Community 135 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 147 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.11
Nodes (16): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+8 more)

### Community 148 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.10
Nodes (16): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now) (+8 more)

### Community 150 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 151 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 152 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 154 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 155 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 160 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 164 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 171 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 172 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 180 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 181 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 183 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 184 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 186 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 191 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 192 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 2. `set`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 193 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 194 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 196 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 197 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 198 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.18
Nodes (10): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG) (+2 more)

### Community 199 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.18
Nodes (10): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds, 8. CI (+2 more)

### Community 203 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 204 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 205 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 207 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 208 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 209 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 215 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 216 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 217 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 218 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 220 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 221 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 222 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 223 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 224 - "conformance-gate.mjs"
Cohesion: 0.22
Nodes (8): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli

### Community 228 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 229 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 231 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 233 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 234 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 235 - "Backups"
Cohesion: 0.29
Nodes (6): A backup at the core's stop, Backups, Restoring a backup, UmbraDB operator guide, What a backup holds, Writing a backup

### Community 236 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 237 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.29
Nodes (6): 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 238 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 239 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 240 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 241 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 242 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 247 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 248 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 249 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 250 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 251 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 253 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 254 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 255 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 256 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 257 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 258 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 259 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 260 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 261 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 262 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 263 - "Midnight Foundation Security Policy"
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

### Community 275 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 276 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 277 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 278 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 279 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 280 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 281 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 282 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 283 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 284 - "00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask"
Cohesion: 0.40
Nodes (4): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix

### Community 285 - "00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`"
Cohesion: 0.40
Nodes (4): 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 286 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 287 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 288 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 289 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 290 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 292 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 293 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 294 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 295 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 296 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 297 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 298 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 299 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 300 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 310 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.67
Nodes (3): Requirement: RN-13 SIGTERM stops cleanly, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable

### Community 311 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 312 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 61 - "README.md"
Cohesion: 0.05
Nodes (40): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased], 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx` (+32 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 81 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.05
Nodes (35): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+27 more)

### Community 86 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-16 Chain-data reads name their view and height, Requirement: RN-1 The main program is a fixed sequence of points, Requirement: RN-2 The runner does only its five duties (+27 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides, Requirement: LG-17 Ledger tasks give modules the native objects (+25 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-8785`, `RFC-8785`, `RFC-3339`, `RFC-3339`, `RFC-6455` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3658 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `config/history.ts`, `admin-harness.ts`, `ref_node_fs`, `ingest-harness.ts`, `module-tables.ts`, `runner/process.ts`, `ModuleDeclaration`, `migrate.ts`, `fetch-fixtures.ts`, `tape/index.ts`, `adapter-fixtures.ts`, `UmbraError`, `client.test.ts`, `ReadHandle`, `backup/restore.ts`, `contract-data-checks.ts`, `.from`, `host.ts`, `range.ts`, `loop.test.ts`, `api-server.test.ts`, `builder.test.ts`, `writer-lock-checks.ts`, `core-ledger-state.ts`, `intake.test.ts`, `core-transport.ts`, `ledger/ledger-tasks.test.ts`, `transform-checks.ts`, `backup/backup.ts`, `declaration`, `core-block-parsed.ts`, `client.ts`, `version-checks.ts`, `ledger/types.ts`, `chain-process.test.ts`, `validation.test.ts`, `.#open`, `column-rules.test.ts`, `networks.ts`, `process-harness.ts`, `slow-block-harness.ts`, `PointName`, `sweep-tapes.ts`, `mapping.ts`, `checks.test.ts`, `interfaces/transaction-history-storage.ts`, `boundary.test.ts`, `worker-storage.test.ts`, `module-api.test.ts`, `cold-boot-recovery.integration.test.ts`, `core-settings.ts`, `transport-faults.test.ts`, `ledger-sweep.test.ts`, `private/backends.ts`, `real-tapes.ts`, `zero-timeouts-checks.ts`, `retirement.test.ts`, `process-worker.ts`, `cbor.property.test.ts`, `node-format.ts`, `messages.ts`, `net.test.ts`, `vendored-ledger-v9.test.ts`, `browser.test.ts`, `process-context.test.ts`, `binding.test.ts`, `order.property.test.ts`, `code-registry.ts`, `browser/build.ts`, `core-chain-events.ts`, `postgres/transaction-history-storage.ts`, `Lockstep`, `private/lockstep-wait.test.ts`, `child-processes.test.ts`, `containers.test.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `crash.test.ts`, `pg-tx-history-adapter.ts`, `test/postgres/setup.ts`, `package.json`, `shims.test.ts`, `block-fetch-decode.test.ts`, `key-handling-checks.ts`, `lockstep-refusals.test.ts`, `postgres-image.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `type-check.ts`, `mutation-per-adapter.mjs`, `web-lock.ts`, `excluded-not-exported.test.ts`, `read-height.property.test.ts`, `launchPrivate`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `history.property.test.ts`, `ledger/plain-data.test.ts`, `transport-intake.test.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.255) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8785`, `RFC-8785`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `config/history.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.016986062717770034 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `config/history.ts`, `admin-harness.ts`, `ref_node_fs`, `shims.test.ts`, `module-tables.ts`, `runner/process.ts`, `ModuleDeclaration`, `migrate.ts`, `vitest`, `fetch-fixtures.ts`, `ingest-harness.ts`, `tape/index.ts`, `lockstep-refusals.test.ts`, `client.test.ts`, `ReadHandle`, `backup/restore.ts`, `contract-data-checks.ts`, `host.ts`, `range.ts`, `loop.test.ts`, `api-server.test.ts`, `writer-lock-checks.ts`, `core-ledger-state.ts`, `intake.test.ts`, `FinalizedLoop`, `core-transport.ts`, `NodeBlockSource`, `ledger/ledger-tasks.test.ts`, `transform-checks.ts`, `statementsOf`, `backup/backup.ts`, `declaration`, `client.ts`, `version-checks.ts`, `ledger/types.ts`, `web-lock.ts`, `validation.test.ts`, `.#open`, `chain-process.test.ts`, `networks.ts`, `process-harness.ts`, `slow-block-harness.ts`, `PointName`, `mapping.ts`, `checks.test.ts`, `graph.ts`, `module-api.test.ts`, `loop.ts`, `core-settings.ts`, `transport-faults.test.ts`, `cbor.ts`, `zero-timeouts-checks.ts`, `sha256`, `process-worker.ts`, `NodeClient`, `UmbraDB module guide`, `Design — CORE-ARCH: the standalone indexer's core architecture`, `checkParent`, `process-context.test.ts`, `binding.test.ts`, `ProcessContexts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.021295207070250052 - nodes in this community are weakly interconnected._