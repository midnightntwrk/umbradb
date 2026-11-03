# Graph Report - UmbraDB

## Corpus Check
- 1240 files · ~1,775,220 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13001 nodes · 40091 edges · 378 communities (341 shown, 37 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3382 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `71c8032885580b23` (1240 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- vitest
- startUmbraDB
- src/db/postgres.ts
- api-server.test.ts
- redact.ts
- pg-tx-history-adapter.ts
- paused-harness.ts
- release-version.ts
- cli/database.ts
- channels.ts
- loop.test.ts
- core-chain.ts
- core.ts
- browser/build.ts
- code-registry.ts
- reason
- restore-ledger.ts
- resolver-boundary.ts
- contract-data-checks.ts
- browser.test.ts
- BlockRef
- .concat
- ledger-sweep.test.ts
- NodeClient
- src/ledger/identity.ts
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- checks.test.ts
- PointName
- documents.ts
- mapping.ts
- backup/restore.ts
- config/plain-data.ts
- read-gate.ts
- fixtures/configuration.ts
- process-worker.ts
- core-chain-events.ts
- browser-harness.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- ref_node_crypto
- surface.test.ts
- height-versioned.property.test.ts
- PrivateLinkChannel
- worker-threads.test.ts
- adapter-fixtures.ts
- ledger/metadata.ts
- pack-install.mjs
- node-bridge.ts
- options.ts
- .#open
- builds.ts
- core-block-fetch.test.ts
- library-documents.test.ts
- ChannelEndpoint
- GraphWorld
- pglite-timeouts.test.ts
- version-table.ts
- HeightRun
- chrome.ts
- read-height.property.test.ts
- key-handling-checks.ts
- ref_node_fs
- transaction-history-storage.property.test.ts
- core-block-fetch/metadata.ts
- backbone/part-migrations.test.ts
- lockstep-refusals.test.ts
- config/history.ts
- LoopPauses
- shims.test.ts
- BlockItems
- CoreChannels
- ingest-harness.ts
- change-capture.ts
- ProcessAdmin
- node-refs.ts
- web-lock.ts
- Worker
- NodeBlockSource
- Session
- browser/src/config/load.ts
- client.test.ts
- ws-mutual-tls.test.ts
- history.property.test.ts
- buffer.ts
- sweepStep
- SubscriptionConnection
- Heartbeat
- declaration.ts
- .send
- HeldHeight
- runner/process.ts
- TapeAnswers
- api-answers.ts
- .from
- ProcessItems
- ledger-tapes.ts
- ledger/plain-data.ts
- vendored-ledger-files.test.ts
- pause-fixtures.ts
- adapter.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- ref_node_url
- pageBench
- admin-harness.ts
- validation.ts
- core-transport.ts
- ModuleDeclaration
- builder.test.ts
- HeightActivity
- refused-configuration.test.ts
- pins.test.ts
- NodeFS
- Keeping
- channel-queue.test.ts
- Finding
- cli/command.ts
- worker-storage.test.ts
- core-ledger-state.ts
- UmbraError
- FinalizedLoop
- configured.ts
- PgTransactionHistoryStorage
- process-harness.ts
- config-check-database.test.ts
- refcount-tables.test.ts
- resolve.ts
- column-rules.ts
- backup/backup.ts
- tape/index.ts
- transport-faults.test.ts
- slow-block-harness.ts
- ledger/ledger-tasks.test.ts
- core-block-parsed.ts
- ref_node_timers
- interfaces/transaction-history-storage.ts
- code
- writer-lock-checks.ts
- column-rules.test.ts
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- ledger/types.ts
- binding.test.ts
- api-session.test.ts
- core-block-commit.test.ts
- module-api.test.ts
- boundary.test.ts
- order.property.test.ts
- module-api.ts
- core-settings.ts
- checkShape
- range.ts
- graph.ts
- retirement.test.ts
- validateDeclarations
- config-check.ts
- loop.ts
- version-checks.ts
- example-checks.ts
- refcount-model.ts
- zod
- migrate.ts
- cbor.ts
- page.ts
- private/lockstep-wait.test.ts
- config-hash-checks.ts
- Process
- .value
- core-ledger-state/sql.ts
- node-set.test.ts
- intake.test.ts
- test/postgres/setup.ts
- events-fixtures.ts
- validate.ts
- networks.ts
- cbor.property.test.ts
- backupAtStop
- refused
- core-chain.test.ts
- .configHash
- version
- graph.py
- .slowBlockMs
- .off
- connectChannel
- T
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- transportReader
- Design — START-UMBRADB: UmbraDB as a library
- The database
- Boundaries, threats and controls
- conformance-gate.mjs
- mutation-per-adapter.mjs
- v9
- twox.ts
- Design — v1.1.0: Quint model checking
- openssl
- path.ts
- host-signal.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- crash-worker.ts
- history
- .put
- cold-boot-recovery.integration.test.ts
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- README.md
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- ADDED Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- Requirements
- ADDED Requirements
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Requirement: DT-3 The contents hash
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Requirement: CF-4 Every field is data, operational or secret
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- scoped-review-manifest
- UmbraDB in a browser
- 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Repository agent policy
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance map — START-UMBRADB: UmbraDB as a library
- Requirement: BK-1 Backup
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
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- Proposal — Sprint 1: project setup + TemporalKV
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
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
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
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
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
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs

## God Nodes (most connected - your core abstractions)
1. `vitest` - 431 edges
2. `UmbraError` - 354 edges
3. `ModuleDeclaration` - 203 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `Database` - 104 edges
9. `startUmbraDB()` - 103 edges
10. `ReadHandle` - 94 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `4. WalletState envelope` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/tasks.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (378 total, 37 thin omitted)

### Community 0 - "vitest"
Cohesion: 0.02
Nodes (217): versionEntry, FinalityStallCondition, InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job (+209 more)

### Community 1 - "startUmbraDB"
Cohesion: 0.02
Nodes (219): BackupWritten, DatabaseParts, coreEntry, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle (+211 more)

### Community 10 - "src/db/postgres.ts"
Cohesion: 0.02
Nodes (117): BenchEnv, PostgresParts, SslMode, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome (+109 more)

### Community 101 - "api-server.test.ts"
Cohesion: 0.09
Nodes (27): HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, AppendsVersion, Client, VersionsAnswersOnly, names() (+19 more)

### Community 103 - "redact.ts"
Cohesion: 0.10
Nodes (31): RevisionSettings, EntryView, ManifestHistoryRow, PlainObject, RedactableConfig, RedactionForms, SecretForm, TextPattern (+23 more)

### Community 104 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (25): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+17 more)

### Community 106 - "paused-harness.ts"
Cohesion: 0.12
Nodes (29): Validator, A176Options, Body, PausedExpectation, Read, Reader, Running, schemaFile() (+21 more)

### Community 107 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 108 - "cli/database.ts"
Cohesion: 0.09
Nodes (23): DatabaseState, ReadDatabaseOptions, TypeCheckFinding, TypeCheckResult, databaseTarget, Finding, Finding, open() (+15 more)

### Community 109 - "channels.ts"
Cohesion: 0.08
Nodes (26): Envelope, MessagePortLike, parseJsonLossless(), exceedsUtf8(), hasKeys(), isObject(), messageEnvelope(), readEnvelope() (+18 more)

### Community 11 - "loop.test.ts"
Cohesion: 0.03
Nodes (131): Transaction, EntryRange, GraphInput, LockstepWait, LoopEnd, BlockFails, Height, PastFaultCase (+123 more)

### Community 110 - "core-chain.ts"
Cohesion: 0.09
Nodes (32): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, WaitingListener, ConfigRow, boundTo(), bytesOf() (+24 more)

### Community 113 - "core.ts"
Cohesion: 0.12
Nodes (25): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+17 more)

### Community 114 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 115 - "code-registry.ts"
Cohesion: 0.10
Nodes (31): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+23 more)

### Community 117 - "reason"
Cohesion: 0.07
Nodes (31): TransactionHistoryStorage, reason(), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier (+23 more)

### Community 118 - "restore-ledger.ts"
Cohesion: 0.11
Nodes (30): FileRow, ledgerBackup, RestoreBuild, cursorHeight(), isEmptyDatabase(), openPglite(), withNodeRoot(), connectionOf() (+22 more)

### Community 119 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 12 - "contract-data-checks.ts"
Cohesion: 0.03
Nodes (131): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+123 more)

### Community 122 - "browser.test.ts"
Cohesion: 0.10
Nodes (31): Reachable, RestoreAttempt, PageRestore, continuedProblems(), midChainProblems(), networkProblems(), plain(), restoreProblems() (+23 more)

### Community 124 - "BlockRef"
Cohesion: 0.13
Nodes (13): BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, failingSource(), lookalike(), shiftedSource() (+5 more)

### Community 127 - ".concat"
Cohesion: 0.08
Nodes (20): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+12 more)

### Community 129 - "ledger-sweep.test.ts"
Cohesion: 0.12
Nodes (16): SweepState, SweepWrites, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel, bigints() (+8 more)

### Community 13 - "NodeClient"
Cohesion: 0.04
Nodes (93): FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription (+85 more)

### Community 130 - "src/ledger/identity.ts"
Cohesion: 0.13
Nodes (25): ManifestLine, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkPackageFiles() (+17 more)

### Community 132 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.06
Nodes (28): GreyPicker, sweepReset(), 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents (+20 more)

### Community 133 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName(), integerCheckStatements() (+14 more)

### Community 134 - "PointName"
Cohesion: 0.10
Nodes (20): PointName, CallbackFailure, ReasonCode, Unwrapped, Activity, HeightFailure, Misuse, UnexpectedCursor (+12 more)

### Community 135 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 136 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 14 - "backup/restore.ts"
Cohesion: 0.03
Nodes (83): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes, PrivateLink (+75 more)

### Community 140 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 141 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 142 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (21): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+13 more)

### Community 143 - "process-worker.ts"
Cohesion: 0.12
Nodes (20): Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, answer(), backUp(), connectLink() (+12 more)

### Community 144 - "core-chain-events.ts"
Cohesion: 0.12
Nodes (23): BlockEventSource, isBlockEventSource(), boundEventSource(), chainEventsItemOf(), chainEventsOf(), coreChainEventsOnFetch(), metadataView(), runtimeMetadataOf() (+15 more)

### Community 145 - "browser-harness.ts"
Cohesion: 0.14
Nodes (23): PageApiChannel, PageBackup, PageEvent, PageLink, ProcessName, StatusBody, apiChannel(), backupThrough() (+15 more)

### Community 146 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 147 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 148 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 15 - "ref_node_crypto"
Cohesion: 0.04
Nodes (97): nodeKeys, Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, NodeKeyTape (+89 more)

### Community 152 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 156 - "height-versioned.property.test.ts"
Cohesion: 0.16
Nodes (17): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+9 more)

### Community 158 - "PrivateLinkChannel"
Cohesion: 0.10
Nodes (16): demoLink, PrivateLinkChannel, Link, onLink(), messagePortChannel(), ownKeys(), Rework (class 4), 0. Baseline (+8 more)

### Community 159 - "worker-threads.test.ts"
Cohesion: 0.09
Nodes (13): Listener, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread, parentPort (+5 more)

### Community 16 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (109): DeployTx, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost (+101 more)

### Community 161 - "ledger/metadata.ts"
Cohesion: 0.13
Nodes (10): CoreBlockItems, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, MetadataSelector, OwnStateMetadata, contentStateOf() (+2 more)

### Community 162 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 163 - "node-bridge.ts"
Cohesion: 0.13
Nodes (17): Thread, BridgeServer, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 164 - "options.ts"
Cohesion: 0.21
Nodes (23): readOptions, addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding(), guarded(), isHost() (+15 more)

### Community 169 - ".#open"
Cohesion: 0.11
Nodes (7): NodeWait, WaitingCondition, openedCursorHeight(), namedStartDb(), privateLinkOf(), sourceOf(), get()

### Community 17 - "builds.ts"
Cohesion: 0.04
Nodes (95): PrivateIntakeOptions, PublicWakes, PglitePathParts, A165Options, PrivateBackend, SessionSeen, PrivateOptions, PrivateProcess (+87 more)

### Community 170 - "core-block-fetch.test.ts"
Cohesion: 0.13
Nodes (11): BlockHeaderItem, CoreBlockHeader, LedgerTable, bindCoreBlockFetch(), coreBlockFetchOnFetch(), isBlockItemSource(), blockContext(), BOUND (+3 more)

### Community 171 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 172 - "ChannelEndpoint"
Cohesion: 0.23
Nodes (3): ChannelEndpoint, EndpointEvents, controlEnvelope()

### Community 173 - "GraphWorld"
Cohesion: 0.25
Nodes (3): Dice, GraphWorld, driveHistory()

### Community 174 - "pglite-timeouts.test.ts"
Cohesion: 0.13
Nodes (13): Run, Job, WorkerEvent, expectNeverCutOffNorHung(), settings(), apiRead(), engine(), report() (+5 more)

### Community 175 - "version-table.ts"
Cohesion: 0.18
Nodes (20): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+12 more)

### Community 176 - "HeightRun"
Cohesion: 0.11
Nodes (8): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, CommitsDespiteLastWrite, WaitsInTransaction, StartsAtEveryRevision

### Community 177 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 178 - "read-height.property.test.ts"
Cohesion: 0.13
Nodes (12): TestBackend, HeldRead, Job, Outcome, Reads, Step, concurrent(), queued() (+4 more)

### Community 179 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 18 - "ref_node_fs"
Cohesion: 0.05
Nodes (92): BackupBackend, BackupDatabase, killedRestore, TickerConfig, TickerHandle, FileProcess, privateBackup, PrivateConfig (+84 more)

### Community 183 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 184 - "core-block-fetch/metadata.ts"
Cohesion: 0.12
Nodes (16): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, canonicalJson(), hexOf() (+8 more)

### Community 185 - "backbone/part-migrations.test.ts"
Cohesion: 0.17
Nodes (17): ManifestMigration, FoldedPart, RecordedMigration, earlierBootstrapSql(), earlierRefusalProblems(), earlierRows(), earlierRowsSql(), recorded() (+9 more)

### Community 189 - "lockstep-refusals.test.ts"
Cohesion: 0.23
Nodes (17): LockstepCondition, A118Observation, MismatchObservation, hexOf(), a118Problems(), a118Run(), coreOn(), haltOf() (+9 more)

### Community 19 - "config/history.ts"
Cohesion: 0.03
Nodes (114): OpenedFacts, CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding (+106 more)

### Community 192 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 194 - "shims.test.ts"
Cohesion: 0.19
Nodes (7): Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 197 - "BlockItems"
Cohesion: 0.15
Nodes (7): QueuedBlock, BlockItems, EagerItems, EagerLoop, KeptItems, KeptLoop, reporting()

### Community 198 - "CoreChannels"
Cohesion: 0.19
Nodes (5): CoreChannels, CoreTransport, CoreLink, refuseChannel(), 4. Channels

### Community 2 - "ingest-harness.ts"
Cohesion: 0.02
Nodes (236): ProcessCondition, itemsSeen, EventSpec, Json, Scenario, A168Observation, A168Phase, A168RunOptions (+228 more)

### Community 20 - "change-capture.ts"
Cohesion: 0.03
Nodes (114): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow (+106 more)

### Community 204 - "node-refs.ts"
Cohesion: 0.29
Nodes (4): ChildReader, ChildVisitor, readChildList(), readChildren()

### Community 205 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 21 - "NodeBlockSource"
Cohesion: 0.03
Nodes (61): ExtrinsicCall, RuntimeMetadataView, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeCallOptions, NodeSubscription (+53 more)

### Community 212 - "Session"
Cohesion: 0.21
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 214 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 22 - "client.test.ts"
Cohesion: 0.03
Nodes (67): NodeClientOptions, NodeSocketEvents, IngestOptions, HandSocket, HandSockets, Answer, FakeNode, Handler (+59 more)

### Community 220 - "ws-mutual-tls.test.ts"
Cohesion: 0.21
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 221 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 223 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 227 - "sweepStep"
Cohesion: 0.26
Nodes (5): SweepTables, hexOf(), merged(), sweepStep(), 3.1 Where it runs

### Community 228 - "SubscriptionConnection"
Cohesion: 0.35
Nodes (4): SubscriptionCarrier, SubscriptionConnection, errorMessage(), socketConnection()

### Community 229 - "Heartbeat"
Cohesion: 0.27
Nodes (7): Heartbeat, HeartbeatOptions, TimerHandle, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 23 - "declaration.ts"
Cohesion: 0.04
Nodes (80): UmbraConfig, BlockWriteHandle, ReadHandle, SchemaWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable (+72 more)

### Community 234 - "HeldHeight"
Cohesion: 0.22
Nodes (7): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, Evidence

### Community 24 - "runner/process.ts"
Cohesion: 0.04
Nodes (82): ChainCheck, ChainCheckInput, PostgresPartsInput, TransportReader, LoadOptions, VerifyLedgerPackagesOptions, transportReaderFacts, SourceCondition (+74 more)

### Community 240 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 249 - "api-answers.ts"
Cohesion: 0.38
Nodes (9): HeadersArgument, answerNotServing(), byteLength(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing(), refuseNotServing() (+1 more)

### Community 25 - ".from"
Cohesion: 0.04
Nodes (89): Child, extendedCases, FixtureDag, FixtureNode, NodeContent, ExtendedState, FakeState, FixtureData (+81 more)

### Community 26 - "ledger-tapes.ts"
Cohesion: 0.04
Nodes (92): ChainOutcome, TransactionResult, BlockSpec, transactionSpec, CallTx, eventsRuntime, ledgerItemsSeen, SeenLoad (+84 more)

### Community 267 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 269 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 27 - "pause-fixtures.ts"
Cohesion: 0.04
Nodes (69): backupSignalRelay, SignalSource, stopSignal, BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable (+61 more)

### Community 28 - "adapter.ts"
Cohesion: 0.04
Nodes (72): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+64 more)

### Community 280 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 29 - "ref_node_url"
Cohesion: 0.03
Nodes (69): Child, ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, GateRun (+61 more)

### Community 299 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 3 - "admin-harness.ts"
Cohesion: 0.03
Nodes (161): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, MountedAdminAnswer, AdminSeams, PrivateSideFacts, ProcessAdminOptions (+153 more)

### Community 30 - "validation.ts"
Cohesion: 0.03
Nodes (83): DatabasePartsInput, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+75 more)

### Community 31 - "core-transport.ts"
Cohesion: 0.04
Nodes (58): PrivateLinkAddress, PrivateLinkConnect, EndpointOptions, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected (+50 more)

### Community 32 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (76): ModuleDeclaration, LifecycleStatus, BlockSource, ProcessReason, Opened, ProcessState, AdminRun, AdminRunOptions (+68 more)

### Community 33 - "builder.test.ts"
Cohesion: 0.04
Nodes (42): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Frame, RawClient, Failure (+34 more)

### Community 338 - "HeightActivity"
Cohesion: 0.60
Nodes (3): HeightActivity, NeverClears, NeverClears

### Community 34 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (71): EngineConfig, ProcessHandle, WorkerWithStreams, Start, Refusal, Start, listenError(), startAdminServer() (+63 more)

### Community 36 - "channel-queue.test.ts"
Cohesion: 0.05
Nodes (52): PublicSide, HelloAck, PrivateTransport, Waiter, controlledTimers, PeerEnd, PeerMessage, rawPeer (+44 more)

### Community 37 - "cli/command.ts"
Cohesion: 0.04
Nodes (62): RestoreSeams, CommandHandler, CommandIo, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome, TickerProcess (+54 more)

### Community 38 - "worker-storage.test.ts"
Cohesion: 0.06
Nodes (33): NodeStore, StateHandle, StoredNode, LedgerEngine, LedgerTaskFailed, Settled, bridgeStore, StagenetFixtureJson (+25 more)

### Community 39 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (57): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, retainedStates, CoreRevision, FixtureRunOptions, bindLedgerParser(), boundLedgerParser() (+49 more)

### Community 4 - "UmbraError"
Cohesion: 0.02
Nodes (126): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, DumpInput, CommittedHeight, Database (+118 more)

### Community 40 - "FinalizedLoop"
Cohesion: 0.06
Nodes (12): FinalizedLoop, LoopObserver, Startup, SkipsLockstep, WaitingInRead, ItemsAfterWrite, SilentHalt, FailingAfter (+4 more)

### Community 41 - "configured.ts"
Cohesion: 0.06
Nodes (64): BlockParsed, ConfiguredDatabase, ConfiguredDatabaseOptions, CoreSettings, ImportedConfig, plainData, ConfigContext, isPrivateDatabase() (+56 more)

### Community 42 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (45): MergeEntriesFn, TransactionHistoryEntry, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, encodeStoredEntry(), rowToEntry(), abortErrorLike(), capitalize() (+37 more)

### Community 43 - "process-harness.ts"
Cohesion: 0.06
Nodes (43): ResolvedGraph, MisuseListener, MisuseReports, ProcessContexts, ProcessContextsInput, PublishRefusal, ChainStarted, Seen (+35 more)

### Community 44 - "config-check-database.test.ts"
Cohesion: 0.05
Nodes (47): CheckStep, CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, CheckTarget (+39 more)

### Community 45 - "refcount-tables.test.ts"
Cohesion: 0.05
Nodes (49): KeyCounts, RefcountFault, RefcountStatement, refcountStep, RefcountTables, RefcountBatch, Given, Halt (+41 more)

### Community 46 - "resolve.ts"
Cohesion: 0.05
Nodes (63): CoreChainFacts, RestoreBase, CommandBuildOptions, CheckState, ConfigCheckOptions, CommandConfig, ProcessSide, HistoryInput (+55 more)

### Community 47 - "column-rules.ts"
Cohesion: 0.04
Nodes (67): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+59 more)

### Community 48 - "backup/backup.ts"
Cohesion: 0.07
Nodes (55): BackupInput, BackupSeams, BackupTarget, BackupFacts, Manifest, ManifestTool, PgliteDump, SnapshotSeams (+47 more)

### Community 5 - "tape/index.ts"
Cohesion: 0.03
Nodes (125): Recorded, Metadata, Step, Failure, Variant, Link, TapeBuilderOptions, RecordingError (+117 more)

### Community 50 - "transport-faults.test.ts"
Cohesion: 0.06
Nodes (46): Message, Ended, rawClient, Escape, publicState, Refused, splitAddress(), startCoreTransport() (+38 more)

### Community 51 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (53): BlockItemSource, LoopInput, ReadOpener, StatusBody, PublicCoreOptions, Times, Wait, askedSource (+45 more)

### Community 52 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.06
Nodes (46): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses(), expectedCallArgs(), plainWatchModule() (+38 more)

### Community 53 - "core-block-parsed.ts"
Cohesion: 0.06
Nodes (53): BodyExtrinsic, BlockBody, MetadataVariant, BlockParsedOptions, ChainTransaction, ChainEvent, EventPhase, RecordTypes (+45 more)

### Community 54 - "ref_node_timers"
Cohesion: 0.06
Nodes (40): RunOptions, RunSeams, EngineInput, UserModulesSource, IgnoredJob, RunningCommand, statsConfig, ChannelCoreOptions (+32 more)

### Community 55 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (39): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, JsonEncoded (+31 more)

### Community 56 - "code"
Cohesion: 0.04
Nodes (53): RepositoryFile, canPin(), code(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS (+45 more)

### Community 57 - "writer-lock-checks.ts"
Cohesion: 0.08
Nodes (43): WriterProcess, Job, WorkerEvent, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf() (+35 more)

### Community 58 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TreeNode, TypeRule, DesignTable (+24 more)

### Community 59 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.06
Nodes (40): RestoreChain, MetaCommands, Piece, State, StatementSplitter, BackupText, createReadStream(), firstLine() (+32 more)

### Community 6 - "ledger/types.ts"
Cohesion: 0.03
Nodes (132): BlockTransaction, LoadLedger, TransactionParser, LedgerStateItem, RetainedState, LedgerName, ApplyInput, ApplyOutput (+124 more)

### Community 60 - "binding.test.ts"
Cohesion: 0.07
Nodes (45): startHashDecision, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding, Created (+37 more)

### Community 61 - "api-session.test.ts"
Cohesion: 0.08
Nodes (46): coreHeaders, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits, ServedConnection, ModuleApiHandlerOptions (+38 more)

### Community 62 - "core-block-commit.test.ts"
Cohesion: 0.06
Nodes (43): BlockRow, StandInOptions, Commit, Committed, blockHeaderOf(), checkParent(), commitBlock(), hex() (+35 more)

### Community 63 - "module-api.test.ts"
Cohesion: 0.06
Nodes (41): StatsRow, Outcome, ChainDataView, insertRow(), lastTotal(), recentRows(), rowAt(), answerChainData() (+33 more)

### Community 64 - "boundary.test.ts"
Cohesion: 0.08
Nodes (43): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+35 more)

### Community 65 - "order.property.test.ts"
Cohesion: 0.07
Nodes (44): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, dispatch(), isParallelPoint(), runSchedule() (+36 more)

### Community 66 - "module-api.ts"
Cohesion: 0.06
Nodes (34): ModuleApiStart, MountedApiSeams, ChainDataAnswer, ApiError, ApiErrorCode, ApiRequest, ApiResponse, ApiRoutes (+26 more)

### Community 68 - "core-settings.ts"
Cohesion: 0.05
Nodes (43): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, Absent, DeepReadonly (+35 more)

### Community 69 - "checkShape"
Cohesion: 0.07
Nodes (40): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+32 more)

### Community 7 - "range.ts"
Cohesion: 0.02
Nodes (134): ConnectSocket, GatedConnector, Outage, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource (+126 more)

### Community 70 - "graph.ts"
Cohesion: 0.07
Nodes (46): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+38 more)

### Community 71 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 72 - "validateDeclarations"
Cohesion: 0.07
Nodes (34): DeclarationRule, ShapeCase, Stats, schemaName(), migrationPart(), schemaItem(), schemaModule(), schemaModules() (+26 more)

### Community 73 - "config-check.ts"
Cohesion: 0.07
Nodes (38): CheckFinding, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, ConfigFinding, LoadedConfig (+30 more)

### Community 75 - "loop.ts"
Cohesion: 0.09
Nodes (39): HeightRange, ResolvedRange, LateUse, Callback, EntryBoundary, ParallelPoint, PointArguments, PointRun (+31 more)

### Community 76 - "version-checks.ts"
Cohesion: 0.11
Nodes (36): Boundary, CallRecord, CountingNode, Select, UpgradeCase, Walk, Answers, toHex() (+28 more)

### Community 77 - "example-checks.ts"
Cohesion: 0.08
Nodes (28): Served, BlockImport, ChildResult, CodeBlock, installedProject, isolationProblems(), serveCommand(), allowedSource() (+20 more)

### Community 78 - "refcount-model.ts"
Cohesion: 0.07
Nodes (34): Buffer, BlockKind, BlockScript, BoundaryRewrite, DrivenBlock, GeneratedBlock, GeneratedState, GraphNode (+26 more)

### Community 79 - "zod"
Cohesion: 0.06
Nodes (37): Committed, MessageFault, MessageType, instanceIdSchema(), bytesOf(), decodeParameter(), decodeValue(), describe() (+29 more)

### Community 8 - "migrate.ts"
Cohesion: 0.03
Nodes (132): AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference, OwnPart, PlannedSchema (+124 more)

### Community 80 - "cbor.ts"
Cohesion: 0.09
Nodes (37): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+29 more)

### Community 81 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 82 - "private/lockstep-wait.test.ts"
Cohesion: 0.08
Nodes (26): InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal, OpenTransaction (+18 more)

### Community 84 - "config-hash-checks.ts"
Cohesion: 0.07
Nodes (23): Report, A162Options, a162Run, HeaderSeen, HeldLink, HoldingRelay, ReportRelay, RetargetProxy (+15 more)

### Community 87 - "Process"
Cohesion: 0.10
Nodes (6): PauseHold, Process, publicLockstepOf(), asksForChannels(), messageOf(), signalCause()

### Community 88 - ".value"
Cohesion: 0.17
Nodes (18): TypeDef, ScaleError, ScaleReader, ValueReader, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic() (+10 more)

### Community 89 - "core-ledger-state/sql.ts"
Cohesion: 0.10
Nodes (34): StateRow, StoredState, GreyView, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks() (+26 more)

### Community 9 - "node-set.test.ts"
Cohesion: 0.03
Nodes (129): NodeSetFault, NodeSetOptions, NodeTableCheck, CheckedMigration, CanonicalEncodingError, ContentDefinedTables, ContentFunction, ContentOptions (+121 more)

### Community 90 - "intake.test.ts"
Cohesion: 0.08
Nodes (23): PrivateSeen, A114Observation, A116Observation, TestLink, TransportProxy, CountingLink, hashAt(), inMemoryBlock() (+15 more)

### Community 91 - "test/postgres/setup.ts"
Cohesion: 0.07
Nodes (32): Key, Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, Sql, SuiteWatchdogTimeoutError (+24 more)

### Community 92 - "events-fixtures.ts"
Cohesion: 0.12
Nodes (30): Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, metadataWith(), dispatchInfo() (+22 more)

### Community 93 - "validate.ts"
Cohesion: 0.10
Nodes (38): CursorRule, Issue, Plain, SettingsSchema, coreSettingsSchema(), pathOf(), closest(), configFindings() (+30 more)

### Community 94 - "networks.ts"
Cohesion: 0.06
Nodes (36): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+28 more)

### Community 95 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (37): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+29 more)

### Community 96 - "backupAtStop"
Cohesion: 0.07
Nodes (34): MainProcess, backupAtStop(), placeFor(), watchingPgDump(), log(), 00067 — `startUmbraDB` throws synchronously when the host's working directory no longer exists, Evidence, Problem (+26 more)

### Community 116 - "refused"
Cohesion: 0.09
Nodes (31): moduleFacts(), bindCoreChainEvents(), refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem (+23 more)

### Community 126 - "core-chain.test.ts"
Cohesion: 0.07
Nodes (13): runFinalized(), identityRow(), runTo(), namesOf(), prototypesOf(), readOnlyProblems(), runOnce(), runOnce() (+5 more)

### Community 217 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 67 - "version"
Cohesion: 0.05
Nodes (47): side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+39 more)

### Community 102 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 111 - ".slowBlockMs"
Cohesion: 0.07
Nodes (30): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+22 more)

### Community 131 - ".off"
Cohesion: 0.07
Nodes (28): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, 2.1 Where the probe runs (the one real design decision), 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc (+20 more)

### Community 137 - "connectChannel"
Cohesion: 0.10
Nodes (24): discard(), isChannel(), connectChannel(), fault(), 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard, Evidence, Problem, Suggested fix (+16 more)

### Community 154 - "T"
Cohesion: 0.09
Nodes (24): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get` (+16 more)

### Community 165 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 166 - "transportReader"
Cohesion: 0.10
Nodes (19): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Problem, Suggested fix, 10. Requirement coverage, 2. Network, 3. Lifecycle (+11 more)

### Community 180 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.11
Nodes (17): transportReaderRule(), Evidence, 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout (+9 more)

### Community 181 - "The database"
Cohesion: 0.10
Nodes (18): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The node on `/status`, The transport reader, TLS to PostgreSQL: `ssl` (+10 more)

### Community 182 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 201 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 202 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 207 - "v9"
Cohesion: 0.16
Nodes (11): rootScenario(), v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix, 00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream), Evidence (+3 more)

### Community 213 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 219 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 224 - "openssl"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 251 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 268 - "host-signal.ts"
Cohesion: 0.32
Nodes (5): isAbortSignal(), followSignal(), isSignal(), ABORTED, REASON

### Community 271 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 296 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 348 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 35 - "history"
Cohesion: 0.03
Nodes (82): history(), revision(), params(), n(), data(), 7. The module API, 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8) (+74 more)

### Community 49 - ".put"
Cohesion: 0.03
Nodes (57): coreTxResultsOnParse(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+49 more)

### Community 74 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (30): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed(), ledgerV8NodeEntry() (+22 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning (+30 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 121 - "package.json"
Cohesion: 0.06
Nodes (33): bin, umbradb, bugs, url, description, optional, engines, node (+25 more)

### Community 123 - "README.md"
Cohesion: 0.07
Nodes (24): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:, Choosing a database (+16 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 128 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+21 more)

### Community 149 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.07
Nodes (21): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+13 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 151 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 155 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.08
Nodes (25): 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words, 3.2 The rules, for block h (+17 more)

### Community 157 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 168 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 186 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 190 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 191 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 193 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 196 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 199 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 200 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+6 more)

### Community 208 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 209 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 210 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 211 - "UmbraDB"
Cohesion: 0.14
Nodes (14): Backup and restore, Check and run, Create a project, Example: loading `stats-module`, Install UmbraDB, Project status, development and links, Quick start (browser), Quick start (CLI) (+6 more)

### Community 215 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 216 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 218 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 222 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 225 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 226 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 231 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 232 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 233 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 235 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 236 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 237 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 238 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 241 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 242 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 243 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 244 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

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

### Community 252 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 253 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 254 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 255 - "00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes"
Cohesion: 0.19
Nodes (7): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix, 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes, Evidence, Suggested fix

### Community 256 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 257 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 258 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 259 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 260 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 261 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 262 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 263 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 264 - "Acceptance map — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.25
Nodes (7): 10. Definition of done, item by item, 1. Library-mode guarantees, 3. Lifecycle, 5. Modules and the ledger worker, 7. The command and shared resolution, 9. `core-arch` criteria rewritten by this change, Acceptance map — START-UMBRADB: UmbraDB as a library

### Community 265 - "Requirement: BK-1 Backup"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 266 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 270 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 272 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 273 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 274 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 275 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 276 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 277 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 278 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 279 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 282 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 283 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 284 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 285 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 286 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 287 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 288 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 289 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 290 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 291 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 292 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 293 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 294 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 295 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 297 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 298 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 300 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 301 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 302 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 303 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 304 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 305 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 306 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 307 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 308 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 309 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 310 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 311 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 312 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 313 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 314 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 315 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 316 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 317 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 318 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 319 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 320 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 321 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 322 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 323 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 324 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 325 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 326 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 327 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 328 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 329 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 330 - "00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why"
Cohesion: 0.40
Nodes (4): 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why, Evidence, Problem, Suggested fix

### Community 331 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 332 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 333 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 334 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 335 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 336 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 337 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 339 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 340 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 341 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 342 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 343 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 344 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 345 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 346 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+31 more)

### Community 99 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

## Knowledge Gaps
- **58 isolated node(s):** `RFC-6455`, `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx` (+53 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4296 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `startUmbraDB`, `ingest-harness.ts`, `admin-harness.ts`, `UmbraError`, `tape/index.ts`, `ledger/types.ts`, `range.ts`, `migrate.ts`, `node-set.test.ts`, `src/db/postgres.ts`, `loop.test.ts`, `contract-data-checks.ts`, `NodeClient`, `backup/restore.ts`, `ref_node_crypto`, `adapter-fixtures.ts`, `builds.ts`, `ref_node_fs`, `config/history.ts`, `change-capture.ts`, `NodeBlockSource`, `client.test.ts`, `declaration.ts`, `runner/process.ts`, `.from`, `ledger-tapes.ts`, `pause-fixtures.ts`, `adapter.ts`, `ref_node_url`, `validation.ts`, `core-transport.ts`, `ModuleDeclaration`, `builder.test.ts`, `refused-configuration.test.ts`, `channel-queue.test.ts`, `cli/command.ts`, `worker-storage.test.ts`, `core-ledger-state.ts`, `configured.ts`, `process-harness.ts`, `config-check-database.test.ts`, `refcount-tables.test.ts`, `resolve.ts`, `backup/backup.ts`, `transport-faults.test.ts`, `slow-block-harness.ts`, `ledger/ledger-tasks.test.ts`, `core-block-parsed.ts`, `ref_node_timers`, `interfaces/transaction-history-storage.ts`, `code`, `writer-lock-checks.ts`, `column-rules.test.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `binding.test.ts`, `api-session.test.ts`, `core-block-commit.test.ts`, `module-api.test.ts`, `boundary.test.ts`, `order.property.test.ts`, `core-settings.ts`, `retirement.test.ts`, `validateDeclarations`, `config-check.ts`, `cold-boot-recovery.integration.test.ts`, `version-checks.ts`, `example-checks.ts`, `refcount-model.ts`, `zod`, `private/lockstep-wait.test.ts`, `core-ledger-state/sql.ts`, `intake.test.ts`, `test/postgres/setup.ts`, `networks.ts`, `cbor.property.test.ts`, `api-server.test.ts`, `redact.ts`, `pg-tx-history-adapter.ts`, `release-version.ts`, `cli/database.ts`, `channels.ts`, `core.ts`, `browser/build.ts`, `code-registry.ts`, `restore-ledger.ts`, `resolver-boundary.ts`, `package.json`, `browser.test.ts`, `core-chain.test.ts`, `ledger-sweep.test.ts`, `src/ledger/identity.ts`, `checks.test.ts`, `PointName`, `documents.ts`, `config/plain-data.ts`, `read-gate.ts`, `core-chain-events.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `surface.test.ts`, `height-versioned.property.test.ts`, `worker-threads.test.ts`, `node-bridge.ts`, `core-block-fetch.test.ts`, `library-documents.test.ts`, `pglite-timeouts.test.ts`, `read-height.property.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `backbone/part-migrations.test.ts`, `excluded-not-exported.test.ts`, `lockstep-refusals.test.ts`, `LoopPauses`, `shims.test.ts`, `mutation-per-adapter.mjs`, `web-lock.ts`, `twox.ts`, `ws-mutual-tls.test.ts`, `history.property.test.ts`, `Heartbeat`, `host-signal.ts`, `vendored-ledger-files.test.ts`, `pins.test.ts`?**
  _High betweenness centrality (0.220) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-6455`, `RFC-3339`, `@stryker-mutator/core` to the rest of the system?**
  _58 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.017602440432022425 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `vitest`, `startUmbraDB`, `ingest-harness.ts`, `admin-harness.ts`, `tape/index.ts`, `ledger/types.ts`, `range.ts`, `migrate.ts`, `node-set.test.ts`, `src/db/postgres.ts`, `loop.test.ts`, `contract-data-checks.ts`, `NodeClient`, `backup/restore.ts`, `builds.ts`, `ref_node_fs`, `config/history.ts`, `change-capture.ts`, `NodeBlockSource`, `client.test.ts`, `declaration.ts`, `runner/process.ts`, `pause-fixtures.ts`, `validation.ts`, `core-transport.ts`, `ModuleDeclaration`, `refused-configuration.test.ts`, `channel-queue.test.ts`, `cli/command.ts`, `core-ledger-state.ts`, `FinalizedLoop`, `configured.ts`, `process-harness.ts`, `config-check-database.test.ts`, `refcount-tables.test.ts`, `resolve.ts`, `backup/backup.ts`, `transport-faults.test.ts`, `slow-block-harness.ts`, `writer-lock-checks.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `binding.test.ts`, `core-block-commit.test.ts`, `module-api.test.ts`, `module-api.ts`, `core-settings.ts`, `checkShape`, `graph.ts`, `validateDeclarations`, `config-check.ts`, `loop.ts`, `version-checks.ts`, `example-checks.ts`, `cbor.ts`, `validate.ts`, `backupAtStop`, `api-server.test.ts`, `cli/database.ts`, `core-chain.ts`, `refused`, `restore-ledger.ts`, `BlockRef`, `core-chain.test.ts`, `src/ledger/identity.ts`, `checks.test.ts`, `PointName`, `mapping.ts`, `config/plain-data.ts`, `ledger/metadata.ts`, `options.ts`, `.#open`, `version-table.ts`, `backbone/part-migrations.test.ts`, `lockstep-refusals.test.ts`, `shims.test.ts`, `web-lock.ts`, `Session`, `browser/src/config/load.ts`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `startUmbraDB` be split into smaller, more focused modules?**
  _Cohesion score 0.01707333171987415 - nodes in this community are weakly interconnected._