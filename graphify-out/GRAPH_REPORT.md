# Graph Report - UmbraDB

## Corpus Check
- 1287 files · ~1,818,316 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13260 nodes · 41485 edges · 365 communities (328 shown, 37 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3453 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `068cb91e54c1531d` (1287 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- startUmbraDB
- column-rules.ts
- backup/restore.ts
- browser/build.ts
- shims.test.ts
- redact.ts
- ChannelEndpoint
- paused-harness.ts
- chrome.ts
- binding.test.ts
- node-source-status.test.ts
- release-version.ts
- entries.ts
- checks.test.ts
- sweep-tapes.ts
- chain-placement.test.ts
- resolver-boundary.ts
- loop.test.ts
- code-registry.ts
- api-socket.ts
- pg-tx-history-adapter.ts
- .concat
- sweep-fixture.ts
- config/plain-data.ts
- documents.ts
- mapping.ts
- read-gate.ts
- relays.ts
- ref_node_url
- ws-mutual-tls.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- validation.test.ts
- node-bridge.ts
- surface.test.ts
- ProcessAdmin
- db/errors.ts
- options.ts
- configuration-refusal.test.ts
- pack-install.mjs
- block-fetch-decode.test.ts
- client.test.ts
- backbone/part-migrations.test.ts
- harness.ts
- pglite-timeouts.test.ts
- library-documents.test.ts
- version-table.ts
- .#process
- key-handling-checks.ts
- database-parts.ts
- transaction-history-storage.property.test.ts
- ingest-faults.test.ts
- ledger-checks.ts
- ledger-table-config.test.ts
- ReadHandle
- placement.ts
- FakeNode
- LoopPauses
- adapter-fixtures.ts
- core-digest.ts
- statementsOf
- .#close
- stats-module.ts
- core.ts
- apiErrorResponse
- UmbraError
- cbor.ts
- SubscriptionConnection
- browser/src/config/load.ts
- worker-threads.test.ts
- 8. Admin endpoints
- channel-queue.test.ts
- api-answers.ts
- ModuleApi
- history.property.test.ts
- worker-threads-worker.ts
- hex
- Worker
- TapeAnswers
- process-backends.ts
- ProcessItems
- host.ts
- DatabaseParts
- node-set.test.ts
- mutation-evidence.d.mts
- StartedModuleApi
- AsyncLocalStorage
- contract-data-checks.ts
- transport.test.ts
- change-capture.ts
- src/db/postgres.ts
- NodeClient
- tape/index.ts
- core-transport.ts
- SkipsAfterReconnect
- runner/process.ts
- NodeFS
- contract-modules.test.ts
- WaitsInTransaction
- range.ts
- LedgerPackage
- writer-lock-checks.ts
- node-source.ts
- core-config.test.ts
- adapter.ts
- pause-fixtures.ts
- builder.test.ts
- NodeBlockSource
- backup/backup.ts
- history.test.ts
- fetch-fixtures.ts
- ledger-graph-tapes.ts
- browser.test.ts
- builds.ts
- declaration.ts
- messages.ts
- ledger-storage.test.ts
- core-ledger-state.ts
- .from
- vitest
- ledger/types.ts
- validate.ts
- connectWebSocket
- validateConfig
- transforms.test.ts
- InMemoryBlockSource
- PgTransactionHistoryStorage
- refcount-model.ts
- resolve.ts
- boundary.test.ts
- core-block-commit.test.ts
- slow-block-harness.ts
- refcount-restart.ts
- admin-harness.ts
- ledger-units.test.ts
- core-settings.ts
- interfaces/transaction-history-storage.ts
- loop-stop-harness.ts
- chain-events-decode.test.ts
- Process
- cold-boot-recovery.integration.test.ts
- config/history.ts
- version-checks.ts
- api-server.test.ts
- retirement.test.ts
- refcount-step.test.ts
- graph.ts
- reason
- core-chain.test.ts
- refcount-histories.ts
- page.ts
- real-tapes.ts
- validation.ts
- ref_node_fs
- FinalizedLoop
- networks.ts
- chain-data.test.ts
- order.property.test.ts
- test/postgres/setup.ts
- restore-ledger.ts
- file-mode.test.ts
- Acceptance map — START-UMBRADB: UmbraDB as a library
- history
- graph.py
- .slowBlockMs
- refused
- .cwd
- transportReader
- following
- UmbraDB module guide
- sweep-fixture.test.ts
- .disconnect
- mutation-per-adapter.mjs
- mapping.test.ts
- Design — START-UMBRADB: UmbraDB as a library
- Design — v1.1.0: Quint model checking
- call
- api-session.test.ts
- connectChannel
- .#schedule
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- v9
- host-signal.ts
- .#settle
- orphan-watcher.mjs
- runSchedule
- found
- crash-worker.ts
- .put
- code
- version
- .off
- T
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- UmbraDB third-party component inventory (SBOM)
- package.json
- ADDED Requirements
- README.md
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- ADDED Requirements
- Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- Boundaries, threats and controls
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- Requirement: BK-1 Backup
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
- Requirement: DT-3 The contents hash
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- [0.10.0] - 2026-10-27
- scoped-review-manifest
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- Contributing
- stats-module/tsconfig.json
- try-module/tsconfig.json
- MODIFIED Requirements
- Requirement: BK-1 Backup
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
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
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- Proposal — Sprint 1: project setup + TemporalKV
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
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- start-stack.sh
- peerDependenciesMeta
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
1. `vitest` - 464 edges
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
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
- `Evidence` --references--> `ManualTimers`  [INFERRED]
  docs/issues/00016-heartbeat-above-timer-limit.md → test/node/manual-timers.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (365 total, 37 thin omitted)

### Community 0 - "startUmbraDB"
Cohesion: 0.02
Nodes (203): AdminSeams, BackupWritten, coreEntry, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle (+195 more)

### Community 1 - "column-rules.ts"
Cohesion: 0.02
Nodes (189): ConfigRow, DumpInput, CanonicalEncodingError, ContentDefinedTables, ContentOptions, TableContent, ModuleColumn, ModuleContentsError (+181 more)

### Community 10 - "backup/restore.ts"
Cohesion: 0.03
Nodes (93): PrivateBlockSource, PrivateChecks, privateIntake, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision (+85 more)

### Community 100 - "browser/build.ts"
Cohesion: 0.07
Nodes (28): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+20 more)

### Community 101 - "shims.test.ts"
Cohesion: 0.08
Nodes (26): PgliteLockUse, BufferEncoding, sha256, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), hex() (+18 more)

### Community 102 - "redact.ts"
Cohesion: 0.09
Nodes (31): RevisionSettings, ManifestHistoryRow, PlainObject, RedactableConfig, RedactionForms, SecretForm, TextPattern, fieldKinds (+23 more)

### Community 106 - "ChannelEndpoint"
Cohesion: 0.12
Nodes (11): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), discard(), isChannel(), 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard (+3 more)

### Community 107 - "paused-harness.ts"
Cohesion: 0.11
Nodes (30): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, a176Project(), keeperModule() (+22 more)

### Community 109 - "chrome.ts"
Cohesion: 0.10
Nodes (19): Cdp, CdpEvent, ChromeBrowser, ChromeTab, Download, PageRequest, chrome(), chrome() (+11 more)

### Community 11 - "binding.test.ts"
Cohesion: 0.03
Nodes (122): LockstepCondition, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding, Created (+114 more)

### Community 110 - "node-source-status.test.ts"
Cohesion: 0.07
Nodes (19): QueuedBlock, BlockItems, Fetching, Recorder, EagerItems, EagerLoop, KeptItems, KeptLoop (+11 more)

### Community 112 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 115 - "entries.ts"
Cohesion: 0.07
Nodes (31): DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+23 more)

### Community 116 - "checks.test.ts"
Cohesion: 0.08
Nodes (23): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql() (+15 more)

### Community 117 - "sweep-tapes.ts"
Cohesion: 0.10
Nodes (20): ModelBatch, ModelSnapshot, SweepModel, SweepComparison, SweepComparisonSeen, TapeComparison, BYTE_TABLES(), tableDifferences() (+12 more)

### Community 118 - "chain-placement.test.ts"
Cohesion: 0.08
Nodes (29): ChainOutcome, CallTx, LedgerTx, StagenetBlockJson, chainHashOf(), writeTransactionRows(), inThreadParser(), insertTransactionRows() (+21 more)

### Community 119 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 12 - "loop.test.ts"
Cohesion: 0.03
Nodes (117): Transaction, ErrorCode, EntryRange, GraphInput, CommitOutcome, HeldHeight, PastFaultCase, RefusalCase (+109 more)

### Community 121 - "code-registry.ts"
Cohesion: 0.10
Nodes (30): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+22 more)

### Community 124 - "api-socket.ts"
Cohesion: 0.14
Nodes (29): coreHeaders, MountedApiSeams, ChannelConnectOptions, connectionRules, ModuleApiLimits, ServedConnection, ModuleApiHandlerOptions, moduleApiHandlers (+21 more)

### Community 126 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 128 - ".concat"
Cohesion: 0.08
Nodes (21): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+13 more)

### Community 13 - "sweep-fixture.ts"
Cohesion: 0.04
Nodes (121): CoreLedgerStateOptions, RefcountFault, FixtureRun, FixtureRunOptions, TableSnapshot, Touches, Fault, FaultRun (+113 more)

### Community 130 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (23): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+15 more)

### Community 134 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 135 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 137 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 138 - "relays.ts"
Cohesion: 0.10
Nodes (10): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, messageText(), hostPort(), sendable() (+2 more)

### Community 14 - "ref_node_url"
Cohesion: 0.02
Nodes (107): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+99 more)

### Community 140 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (21): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+13 more)

### Community 142 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 143 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 144 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 145 - "validation.test.ts"
Cohesion: 0.09
Nodes (18): DeclarationRule, Case, ShapeCase, Stats, schemaName(), first(), validateWith(), module() (+10 more)

### Community 146 - "node-bridge.ts"
Cohesion: 0.12
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 147 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 149 - "ProcessAdmin"
Cohesion: 0.14
Nodes (9): ProcessAdmin, Heartbeat, HeartbeatOptions, TimerHandle, writerLockHeld(), lastTick(), tickAgeMs(), beat() (+1 more)

### Community 15 - "db/errors.ts"
Cohesion: 0.03
Nodes (86): PostgresConnection, PostgresOptions, ReadOnlyDatabase, ReadOptions, ReadTimeoutSetting, ErrorDetails, Settings, TestBackend (+78 more)

### Community 154 - "options.ts"
Cohesion: 0.20
Nodes (24): readOptions, addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding(), guarded(), isAbortSignal() (+16 more)

### Community 155 - "configuration-refusal.test.ts"
Cohesion: 0.15
Nodes (18): ConfigFinding, ConfigInput, configurationRefused(), findingText(), refusalFindings(), configurationFindings(), configurationRefusalLines(), isConfigurationRefusal() (+10 more)

### Community 158 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 159 - "block-fetch-decode.test.ts"
Cohesion: 0.14
Nodes (19): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+11 more)

### Community 16 - "client.test.ts"
Cohesion: 0.03
Nodes (74): Connection, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure (+66 more)

### Community 160 - "backbone/part-migrations.test.ts"
Cohesion: 0.17
Nodes (17): ManifestMigration, FoldedPart, RecordedMigration, earlierBootstrapSql(), earlierRefusalProblems(), earlierRows(), earlierRowsSql(), recorded() (+9 more)

### Community 161 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 165 - "pglite-timeouts.test.ts"
Cohesion: 0.12
Nodes (14): Run, Job, WorkerEvent, expectNeverCutOffNorHung(), settings(), apiRead(), engine(), report() (+6 more)

### Community 166 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 167 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 168 - ".#process"
Cohesion: 0.12
Nodes (3): Activity, LoopObserver, runWatched()

### Community 169 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 17 - "database-parts.ts"
Cohesion: 0.03
Nodes (99): BrowserConfiguration, BrowserRun, PrivateInstance, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, Scope, crossedError (+91 more)

### Community 170 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 172 - "ingest-faults.test.ts"
Cohesion: 0.15
Nodes (15): ProcessCondition, A84Observation, LoggedRetry, OutageObservation, RetrySample, a84Run(), a84Tape(), discarded() (+7 more)

### Community 178 - "ledger-checks.ts"
Cohesion: 0.24
Nodes (18): LedgerEvent, TransactionResult, VmLog, ledgerItemsSeen, a106Problems(), a107Problems(), a99Problems(), blockZeroProblems() (+10 more)

### Community 179 - "ledger-table-config.test.ts"
Cohesion: 0.25
Nodes (17): Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts() (+9 more)

### Community 18 - "ReadHandle"
Cohesion: 0.03
Nodes (86): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue (+78 more)

### Community 182 - "placement.ts"
Cohesion: 0.16
Nodes (17): ChainTransaction, EventPhase, ScaleValue, callVariant(), carried(), is(), placeTransactions(), refuse() (+9 more)

### Community 187 - "LoopPauses"
Cohesion: 0.18
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 19 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (100): StoredNode, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+92 more)

### Community 190 - "core-digest.ts"
Cohesion: 0.23
Nodes (13): TableDigest, TableDigestRow, CapturedTable, capturedOf(), digestBlock(), checkpointDigests(), readDigests(), setDigest() (+5 more)

### Community 191 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 192 - ".#close"
Cohesion: 0.15
Nodes (4): SignalTarget, withTables(), losingCommits(), landingCommits()

### Community 193 - "stats-module.ts"
Cohesion: 0.23
Nodes (12): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+4 more)

### Community 198 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 199 - "apiErrorResponse"
Cohesion: 0.15
Nodes (12): ApiRequest, ApiResponse, Leaking, bodyTooLarge(), fetchBody(), utf8Text(), readBody(), apiErrorResponse() (+4 more)

### Community 2 - "UmbraError"
Cohesion: 0.02
Nodes (169): Database, SchemaWriteHandle, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner (+161 more)

### Community 20 - "cbor.ts"
Cohesion: 0.03
Nodes (111): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+103 more)

### Community 204 - "SubscriptionConnection"
Cohesion: 0.29
Nodes (6): SubscriptionCarrier, SubscriptionConnection, errorMessage(), socketConnection(), encodeJson(), hex()

### Community 205 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 206 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 207 - "8. Admin endpoints"
Cohesion: 0.18
Nodes (7): NodeFacts, NodeStatus, NodeConnection, SourceNodeView, PauseBy, PausedCondition, 8. Admin endpoints

### Community 21 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (88): demoLink, EndpointOptions, Envelope, LinkTimers, MessagePortLike, PrivateLinkChannel, CoreChannelSeams, Received (+80 more)

### Community 210 - "api-answers.ts"
Cohesion: 0.26
Nodes (11): HeadersArgument, answerNotServing(), byteLength(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing(), refuseNotServing() (+3 more)

### Community 211 - "ModuleApi"
Cohesion: 0.22
Nodes (5): ChainDataAnswer, ApiError, ModuleApi, read(), specificity()

### Community 213 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 215 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 22 - "hex"
Cohesion: 0.04
Nodes (86): nodeKeys, Node, GeneratedBlock, GeneratedState, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child (+78 more)

### Community 225 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 23 - "process-backends.ts"
Cohesion: 0.03
Nodes (92): ProcessConfiguration, BlockParsed, BlockParsedOptions, ChainEvent, NetworkRuleName, itemsSeen, SourceClass, Flaky (+84 more)

### Community 24 - "host.ts"
Cohesion: 0.04
Nodes (81): LoadLedger, TransactionParser, LedgerName, LedgerTask, LedgerTaskBlock, NodeBatch, ParsedTransaction, AppliedState (+73 more)

### Community 25 - "DatabaseParts"
Cohesion: 0.03
Nodes (97): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName (+89 more)

### Community 26 - "node-set.test.ts"
Cohesion: 0.03
Nodes (102): NodeSetFault, NodeSetOptions, NodeTableCheck, KeyCounts, RefcountCheck, RefcountStatement, StateRow, StoredState (+94 more)

### Community 261 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "contract-data-checks.ts"
Cohesion: 0.04
Nodes (95): contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx, handoff (+87 more)

### Community 28 - "transport.test.ts"
Cohesion: 0.03
Nodes (74): Message, MessageType, Keeping, PrivateBackend, SessionSeen, A162Options, a162Run, HeaderSeen (+66 more)

### Community 29 - "change-capture.ts"
Cohesion: 0.03
Nodes (92): CaptureColumn, CaptureState, GuardTableRow, Chain, ChainOptions, DigestRow, captureDefinitions(), capturedTables() (+84 more)

### Community 3 - "src/db/postgres.ts"
Cohesion: 0.02
Nodes (112): BenchEnv, PostgresParts, SslMode, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Job (+104 more)

### Community 30 - "NodeClient"
Cohesion: 0.05
Nodes (65): FinalizedHeightOptions, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter, NodeBlock (+57 more)

### Community 31 - "tape/index.ts"
Cohesion: 0.05
Nodes (65): RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError, Connection (+57 more)

### Community 32 - "core-transport.ts"
Cohesion: 0.03
Nodes (64): PrivateLinkAddress, CoreChannelsOptions, Queued, Connected, CoreTransport, CoreTransportOptions, CoreLink, CoreSessionOptions (+56 more)

### Community 33 - "runner/process.ts"
Cohesion: 0.03
Nodes (68): BodyExtrinsic, BlockBody, BlockItemSource, CoreBlockItems, ChainCheck, ChainCheckInput, VerifyLedgerPackagesOptions, transportReaderFacts (+60 more)

### Community 34 - "contract-modules.test.ts"
Cohesion: 0.04
Nodes (81): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+73 more)

### Community 35 - "range.ts"
Cohesion: 0.04
Nodes (76): NodeSubscription, Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions (+68 more)

### Community 36 - "LedgerPackage"
Cohesion: 0.05
Nodes (49): ApplyInput, LedgerPackage, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, Driver, StagenetFixtureJson (+41 more)

### Community 37 - "writer-lock-checks.ts"
Cohesion: 0.04
Nodes (75): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, WriterProcess, Job (+67 more)

### Community 39 - "node-source.ts"
Cohesion: 0.06
Nodes (63): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+55 more)

### Community 4 - "core-config.test.ts"
Cohesion: 0.03
Nodes (151): NetworkShown, OpenedConfig, AllowedDetail, MountedAdminAnswer, PrivateSideFacts, ProcessAdminOptions, adminRoutes, DigestRow (+143 more)

### Community 40 - "adapter.ts"
Cohesion: 0.04
Nodes (68): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+60 more)

### Community 41 - "pause-fixtures.ts"
Cohesion: 0.04
Nodes (66): backupSignalRelay, BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable, PausableOptions, RecorderGlobals (+58 more)

### Community 42 - "builder.test.ts"
Cohesion: 0.04
Nodes (43): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Metadata, Step, Frame (+35 more)

### Community 43 - "NodeBlockSource"
Cohesion: 0.05
Nodes (28): HeadWait, NodeBlockSource, NodeCallOptions, NodeHeader, PreparedBlock, QueueRunner, EventsRunner, RecordingClient (+20 more)

### Community 44 - "backup/backup.ts"
Cohesion: 0.05
Nodes (71): BackupInput, BackupSeams, BackupTarget, BackupFacts, Manifest, ManifestTool, PgliteDump, SnapshotSeams (+63 more)

### Community 45 - "history.test.ts"
Cohesion: 0.05
Nodes (75): HistoryCheck, HistoryOptions, HistoryRow, HistoryRule, AppliedMigration, Simulation, Start, Holder (+67 more)

### Community 46 - "fetch-fixtures.ts"
Cohesion: 0.05
Nodes (73): ArgType, BlockOptions, CallSpec, RUNTIME, Decoded, FetchSeen, CrashEvent, CrashJob (+65 more)

### Community 47 - "ledger-graph-tapes.ts"
Cohesion: 0.05
Nodes (71): Reader, Seen, workerRecord, FixtureConfig, StoredCheck, ContractRow, conversionRun, Released (+63 more)

### Community 48 - "browser.test.ts"
Cohesion: 0.05
Nodes (72): BrowserBuild, Reachable, RestoreAttempt, PageApiChannel, PageBackup, pageBench, PageEvent, PageLink (+64 more)

### Community 49 - "builds.ts"
Cohesion: 0.04
Nodes (64): AdminStarter, RunOptions, RunSeams, SignalSource, stopSignal, LockstepInstance, EngineInput, UserModulesSource (+56 more)

### Community 5 - "declaration.ts"
Cohesion: 0.02
Nodes (137): versionEntry, BlockHeader, ItemSink, KnownPointsOnly, ModuleDeclaration, PointName, TableDeclaration, HeightRange (+129 more)

### Community 50 - "messages.ts"
Cohesion: 0.04
Nodes (49): PublicSide, Committed, HelloAck, JsonValue, MessageFault, ReadResult, StatementResult, CarrierConnection (+41 more)

### Community 51 - "ledger-storage.test.ts"
Cohesion: 0.06
Nodes (65): watched, SeenLoad, RestartEvent, RestartJob, retentionSeen, ledgerScenario, WindowBackup, Reader (+57 more)

### Community 52 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (59): BlockLedgerSource, ComputedBlock, LedgerBinding, LedgerStateItem, RetainedState, retainedStates, CoreRevision, ContractKeys (+51 more)

### Community 53 - ".from"
Cohesion: 0.03
Nodes (61): Buffer, Hash, contentsHash, Cbor, DigestRow, DigestRows, Reader, ReadableDatabase (+53 more)

### Community 54 - "vitest"
Cohesion: 0.05
Nodes (42): Served, Finding, BlockImport, ChildResult, CodeBlock, installedProject, Upstream, isolationProblems() (+34 more)

### Community 55 - "ledger/types.ts"
Cohesion: 0.05
Nodes (51): ApplyOutput, LedgerPackageOptions, StateSummary, V9Logs, LedgerHeight, RawPackageClass, recordedGenesis, LoadAdapter (+43 more)

### Community 56 - "validate.ts"
Cohesion: 0.05
Nodes (62): HistoryFinding, ConfigRule, CursorRule, EntryRef, Finding, Issue, Plain, SettingsSchema (+54 more)

### Community 57 - "connectWebSocket"
Cohesion: 0.05
Nodes (38): Outage, Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault (+30 more)

### Community 58 - "validateConfig"
Cohesion: 0.05
Nodes (61): SnapshotFacts, ConfigSnapshot, ImportedConfig, plainData, EntryView, earlyRedactor(), commandBuild(), configSecrets() (+53 more)

### Community 59 - "transforms.test.ts"
Cohesion: 0.07
Nodes (47): Failure, Variant, TapeError, TransformError, NotifyRecord, recordKind, SubscriptionId, CallSelection (+39 more)

### Community 6 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (137): BlockRef, InMemoryBlockSource, ProcessingEnd, ProcessStatus, Job, WorkerEvent, ChainBuildOptions, A77Observation (+129 more)

### Community 60 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (42): MergeEntriesFn, TransactionHistoryEntry, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, encodeStoredEntry(), rowToEntry(), abortErrorLike(), capitalize() (+34 more)

### Community 61 - "refcount-model.ts"
Cohesion: 0.07
Nodes (38): BlockKind, BlockScript, BoundaryRewrite, Dice, DrivenBlock, GraphNode, GraphWorld, HistoryScript (+30 more)

### Community 63 - "resolve.ts"
Cohesion: 0.06
Nodes (57): ConfigFacts, CoreChainFacts, RestoreBase, CheckState, ConfigCheckOptions, ProcessSide, HistoryInput, CheckedConfig (+49 more)

### Community 64 - "boundary.test.ts"
Cohesion: 0.07
Nodes (49): DesignTable, RowCoverage, ModuleReference, Finding, rule(), collationsWritten(), componentCode(), componentExports() (+41 more)

### Community 65 - "core-block-commit.test.ts"
Cohesion: 0.05
Nodes (49): BlockHeaderItem, BlockRow, CoreBlockHeader, StandInOptions, Commit, AlwaysLanded, blockHeaderOf(), checkParent() (+41 more)

### Community 66 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (51): BlockEventSource, LoopInput, ReadOpener, MisuseReports, StatusBody, Times, Wait, askedSource (+43 more)

### Community 68 - "refcount-restart.ts"
Cohesion: 0.05
Nodes (48): BatchJson, Hold, Light, Line, NodeSetKeeper, Observed, observedRun, RestartChain (+40 more)

### Community 7 - "admin-harness.ts"
Cohesion: 0.03
Nodes (139): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer, AdminSnapshot (+131 more)

### Community 70 - "ledger-units.test.ts"
Cohesion: 0.06
Nodes (46): ManifestLine, Path, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage() (+38 more)

### Community 71 - "core-settings.ts"
Cohesion: 0.04
Nodes (50): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, Absent, DeepReadonly (+42 more)

### Community 72 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (39): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, JsonEncoded (+31 more)

### Community 73 - "loop-stop-harness.ts"
Cohesion: 0.08
Nodes (42): A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore (+34 more)

### Community 74 - "chain-events-decode.test.ts"
Cohesion: 0.09
Nodes (43): eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, LedgerScenarioOptions (+35 more)

### Community 75 - "Process"
Cohesion: 0.08
Nodes (9): PauseHold, Process, openedCursorHeight(), asksForChannels(), messageOf(), privateLinkOf(), signalCause(), sourceOf() (+1 more)

### Community 77 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (33): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+25 more)

### Community 78 - "config/history.ts"
Cohesion: 0.08
Nodes (42): CoreVersion, HistoryCode, HistoryContext, ProvidesRow, Span, PlacedEntry, UpgradeEntry, asNumber() (+34 more)

### Community 79 - "version-checks.ts"
Cohesion: 0.09
Nodes (26): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, Boundary, CallRecord, CountingNode (+18 more)

### Community 8 - "api-server.test.ts"
Cohesion: 0.02
Nodes (118): OpenedFacts, ApiRegistry, Revision, ResolvedGraph, ModuleApiStart, ChainDataView, ApiErrorCode, ApiRoutes (+110 more)

### Community 80 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 81 - "refcount-step.test.ts"
Cohesion: 0.07
Nodes (28): refcountStep, RefcountTables, ChildReader, ChildVisitor, RefcountBatch, Given, Halt, Outcome (+20 more)

### Community 82 - "graph.ts"
Cohesion: 0.07
Nodes (45): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+37 more)

### Community 83 - "reason"
Cohesion: 0.05
Nodes (42): TransactionHistoryStorage, reason(), 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents (+34 more)

### Community 84 - "core-chain.test.ts"
Cohesion: 0.06
Nodes (29): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, WaitingCondition, boundTo() (+21 more)

### Community 85 - "refcount-histories.ts"
Cohesion: 0.09
Nodes (38): Call, FacetOptions, Facets, NodeSetCache, tapeDeterminism, TapeDeterminismOptions, tapeHistory, TapeHistoryOptions (+30 more)

### Community 86 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 87 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 88 - "validation.ts"
Cohesion: 0.09
Nodes (33): PlacedDeclaration, Plain, Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject() (+25 more)

### Community 9 - "ref_node_fs"
Cohesion: 0.04
Nodes (108): RestoreOutcome, BackupBackend, BackupDatabase, killedRestore, TickerHandle, TickerProcess, FileProcess, privateBackup (+100 more)

### Community 90 - "FinalizedLoop"
Cohesion: 0.07
Nodes (15): FinalizedLoop, Startup, SkipsLockstep, Batching, WaitingInRead, ItemsAfterWrite, CommitsDespiteLastWrite, FailingAfter (+7 more)

### Community 92 - "networks.ts"
Cohesion: 0.06
Nodes (38): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+30 more)

### Community 93 - "chain-data.test.ts"
Cohesion: 0.10
Nodes (38): BlockSpec, EventSpec, Json, Scenario, transactionSpec, chainBlock, browserChain, a91RangeScenario() (+30 more)

### Community 96 - "order.property.test.ts"
Cohesion: 0.08
Nodes (36): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, registering(), recording(), runOf() (+28 more)

### Community 97 - "test/postgres/setup.ts"
Cohesion: 0.07
Nodes (32): Key, Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, Sql, SuiteWatchdogTimeoutError (+24 more)

### Community 98 - "restore-ledger.ts"
Cohesion: 0.09
Nodes (33): FileEntries, FileRow, ledgerBackup, RestorableBackup, RestoreBuild, cursorHeight(), isEmptyDatabase(), contentsHashOf() (+25 more)

### Community 99 - "file-mode.test.ts"
Cohesion: 0.08
Nodes (30): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+22 more)

### Community 171 - "Acceptance map — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.11
Nodes (17): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 10. Definition of done, item by item, 1. Library-mode guarantees, 3. Lifecycle, 5. Modules and the ledger worker (+9 more)

### Community 38 - "history"
Cohesion: 0.03
Nodes (88): history(), n(), data(), 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants, 2.4 Migrations: one per part (O-2), 2.5 Content-based determinism (O-8; DT-3, DT-4) (+80 more)

### Community 108 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 120 - ".slowBlockMs"
Cohesion: 0.07
Nodes (29): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+21 more)

### Community 122 - "refused"
Cohesion: 0.08
Nodes (31): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration (+23 more)

### Community 125 - ".cwd"
Cohesion: 0.08
Nodes (26): join(), normalize(), resolve(), log(), delimiter, sep, 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented, Evidence (+18 more)

### Community 131 - "transportReader"
Cohesion: 0.07
Nodes (27): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 4. Configuration, Impact (+19 more)

### Community 148 - "following"
Cohesion: 0.08
Nodes (23): originOf(), moduleFacts(), cursorRead(), following(), 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began, Evidence, Problem, Suggested fix (+15 more)

### Community 156 - "UmbraDB module guide"
Cohesion: 0.08
Nodes (24): params(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations, 16. Upgrades (+16 more)

### Community 173 - "sweep-fixture.test.ts"
Cohesion: 0.17
Nodes (17): childKey(), referenced(), applyInput(), at(), batchText(), blockHash(), embeddedOf(), hex() (+9 more)

### Community 188 - ".disconnect"
Cohesion: 0.15
Nodes (14): fault(), modules(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants (+6 more)

### Community 196 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 197 - "mapping.test.ts"
Cohesion: 0.16
Nodes (5): mapValue(), oid(), identity(), RESULT_COLUMNS, RFC-3339

### Community 200 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.15
Nodes (12): transportReaderRule(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout, 2. Architecture (+4 more)

### Community 209 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 218 - "api-session.test.ts"
Cohesion: 0.21
Nodes (10): answerRequest(), moduleApiFetch(), responseOf(), serve(), throwing(), unreadableAmount(), db, MALFORMED_CLIENT (+2 more)

### Community 223 - "connectChannel"
Cohesion: 0.25
Nodes (7): connectChannel(), Problem, 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once, Evidence, Problem, Suggested fix, 5.4 Channels

### Community 244 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 251 - "v9"
Cohesion: 0.38
Nodes (6): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix, 14. External claims and their evidence

### Community 264 - "host-signal.ts"
Cohesion: 0.38
Nodes (4): followSignal(), isSignal(), ABORTED, REASON

### Community 282 - ".#settle"
Cohesion: 0.33
Nodes (3): cursorText(), isBlock(), sameBytes()

### Community 283 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 323 - "runSchedule"
Cohesion: 0.80
Nodes (5): dispatch(), runSchedule(), inBackbonePlace(), withParallelWaves(), wrong()

### Community 326 - "found"
Cohesion: 0.67
Nodes (4): found(), ownKeys(), Rework (class 4), 10. Review (AGENTS.md stage 4, bounded)

### Community 335 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 62 - ".put"
Cohesion: 0.04
Nodes (57): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+49 more)

### Community 67 - "code"
Cohesion: 0.04
Nodes (58): code(), Added, 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit (+50 more)

### Community 69 - "version"
Cohesion: 0.04
Nodes (55): side(), migrations(), deferred(), version(), 1. Overview, Appendix A. Reference, 0. Project setup, 1. TemporalKV (+47 more)

### Community 76 - ".off"
Cohesion: 0.04
Nodes (49): Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25) (+41 more)

### Community 91 - "T"
Cohesion: 0.05
Nodes (41): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+33 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+31 more)

### Community 105 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning, Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune (+27 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 129 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 132 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (28): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+20 more)

### Community 133 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 139 - "README.md"
Cohesion: 0.09
Nodes (14): Build commands, Build the package and install it, Building from source, Run from a clone, Choosing a database, At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each (+6 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 150 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 153 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 157 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+15 more)

### Community 162 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 163 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 164 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 174 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (19): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+11 more)

### Community 175 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 180 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 181 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 183 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 186 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 189 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 194 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+6 more)

### Community 201 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 202 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 203 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 208 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 214 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 216 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 217 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 219 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 220 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 222 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 224 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 226 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 227 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 228 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 229 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-4 Every field is data, operational or secret, Scenario: A function in the configuration, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: A user module from the configuration file, Scenario: Two `core` revisions with different databases (+1 more)

### Community 230 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 231 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 232 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 233 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 235 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 236 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 237 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 238 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 239 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 240 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 242 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 243 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 245 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 246 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 247 - "MODIFIED Requirements"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy, Spec delta — `admin-endpoints` capability

### Community 248 - "Requirement: BK-1 Backup"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 249 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 250 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 252 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 253 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 254 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 255 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 256 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 257 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 258 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 259 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 260 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 262 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 266 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 267 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 268 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 269 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 270 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 271 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 272 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 273 - "Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`), What changes, Why

### Community 274 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 275 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 276 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 277 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 278 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 279 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 280 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 281 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 284 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 285 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 286 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 287 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 288 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 289 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 290 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 291 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 292 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 293 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 294 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 295 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 296 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 297 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 298 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 299 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 300 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 301 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 302 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 303 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 304 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 305 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 306 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 307 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 308 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 309 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 310 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 311 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 312 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 313 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 314 - "00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why"
Cohesion: 0.40
Nodes (4): 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why, Evidence, Problem, Suggested fix

### Community 315 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 316 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 317 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 318 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 319 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 320 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 321 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 322 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 325 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 327 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 328 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 329 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 330 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 331 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 332 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 333 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 334 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 338 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `RFC-3339` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4362 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `startUmbraDB`, `column-rules.ts`, `UmbraError`, `src/db/postgres.ts`, `core-config.test.ts`, `declaration.ts`, `InMemoryBlockSource`, `admin-harness.ts`, `api-server.test.ts`, `ref_node_fs`, `backup/restore.ts`, `binding.test.ts`, `loop.test.ts`, `sweep-fixture.ts`, `ref_node_url`, `db/errors.ts`, `client.test.ts`, `database-parts.ts`, `ReadHandle`, `adapter-fixtures.ts`, `cbor.ts`, `channel-queue.test.ts`, `hex`, `process-backends.ts`, `host.ts`, `DatabaseParts`, `node-set.test.ts`, `contract-data-checks.ts`, `transport.test.ts`, `change-capture.ts`, `NodeClient`, `tape/index.ts`, `core-transport.ts`, `runner/process.ts`, `contract-modules.test.ts`, `range.ts`, `LedgerPackage`, `writer-lock-checks.ts`, `adapter.ts`, `pause-fixtures.ts`, `builder.test.ts`, `NodeBlockSource`, `backup/backup.ts`, `history.test.ts`, `fetch-fixtures.ts`, `ledger-graph-tapes.ts`, `browser.test.ts`, `builds.ts`, `messages.ts`, `ledger-storage.test.ts`, `core-ledger-state.ts`, `.from`, `ledger/types.ts`, `validate.ts`, `connectWebSocket`, `validateConfig`, `transforms.test.ts`, `refcount-model.ts`, `resolve.ts`, `boundary.test.ts`, `core-block-commit.test.ts`, `slow-block-harness.ts`, `refcount-restart.ts`, `ledger-units.test.ts`, `core-settings.ts`, `interfaces/transaction-history-storage.ts`, `loop-stop-harness.ts`, `chain-events-decode.test.ts`, `cold-boot-recovery.integration.test.ts`, `version-checks.ts`, `retirement.test.ts`, `refcount-step.test.ts`, `core-chain.test.ts`, `refcount-histories.ts`, `real-tapes.ts`, `networks.ts`, `chain-data.test.ts`, `order.property.test.ts`, `test/postgres/setup.ts`, `restore-ledger.ts`, `file-mode.test.ts`, `browser/build.ts`, `shims.test.ts`, `redact.ts`, `paused-harness.ts`, `node-source-status.test.ts`, `release-version.ts`, `entries.ts`, `checks.test.ts`, `sweep-tapes.ts`, `chain-placement.test.ts`, `resolver-boundary.ts`, `code-registry.ts`, `pg-tx-history-adapter.ts`, `config/plain-data.ts`, `package.json`, `documents.ts`, `read-gate.ts`, `ws-mutual-tls.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `validation.test.ts`, `node-bridge.ts`, `surface.test.ts`, `ProcessAdmin`, `configuration-refusal.test.ts`, `block-fetch-decode.test.ts`, `backbone/part-migrations.test.ts`, `harness.ts`, `pglite-timeouts.test.ts`, `library-documents.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `ingest-faults.test.ts`, `sweep-fixture.test.ts`, `excluded-not-exported.test.ts`, `ledger-table-config.test.ts`, `LoopPauses`, `statementsOf`, `mutation-per-adapter.mjs`, `mapping.test.ts`, `worker-threads.test.ts`, `history.property.test.ts`, `api-session.test.ts`, `host-signal.ts`?**
  _High betweenness centrality (0.218) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `startUmbraDB` be split into smaller, more focused modules?**
  _Cohesion score 0.017987913259864912 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `startUmbraDB`, `column-rules.ts`, `config/plain-data.ts`, `src/db/postgres.ts`, `core-config.test.ts`, `declaration.ts`, `InMemoryBlockSource`, `admin-harness.ts`, `mapping.ts`, `api-server.test.ts`, `backup/restore.ts`, `ref_node_fs`, `loop.test.ts`, `sweep-fixture.ts`, `binding.test.ts`, `db/errors.ts`, `client.test.ts`, `database-parts.ts`, `ReadHandle`, `validation.test.ts`, `cbor.ts`, `channel-queue.test.ts`, `process-backends.ts`, `host.ts`, `DatabaseParts`, `node-set.test.ts`, `configuration-refusal.test.ts`, `options.ts`, `contract-data-checks.ts`, `NodeClient`, `transport.test.ts`, `core-transport.ts`, `runner/process.ts`, `contract-modules.test.ts`, `backbone/part-migrations.test.ts`, `range.ts`, `writer-lock-checks.ts`, `tape/index.ts`, `version-table.ts`, `node-source.ts`, `pause-fixtures.ts`, `NodeBlockSource`, `backup/backup.ts`, `ingest-faults.test.ts`, `fetch-fixtures.ts`, `history.test.ts`, `messages.ts`, `ledger-table-config.test.ts`, `core-ledger-state.ts`, `vitest`, `validate.ts`, `validateConfig`, `transforms.test.ts`, `statementsOf`, `resolve.ts`, `core-block-commit.test.ts`, `slow-block-harness.ts`, `mapping.test.ts`, `ledger-units.test.ts`, `core-settings.ts`, `Process`, `browser/src/config/load.ts`, `config/history.ts`, `version-checks.ts`, `8. Admin endpoints`, `refcount-step.test.ts`, `graph.ts`, `core-chain.test.ts`, `validation.ts`, `FinalizedLoop`, `shims.test.ts`, `entries.ts`, `checks.test.ts`, `.cwd`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `column-rules.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01788178310945904 - nodes in this community are weakly interconnected._