# Graph Report - UmbraDB

## Corpus Check
- 1300 files · ~1,832,742 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .patch 18, (none) 16, .lean 11)

## Summary
- 13363 nodes · 41697 edges · 357 communities (323 shown, 34 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3476 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `e55434eb881c3479` (1300 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- InMemoryBlockSource
- column-rules.ts
- loop.ts
- worker-storage.test.ts
- BACKENDS
- networks.ts
- dispatch.test.ts
- release-version.ts
- core.ts
- config/history.ts
- ChannelEndpoint
- paused-harness.ts
- node-run.ts
- pglite-lock.ts
- resolver-boundary.ts
- ref_node_events
- worker-host.test.ts
- src/db/postgres.ts
- node-set.test.ts
- api-server.test.ts
- node-fields-harness.ts
- code-registry.ts
- mapping.ts
- RuntimeMetadata
- documents.ts
- pg-tx-history-adapter.ts
- ModuleDeclaration
- read-gate.ts
- threat-model.test.ts
- LedgerHost
- crash.test.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- host.ts
- surface.test.ts
- ws-mutual-tls.test.ts
- pack-install.mjs
- version-table.ts
- ProcessContexts
- validation.test.ts
- HeightRun
- core-ledger-state.ts
- shims.test.ts
- api-session.test.ts
- library-documents.test.ts
- PointName
- key-handling-checks.ts
- BlockRef
- transaction-history-storage.property.test.ts
- module-api.test.ts
- parseJsonLossless
- process-admin.ts
- ApiRoutes
- commit-proxy.ts
- config/plain-data.test.ts
- messages.ts
- LoopPauses
- read-height.property.test.ts
- statementsOf
- HeldHeight
- stats-module.ts
- change-capture.ts
- version-selection.test.ts
- quiet-host.child.ts
- web-lock.ts
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- builds.ts
- adapter-fixtures.ts
- worker-threads.test.ts
- postgres-tls-server.ts
- Heartbeat
- history.property.test.ts
- UmbraError
- worker-threads-worker.ts
- buffer.ts
- Worker
- hex
- ledger/plain-data.ts
- TapeAnswers
- in-memory-source.ts
- signal-backup.worker.ts
- NodeClient
- src/index.ts
- mutation-evidence.d.mts
- .once
- TransportProxy
- AsyncLocalStorage
- Process
- start-umbradb.ts
- api.ts
- spawnChild
- admin-harness.ts
- connectWebSocket
- core-private-source.test.ts
- HeightActivity
- browser.test.ts
- CliBackend
- NodeFS
- runner/process.ts
- Keeping
- mounted-admin.test.ts
- ref_node_fs
- ledger-tapes.ts
- fetch-fixtures.ts
- ProcessHandle
- adapter.ts
- migrate.ts
- declaration.ts
- cli/command.ts
- cbor.ts
- vitest
- core-block-parsed.ts
- contract-modules.test.ts
- range.ts
- FinalizedLoop
- core-transport.ts
- ledger/types.ts
- refcount-model.ts
- pause-fixtures.ts
- PgTransactionHistoryStorage
- LedgerPackage
- contract-data-checks.ts
- .value
- refcount-restart.ts
- tape/index.ts
- backup/restore.ts
- ledger-storage.test.ts
- core-block-commit.test.ts
- interfaces/transaction-history-storage.ts
- slow-block-harness.ts
- ledger/ledger-tasks.test.ts
- chain-data.test.ts
- chain-events-decode.test.ts
- client.test.ts
- test/postgres/setup.ts
- order.property.test.ts
- restore-private.ts
- boundary.test.ts
- graph.ts
- containers.test.ts
- refcount-conversion.ts
- ledger-refcount-backup.test.ts
- process-backends.ts
- lockstep-refusals.test.ts
- retirement.test.ts
- api-socket.ts
- file-mode.test.ts
- checkShape
- page.ts
- example-checks.ts
- version-checks.ts
- validate.ts
- browser/build.ts
- module-api.ts
- cold-boot-recovery.integration.test.ts
- childRefKeys
- ingest-faults.test.ts
- TransactionHistoryEntry
- block-fetch-decode.test.ts
- 7. Storage helpers
- .configHash
- data
- graph.py
- ADDED Requirements
- migrations
- transportReader
- .slowBlockMs
- refused
- reason
- local-preprod-sync.mjs
- 5.2 The network plan
- connectChannel
- .disconnect
- following
- twox.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- Design — v1.1.0: Quint model checking
- core-block-fetch.test.ts
- path.ts
- 2. Points
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- rowProblems
- crash-worker.ts
- .put
- startUmbraDB
- version
- history
- code
- .off
- .from
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- Boundaries, threats and controls
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- ADDED Requirements
- README.md
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
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- ADDED Requirements
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- Requirement: DT-3 The contents hash
- [0.10.0] - 2026-10-27
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Design — Sprint 2: Transaction/Lease
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Proposal — V9-UPGRADE-METADATA: decode a block with the runtime that built it, across node 2.1's runtime upgrades (`v9-upgrade-metadata`)
- Contributing
- UmbraDB in a browser
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- Requirement: LG-4 Block content is decoded with the runtime that built it
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
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
- After 0.10.0
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
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes
- 00083 — Four timing-bound tests fail when the machine runs several test lanes at once
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- Acceptance — V9-UPGRADE-METADATA: decode a block with the runtime that built it, across node 2.1's runtime upgrades
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
- package.json
- post-block-update/oracle/main.rs
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 466 edges
2. `UmbraError` - 360 edges
3. `ModuleDeclaration` - 213 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 139 edges
6. `NodeClient` - 118 edges
7. `BlockRef` - 105 edges
8. `Database` - 104 edges
9. `startUmbraDB()` - 103 edges
10. `PROCESS_BACKENDS` - 103 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Evidence` --references--> `ManualTimers`  [INFERRED]
  docs/issues/00016-heartbeat-above-timer-limit.md → test/node/manual-timers.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts

## Import Cycles
- None detected.

## Communities (357 total, 34 thin omitted)

### Community 0 - "InMemoryBlockSource"
Cohesion: 0.01
Nodes (266): RestoreInput, NodeClientOptions, InMemoryBlockSource, EngineBuild, EngineNetwork, EngineOptions, ProcessingEnd, ProcessStatus (+258 more)

### Community 1 - "column-rules.ts"
Cohesion: 0.02
Nodes (189): DumpInput, CanonicalEncodingError, ContentDefinedTables, ContentOptions, TableContent, ModuleColumn, ModuleContentsError, ModuleContentsFailure (+181 more)

### Community 10 - "loop.ts"
Cohesion: 0.03
Nodes (137): ErrorCode, Revision, EntryRange, GraphInput, HeightRange, ResolvedGraph, LateUse, FinalityStallCondition (+129 more)

### Community 101 - "worker-storage.test.ts"
Cohesion: 0.09
Nodes (24): NodeStore, StoredNode, Thread, BridgeServer, bridgeStore, Growable, Nodes, bridgeMemory() (+16 more)

### Community 103 - "BACKENDS"
Cohesion: 0.11
Nodes (24): Settings, Outcome, openBlockWrites(), setUp(), idleBlock(), migrated(), part(), seenAt() (+16 more)

### Community 104 - "networks.ts"
Cohesion: 0.07
Nodes (33): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+25 more)

### Community 105 - "dispatch.test.ts"
Cohesion: 0.12
Nodes (31): ResolvedRange, Callback, EntryBoundary, ParallelPoint, PointRun, PointSchedule, Pipeline, CoreStopsFirst (+23 more)

### Community 108 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 109 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 11 - "config/history.ts"
Cohesion: 0.03
Nodes (141): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreSettings, versionEntry, ConfigHashRow, HistoryCheck, HistoryCode (+133 more)

### Community 110 - "ChannelEndpoint"
Cohesion: 0.13
Nodes (7): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), messageEnvelope(), refuseChannel(), 4. Channels

### Community 111 - "paused-harness.ts"
Cohesion: 0.12
Nodes (30): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, keeperModule() (+22 more)

### Community 112 - "node-run.ts"
Cohesion: 0.10
Nodes (26): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, NodeRunResult, core(), databaseOf() (+18 more)

### Community 114 - "pglite-lock.ts"
Cohesion: 0.09
Nodes (25): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, ChildResult, acquirePgliteLock() (+17 more)

### Community 116 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 118 - "ref_node_events"
Cohesion: 0.09
Nodes (22): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, PausableOptions (+14 more)

### Community 119 - "worker-host.test.ts"
Cohesion: 0.08
Nodes (26): LedgerWorkerFailure, SlowStep, TestLoaderData, errorOf(), beat(), countDeserializations(), hexOf(), loadLedger() (+18 more)

### Community 12 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (122): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, driverConnectionOptions, DriverError, Outcome, PostgresOptions (+114 more)

### Community 120 - "node-set.test.ts"
Cohesion: 0.08
Nodes (28): StoredRow, Tables, contentDefinedLedgerState(), changedRow(), database(), databaseSql(), hexOf(), keyOf() (+20 more)

### Community 121 - "api-server.test.ts"
Cohesion: 0.11
Nodes (24): AppendsVersion, Client, names(), configHashesOf(), duplicateProblems(), exchange(), helperProblems(), hex() (+16 more)

### Community 122 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (26): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Run() (+18 more)

### Community 123 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 125 - "mapping.ts"
Cohesion: 0.11
Nodes (28): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+20 more)

### Community 126 - "RuntimeMetadata"
Cohesion: 0.07
Nodes (21): RuntimeMetadata, hexOf(), 00089 — The first block of the v9 runtime halts with `metadata-mismatch` on every network, Evidence, Suggested fix, The problem, Context, D1. The runtime named by the `MNSV` digest, the parent's first (+13 more)

### Community 128 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 129 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (23): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+15 more)

### Community 13 - "ModuleDeclaration"
Cohesion: 0.03
Nodes (137): OpenedFacts, CoreChainFacts, privateIntake, BackupInput, RestoreBase, Environment, BackupCommandOptions, BackupOutcome (+129 more)

### Community 131 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 132 - "threat-model.test.ts"
Cohesion: 0.15
Nodes (26): Citation, citationProblems(), citations(), commitPolicyProblems(), headingProblems(), headings(), knownGapProblems(), lineCountOf() (+18 more)

### Community 133 - "LedgerHost"
Cohesion: 0.20
Nodes (12): LedgerHost, NodeReader, PackageStartup, inThreadLedger(), recordingWorker(), recordingLoads(), pointWorker(), 00057 — The ledger worker and the main thread may load different user-module code (+4 more)

### Community 134 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 136 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 137 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 138 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 14 - "host.ts"
Cohesion: 0.03
Nodes (111): LoadedState, LedgerWorkerOptions, NodeDatabase, ParseRequest, SentParses, ingest, workerRecord, Call (+103 more)

### Community 140 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 141 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 144 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 145 - "version-table.ts"
Cohesion: 0.15
Nodes (23): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, ledgerTableRule(), ledgerTableIssuesOf(), blockNamed() (+15 more)

### Community 146 - "ProcessContexts"
Cohesion: 0.12
Nodes (4): ProcessContexts, ProcessItems, providesProcessItem(), sealed()

### Community 147 - "validation.test.ts"
Cohesion: 0.11
Nodes (15): Case, ShapeCase, Stats, schemaName(), module(), declared(), contentDeclared(), failures() (+7 more)

### Community 149 - "HeightRun"
Cohesion: 0.10
Nodes (9): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, WaitsInTransaction (+1 more)

### Community 15 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (119): ComputedBlock, CoreLedgerStateOptions, LedgerBinding, retainedStates, NodeSetFault, NodeSetOptions, NodeTableCheck, KeyCounts (+111 more)

### Community 150 - "shims.test.ts"
Cohesion: 0.14
Nodes (10): databaseTarget, Buffer, Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL (+2 more)

### Community 153 - "api-session.test.ts"
Cohesion: 0.14
Nodes (18): HeadersArgument, answerNotServing(), byteLength(), isCoreHeader(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing() (+10 more)

### Community 154 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 155 - "PointName"
Cohesion: 0.10
Nodes (12): PointName, CallbackFailure, Activity, Misuse, SlowBlockCondition, A43Case, EagerItems, EagerLoop (+4 more)

### Community 158 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 16 - "BlockRef"
Cohesion: 0.03
Nodes (58): CoreBlockItems, BlockLedgerSource, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, QueuedBlock, NodeSubscription (+50 more)

### Community 161 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 162 - "module-api.test.ts"
Cohesion: 0.12
Nodes (12): ApiRegistry, ModuleRegistration, bodyOf(), errorOf(), ok(), "on-start-api"(), API_ERROR_STATUS, CORE_BLOCK_FETCH (+4 more)

### Community 169 - "parseJsonLossless"
Cohesion: 0.20
Nodes (9): SubscriptionCarrier, SubscriptionConnection, parseJsonLossless(), errorMessage(), socketConnection(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem (+1 more)

### Community 17 - "process-admin.ts"
Cohesion: 0.03
Nodes (121): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdminOptions, RevisionSettings, DigestRow (+113 more)

### Community 173 - "ApiRoutes"
Cohesion: 0.17
Nodes (12): ModuleApiStart, MountedApiSeams, ApiRoutes, ApiStartup, ModuleApiOptions, AcceptsDuplicates, parsePath(), registerModuleApis() (+4 more)

### Community 175 - "commit-proxy.ts"
Cohesion: 0.16
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 179 - "config/plain-data.test.ts"
Cohesion: 0.14
Nodes (9): PlainDataRule, Row, failures(), refusal(), thrown(), valueOf(), A26, files (+1 more)

### Community 18 - "messages.ts"
Cohesion: 0.03
Nodes (91): Committed, Message, MessageFault, MessageType, Parsed, Read, ReadResult, Report (+83 more)

### Community 180 - "LoopPauses"
Cohesion: 0.18
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 181 - "read-height.property.test.ts"
Cohesion: 0.17
Nodes (11): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+3 more)

### Community 186 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 187 - "HeldHeight"
Cohesion: 0.16
Nodes (10): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence (+2 more)

### Community 188 - "stats-module.ts"
Cohesion: 0.23
Nodes (12): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+4 more)

### Community 19 - "change-capture.ts"
Cohesion: 0.03
Nodes (116): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow (+108 more)

### Community 190 - "version-selection.test.ts"
Cohesion: 0.31
Nodes (13): Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts(), haltOf() (+5 more)

### Community 191 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 193 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 198 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 199 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 2 - "builds.ts"
Cohesion: 0.02
Nodes (178): PrivateIntakeOptions, startHashDecision, PublicWakes, DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, A165Options (+170 more)

### Community 20 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (108): ApplyInput, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+100 more)

### Community 200 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 201 - "postgres-tls-server.ts"
Cohesion: 0.19
Nodes (9): PostgresConnection, TlsPostgres, makeCertificates(), startTlsPostgres(), HBA, 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …), Evidence, Problem (+1 more)

### Community 208 - "Heartbeat"
Cohesion: 0.24
Nodes (7): Heartbeat, HeartbeatOptions, TimerHandle, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 209 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 21 - "UmbraError"
Cohesion: 0.03
Nodes (63): PostgresConnection, PostgresOptions, SslMode, ReadTimeoutSetting, MultiStatementRunner, Job, JobQueue, Outcome (+55 more)

### Community 211 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 212 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 22 - "hex"
Cohesion: 0.04
Nodes (92): Cbor, FreshInstanceRequest, FreshInstanceResult, StoredNode, Reader, GenesisNodes, Disposable, NodeBatch (+84 more)

### Community 221 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 222 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 23 - "in-memory-source.ts"
Cohesion: 0.03
Nodes (74): InMemoryItems, Wait, CloseHelper, NetworkRuleName, Hold, Signal, Job, Run (+66 more)

### Community 239 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 24 - "NodeClient"
Cohesion: 0.05
Nodes (72): CoreChainBinding, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State (+64 more)

### Community 25 - "src/index.ts"
Cohesion: 0.03
Nodes (82): BlockWriteHandle, ReadHandle, SchemaWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+74 more)

### Community 255 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 256 - ".once"
Cohesion: 0.29
Nodes (5): SignalTarget, heldPort(), startChild(), startWorker(), hostEndsByItself()

### Community 26 - "Process"
Cohesion: 0.04
Nodes (40): ProcessAdmin, ConfigFinding, CoreTransport, CoreLink, LifecycleStatus, BlockSource, ProcessReason, ReasonCode (+32 more)

### Community 27 - "start-umbradb.ts"
Cohesion: 0.03
Nodes (100): demoLink, MessagePortLike, PrivateLinkChannel, readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd (+92 more)

### Community 28 - "api.ts"
Cohesion: 0.03
Nodes (78): CommittedHeight, Database, ReadOnlyDatabase, ReadOptions, SchemaPlan, MisuseListener, PublishRefusal, Committed (+70 more)

### Community 29 - "spawnChild"
Cohesion: 0.02
Nodes (90): Served, ParentJob, Kill, Orphaned, SourceFile, Run, Job, WorkerEvent (+82 more)

### Community 3 - "admin-harness.ts"
Cohesion: 0.02
Nodes (200): MountedAdminAnswer, AdminSeams, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer (+192 more)

### Community 30 - "connectWebSocket"
Cohesion: 0.03
Nodes (71): ConnectSocket, DelayedTape, Outage, ReportedTest, RealTape, TapeRefusedError, ScriptedNode, ScriptedRequest (+63 more)

### Community 31 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (57): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes (+49 more)

### Community 315 - "HeightActivity"
Cohesion: 0.60
Nodes (3): HeightActivity, NeverClears, NeverClears

### Community 32 - "browser.test.ts"
Cohesion: 0.04
Nodes (79): BrowserBuild, Reachable, RestoreAttempt, PageApiChannel, PageBackup, pageBench, PageEvent, PageLink (+71 more)

### Community 33 - "runner/process.ts"
Cohesion: 0.04
Nodes (77): Bound, ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ChainIdentity, ConfigRow, ImportedConfig (+69 more)

### Community 34 - "mounted-admin.test.ts"
Cohesion: 0.04
Nodes (78): gate, SecretHashes, SecretVariant, Compared, ConnectSeen, PortPeer, Expected, FactsRunOptions (+70 more)

### Community 35 - "ref_node_fs"
Cohesion: 0.06
Nodes (62): BackupBackend, BackupDatabase, killedRestore, TickerConfig, TickerHandle, WORKER, SignalEvent, cliProject (+54 more)

### Community 36 - "ledger-tapes.ts"
Cohesion: 0.05
Nodes (61): LedgerStateItem, LedgerName, ApplyOutput, ChainOutcome, LedgerTask, ParsedTransaction, StateHandle, StateSummary (+53 more)

### Community 37 - "fetch-fixtures.ts"
Cohesion: 0.05
Nodes (84): Scenario, ArgType, BlockOptions, CallSpec, chainBlock, PalletSpec, RUNTIME, Decoded (+76 more)

### Community 38 - "ProcessHandle"
Cohesion: 0.04
Nodes (74): BackupSeams, BackupTarget, BackupWritten, BackupFacts, ManifestHistoryRow, ManifestTool, PgliteDump, SnapshotSeams (+66 more)

### Community 39 - "adapter.ts"
Cohesion: 0.04
Nodes (70): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+62 more)

### Community 4 - "migrate.ts"
Cohesion: 0.02
Nodes (173): Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, CheckedMigration, Difference (+165 more)

### Community 40 - "declaration.ts"
Cohesion: 0.04
Nodes (66): KnownPointsOnly, TableDeclaration, DeclarationRule, PlacedDeclaration, Plain, Validator, privateBackbone(), moduleEntryBuilder() (+58 more)

### Community 41 - "cli/command.ts"
Cohesion: 0.04
Nodes (66): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, CommandResult, RunningCommand, statsConfig, backupArguments() (+58 more)

### Community 42 - "cbor.ts"
Cohesion: 0.05
Nodes (76): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+68 more)

### Community 44 - "vitest"
Cohesion: 0.03
Nodes (54): Lockfile, Manifest, RepositoryFile, Upstream, gateAdapters(), tallyMutants(), partsOf(), canPin() (+46 more)

### Community 46 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (75): BlockHeaderItem, BlockEventSource, BodyExtrinsic, BlockBody, CoreBlockHeader, MetadataVariant, RuntimeMetadataView, BlockParsedOptions (+67 more)

### Community 47 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (68): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+60 more)

### Community 48 - "range.ts"
Cohesion: 0.04
Nodes (66): Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, TapeBuilder, Arguments, Command, TapeCommandIo (+58 more)

### Community 49 - "FinalizedLoop"
Cohesion: 0.05
Nodes (19): FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, SkipsLockstep, WaitingInRead, ItemsAfterWrite, SilentHalt (+11 more)

### Community 5 - "core-transport.ts"
Cohesion: 0.02
Nodes (128): PrivateLinkAddress, PrivateLinkConnect, PublicConfiguration, PublicSide, PublicSideOptions, EndpointOptions, Envelope, LinkTimers (+120 more)

### Community 50 - "ledger/types.ts"
Cohesion: 0.05
Nodes (56): LoadLedger, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerPackageOptions, V9Logs (+48 more)

### Community 51 - "refcount-model.ts"
Cohesion: 0.05
Nodes (55): Node, BlockKind, BlockScript, BoundaryRewrite, Dice, DrivenBlock, GeneratedBlock, GeneratedState (+47 more)

### Community 52 - "pause-fixtures.ts"
Cohesion: 0.05
Nodes (62): BackupOnSignal, LoopClass, Pausable, PausableConfig, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop (+54 more)

### Community 54 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (68): TransactionHistoryStorage, PgTransactionHistoryStorage, Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import (+60 more)

### Community 55 - "LedgerPackage"
Cohesion: 0.04
Nodes (52): RetainedState, LedgerEventKind, LedgerPackage, LedgerTaskBlock, EvictionRefused, Driver, StagenetFixtureJson, workerParser() (+44 more)

### Community 56 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (66): CoreContractStatesOptions, ContractStateRow, Manifest, Restored, DefinedModule, contractScenario, ContractScenarioOptions, DeployTx (+58 more)

### Community 57 - ".value"
Cohesion: 0.08
Nodes (46): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef (+38 more)

### Community 59 - "refcount-restart.ts"
Cohesion: 0.05
Nodes (55): BatchJson, ContentsHash, databaseNow, Hold, Light, Line, NodeSetKeeper, observedRun (+47 more)

### Community 6 - "tape/index.ts"
Cohesion: 0.03
Nodes (127): Recorded, Failure, Variant, Link, TapeBuilderOptions, RecordingError, RecordingProblem, TapeError (+119 more)

### Community 60 - "backup/restore.ts"
Cohesion: 0.06
Nodes (51): ConfiguredDatabase, ConfiguredDatabaseOptions, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, RestoreTarget (+43 more)

### Community 61 - "ledger-storage.test.ts"
Cohesion: 0.07
Nodes (59): retentionSeen, ledgerScenario, RestorableBackup, heightsIn(), a106Problems(), a107Problems(), a99Problems(), blockZeroProblems() (+51 more)

### Community 62 - "core-block-commit.test.ts"
Cohesion: 0.05
Nodes (48): BlockRow, StandInOptions, Commit, blockHeaderOf(), checkParent(), commitBlock(), hex(), sameBytes() (+40 more)

### Community 63 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (41): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus, TransactionHistoryWriter (+33 more)

### Community 64 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (50): LoopInput, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+42 more)

### Community 65 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.06
Nodes (44): CallArgsItem, CallArguments, V9Raw, bindLedgerTasks(), boundHost(), frozen(), hasLedgerTasks(), resultsOf() (+36 more)

### Community 68 - "chain-data.test.ts"
Cohesion: 0.07
Nodes (49): BlockParsed, itemsSeen, BlockSpec, EventSpec, Json, transactionSpec, Phase, browserChain (+41 more)

### Community 69 - "chain-events-decode.test.ts"
Cohesion: 0.09
Nodes (42): eventsRuntime, Field, PalletMetadata, Registry, RuntimeShape, StorageSpec, LedgerScenarioOptions, fill() (+34 more)

### Community 7 - "client.test.ts"
Cohesion: 0.02
Nodes (90): NodeSocketEvents, HandSocket, HandSockets, Answer, FakeNode, Handler, Received, recorded (+82 more)

### Community 71 - "test/postgres/setup.ts"
Cohesion: 0.06
Nodes (38): Key, Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, Sql, SuiteWatchdogTimeoutError (+30 more)

### Community 72 - "order.property.test.ts"
Cohesion: 0.06
Nodes (46): BlockHeader, PointArguments, CallEvent, Recorder, CheckName, GraphSpec, ModuleSpec, TESTED (+38 more)

### Community 73 - "restore-private.ts"
Cohesion: 0.08
Nodes (42): ManifestMigration, RestoreOutcome, FoldedPart, RecordedMigration, FileProcess, privateBackup, PrivateConfig, PublicSetting (+34 more)

### Community 74 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 75 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 76 - "containers.test.ts"
Cohesion: 0.06
Nodes (36): BenchEnv, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer() (+28 more)

### Community 77 - "refcount-conversion.ts"
Cohesion: 0.09
Nodes (39): FixtureConfig, ContractRow, Released, Readable, Reader, TableNode, classificationProblems(), unreferencedRows() (+31 more)

### Community 78 - "ledger-refcount-backup.test.ts"
Cohesion: 0.06
Nodes (41): contentsHash, FileEntries, DigestRow, DigestRows, Reader, ReadableDatabase, bytesOf(), sweepCore() (+33 more)

### Community 8 - "process-backends.ts"
Cohesion: 0.03
Nodes (148): NodeBatch, FixtureRun, SourceClass, Reader, Seen, TableSnapshot, Touches, Fault (+140 more)

### Community 80 - "lockstep-refusals.test.ts"
Cohesion: 0.08
Nodes (29): InstanceView, PrivateInstance, Entry, Lockstep, LockstepCondition, LockstepInstance, LockstepOptions, LockstepRefusal (+21 more)

### Community 81 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 82 - "api-socket.ts"
Cohesion: 0.11
Nodes (41): coreHeaders, NodeHttpHandler, NodeUpgradeHandler, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits (+33 more)

### Community 83 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (31): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+23 more)

### Community 84 - "checkShape"
Cohesion: 0.08
Nodes (36): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+28 more)

### Community 85 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 87 - "example-checks.ts"
Cohesion: 0.09
Nodes (30): TypeCheckFinding, TypeCheckResult, Finding, BlockImport, ChildResult, CodeBlock, installedProject, configCompilerOptions() (+22 more)

### Community 89 - "version-checks.ts"
Cohesion: 0.10
Nodes (27): MetadataBlock, MetadataNode, RuntimeMetadataEntry, OwnStateMetadata, Boundary, CallRecord, CountingNode, MetadataSelector (+19 more)

### Community 9 - "validate.ts"
Cohesion: 0.02
Nodes (170): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput (+162 more)

### Community 90 - "browser/build.ts"
Cohesion: 0.07
Nodes (29): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+21 more)

### Community 91 - "module-api.ts"
Cohesion: 0.08
Nodes (26): ChainDataAnswer, ApiError, ApiErrorCode, ApiRequest, ApiResponse, HttpHandler, HttpMethod, HttpRoute (+18 more)

### Community 92 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (26): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+18 more)

### Community 94 - "childRefKeys"
Cohesion: 0.09
Nodes (19): nodeKeys, ChildReader, ChildVisitor, ModelBatch, ModelSnapshot, SweepModel, SweepComparison, hashNode() (+11 more)

### Community 96 - "ingest-faults.test.ts"
Cohesion: 0.07
Nodes (27): NodeCallOptions, ProcessCondition, RecordingClient, A84Observation, LoggedRetry, OutageObservation, RetrySample, isBlockEventSource() (+19 more)

### Community 98 - "TransactionHistoryEntry"
Cohesion: 0.09
Nodes (14): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), 4. Wiring `PgTemporalKV`'s `opts.tx` (+6 more)

### Community 157 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (15): blake2b256(), compress(), rotateRight(), words(), encodeHeader(), concatBytes(), encodeCompact(), IV (+7 more)

### Community 185 - "7. Storage helpers"
Cohesion: 0.12
Nodes (13): The node on `/status`, 7. Storage helpers, Requirement: AE-5 `/status` and `/config` contents, Scenario: Before the first block, MODIFIED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents (+5 more)

### Community 204 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 67 - "data"
Cohesion: 0.04
Nodes (53): params(), n(), data(), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not), Rework (class 3 continued — cross-vendor cold audit, rounds 2-4), Rework (class 3 — cross-vendor audit caught real correctness defects post-self-verify) (+45 more)

### Community 102 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 113 - "migrations"
Cohesion: 0.06
Nodes (31): side(), migrations(), 1. Overview, 2.4 Serving it, Appendix A. Reference, ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading (+23 more)

### Community 148 - "transportReader"
Cohesion: 0.09
Nodes (21): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Problem, Suggested fix, Impact, Non-goals (what this change does NOT cover), Proposal — START-UMBRADB: UmbraDB as a library (`start-umbradb`) (+13 more)

### Community 156 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 159 - "refused"
Cohesion: 0.15
Nodes (18): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, Requirement: AE-3 States and conditions, Scenario: A fault of the build's declarations ends the process, Scenario: A paused loop (+10 more)

### Community 164 - "reason"
Cohesion: 0.11
Nodes (17): reason(), 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it, Evidence, Problem, Suggested fix, 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test (+9 more)

### Community 172 - "local-preprod-sync.mjs"
Cohesion: 0.21
Nodes (17): commitOf(), configText(), docker(), dockerHas(), dockerLater(), imageDigests(), main(), nodeRpc() (+9 more)

### Community 182 - "5.2 The network plan"
Cohesion: 0.13
Nodes (13): transportReaderRule(), Evidence, 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 5.1 The option, 5.2 The network plan (+5 more)

### Community 183 - "connectChannel"
Cohesion: 0.22
Nodes (11): discard(), isChannel(), connectChannel(), 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard, Evidence, Problem, Suggested fix, 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once (+3 more)

### Community 184 - ".disconnect"
Cohesion: 0.15
Nodes (14): fault(), Suggested fix, 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants (+6 more)

### Community 192 - "following"
Cohesion: 0.16
Nodes (13): cursorRead(), following(), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Rework (class 4), 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began, Evidence, Problem, Suggested fix (+5 more)

### Community 197 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 202 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.15
Nodes (12): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+4 more)

### Community 207 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 232 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 234 - "2. Points"
Cohesion: 0.22
Nodes (6): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix, 2. Points

### Community 247 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 277 - "rowProblems"
Cohesion: 0.60
Nodes (6): a114Problems(), a116Problems(), heights(), readProblems(), rowProblems(), writes()

### Community 328 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 43 - ".put"
Cohesion: 0.03
Nodes (82): coreTxResultsOnParse(), T(), input(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix (+74 more)

### Community 45 - "startUmbraDB"
Cohesion: 0.03
Nodes (75): startUmbraDB(), log(), ownKeys(), 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented, Evidence, Problem, Suggested fix, 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module (+67 more)

### Community 53 - "version"
Cohesion: 0.03
Nodes (78): deferred(), version(), Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Full-sync soak + load-under-prune (G10), Lease non-wedge cold start (G9 / T3) (+70 more)

### Community 58 - "history"
Cohesion: 0.04
Nodes (66): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+58 more)

### Community 66 - "code"
Cohesion: 0.04
Nodes (55): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+47 more)

### Community 70 - ".off"
Cohesion: 0.04
Nodes (49): Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25) (+41 more)

### Community 79 - ".from"
Cohesion: 0.04
Nodes (44): hex(), hex(), hex(), fileRows(), rootCountDigests(), hex(), hex(), hex() (+36 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning, Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune (+30 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+26 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 124 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 127 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (28): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+20 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 143 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 151 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 152 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 160 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+12 more)

### Community 163 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.11
Nodes (18): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7), Rework (class 1 — infra) (+10 more)

### Community 165 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 168 - "README.md"
Cohesion: 0.15
Nodes (9): Choosing a database, Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes (+1 more)

### Community 170 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 171 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 174 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 176 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.12
Nodes (11): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+3 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 178 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 189 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 194 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 195 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 196 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 203 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 205 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 206 - "ADDED Requirements"
Cohesion: 0.15
Nodes (13): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+5 more)

### Community 210 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 214 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 215 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 216 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 217 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 218 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 219 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 220 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 223 - "[0.10.0] - 2026-10-27"
Cohesion: 0.20
Nodes (9): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changed since `v0.10.0-rc.2`: ledger nodes reclaimed by reference counting (`ledger-refcount`), Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface) (+1 more)

### Community 224 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 225 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 226 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure, Design — Sprint 2: Transaction/Lease (+1 more)

### Community 227 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 228 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 229 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 230 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 233 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 235 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 236 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 237 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 238 - "Proposal — V9-UPGRADE-METADATA: decode a block with the runtime that built it, across node 2.1's runtime upgrades (`v9-upgrade-metadata`)"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal — V9-UPGRADE-METADATA: decode a block with the runtime that built it, across node 2.1's runtime upgrades (`v9-upgrade-metadata`), What Changes, Why

### Community 240 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 241 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 242 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 243 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 244 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 245 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 246 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 248 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 249 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 250 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 251 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 252 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 253 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 254 - "Requirement: LG-4 Block content is decoded with the runtime that built it"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: LG-4 Block content is decoded with the runtime that built it, Scenario: An enactment block of the earlier form, Scenario: No runtime matches, Scenario: The first block of node 2.1's upgrade, Spec delta — `ledger` capability

### Community 259 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 260 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 261 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 262 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.33
Nodes (5): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Problem, Resolution, Suggested fix

### Community 263 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 264 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 265 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 266 - "The scan action cannot exclude a single opengrep rule"
Cohesion: 0.33
Nodes (5): Current workaround, Evidence, Problem, Suggested fix, The scan action cannot exclude a single opengrep rule

### Community 267 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 268 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 269 - "Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`), What changes, Why

### Community 270 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 271 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 272 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 273 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 274 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 275 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 276 - "After 0.10.0"
Cohesion: 0.33
Nodes (6): After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Release gates still to run

### Community 278 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 279 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 280 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 281 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 282 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 283 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 284 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 285 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 286 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 287 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 288 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 289 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 290 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 291 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 292 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 293 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 294 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 295 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 296 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 297 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 298 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 299 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 300 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 301 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 302 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 303 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 304 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 305 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 306 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 307 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 308 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 309 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 310 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 311 - "00084 — The contents hash's key-ordered read splices its page size into `LIMIT`"
Cohesion: 0.40
Nodes (4): 00084 — The contents hash's key-ordered read splices its page size into `LIMIT`, Evidence, Problem, Suggested fix

### Community 312 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 313 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 314 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 316 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 317 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 318 - "00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes"
Cohesion: 0.50
Nodes (3): 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes, Evidence, Suggested fix

### Community 319 - "00083 — Four timing-bound tests fail when the machine runs several test lanes at once"
Cohesion: 0.50
Nodes (3): 00083 — Four timing-bound tests fail when the machine runs several test lanes at once, Problem, Suggested fix

### Community 320 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 321 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 322 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 323 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 324 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 325 - "Acceptance — V9-UPGRADE-METADATA: decode a block with the runtime that built it, across node 2.1's runtime upgrades"
Cohesion: 0.50
Nodes (3): Acceptance — V9-UPGRADE-METADATA: decode a block with the runtime that built it, across node 2.1's runtime upgrades, Criteria, Definition of done

### Community 326 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 86 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 95 - "package.json"
Cohesion: 0.05
Nodes (39): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+31 more)

### Community 97 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+30 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `RFC-3339` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4409 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `InMemoryBlockSource`, `column-rules.ts`, `builds.ts`, `admin-harness.ts`, `migrate.ts`, `core-transport.ts`, `tape/index.ts`, `client.test.ts`, `process-backends.ts`, `validate.ts`, `loop.ts`, `config/history.ts`, `src/db/postgres.ts`, `ModuleDeclaration`, `host.ts`, `core-ledger-state.ts`, `BlockRef`, `process-admin.ts`, `messages.ts`, `change-capture.ts`, `adapter-fixtures.ts`, `UmbraError`, `hex`, `in-memory-source.ts`, `NodeClient`, `src/index.ts`, `Process`, `start-umbradb.ts`, `api.ts`, `spawnChild`, `connectWebSocket`, `core-private-source.test.ts`, `browser.test.ts`, `runner/process.ts`, `mounted-admin.test.ts`, `ref_node_fs`, `fetch-fixtures.ts`, `ProcessHandle`, `adapter.ts`, `declaration.ts`, `cli/command.ts`, `cbor.ts`, `core-block-parsed.ts`, `contract-modules.test.ts`, `ledger/types.ts`, `refcount-model.ts`, `pause-fixtures.ts`, `contract-data-checks.ts`, `refcount-restart.ts`, `ledger-storage.test.ts`, `core-block-commit.test.ts`, `interfaces/transaction-history-storage.ts`, `slow-block-harness.ts`, `ledger/ledger-tasks.test.ts`, `chain-data.test.ts`, `chain-events-decode.test.ts`, `test/postgres/setup.ts`, `order.property.test.ts`, `restore-private.ts`, `boundary.test.ts`, `containers.test.ts`, `refcount-conversion.ts`, `ledger-refcount-backup.test.ts`, `lockstep-refusals.test.ts`, `retirement.test.ts`, `file-mode.test.ts`, `example-checks.ts`, `version-checks.ts`, `browser/build.ts`, `cold-boot-recovery.integration.test.ts`, `package.json`, `ingest-faults.test.ts`, `worker-storage.test.ts`, `BACKENDS`, `networks.ts`, `dispatch.test.ts`, `release-version.ts`, `core.ts`, `pglite-lock.ts`, `resolver-boundary.ts`, `ref_node_events`, `worker-host.test.ts`, `node-set.test.ts`, `api-server.test.ts`, `code-registry.ts`, `documents.ts`, `pg-tx-history-adapter.ts`, `read-gate.ts`, `threat-model.test.ts`, `crash.test.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `surface.test.ts`, `ws-mutual-tls.test.ts`, `validation.test.ts`, `shims.test.ts`, `api-session.test.ts`, `library-documents.test.ts`, `block-fetch-decode.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `module-api.test.ts`, `excluded-not-exported.test.ts`, `config/plain-data.test.ts`, `LoopPauses`, `read-height.property.test.ts`, `statementsOf`, `version-selection.test.ts`, `web-lock.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `Heartbeat`, `history.property.test.ts`, `ledger/plain-data.ts`, `core-block-fetch.test.ts`?**
  _High betweenness centrality (0.210) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InMemoryBlockSource` be split into smaller, more focused modules?**
  _Cohesion score 0.014695467422096316 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `InMemoryBlockSource`, `column-rules.ts`, `builds.ts`, `admin-harness.ts`, `migrate.ts`, `core-transport.ts`, `tape/index.ts`, `client.test.ts`, `process-backends.ts`, `validate.ts`, `loop.ts`, `config/history.ts`, `src/db/postgres.ts`, `ModuleDeclaration`, `core-ledger-state.ts`, `BlockRef`, `process-admin.ts`, `version-table.ts`, `ProcessContexts`, `messages.ts`, `change-capture.ts`, `shims.test.ts`, `in-memory-source.ts`, `NodeClient`, `src/index.ts`, `Process`, `start-umbradb.ts`, `api.ts`, `transportReader`, `connectWebSocket`, `core-private-source.test.ts`, `runner/process.ts`, `mounted-admin.test.ts`, `ref_node_fs`, `module-api.test.ts`, `ProcessHandle`, `declaration.ts`, `cbor.ts`, `vitest`, `ApiRoutes`, `startUmbraDB`, `contract-modules.test.ts`, `range.ts`, `FinalizedLoop`, `ledger/types.ts`, `refcount-model.ts`, `pause-fixtures.ts`, `config/plain-data.test.ts`, `LedgerPackage`, `statementsOf`, `backup/restore.ts`, `core-block-commit.test.ts`, `slow-block-harness.ts`, `web-lock.ts`, `ledger/ledger-tasks.test.ts`, `browser/src/config/load.ts`, `restore-private.ts`, `graph.ts`, `lockstep-refusals.test.ts`, `checkShape`, `version-checks.ts`, `module-api.ts`, `ingest-faults.test.ts`, `validation.test.ts`, `BACKENDS`, `2. Points`, `pglite-lock.ts`, `ref_node_events`, `api-server.test.ts`, `mapping.ts`, `RuntimeMetadata`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `column-rules.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017988367144275784 - nodes in this community are weakly interconnected._