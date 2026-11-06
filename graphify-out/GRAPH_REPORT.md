# Graph Report - UmbraDB

## Corpus Check
- 1291 files · ~1,826,412 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13299 nodes · 41569 edges · 364 communities (332 shown, 32 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3459 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `5e1a587e5f000439` (1291 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- UmbraError
- config/history.ts
- node-fields-harness.ts
- core-ledger-state/sql.ts
- cbor.property.test.ts
- networks.ts
- test/postgres/setup.ts
- node-format.ts
- events-fixtures.ts
- resolve.ts
- browser.test.ts
- Worker
- release-version.ts
- core.ts
- refcount-model.ts
- ref_node_path
- worker-host.test.ts
- DatabaseParts
- resolver-boundary.ts
- browser/build.ts
- src/ledger/identity.ts
- guarantees.test.ts
- core-block-fetch/metadata.ts
- paused-harness.ts
- channel-queue.test.ts
- pg-tx-history-adapter.ts
- LoopPauses
- checks.test.ts
- documents.ts
- core-private-source.ts
- read-gate.ts
- intake.test.ts
- BlockRef
- Lockstep
- crash.test.ts
- hex
- config/plain-data.ts
- height-versioned.property.test.ts
- example-checks.ts
- check-required-tests.ts
- threat-model.test.ts
- ModuleDeclaration
- signal-ignored-fixtures.ts
- node-key.test.ts
- .send
- vendored-ledger-v9.test.ts
- .value
- placement.ts
- chain-events-decode.test.ts
- node-bridge.ts
- runner/process.ts
- browser-harness.ts
- TransactionHistoryEntry
- validation.ts
- version-checks.ts
- describeNodeStoreExports
- refcount-step.test.ts
- pack-install.mjs
- block-fetch-decode.test.ts
- demo-handlers.test.ts
- src/index.ts
- ledger/metadata.ts
- .concat
- .query
- tapes.ts
- GraphWorld
- key-handling-checks.ts
- validate.ts
- version-selection.test.ts
- .name
- version-table.ts
- lockstep-refusals.test.ts
- messages.ts
- node-refs.ts
- ws-mutual-tls.test.ts
- statementsOf
- pglite-timeouts.test.ts
- FinalizedLoop
- spawnChild
- web-lock.ts
- browser/serve.ts
- browser/src/config/load.ts
- NodeClient
- text.test.ts
- history.property.test.ts
- sha256
- buffer.ts
- Design — Sprint 1: project setup + TemporalKV
- tape/index.ts
- TapeAnswers
- process-build.ts
- ProcessItems
- chain-process.test.ts
- typescript
- vitest
- mutation-evidence.d.mts
- TransportProxy
- adapter-fixtures.ts
- AsyncLocalStorage
- api-session.test.ts
- refcount-tapes.ts
- startUmbraDB
- node-set.test.ts
- ledger/types.ts
- db/backends.ts
- core-ledger-state.ts
- loop-stop-harness.ts
- CliBackend
- NodeFS
- adapter.ts
- range.test.ts
- transform-checks.ts
- .read
- core-block-parsed.ts
- declaration.ts
- ref_node_timers
- LedgerPackage
- contract-data-checks.ts
- ledger-storage.test.ts
- interfaces/transaction-history-storage.ts
- .from
- NodeBlockSource
- ledger-tapes.ts
- ledger/ledger-tasks.test.ts
- process-backends.ts
- host.ts
- transport-faults.test.ts
- Process
- mounted-admin.test.ts
- backup/backup.ts
- refcount-restart.ts
- column-rules.ts
- library/modules.test.ts
- PgTransactionHistoryStorage
- TapeNode
- api-server.test.ts
- start-umbradb.ts
- slow-block-harness.ts
- legacy-excluded.test.ts
- engine.ts
- pause-fixtures.ts
- column-rules.test.ts
- PgliteDatabase
- client.test.ts
- boundary.test.ts
- backup/restore.ts
- checkShape
- range.ts
- graph.ts
- binding.test.ts
- surface.test.ts
- retirement.test.ts
- file-mode.test.ts
- builds.ts
- 14. Private processes
- cbor.ts
- private/lockstep-wait.test.ts
- page.ts
- mapping.ts
- process-worker.ts
- pglite-lock.ts
- InMemoryBlockSource
- ChannelEndpoint
- chain-placement.test.ts
- real-tapes.ts
- cold-boot-recovery.integration.test.ts
- Proposal — Sprint 3: CheckpointStore
- refused
- graph.py
- .off
- ADDED Requirements
- ADDED Requirements
- Tasks — START-UMBRADB: UmbraDB as a library
- ADDED Requirements
- .onClose
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Boundaries, threats and controls
- local-preprod-sync.mjs
- sweep-fixture.test.ts
- mutation-per-adapter.mjs
- twox.ts
- backupAtStop
- umbradb.test.ts
- midnight-env — reproducible PREPROD dev environment
- Requirement: BK-1 Backup
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- crash-worker.ts
- history
- .put
- UmbraDB 0.9.5 "Penumbra"
- version
- T
- code
- core-private-source.test.ts
- .slowBlockMs
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
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
- scoped-review-manifest
- try.sh
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Requirement: PP-4 The process transport
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Proposal — Sprint 1: project setup + TemporalKV
- Design — CORE-ARCH: the standalone indexer's core architecture
- Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-infosec-signoff
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
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
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00023 — The blocks table's height partitions end at 5,000,000
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
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream)
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- 00084 — The contents hash's key-ordered read splices its page size into `LIMIT`
- bug-report.md
- feature-request.md
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails
- 00083 — Four timing-bound tests fail when the machine runs several test lanes at once
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
- README.md
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
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (364 total, 32 thin omitted)

### Community 0 - "UmbraError"
Cohesion: 0.02
Nodes (269): BenchEnv, PostgresConnection, PostgresOptions, SslMode, Database, ReadOptions, Transaction, DurabilityProbeOptions (+261 more)

### Community 1 - "config/history.ts"
Cohesion: 0.02
Nodes (226): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, coreEntry, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry (+218 more)

### Community 10 - "node-fields-harness.ts"
Cohesion: 0.03
Nodes (126): BlockParsed, ProcessCondition, itemsSeen, Scenario, A168Observation, A168Phase, A168RunOptions, Expected (+118 more)

### Community 100 - "core-ledger-state/sql.ts"
Cohesion: 0.08
Nodes (36): NodeSetFault, NodeSetOptions, NodeTableCheck, StateRow, SchemaTable, ContentFunction, ContentDefinition, ContentDefinedBuildOptions (+28 more)

### Community 101 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (37): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+29 more)

### Community 102 - "networks.ts"
Cohesion: 0.06
Nodes (36): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, ConfiguredLedgerTable (+28 more)

### Community 103 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 105 - "node-format.ts"
Cohesion: 0.10
Nodes (23): Reader, Readable, Reader, TableNode, loadProblems(), tagsOf(), list(), concat() (+15 more)

### Community 107 - "events-fixtures.ts"
Cohesion: 0.13
Nodes (28): eventsRuntime, Field, PalletMetadata, Registry, RuntimeShape, StorageSpec, LedgerScenarioOptions, metadataWith() (+20 more)

### Community 11 - "resolve.ts"
Cohesion: 0.03
Nodes (125): BackupOutcome, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus (+117 more)

### Community 111 - "browser.test.ts"
Cohesion: 0.08
Nodes (35): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, PageRequest, continuedProblems() (+27 more)

### Community 112 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 115 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 116 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 119 - "refcount-model.ts"
Cohesion: 0.10
Nodes (30): BlockKind, BlockScript, BoundaryRewrite, DrivenBlock, GeneratedBlock, GeneratedState, GraphNode, HistoryScript (+22 more)

### Community 12 - "ref_node_path"
Cohesion: 0.04
Nodes (105): RestoreCommandSeams, RestoreOutcome, BackupBackend, BackupDatabase, killedRestore, TickerConfig, TickerHandle, FileRow (+97 more)

### Community 120 - "worker-host.test.ts"
Cohesion: 0.07
Nodes (28): LedgerWorkerFailure, SlowStep, TestLoaderData, isEvictionRefused(), errorOf(), beat(), countDeserializations(), hexOf() (+20 more)

### Community 121 - "DatabaseParts"
Cohesion: 0.06
Nodes (19): DatabaseParts, CheckTarget, Job, Outcome, Stated, TestCertificates, A149Observation, event() (+11 more)

### Community 122 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 123 - "browser/build.ts"
Cohesion: 0.08
Nodes (25): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+17 more)

### Community 126 - "src/ledger/identity.ts"
Cohesion: 0.12
Nodes (26): ManifestLine, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages() (+18 more)

### Community 127 - "guarantees.test.ts"
Cohesion: 0.11
Nodes (19): CloseHelper, NetworkRuleName, QuietResult, Parsed, Expected, runProcess(), commandRun(), schemaCase() (+11 more)

### Community 128 - "core-block-fetch/metadata.ts"
Cohesion: 0.16
Nodes (22): ExtrinsicCall, MetadataPallet, MetadataStorage, MetadataStorageEntry, RuntimeMetadataView, TypeDef, ScaleError, callOf() (+14 more)

### Community 129 - "paused-harness.ts"
Cohesion: 0.13
Nodes (27): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, keeperModule() (+19 more)

### Community 13 - "channel-queue.test.ts"
Cohesion: 0.03
Nodes (96): demoLink, Envelope, LinkTimers, PrivateLinkChannel, UmbraDBHandle, HelloAck, PrivateTransport, Waiter (+88 more)

### Community 131 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 132 - "LoopPauses"
Cohesion: 0.08
Nodes (17): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 133 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+14 more)

### Community 134 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 136 - "core-private-source.ts"
Cohesion: 0.10
Nodes (25): PrivateChecks, PrivateShared, PrivateSourceOptions, startHashDecision, StartHashes, PrivateLink, PublicConfiguration, PublicItem (+17 more)

### Community 137 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 139 - "intake.test.ts"
Cohesion: 0.13
Nodes (16): PrivateSeen, A114Observation, A116Observation, TestLink, CountingLink, a114Problems(), a114Run(), a116Problems() (+8 more)

### Community 14 - "BlockRef"
Cohesion: 0.03
Nodes (96): BlockHeaderItem, BlockRow, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, BlockRef, BlockSource, FinalityStallCondition (+88 more)

### Community 140 - "Lockstep"
Cohesion: 0.11
Nodes (11): InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal, byId() (+3 more)

### Community 141 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 144 - "hex"
Cohesion: 0.09
Nodes (19): Tables, byReference, insertNodes(), countsAndQueue(), writeCountsAndQueue(), bytes(), clear(), h() (+11 more)

### Community 145 - "config/plain-data.ts"
Cohesion: 0.11
Nodes (19): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), isElementKey() (+11 more)

### Community 146 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 147 - "example-checks.ts"
Cohesion: 0.15
Nodes (19): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+11 more)

### Community 148 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 149 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 15 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (119): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, MountedAdminAnswer, AdminSeams, OpenedFacts, PrivateSideFacts (+111 more)

### Community 152 - "signal-ignored-fixtures.ts"
Cohesion: 0.10
Nodes (22): IgnoredJob, ListenedRun, WorkerSignals, runFailed(), listenerProblems(), namesUnder(), pacedNode(), runWorkerInChild() (+14 more)

### Community 153 - "node-key.test.ts"
Cohesion: 0.12
Nodes (25): KeyOf, Walk, nodeKey(), keyOf(), rowOf(), childKeys(), node(), fileRows() (+17 more)

### Community 154 - ".send"
Cohesion: 0.14
Nodes (10): Cdp, ChromeBrowser, ChromeTab, chrome(), chrome(), chromePath(), exitsWithin(), launchChrome() (+2 more)

### Community 155 - "vendored-ledger-v9.test.ts"
Cohesion: 0.16
Nodes (23): NodeRoot, freeAll(), bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free() (+15 more)

### Community 156 - ".value"
Cohesion: 0.21
Nodes (9): MetadataType, ScaleReader, ValueReader, blockTimeOf(), bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement (+1 more)

### Community 157 - "placement.ts"
Cohesion: 0.12
Nodes (21): BlockEventSource, BodyExtrinsic, BlockBody, MetadataVariant, ChainTransaction, ChainEvent, EventPhase, RecordTypes (+13 more)

### Community 158 - "chain-events-decode.test.ts"
Cohesion: 0.11
Nodes (21): MetadataField, Primitive, writeEventRows(), canonicalJson(), hexOf(), littleEndian(), insertEventRows(), fill() (+13 more)

### Community 159 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 16 - "runner/process.ts"
Cohesion: 0.02
Nodes (94): Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ChainIdentity (+86 more)

### Community 160 - "browser-harness.ts"
Cohesion: 0.16
Nodes (21): PageApiChannel, PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf() (+13 more)

### Community 161 - "TransactionHistoryEntry"
Cohesion: 0.15
Nodes (7): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 162 - "validation.ts"
Cohesion: 0.09
Nodes (22): DeclarationRule, PlacedDeclaration, Plain, first(), validateWith(), badId, CONTENT_PROPERTIES, DECLARATION_PROPERTIES (+14 more)

### Community 163 - "version-checks.ts"
Cohesion: 0.15
Nodes (18): Boundary, CallRecord, MetadataSelector, Select, UpgradeCase, Walk, copyVendoredLedger(), expectEveryPackageFileChecked() (+10 more)

### Community 164 - "describeNodeStoreExports"
Cohesion: 0.14
Nodes (10): StoredNode, GenesisNodes, Disposable, NodeBatch, NodeStoreExports, NodeStoreSubject, hasEmbeddedChild(), describeNodeStoreExports() (+2 more)

### Community 166 - "refcount-step.test.ts"
Cohesion: 0.12
Nodes (19): RefcountModelHalt, refcountModelStep, Given, Halt, Outcome, refKeysOf(), both(), bytes() (+11 more)

### Community 167 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 168 - "block-fetch-decode.test.ts"
Cohesion: 0.14
Nodes (19): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+11 more)

### Community 169 - "demo-handlers.test.ts"
Cohesion: 0.14
Nodes (18): Compared, ConnectSeen, PortPeer, Exchanged, comparedOfExchange(), comparedOfResponse(), connected(), engineOf() (+10 more)

### Community 17 - "src/index.ts"
Cohesion: 0.03
Nodes (88): BlockWriteHandle, ReadHandle, SchemaWriteHandle, OwnPart, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable (+80 more)

### Community 171 - "ledger/metadata.ts"
Cohesion: 0.14
Nodes (8): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, OwnStateMetadata, contentStateOf(), hexOf()

### Community 172 - ".concat"
Cohesion: 0.13
Nodes (11): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+3 more)

### Community 175 - ".query"
Cohesion: 0.15
Nodes (17): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), snapshot(), "on-after-db-write"() (+9 more)

### Community 176 - "tapes.ts"
Cohesion: 0.18
Nodes (17): EventSpec, browserChain, heldClock, eventsValue(), finalizedHead(), at(), continueSession(), headSession() (+9 more)

### Community 177 - "GraphWorld"
Cohesion: 0.27
Nodes (3): Dice, GraphWorld, driveHistory()

### Community 178 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 18 - "validate.ts"
Cohesion: 0.03
Nodes (118): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, PostgresPartsInput, TransportReader, PrivateCoreSettings (+110 more)

### Community 180 - "version-selection.test.ts"
Cohesion: 0.21
Nodes (16): CountingNode, Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts() (+8 more)

### Community 181 - ".name"
Cohesion: 0.14
Nodes (11): Fetching, Recorder, Job, Run, database, gone, runs, 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail (+3 more)

### Community 185 - "version-table.ts"
Cohesion: 0.21
Nodes (18): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+10 more)

### Community 186 - "lockstep-refusals.test.ts"
Cohesion: 0.24
Nodes (17): LockstepCondition, A118Observation, MismatchObservation, a118Problems(), a118Run(), coreOn(), haltOf(), json() (+9 more)

### Community 19 - "messages.ts"
Cohesion: 0.03
Nodes (92): PrivateLinkAddress, PrivateLinkConnect, PublicSide, PublicSideOptions, EndpointOptions, CoreChannelSeams, CoreChannelsOptions, Queued (+84 more)

### Community 190 - "node-refs.ts"
Cohesion: 0.24
Nodes (6): nodeKeys, ChildReader, ChildVisitor, hashNode(), readChildList(), readChildren()

### Community 194 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 195 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 197 - "pglite-timeouts.test.ts"
Cohesion: 0.17
Nodes (12): Run, Job, WorkerEvent, expectNeverCutOffNorHung(), settings(), apiRead(), engine(), report() (+4 more)

### Community 2 - "FinalizedLoop"
Cohesion: 0.02
Nodes (141): QueuedBlock, BlockHeader, PointName, HeightRange, ResolvedRange, BlockItems, LateUse, Callback (+133 more)

### Community 20 - "spawnChild"
Cohesion: 0.02
Nodes (100): CdpEvent, Download, Served, ParentJob, Kill, Orphaned, SourceFile, Started (+92 more)

### Community 200 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 205 - "browser/serve.ts"
Cohesion: 0.22
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 206 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 21 - "NodeClient"
Cohesion: 0.04
Nodes (78): NodeSourceOptions, CoreChainBinding, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, Pending, State (+70 more)

### Community 210 - "text.test.ts"
Cohesion: 0.23
Nodes (6): BackupText, blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir

### Community 211 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 213 - "sha256"
Cohesion: 0.26
Nodes (6): sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 214 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 215 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 22 - "tape/index.ts"
Cohesion: 0.04
Nodes (81): Link, TapeBuilder, TapeBuilderOptions, CompletenessRange, RecordingError, RecordingProblem, TapeProblem, TransformProblem (+73 more)

### Community 225 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 23 - "process-build.ts"
Cohesion: 0.04
Nodes (98): HistoryOptions, ProcessHandle, ProcessingEnd, ProcessStatus, Job, A43Observation, Halt, CoreSeen (+90 more)

### Community 24 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (97): ToAdmin, EngineConfig, SignalTarget, WorkerWithStreams, Start, Refusal, Start, WorkerEvent (+89 more)

### Community 241 - "typescript"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 25 - "vitest"
Cohesion: 0.02
Nodes (69): ProcessObservation, StartVia, Finding, Lockfile, Manifest, RepositoryFile, Upstream, Opened (+61 more)

### Community 258 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (91): Upstream, contractFixture, RawPackage, AdapterSubject, AdapterWorkerHost, Decimal, Fullness, OracleAfter (+83 more)

### Community 27 - "api-session.test.ts"
Cohesion: 0.04
Nodes (81): coreHeaders, HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions (+73 more)

### Community 28 - "refcount-tapes.ts"
Cohesion: 0.04
Nodes (79): workerRecord, FixtureConfig, StoredCheck, ContractRow, conversionRun, Released, Reader, RefcountTape (+71 more)

### Community 29 - "startUmbraDB"
Cohesion: 0.03
Nodes (96): UmbraDBStarted, text(), transportReader(), transportReaderRule(), startUmbraDB(), log(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence (+88 more)

### Community 3 - "node-set.test.ts"
Cohesion: 0.02
Nodes (183): TableDigest, TableDigestRow, BackupFacts, DumpInput, CaptureColumn, CapturedTable, CaptureState, CheckedMigration (+175 more)

### Community 30 - "ledger/types.ts"
Cohesion: 0.04
Nodes (77): ContractLog, BlockTransaction, LoadLedger, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program (+69 more)

### Community 31 - "db/backends.ts"
Cohesion: 0.03
Nodes (70): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, PgliteOptions, Settings, TestBackend, Case (+62 more)

### Community 32 - "core-ledger-state.ts"
Cohesion: 0.04
Nodes (84): ComputedBlock, LedgerBinding, retainedStates, KeyCounts, RefcountCheck, RefcountStatement, refcountStep, RefcountTables (+76 more)

### Community 33 - "loop-stop-harness.ts"
Cohesion: 0.05
Nodes (84): Manifest, Restored, CrashEvent, CrashJob, ingest, watched, Call, RestartEvent (+76 more)

### Community 35 - "adapter.ts"
Cohesion: 0.04
Nodes (74): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+66 more)

### Community 36 - "range.test.ts"
Cohesion: 0.04
Nodes (52): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Script, ScriptedNode (+44 more)

### Community 37 - "transform-checks.ts"
Cohesion: 0.05
Nodes (61): Metadata, Step, Failure, Variant, TapeError, TransformError, CallRecord, NotifyRecord (+53 more)

### Community 38 - ".read"
Cohesion: 0.04
Nodes (82): Chain, DigestRow, Op, States, TableName, captured(), captureFunction(), hex() (+74 more)

### Community 39 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (78): BlockParsedOptions, ChangedFile, GenesisFixture, installationCopy, StartPackageProcess, databaseOf(), ledgerVersionOf(), bindLedgerParser() (+70 more)

### Community 4 - "declaration.ts"
Cohesion: 0.02
Nodes (173): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, AdminServer, AdminStartOptions, AdminAnswer, AdminEndpoint (+165 more)

### Community 40 - "ref_node_timers"
Cohesion: 0.05
Nodes (61): CommandHandler, CommandIo, MainProcess, CommandResult, Renamed, RunningCommand, statsConfig, backupArguments() (+53 more)

### Community 41 - "LedgerPackage"
Cohesion: 0.06
Nodes (36): RetainedState, LedgerEventKind, LedgerPackage, LedgerTaskBlock, StateHandle, EvictionRefused, LedgerEngine, LedgerTaskFailed (+28 more)

### Community 42 - "contract-data-checks.ts"
Cohesion: 0.06
Nodes (71): CoreContractStatesOptions, ContractStateRow, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+63 more)

### Community 43 - "ledger-storage.test.ts"
Cohesion: 0.06
Nodes (69): SeenLoad, retentionSeen, ledgerScenario, LedgerTx, recordedGenesis, PackageStartup, ProcessDatabase, retainedStatesOf() (+61 more)

### Community 44 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (57): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+49 more)

### Community 45 - ".from"
Cohesion: 0.03
Nodes (66): Buffer, Hash, contentsHash, FileEntries, Cbor, DigestRow, DigestRows, Reader (+58 more)

### Community 46 - "NodeBlockSource"
Cohesion: 0.06
Nodes (26): HeadWait, NodeBlockSource, Prefetch, NodeHeader, PreparedBlock, QueueRunner, EventsRunner, Opened (+18 more)

### Community 47 - "ledger-tapes.ts"
Cohesion: 0.04
Nodes (62): ApplyInput, ApplyOutput, StateSummary, LedgerHeight, RawPackageClass, Ledger, NodeRoot, AdapterWorkerAnswer (+54 more)

### Community 48 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.04
Nodes (53): Path, CallArgsItem, CallArguments, V9Raw, Point, described(), differs(), key() (+45 more)

### Community 5 - "process-backends.ts"
Cohesion: 0.03
Nodes (152): CoreLedgerStateOptions, RefcountFault, NodeBatch, FixtureRun, FixtureRunOptions, SourceClass, Reader, Seen (+144 more)

### Community 50 - "host.ts"
Cohesion: 0.06
Nodes (40): LoadedState, LedgerActivity, LedgerHost, LedgerWorkerOptions, NodeDatabase, ParseRequest, Pending, SentParses (+32 more)

### Community 51 - "transport-faults.test.ts"
Cohesion: 0.05
Nodes (48): ResultColumn, CoreTransport, Message, MessageType, Ended, rawClient, Escape, publicState (+40 more)

### Community 52 - "Process"
Cohesion: 0.06
Nodes (15): BackupInput, LifecycleStatus, ProcessReason, RetryCode, PauseHold, Process, RetryCondition, asksForChannels() (+7 more)

### Community 53 - "mounted-admin.test.ts"
Cohesion: 0.06
Nodes (54): SecretHashes, SecretVariant, Expected, FactsRunOptions, SubscriptionSeen, Client, Mounted, handleOf() (+46 more)

### Community 54 - "backup/backup.ts"
Cohesion: 0.05
Nodes (59): BackupSeams, BackupTarget, BackupWritten, ManifestHistoryRow, ManifestMigration, ManifestTool, PgliteDump, SnapshotSeams (+51 more)

### Community 55 - "refcount-restart.ts"
Cohesion: 0.05
Nodes (54): BatchJson, ContentsHash, databaseNow, Hold, Light, Line, NodeSetKeeper, Observed (+46 more)

### Community 56 - "column-rules.ts"
Cohesion: 0.04
Nodes (67): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+59 more)

### Community 57 - "library/modules.test.ts"
Cohesion: 0.05
Nodes (42): Hold, Signal, ModuleListRule, OwnWords, Shown, HookedSource, PlainSubclass, GoneCwdResult (+34 more)

### Community 58 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (54): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it, Evidence, Problem (+46 more)

### Community 59 - "TapeNode"
Cohesion: 0.05
Nodes (21): Outage, Frame, RawClient, Failure, Variant, TapeClock, TapeNode, withNode() (+13 more)

### Community 6 - "api-server.test.ts"
Cohesion: 0.02
Nodes (124): ReadOnlyDatabase, SchemaPlan, Revision, ResolvedGraph, ChainDataAnswer, ChainDataView, SlowWindow, ApiError (+116 more)

### Community 60 - "start-umbradb.ts"
Cohesion: 0.07
Nodes (54): MessagePortLike, readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork, UmbraDBOptions (+46 more)

### Community 62 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+41 more)

### Community 63 - "legacy-excluded.test.ts"
Cohesion: 0.06
Nodes (49): VitestConfig, CodeList, CodeTest, RegistryInput, Section11, TestLiterals, buildProblems(), coverageProblems() (+41 more)

### Community 64 - "engine.ts"
Cohesion: 0.07
Nodes (42): TransactionParser, LedgerStateItem, StoredState, LedgerName, ChainOutcome, LedgerTask, NodeStore, ParsedTransaction (+34 more)

### Community 65 - "pause-fixtures.ts"
Cohesion: 0.06
Nodes (39): backupSignalRelay, SignalSource, stopSignal, BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable (+31 more)

### Community 66 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TreeNode, TypeRule, DesignTable (+24 more)

### Community 69 - "PgliteDatabase"
Cohesion: 0.07
Nodes (11): JobQueue, PgliteDatabase, BoundedRead, ReadPool, Session, Writer, handleClosed(), queryTimeout() (+3 more)

### Community 7 - "client.test.ts"
Cohesion: 0.03
Nodes (83): NodeCallOptions, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocketEvents, RecordingClient, HandSocket, HandSockets (+75 more)

### Community 70 - "boundary.test.ts"
Cohesion: 0.08
Nodes (43): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+35 more)

### Community 72 - "backup/restore.ts"
Cohesion: 0.07
Nodes (40): PublicIdentity, Checked, PublicSide, RestoreChain, RestoreInput, RestoreTarget, createReadStream(), isBlockLedgerSource() (+32 more)

### Community 73 - "checkShape"
Cohesion: 0.07
Nodes (41): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+33 more)

### Community 74 - "range.ts"
Cohesion: 0.06
Nodes (44): NodeSubscription, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, Final, Height (+36 more)

### Community 75 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 76 - "binding.test.ts"
Cohesion: 0.08
Nodes (43): PrivateIntakeOptions, PublicWakes, A165Options, a165Run, Attempt, A113Observation, A156Observation, Binding (+35 more)

### Community 77 - "surface.test.ts"
Cohesion: 0.07
Nodes (45): Document, EntryInput, Renamed, Surface, SurfaceAmendment, changelogEntryProblems(), entryTerms(), namesWord() (+37 more)

### Community 78 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 79 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (32): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+24 more)

### Community 8 - "builds.ts"
Cohesion: 0.03
Nodes (107): PglitePathParts, PostgresParts, Keeping, PrivateBackend, SessionSeen, TestDatabase, PrivateProcess, PrivateRefusal (+99 more)

### Community 80 - "14. Private processes"
Cohesion: 0.08
Nodes (24): PrivateBlockSource, SourceTransport, PublicDatabase, SourceShared, readConfigHash(), readConfigRows(), lockstepBehind(), openPublicDatabase() (+16 more)

### Community 81 - "cbor.ts"
Cohesion: 0.09
Nodes (37): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+29 more)

### Community 82 - "private/lockstep-wait.test.ts"
Cohesion: 0.07
Nodes (26): Report, OpenTransaction, ExpectedWait, WaitSample, HeldLink, HoldingRelay, ReportRelay, RetargetProxy (+18 more)

### Community 83 - "page.ts"
Cohesion: 0.06
Nodes (34): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+26 more)

### Community 84 - "mapping.ts"
Cohesion: 0.08
Nodes (32): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+24 more)

### Community 86 - "process-worker.ts"
Cohesion: 0.07
Nodes (30): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, Scope, crossedError, StartRun, ToProcessWorker (+22 more)

### Community 87 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (32): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, ChildResult, acquirePgliteLock() (+24 more)

### Community 9 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (123): EntryRange, GraphInput, InMemoryBlockSource, LockstepWait, LoopEnd, LoopInput, SlowBlockEvent, Flaky (+115 more)

### Community 93 - "ChannelEndpoint"
Cohesion: 0.11
Nodes (13): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), messageEnvelope(), refuseChannel(), discard(), isChannel() (+5 more)

### Community 94 - "chain-placement.test.ts"
Cohesion: 0.08
Nodes (40): BlockSpec, Json, transactionSpec, Phase, decodeExtrinsics(), chainHashOf(), inThreadParser(), a91RangeScenario() (+32 more)

### Community 98 - "real-tapes.ts"
Cohesion: 0.08
Nodes (33): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+25 more)

### Community 99 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 246 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 49 - "refused"
Cohesion: 0.04
Nodes (65): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+57 more)

### Community 109 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 110 - ".off"
Cohesion: 0.06
Nodes (35): Durability, 0. Baseline and decisions, 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate) (+27 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees, ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine (+24 more)

### Community 125 - "Tasks — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.06
Nodes (29): ownKeys(), Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+21 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.07
Nodes (25): 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage, ADDED Requirements (+17 more)

### Community 165 - ".onClose"
Cohesion: 0.10
Nodes (19): fault(), 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once, Evidence, Problem, Suggested fix, 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format (+11 more)

### Community 170 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 179 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 189 - "local-preprod-sync.mjs"
Cohesion: 0.21
Nodes (17): commitOf(), configText(), docker(), dockerHas(), dockerLater(), imageDigests(), main(), nodeRpc() (+9 more)

### Community 196 - "sweep-fixture.test.ts"
Cohesion: 0.23
Nodes (13): childRefKeys(), applyInput(), at(), batchText(), blockHash(), embeddedOf(), hex(), keysOf() (+5 more)

### Community 199 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 204 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 207 - "backupAtStop"
Cohesion: 0.18
Nodes (13): backupAtStop(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds, Writing a backup, 15. Backups and browser (+5 more)

### Community 218 - "umbradb.test.ts"
Cohesion: 0.21
Nodes (11): configText(), coreSettings(), inChild(), lineOf(), core(), fileOf(), coreOnly(), withStats() (+3 more)

### Community 238 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 239 - "Requirement: BK-1 Backup"
Cohesion: 0.22
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 243 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 250 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 278 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 336 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 34 - "history"
Cohesion: 0.03
Nodes (93): instanceOf(), integer(), isPlain(), history(), revision(), params(), data(), PLAIN_DATA_RULES (+85 more)

### Community 61 - ".put"
Cohesion: 0.04
Nodes (56): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+48 more)

### Community 67 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.04
Nodes (49): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+41 more)

### Community 68 - "version"
Cohesion: 0.05
Nodes (51): side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+43 more)

### Community 71 - "T"
Cohesion: 0.04
Nodes (49): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+41 more)

### Community 85 - "code"
Cohesion: 0.05
Nodes (42): code(), Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in) (+34 more)

### Community 90 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (12): publicLockstepOf(), height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PUBLIC_POLL_MS (+4 more)

### Community 92 - ".slowBlockMs"
Cohesion: 0.05
Nodes (35): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+27 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 106 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 108 - "package.json"
Cohesion: 0.05
Nodes (38): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+30 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 130 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 151 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 173 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 174 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 182 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 183 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 187 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 188 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 191 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 192 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 193 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 198 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

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

### Community 209 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 212 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 216 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 217 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.17
Nodes (11): 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents, 7. `core-arch` criteria rewritten by this change, 8. Required test ids (+3 more)

### Community 219 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 220 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 221 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 222 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 223 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 224 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 226 - "[0.10.0] - 2026-10-27"
Cohesion: 0.20
Nodes (9): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changed since `v0.10.0-rc.2`: ledger nodes reclaimed by reference counting (`ledger-refcount`), Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface) (+1 more)

### Community 227 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 228 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 229 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 230 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 231 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 232 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 233 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 234 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 236 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 237 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 240 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 242 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 244 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 245 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 247 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 248 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 249 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 251 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 252 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 253 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 254 - "Requirement: PP-4 The process transport"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, Spec delta — `private-processes` capability

### Community 255 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 256 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 257 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 261 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 262 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 263 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 264 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 265 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 266 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 267 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 268 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 269 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.33
Nodes (5): 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence, 15. Relation to the existing design documents, 9. Backups and browser, Design — CORE-ARCH: the standalone indexer's core architecture

### Community 270 - "Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`), What changes, Why

### Community 271 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 272 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 273 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 274 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 275 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 276 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 277 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 279 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 280 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 281 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 282 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 283 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 284 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 285 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 286 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 287 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 288 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 289 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 290 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 291 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 292 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 293 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

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

### Community 311 - "00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)"
Cohesion: 0.40
Nodes (4): 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …), Evidence, Problem, Suggested fix

### Community 312 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 313 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 314 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 315 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 316 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 317 - "00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream)"
Cohesion: 0.40
Nodes (4): 00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream), Evidence, Problem, Suggested fix (upstream; the ledger team's choice)

### Community 318 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 319 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 320 - "00084 — The contents hash's key-ordered read splices its page size into `LIMIT`"
Cohesion: 0.40
Nodes (4): 00084 — The contents hash's key-ordered read splices its page size into `LIMIT`, Evidence, Problem, Suggested fix

### Community 321 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 322 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 323 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.40
Nodes (4): 13. Contract data, 18. Whole-system faults, differentials and measurements, 19. Close-out, Tasks — CORE-ARCH: the standalone indexer's core architecture

### Community 324 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 325 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 326 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 327 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 328 - "00083 — Four timing-bound tests fail when the machine runs several test lanes at once"
Cohesion: 0.50
Nodes (3): 00083 — Four timing-bound tests fail when the machine runs several test lanes at once, Problem, Suggested fix

### Community 329 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 330 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 331 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 332 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 333 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 334 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 91 - "README.md"
Cohesion: 0.05
Nodes (32): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:, Backups and status (+24 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning (+33 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-8785`, `RFC-8785`, `RFC-8949` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4375 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UmbraError`, `config/history.ts`, `FinalizedLoop`, `node-set.test.ts`, `declaration.ts`, `process-backends.ts`, `api-server.test.ts`, `client.test.ts`, `builds.ts`, `InMemoryBlockSource`, `node-fields-harness.ts`, `resolve.ts`, `ref_node_path`, `channel-queue.test.ts`, `BlockRef`, `ModuleDeclaration`, `runner/process.ts`, `src/index.ts`, `validate.ts`, `messages.ts`, `spawnChild`, `NodeClient`, `tape/index.ts`, `process-build.ts`, `chain-process.test.ts`, `adapter-fixtures.ts`, `api-session.test.ts`, `refcount-tapes.ts`, `ledger/types.ts`, `db/backends.ts`, `core-ledger-state.ts`, `loop-stop-harness.ts`, `adapter.ts`, `range.test.ts`, `transform-checks.ts`, `.read`, `core-block-parsed.ts`, `ref_node_timers`, `contract-data-checks.ts`, `ledger-storage.test.ts`, `interfaces/transaction-history-storage.ts`, `.from`, `NodeBlockSource`, `ledger-tapes.ts`, `ledger/ledger-tasks.test.ts`, `host.ts`, `transport-faults.test.ts`, `mounted-admin.test.ts`, `backup/backup.ts`, `refcount-restart.ts`, `library/modules.test.ts`, `TapeNode`, `start-umbradb.ts`, `slow-block-harness.ts`, `legacy-excluded.test.ts`, `engine.ts`, `pause-fixtures.ts`, `column-rules.test.ts`, `boundary.test.ts`, `backup/restore.ts`, `binding.test.ts`, `surface.test.ts`, `retirement.test.ts`, `file-mode.test.ts`, `private/lockstep-wait.test.ts`, `mapping.ts`, `process-worker.ts`, `pglite-lock.ts`, `core-private-source.test.ts`, `chain-placement.test.ts`, `real-tapes.ts`, `cold-boot-recovery.integration.test.ts`, `core-ledger-state/sql.ts`, `cbor.property.test.ts`, `networks.ts`, `test/postgres/setup.ts`, `node-format.ts`, `package.json`, `browser.test.ts`, `Worker`, `release-version.ts`, `core.ts`, `refcount-model.ts`, `worker-host.test.ts`, `DatabaseParts`, `resolver-boundary.ts`, `browser/build.ts`, `src/ledger/identity.ts`, `guarantees.test.ts`, `pg-tx-history-adapter.ts`, `LoopPauses`, `checks.test.ts`, `documents.ts`, `core-private-source.ts`, `read-gate.ts`, `intake.test.ts`, `Lockstep`, `crash.test.ts`, `hex`, `config/plain-data.ts`, `height-versioned.property.test.ts`, `example-checks.ts`, `check-required-tests.ts`, `threat-model.test.ts`, `node-key.test.ts`, `vendored-ledger-v9.test.ts`, `chain-events-decode.test.ts`, `node-bridge.ts`, `version-checks.ts`, `describeNodeStoreExports`, `refcount-step.test.ts`, `block-fetch-decode.test.ts`, `demo-handlers.test.ts`, `key-handling-checks.ts`, `version-selection.test.ts`, `excluded-not-exported.test.ts`, `lockstep-refusals.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `sweep-fixture.test.ts`, `pglite-timeouts.test.ts`, `mutation-per-adapter.mjs`, `web-lock.ts`, `twox.ts`, `text.test.ts`, `history.property.test.ts`, `umbradb.test.ts`?**
  _High betweenness centrality (0.217) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-8785` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.015137352650984058 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `config/history.ts`, `FinalizedLoop`, `node-set.test.ts`, `declaration.ts`, `process-backends.ts`, `api-server.test.ts`, `client.test.ts`, `core-private-source.ts`, `InMemoryBlockSource`, `node-fields-harness.ts`, `resolve.ts`, `checks.test.ts`, `channel-queue.test.ts`, `BlockRef`, `ModuleDeclaration`, `runner/process.ts`, `config/plain-data.ts`, `src/index.ts`, `messages.ts`, `validate.ts`, `NodeClient`, `hex`, `process-build.ts`, `chain-process.test.ts`, `vitest`, `tape/index.ts`, `api-session.test.ts`, `startUmbraDB`, `ledger/types.ts`, `db/backends.ts`, `core-ledger-state.ts`, `loop-stop-harness.ts`, `validation.ts`, `version-checks.ts`, `transform-checks.ts`, `.read`, `refcount-step.test.ts`, `ref_node_timers`, `builds.ts`, `core-block-parsed.ts`, `ledger/metadata.ts`, `LedgerPackage`, `NodeBlockSource`, `ledger/ledger-tasks.test.ts`, `refused`, `transport-faults.test.ts`, `Process`, `backup/backup.ts`, `version-table.ts`, `library/modules.test.ts`, `lockstep-refusals.test.ts`, `start-umbradb.ts`, `slow-block-harness.ts`, `pause-fixtures.ts`, `statementsOf`, `PgliteDatabase`, `web-lock.ts`, `backup/restore.ts`, `checkShape`, `graph.ts`, `binding.test.ts`, `range.ts`, `browser/src/config/load.ts`, `backupAtStop`, `14. Private processes`, `cbor.ts`, `mapping.ts`, `sha256`, `process-worker.ts`, `pglite-lock.ts`, `core-private-source.test.ts`, `core-ledger-state/sql.ts`, `src/ledger/identity.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `config/history.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017579657824517345 - nodes in this community are weakly interconnected._