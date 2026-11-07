# Graph Report - UmbraDB

## Corpus Check
- 1292 files · ~1,826,857 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .patch 18, (none) 16, .lean 11)

## Summary
- 13305 nodes · 41575 edges · 393 communities (353 shown, 40 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3459 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `612458754e3ad6de` (1292 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- ModuleDeclaration
- .from
- builds.ts
- node-set.ts
- configuration-refusal.test.ts
- cbor.property.test.ts
- real-tapes.ts
- browser/build.ts
- process-backends.ts
- test/postgres/setup.ts
- browser.test.ts
- events-fixtures.ts
- Worker
- page.ts
- api.ts
- pg-tx-history-adapter.ts
- networks.ts
- release-version.ts
- core.ts
- vendored-ledger-v9.test.ts
- process-worker.ts
- ref_node_url
- node-set.test.ts
- config-check-database.test.ts
- api-server.test.ts
- paused-harness.ts
- node-fields-harness.ts
- code-registry.ts
- postgres/transaction-history-storage.ts
- messages.ts
- order.property.test.ts
- TransactionHistoryEntry
- checks.test.ts
- documents.ts
- 5. Runner
- height-versioned.property.test.ts
- read-gate.ts
- PrivateTransport
- src/ledger/identity.ts
- opt-out.test.ts
- crash.test.ts
- validation.test.ts
- demo-handlers.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- version-checks.ts
- core-config.test.ts
- surface.test.ts
- SubscriptionConnection
- sweep-fixture.test.ts
- backup/restore.ts
- binding.test.ts
- buffer.ts
- TapeBuilder
- pack-install.mjs
- tape/index.ts
- node-bridge.ts
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- block-fetch-decode.test.ts
- version-table.ts
- library-documents.test.ts
- node-key-tapes.ts
- describeNodeStoreExports
- GraphWorld
- process-admin.ts
- chrome.ts
- chain-events-source.test.ts
- Transaction
- browser-harness.ts
- .concat
- HoldingRelay
- client.test.ts
- version.negative-control.test.ts
- ledger-checks.ts
- LoopPauses
- ledger-liveness.test.ts
- resolver-boundary.ts
- migrate.ts
- resolve.ts
- process-access.ts
- ws-mutual-tls.test.ts
- ledger/metadata.ts
- statementsOf
- quiet-host.child.ts
- channel-queue.test.ts
- no-indexer-or-wallet-sdk.test.ts
- checkParent
- ApiRoutes
- browser/src/config/load.ts
- core-ledger-state.ts
- history.property.test.ts
- TapeAnswers
- Design — Sprint 1: project setup + TemporalKV
- NodeClient
- .send
- validate.ts
- typescript
- ingest-crash.worker.ts
- validation.ts
- postgres-image.test.ts
- ProcessItems
- signal-backup.worker.ts
- core-block-parsed.ts
- .slowBlock
- adapter.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- BlockRef
- InMemoryBlockSource
- ref_node_fs
- SourceTransport
- backupAtStop
- runner/process.ts
- writer-lock-checks.ts
- chain-events-decode.test.ts
- HeightActivity
- PageState
- connectWebSocket
- PageApiChannel
- fetch-fixtures.ts
- NodeFS
- PausesInsideTheHeight
- SkipsLockstep
- FailingAfter
- LedgerPackage
- NoRedelivery
- CommitsTheBoundary
- refused-configuration.test.ts
- ledger/types.ts
- private/backends.ts
- refcount-tapes.ts
- ref_node_timers
- halts.test.ts
- contract-modules.test.ts
- NodeBlockSource
- loop-stop-harness.ts
- FinalizedLoop
- builder.test.ts
- Process
- adapter-fixtures.ts
- ReadHandle
- restore-ledger.ts
- ledger-tapes.ts
- range.ts
- backup/backup.ts
- column-rules.ts
- contract-data-checks.ts
- refcount-restart.ts
- UmbraError
- transform-checks.ts
- build-modules.ts
- listening.test.ts
- start-umbradb.ts
- slow-block-harness.ts
- column-rules.test.ts
- node-format.ts
- PgTransactionHistoryStorage
- core-block-commit.test.ts
- startUmbraDB
- boundary.test.ts
- private/lockstep-wait.test.ts
- vitest
- graph.ts
- declaration.ts
- ledger-storage.test.ts
- mapping.ts
- ChannelEndpoint
- checkShape
- ingest-harness.ts
- config/history.ts
- refcount-model.ts
- interfaces/transaction-history-storage.ts
- config/plain-data.ts
- transport.test.ts
- cli/command.ts
- retirement.test.ts
- cbor.ts
- api-socket.ts
- module-api.ts
- ref_node_crypto
- core-private-source.ts
- file-mode.test.ts
- hex
- api-session.test.ts
- public-database.ts
- PointName
- example-checks.ts
- ledger-tasks-checks.ts
- ADDED Requirements
- history
- refused
- ADDED Requirements
- core-private-source.test.ts
- transportReader
- .slowBlockMs
- graph.py
- cold-boot-recovery.integration.test.ts
- ADDED Requirements
- local-preprod-sync.mjs
- conformance-gate.mjs
- mutation-per-adapter.mjs
- node-source-status.test.ts
- twox.ts
- Design — v1.1.0: Quint model checking
- Boundaries, threats and controls
- midnight-env — reproducible PREPROD dev environment
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- host-signal.ts
- orphan-watcher.mjs
- fresh-instance.mjs
- package-keys-walk.mjs
- crash-worker.ts
- .put
- version
- code
- .off
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- README.md
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Requirement: DT-3 The contents hash
- [0.10.0] - 2026-10-27
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- scoped-review-manifest
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- Midnight Foundation Security Policy
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- The scan action cannot exclude a single opengrep rule
- UmbraDB node architecture
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-infosec-signoff
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- dependencies
- lib.sh
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
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
- 00051 — The transport's instance id is any text: line breaks reach the core's log
- 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents
- 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- 00084 — The contents hash's key-ordered read splices its page size into `LIMIT`
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- Vendored ledger builds
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails
- 00083 — Four timing-bound tests fail when the machine runs several test lanes at once
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- start-stack.sh
- graphify/run.sh
- build-in-container.sh
- stats-module/run.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- post-block-update/oracle/run.sh
- state-trees/oracle/run.sh
- modules-missing.ts
- modules-not-a-list.ts
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 465 edges
2. `UmbraError` - 357 edges
3. `ModuleDeclaration` - 213 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 139 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `Database` - 104 edges
9. `startUmbraDB()` - 103 edges
10. `PROCESS_BACKENDS` - 102 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts

## Import Cycles
- None detected.

## Communities (393 total, 40 thin omitted)

### Community 0 - "ModuleDeclaration"
Cohesion: 0.02
Nodes (182): ReadOnlyDatabase, ModuleDeclaration, Revision, EntryRange, GraphInput, HeightRange, ResolvedGraph, BlockItems (+174 more)

### Community 1 - ".from"
Cohesion: 0.03
Nodes (195): CoreLedgerStateOptions, RefcountFault, NodeBatch, contentsHash, FixtureRun, FixtureRunOptions, Reader, Seen (+187 more)

### Community 10 - "builds.ts"
Cohesion: 0.03
Nodes (112): PrivateIntakeOptions, A165Options, a165Run, Attempt, TestDatabase, PrivateOptions, PrivateProcess, PrivateRefusal (+104 more)

### Community 101 - "node-set.ts"
Cohesion: 0.10
Nodes (28): NodeSetFault, NodeSetOptions, NodeTableCheck, SchemaTable, ContentFunction, nodeKeys, ChildReader, ChildVisitor (+20 more)

### Community 105 - "configuration-refusal.test.ts"
Cohesion: 0.08
Nodes (30): ConfigFinding, ProcessReason, ReasonCode, Unwrapped, StatusFacts, configurationRefused(), findingText(), refusalFindings() (+22 more)

### Community 106 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (37): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+29 more)

### Community 107 - "real-tapes.ts"
Cohesion: 0.09
Nodes (33): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+25 more)

### Community 108 - "browser/build.ts"
Cohesion: 0.07
Nodes (28): BrowserBuild, BrowserBuildOptions, BrowserControl, checkedLedgers, pageBench, PageServer, browserLedgerEntry(), browserPlugin() (+20 more)

### Community 11 - "process-backends.ts"
Cohesion: 0.03
Nodes (127): AdminRun, AdminRunOptions, Answered, Answerer, Expected, Hold, Observation, Prober (+119 more)

### Community 110 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 112 - "browser.test.ts"
Cohesion: 0.08
Nodes (36): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, heldClock, continuedProblems() (+28 more)

### Community 115 - "events-fixtures.ts"
Cohesion: 0.13
Nodes (28): Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, metadataWith(), metadataV14() (+20 more)

### Community 118 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 119 - "page.ts"
Cohesion: 0.07
Nodes (30): ApiChannel, LinkRecord, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp(), beginCore() (+22 more)

### Community 12 - "api.ts"
Cohesion: 0.03
Nodes (98): ConfiguredDatabase, ConfiguredDatabaseOptions, commandTarget, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight (+90 more)

### Community 120 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (24): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+16 more)

### Community 124 - "networks.ts"
Cohesion: 0.07
Nodes (32): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, Answers (+24 more)

### Community 125 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 126 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 128 - "vendored-ledger-v9.test.ts"
Cohesion: 0.12
Nodes (30): FreshInstanceRequest, FreshInstanceResult, StoredNode, GenesisNodes, NodeBatch, NodeRoot, loadProblems(), tagsOf() (+22 more)

### Community 129 - "process-worker.ts"
Cohesion: 0.10
Nodes (25): ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker, withDevelopmentOptIn() (+17 more)

### Community 13 - "ref_node_url"
Cohesion: 0.02
Nodes (106): EmitWarning, Child, ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted (+98 more)

### Community 130 - "node-set.test.ts"
Cohesion: 0.07
Nodes (29): StoredRow, Tables, changedRow(), database(), databaseSql(), hexOf(), keyOf(), literal() (+21 more)

### Community 131 - "config-check-database.test.ts"
Cohesion: 0.08
Nodes (22): CheckStep, CheckTarget, CliBackend, configCheck(), configText(), coreSettings(), inChild(), lineOf() (+14 more)

### Community 132 - "api-server.test.ts"
Cohesion: 0.10
Nodes (24): ApiRegistry, AppendsVersion, Client, names(), configHashesOf(), duplicateProblems(), exchange(), helperProblems() (+16 more)

### Community 133 - "paused-harness.ts"
Cohesion: 0.12
Nodes (29): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, keeperModule() (+21 more)

### Community 135 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (25): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+17 more)

### Community 136 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 137 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (20): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+12 more)

### Community 14 - "messages.ts"
Cohesion: 0.03
Nodes (100): ResultColumn, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransport, CoreTransportOptions (+92 more)

### Community 140 - "order.property.test.ts"
Cohesion: 0.10
Nodes (29): CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce(), checkParallelWaits() (+21 more)

### Community 141 - "TransactionHistoryEntry"
Cohesion: 0.12
Nodes (12): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+4 more)

### Community 142 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+14 more)

### Community 143 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 145 - "5. Runner"
Cohesion: 0.16
Nodes (25): Callback, EntryBoundary, ParallelPoint, PointSchedule, SkipsStartAtRestart, StartsAtEveryRevision, CoreStopsFirst, boundaryModules() (+17 more)

### Community 146 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (21): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+13 more)

### Community 147 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 148 - "PrivateTransport"
Cohesion: 0.11
Nodes (9): PublicSide, HelloAck, PrivateCarrier, PrivateTransport, Waiter, lost(), reject(), resolve() (+1 more)

### Community 149 - "src/ledger/identity.ts"
Cohesion: 0.13
Nodes (24): ManifestLine, VerifyLedgerPackagesOptions, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkPackageFiles(), manifestSha256(), mismatch() (+16 more)

### Community 15 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (89): CheckedMigration, CanonicalEncodingError, ContentOptions, TableContent, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+81 more)

### Community 150 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 151 - "validation.test.ts"
Cohesion: 0.09
Nodes (19): DeclarationRule, Case, ShapeCase, Stats, schemaName(), first(), validateWith(), module() (+11 more)

### Community 153 - "demo-handlers.test.ts"
Cohesion: 0.11
Nodes (20): gate, Compared, ConnectSeen, PortPeer, Exchanged, MapiHooks, comparedOfExchange(), comparedOfResponse() (+12 more)

### Community 154 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 155 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 156 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 159 - "version-checks.ts"
Cohesion: 0.19
Nodes (24): Boundary, CallRecord, UpgradeCase, Walk, Answers, toHex(), H(), blockWith() (+16 more)

### Community 16 - "core-config.test.ts"
Cohesion: 0.03
Nodes (92): MountedAdminAnswer, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions (+84 more)

### Community 160 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 162 - "SubscriptionConnection"
Cohesion: 0.12
Nodes (16): SubscriptionCarrier, SubscriptionConnection, errorMessage(), socketConnection(), Suggested fix, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence (+8 more)

### Community 164 - "sweep-fixture.test.ts"
Cohesion: 0.13
Nodes (21): Driver, applyInput(), at(), batchText(), blockHash(), embeddedOf(), hex(), keysOf() (+13 more)

### Community 165 - "backup/restore.ts"
Cohesion: 0.16
Nodes (20): PublicIdentity, Checked, PublicSide, RestoreChain, RestoreInput, RestoreTarget, isBlockLedgerSource(), readPrivateBinding() (+12 more)

### Community 166 - "binding.test.ts"
Cohesion: 0.14
Nodes (21): PglitePathParts, A113Observation, A156Observation, Binding, Created, Outcome, a113Problems(), a113Run() (+13 more)

### Community 167 - "buffer.ts"
Cohesion: 0.12
Nodes (16): BufferEncoding, sha256, hex(), instantiateLedger(), bytesOfText(), charCodes(), encodingOf(), fromBase64() (+8 more)

### Community 168 - "TapeBuilder"
Cohesion: 0.12
Nodes (11): Refusal, TapeBuilder, RecordingError, withBuilder(), frameText(), whenClosed(), 11. Refusals and halts (IN-12), 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010) (+3 more)

### Community 169 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 17 - "tape/index.ts"
Cohesion: 0.04
Nodes (82): Recorded, Link, TapeBuilderOptions, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest (+74 more)

### Community 170 - "node-bridge.ts"
Cohesion: 0.13
Nodes (17): Thread, BridgeServer, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 171 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (13): BackupText, createReadStream(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir (+5 more)

### Community 172 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 173 - "version-table.ts"
Cohesion: 0.16
Nodes (22): ConfiguredLedgerTable, LedgerPin, LedgerRow, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins() (+14 more)

### Community 176 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 177 - "node-key-tapes.ts"
Cohesion: 0.15
Nodes (15): NodeKeyTape, Written, byReference, KeyOf, Walk, nodeKey(), checkTape(), nodeKeyTapeTest() (+7 more)

### Community 178 - "describeNodeStoreExports"
Cohesion: 0.16
Nodes (7): Disposable, NodeStoreExports, NodeStoreSubject, hasEmbeddedChild(), describeNodeStoreExports(), nodesOf(), sortedHex()

### Community 179 - "GraphWorld"
Cohesion: 0.27
Nodes (3): Dice, GraphWorld, driveHistory()

### Community 18 - "process-admin.ts"
Cohesion: 0.04
Nodes (107): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+99 more)

### Community 180 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 181 - "chain-events-source.test.ts"
Cohesion: 0.12
Nodes (9): NodeCallOptions, EventsRunner, RecordingClient, isBlockEventSource(), open(), quiet(), chain, closing (+1 more)

### Community 182 - "Transaction"
Cohesion: 0.15
Nodes (7): Transaction, HeightRun, SkipsAfterReconnect, Batching, WaitsInTransaction, ComputeAtH, WritingLoop

### Community 183 - "browser-harness.ts"
Cohesion: 0.24
Nodes (18): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+10 more)

### Community 184 - ".concat"
Cohesion: 0.16
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 189 - "HoldingRelay"
Cohesion: 0.15
Nodes (5): Report, HoldingRelay, ReportRelay, sendable(), typeOf()

### Community 19 - "client.test.ts"
Cohesion: 0.03
Nodes (64): Connection, NodeRetry, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets, Answer (+56 more)

### Community 193 - "version.negative-control.test.ts"
Cohesion: 0.17
Nodes (8): MetadataNode, CountingNode, MetadataSelector, Select, OwnStateMetadata, expectUpgradeDecoding(), runtimeAt(), tapeMetadataNode()

### Community 194 - "ledger-checks.ts"
Cohesion: 0.25
Nodes (17): LedgerEvent, TransactionResult, ledgerItemsSeen, a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows() (+9 more)

### Community 195 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 197 - "ledger-liveness.test.ts"
Cohesion: 0.15
Nodes (15): SlowStep, TestLoaderData, beat(), countDeserializations(), hexOf(), loadLedger(), probe(), backend (+7 more)

### Community 198 - "resolver-boundary.ts"
Cohesion: 0.18
Nodes (16): Boundary, Crossing, Guard, boundaryOf(), boundarySources(), guardedSymbols(), hostWith(), inRepository() (+8 more)

### Community 2 - "migrate.ts"
Cohesion: 0.02
Nodes (166): SchemaWriteHandle, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference, OwnPart (+158 more)

### Community 20 - "resolve.ts"
Cohesion: 0.03
Nodes (110): CoreChainFacts, RestoreBase, CommandBuildOptions, CheckFinding, CheckState, ConfigCheckOptions, ConfigCheckSeams, StepName (+102 more)

### Community 202 - "process-access.ts"
Cohesion: 0.20
Nodes (15): Access, AllowedRead, bare(), callsPathResolve(), checked(), declares(), inRepository(), inType() (+7 more)

### Community 203 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 204 - "ledger/metadata.ts"
Cohesion: 0.20
Nodes (5): MetadataBlock, RuntimeMetadata, RuntimeMetadataEntry, contentStateOf(), hexOf()

### Community 205 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 209 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 21 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (88): demoLink, EndpointOptions, Envelope, MessagePortLike, PrivateLinkChannel, controlledTimers, PeerEnd, PeerMessage (+80 more)

### Community 210 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 211 - "checkParent"
Cohesion: 0.18
Nodes (12): AlwaysLanded, checkParent(), sameBytes(), hashAt(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix (+4 more)

### Community 215 - "ApiRoutes"
Cohesion: 0.23
Nodes (7): ApiRoutes, ModuleRegistration, AcceptsDuplicates, registerModuleApis(), routesOf(), api(), routesOf()

### Community 218 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 22 - "core-ledger-state.ts"
Cohesion: 0.04
Nodes (97): ComputedBlock, LedgerStateItem, retainedStates, KeyCounts, RefcountCheck, RefcountStatement, refcountStep, RefcountTables (+89 more)

### Community 223 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 224 - "TapeAnswers"
Cohesion: 0.28
Nodes (8): TapeAnswers, Tape, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 228 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 23 - "NodeClient"
Cohesion: 0.05
Nodes (71): NodeSourceOptions, FinalizedHeightOptions, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+63 more)

### Community 24 - "validate.ts"
Cohesion: 0.04
Nodes (92): coreEntry, TextPattern, ConfigRule, CursorRule, EntryRef, Finding, Issue, Plain (+84 more)

### Community 247 - "typescript"
Cohesion: 0.33
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 249 - "ingest-crash.worker.ts"
Cohesion: 0.24
Nodes (9): CrashEvent, CrashJob, report(), tipWriter(), fenceAt(), handle, job, orphanGuard (+1 more)

### Community 25 - "validation.ts"
Cohesion: 0.02
Nodes (97): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase (+89 more)

### Community 250 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 258 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 26 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (88): BodyExtrinsic, BlockBody, BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent (+80 more)

### Community 27 - "adapter.ts"
Cohesion: 0.03
Nodes (75): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+67 more)

### Community 276 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 29 - "BlockRef"
Cohesion: 0.04
Nodes (49): BlockHeaderItem, BlockEventSource, BlockItemSource, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, QueuedBlock, ChainCheckInput (+41 more)

### Community 3 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (150): InMemoryBlockSource, Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation (+142 more)

### Community 30 - "ref_node_fs"
Cohesion: 0.07
Nodes (58): BackupBackend, BackupDatabase, killedRestore, TickerHandle, WORKER, SignalEvent, cliProject, a176Project() (+50 more)

### Community 31 - "backupAtStop"
Cohesion: 0.03
Nodes (80): UmbraDBStarted, join(), normalize(), resolve(), backupAtStop(), log(), ownKeys(), delimiter (+72 more)

### Community 32 - "runner/process.ts"
Cohesion: 0.03
Nodes (61): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, ConfigRow, RetryCode (+53 more)

### Community 33 - "writer-lock-checks.ts"
Cohesion: 0.05
Nodes (68): CreatedDirectory, Held, PgliteLockUse, WarningArguments, WarningHook, WriterProcess, Job, WorkerEvent (+60 more)

### Community 34 - "chain-events-decode.test.ts"
Cohesion: 0.06
Nodes (59): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+51 more)

### Community 343 - "HeightActivity"
Cohesion: 0.60
Nodes (3): HeightActivity, NeverClears, NeverClears

### Community 35 - "connectWebSocket"
Cohesion: 0.04
Nodes (45): ConnectSocket, Outage, Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions (+37 more)

### Community 36 - "fetch-fixtures.ts"
Cohesion: 0.06
Nodes (69): ProcessCondition, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded, FetchSeen (+61 more)

### Community 38 - "LedgerPackage"
Cohesion: 0.05
Nodes (41): Path, LedgerPackage, StateHandle, LedgerEngine, Settled, stagenetReplay, described(), differs() (+33 more)

### Community 39 - "refused-configuration.test.ts"
Cohesion: 0.04
Nodes (58): BackupWritten, ConfigCheckReport, DatabaseParts, PostgresPartsInput, EngineConfig, ProcessHandle, Refusal, Start (+50 more)

### Community 4 - "ledger/types.ts"
Cohesion: 0.03
Nodes (129): LoadLedger, LedgerName, AdapterSpec, LedgerSource, ApplyOutput, ChainOutcome, LedgerPackageOptions, LedgerTask (+121 more)

### Community 40 - "private/backends.ts"
Cohesion: 0.05
Nodes (48): AdminStarter, PostgresParts, Keeping, PrivateBackend, SessionSeen, A162Options, a162Run, HeaderSeen (+40 more)

### Community 41 - "refcount-tapes.ts"
Cohesion: 0.05
Nodes (58): Buffer, Hash, workerRecord, FixtureConfig, StoredCheck, ContractRow, Released, Reader (+50 more)

### Community 42 - "ref_node_timers"
Cohesion: 0.05
Nodes (60): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, StaysPaused (+52 more)

### Community 43 - "halts.test.ts"
Cohesion: 0.04
Nodes (69): ChainDataView, ProcessingEnd, ProcessStatus, A43Observation, CursorElsewhere, Halt, Outcome, Fault (+61 more)

### Community 44 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (61): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+53 more)

### Community 45 - "NodeBlockSource"
Cohesion: 0.06
Nodes (26): HeadWait, NodeBlockSource, Prefetch, NodeSubscription, PreparedBlock, QueueRunner, NoWindow, OwnStateMetadata (+18 more)

### Community 46 - "loop-stop-harness.ts"
Cohesion: 0.06
Nodes (58): NodeClientOptions, watched, RestartEvent, RestartJob, A169Observation, LoopStopScenario, SourceOf, A167Observation (+50 more)

### Community 47 - "FinalizedLoop"
Cohesion: 0.06
Nodes (18): FinalizedLoop, UnexpectedCursor, SkipsUnseen, WaitsInTransaction, WaitingInRead, ItemsAfterWrite, CommitsDespiteLastWrite, SilentHalt (+10 more)

### Community 48 - "builder.test.ts"
Cohesion: 0.04
Nodes (34): ConnectionFrames, Failure, Variant, WrongRecording, Metadata, Step, Frame, RawClient (+26 more)

### Community 49 - "Process"
Cohesion: 0.06
Nodes (9): PauseHold, Process, openedCursorHeight(), retryOf(), messageOf(), resolve(), withTables(), losingCommits() (+1 more)

### Community 5 - "adapter-fixtures.ts"
Cohesion: 0.03
Nodes (135): ApplyInput, StateSummary, StoredNode, LedgerHeight, Upstream, contractFixture, Ledger, RawPackage (+127 more)

### Community 50 - "ReadHandle"
Cohesion: 0.04
Nodes (38): ReadHandle, PointCallbacks, TestBackend, HeldRead, Job, Outcome, Reads, Step (+30 more)

### Community 51 - "restore-ledger.ts"
Cohesion: 0.06
Nodes (60): FileEntries, recordedGenesis, FileRow, ledgerBackup, RestorableBackup, RestoreBuild, FileProcess, privateBackup (+52 more)

### Community 52 - "ledger-tapes.ts"
Cohesion: 0.06
Nodes (67): BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime, ledgerScenario, LedgerScenarioOptions (+59 more)

### Community 54 - "range.ts"
Cohesion: 0.05
Nodes (63): BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, CompletenessRange, Final, Height (+55 more)

### Community 55 - "backup/backup.ts"
Cohesion: 0.06
Nodes (60): BackupInput, BackupSeams, BackupTarget, Manifest, ManifestMigration, ManifestTool, PgliteDump, SnapshotSeams (+52 more)

### Community 56 - "column-rules.ts"
Cohesion: 0.04
Nodes (67): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultPart (+59 more)

### Community 57 - "contract-data-checks.ts"
Cohesion: 0.08
Nodes (58): CoreContractStatesOptions, ContractStateRow, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+50 more)

### Community 58 - "refcount-restart.ts"
Cohesion: 0.06
Nodes (52): BatchJson, ContentsHash, databaseNow, Hold, Light, Line, NodeSetKeeper, observedRun (+44 more)

### Community 6 - "UmbraError"
Cohesion: 0.02
Nodes (109): BenchEnv, databaseTarget, PostgresConnection, PostgresOptions, PgliteLockUse, SslMode, ReadOptions, DurabilityProbeOptions (+101 more)

### Community 60 - "transform-checks.ts"
Cohesion: 0.09
Nodes (40): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, until() (+32 more)

### Community 61 - "build-modules.ts"
Cohesion: 0.05
Nodes (44): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, StatsRow, Outcome, PgliteMemoryParts, core() (+36 more)

### Community 62 - "listening.test.ts"
Cohesion: 0.05
Nodes (35): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, EngineInput, UserModulesSource (+27 more)

### Community 63 - "start-umbradb.ts"
Cohesion: 0.08
Nodes (51): readOptions, ModuleListRule, GoneCwdResult, addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding() (+43 more)

### Community 64 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (50): LoopInput, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+42 more)

### Community 66 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, keyOrder, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+24 more)

### Community 67 - "node-format.ts"
Cohesion: 0.08
Nodes (39): Node, GeneratedBlock, GeneratedState, Child, Reader, Readable, Reader, TableNode (+31 more)

### Community 68 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (49): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity (+41 more)

### Community 69 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (41): BlockRow, BackupFacts, DumpInput, exclusiveJob, ContentDefinedTables, RelationFacts, TableName, OpenedProcess (+33 more)

### Community 7 - "startUmbraDB"
Cohesion: 0.02
Nodes (137): AdminSeams, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork, UmbraDBOptions (+129 more)

### Community 70 - "boundary.test.ts"
Cohesion: 0.08
Nodes (44): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+36 more)

### Community 71 - "private/lockstep-wait.test.ts"
Cohesion: 0.06
Nodes (30): InstanceView, PrivateInstance, Entry, Lockstep, LockstepCondition, LockstepInstance, LockstepOptions, LockstepRefusal (+22 more)

### Community 72 - "vitest"
Cohesion: 0.05
Nodes (28): Lockfile, Manifest, Upstream, Leftover, RemovedName, sweepTapeCase(), filesUnder(), patchesOf() (+20 more)

### Community 73 - "graph.ts"
Cohesion: 0.07
Nodes (49): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+41 more)

### Community 74 - "declaration.ts"
Cohesion: 0.07
Nodes (38): EntryBuilder, BlockWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, BlockContext (+30 more)

### Community 75 - "ledger-storage.test.ts"
Cohesion: 0.10
Nodes (43): RetainedState, Call, SeenLoad, retentionSeen, LedgerTx, tapeDeterminism, cappedAt(), firstParam() (+35 more)

### Community 76 - "mapping.ts"
Cohesion: 0.07
Nodes (34): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+26 more)

### Community 77 - "ChannelEndpoint"
Cohesion: 0.09
Nodes (17): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), discard(), isChannel(), connectChannel() (+9 more)

### Community 78 - "checkShape"
Cohesion: 0.07
Nodes (41): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+33 more)

### Community 79 - "ingest-harness.ts"
Cohesion: 0.07
Nodes (41): Restored, ingest, SourceClass, WindowBackup, Segment, itemsWatcher(), run(), run() (+33 more)

### Community 8 - "config/history.ts"
Cohesion: 0.03
Nodes (146): OpenedFacts, CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreSettings, versionEntry, ConfigHashRow, HistoryCheck (+138 more)

### Community 80 - "refcount-model.ts"
Cohesion: 0.07
Nodes (36): BlockKind, BlockScript, BoundaryRewrite, DrivenBlock, GraphNode, HistoryScript, OracleReport, R1Case (+28 more)

### Community 81 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (37): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+29 more)

### Community 82 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (40): ImportedConfig, LoadOptions, PlainArray, plainData, PlainDataNode, PlainDataRule, Walk, ConfigContext (+32 more)

### Community 83 - "transport.test.ts"
Cohesion: 0.08
Nodes (34): Message, MessageType, PublicCoreOptions, Ended, rawClient, Escape, publicState, Refused (+26 more)

### Community 84 - "cli/command.ts"
Cohesion: 0.07
Nodes (36): RestoreSeams, CommandHandler, CommandIo, MainProcess, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome (+28 more)

### Community 85 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 87 - "cbor.ts"
Cohesion: 0.09
Nodes (37): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+29 more)

### Community 88 - "api-socket.ts"
Cohesion: 0.10
Nodes (39): coreHeaders, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits (+31 more)

### Community 89 - "module-api.ts"
Cohesion: 0.07
Nodes (31): ChainDataAnswer, ApiError, ApiErrorCode, ApiRequest, ApiResponse, HttpHandler, HttpMethod, HttpRoute (+23 more)

### Community 9 - "ref_node_crypto"
Cohesion: 0.03
Nodes (124): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, SchemaPlan, ChangeKind, tableChanges (+116 more)

### Community 90 - "core-private-source.ts"
Cohesion: 0.09
Nodes (38): ChainCheck, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, startHashDecision, StartHashes, PrivateLink (+30 more)

### Community 91 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (31): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+23 more)

### Community 92 - "hex"
Cohesion: 0.07
Nodes (32): RefcountBatch, Given, Halt, Outcome, Tables, both(), bytes(), childKeys() (+24 more)

### Community 93 - "api-session.test.ts"
Cohesion: 0.07
Nodes (29): HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, Client, Mountable, HeldLink, answerNotServing(), byteLength() (+21 more)

### Community 95 - "public-database.ts"
Cohesion: 0.09
Nodes (26): PrivateBlockSource, PrivateLinkAddress, PrivateLinkConnect, PublicDatabase, PublicSideOptions, PublicWakes, ConnectChannel, TransportPosition (+18 more)

### Community 97 - "PointName"
Cohesion: 0.07
Nodes (30): BlockHeader, PointName, CallbackFailure, PointArguments, PointRun, Activity, Misuse, SlowBlockCondition (+22 more)

### Community 98 - "example-checks.ts"
Cohesion: 0.08
Nodes (27): Served, Finding, BlockImport, ChildResult, CodeBlock, installedProject, isolationProblems(), serveCommand() (+19 more)

### Community 99 - "ledger-tasks-checks.ts"
Cohesion: 0.10
Nodes (35): IngestOptions, TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses(), expectedCallArgs() (+27 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+26 more)

### Community 28 - "history"
Cohesion: 0.03
Nodes (93): history(), params(), n(), data(), 7. The module API, 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants (+85 more)

### Community 53 - "refused"
Cohesion: 0.04
Nodes (64): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+56 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 103 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (12): listed(), needsLockstepRefusal(), height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting() (+4 more)

### Community 104 - "transportReader"
Cohesion: 0.05
Nodes (37): text(), transportReader(), transportReaderRule(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 00061 — The threat model's `path:line` citations drift as the code moves (+29 more)

### Community 109 - ".slowBlockMs"
Cohesion: 0.06
Nodes (35): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+27 more)

### Community 116 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 117 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (25): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed(), ledgerV8NodeEntry() (+17 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 192 - "local-preprod-sync.mjs"
Cohesion: 0.21
Nodes (17): commitOf(), configText(), docker(), dockerHas(), dockerLater(), imageDigests(), main(), nodeRpc() (+9 more)

### Community 207 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 208 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 216 - "node-source-status.test.ts"
Cohesion: 0.15
Nodes (10): a, b, fence(), open(), pass(), quiet(), chain, head (+2 more)

### Community 217 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 222 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 227 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 254 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 261 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 269 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 278 - "host-signal.ts"
Cohesion: 0.38
Nodes (4): followSignal(), isSignal(), ABORTED, REASON

### Community 301 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 344 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 345 - "package-keys-walk.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 360 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 37 - ".put"
Cohesion: 0.03
Nodes (76): T(), input(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed (+68 more)

### Community 59 - "version"
Cohesion: 0.04
Nodes (63): side(), migrations(), deferred(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules (+55 more)

### Community 65 - "code"
Cohesion: 0.04
Nodes (55): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+47 more)

### Community 86 - ".off"
Cohesion: 0.04
Nodes (44): 0. Baseline and decisions, 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words (+36 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 113 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning (+30 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 138 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 139 - "package.json"
Cohesion: 0.06
Nodes (31): bin, umbradb, bugs, url, description, optional, engines, node (+23 more)

### Community 144 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 158 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 161 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (25): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+17 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 174 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 175 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 186 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 190 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 191 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 196 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 199 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.12
Nodes (11): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+3 more)

### Community 200 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 201 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 206 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 212 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 213 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 214 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 219 - "README.md"
Cohesion: 0.23
Nodes (4): Choosing a database, Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 220 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 221 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 225 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 226 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 229 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 230 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.17
Nodes (11): 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents, 7. `core-arch` criteria rewritten by this change, 8. Required test ids (+3 more)

### Community 232 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 233 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 234 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 235 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 236 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 237 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 238 - "[0.10.0] - 2026-10-27"
Cohesion: 0.20
Nodes (9): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changed since `v0.10.0-rc.2`: ledger nodes reclaimed by reference counting (`ledger-refcount`), Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface) (+1 more)

### Community 239 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 240 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 241 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 242 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 243 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 244 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 245 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 246 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 248 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 251 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 252 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 253 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 255 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 256 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 259 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 260 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 262 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 263 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 264 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 265 - "Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.25
Nodes (7): 0. Baseline, 1. Measurements on the recorded tapes (`design.md` §9, §13 phase 0), 6. Full verification (AGENTS.md stage 3), 7. Local preprod runs (`design.md` §12; manual evidence, never in CI), 8. Review (AGENTS.md stage 4, bounded), 9. Close-out, Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting

### Community 266 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 268 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 270 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 271 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 272 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 273 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 274 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 275 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 277 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 280 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 281 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 282 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 283 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 284 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 285 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 286 - "The scan action cannot exclude a single opengrep rule"
Cohesion: 0.33
Nodes (5): Current workaround, Evidence, Problem, Suggested fix, The scan action cannot exclude a single opengrep rule

### Community 287 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 288 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 289 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 290 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 291 - "Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`), What changes, Why

### Community 292 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 293 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 294 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 295 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 296 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 297 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 298 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 299 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 302 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 303 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 304 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 305 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 306 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 307 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 308 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 309 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 310 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 311 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 312 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 313 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 314 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 315 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 316 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 317 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 318 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 319 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 320 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 321 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 322 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 323 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 324 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 325 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 326 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 327 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 328 - "00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered"
Cohesion: 0.40
Nodes (4): 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered, Evidence, Problem, Suggested fix

### Community 329 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 330 - "00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)"
Cohesion: 0.40
Nodes (4): 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …), Evidence, Problem, Suggested fix

### Community 331 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 332 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 333 - "00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why"
Cohesion: 0.40
Nodes (4): 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why, Evidence, Problem, Suggested fix

### Community 334 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 335 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 336 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 337 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 338 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 339 - "00084 — The contents hash's key-ordered read splices its page size into `LIMIT`"
Cohesion: 0.40
Nodes (4): 00084 — The contents hash's key-ordered read splices its page size into `LIMIT`, Evidence, Problem, Suggested fix

### Community 340 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 341 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 342 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 346 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 347 - "Vendored ledger builds"
Cohesion: 0.40
Nodes (4): Rebuilding, Updating a version, Vendored ledger builds, What the patches add

### Community 349 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 350 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 351 - "00083 — Four timing-bound tests fail when the machine runs several test lanes at once"
Cohesion: 0.50
Nodes (3): 00083 — Four timing-bound tests fail when the machine runs several test lanes at once, Problem, Suggested fix

### Community 352 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 353 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 354 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 355 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 356 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 357 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 358 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-8949`, `RFC-8949`, `RFC-8949`, `RFC-3339`, `RFC-8949` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4380 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ModuleDeclaration`, `.from`, `migrate.ts`, `InMemoryBlockSource`, `ledger/types.ts`, `adapter-fixtures.ts`, `UmbraError`, `startUmbraDB`, `config/history.ts`, `ref_node_crypto`, `builds.ts`, `process-backends.ts`, `api.ts`, `ref_node_url`, `messages.ts`, `opt-out.test.ts`, `core-config.test.ts`, `tape/index.ts`, `process-admin.ts`, `client.test.ts`, `resolve.ts`, `channel-queue.test.ts`, `core-ledger-state.ts`, `NodeClient`, `validate.ts`, `validation.ts`, `core-block-parsed.ts`, `adapter.ts`, `BlockRef`, `ref_node_fs`, `runner/process.ts`, `writer-lock-checks.ts`, `chain-events-decode.test.ts`, `connectWebSocket`, `fetch-fixtures.ts`, `refused-configuration.test.ts`, `private/backends.ts`, `refcount-tapes.ts`, `ref_node_timers`, `halts.test.ts`, `contract-modules.test.ts`, `NodeBlockSource`, `loop-stop-harness.ts`, `builder.test.ts`, `ReadHandle`, `restore-ledger.ts`, `ledger-tapes.ts`, `backup/backup.ts`, `contract-data-checks.ts`, `refcount-restart.ts`, `transform-checks.ts`, `build-modules.ts`, `listening.test.ts`, `start-umbradb.ts`, `slow-block-harness.ts`, `column-rules.test.ts`, `node-format.ts`, `core-block-commit.test.ts`, `boundary.test.ts`, `private/lockstep-wait.test.ts`, `declaration.ts`, `ledger-storage.test.ts`, `mapping.ts`, `ingest-harness.ts`, `refcount-model.ts`, `interfaces/transaction-history-storage.ts`, `config/plain-data.ts`, `transport.test.ts`, `cli/command.ts`, `retirement.test.ts`, `core-private-source.ts`, `file-mode.test.ts`, `hex`, `api-session.test.ts`, `PointName`, `example-checks.ts`, `ledger-tasks-checks.ts`, `core-private-source.test.ts`, `configuration-refusal.test.ts`, `cbor.property.test.ts`, `real-tapes.ts`, `browser/build.ts`, `test/postgres/setup.ts`, `browser.test.ts`, `cold-boot-recovery.integration.test.ts`, `Worker`, `pg-tx-history-adapter.ts`, `networks.ts`, `release-version.ts`, `core.ts`, `vendored-ledger-v9.test.ts`, `node-set.test.ts`, `config-check-database.test.ts`, `api-server.test.ts`, `node-fields-harness.ts`, `code-registry.ts`, `postgres/transaction-history-storage.ts`, `package.json`, `order.property.test.ts`, `checks.test.ts`, `documents.ts`, `height-versioned.property.test.ts`, `read-gate.ts`, `src/ledger/identity.ts`, `crash.test.ts`, `validation.test.ts`, `demo-handlers.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `version-checks.ts`, `surface.test.ts`, `sweep-fixture.test.ts`, `backup/restore.ts`, `binding.test.ts`, `node-bridge.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `block-fetch-decode.test.ts`, `library-documents.test.ts`, `node-key-tapes.ts`, `describeNodeStoreExports`, `chain-events-source.test.ts`, `excluded-not-exported.test.ts`, `version.negative-control.test.ts`, `LoopPauses`, `ledger-liveness.test.ts`, `resolver-boundary.ts`, `process-access.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `node-source-status.test.ts`, `twox.ts`, `history.property.test.ts`, `postgres-image.test.ts`, `host-signal.ts`?**
  _High betweenness centrality (0.207) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-8949`, `RFC-8949` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ModuleDeclaration` be split into smaller, more focused modules?**
  _Cohesion score 0.01898160334590974 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `ModuleDeclaration`, `.from`, `migrate.ts`, `InMemoryBlockSource`, `ledger/types.ts`, `startUmbraDB`, `config/history.ts`, `ref_node_crypto`, `builds.ts`, `process-backends.ts`, `api.ts`, `messages.ts`, `opt-out.test.ts`, `core-config.test.ts`, `tape/index.ts`, `process-admin.ts`, `client.test.ts`, `resolve.ts`, `channel-queue.test.ts`, `core-ledger-state.ts`, `NodeClient`, `validate.ts`, `validation.ts`, `BlockRef`, `ref_node_fs`, `backupAtStop`, `runner/process.ts`, `writer-lock-checks.ts`, `fetch-fixtures.ts`, `refused-configuration.test.ts`, `ref_node_timers`, `halts.test.ts`, `contract-modules.test.ts`, `NodeBlockSource`, `loop-stop-harness.ts`, `FinalizedLoop`, `Process`, `ReadHandle`, `range.ts`, `backup/backup.ts`, `transform-checks.ts`, `listening.test.ts`, `start-umbradb.ts`, `slow-block-harness.ts`, `core-block-commit.test.ts`, `graph.ts`, `declaration.ts`, `mapping.ts`, `checkShape`, `config/plain-data.ts`, `transport.test.ts`, `cli/command.ts`, `cbor.ts`, `module-api.ts`, `core-private-source.ts`, `hex`, `public-database.ts`, `ledger-tasks-checks.ts`, `node-set.ts`, `core-private-source.test.ts`, `configuration-refusal.test.ts`, `api-server.test.ts`, `checks.test.ts`, `PrivateTransport`, `src/ledger/identity.ts`, `validation.test.ts`, `version-checks.ts`, `backup/restore.ts`, `binding.test.ts`, `buffer.ts`, `TapeBuilder`, `version-table.ts`, `ledger/metadata.ts`, `statementsOf`, `checkParent`, `ApiRoutes`, `browser/src/config/load.ts`, `SourceTransport`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `.from` be split into smaller, more focused modules?**
  _Cohesion score 0.025022731405710128 - nodes in this community are weakly interconnected._