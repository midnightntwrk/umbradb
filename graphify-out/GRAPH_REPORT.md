# Graph Report - UmbraDB

## Corpus Check
- 1292 files · ~1,827,023 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .patch 18, (none) 16, .lean 11)

## Summary
- 13306 nodes · 41578 edges · 397 communities (348 shown, 49 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3459 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `57c34eac83c4cc27` (1292 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- process-backends.ts
- loop.ts
- NodeClient
- resolver-boundary.ts
- PointName
- cbor.property.test.ts
- browser.test.ts
- node.test.ts
- test/postgres/setup.ts
- restore-private.ts
- UmbraError
- worker-storage.test.ts
- format.test.ts
- builds.ts
- messages.ts
- order.property.test.ts
- Worker
- backup-fixtures.ts
- validation.ts
- paused-harness.ts
- release-version.ts
- pg-tx-history-adapter.ts
- version-checks.ts
- core.ts
- browser/build.ts
- api-session.test.ts
- core-block-parsed.ts
- TransactionHistoryStorage
- childRefKeys
- process-worker.ts
- code-registry.ts
- checks.test.ts
- documents.ts
- mapping.ts
- config/history.ts
- BlockRef
- interfaces/transaction-history-storage.ts
- node-fields-harness.ts
- read-gate.ts
- threat-model.test.ts
- fixtures/configuration.ts
- backupAtStop
- example-checks.ts
- client.test.ts
- validation.test.ts
- height-versioned.property.test.ts
- api-server.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- builder.ts
- 5. Runner
- validate.ts
- build-modules.ts
- cli/run.ts
- ResolvedRange
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- containers.test.ts
- block-fetch-decode.test.ts
- Transaction
- src/ledger/identity.ts
- lockstep-reads.test.ts
- declaration.ts
- worker-host.test.ts
- BlockSource
- sweep-fixture.test.ts
- Database
- restore-content-defined.test.ts
- chrome.ts
- 3. Block source and ingest
- lockstep-refusals.test.ts
- refcount-restart-preprod.ts
- messagePortChannel
- NodeBlockSource
- ledger-table-config.test.ts
- GraphWorld
- browser-harness.ts
- transport-intake.test.ts
- LoopPauses
- ingest-harness.ts
- runner/process.ts
- FakeNode
- commit-proxy.ts
- version-table.ts
- private/part-migrations.test.ts
- statementsOf
- core-config.test.ts
- no-indexer-or-wallet-sdk.test.ts
- browser/serve.ts
- ApiRoutes
- binding.test.ts
- browser/src/config/load.ts
- Heartbeat
- stats-module.ts
- Design — Sprint 1: project setup + TemporalKV
- vitest
- SubscriptionConnection
- .send
- ledger/plain-data.ts
- TapeAnswers
- channel-queue.test.ts
- start-umbradb.ts
- ProcessItems
- adapter-fixtures.ts
- spawnChild
- mutation-evidence.d.mts
- AsyncLocalStorage
- database-parts.ts
- adapter.ts
- migrate.ts
- config-check.ts
- transport-faults.test.ts
- host.ts
- Process
- ref_node_timers
- listenerProblems
- PageApiChannel
- NodeFS
- zero-timeouts-checks.ts
- backup/restore.ts
- PausesInsideTheHeight
- SkipsLockstep
- WaitingInRead
- contract-modules.test.ts
- ItemsAfterWrite
- SilentHalt
- FailingAfter
- DropsHeld
- NoRedelivery
- CommitsTheBoundary
- core-block-commit.test.ts
- InMemoryBlockSource
- .put
- .from
- LedgerPackage
- ModuleDeclaration
- core-ledger-state.ts
- refused-configuration.test.ts
- ledger/types.ts
- loop-stop-harness.ts
- ledger-storage.test.ts
- contract-data-checks.ts
- column-rules.ts
- slow-block-harness.ts
- chain-process.test.ts
- backup/backup.ts
- hex
- node-format.ts
- core-ledger-state/sql.ts
- core-channels.ts
- core-transport.ts
- admin-harness.ts
- refcount-model.ts
- ledger/ledger-tasks.test.ts
- PgTransactionHistoryStorage
- config/plain-data.ts
- 12. Ledger
- transforms.test.ts
- .value
- column-rules.test.ts
- determinism/contents-hash.ts
- private-transport.ts
- builder.test.ts
- shims.test.ts
- node-set.test.ts
- boundary.test.ts
- jsonText
- records.ts
- FinalizedLoop
- DatabaseParts
- checkShape
- postgres/transaction-history-storage.ts
- refcount-restart.ts
- surface.test.ts
- retirement.test.ts
- api-socket.ts
- cbor.ts
- graph.ts
- page.ts
- private/backends.ts
- module-api.ts
- real-tapes.ts
- config-hash-checks.ts
- local-preprod-sync.mjs
- networks.ts
- file-mode.test.ts
- pglite-lock.ts
- The database
- data
- table
- refused
- core-private-source.test.ts
- graph.py
- cold-boot-recovery.integration.test.ts
- .slowBlockMs
- log
- restoreBackup
- Design — START-UMBRADB: UmbraDB as a library
- reason
- config-check.test.ts
- .cwd
- core-block-parsed/sql.ts
- .disconnect
- conformance-gate.mjs
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- Boundaries, threats and controls
- Requirement: BK-1 Backup
- v9
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- parseJsonLossless
- readBody
- .slowBlock
- version
- crash-worker.ts
- history
- code
- T
- .off
- startUmbraDB
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- package.json
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- ADDED Requirements
- Requirement: DT-3 The contents hash
- [0.10.0] - 2026-10-27
- explore.md
- README.md
- ROADMAP.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Requirement: CF-4 Every field is data, operational or secret
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- scoped-review-manifest
- UmbraDB 0.10.0 threat model
- try.sh
- ADDED Requirements
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0-infosec-signoff
- Contributing
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Requirement: PP-4 The process transport
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- The scan action cannot exclude a single opengrep rule
- UmbraDB node architecture
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-infosec-signoff
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- dependencies
- lib.sh
- Vendored ledger builds
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
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
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- 00084 — The contents hash's key-ordered read splices its page size into `LIMIT`
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- Midnight Foundation Security Policy
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes
- 00083 — Four timing-bound tests fail when the machine runs several test lanes at once
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Test wallets
- Spec — capability `formal-completion`
- renovate.json
- stats-module
- start-stack.sh
- peerDependenciesMeta
- repository
- graphify/run.sh
- build-in-container.sh
- stats-module/run.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bin
- engines
- peerDependencies
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
- `Evidence` --references--> `ManualTimers`  [INFERRED]
  docs/issues/00016-heartbeat-above-timer-limit.md → test/node/manual-timers.ts
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (397 total, 49 thin omitted)

### Community 0 - "process-backends.ts"
Cohesion: 0.02
Nodes (226): CoreLedgerStateOptions, RefcountFault, NodeBatch, contentsHash, FixtureRun, FixtureRunOptions, Reader, Seen (+218 more)

### Community 1 - "loop.ts"
Cohesion: 0.02
Nodes (185): ReadOnlyDatabase, Revision, EntryRange, GraphInput, HeightRange, ResolvedGraph, CallbackFailure, CommitOutcome (+177 more)

### Community 10 - "NodeClient"
Cohesion: 0.03
Nodes (105): FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+97 more)

### Community 100 - "resolver-boundary.ts"
Cohesion: 0.08
Nodes (35): Finding, Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve() (+27 more)

### Community 101 - "PointName"
Cohesion: 0.08
Nodes (30): PointName, HeightFailure, Misuse, CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER (+22 more)

### Community 102 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (37): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+29 more)

### Community 103 - "browser.test.ts"
Cohesion: 0.07
Nodes (37): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, heldClock, continuedProblems() (+29 more)

### Community 104 - "node.test.ts"
Cohesion: 0.08
Nodes (13): RawClient, Failure, Variant, TapeClock, expectAnswersByOccurrence(), expectNotificationsAfterCalls(), withNode(), randomPort() (+5 more)

### Community 106 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 109 - "restore-private.ts"
Cohesion: 0.11
Nodes (30): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSideOptions, isEmptyDatabase(), empty() (+22 more)

### Community 11 - "UmbraError"
Cohesion: 0.03
Nodes (80): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions (+72 more)

### Community 110 - "worker-storage.test.ts"
Cohesion: 0.09
Nodes (24): NodeStore, StoredNode, Thread, BridgeServer, bridgeStore, Growable, Nodes, bridgeMemory() (+16 more)

### Community 111 - "format.test.ts"
Cohesion: 0.09
Nodes (29): Metadata, Step, Arguments, Command, TapeError, expectGoldenRoundTrip(), boundaries(), check() (+21 more)

### Community 114 - "builds.ts"
Cohesion: 0.08
Nodes (23): EngineInput, ChannelCoreOptions, ChannelPrivateOptions, PrivateRefusal, Pem, TestCertificates, runProcess(), commandRun() (+15 more)

### Community 115 - "messages.ts"
Cohesion: 0.07
Nodes (32): Committed, MessageFault, MessageType, bytesOf(), decodeParameter(), decodeValue(), describe(), elementType() (+24 more)

### Community 118 - "order.property.test.ts"
Cohesion: 0.09
Nodes (32): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce() (+24 more)

### Community 119 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 12 - "backup-fixtures.ts"
Cohesion: 0.04
Nodes (102): RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, TickerHandle, TickerProcess, BackupOnSignal, LoopClass (+94 more)

### Community 121 - "validation.ts"
Cohesion: 0.06
Nodes (33): GraphPart, DeclarationOrigin, PlacedDeclaration, Plain, Validator, schemaFile(), text(), validatorOf() (+25 more)

### Community 122 - "paused-harness.ts"
Cohesion: 0.12
Nodes (29): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, a176Project() (+21 more)

### Community 123 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 124 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (24): LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+16 more)

### Community 125 - "version-checks.ts"
Cohesion: 0.10
Nodes (23): MetadataNode, LedgerSelection, VersionedBlock, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase (+15 more)

### Community 126 - "core.ts"
Cohesion: 0.12
Nodes (25): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+17 more)

### Community 127 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 128 - "api-session.test.ts"
Cohesion: 0.09
Nodes (23): HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, Mountable, Mounted, answerNotServing(), byteLength(), lifecycleBody() (+15 more)

### Community 13 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (120): BlockEventSource, BodyExtrinsic, ExtrinsicCall, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions (+112 more)

### Community 130 - "TransactionHistoryStorage"
Cohesion: 0.07
Nodes (29): TransactionHistoryStorage, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage (+21 more)

### Community 131 - "childRefKeys"
Cohesion: 0.10
Nodes (15): ChildReader, ChildVisitor, ModelBatch, ModelSnapshot, SweepModel, childRefKeys(), readChildList(), readChildren() (+7 more)

### Community 133 - "process-worker.ts"
Cohesion: 0.11
Nodes (24): Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, RestoreSeams, withDevelopmentOptIn(), databaseOptions() (+16 more)

### Community 135 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 136 - "checks.test.ts"
Cohesion: 0.09
Nodes (23): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+15 more)

### Community 138 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 139 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 14 - "config/history.ts"
Cohesion: 0.03
Nodes (122): CoreVersion, CoreSettings, versionEntry, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions, HistoryRule (+114 more)

### Community 140 - "BlockRef"
Cohesion: 0.10
Nodes (13): BlockRef, InMemorySourceOptions, LoopObserver, Recorder, PublicCoreOptions, LateRedelivery, AlwaysLost, isBlock() (+5 more)

### Community 141 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (22): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus, TransactionHistoryWriter (+14 more)

### Community 143 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (23): A168Observation, A168Phase, Expected, GatedConnector, StatusReader, a(), a168Run(), atLeast() (+15 more)

### Community 144 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 145 - "threat-model.test.ts"
Cohesion: 0.15
Nodes (26): Citation, citationProblems(), citations(), commitPolicyProblems(), headingProblems(), headings(), knownGapProblems(), lineCountOf() (+18 more)

### Community 146 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (21): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+13 more)

### Community 147 - "backupAtStop"
Cohesion: 0.10
Nodes (23): RestoreChain, backupAtStop(), checkRecordedMigrations(), restoreGrants(), stoppedWith(), 00033 — `umbradb restore` fails on a configuration with a module whose entry starts above the backup's height, Evidence, Problem (+15 more)

### Community 149 - "example-checks.ts"
Cohesion: 0.15
Nodes (20): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+12 more)

### Community 15 - "client.test.ts"
Cohesion: 0.03
Nodes (82): NodeRetry, NodeSocketEvents, HandSocket, HandSockets, recorded, ManualTimers, ScriptedRequest, syntheticChain (+74 more)

### Community 150 - "validation.test.ts"
Cohesion: 0.09
Nodes (19): DeclarationRule, Case, ShapeCase, Stats, schemaName(), first(), validateWith(), module() (+11 more)

### Community 153 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 154 - "api-server.test.ts"
Cohesion: 0.12
Nodes (20): Client, names(), configHashesOf(), exchange(), helperProblems(), hex(), isConfigHash(), isVersion() (+12 more)

### Community 155 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 156 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 157 - "builder.ts"
Cohesion: 0.12
Nodes (13): Refusal, Link, TapeBuilder, TapeBuilderOptions, RecordingError, SessionEnd, withBuilder(), frameText() (+5 more)

### Community 158 - "5. Runner"
Cohesion: 0.17
Nodes (23): Callback, ParallelPoint, SlowBlockCondition, AppendsVersion, CoreStopsFirst, boundaryModules(), dispatch(), entryIdOf() (+15 more)

### Community 16 - "validate.ts"
Cohesion: 0.03
Nodes (114): RevisionSettings, coreEntry, RedactableConfig, RedactionForms, SecretForm, TextPattern, ConfigRule, CursorRule (+106 more)

### Community 160 - "build-modules.ts"
Cohesion: 0.11
Nodes (18): SignalJob, privateBackbone(), report(), CORE_CHAIN, CORE_CONFIG, CORE_DIGEST, CORE_HEALTH, CORE_STATUS (+10 more)

### Community 161 - "cli/run.ts"
Cohesion: 0.11
Nodes (18): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+10 more)

### Community 162 - "ResolvedRange"
Cohesion: 0.10
Nodes (12): ResolvedRange, EntryBoundary, PointRun, PointSchedule, Activity, SkipsStartAtRestart, Pipeline, StartsAtEveryRevision (+4 more)

### Community 164 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (14): BackupText, createReadStream(), firstLine(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst() (+6 more)

### Community 165 - "containers.test.ts"
Cohesion: 0.10
Nodes (15): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, removeAttempt(), parentWithContainer(), LABEL_ATTEMPT, LABEL_PID (+7 more)

### Community 166 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 167 - "Transaction"
Cohesion: 0.12
Nodes (9): Transaction, HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, WaitsInTransaction, ComputeAtH (+1 more)

### Community 168 - "src/ledger/identity.ts"
Cohesion: 0.17
Nodes (20): ManifestLine, LedgerReleasePackage, checkLedgerPackage(), checkLedgerPackages(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+12 more)

### Community 169 - "lockstep-reads.test.ts"
Cohesion: 0.14
Nodes (18): Pause, Q142Observation, InstancesOptions, instancesRun, adminOrigin(), adminPortOf(), launchPublicCore(), PRIVATE_ROWS_SQL() (+10 more)

### Community 17 - "declaration.ts"
Cohesion: 0.03
Nodes (88): BlockWriteHandle, ReadHandle, SchemaWriteHandle, ErrorCode, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable (+80 more)

### Community 171 - "worker-host.test.ts"
Cohesion: 0.11
Nodes (19): SlowStep, TestLoaderData, errorOf(), beat(), countDeserializations(), hexOf(), loadLedger(), probe() (+11 more)

### Community 178 - "BlockSource"
Cohesion: 0.10
Nodes (9): BlockSource, AdminRunOptions, TestBuildOptions, get(), 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution (+1 more)

### Community 179 - "sweep-fixture.test.ts"
Cohesion: 0.16
Nodes (17): Driver, applyInput(), at(), batchText(), blockHash(), embeddedOf(), hex(), keysOf() (+9 more)

### Community 18 - "Database"
Cohesion: 0.03
Nodes (108): Database, TableFacts, Chain, DigestRow, Op, States, TableName, TestBackend (+100 more)

### Community 180 - "restore-content-defined.test.ts"
Cohesion: 0.14
Nodes (19): FileRow, contentsHashOf(), declaredContentDefined(), connectionOf(), backupOf(), bytesOf(), change(), fileRows() (+11 more)

### Community 181 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 183 - "3. Block source and ingest"
Cohesion: 0.21
Nodes (17): ChainDataView, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions(), chainApi() (+9 more)

### Community 184 - "lockstep-refusals.test.ts"
Cohesion: 0.22
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, a118Problems(), a118Run(), coreOn(), haltOf(), json() (+10 more)

### Community 185 - "refcount-restart-preprod.ts"
Cohesion: 0.18
Nodes (15): databaseNow, observedRun, RunPlan, jobFor(), observedDifferences(), preprodRestartTest(), restartProblems(), runSegment() (+7 more)

### Community 186 - "messagePortChannel"
Cohesion: 0.12
Nodes (16): demoLink, onLink(), messagePortChannel(), ownKeys(), Rework (class 4), 4. Channels, 0. Baseline, 10. Review (AGENTS.md stage 4, bounded) (+8 more)

### Community 19 - "NodeBlockSource"
Cohesion: 0.03
Nodes (56): CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, QueuedBlock, MetadataBlock, RuntimeMetadata (+48 more)

### Community 191 - "ledger-table-config.test.ts"
Cohesion: 0.25
Nodes (17): Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts() (+9 more)

### Community 193 - "browser-harness.ts"
Cohesion: 0.25
Nodes (17): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+9 more)

### Community 194 - "transport-intake.test.ts"
Cohesion: 0.15
Nodes (8): SessionSeen, A112Observation, Wiring, TransportProxy, PRIVATE_LOGIN, READER_LOGIN, engines, owner

### Community 198 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 2 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (171): NodeCallOptions, ProcessCondition, BlockSpec, EventSpec, Scenario, transactionSpec, RecordingClient, eventsRuntime (+163 more)

### Community 20 - "runner/process.ts"
Cohesion: 0.03
Nodes (82): MountedAdminAnswer, AdminSeams, AdminAnswer, Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait (+74 more)

### Community 200 - "FakeNode"
Cohesion: 0.14
Nodes (3): FakeNode, startNode(), listenOnRandomPort()

### Community 201 - "commit-proxy.ts"
Cohesion: 0.16
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 204 - "version-table.ts"
Cohesion: 0.23
Nodes (16): LedgerPin, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin(), freezeRow(), hexOf() (+8 more)

### Community 205 - "private/part-migrations.test.ts"
Cohesion: 0.20
Nodes (13): FoldedPart, RecordedMigration, earlierBootstrapSql(), earlierRefusalProblems(), earlierRows(), earlierRowsSql(), recorded(), rowsSql() (+5 more)

### Community 208 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 21 - "core-config.test.ts"
Cohesion: 0.04
Nodes (96): NetworkShown, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, AdminServer, AdminStartOptions, DigestRow (+88 more)

### Community 213 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 214 - "browser/serve.ts"
Cohesion: 0.21
Nodes (10): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), CONTENT_TYPES (+2 more)

### Community 219 - "ApiRoutes"
Cohesion: 0.23
Nodes (7): ApiRoutes, ModuleRegistration, AcceptsDuplicates, registerModuleApis(), routesOf(), api(), routesOf()

### Community 22 - "binding.test.ts"
Cohesion: 0.03
Nodes (91): PrivateIntakeOptions, PublicWakes, A165Options, TestDatabase, A113Observation, A156Observation, Binding, Created (+83 more)

### Community 221 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 224 - "Heartbeat"
Cohesion: 0.24
Nodes (7): Heartbeat, HeartbeatOptions, TimerHandle, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 228 - "stats-module.ts"
Cohesion: 0.32
Nodes (10): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+2 more)

### Community 229 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 23 - "vitest"
Cohesion: 0.03
Nodes (63): Served, Lockfile, Manifest, RepositoryFile, Upstream, Leftover, RemovedName, ReportedTest (+55 more)

### Community 231 - "SubscriptionConnection"
Cohesion: 0.35
Nodes (4): SubscriptionCarrier, SubscriptionConnection, errorMessage(), socketConnection()

### Community 238 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 239 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 24 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (83): PrivateLinkConnect, EndpointOptions, Envelope, LinkTimers, PrivateLinkChannel, CoreChannelSeams, Received, TransportLimits (+75 more)

### Community 25 - "start-umbradb.ts"
Cohesion: 0.04
Nodes (88): Finding, MessagePortLike, readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork (+80 more)

### Community 26 - "adapter-fixtures.ts"
Cohesion: 0.06
Nodes (87): ApplyOutput, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+79 more)

### Community 27 - "spawnChild"
Cohesion: 0.03
Nodes (85): ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, GateRun, Pids (+77 more)

### Community 276 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 28 - "database-parts.ts"
Cohesion: 0.03
Nodes (85): CoreLedgerVersion, LedgerPackageIdentity, LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, PglitePathParts (+77 more)

### Community 29 - "adapter.ts"
Cohesion: 0.04
Nodes (75): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+67 more)

### Community 3 - "migrate.ts"
Cohesion: 0.02
Nodes (146): AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner, Difference, OwnPart (+138 more)

### Community 30 - "config-check.ts"
Cohesion: 0.04
Nodes (76): BackupOutcome, CheckFinding, CheckStep, ConfigCheckSeams, StepName, StepReport, StepStatus, commandTarget (+68 more)

### Community 31 - "transport-faults.test.ts"
Cohesion: 0.05
Nodes (65): PrivateLinkAddress, CoreTransport, CoreTransportOptions, TransportTls, Message, PrivateSocketTransportOptions, PublicSide, PublicCore (+57 more)

### Community 32 - "host.ts"
Cohesion: 0.05
Nodes (65): LoadLedger, LedgerStateItem, LedgerName, LedgerSource, LedgerSourceSettings, LedgerTask, ParsedTransaction, AppliedState (+57 more)

### Community 33 - "Process"
Cohesion: 0.05
Nodes (29): LifecycleStatus, ProcessReason, ReasonCode, Unwrapped, PauseHold, Process, StatusFacts, configurationFindings() (+21 more)

### Community 34 - "ref_node_timers"
Cohesion: 0.05
Nodes (63): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, CommandResult, Renamed, RunningCommand, statsConfig (+55 more)

### Community 36 - "zero-timeouts-checks.ts"
Cohesion: 0.04
Nodes (57): Settings, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, Run (+49 more)

### Community 37 - "backup/restore.ts"
Cohesion: 0.05
Nodes (56): PrivateBlockSource, PrivateChecks, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision, PrivateLink, PublicConfiguration (+48 more)

### Community 38 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (65): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+57 more)

### Community 39 - "core-block-commit.test.ts"
Cohesion: 0.04
Nodes (64): BlockHeaderItem, BlockRow, CoreBlockHeader, PublicSideOptions, TransportPosition, StandInOptions, Commit, Committed (+56 more)

### Community 4 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (151): InMemoryBlockSource, InMemoryItems, Wait, EngineBuild, EngineNetwork, ProcessingEnd, ProcessStatus, Flaky (+143 more)

### Community 40 - ".put"
Cohesion: 0.03
Nodes (73): EagerItems, EagerLoop, "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed (+65 more)

### Community 41 - ".from"
Cohesion: 0.03
Nodes (69): StartHashes, a165Run, Attempt, privateCursorHeight(), hexOf(), hex(), hex(), hex() (+61 more)

### Community 42 - "LedgerPackage"
Cohesion: 0.06
Nodes (33): LedgerPackage, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, stagenetReplay, hexOf(), idOf() (+25 more)

### Community 45 - "ModuleDeclaration"
Cohesion: 0.05
Nodes (71): ConfigFacts, OpenedConfig, OpenedFacts, CoreChainFacts, privateIntake, RestoreBase, CommandBuildOptions, CheckState (+63 more)

### Community 46 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (59): BlockLedgerSource, LedgerBinding, retainedStates, CoreRevision, bindLedgerParser(), boundLedgerParser(), applyBlock(), bindCoreLedgerState() (+51 more)

### Community 47 - "refused-configuration.test.ts"
Cohesion: 0.06
Nodes (59): AdminStarter, EngineConfig, Start, Refusal, Start, A168RunOptions, startProcess(), observe() (+51 more)

### Community 48 - "ledger/types.ts"
Cohesion: 0.06
Nodes (45): ApplyInput, ChainOutcome, LedgerPackageOptions, StateSummary, V9Logs, CallTx, LedgerHeight, LoadAdapter (+37 more)

### Community 49 - "loop-stop-harness.ts"
Cohesion: 0.07
Nodes (48): ChainCheck, ChainCheckInput, NodeClientOptions, ConnectSocket, A169Observation, LoopStopScenario, Outage, SourceOf (+40 more)

### Community 5 - "ledger-storage.test.ts"
Cohesion: 0.03
Nodes (152): ingest, IngestOptions, watched, Call, SeenLoad, RestartEvent, RestartJob, retentionSeen (+144 more)

### Community 50 - "contract-data-checks.ts"
Cohesion: 0.08
Nodes (60): CoreContractStatesOptions, ContractStateRow, DefinedModule, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+52 more)

### Community 51 - "column-rules.ts"
Cohesion: 0.04
Nodes (67): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+59 more)

### Community 52 - "slow-block-harness.ts"
Cohesion: 0.08
Nodes (53): BlockItemSource, HeightActivity, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead (+45 more)

### Community 53 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (39): Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+31 more)

### Community 54 - "backup/backup.ts"
Cohesion: 0.07
Nodes (57): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+49 more)

### Community 55 - "hex"
Cohesion: 0.07
Nodes (52): nodeKeys, FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeKeyTape, Written, GenesisNodes, NodeBatch (+44 more)

### Community 56 - "node-format.ts"
Cohesion: 0.07
Nodes (32): Node, GeneratedBlock, GeneratedState, Child, Reader, Disposable, NodeStoreExports, NodeStoreSubject (+24 more)

### Community 57 - "core-ledger-state/sql.ts"
Cohesion: 0.05
Nodes (49): ComputedBlock, KeyCounts, RefcountCheck, RefcountStatement, refcountStep, RefcountTables, StateRow, StoredState (+41 more)

### Community 58 - "core-channels.ts"
Cohesion: 0.07
Nodes (27): ChannelEndpoint, EndpointEvents, CoreChannels, CoreChannelsOptions, Queued, CoreSessionOptions, Hello, controlEnvelope() (+19 more)

### Community 59 - "core-transport.ts"
Cohesion: 0.05
Nodes (27): Connected, CoreLink, coreSessions, InstanceView, LinkConnection, LinkSession, PrivateInstance, Entry (+19 more)

### Community 6 - "admin-harness.ts"
Cohesion: 0.03
Nodes (146): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminEndpoint, AdminPart, AdminView (+138 more)

### Community 60 - "refcount-model.ts"
Cohesion: 0.06
Nodes (49): BlockKind, BlockScript, BoundaryRewrite, DrivenBlock, GraphNode, HistoryScript, OracleReport, R1Case (+41 more)

### Community 62 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.06
Nodes (46): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses(), expectedCallArgs(), plainWatchModule() (+38 more)

### Community 63 - "PgTransactionHistoryStorage"
Cohesion: 0.07
Nodes (36): MergeEntriesFn, TransactionHistoryEntry, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, encodeStoredEntry(), rowToEntry(), abortErrorLike(), capitalize() (+28 more)

### Community 64 - "config/plain-data.ts"
Cohesion: 0.06
Nodes (46): ImportedConfig, LoadedConfig, LoadOptions, PlainArray, plainData, PlainDataNode, PlainDataRule, Walk (+38 more)

### Community 65 - "12. Ledger"
Cohesion: 0.08
Nodes (35): RetainedState, EvictionRefused, LedgerHost, LedgerWorkerFailure, NodeDatabase, NodeReader, PackageStartup, workerParser() (+27 more)

### Community 66 - "transforms.test.ts"
Cohesion: 0.08
Nodes (38): Failure, Variant, TransformError, CallRecord, recordKind, SubscriptionId, CallSelection, NotificationRange (+30 more)

### Community 68 - ".value"
Cohesion: 0.11
Nodes (32): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef, ScaleError (+24 more)

### Community 69 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TreeNode, TypeRule, DesignTable (+24 more)

### Community 7 - "determinism/contents-hash.ts"
Cohesion: 0.03
Nodes (124): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, CheckedMigration, CanonicalEncodingError, ContentOptions (+116 more)

### Community 71 - "private-transport.ts"
Cohesion: 0.06
Nodes (24): PublicSide, HelloAck, JsonValue, ReadResult, StatementResult, SocketLimits, CarrierConnection, CarrierEvents (+16 more)

### Community 72 - "builder.test.ts"
Cohesion: 0.06
Nodes (32): Answer, Handler, Received, ConnectionFrames, Recorded, Failure, Variant, WrongRecording (+24 more)

### Community 73 - "shims.test.ts"
Cohesion: 0.06
Nodes (36): PgliteLockUse, Buffer, BufferEncoding, Hash, sha256, acquirePgliteLock(), lockHeld(), pgliteLockFile() (+28 more)

### Community 74 - "node-set.test.ts"
Cohesion: 0.06
Nodes (46): NodeSetFault, NodeSetOptions, NodeTableCheck, ContentDefinition, ContentDefinedBuildOptions, StoredRow, Tables, first() (+38 more)

### Community 75 - "boundary.test.ts"
Cohesion: 0.08
Nodes (43): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+35 more)

### Community 76 - "jsonText"
Cohesion: 0.09
Nodes (28): BoundaryReading, RecordingProblem, readRequest, RequestId, Json, NotJsonError, Answer, Held (+20 more)

### Community 77 - "records.ts"
Cohesion: 0.06
Nodes (40): CompletenessRange, TapeProblem, TransformProblem, Connection, TapeCall, TapeNodeOptions, TapeOutcome, DisconnectRecord (+32 more)

### Community 78 - "FinalizedLoop"
Cohesion: 0.09
Nodes (10): FinalizedLoop, UnexpectedCursor, Startup, CommitsDespiteLastWrite, Controls, cursorText(), isRetryable(), runFinalized() (+2 more)

### Community 8 - "DatabaseParts"
Cohesion: 0.02
Nodes (115): DatabaseParts, UmbraDBHandle, CloseHelper, NetworkRuleName, Answered, TickerConfig, SecretHashes, SecretVariant (+107 more)

### Community 80 - "checkShape"
Cohesion: 0.07
Nodes (41): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+33 more)

### Community 81 - "postgres/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (34): EntryContent, JsonEncoded, TxHistoryRow, Command, ReplayableStorage, assertStoredEntryShape(), capitalize(), decodeContent() (+26 more)

### Community 82 - "refcount-restart.ts"
Cohesion: 0.06
Nodes (39): BatchJson, ContentsHash, Hold, Light, Line, NodeSetKeeper, Observed, RestartChain (+31 more)

### Community 84 - "surface.test.ts"
Cohesion: 0.07
Nodes (45): Document, EntryInput, Renamed, Surface, SurfaceAmendment, changelogEntryProblems(), entryTerms(), namesWord() (+37 more)

### Community 85 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 86 - "api-socket.ts"
Cohesion: 0.10
Nodes (41): coreHeaders, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits (+33 more)

### Community 87 - "cbor.ts"
Cohesion: 0.09
Nodes (37): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+29 more)

### Community 88 - "graph.ts"
Cohesion: 0.08
Nodes (42): Edge, GraphFacts, GraphRule, MidChain, Missing, RangeCheck, RangeFacts, Spanned (+34 more)

### Community 89 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 9 - "private/backends.ts"
Cohesion: 0.03
Nodes (118): BenchEnv, PostgresParts, SslMode, DurabilityProbeOptions, DurabilityViolation, ProbeSession, Outcome, driverConnectionOptions (+110 more)

### Community 90 - "module-api.ts"
Cohesion: 0.07
Nodes (30): ChainDataAnswer, ApiError, ApiErrorCode, ApiRequest, ApiResponse, HttpHandler, HttpMethod, HttpRoute (+22 more)

### Community 91 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 93 - "config-hash-checks.ts"
Cohesion: 0.07
Nodes (22): Session, Report, A162Options, a162Run, HeaderSeen, HeldLink, HoldingRelay, ReportRelay (+14 more)

### Community 94 - "local-preprod-sync.mjs"
Cohesion: 0.07
Nodes (36): Attempt, commitOf(), configText(), docker(), dockerHas(), dockerLater(), imageDigests(), main() (+28 more)

### Community 95 - "networks.ts"
Cohesion: 0.06
Nodes (38): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+30 more)

### Community 96 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (29): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+21 more)

### Community 97 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (31): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, ChildResult, acquirePgliteLock() (+23 more)

### Community 172 - "The database"
Cohesion: 0.09
Nodes (19): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The node on `/status`, The transport reader, TLS to PostgreSQL: `ssl` (+11 more)

### Community 43 - "data"
Cohesion: 0.03
Nodes (76): params(), n(), data(), 2.1 The declaration, 2.2 Its table, 2.3 Writing each block, 2.4 Serving it, 2.5 The configuration file (+68 more)

### Community 70 - "table"
Cohesion: 0.04
Nodes (52): side(), migrations(), table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, 10. Ready-made tables: cursor and height-versioned (+44 more)

### Community 105 - "refused"
Cohesion: 0.07
Nodes (37): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+29 more)

### Community 113 - "core-private-source.test.ts"
Cohesion: 0.06
Nodes (11): height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PUBLIC_POLL_MS, PRIVATE_CORE_DIGEST (+3 more)

### Community 116 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 117 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (25): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed(), ledgerV8NodeEntry() (+17 more)

### Community 134 - ".slowBlockMs"
Cohesion: 0.07
Nodes (28): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+20 more)

### Community 170 - "log"
Cohesion: 0.10
Nodes (20): placeFor(), watchingPgDump(), log(), 00072 — `umbradb run` logs nothing when SIGTERM or SIGINT stops it, Evidence, Problem, Suggested fix, 7.1 Library-mode guarantees (+12 more)

### Community 173 - "restoreBackup"
Cohesion: 0.12
Nodes (17): isBlockLedgerSource(), hex(), checkBeforeLoading(), checkPublicBlock(), historyRefusal(), historyRows(), load(), notEmpty() (+9 more)

### Community 182 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.11
Nodes (17): transportReaderRule(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout, 2. Architecture (+9 more)

### Community 187 - "reason"
Cohesion: 0.11
Nodes (17): reason(), 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it, Evidence, Problem, Suggested fix, 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test (+9 more)

### Community 189 - "config-check.test.ts"
Cohesion: 0.15
Nodes (15): configText(), coreSettings(), inChild(), lineOf(), treeOf(), core(), fileOf(), coreOnly() (+7 more)

### Community 195 - ".cwd"
Cohesion: 0.15
Nodes (13): join(), normalize(), resolve(), delimiter, sep, 00067 — `startUmbraDB` throws synchronously when the host's working directory no longer exists, Evidence, Problem (+5 more)

### Community 206 - "core-block-parsed/sql.ts"
Cohesion: 0.14
Nodes (11): heightPartitionsSql(), CORE_BLOCK_PARSED_MIGRATIONS, TRANSACTIONS_TABLE, CORE_TX_RESULTS_MIGRATIONS, RESULTS_TABLE, HEIGHT_PARTITION_SIZE, PRECREATED_HEIGHT_PARTITIONS, 00023 — The blocks table's height partitions end at 5,000,000 (+3 more)

### Community 207 - ".disconnect"
Cohesion: 0.15
Nodes (14): fault(), Suggested fix, 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants (+6 more)

### Community 211 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 212 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 220 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 223 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 227 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 255 - "Requirement: BK-1 Backup"
Cohesion: 0.22
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 264 - "v9"
Cohesion: 0.38
Nodes (6): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix, 14. External claims and their evidence

### Community 265 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 280 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 283 - "readBody"
Cohesion: 0.33
Nodes (5): readBody(), 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 35 - "version"
Cohesion: 0.03
Nodes (82): deferred(), version(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log (+74 more)

### Community 354 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 44 - "history"
Cohesion: 0.03
Nodes (71): integer(), history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+63 more)

### Community 61 - "code"
Cohesion: 0.04
Nodes (57): code(), Added, 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit (+49 more)

### Community 67 - "T"
Cohesion: 0.04
Nodes (54): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+46 more)

### Community 79 - ".off"
Cohesion: 0.04
Nodes (48): Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25) (+40 more)

### Community 83 - "startUmbraDB"
Cohesion: 0.06
Nodes (41): text(), transportReader(), startUmbraDB(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented (+33 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+31 more)

### Community 112 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 137 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (28): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+20 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 163 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 174 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 175 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 176 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 177 - "package.json"
Cohesion: 0.09
Nodes (21): bugs, url, description, exports, files, homepage, license, main (+13 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 196 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 197 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 199 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 202 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 203 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 209 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 210 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+6 more)

### Community 215 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception (+5 more)

### Community 216 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 217 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 218 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 222 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 225 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 226 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 230 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 233 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 234 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 235 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 236 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 237 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 240 - "[0.10.0] - 2026-10-27"
Cohesion: 0.20
Nodes (9): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changed since `v0.10.0-rc.2`: ledger nodes reclaimed by reference counting (`ledger-refcount`), Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface) (+1 more)

### Community 241 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 243 - "ROADMAP.md"
Cohesion: 0.20
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 244 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 245 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-4 Every field is data, operational or secret, Scenario: A function in the configuration, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: A user module from the configuration file, Scenario: Two `core` revisions with different databases (+1 more)

### Community 246 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 247 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 248 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 249 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 250 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 251 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.22
Nodes (9): Assets and actors, Backups and restore, Commit policy, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node (+1 more)

### Community 252 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 253 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 254 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 2. Envelope module (Pg-only — required gate), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 256 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 258 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 259 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 260 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 261 - "Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.25
Nodes (7): 0. Baseline, 1. Measurements on the recorded tapes (`design.md` §9, §13 phase 0), 6. Full verification (AGENTS.md stage 3), 7. Local preprod runs (`design.md` §12; manual evidence, never in CI), 8. Review (AGENTS.md stage 4, bounded), 9. Close-out, Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting

### Community 262 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 263 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 266 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 267 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 268 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 269 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 270 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 271 - "Requirement: PP-4 The process transport"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, Spec delta — `private-processes` capability

### Community 272 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 273 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 274 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 275 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 278 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 279 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 281 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 282 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
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

### Community 288 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 289 - "Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`), What changes, Why

### Community 290 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 291 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 292 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 293 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 294 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 295 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 296 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 297 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 298 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 299 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 300 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 301 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 302 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 303 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 304 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 305 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 306 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 307 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 308 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 309 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 310 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 311 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 312 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 313 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 314 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 315 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 316 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 317 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 318 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 319 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 320 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 321 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 322 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 323 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 324 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 325 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 326 - "00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)"
Cohesion: 0.40
Nodes (4): 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …), Evidence, Problem, Suggested fix

### Community 327 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 328 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 329 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 330 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 331 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 332 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 333 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 334 - "00084 — The contents hash's key-ordered read splices its page size into `LIMIT`"
Cohesion: 0.40
Nodes (4): 00084 — The contents hash's key-ordered read splices its page size into `LIMIT`, Evidence, Problem, Suggested fix

### Community 335 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 336 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 337 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 338 - "Midnight Foundation Security Policy"
Cohesion: 0.40
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 341 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 342 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 343 - "00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes"
Cohesion: 0.50
Nodes (3): 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes, Evidence, Suggested fix

### Community 344 - "00083 — Four timing-bound tests fail when the machine runs several test lanes at once"
Cohesion: 0.50
Nodes (3): 00083 — Four timing-bound tests fail when the machine runs several test lanes at once, Problem, Suggested fix

### Community 345 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 346 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 347 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 348 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 349 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 350 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 351 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 352 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 358 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 359 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-8949`, `RFC-8949`, `RFC-8949`, `RFC-3339`, `RFC-8949` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4379 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `process-backends.ts`, `loop.ts`, `ingest-harness.ts`, `migrate.ts`, `InMemoryBlockSource`, `ledger-storage.test.ts`, `admin-harness.ts`, `determinism/contents-hash.ts`, `DatabaseParts`, `private/backends.ts`, `NodeClient`, `UmbraError`, `backup-fixtures.ts`, `core-block-parsed.ts`, `config/history.ts`, `client.test.ts`, `validate.ts`, `declaration.ts`, `Database`, `NodeBlockSource`, `runner/process.ts`, `core-config.test.ts`, `binding.test.ts`, `channel-queue.test.ts`, `start-umbradb.ts`, `adapter-fixtures.ts`, `spawnChild`, `database-parts.ts`, `adapter.ts`, `config-check.ts`, `transport-faults.test.ts`, `host.ts`, `Process`, `ref_node_timers`, `zero-timeouts-checks.ts`, `backup/restore.ts`, `contract-modules.test.ts`, `core-block-commit.test.ts`, `.from`, `ModuleDeclaration`, `core-ledger-state.ts`, `refused-configuration.test.ts`, `ledger/types.ts`, `loop-stop-harness.ts`, `contract-data-checks.ts`, `slow-block-harness.ts`, `chain-process.test.ts`, `backup/backup.ts`, `hex`, `node-format.ts`, `core-ledger-state/sql.ts`, `core-transport.ts`, `refcount-model.ts`, `ledger/ledger-tasks.test.ts`, `config/plain-data.ts`, `12. Ledger`, `transforms.test.ts`, `column-rules.test.ts`, `private-transport.ts`, `builder.test.ts`, `shims.test.ts`, `node-set.test.ts`, `boundary.test.ts`, `jsonText`, `postgres/transaction-history-storage.ts`, `refcount-restart.ts`, `surface.test.ts`, `retirement.test.ts`, `real-tapes.ts`, `config-hash-checks.ts`, `local-preprod-sync.mjs`, `networks.ts`, `file-mode.test.ts`, `pglite-lock.ts`, `resolver-boundary.ts`, `PointName`, `cbor.property.test.ts`, `browser.test.ts`, `node.test.ts`, `test/postgres/setup.ts`, `restore-private.ts`, `worker-storage.test.ts`, `format.test.ts`, `core-private-source.test.ts`, `builds.ts`, `messages.ts`, `cold-boot-recovery.integration.test.ts`, `order.property.test.ts`, `Worker`, `validation.ts`, `paused-harness.ts`, `release-version.ts`, `pg-tx-history-adapter.ts`, `version-checks.ts`, `core.ts`, `browser/build.ts`, `api-session.test.ts`, `code-registry.ts`, `checks.test.ts`, `documents.ts`, `read-gate.ts`, `threat-model.test.ts`, `example-checks.ts`, `validation.test.ts`, `height-versioned.property.test.ts`, `api-server.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `cli/run.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `containers.test.ts`, `block-fetch-decode.test.ts`, `src/ledger/identity.ts`, `lockstep-reads.test.ts`, `worker-host.test.ts`, `restoreBackup`, `package.json`, `BlockSource`, `sweep-fixture.test.ts`, `restore-content-defined.test.ts`, `3. Block source and ingest`, `lockstep-refusals.test.ts`, `refcount-restart-preprod.ts`, `config-check.test.ts`, `excluded-not-exported.test.ts`, `ledger-table-config.test.ts`, `transport-intake.test.ts`, `LoopPauses`, `private/part-migrations.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `twox.ts`, `Heartbeat`, `ledger/plain-data.ts`?**
  _High betweenness centrality (0.249) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-8949`, `RFC-8949` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `process-backends.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02378937938585577 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `process-backends.ts`, `loop.ts`, `ingest-harness.ts`, `migrate.ts`, `InMemoryBlockSource`, `admin-harness.ts`, `determinism/contents-hash.ts`, `DatabaseParts`, `private/backends.ts`, `NodeClient`, `backup-fixtures.ts`, `config/history.ts`, `client.test.ts`, `validate.ts`, `declaration.ts`, `Database`, `NodeBlockSource`, `runner/process.ts`, `core-config.test.ts`, `binding.test.ts`, `vitest`, `channel-queue.test.ts`, `start-umbradb.ts`, `database-parts.ts`, `config-check.ts`, `transport-faults.test.ts`, `host.ts`, `Process`, `ref_node_timers`, `version`, `zero-timeouts-checks.ts`, `backup/restore.ts`, `contract-modules.test.ts`, `core-block-commit.test.ts`, `ModuleDeclaration`, `core-ledger-state.ts`, `refused-configuration.test.ts`, `loop-stop-harness.ts`, `slow-block-harness.ts`, `chain-process.test.ts`, `backup/backup.ts`, `core-ledger-state/sql.ts`, `core-transport.ts`, `refcount-model.ts`, `ledger/ledger-tasks.test.ts`, `config/plain-data.ts`, `12. Ledger`, `transforms.test.ts`, `private-transport.ts`, `shims.test.ts`, `node-set.test.ts`, `FinalizedLoop`, `checkShape`, `startUmbraDB`, `cbor.ts`, `graph.ts`, `module-api.ts`, `pglite-lock.ts`, `refused`, `core-private-source.test.ts`, `validation.ts`, `version-checks.ts`, `checks.test.ts`, `mapping.ts`, `backupAtStop`, `validation.test.ts`, `api-server.test.ts`, `builder.ts`, `src/ledger/identity.ts`, `log`, `restoreBackup`, `3. Block source and ingest`, `lockstep-refusals.test.ts`, `ledger-table-config.test.ts`, `version-table.ts`, `private/part-migrations.test.ts`, `statementsOf`, `ApiRoutes`, `browser/src/config/load.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `loop.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020533747894805027 - nodes in this community are weakly interconnected._