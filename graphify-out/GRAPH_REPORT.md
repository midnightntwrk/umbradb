# Graph Report - UmbraDB

## Corpus Check
- 1299 files · ~1,830,507 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .patch 18, (none) 16, .lean 11)

## Summary
- 13348 nodes · 41622 edges · 386 communities (351 shown, 35 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3467 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `1b542b219666129f` (1299 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- column-rules.ts
- migrate.ts
- runner/process.ts
- vitest
- .close
- node-bridge.ts
- browser.test.ts
- example-checks.ts
- cold-boot-recovery.integration.test.ts
- real-tapes.ts
- admin-harness.ts
- src/ledger/identity.ts
- Worker
- TransactionHistoryEntry
- release-version.ts
- declaration.ts
- browser/build.ts
- chain-process.test.ts
- ledger-storage.test.ts
- process-worker.ts
- src/index.ts
- postgres/transaction-history-storage.ts
- LoopPauses
- crash.test.ts
- stop-heights.test.ts
- ref_node_url
- transforms.ts
- documents.ts
- checks.test.ts
- code-registry.ts
- node-fields-harness.ts
- read-gate.ts
- test/postgres/setup.ts
- threat-model.test.ts
- core-ledger-state.ts
- accepted-hash-checks.ts
- interfaces/transaction-history-storage.ts
- pg-tx-history-adapter.ts
- Buffer
- listening.test.ts
- sigterm.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- config/history.ts
- config/plain-data.ts
- surface.test.ts
- fixtures/configuration.ts
- .concat
- pack-install.mjs
- cbor.ts
- PgliteDatabase
- start-umbradb.test.ts
- block-fetch-decode.test.ts
- core-block-fetch/metadata.ts
- GraphWorld
- worker-restart.test.ts
- harness.ts
- .value
- resolve.ts
- core-chain-events/events.ts
- library-documents.test.ts
- demo-handlers.test.ts
- chrome.ts
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- builder.ts
- validate.ts
- browser-harness.ts
- messagePortChannel
- ws-mutual-tls.test.ts
- module-api.ts
- placement.ts
- statementsOf
- checkShape
- FakeNode
- validation.test.ts
- .from
- messages.ts
- socket.ts
- extrinsics.ts
- quiet-host.child.ts
- core.ts
- browser/serve.ts
- web-lock.ts
- .name
- core-private-source.test.ts
- RawClient
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- host.ts
- text.test.ts
- stats-module.ts
- Design — Sprint 1: project setup + TemporalKV
- .send
- channel-queue.test.ts
- ledger/plain-data.ts
- sha256
- process-admin.ts
- UmbraError
- HeldHeight
- signal-backup.worker.ts
- core-config.test.ts
- ref_node_fs
- FinalizedLoop
- mutation-evidence.d.mts
- TransportProxy
- AsyncLocalStorage
- loop.test.ts
- db/errors.ts
- adapter.ts
- finalized-height.ts
- loop.ts
- BlockRef
- startUmbraDB
- writer-lock-checks.ts
- LedgerPackage
- PageApiChannel
- NodeFS
- refcount-restart.ts
- mounted-admin.test.ts
- db/backends.ts
- tape/index.ts
- ref_node_crypto
- ref_node_timers
- contract-modules.test.ts
- cli/command.ts
- process-backends.ts
- networks.ts
- transport-faults.test.ts
- InMemoryBlockSource
- process-build.ts
- ModuleDeclaration
- builds.ts
- refcount-tapes.ts
- contract-data-checks.ts
- core-block-parsed.ts
- version-checks.ts
- builder.test.ts
- library/modules.test.ts
- module-api.test.ts
- private/lockstep-wait.test.ts
- TapeRecord
- client.ts
- ref_node_events
- database-parts.ts
- slow-block-harness.ts
- PgTransactionHistoryStorage
- redact.ts
- src/config/load.ts
- Database
- node-set.test.ts
- restore-ledger.ts
- restore-private.ts
- mapping.ts
- loggingModule
- loop-stop-harness.ts
- ChannelEndpoint
- post-block-update-checks.ts
- range.ts
- transforms.test.ts
- NodeClient
- boundary.test.ts
- resolver-boundary.ts
- graph.ts
- node.test.ts
- halts.test.ts
- retirement.test.ts
- config-hash-checks.ts
- digests.test.ts
- ledger/types.ts
- paused-harness.ts
- zero-timeouts-checks.ts
- api-server.test.ts
- page.ts
- RuntimeMetadata
- options.ts
- validation.ts
- .configHash
- refused
- data
- graph.py
- ADDED Requirements
- .off
- UmbraDB module guide
- local-preprod-sync.mjs
- chain-placement.test.ts
- .disconnect
- mutation-per-adapter.mjs
- twox.ts
- Boundaries, threats and controls
- facade-merge-loader.ts
- midnight-env — reproducible PREPROD dev environment
- Requirement: BK-1 Backup
- path.ts
- schemaName
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- The laws of UmbraDB's storage helpers
- .boolean
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- fresh-instance.mjs
- crash-worker.ts
- .put
- history
- code
- version
- transportReader
- .slowBlockMs
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
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- ADDED Requirements
- devDependencies
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Requirement: BK-1 Backup
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- README.md
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
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
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- Repository agent policy
- scoped-review-manifest
- UmbraDB 0.10.0 threat model
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- After 0.10.0
- Contributing
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Design — CORE-ARCH: the standalone indexer's core architecture
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
- Requirement: LG-4 Block content is decoded with the runtime that built it
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
- 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- Midnight Foundation Security Policy
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00083 — Four timing-bound tests fail when the machine runs several test lanes at once
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Test wallets
- Spec — capability `formal-completion`
- Acceptance — V9-UPGRADE-METADATA: decode a block with the runtime that built it, across node 2.1's runtime upgrades
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
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (386 total, 35 thin omitted)

### Community 0 - "column-rules.ts"
Cohesion: 0.02
Nodes (182): CheckedMigration, SchemaTable, ContentFunction, ContentOptions, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions (+174 more)

### Community 1 - "migrate.ts"
Cohesion: 0.02
Nodes (185): TableDigest, TableDigestRow, SchemaWriteHandle, Transaction, CapturedTable, CaptureState, AppliedRow, MigrationPart (+177 more)

### Community 10 - "runner/process.ts"
Cohesion: 0.03
Nodes (79): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, LedgerWorkerOptions, LifecycleStatus (+71 more)

### Community 100 - "vitest"
Cohesion: 0.07
Nodes (21): Lockfile, Manifest, RepositoryFile, Upstream, sweepTapeCase(), canPin(), pinViolations(), repositoryFiles() (+13 more)

### Community 101 - ".close"
Cohesion: 0.10
Nodes (13): HeadSubscriber, Pending, Waiter, connectionFailure, NodeMethod, backoffDelay(), isRecord(), isRetryable() (+5 more)

### Community 102 - "node-bridge.ts"
Cohesion: 0.09
Nodes (22): ChildReader, ChildVisitor, Thread, BridgeServer, bridgeStore, Growable, readChildList(), readChildren() (+14 more)

### Community 103 - "browser.test.ts"
Cohesion: 0.07
Nodes (37): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, heldClock, continuedProblems() (+29 more)

### Community 104 - "example-checks.ts"
Cohesion: 0.10
Nodes (25): Served, BlockImport, ChildResult, CodeBlock, installedProject, isolationProblems(), serveCommand(), allowedSource() (+17 more)

### Community 105 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (25): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+17 more)

### Community 107 - "real-tapes.ts"
Cohesion: 0.08
Nodes (32): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+24 more)

### Community 11 - "admin-harness.ts"
Cohesion: 0.03
Nodes (126): FromAdmin, ToAdmin, AdminServer, EngineConfig, WorkerWithStreams, AdminRun, Answerer, Expected (+118 more)

### Community 110 - "src/ledger/identity.ts"
Cohesion: 0.11
Nodes (28): ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, V9Logs, checkLedgerPackage(), checkLedgerPackages() (+20 more)

### Community 111 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 112 - "TransactionHistoryEntry"
Cohesion: 0.09
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 115 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 117 - "declaration.ts"
Cohesion: 0.08
Nodes (19): ItemDeclaration, ItemSink, KnownPointsOnly, TableDeclaration, BlockItems, LateUse, Accepts, Rest (+11 more)

### Community 118 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 119 - "chain-process.test.ts"
Cohesion: 0.10
Nodes (27): Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Flaky (+19 more)

### Community 12 - "ledger-storage.test.ts"
Cohesion: 0.03
Nodes (128): BlockParsed, SentParses, itemsSeen, Json, ingest, Call, SeenLoad, retentionSeen (+120 more)

### Community 123 - "process-worker.ts"
Cohesion: 0.12
Nodes (22): Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, withDevelopmentOptIn(), answer(), backUp() (+14 more)

### Community 124 - "src/index.ts"
Cohesion: 0.17
Nodes (24): MessagePortLike, PrivateLinkChannel, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork (+16 more)

### Community 125 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+11 more)

### Community 127 - "LoopPauses"
Cohesion: 0.08
Nodes (17): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 128 - "crash.test.ts"
Cohesion: 0.10
Nodes (24): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+16 more)

### Community 129 - "stop-heights.test.ts"
Cohesion: 0.10
Nodes (24): ProcessingEnd, ProcessStatus, A43Observation, Halt, Fault, Recorded, RecoveryObservation, StatusRead (+16 more)

### Community 13 - "ref_node_url"
Cohesion: 0.02
Nodes (112): EmitWarning, Child, ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted (+104 more)

### Community 130 - "transforms.ts"
Cohesion: 0.20
Nodes (28): TransformError, CallRecord, recordKind, SubscriptionId, CallSelection, NotificationRange, checkTape(), liveSubscriptions() (+20 more)

### Community 132 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 133 - "checks.test.ts"
Cohesion: 0.10
Nodes (21): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+13 more)

### Community 134 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 136 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (23): A168Observation, A168Phase, Expected, GatedConnector, StatusReader, a(), a168Run(), atLeast() (+15 more)

### Community 137 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 138 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 139 - "threat-model.test.ts"
Cohesion: 0.15
Nodes (26): Citation, citationProblems(), citations(), commitPolicyProblems(), headingProblems(), headings(), knownGapProblems(), lineCountOf() (+18 more)

### Community 14 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (119): ComputedBlock, LedgerStateItem, retainedStates, KeyCounts, RefcountCheck, RefcountStatement, refcountStep, RefcountTables (+111 more)

### Community 140 - "accepted-hash-checks.ts"
Cohesion: 0.13
Nodes (26): a165Run, Attempt, privateCursorHeight(), readDatabaseState(), a165Problems(), contentsOf(), cursorOf(), headerHash() (+18 more)

### Community 141 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 142 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 143 - "Buffer"
Cohesion: 0.10
Nodes (21): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+13 more)

### Community 145 - "listening.test.ts"
Cohesion: 0.09
Nodes (13): TestDatabase, TestCertificates, runProcess(), commandRun(), configWhen(), libraryCore(), privateData(), readerOf() (+5 more)

### Community 146 - "sigterm.test.ts"
Cohesion: 0.12
Nodes (22): WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent, report(), pairs() (+14 more)

### Community 147 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 148 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 15 - "config/history.ts"
Cohesion: 0.03
Nodes (121): OpenedFacts, versionEntry, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions, HistoryRow (+113 more)

### Community 151 - "config/plain-data.ts"
Cohesion: 0.11
Nodes (22): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, copyArray(), copyObject(), instanceOf() (+14 more)

### Community 152 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 153 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (19): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+11 more)

### Community 158 - ".concat"
Cohesion: 0.12
Nodes (12): PostgresParts, Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds() (+4 more)

### Community 159 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 16 - "cbor.ts"
Cohesion: 0.03
Nodes (125): CaptureColumn, CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode (+117 more)

### Community 160 - "PgliteDatabase"
Cohesion: 0.20
Nodes (5): JobQueue, PgliteDatabase, handleClosed(), failedEarlier(), openOn()

### Community 161 - "start-umbradb.test.ts"
Cohesion: 0.14
Nodes (16): ModuleListRule, GoneCwdResult, moduleListProblems(), closedByItself(), hostile(), optionProblems(), throwing(), problemsOf() (+8 more)

### Community 162 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 163 - "core-block-fetch/metadata.ts"
Cohesion: 0.27
Nodes (14): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 164 - "GraphWorld"
Cohesion: 0.23
Nodes (4): Dice, GraphWorld, driveHistory(), utf8()

### Community 165 - "worker-restart.test.ts"
Cohesion: 0.11
Nodes (19): SlowStep, TestLoaderData, beat(), countDeserializations(), hexOf(), loadLedger(), probe(), applyBlock() (+11 more)

### Community 166 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 168 - ".value"
Cohesion: 0.26
Nodes (7): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 17 - "resolve.ts"
Cohesion: 0.03
Nodes (117): coreEntry, plainData, ConfigInput, ConfigRule, EntryRef, AddressRequest, Asked, LinkPlan (+109 more)

### Community 170 - "core-chain-events/events.ts"
Cohesion: 0.13
Nodes (17): MetadataField, MetadataType, MetadataVariant, Primitive, RecordTypes, ScaleValue, namedField(), canonicalJson() (+9 more)

### Community 171 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 172 - "demo-handlers.test.ts"
Cohesion: 0.16
Nodes (16): Compared, ConnectSeen, PortPeer, comparedOfExchange(), comparedOfResponse(), connected(), fetchProblems(), fetchRuleProblems() (+8 more)

### Community 174 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 175 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 176 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 177 - "builder.ts"
Cohesion: 0.16
Nodes (7): Link, TapeBuilder, RecordingError, frameText(), whenClosed(), joinSessions(), NODE_URL_REFUSED

### Community 18 - "validate.ts"
Cohesion: 0.03
Nodes (125): CoreVersion, LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, CoreEntryInput (+117 more)

### Community 181 - "browser-harness.ts"
Cohesion: 0.25
Nodes (17): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+9 more)

### Community 182 - "messagePortChannel"
Cohesion: 0.13
Nodes (15): demoLink, messagePortChannel(), ownKeys(), Rework (class 4), 4. Channels, 0. Baseline, 10. Review (AGENTS.md stage 4, bounded), 11. Close-out (+7 more)

### Community 187 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 19 - "module-api.ts"
Cohesion: 0.04
Nodes (96): coreHeaders, HeadersArgument, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler (+88 more)

### Community 191 - "placement.ts"
Cohesion: 0.19
Nodes (15): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, ChainTransaction, EventPhase, callVariant(), carried() (+7 more)

### Community 193 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 194 - "checkShape"
Cohesion: 0.35
Nodes (9): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+1 more)

### Community 199 - "validation.test.ts"
Cohesion: 0.17
Nodes (14): Case, ShapeCase, Stats, validateWith(), declared(), contentDeclared(), failures(), firstItem() (+6 more)

### Community 2 - ".from"
Cohesion: 0.02
Nodes (201): CoreLedgerStateOptions, RefcountFault, NodeBatch, contentsHash, FixtureRun, FixtureRunOptions, Reader, Seen (+193 more)

### Community 20 - "messages.ts"
Cohesion: 0.03
Nodes (87): PrivateLinkAddress, PrivateLinkConnect, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransportOptions (+79 more)

### Community 200 - "socket.ts"
Cohesion: 0.20
Nodes (7): Connection, NodeSocket, NodeSocketEvents, HandSocket, connectWebSocket(), "on-compute"(), DEFAULT_HEARTBEAT_MS

### Community 203 - "extrinsics.ts"
Cohesion: 0.18
Nodes (13): ExtrinsicCall, MetadataPallet, RuntimeMetadataView, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), decodeExtrinsics() (+5 more)

### Community 204 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 205 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 206 - "browser/serve.ts"
Cohesion: 0.21
Nodes (10): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), CONTENT_TYPES (+2 more)

### Community 207 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 208 - ".name"
Cohesion: 0.22
Nodes (6): Fetching, Recorder, 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix

### Community 21 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (70): PrivateBlockSource, PrivateChecks, privateIntake, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision (+62 more)

### Community 214 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 215 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 22 - "host.ts"
Cohesion: 0.03
Nodes (93): LoadLedger, TransactionParser, LedgerName, ChainOutcome, LedgerPackageOptions, LedgerTask, AppliedState, ApplyBlock (+85 more)

### Community 221 - "text.test.ts"
Cohesion: 0.23
Nodes (6): BackupText, blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir

### Community 225 - "stats-module.ts"
Cohesion: 0.32
Nodes (10): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+2 more)

### Community 227 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 23 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (82): PublicSide, EndpointOptions, Envelope, PrivateCarrier, PrivateTransport, Waiter, controlledTimers, PeerEnd (+74 more)

### Community 236 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 237 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 24 - "process-admin.ts"
Cohesion: 0.04
Nodes (94): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+86 more)

### Community 25 - "UmbraError"
Cohesion: 0.04
Nodes (102): PublicIdentity, BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, DumpInput (+94 more)

### Community 258 - "HeldHeight"
Cohesion: 0.28
Nodes (5): CommitOutcome, HeldHeight, Outcomes, AlwaysLost, DropsHeld

### Community 259 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 26 - "core-config.test.ts"
Cohesion: 0.04
Nodes (80): MountedAdminAnswer, AdminSeams, adminRoutes, AdminChannel, AdminServeOptions, AdminStartOptions, AdminAnswer, AdminEndpoint (+72 more)

### Community 27 - "ref_node_fs"
Cohesion: 0.06
Nodes (66): BackupBackend, BackupDatabase, killedRestore, TickerHandle, WORKER, SignalEvent, cliProject, Pem (+58 more)

### Community 28 - "FinalizedLoop"
Cohesion: 0.04
Nodes (29): ResolvedRange, EntryBoundary, PointSchedule, Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor (+21 more)

### Community 282 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 29 - "loop.test.ts"
Cohesion: 0.05
Nodes (79): LockstepWait, LoopEnd, SlowBlockEvent, SlowWindow, Contexts, Faults, LostCommit, Seen (+71 more)

### Community 3 - "db/errors.ts"
Cohesion: 0.02
Nodes (139): BenchEnv, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, ReadDatabaseOptions, ConfiguredDatabase (+131 more)

### Community 30 - "adapter.ts"
Cohesion: 0.03
Nodes (75): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+67 more)

### Community 303 - "finalized-height.ts"
Cohesion: 0.47
Nodes (5): FinalizedHeightOptions, finalizedHeight(), invalidOption(), timedOut(), FINALIZED_HEIGHT_TIMEOUT_MS

### Community 31 - "loop.ts"
Cohesion: 0.04
Nodes (88): BlockHeader, PointName, HeightRange, Callback, CallbackFailure, ParallelPoint, PointArguments, PointRun (+80 more)

### Community 32 - "BlockRef"
Cohesion: 0.05
Nodes (34): BlockEventSource, BlockLedgerSource, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, QueuedBlock, LedgerBinding (+26 more)

### Community 33 - "startUmbraDB"
Cohesion: 0.03
Nodes (83): Job, Run, backupAtStop(), ledgerWorkerEntry(), startUmbraDB(), log(), database, gone (+75 more)

### Community 34 - "writer-lock-checks.ts"
Cohesion: 0.05
Nodes (71): CreatedDirectory, Held, PgliteLockUse, WarningArguments, WarningHook, WriterProcess, Job, WorkerEvent (+63 more)

### Community 35 - "LedgerPackage"
Cohesion: 0.04
Nodes (46): RetainedState, LedgerPackage, EvictionRefused, LedgerEngine, LedgerTaskFailed, Driver, hexOf(), idOf() (+38 more)

### Community 36 - "refcount-restart.ts"
Cohesion: 0.05
Nodes (61): LedgerHost, NodeDatabase, NodeReader, BatchJson, ContentsHash, databaseNow, Hold, Light (+53 more)

### Community 37 - "mounted-admin.test.ts"
Cohesion: 0.05
Nodes (68): Answered, gate, Observation, SecretHashes, SecretVariant, Expected, FactsRunOptions, SubscriptionSeen (+60 more)

### Community 38 - "db/backends.ts"
Cohesion: 0.04
Nodes (54): Settings, TestBackend, Case, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase (+46 more)

### Community 39 - "tape/index.ts"
Cohesion: 0.06
Nodes (48): TapeBuilderOptions, readRequest, RequestId, Json, NotJsonError, Connection, TapeCall, TapeNodeOptions (+40 more)

### Community 4 - "ref_node_crypto"
Cohesion: 0.03
Nodes (140): nodeKeys, Node, BlockKind, BlockScript, BoundaryRewrite, DrivenBlock, GeneratedBlock, GeneratedState (+132 more)

### Community 40 - "ref_node_timers"
Cohesion: 0.05
Nodes (61): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, PausesInsideTheHeight (+53 more)

### Community 41 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (66): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+58 more)

### Community 42 - "cli/command.ts"
Cohesion: 0.04
Nodes (59): RestoreSeams, CommandHandler, CommandIo, MainProcess, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome (+51 more)

### Community 44 - "process-backends.ts"
Cohesion: 0.06
Nodes (49): SourceClass, Fault, tapeDeterminism, taskSeen, ChangedFile, GenesisFixture, installationCopy, PackageStartup (+41 more)

### Community 45 - "networks.ts"
Cohesion: 0.04
Nodes (62): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+54 more)

### Community 46 - "transport-faults.test.ts"
Cohesion: 0.05
Nodes (54): CoreTransport, Message, Ended, rawClient, Escape, Refused, mutualTlsOptions(), splitAddress() (+46 more)

### Community 47 - "InMemoryBlockSource"
Cohesion: 0.04
Nodes (42): CoreBlockItems, ChainCheck, ChainCheckInput, BlockSource, FinalityStallCondition, InMemoryBlockSource, InMemoryItems, Wait (+34 more)

### Community 48 - "process-build.ts"
Cohesion: 0.06
Nodes (53): EngineBuild, EngineNetwork, ProcessObservation, StartVia, CoreSeen, testBuild, TestProcessInput, A149Startup (+45 more)

### Community 49 - "ModuleDeclaration"
Cohesion: 0.05
Nodes (40): ModuleDeclaration, ProcessContext, Revision, EntryRange, ResolvedGraph, MisuseListener, MisuseReports, ProcessContexts (+32 more)

### Community 5 - "builds.ts"
Cohesion: 0.03
Nodes (131): AdminStarter, DatabaseParts, PglitePathParts, AdminRunOptions, A168RunOptions, A176Options, TickerConfig, PausableConfig (+123 more)

### Community 50 - "refcount-tapes.ts"
Cohesion: 0.05
Nodes (53): workerRecord, StoredCheck, ContractRow, conversionRun, Released, Reader, RefcountTape, Sampler (+45 more)

### Community 51 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (59): CoreContractStatesOptions, ContractStateRow, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+51 more)

### Community 53 - "core-block-parsed.ts"
Cohesion: 0.06
Nodes (56): BlockParsedOptions, ChainEvent, Field, Registry, blockBodyOf(), blockParsedOf(), coreBlockParsedOnParse(), hexOf() (+48 more)

### Community 54 - "version-checks.ts"
Cohesion: 0.08
Nodes (47): MetadataBlock, MetadataNode, RuntimeMetadataEntry, LedgerTable, OwnStateMetadata, Boundary, CallRecord, CountingNode (+39 more)

### Community 55 - "builder.test.ts"
Cohesion: 0.05
Nodes (41): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Script, ScriptedNode (+33 more)

### Community 57 - "library/modules.test.ts"
Cohesion: 0.06
Nodes (40): CloseHelper, NetworkRuleName, Hold, Signal, FaultedClose, QuietResult, OwnWords, Shown (+32 more)

### Community 58 - "module-api.test.ts"
Cohesion: 0.06
Nodes (54): GraphInput, PastFaultCase, RefusalCase, resolveGraph(), reader(), backboneWithout(), blockItem(), consumer() (+46 more)

### Community 59 - "private/lockstep-wait.test.ts"
Cohesion: 0.06
Nodes (44): InstanceView, PrivateInstance, Entry, Lockstep, LockstepCondition, LockstepInstance, LockstepOptions, LockstepRefusal (+36 more)

### Community 6 - "TapeRecord"
Cohesion: 0.03
Nodes (158): NodeCallOptions, ProcessCondition, BlockSpec, EventSpec, Scenario, transactionSpec, RecordingClient, eventsRuntime (+150 more)

### Community 60 - "client.ts"
Cohesion: 0.09
Nodes (47): State, Subscription, NodeBlock, NodeRuntimeVersion, NodeCallMethod, SubscribeMethod, SocketFailure, finalizedHeight() (+39 more)

### Community 62 - "ref_node_events"
Cohesion: 0.06
Nodes (45): ConfigCheckReport, IgnoredJob, Renamed, RunningCommand, statsConfig, runArguments(), runProcessCommand(), runFailed() (+37 more)

### Community 63 - "database-parts.ts"
Cohesion: 0.05
Nodes (45): CheckFinding, CheckStep, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, PostgresPartsInput (+37 more)

### Community 64 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (51): BlockItemSource, LoopInput, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead (+43 more)

### Community 65 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (51): TransactionHistoryStorage, PgTransactionHistoryStorage, Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import (+43 more)

### Community 66 - "redact.ts"
Cohesion: 0.06
Nodes (47): ConfigFinding, RedactionForms, SecretForm, TextPattern, Needs, findings(), configurationRefused(), databaseText() (+39 more)

### Community 68 - "src/config/load.ts"
Cohesion: 0.05
Nodes (38): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, ImportedConfig, LoadOptions, BackupSignals (+30 more)

### Community 7 - "Database"
Cohesion: 0.02
Nodes (112): BlockRow, ConfigRow, BlockWriteHandle, Database, ReadHandle, cursorTable, CursorTableOptions, CursorValue (+104 more)

### Community 70 - "node-set.test.ts"
Cohesion: 0.05
Nodes (47): NodeSetFault, NodeSetOptions, NodeTableCheck, ContentDefinition, ContentDefinedBuildOptions, StoredRow, Tables, first() (+39 more)

### Community 71 - "restore-ledger.ts"
Cohesion: 0.07
Nodes (48): RestoreInput, CrashEvent, CrashJob, watched, RestartEvent, RestartJob, recordedGenesis, FileRow (+40 more)

### Community 72 - "restore-private.ts"
Cohesion: 0.07
Nodes (45): ManifestHistoryRow, ManifestMigration, ManifestTool, FoldedPart, RecordedMigration, FileProcess, privateBackup, PrivateConfig (+37 more)

### Community 73 - "mapping.ts"
Cohesion: 0.06
Nodes (34): BoundedRead, ResultColumn, ResultType, queryTimeout(), arrayLiteral(), hexOf(), invalidParameter(), isInfinity() (+26 more)

### Community 74 - "loggingModule"
Cohesion: 0.07
Nodes (44): ChainDataView, A47Observation, CommitsTheBoundary, Controls, Version, answerChainData(), chainDataHeaders(), hex() (+36 more)

### Community 75 - "loop-stop-harness.ts"
Cohesion: 0.09
Nodes (39): A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore (+31 more)

### Community 76 - "ChannelEndpoint"
Cohesion: 0.08
Nodes (18): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), exceedsUtf8(), refuseChannel(), discard(), isChannel() (+10 more)

### Community 77 - "post-block-update-checks.ts"
Cohesion: 0.08
Nodes (42): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+34 more)

### Community 78 - "range.ts"
Cohesion: 0.06
Nodes (45): Arguments, Command, TapeCommandIo, CompletenessRange, Final, Height, RangeRecording, RangeStats (+37 more)

### Community 79 - "transforms.test.ts"
Cohesion: 0.06
Nodes (32): Failure, Variant, TapeError, DisconnectRecord, FaultRecord, expectGoldenRoundTrip(), baseRecords(), expectedText() (+24 more)

### Community 8 - "NodeClient"
Cohesion: 0.03
Nodes (99): NodeClient, NodeClientOptions, NodeRetry, ConnectSocket, NodeTimers, IngestOptions, Opened, HandSockets (+91 more)

### Community 80 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+34 more)

### Community 81 - "resolver-boundary.ts"
Cohesion: 0.07
Nodes (41): TypeCheckFinding, TypeCheckResult, Finding, Access, AllowedRead, Boundary, Crossing, Guard (+33 more)

### Community 82 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+40 more)

### Community 83 - "node.test.ts"
Cohesion: 0.06
Nodes (25): Metadata, Step, Frame, Failure, Variant, RecordingProblem, TapeProblem, TransformProblem (+17 more)

### Community 84 - "halts.test.ts"
Cohesion: 0.06
Nodes (43): A43Case, CursorElsewhere, Outcome, AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock(), hex() (+35 more)

### Community 86 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 87 - "config-hash-checks.ts"
Cohesion: 0.06
Nodes (24): Report, EngineInput, ChannelCoreOptions, ChannelPrivateOptions, A162Options, a162Run, HeaderSeen, HeldLink (+16 more)

### Community 88 - "digests.test.ts"
Cohesion: 0.07
Nodes (35): SchemaPlan, Chain, ChainOptions, DigestRow, moduleM(), restart(), blockAt(), checkpointRows() (+27 more)

### Community 9 - "ledger/types.ts"
Cohesion: 0.03
Nodes (126): ApplyInput, ApplyOutput, LedgerEvent, LedgerTaskBlock, LogItem, ParsedTransaction, StateHandle, StateSummary (+118 more)

### Community 90 - "paused-harness.ts"
Cohesion: 0.09
Nodes (36): Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, commandBuild(), keeperModule() (+28 more)

### Community 91 - "zero-timeouts-checks.ts"
Cohesion: 0.09
Nodes (33): Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead(), engine() (+25 more)

### Community 92 - "api-server.test.ts"
Cohesion: 0.07
Nodes (31): ApiRegistry, HttpHandler, HttpRoute, AcceptsDuplicates, AddsExtensions, AddsHeaders, AppendsVersion, Client (+23 more)

### Community 93 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 94 - "RuntimeMetadata"
Cohesion: 0.05
Nodes (31): RuntimeMetadata, positive(), hexOf(), walkOver(), 00089 — The first block of the v9 runtime halts with `metadata-mismatch` on every network, Evidence, Suggested fix, The problem (+23 more)

### Community 96 - "options.ts"
Cohesion: 0.10
Nodes (40): readOptions, addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding(), guarded(), isAbortSignal() (+32 more)

### Community 97 - "validation.ts"
Cohesion: 0.06
Nodes (35): DeclarationRule, PlacedDeclaration, Plain, Validator, withNetwork(), first(), shownDatabase(), schemaFile() (+27 more)

### Community 218 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 52 - "refused"
Cohesion: 0.04
Nodes (64): refused(), cursorRead(), following(), reason(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix (+56 more)

### Community 61 - "data"
Cohesion: 0.04
Nodes (62): n(), data(), 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants, 2.4 Migrations: one per part (O-2), 2.5 Content-based determinism (O-8; DT-3, DT-4), 2. Storage (+54 more)

### Community 109 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+25 more)

### Community 122 - ".off"
Cohesion: 0.06
Nodes (30): Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, 6. `sweep: off` (O-1), 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract (+22 more)

### Community 156 - "UmbraDB module guide"
Cohesion: 0.08
Nodes (25): params(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations, 16. Upgrades (+17 more)

### Community 185 - "local-preprod-sync.mjs"
Cohesion: 0.21
Nodes (17): commitOf(), configText(), docker(), dockerHas(), dockerLater(), imageDigests(), main(), nodeRpc() (+9 more)

### Community 192 - "chain-placement.test.ts"
Cohesion: 0.14
Nodes (14): chainHashOf(), writeTransactionRows(), inThreadParser(), insertTransactionRows(), outcomeOf(), txResultsOf(), counting(), fill() (+6 more)

### Community 197 - ".disconnect"
Cohesion: 0.15
Nodes (14): fault(), Suggested fix, 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants (+6 more)

### Community 202 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 213 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 224 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 226 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 252 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 254 - "Requirement: BK-1 Backup"
Cohesion: 0.22
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 260 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 263 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 266 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.29
Nodes (6): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers

### Community 267 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 272 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 304 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 344 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 357 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 43 - ".put"
Cohesion: 0.03
Nodes (72): coreTxResultsOnParse(), T(), input(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix (+64 more)

### Community 56 - "history"
Cohesion: 0.04
Nodes (61): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+53 more)

### Community 67 - "code"
Cohesion: 0.04
Nodes (55): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+47 more)

### Community 69 - "version"
Cohesion: 0.04
Nodes (52): side(), migrations(), deferred(), version(), 1. Overview, Appendix A. Reference, 0. Project setup, 1. TemporalKV (+44 more)

### Community 85 - "transportReader"
Cohesion: 0.05
Nodes (46): text(), transportReader(), transportReaderRule(), both(), memoryTables(), nodeBatchOf(), stepOrHalt(), stepOutcome() (+38 more)

### Community 89 - ".slowBlockMs"
Cohesion: 0.05
Nodes (40): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+32 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 108 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 126 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 131 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 144 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 150 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 155 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 167 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.09
Nodes (21): 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words, 4.1 Reachability does not depend on the form (+13 more)

### Community 169 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 173 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+12 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 179 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 183 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 184 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 186 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 189 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Requirement: LM-8 An in-memory block source (+8 more)

### Community 190 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 196 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.12
Nodes (11): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+3 more)

### Community 198 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 201 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 209 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 210 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 211 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 216 - "README.md"
Cohesion: 0.23
Nodes (3): Choosing a database, Launching it, stats-module

### Community 217 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 219 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 220 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 222 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 223 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 228 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 230 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 231 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 232 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 233 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 234 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 235 - "Requirement: DT-3 The contents hash"
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

### Community 243 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 244 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 245 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 246 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 247 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 248 - "Repository agent policy"
Cohesion: 0.22
Nodes (8): Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 249 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 250 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.22
Nodes (9): Assets and actors, Backups and restore, Commit policy, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node (+1 more)

### Community 251 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 253 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 255 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 256 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 257 - "After 0.10.0"
Cohesion: 0.22
Nodes (9): 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals, Release gates still to run (+1 more)

### Community 262 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 264 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 265 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 268 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.25
Nodes (7): 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 9.2 Browser build (BR), 9. Backups and browser, Design — CORE-ARCH: the standalone indexer's core architecture

### Community 269 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 270 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 271 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 273 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 274 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 275 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 276 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 277 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 278 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 279 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 280 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 281 - "Requirement: LG-4 Block content is decoded with the runtime that built it"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: LG-4 Block content is decoded with the runtime that built it, Scenario: An enactment block of the earlier form, Scenario: No runtime matches, Scenario: The first block of node 2.1's upgrade, Spec delta — `ledger` capability

### Community 285 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 286 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 287 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 288 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 289 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 290 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 291 - "The scan action cannot exclude a single opengrep rule"
Cohesion: 0.33
Nodes (5): Current workaround, Evidence, Problem, Suggested fix, The scan action cannot exclude a single opengrep rule

### Community 292 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 293 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 294 - "Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`), What changes, Why

### Community 295 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 296 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 297 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 298 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 299 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 300 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 301 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 302 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 305 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 306 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 307 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 308 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 309 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 310 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 311 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 312 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 313 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 314 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 315 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 316 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 317 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 318 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 319 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 320 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 321 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 322 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 323 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 324 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 325 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 326 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 327 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 328 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 329 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 330 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 331 - "00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered"
Cohesion: 0.40
Nodes (4): 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered, Evidence, Problem, Suggested fix

### Community 332 - "00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)"
Cohesion: 0.40
Nodes (4): 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …), Evidence, Problem, Suggested fix

### Community 333 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 334 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 335 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 336 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 337 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 338 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 339 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 340 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 341 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 342 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 343 - "Midnight Foundation Security Policy"
Cohesion: 0.40
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 345 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 346 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 347 - "00083 — Four timing-bound tests fail when the machine runs several test lanes at once"
Cohesion: 0.50
Nodes (3): 00083 — Four timing-bound tests fail when the machine runs several test lanes at once, Problem, Suggested fix

### Community 348 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 349 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 350 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 351 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 352 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 353 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 354 - "Acceptance — V9-UPGRADE-METADATA: decode a block with the runtime that built it, across node 2.1's runtime upgrades"
Cohesion: 0.50
Nodes (3): Acceptance — V9-UPGRADE-METADATA: decode a block with the runtime that built it, across node 2.1's runtime upgrades, Criteria, Definition of done

### Community 355 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 360 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-8949`, `RFC-3339`, `RFC-8949` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4404 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `column-rules.ts`, `migrate.ts`, `.from`, `db/errors.ts`, `ref_node_crypto`, `builds.ts`, `TapeRecord`, `Database`, `NodeClient`, `ledger/types.ts`, `runner/process.ts`, `admin-harness.ts`, `ledger-storage.test.ts`, `ref_node_url`, `core-ledger-state.ts`, `config/history.ts`, `cbor.ts`, `resolve.ts`, `validate.ts`, `module-api.ts`, `messages.ts`, `core-private-source.test.ts`, `host.ts`, `channel-queue.test.ts`, `process-admin.ts`, `UmbraError`, `core-config.test.ts`, `ref_node_fs`, `loop.test.ts`, `adapter.ts`, `loop.ts`, `writer-lock-checks.ts`, `refcount-restart.ts`, `mounted-admin.test.ts`, `db/backends.ts`, `tape/index.ts`, `ref_node_timers`, `contract-modules.test.ts`, `cli/command.ts`, `process-backends.ts`, `networks.ts`, `transport-faults.test.ts`, `InMemoryBlockSource`, `process-build.ts`, `ModuleDeclaration`, `refcount-tapes.ts`, `contract-data-checks.ts`, `core-block-parsed.ts`, `version-checks.ts`, `builder.test.ts`, `library/modules.test.ts`, `module-api.test.ts`, `private/lockstep-wait.test.ts`, `ref_node_events`, `database-parts.ts`, `slow-block-harness.ts`, `redact.ts`, `src/config/load.ts`, `node-set.test.ts`, `restore-ledger.ts`, `restore-private.ts`, `mapping.ts`, `loggingModule`, `loop-stop-harness.ts`, `post-block-update-checks.ts`, `transforms.test.ts`, `boundary.test.ts`, `resolver-boundary.ts`, `node.test.ts`, `halts.test.ts`, `retirement.test.ts`, `config-hash-checks.ts`, `digests.test.ts`, `paused-harness.ts`, `zero-timeouts-checks.ts`, `api-server.test.ts`, `options.ts`, `validation.ts`, `.close`, `node-bridge.ts`, `browser.test.ts`, `example-checks.ts`, `cold-boot-recovery.integration.test.ts`, `real-tapes.ts`, `src/ledger/identity.ts`, `Worker`, `release-version.ts`, `declaration.ts`, `browser/build.ts`, `chain-process.test.ts`, `process-worker.ts`, `postgres/transaction-history-storage.ts`, `LoopPauses`, `crash.test.ts`, `stop-heights.test.ts`, `package.json`, `documents.ts`, `checks.test.ts`, `code-registry.ts`, `read-gate.ts`, `test/postgres/setup.ts`, `threat-model.test.ts`, `pg-tx-history-adapter.ts`, `listening.test.ts`, `sigterm.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `config/plain-data.ts`, `surface.test.ts`, `start-umbradb.test.ts`, `block-fetch-decode.test.ts`, `worker-restart.test.ts`, `harness.ts`, `library-documents.test.ts`, `demo-handlers.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `excluded-not-exported.test.ts`, `ws-mutual-tls.test.ts`, `chain-placement.test.ts`, `statementsOf`, `validation.test.ts`, `mutation-per-adapter.mjs`, `web-lock.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `text.test.ts`, `facade-merge-loader.ts`, `ledger/plain-data.ts`?**
  _High betweenness centrality (0.186) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-8949` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `column-rules.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.016790877255993535 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `column-rules.ts`, `migrate.ts`, `.from`, `db/errors.ts`, `ref_node_crypto`, `builds.ts`, `TapeRecord`, `Database`, `NodeClient`, `ledger/types.ts`, `runner/process.ts`, `admin-harness.ts`, `core-ledger-state.ts`, `config/history.ts`, `cbor.ts`, `resolve.ts`, `validate.ts`, `module-api.ts`, `messages.ts`, `core-private-source.test.ts`, `host.ts`, `channel-queue.test.ts`, `process-admin.ts`, `ref_node_fs`, `FinalizedLoop`, `loop.test.ts`, `loop.ts`, `BlockRef`, `startUmbraDB`, `writer-lock-checks.ts`, `mounted-admin.test.ts`, `db/backends.ts`, `tape/index.ts`, `ref_node_timers`, `contract-modules.test.ts`, `cli/command.ts`, `process-backends.ts`, `networks.ts`, `transport-faults.test.ts`, `InMemoryBlockSource`, `process-build.ts`, `ModuleDeclaration`, `refused`, `version-checks.ts`, `library/modules.test.ts`, `module-api.test.ts`, `private/lockstep-wait.test.ts`, `client.ts`, `ref_node_events`, `database-parts.ts`, `slow-block-harness.ts`, `redact.ts`, `src/config/load.ts`, `node-set.test.ts`, `restore-ledger.ts`, `restore-private.ts`, `mapping.ts`, `loggingModule`, `range.ts`, `graph.ts`, `halts.test.ts`, `transportReader`, `zero-timeouts-checks.ts`, `api-server.test.ts`, `RuntimeMetadata`, `options.ts`, `validation.ts`, `.close`, `src/ledger/identity.ts`, `declaration.ts`, `chain-process.test.ts`, `process-worker.ts`, `src/index.ts`, `transforms.ts`, `checks.test.ts`, `config/plain-data.ts`, `PgliteDatabase`, `statementsOf`, `checkShape`, `validation.test.ts`, `web-lock.ts`, `browser/src/config/load.ts`, `sha256`, `Repository agent policy`, `Design — CORE-ARCH: the standalone indexer's core architecture`, `finalized-height.ts`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02139495079161318 - nodes in this community are weakly interconnected._