# Graph Report - UmbraDB

## Corpus Check
- 1521 files · ~1,923,025 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 148 file(s) not represented in the graph (top: .bin 75, (none) 21, .patch 18)

## Summary
- 14235 nodes · 43672 edges · 414 communities (374 shown, 40 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3544 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `ffaf0bfb2b39646a` (1521 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- admin-harness.ts
- db/api.ts
- validate.ts
- module-api.ts
- graph.ts
- private/lockstep-wait.test.ts
- 12. Ledger
- LedgerEngine
- refcount-tables.test.ts
- src/db/postgres.ts
- graph-fixtures.ts
- options.ts
- version-checks.ts
- .from
- .off
- file-mode.test.ts
- worker-storage.test.ts
- cold-boot-recovery.integration.test.ts
- openPostgres
- core-private-source.test.ts
- refcount-model.ts
- browser/browser.test.ts
- PgliteDatabase
- browser/build.ts
- Worker
- column-rules.ts
- api-server.test.ts
- release-version.ts
- resolver-boundary.ts
- block-fetch-decode.test.ts
- client.test.ts
- fixtures/configuration.ts
- checks.test.ts
- .name
- crash.test.ts
- code-registry.ts
- documents.ts
- pglite-lock.ts
- refused
- cursor-table.test.ts
- api.test.ts
- stagenet.test.ts
- module-api.test.ts
- state-trees.test.ts
- process-context.test.ts
- NodeClient
- test/postgres/setup.ts
- TransactionHistoryEntry
- refcount-step.test.ts
- read-gate.ts
- hex
- db/errors.ts
- pg-tx-history-adapter.ts
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- restore-private.ts
- apply.ts
- ref_node_fs
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- connectChannel
- postgres/transaction-history-storage.ts
- core-transport.ts
- pack-install.mjs
- slow-block-windows.test.ts
- browser-harness.ts
- describeNodeStoreExports
- shims.test.ts
- validation.test.ts
- envelope.ts
- api-session.test.ts
- ref_node_timers
- childRefKeys
- HeightRun
- bench/harness.ts
- GraphWorld
- chrome.ts
- read-height.property.test.ts
- process-backends.ts
- adapter-fixtures.ts
- key-handling-checks.ts
- lockstep-refusals.test.ts
- tape/index.ts
- node-source.ts
- LoopPauses
- node-source.test.ts
- commit-proxy.ts
- range.test.ts
- private/part-migrations.test.ts
- database-fixtures.ts
- FakeNode
- ws-mutual-tls.test.ts
- config/plain-data.test.ts
- node-key-tapes.ts
- runner/process.ts
- no-indexer-or-wallet-sdk.test.ts
- core.ts
- web-lock.ts
- quiet-host.child.ts
- RawClient
- ledger/types.ts
- browser/serve.ts
- browser/src/config/load.ts
- Session
- Process
- .send
- taggedRootKey
- HeldHeight
- provenance.ts
- adapter.ts
- sha256
- ledger-state.test.ts
- ProcessItems
- ref_vitest
- signal-backup.worker.ts
- core-ledger-state.ts
- startUmbraDB
- resolve.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- channel-queue.test.ts
- builds.ts
- token-metadata/api.ts
- ModuleDeclaration
- core-block-parsed.ts
- restore-kill.worker.ts
- TokenMetadataStartAfterDatabase
- ledger-storage.test.ts
- TransactionHistoryReader
- TransactionHistoryWriter
- mounted-admin.test.ts
- NodeFS
- codec/src/index.ts
- validation.ts
- contract-data-checks.ts
- loop.test.ts
- core-block-commit.test.ts
- 5. Runner
- intake.test.ts
- cbor.ts
- FinalizedLoop
- contract-modules.test.ts
- messages.ts
- config/history.ts
- paused-harness.ts
- change-capture.ts
- spawnChild
- refcount-tapes.ts
- chain-data-tapes.ts
- BlockRef
- .read
- refcount-restart.ts
- range.ts
- UmbraError
- pglite.ts
- declaration.ts
- binding.test.ts
- writer-lock-checks.ts
- state.ts
- configured.ts
- LedgerPackage
- runner-core.ts
- postgres-server.ts
- PgTransactionHistoryStorage
- InMemoryBlockSource
- transform-checks.ts
- slow-block-harness.ts
- chain-process.test.ts
- token-metadata/harness.ts
- page.ts
- refcount-conversion.ts
- loop-stop-harness.ts
- node.test.ts
- state-vectors.test.ts
- interfaces/transaction-history-storage.ts
- node-fields-harness.ts
- .value
- loop.ts
- surface.test.ts
- checkShape
- signal-ignored-fixtures.ts
- boundary.test.ts
- transport.test.ts
- retirement.test.ts
- ledger/load.ts
- api-socket.ts
- ref_node_crypto
- log-reader.test.ts
- example-checks.ts
- ledger-units.test.ts
- zod
- height-versioned.test.ts
- node-format.ts
- ChannelEndpoint
- config/plain-data.ts
- mapping.ts
- zero-timeouts-checks.ts
- ADDED Requirements
- history
- .slowBlockMs
- graph.py
- .cwd
- encode
- ADDED Requirements
- Tasks — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0
- Design — v1.0.0 API Surface & Release Contract
- local-preprod-sync.mjs
- Decisions
- The laws of UmbraDB's storage helpers
- twox.ts
- Design — v1.1.0: Quint model checking
- facade-merge-loader.ts
- path.ts
- midnight-env — reproducible PREPROD dev environment
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- answers.test.ts
- fresh-instance.mjs
- package-keys-walk.mjs
- py.py
- crash-worker.ts
- .put
- version
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- ADDED Requirements
- package.json
- vectors/package.json
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- codec/package.json
- stryker.token-metadata.conf.json
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- mip
- mip
- ADDED Requirements
- ADDED Requirements
- Boundaries, threats and controls
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- README.md
- ADDED Requirements
- devDependencies
- compilerOptions
- compilerOptions
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
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
- ADDED Requirements
- Requirement: CC-3 `core-contract-logs-fast` stores the logs it can read, and records the rest as unresolved
- Proposal — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0 (`token-metadata`)
- Tasks — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- try.sh
- Proposal — FAST-LOGS-UNRESOLVED: the fast contract-log provider records what it cannot read instead of halting (`fast-logs-unresolved`)
- Acceptance — v1.0.0 API Surface & Release Contract
- Tasks — v1.0.0-infosec-signoff
- node.mjs
- Contributing
- UmbraDB in a browser
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- Midnight Foundation Security Policy
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- UmbraDB node architecture
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0 API Surface & Release Contract
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
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it
- 00072 — `umbradb run` logs nothing when SIGTERM or SIGINT stops it
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- 00084 — The contents hash's key-ordered read splices its page size into `LIMIT`
- 00085 — The fast contract-log provider limits mid-chain use: development-only, and it halts on partial transactions
- UmbraDB operator guide
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- real/manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00083 — Four timing-bound tests fail when the machine runs several test lanes at once
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- start-stack.sh
- peerDependenciesMeta
- repository
- graphify/run.sh
- Provenance of the copied Stagenet case expectations
- build-in-container.sh
- stats-module/run.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- vendor/mip0018/SOURCE.md
- fixtures/mip0018/SOURCE.md
- uri/README.md
- post-block-update/oracle/run.sh
- state-trees/oracle/run.sh
- modules-missing.ts
- modules-not-a-list.ts
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData

## God Nodes (most connected - your core abstractions)
1. `UmbraError` - 357 edges
2. `ModuleDeclaration` - 221 edges
3. `InMemoryBlockSource` - 180 edges
4. `FinalizedLoop` - 139 edges
5. `NodeClient` - 116 edges
6. `PROCESS_BACKENDS` - 116 edges
7. `BlockRef` - 105 edges
8. `startUmbraDB()` - 105 edges
9. `Database` - 104 edges
10. `ReadHandle` - 104 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `2.4 Migrations: one per part (O-2)` --references--> `checkApplied()`  [INFERRED]
  openspec/changes/ledger-refcount/design.md → src/db/migrate.ts

## Import Cycles
- None detected.

## Communities (414 total, 40 thin omitted)

### Community 0 - "admin-harness.ts"
Cohesion: 0.02
Nodes (177): AdminChannel, FromAdmin, ToAdmin, AdminServer, HeartbeatOptions, TimerHandle, EngineConfig, WorkerWithStreams (+169 more)

### Community 1 - "db/api.ts"
Cohesion: 0.03
Nodes (160): Bound, Database, ReadOnlyDatabase, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable (+152 more)

### Community 10 - "validate.ts"
Cohesion: 0.02
Nodes (134): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, RedactionForms, SecretForm (+126 more)

### Community 100 - "module-api.ts"
Cohesion: 0.07
Nodes (31): ReadOptions, ModuleApiStart, MountedApiSeams, ChainDataAnswer, ApiError, ApiErrorCode, ApiRequest, ApiResponse (+23 more)

### Community 101 - "graph.ts"
Cohesion: 0.08
Nodes (43): Edge, GraphFacts, GraphPart, HeightRange, MidChain, Missing, RangeCheck, RangeFacts (+35 more)

### Community 102 - "private/lockstep-wait.test.ts"
Cohesion: 0.07
Nodes (24): Report, OpenTransaction, ExpectedWait, WaitSample, HeldLink, HoldingRelay, ReportRelay, RetargetProxy (+16 more)

### Community 103 - "12. Ledger"
Cohesion: 0.12
Nodes (23): RetainedState, EvictionRefused, LedgerHost, LedgerWorkerFailure, NodeDatabase, NodeReader, PackageStartup, workerParser() (+15 more)

### Community 104 - "LedgerEngine"
Cohesion: 0.12
Nodes (15): LedgerEngine, LedgerTaskFailed, hexOf(), idOf(), same(), sameBytes(), runLedgerWorker(), atGenesis() (+7 more)

### Community 105 - "refcount-tables.test.ts"
Cohesion: 0.07
Nodes (34): NodeSetFault, NodeSetOptions, NodeTableCheck, SchemaTable, ContentFunction, ContentDefinition, ContentDefinedBuildOptions, Tables (+26 more)

### Community 106 - "src/db/postgres.ts"
Cohesion: 0.09
Nodes (36): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, DriverError, Outcome, Role (+28 more)

### Community 108 - "graph-fixtures.ts"
Cohesion: 0.07
Nodes (38): EntryRange, GraphInput, GraphRule, PastFaultCase, RefusalCase, contains(), resolveWith(), reader() (+30 more)

### Community 109 - "options.ts"
Cohesion: 0.10
Nodes (39): readOptions, addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding(), guarded(), isAbortSignal() (+31 more)

### Community 11 - "version-checks.ts"
Cohesion: 0.03
Nodes (112): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, Boundary, BoundaryBlock, builtInNetwork, Issue (+104 more)

### Community 110 - ".from"
Cohesion: 0.06
Nodes (36): contentsHash, Cbor, DigestRow, DigestRows, Reader, ReadableDatabase, hex(), hex() (+28 more)

### Community 111 - ".off"
Cohesion: 0.05
Nodes (38): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+30 more)

### Community 113 - "file-mode.test.ts"
Cohesion: 0.08
Nodes (31): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+23 more)

### Community 114 - "worker-storage.test.ts"
Cohesion: 0.09
Nodes (25): NodeStore, StoredNode, Thread, BridgeServer, bridgeStore, Growable, Nodes, bridgeMemory() (+17 more)

### Community 116 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (24): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+16 more)

### Community 119 - "openPostgres"
Cohesion: 0.08
Nodes (19): Phase, PostgresTestServer, openPostgres(), postgresBackend(), databaseAs(), postgresBackend(), TEST_CURSOR(), connectionOfUrl() (+11 more)

### Community 12 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (75): ChainCheck, ChainCheckInput, ChainIdentity, PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions (+67 more)

### Community 120 - "refcount-model.ts"
Cohesion: 0.09
Nodes (33): Node, BlockKind, BlockScript, BoundaryRewrite, DrivenBlock, GeneratedBlock, GeneratedState, GraphNode (+25 more)

### Community 121 - "browser/browser.test.ts"
Cohesion: 0.08
Nodes (36): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, heldClock, continuedProblems() (+28 more)

### Community 123 - "PgliteDatabase"
Cohesion: 0.11
Nodes (10): JobQueue, PgliteDatabase, Writer, commitRolledBack(), handleClosed(), allowMultiStatement(), failedEarlier(), nestedCall() (+2 more)

### Community 127 - "browser/build.ts"
Cohesion: 0.08
Nodes (27): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+19 more)

### Community 128 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 13 - "column-rules.ts"
Cohesion: 0.02
Nodes (107): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+99 more)

### Community 131 - "api-server.test.ts"
Cohesion: 0.09
Nodes (25): AppendsVersion, Client, Process, names(), configHashesOf(), duplicateProblems(), exchange(), helperProblems() (+17 more)

### Community 135 - "release-version.ts"
Cohesion: 0.13
Nodes (33): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+25 more)

### Community 136 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 139 - "block-fetch-decode.test.ts"
Cohesion: 0.11
Nodes (26): ExtrinsicCall, MetadataPallet, PalletSpec, blake2b256(), compress(), rotateRight(), words(), blockTimeOf() (+18 more)

### Community 14 - "client.test.ts"
Cohesion: 0.03
Nodes (76): Connection, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets (+68 more)

### Community 140 - "fixtures/configuration.ts"
Cohesion: 0.10
Nodes (24): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+16 more)

### Community 141 - "checks.test.ts"
Cohesion: 0.09
Nodes (24): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkId(), checkNames() (+16 more)

### Community 142 - ".name"
Cohesion: 0.09
Nodes (21): Fetching, Recorder, 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix, Requirement: TM-11 Every identity carries one mark, Requirement: TM-7 The latest value per field, in chain order (+13 more)

### Community 144 - "crash.test.ts"
Cohesion: 0.10
Nodes (25): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, SkipsStartAtRestart, WORKER, CrashJob (+17 more)

### Community 146 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 148 - "documents.ts"
Cohesion: 0.13
Nodes (28): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+20 more)

### Community 149 - "pglite-lock.ts"
Cohesion: 0.09
Nodes (21): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, ChildResult, isSqliteWarning() (+13 more)

### Community 15 - "refused"
Cohesion: 0.02
Nodes (117): demoLink, refused(), text(), transportReader(), transportReaderRule(), messagePortChannel(), cursorRead(), following() (+109 more)

### Community 150 - "cursor-table.test.ts"
Cohesion: 0.09
Nodes (24): CursorValue, cursorDatabase, Access, Block, BlockFails, Counts, Write, BlockFails (+16 more)

### Community 151 - "api.test.ts"
Cohesion: 0.08
Nodes (27): Got, hasColor(), tokenColor(), hex(), identity(), hex(), hex(), DEFAULT_MAX_CONCURRENT_REQUESTS (+19 more)

### Community 152 - "stagenet.test.ts"
Cohesion: 0.08
Nodes (26): Answer, CaseIndex, ExpectedField, ExpectedIdentity, ExpectedState, IndexSummary, json(), RefEvent (+18 more)

### Community 153 - "module-api.test.ts"
Cohesion: 0.09
Nodes (19): ApiRoutes, ModuleRegistration, AcceptsDuplicates, parsePath(), registerModuleApis(), shapeOf(), routesOf(), api() (+11 more)

### Community 154 - "state-trees.test.ts"
Cohesion: 0.09
Nodes (23): StateSummary, LedgerHeight, Ledger, AdapterSubject, NodeRoot, OracleState, OracleVersion, stateBytes() (+15 more)

### Community 158 - "process-context.test.ts"
Cohesion: 0.09
Nodes (20): MisuseListener, RunnerBackend, ContextsClass, serving(), a74Problems(), consumer(), latePublisher(), "on-start-db"() (+12 more)

### Community 16 - "NodeClient"
Cohesion: 0.05
Nodes (79): CoreChainBinding, FinalizedHeightOptions, HeadSubscriber, NodeCallOptions, NodeClient, Pending, State, Subscription (+71 more)

### Community 160 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 161 - "TransactionHistoryEntry"
Cohesion: 0.12
Nodes (12): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+4 more)

### Community 162 - "refcount-step.test.ts"
Cohesion: 0.11
Nodes (20): ComputedBlock, refcountStep, RefcountTables, RefcountBatch, Given, Halt, Outcome, bytesOf() (+12 more)

### Community 163 - "read-gate.ts"
Cohesion: 0.14
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 164 - "hex"
Cohesion: 0.16
Nodes (25): NodeRoot, freeAll(), bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free() (+17 more)

### Community 165 - "db/errors.ts"
Cohesion: 0.11
Nodes (19): PostgresConnection, PostgresOptions, ReadTimeoutSetting, ErrorCode, ErrorDetails, Case, openPostgres(), outcome() (+11 more)

### Community 166 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 167 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.08
Nodes (21): ReadPool, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider) (+13 more)

### Community 168 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+14 more)

### Community 169 - "apply.ts"
Cohesion: 0.13
Nodes (25): Candidate, LogReader, TokenMetadataLogError, TransactionHashes, EventRow, FieldRow, IdentityKey, Position (+17 more)

### Community 17 - "ref_node_fs"
Cohesion: 0.05
Nodes (85): RestoreInput, FileEntries, BackupBackend, BackupDatabase, killedRestore, TickerHandle, TickerProcess, FileRow (+77 more)

### Community 170 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 171 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 172 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 178 - "connectChannel"
Cohesion: 0.15
Nodes (13): SubscriptionCarrier, SubscriptionConnection, connectChannel(), errorMessage(), socketConnection(), fault(), 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once, Evidence (+5 more)

### Community 179 - "postgres/transaction-history-storage.ts"
Cohesion: 0.13
Nodes (15): JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections() (+7 more)

### Community 18 - "core-transport.ts"
Cohesion: 0.03
Nodes (77): PrivateLinkAddress, PrivateLinkConnect, ResultColumn, EndpointOptions, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued (+69 more)

### Community 181 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 183 - "slow-block-windows.test.ts"
Cohesion: 0.11
Nodes (19): HeightActivity, LockstepWait, SlowBlockEvent, SlowWindow, NeverClears, NeverClears, Held, Times (+11 more)

### Community 184 - "browser-harness.ts"
Cohesion: 0.17
Nodes (19): PageApiChannel, PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), contentsHashOf() (+11 more)

### Community 185 - "describeNodeStoreExports"
Cohesion: 0.14
Nodes (9): StoredNode, GenesisNodes, Disposable, NodeBatch, NodeStoreExports, NodeStoreSubject, hasEmbeddedChild(), describeNodeStoreExports() (+1 more)

### Community 186 - "shims.test.ts"
Cohesion: 0.13
Nodes (13): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+5 more)

### Community 187 - "validation.test.ts"
Cohesion: 0.11
Nodes (15): Case, ShapeCase, Stats, schemaName(), module(), declared(), contentDeclared(), failures() (+7 more)

### Community 188 - "envelope.ts"
Cohesion: 0.17
Nodes (17): ChainDataView, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions(), chainApi() (+9 more)

### Community 189 - "api-session.test.ts"
Cohesion: 0.13
Nodes (18): HeadersArgument, answerNotServing(), byteLength(), isCoreHeader(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing() (+10 more)

### Community 19 - "ref_node_timers"
Cohesion: 0.04
Nodes (85): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, ProcessHandle, cliProject, CommandResult, Renamed (+77 more)

### Community 190 - "childRefKeys"
Cohesion: 0.17
Nodes (9): nodeKeys, ChildReader, ChildVisitor, ModelBatch, ModelSnapshot, hashNode(), childRefKeys(), readChildList() (+1 more)

### Community 191 - "HeightRun"
Cohesion: 0.10
Nodes (9): HeightRun, PausesInsideTheHeight, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, CommitsDespiteLastWrite, WaitsInTransaction (+1 more)

### Community 193 - "bench/harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 196 - "GraphWorld"
Cohesion: 0.25
Nodes (3): Dice, GraphWorld, driveHistory()

### Community 197 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 198 - "read-height.property.test.ts"
Cohesion: 0.13
Nodes (12): TestBackend, HeldRead, Job, Outcome, Reads, Step, concurrent(), queued() (+4 more)

### Community 2 - "process-backends.ts"
Cohesion: 0.03
Nodes (168): CoreLedgerStateOptions, RefcountFault, NodeBatch, FixtureRun, FixtureRunOptions, SourceClass, Reader, Seen (+160 more)

### Community 20 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (93): DeployTx, Upstream, contractFixture, RawPackage, AdapterWorkerHost, LoadedState, Decimal, Fullness (+85 more)

### Community 200 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 202 - "lockstep-refusals.test.ts"
Cohesion: 0.22
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, a118Problems(), a118Run(), coreOn(), haltOf(), json() (+10 more)

### Community 21 - "tape/index.ts"
Cohesion: 0.05
Nodes (75): CompletenessRange, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError (+67 more)

### Community 211 - "node-source.ts"
Cohesion: 0.12
Nodes (11): BlockEventSource, BlockLedgerSource, NodeSourceOptions, Prefetch, LedgerBinding, NodeSubscription, systemEventsKey(), genesisStateOf() (+3 more)

### Community 212 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 214 - "node-source.test.ts"
Cohesion: 0.17
Nodes (14): Opened, RootWithoutSignal, at(), expectRootsEndWithTheirRun(), hashAndBlock(), open(), passFence(), quiet() (+6 more)

### Community 215 - "commit-proxy.ts"
Cohesion: 0.16
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 22 - "range.test.ts"
Cohesion: 0.03
Nodes (66): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Frame, ReportedTest (+58 more)

### Community 222 - "private/part-migrations.test.ts"
Cohesion: 0.20
Nodes (13): FoldedPart, RecordedMigration, earlierBootstrapSql(), earlierRefusalProblems(), earlierRows(), earlierRowsSql(), recorded(), rowsSql() (+5 more)

### Community 223 - "database-fixtures.ts"
Cohesion: 0.13
Nodes (10): CheckTarget, CliBackend, Snapshot, blocksSql(), pgliteCliBackend(), postgresCliBackend(), record(), rowsSql() (+2 more)

### Community 226 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 228 - "config/plain-data.test.ts"
Cohesion: 0.16
Nodes (8): Row, failures(), refusal(), thrown(), valueOf(), A26, files, OTHERS

### Community 229 - "node-key-tapes.ts"
Cohesion: 0.21
Nodes (9): NodeKeyTape, Written, checkTape(), nodeKeyTapeTest(), recording(), walkInFreshInstance(), backend, PACKAGE_PATHS (+1 more)

### Community 23 - "runner/process.ts"
Cohesion: 0.04
Nodes (66): ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ConfigRow, VerifyLedgerPackagesOptions, transportReaderFacts, RetryCode (+58 more)

### Community 231 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 232 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 233 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 237 - "quiet-host.child.ts"
Cohesion: 0.16
Nodes (10): Job, Outcome, Stated, until(), added, before, db, during (+2 more)

### Community 24 - "ledger/types.ts"
Cohesion: 0.04
Nodes (77): LoadLedger, LedgerName, ApplyInput, ApplyOutput, ChainOutcome, LedgerPackageOptions, LedgerTask, LedgerTaskBlock (+69 more)

### Community 240 - "browser/serve.ts"
Cohesion: 0.22
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 241 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 245 - "Session"
Cohesion: 0.23
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 25 - "Process"
Cohesion: 0.04
Nodes (39): ConfigFinding, LifecycleStatus, ProcessReason, ReasonCode, Unwrapped, PauseHold, LibraryChecks, Process (+31 more)

### Community 251 - "taggedRootKey"
Cohesion: 0.33
Nodes (5): Reader, decodeChild(), readChild(), readChildList(), taggedRootKey()

### Community 255 - "HeldHeight"
Cohesion: 0.22
Nodes (7): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, Evidence

### Community 259 - "provenance.ts"
Cohesion: 0.31
Nodes (9): Port, SourceRow, filesUnder(), portProblems(), ports(), provenanceProblems(), sha256Of(), sourceRows() (+1 more)

### Community 26 - "adapter.ts"
Cohesion: 0.03
Nodes (74): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+66 more)

### Community 260 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 27 - "ledger-state.test.ts"
Cohesion: 0.05
Nodes (80): TransactionResult, itemsSeen, Json, ingest, ledgerItemsSeen, recordedGenesis, Replay, Side (+72 more)

### Community 28 - "ref_vitest"
Cohesion: 0.02
Nodes (64): Lockfile, Manifest, RepositoryFile, Upstream, ReportedTest, gateAdapters(), tallyMutants(), partsOf() (+56 more)

### Community 282 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 29 - "core-ledger-state.ts"
Cohesion: 0.04
Nodes (82): LedgerStateItem, retainedStates, KeyCounts, RefcountCheck, RefcountStatement, CoreRevision, StateRow, StoredState (+74 more)

### Community 3 - "startUmbraDB"
Cohesion: 0.02
Nodes (133): PrivateLinkChannel, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork, UmbraDBOptions (+125 more)

### Community 30 - "resolve.ts"
Cohesion: 0.04
Nodes (87): coreEntry, AddressRequest, Asked, LinkPlan, NetworkContext, NetworkInput, NetworkProblem, NetworkRequest (+79 more)

### Community 300 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 31 - "channel-queue.test.ts"
Cohesion: 0.05
Nodes (72): Envelope, MessagePortLike, controlledTimers, PeerEnd, PeerMessage, rawPeer, TestEnd, TestEndOptions (+64 more)

### Community 32 - "builds.ts"
Cohesion: 0.05
Nodes (69): AdminStarter, DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, A168RunOptions, A176Options, TickerConfig (+61 more)

### Community 33 - "token-metadata/api.ts"
Cohesion: 0.04
Nodes (96): Answer, BuiltinJson, BytesJson, commonJson, ContractTokensCursor, EventFilter, EventJson, EventPositionJson (+88 more)

### Community 34 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (71): ConfigFacts, NetworkShown, OpenedConfig, AdminSeams, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions (+63 more)

### Community 36 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (81): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions (+73 more)

### Community 363 - "restore-kill.worker.ts"
Cohesion: 0.40
Nodes (3): RestoreJob, job, orphanGuard

### Community 369 - "TokenMetadataStartAfterDatabase"
Cohesion: 0.50
Nodes (3): TokenMetadataStartAfterDatabase, 19. A module UmbraDB ships: `token-metadata`, D9. Exports (task 4.3)

### Community 37 - "ledger-storage.test.ts"
Cohesion: 0.05
Nodes (75): watched, Call, RestartEvent, RestartJob, retentionSeen, ledgerScenario, LedgerTx, RawPackageClass (+67 more)

### Community 38 - "mounted-admin.test.ts"
Cohesion: 0.04
Nodes (71): gate, Compared, ConnectSeen, PortPeer, Expected, FactsRunOptions, SubscriptionSeen, Client (+63 more)

### Community 39 - "codec/src/index.ts"
Cohesion: 0.06
Nodes (74): ObservedMisc, IgnoreReason, Kind, RejectReason, ValType, BoundsInvariantError, DecodedRecord, DecodeFail (+66 more)

### Community 4 - "validation.ts"
Cohesion: 0.02
Nodes (150): AllowedDetail, MountedAdminAnswer, RevisionSettings, adminRoutes, SnapshotFacts, AdminEndpoint, AdminPart, AdminView (+142 more)

### Community 41 - "contract-data-checks.ts"
Cohesion: 0.06
Nodes (77): contractScenario, ContractScenarioOptions, LogLine, Program, Ran, ScenarioTx, handoff, HandoffAt (+69 more)

### Community 42 - "loop.test.ts"
Cohesion: 0.05
Nodes (63): LoopEnd, Contexts, Faults, LostCommit, Seen, AtGate, LoopClass, RunnerDatabase (+55 more)

### Community 43 - "core-block-commit.test.ts"
Cohesion: 0.04
Nodes (63): BlockRow, StandInOptions, Commit, blockHeaderOf(), checkParent(), commitBlock(), hex(), ledgerVersionOf() (+55 more)

### Community 44 - "5. Runner"
Cohesion: 0.05
Nodes (76): Callback, ParallelPoint, PointArguments, PointRun, CallEvent, Recorder, CheckName, GraphSpec (+68 more)

### Community 45 - "intake.test.ts"
Cohesion: 0.05
Nodes (59): PrivateProcess, PrivateSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation, A116Observation (+51 more)

### Community 46 - "cbor.ts"
Cohesion: 0.04
Nodes (74): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+66 more)

### Community 47 - "FinalizedLoop"
Cohesion: 0.05
Nodes (20): ResolvedRange, EntryBoundary, PointSchedule, FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, SkipsLockstep (+12 more)

### Community 48 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (67): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+59 more)

### Community 49 - "messages.ts"
Cohesion: 0.04
Nodes (51): PublicSide, Committed, HelloAck, JsonValue, MessageFault, ReadResult, StatementResult, CarrierConnection (+43 more)

### Community 5 - "config/history.ts"
Cohesion: 0.02
Nodes (157): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettings, CoreSettingsBase (+149 more)

### Community 50 - "paused-harness.ts"
Cohesion: 0.05
Nodes (65): Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, BackupOnSignal, LoopClass (+57 more)

### Community 51 - "change-capture.ts"
Cohesion: 0.05
Nodes (63): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow (+55 more)

### Community 52 - "spawnChild"
Cohesion: 0.03
Nodes (64): WORKER, SignalEvent, ParentJob, Kill, Orphaned, SourceFile, LockResult, Report (+56 more)

### Community 53 - "refcount-tapes.ts"
Cohesion: 0.05
Nodes (51): workerRecord, StoredCheck, Reader, RefcountTape, Sampler, TapeReplay, TapeReplayOptions, SweepModel (+43 more)

### Community 54 - "chain-data-tapes.ts"
Cohesion: 0.06
Nodes (66): BlockSpec, EventSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+58 more)

### Community 55 - "BlockRef"
Cohesion: 0.06
Nodes (18): HeadWait, NodeBlockSource, NodeHeader, BlockRef, PreparedBlock, QueueRunner, InMemorySourceOptions, EventsRunner (+10 more)

### Community 57 - ".read"
Cohesion: 0.05
Nodes (68): Op, States, TableName, identityRow(), captured(), captureFunction(), hex(), moduleM() (+60 more)

### Community 58 - "refcount-restart.ts"
Cohesion: 0.05
Nodes (57): BatchJson, ContentsHash, databaseNow, Hold, Light, Line, NodeSetKeeper, Observed (+49 more)

### Community 59 - "range.ts"
Cohesion: 0.05
Nodes (54): BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command (+46 more)

### Community 6 - "UmbraError"
Cohesion: 0.02
Nodes (147): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+139 more)

### Community 60 - "pglite.ts"
Cohesion: 0.05
Nodes (44): Job, ServerErrorFields, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer (+36 more)

### Community 61 - "declaration.ts"
Cohesion: 0.07
Nodes (38): EntryBuilder, UmbraConfig, BlockWriteHandle, ReadHandle, OwnPart, Ctx, cursorTable, CursorTableOptions (+30 more)

### Community 62 - "binding.test.ts"
Cohesion: 0.06
Nodes (51): PrivateIntakeOptions, A165Options, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding (+43 more)

### Community 63 - "writer-lock-checks.ts"
Cohesion: 0.08
Nodes (47): PostgresOptions, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), expectRefusedBeforeAnyWrite() (+39 more)

### Community 64 - "state.ts"
Cohesion: 0.05
Nodes (48): ImageJson, markJson, ChainOrderError, ChainPosition, FieldEffect, MarkInput, MarkKind, MetadataState (+40 more)

### Community 65 - "configured.ts"
Cohesion: 0.07
Nodes (52): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, RestoreChain, RestoreSeams, BackupOutcome, commandTarget, DatabaseState (+44 more)

### Community 66 - "LedgerPackage"
Cohesion: 0.05
Nodes (40): LedgerPackage, Driver, StagenetBlockJson, StagenetFixtureJson, stagenetReplay, storeOf(), bytes(), carriedLoadProblems() (+32 more)

### Community 67 - "runner-core.ts"
Cohesion: 0.06
Nodes (53): ManifestEntry, Comparison, Json, Args, LineConsumer, Consumer, Json, LoadedVector (+45 more)

### Community 68 - "postgres-server.ts"
Cohesion: 0.06
Nodes (40): BenchEnv, SslMode, driverConnectionOptions, PostgresConnection, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+32 more)

### Community 69 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (53): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity (+45 more)

### Community 7 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (137): CoreBlockItems, InMemoryBlockSource, EngineBuild, EngineNetwork, ProcessingEnd, ProcessStatus, Flaky, ProcessObservation (+129 more)

### Community 70 - "transform-checks.ts"
Cohesion: 0.09
Nodes (38): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, baseRecords() (+30 more)

### Community 71 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (49): BlockItemSource, LoopInput, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+41 more)

### Community 72 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (47): Job, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Failing, Flaky (+39 more)

### Community 73 - "token-metadata/harness.ts"
Cohesion: 0.06
Nodes (49): InMemoryItems, Handler, Json, Handler, Json, Halt, Run, RunOptions (+41 more)

### Community 74 - "page.ts"
Cohesion: 0.05
Nodes (44): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, Scope (+36 more)

### Community 75 - "refcount-conversion.ts"
Cohesion: 0.08
Nodes (52): FixtureConfig, ContractRow, conversionRun, Released, bytesOf(), seenTables(), sweepCore(), sweepTables() (+44 more)

### Community 76 - "loop-stop-harness.ts"
Cohesion: 0.09
Nodes (43): NodeClientOptions, A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation (+35 more)

### Community 77 - "node.test.ts"
Cohesion: 0.06
Nodes (31): Metadata, Step, Failure, Variant, TapeError, TapeClock, Tape, expectAnswersByOccurrence() (+23 more)

### Community 78 - "state-vectors.test.ts"
Cohesion: 0.06
Nodes (46): GroupableIdentity, IdentityRef, IdentityState, ObservedEvent, SymbolGroup, Generated, Applied, Step (+38 more)

### Community 79 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (40): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, Command, ReplayableStorage (+32 more)

### Community 8 - "node-fields-harness.ts"
Cohesion: 0.03
Nodes (134): ProcessCondition, Scenario, A168Observation, A168Phase, Expected, GatedConnector, StatusReader, ArgType (+126 more)

### Community 80 - ".value"
Cohesion: 0.12
Nodes (29): MetadataField, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef, ScaleError, ScaleReader (+21 more)

### Community 81 - "loop.ts"
Cohesion: 0.06
Nodes (32): QueuedBlock, PointName, BlockItems, LateUse, CallbackFailure, Activity, HeightFailure, Invoke (+24 more)

### Community 82 - "surface.test.ts"
Cohesion: 0.06
Nodes (49): Document, EntryInput, Renamed, Surface, SurfaceAmendment, changelogEntryProblems(), entryTerms(), namesWord() (+41 more)

### Community 83 - "checkShape"
Cohesion: 0.06
Nodes (42): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+34 more)

### Community 84 - "signal-ignored-fixtures.ts"
Cohesion: 0.06
Nodes (36): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+28 more)

### Community 85 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 86 - "transport.test.ts"
Cohesion: 0.07
Nodes (29): Message, MessageType, Ended, rawClient, Escape, publicState, Refused, TransportProxy (+21 more)

### Community 87 - "retirement.test.ts"
Cohesion: 0.06
Nodes (44): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+36 more)

### Community 88 - "ledger/load.ts"
Cohesion: 0.07
Nodes (33): LedgerReleasePackage, V9Logs, SlowStep, TestLoaderData, loadLedgerPackage(), createV8Adapter(), createV9Adapter(), createV9Rc3Adapter() (+25 more)

### Community 89 - "api-socket.ts"
Cohesion: 0.10
Nodes (41): coreHeaders, NodeHttpHandler, NodeUpgradeHandler, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits (+33 more)

### Community 9 - "ref_node_crypto"
Cohesion: 0.03
Nodes (111): CheckedMigration, CanonicalEncodingError, ContentOptions, TableContent, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+103 more)

### Community 90 - "log-reader.test.ts"
Cohesion: 0.07
Nodes (33): NotACell, Reader, UnknownLogSerialization, Package, alignment(), atom(), atomWith(), miscAtom() (+25 more)

### Community 91 - "example-checks.ts"
Cohesion: 0.08
Nodes (27): Served, Finding, BlockImport, ChildResult, CodeBlock, installedProject, isolationProblems(), serveCommand() (+19 more)

### Community 92 - "ledger-units.test.ts"
Cohesion: 0.08
Nodes (34): ManifestLine, Path, LedgerSource, LedgerSourceSettings, Point, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage() (+26 more)

### Community 93 - "zod"
Cohesion: 0.07
Nodes (33): StatsRow, Outcome, CoreContractStatesOptions, ContractStateRow, insertRow(), lastTotal(), recentRows(), rowAt() (+25 more)

### Community 94 - "height-versioned.test.ts"
Cohesion: 0.09
Nodes (31): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+23 more)

### Community 95 - "node-format.ts"
Cohesion: 0.09
Nodes (40): byReference, KeyOf, Walk, nodeKey(), probe(), keyOf(), rowOf(), childKeys() (+32 more)

### Community 96 - "ChannelEndpoint"
Cohesion: 0.09
Nodes (13): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), messageEnvelope(), refuseChannel(), discard(), isChannel() (+5 more)

### Community 97 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (38): ImportedConfig, LoadedConfig, LoadOptions, PlainArray, plainData, PlainDataNode, PlainDataRule, Walk (+30 more)

### Community 98 - "mapping.ts"
Cohesion: 0.08
Nodes (31): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+23 more)

### Community 99 - "zero-timeouts-checks.ts"
Cohesion: 0.09
Nodes (33): Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead(), engine() (+25 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+27 more)

### Community 35 - "history"
Cohesion: 0.03
Nodes (87): history(), data(), 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants, 2.4 Migrations: one per part (O-2), 2.5 Content-based determinism (O-8; DT-3, DT-4), 2. Storage (+79 more)

### Community 115 - ".slowBlockMs"
Cohesion: 0.06
Nodes (34): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+26 more)

### Community 124 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 129 - ".cwd"
Cohesion: 0.06
Nodes (34): 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented, Evidence, Problem, Suggested fix, 00067 — `startUmbraDB` throws synchronously when the host's working directory no longer exists, Evidence, Problem, Suggested fix (+26 more)

### Community 138 - "encode"
Cohesion: 0.06
Nodes (31): compact(), encode(), 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature (+23 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter (+23 more)

### Community 145 - "Tasks — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0"
Cohesion: 0.06
Nodes (30): note(), ignore(), Endpoints, Errors, General rules, `GET /v1/contracts/{address}/tokens?limit=&cursor=`, `GET /v1/events?contract=&tx=&limit=&cursor=`, `GET /v1/identities/{contract}/{domainSep}/{kind}?limit=&cursor=` (+22 more)

### Community 201 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.10
Nodes (18): up(), name, 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 3.1 The frozen catalog (the machine-facing API) (+10 more)

### Community 210 - "local-preprod-sync.mjs"
Cohesion: 0.21
Nodes (17): commitOf(), configText(), docker(), dockerHas(), dockerLater(), imageDigests(), main(), nodeRpc() (+9 more)

### Community 217 - "Decisions"
Cohesion: 0.12
Nodes (16): params(), 7. The module API, Context, D1. A module, not an archive and a scanner, D2. Starting with the database (TM-1), D4. Per block, D5. The API, D6. Candidates from a log's `data` (TM-2, TM-3) (+8 more)

### Community 218 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.12
Nodes (14): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers, ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks) (+6 more)

### Community 239 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 244 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 247 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 274 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 277 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 285 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 291 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 302 - "answers.test.ts"
Cohesion: 0.33
Nodes (5): problems(), sha256(), DIR, files, table

### Community 364 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 365 - "package-keys-walk.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 380 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 40 - ".put"
Cohesion: 0.03
Nodes (80): T(), input(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed (+72 more)

### Community 56 - "version"
Cohesion: 0.03
Nodes (71): side(), migrations(), deferred(), version(), Bounded review, Engineering rules, Lean, Model floors (+63 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+31 more)

### Community 122 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+29 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning, Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune (+27 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Purpose, Requirement: TM-10 Symbol groups have two or more members of one contract, Requirement: TM-12 The proof of concept's metadata API, from finalized data, Requirement: TM-13 What the first port serves differently, Requirement: TM-14 Stored rows are a pure function of the chain, Requirement: TM-15 Payload bytes and served values are untrusted, Requirement: TM-16 It runs in the browser build (+27 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 147 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+21 more)

### Community 157 - "package.json"
Cohesion: 0.07
Nodes (29): bin, umbradb, bugs, url, description, engines, node, exports (+21 more)

### Community 159 - "vectors/package.json"
Cohesion: 0.07
Nodes (29): description, devDependencies, ajv, @types/node, typescript, vitest, engines, node (+21 more)

### Community 173 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.07
Nodes (26): 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words, 3.1 Where it runs (+18 more)

### Community 174 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 175 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.08
Nodes (21): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+13 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 177 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 180 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 182 - "codec/package.json"
Cohesion: 0.08
Nodes (23): description, devDependencies, @mip0018/vectors, @types/node, typescript, vitest, engines, node (+15 more)

### Community 192 - "stryker.token-metadata.conf.json"
Cohesion: 0.09
Nodes (22): cleanTempDir, _comment, concurrency, coverageAnalysis, disableTypeChecks, htmlReporter, fileName, jsonReporter (+14 more)

### Community 194 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 195 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 199 - "mip"
Cohesion: 0.10
Nodes (20): counts, informative-payload, informative-state, normative-payload, normative-state, total, eventName, hex (+12 more)

### Community 203 - "mip"
Cohesion: 0.10
Nodes (19): counts, informative-payload, informative-state, normative-payload, normative-state, total, eventName, hex (+11 more)

### Community 204 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 207 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (18): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+10 more)

### Community 208 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 209 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 213 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 216 - "README.md"
Cohesion: 0.18
Nodes (6): Choosing a database, Launching it, stats-module, Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 219 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 220 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 221 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleResolution, noEmit, noImplicitOverride (+8 more)

### Community 224 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleResolution, noEmit, noImplicitOverride (+8 more)

### Community 227 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 230 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowImportingTsExtensions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess (+6 more)

### Community 234 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 235 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 236 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 242 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 243 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 246 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 248 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 249 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.17
Nodes (11): 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents, 7. `core-arch` criteria rewritten by this change, 8. Required test ids (+3 more)

### Community 252 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 253 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 254 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 256 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 257 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 258 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 261 - "[0.10.0] - 2026-10-27"
Cohesion: 0.20
Nodes (9): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changed since `v0.10.0-rc.2`: ledger nodes reclaimed by reference counting (`ledger-refcount`), Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface) (+1 more)

### Community 262 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 263 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 264 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 265 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 266 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 267 - "Requirement: CC-3 `core-contract-logs-fast` stores the logs it can read, and records the rest as unresolved"
Cohesion: 0.20
Nodes (9): ADDED Requirements, MODIFIED Requirements, Requirement: CC-3 `core-contract-logs-fast` stores the logs it can read, and records the rest as unresolved, Requirement: CC-5 Unresolved sites are part of the contract-logs item, Scenario: A computed log value, Scenario: A consumer reads both, Scenario: A partially successful transaction, Scenario: Fast equals full without unresolved sites (+1 more)

### Community 268 - "Proposal — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0 (`token-metadata`)"
Cohesion: 0.20
Nodes (9): Capabilities, Decisions taken (2026-11-05), Impact, Modified Capabilities, New Capabilities, Non-goals (what this change does NOT cover), Proposal — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0 (`token-metadata`), What changes (+1 more)

### Community 269 - "Tasks — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 1. Pre-freeze: retryability field (G3), 2. Pre-freeze: strip / mark-experimental the chain-archive error classes (G3), 3. The freeze: build + package.json (G1), 4. The freeze: the public barrel (G1), 5. Release contract docs (G2, G4), 6. Freeze the Lean cut-line (G20), 7. Packed-tarball install smoke test (G1), 8. Change close-out (+1 more)

### Community 270 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 271 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 272 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 275 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 276 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 278 - "Proposal — FAST-LOGS-UNRESOLVED: the fast contract-log provider records what it cannot read instead of halting (`fast-logs-unresolved`)"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal — FAST-LOGS-UNRESOLVED: the fast contract-log provider records what it cannot read instead of halting (`fast-logs-unresolved`), What changes, Why

### Community 279 - "Acceptance — v1.0.0 API Surface & Release Contract"
Cohesion: 0.22
Nodes (8): Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in), Precondition (blocks the whole change)

### Community 280 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 281 - "node.mjs"
Cohesion: 0.28
Nodes (5): cases, out, ABS, URI, RFC-3986

### Community 283 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 284 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 286 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 287 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 288 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 289 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 290 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 292 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 293 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 294 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 295 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 296 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 297 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 298 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 299 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 301 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 304 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 305 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 306 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 307 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.33
Nodes (5): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Problem, Resolution, Suggested fix

### Community 308 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 309 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 310 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 311 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 312 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 313 - "Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`), What changes, Why

### Community 314 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 315 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 316 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 317 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 318 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, What changes — the 1.0.0 gate items this change addresses, Why

### Community 319 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 320 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 321 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 322 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 323 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 324 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 325 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 326 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 327 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 328 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 329 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 330 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 331 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 332 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 333 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 334 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 335 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 336 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 337 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 338 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 339 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 340 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 341 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 342 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 343 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 344 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 345 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 346 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 347 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 348 - "00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it"
Cohesion: 0.40
Nodes (4): 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it, Evidence, Problem, Suggested fix

### Community 349 - "00072 — `umbradb run` logs nothing when SIGTERM or SIGINT stops it"
Cohesion: 0.40
Nodes (4): 00072 — `umbradb run` logs nothing when SIGTERM or SIGINT stops it, Evidence, Problem, Suggested fix

### Community 350 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 351 - "00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why"
Cohesion: 0.40
Nodes (4): 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why, Evidence, Problem, Suggested fix

### Community 352 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 353 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 354 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 355 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 356 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 357 - "00084 — The contents hash's key-ordered read splices its page size into `LIMIT`"
Cohesion: 0.40
Nodes (4): 00084 — The contents hash's key-ordered read splices its page size into `LIMIT`, Evidence, Problem, Suggested fix

### Community 358 - "00085 — The fast contract-log provider limits mid-chain use: development-only, and it halts on partial transactions"
Cohesion: 0.40
Nodes (4): 00085 — The fast contract-log provider limits mid-chain use: development-only, and it halts on partial transactions, Evidence, Problem, Suggested fix

### Community 359 - "UmbraDB operator guide"
Cohesion: 0.40
Nodes (5): A paused loop on `/status`, A private process and a changed public configuration, The node on `/status`, Token metadata (MIP-0018): `token-metadata`, UmbraDB operator guide

### Community 360 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 361 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 362 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 366 - "real/manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 367 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 368 - "00083 — Four timing-bound tests fail when the machine runs several test lanes at once"
Cohesion: 0.50
Nodes (3): 00083 — Four timing-bound tests fail when the machine runs several test lanes at once, Problem, Suggested fix

### Community 370 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 371 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 372 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 373 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 376 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 377 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 378 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 383 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 384 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **79 isolated node(s):** `RFC-3339`, `RFC-9110`, `RFC-6455`, `RFC-8949`, `RFC-3339` (+74 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4814 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `UmbraError` connect `UmbraError` to `admin-harness.ts`, `db/api.ts`, `process-backends.ts`, `startUmbraDB`, `validation.ts`, `config/history.ts`, `InMemoryBlockSource`, `node-fields-harness.ts`, `ref_node_crypto`, `validate.ts`, `version-checks.ts`, `core-private-source.test.ts`, `column-rules.ts`, `client.test.ts`, `refused`, `NodeClient`, `core-transport.ts`, `ref_node_timers`, `tape/index.ts`, `runner/process.ts`, `Process`, `ref_vitest`, `core-ledger-state.ts`, `resolve.ts`, `channel-queue.test.ts`, `builds.ts`, `ModuleDeclaration`, `contract-data-checks.ts`, `loop.test.ts`, `core-block-commit.test.ts`, `intake.test.ts`, `cbor.ts`, `FinalizedLoop`, `contract-modules.test.ts`, `messages.ts`, `paused-harness.ts`, `BlockRef`, `version`, `.read`, `range.ts`, `pglite.ts`, `declaration.ts`, `binding.test.ts`, `writer-lock-checks.ts`, `configured.ts`, `postgres-server.ts`, `transform-checks.ts`, `slow-block-harness.ts`, `chain-process.test.ts`, `loop.ts`, `checkShape`, `ledger-units.test.ts`, `height-versioned.test.ts`, `config/plain-data.ts`, `mapping.ts`, `zero-timeouts-checks.ts`, `module-api.ts`, `graph.ts`, `12. Ledger`, `refcount-tables.test.ts`, `src/db/postgres.ts`, `graph-fixtures.ts`, `options.ts`, `openPostgres`, `PgliteDatabase`, `api-server.test.ts`, `checks.test.ts`, `pglite-lock.ts`, `cursor-table.test.ts`, `module-api.test.ts`, `process-context.test.ts`, `refcount-step.test.ts`, `db/errors.ts`, `slow-block-windows.test.ts`, `shims.test.ts`, `validation.test.ts`, `envelope.ts`, `lockstep-refusals.test.ts`, `node-source.ts`, `node-source.test.ts`, `private/part-migrations.test.ts`, `config/plain-data.test.ts`, `web-lock.ts`, `browser/src/config/load.ts`, `Session`, `sha256`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-9110`, `RFC-6455` to the rest of the system?**
  _79 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.021112587810898045 - nodes in this community are weakly interconnected._
- **Why does `PgTransactionHistoryStorage` connect `PgTransactionHistoryStorage` to `TransactionHistoryEntry`, `ADDED Requirements`, `pg-tx-history-adapter.ts`, `.put`, `encode`, `Design — v1.0.0-perf-baseline`, `interfaces/transaction-history-storage.ts`, `ADDED Requirements`, `postgres/transaction-history-storage.ts`, `cold-boot-recovery.integration.test.ts`, `TransactionHistory (kept, not built)`, `ADDED Requirements`, `Proposal — v1.0.0 API Surface & Release Contract`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `db/api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.027149321266968326 - nodes in this community are weakly interconnected._