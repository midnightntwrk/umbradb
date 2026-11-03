# Graph Report - UmbraDB

## Corpus Check
- 1221 files · ~1,747,418 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12793 nodes · 39303 edges · 374 communities (340 shown, 34 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3340 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `06b327f4981bf0d4` (1221 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- UmbraError
- InMemoryBlockSource
- ModuleDeclaration
- child-processes.test.ts
- code-registry.ts
- resolver-boundary.ts
- file-modes.ts
- .name
- options.ts
- src/ledger/identity.ts
- graph.ts
- node-fields-harness.ts
- documents.ts
- interfaces/transaction-history-storage.ts
- postgres/transaction-history-storage.ts
- ledger/types.ts
- block-fetch-decode.test.ts
- manifest.ts
- config/plain-data.ts
- Lockstep
- read-gate.ts
- test/postgres/setup.ts
- fixtures/configuration.ts
- example-checks.ts
- following
- messages.ts
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- digest.test.ts
- height-versioned.property.test.ts
- api-socket.ts
- browser.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- FinalizedLoop
- node-bridge.ts
- surface.test.ts
- crash.test.ts
- shims.test.ts
- src/db/postgres.ts
- configuration-refusal.test.ts
- refused-configuration.test.ts
- referenceMergeEntries
- pack-install.mjs
- src/config/load.ts
- harness.ts
- fetch-fixtures.ts
- library-documents.test.ts
- pglite-timeouts.test.ts
- browser-harness.ts
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- durability-probe.test.ts
- recovery.test.ts
- builds.ts
- LoopPauses
- version-table.ts
- config/history.ts
- commit-proxy.ts
- ws-mutual-tls.test.ts
- validation.test.ts
- chrome.ts
- loop.test.ts
- read-height.property.test.ts
- api-answers.ts
- statementsOf
- RuntimeMetadata
- apiErrorResponse
- process-build.ts
- tape/index.ts
- SubscriptionConnection
- core.ts
- web-lock.ts
- catalog.ts
- startModuleApi
- messagePortChannel
- binding.test.ts
- browser/serve.ts
- browser/src/config/load.ts
- worker-threads.test.ts
- PrivateLinkChannel
- Heartbeat
- history.property.test.ts
- .from
- worker-threads-worker.ts
- buffer.ts
- midnight-env — reproducible PREPROD dev environment
- .send
- TapeAnswers
- process-admin.ts
- Worker
- entries.ts
- postgres-image.test.ts
- api-server.test.ts
- ProcessItems
- serve-checks.ts
- time-values.test.ts
- ledger-state.test.ts
- NodeClient
- mutation-evidence.d.mts
- AsyncLocalStorage
- BlockRef
- client.test.ts
- typed-config.test.ts
- admin-harness.ts
- declaration.ts
- LedgerPackage
- runtime-metadata.test.ts
- channel-queue.test.ts
- listenerProblems
- adapter.ts
- PageApiChannel
- NodeFS
- runner/process.ts
- resolve.ts
- Process
- ledger-storage-checks.ts
- core-private-source.ts
- vitest
- ledger/ledger-tasks.test.ts
- range.ts
- config-check.ts
- builder.test.ts
- containers.test.ts
- transport-faults.test.ts
- transform-checks.ts
- openPostgres
- writer-lock-checks.ts
- opt-out.test.ts
- loop-stop-harness.ts
- boundary.test.ts
- cursor-table.test.ts
- column-rules.test.ts
- node.test.ts
- cbor.ts
- pglite.ts
- column-rules.ts
- core-ledger-state.ts
- validation.ts
- core-private-source.test.ts
- private/lockstep-wait.test.ts
- slow-block-cases.test.ts
- validate.ts
- core-block-commit.test.ts
- backup/backup.ts
- PgTransactionHistoryStorage
- retirement.test.ts
- refcount-model.ts
- backup/restore.ts
- mapping.ts
- .value
- checkShape
- chain-data.negative-control.test.ts
- version-checks.ts
- pglite-lock.ts
- networks.ts
- adapter-fixtures.ts
- page.ts
- ChannelEndpoint
- pg-tx-history-adapter.ts
- browser/build.ts
- TransactionHistoryEntry
- core-block-parsed.ts
- core-chain-events.ts
- cbor.property.test.ts
- release-version.ts
- process-worker.ts
- redact.ts
- paused-harness.ts
- Proposal — Sprint 3: CheckpointStore
- Problem
- refused
- ADDED Requirements
- .off
- .slowBlockMs
- backupAtStop
- cold-boot-recovery.integration.test.ts
- code
- transportReader
- T
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- .cwd
- Boundaries, threats and controls
- Design — v1.0.0 API Surface & Release Contract
- Design — START-UMBRADB: UmbraDB as a library
- .source
- ADDED Requirements
- integer
- core-block-fetch.test.ts
- log
- .disconnect
- conformance-gate.mjs
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- browser.negative-control.test.ts
- Tasks — START-UMBRADB: UmbraDB as a library
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- scoped-review-manifest
- api-session.test.ts
- height-partitions.ts
- path.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- orphan-watcher.mjs
- fresh-instance.mjs
- crash-worker.ts
- history
- .put
- data
- table
- graph.py
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
- README.md
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- Requirement: DT-3 The contents hash
- Design — Sprint 4: Watermarks
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- [0.10.0] - 2026-10-27
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- The database
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0 API Surface & Release Contract
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
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
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
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 420 edges
2. `UmbraError` - 347 edges
3. `ModuleDeclaration` - 197 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `startUmbraDB()` - 103 edges
9. `Database` - 101 edges
10. `ReadHandle` - 92 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (374 total, 34 thin omitted)

### Community 0 - "UmbraError"
Cohesion: 0.02
Nodes (226): PostgresConnection, PostgresOptions, CommittedHeight, Database, ReadOptions, Transaction, ReadTimeoutSetting, AppliedRow (+218 more)

### Community 1 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (221): AdminSeams, DatabaseParts, PostgresParts, PostgresPartsInput, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd (+213 more)

### Community 10 - "ModuleDeclaration"
Cohesion: 0.03
Nodes (103): AppliedMigration, MigrationPart, SchemaPlan, ModuleDeclaration, ProcessContext, Revision, EntryRange, ResolvedGraph (+95 more)

### Community 100 - "child-processes.test.ts"
Cohesion: 0.07
Nodes (29): ParentJob, Kill, Orphaned, SourceFile, guardPid(), alive(), bystander(), childrenOf() (+21 more)

### Community 101 - "code-registry.ts"
Cohesion: 0.10
Nodes (31): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+23 more)

### Community 102 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 103 - "file-modes.ts"
Cohesion: 0.09
Nodes (25): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+17 more)

### Community 104 - ".name"
Cohesion: 0.07
Nodes (23): Fetching, Recorder, Key, Upstream, Sql, filesUnder(), patchesOf(), patchText() (+15 more)

### Community 106 - "options.ts"
Cohesion: 0.13
Nodes (30): Finding, readOptions, named(), addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding() (+22 more)

### Community 107 - "src/ledger/identity.ts"
Cohesion: 0.12
Nodes (27): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages() (+19 more)

### Community 11 - "graph.ts"
Cohesion: 0.03
Nodes (143): ErrorCode, Edge, GraphFacts, GraphInput, GraphPart, GraphRule, HeightRange, MidChain (+135 more)

### Community 115 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (24): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Run() (+16 more)

### Community 116 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 117 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (22): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+14 more)

### Community 118 - "postgres/transaction-history-storage.ts"
Cohesion: 0.10
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+11 more)

### Community 12 - "ledger/types.ts"
Cohesion: 0.03
Nodes (103): LoadLedger, LedgerName, Path, ChainOutcome, LedgerPackageOptions, LedgerTask, LedgerTaskBlock, ParsedTransaction (+95 more)

### Community 121 - "block-fetch-decode.test.ts"
Cohesion: 0.11
Nodes (24): ExtrinsicCall, MetadataPallet, PalletSpec, blake2b256(), compress(), rotateRight(), words(), blockTimeOf() (+16 more)

### Community 122 - "manifest.ts"
Cohesion: 0.11
Nodes (25): ManifestHistoryRow, ManifestMigration, ManifestTool, FoldedPart, RecordedMigration, isObject(), readManifestLine(), earlierBackup() (+17 more)

### Community 123 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 124 - "Lockstep"
Cohesion: 0.11
Nodes (11): InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal, byId() (+3 more)

### Community 125 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 126 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 127 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (21): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+13 more)

### Community 128 - "example-checks.ts"
Cohesion: 0.15
Nodes (20): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+12 more)

### Community 129 - "following"
Cohesion: 0.08
Nodes (26): AlwaysLanded, cursorRead(), following(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+18 more)

### Community 13 - "messages.ts"
Cohesion: 0.02
Nodes (102): EndpointOptions, Envelope, LinkTimers, MessagePortLike, CoreChannelSeams, CoreChannelsOptions, Queued, Connected (+94 more)

### Community 130 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.08
Nodes (21): ReadPool, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider) (+13 more)

### Community 131 - "digest.test.ts"
Cohesion: 0.10
Nodes (26): ChangeKind, tableChanges, TouchedRow, changeOf(), concat(), sameBytes(), hex(), sha256() (+18 more)

### Community 132 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 133 - "api-socket.ts"
Cohesion: 0.16
Nodes (24): coreHeaders, MountedApiSeams, ChannelConnectOptions, ModuleApiLimits, ServedConnection, ModuleApiHandlerOptions, ModuleApiServerOptions, parseAddress() (+16 more)

### Community 134 - "browser.test.ts"
Cohesion: 0.10
Nodes (26): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, PageRequest, continuedProblems() (+18 more)

### Community 135 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 136 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 137 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 14 - "FinalizedLoop"
Cohesion: 0.03
Nodes (63): ResolvedRange, EntryBoundary, PointRun, PointSchedule, Activity, FinalizedLoop, HeightActivity, HeightRun (+55 more)

### Community 141 - "node-bridge.ts"
Cohesion: 0.12
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 142 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 143 - "crash.test.ts"
Cohesion: 0.13
Nodes (21): CrashCall, CrashEvent, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule(), hex() (+13 more)

### Community 144 - "shims.test.ts"
Cohesion: 0.12
Nodes (11): Buffer, Hash, sha256, hex(), instantiateLedger(), createHash(), probe(), INITIAL (+3 more)

### Community 146 - "src/db/postgres.ts"
Cohesion: 0.11
Nodes (14): BoundedRead, DriverError, Outcome, Role, SchemaChanges, Session, queryTimeout(), statementRefused() (+6 more)

### Community 149 - "configuration-refusal.test.ts"
Cohesion: 0.15
Nodes (19): ConfigFinding, findingText(), refusalFindings(), configurationFindings(), configurationRefusalLines(), isConfigurationRefusal(), messageOf(), redactedFindings() (+11 more)

### Community 15 - "refused-configuration.test.ts"
Cohesion: 0.03
Nodes (112): CommandHandler, CommandIo, MainProcess, EngineConfig, Refusal, Start, IgnoredJob, CommandResult (+104 more)

### Community 151 - "referenceMergeEntries"
Cohesion: 0.11
Nodes (19): MergeEntriesFn, isPlainObject(), mergeSections(), referenceMergeEntries(), 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 3.1 Field mapping (write path) (+11 more)

### Community 152 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 156 - "src/config/load.ts"
Cohesion: 0.14
Nodes (17): ImportedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), invalid(), isFile() (+9 more)

### Community 157 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 16 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (111): NodeCallOptions, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded (+103 more)

### Community 160 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 161 - "pglite-timeouts.test.ts"
Cohesion: 0.13
Nodes (13): Run, Job, WorkerEvent, expectNeverCutOffNorHung(), settings(), apiRead(), engine(), report() (+5 more)

### Community 162 - "browser-harness.ts"
Cohesion: 0.21
Nodes (19): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+11 more)

### Community 163 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 166 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (15): EntryContent, Command, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS, goodLeaf (+7 more)

### Community 168 - "durability-probe.test.ts"
Cohesion: 0.21
Nodes (16): DurabilityProbeOptions, DurabilityViolation, ProbeSession, Row, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit() (+8 more)

### Community 169 - "recovery.test.ts"
Cohesion: 0.18
Nodes (15): CommitOutcome, HeldHeight, AlwaysLost, DropsHeld, Fault, committedProblems(), count(), landedProblems() (+7 more)

### Community 17 - "builds.ts"
Cohesion: 0.03
Nodes (79): PglitePathParts, Keeping, PrivateBackend, SessionSeen, TestDatabase, PrivateProcess, PrivateRefusal, PrivateSeen (+71 more)

### Community 170 - "LoopPauses"
Cohesion: 0.15
Nodes (7): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, PauseBy, PausedCondition, watched()

### Community 177 - "version-table.ts"
Cohesion: 0.21
Nodes (18): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+10 more)

### Community 18 - "config/history.ts"
Cohesion: 0.03
Nodes (116): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreSettings, versionEntry, HistoryCode, HistoryContext, HistoryFinding (+108 more)

### Community 182 - "commit-proxy.ts"
Cohesion: 0.16
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 184 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (12): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+4 more)

### Community 188 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 189 - "chrome.ts"
Cohesion: 0.22
Nodes (10): Cdp, CdpEvent, ChromeBrowser, Download, chromePath(), exitsWithin(), launchChrome(), reject() (+2 more)

### Community 19 - "loop.test.ts"
Cohesion: 0.03
Nodes (90): ReadOnlyDatabase, PointName, BlockItems, LateUse, CallbackFailure, ReasonCode, Unwrapped, HeightFailure (+82 more)

### Community 190 - "read-height.property.test.ts"
Cohesion: 0.17
Nodes (11): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+3 more)

### Community 193 - "api-answers.ts"
Cohesion: 0.20
Nodes (13): HeadersArgument, answerNotServing(), byteLength(), isCoreHeader(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing() (+5 more)

### Community 194 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 195 - "RuntimeMetadata"
Cohesion: 0.17
Nodes (5): MetadataNode, RuntimeMetadata, OwnStateMetadata, contentStateOf(), hexOf()

### Community 196 - "apiErrorResponse"
Cohesion: 0.15
Nodes (13): ApiResponse, Leaking, answerRequest(), bodyTooLarge(), fetchBody(), utf8Text(), readBody(), serve() (+5 more)

### Community 2 - "process-build.ts"
Cohesion: 0.02
Nodes (202): Manifest, Restored, NodeClientOptions, EngineBuild, EngineNetwork, ProcessCondition, ProcessingEnd, ProcessStatus (+194 more)

### Community 20 - "tape/index.ts"
Cohesion: 0.04
Nodes (72): Link, TapeBuilder, TapeBuilderOptions, RecordingError, RecordingProblem, TapeProblem, TransformProblem, readRequest (+64 more)

### Community 201 - "SubscriptionConnection"
Cohesion: 0.26
Nodes (6): SubscriptionCarrier, SubscriptionConnection, errorMessage(), socketConnection(), encodeJson(), hex()

### Community 202 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 203 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 206 - "catalog.ts"
Cohesion: 0.18
Nodes (13): CatalogColumn, CatalogOptions, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference, defaultCatalog() (+5 more)

### Community 207 - "startModuleApi"
Cohesion: 0.18
Nodes (9): NodeHttpHandler, NodeUpgradeHandler, StartedModuleApi, connectionRules, FetchHandler, moduleApiHandlers, ModuleApiServer, Mountable (+1 more)

### Community 209 - "messagePortChannel"
Cohesion: 0.22
Nodes (8): ConnectSeen, PortPeer, messagePortChannel(), found(), connected(), ownKeys(), Rework (class 4), 10. Review (AGENTS.md stage 4, bounded)

### Community 21 - "binding.test.ts"
Cohesion: 0.04
Nodes (104): PrivateIntakeOptions, LockstepCondition, A165Options, a165Run, Attempt, A113Observation, A156Observation, Binding (+96 more)

### Community 210 - "browser/serve.ts"
Cohesion: 0.22
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 211 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 212 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 213 - "PrivateLinkChannel"
Cohesion: 0.21
Nodes (9): PrivateLinkChannel, Link, exceedsUtf8(), connectChannel(), 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once, Evidence, Problem, Suggested fix (+1 more)

### Community 217 - "Heartbeat"
Cohesion: 0.24
Nodes (7): Heartbeat, HeartbeatOptions, TimerHandle, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 219 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 22 - ".from"
Cohesion: 0.04
Nodes (112): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, Child, extendedCases, FixtureDag (+104 more)

### Community 221 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 222 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 225 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.18
Nodes (9): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS) (+1 more)

### Community 229 - "TapeAnswers"
Cohesion: 0.32
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 23 - "process-admin.ts"
Cohesion: 0.04
Nodes (102): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions (+94 more)

### Community 24 - "entries.ts"
Cohesion: 0.02
Nodes (104): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, CoreEntryInput, CoreSettingsBase, Entry (+96 more)

### Community 248 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 25 - "api-server.test.ts"
Cohesion: 0.03
Nodes (85): ModuleApiStart, ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode, ApiRequest, ApiRoutes, HttpHandler (+77 more)

### Community 256 - "serve-checks.ts"
Cohesion: 0.33
Nodes (4): Served, isolationProblems(), serveCommand(), ISOLATION

### Community 257 - "time-values.test.ts"
Cohesion: 0.22
Nodes (8): Report, inTimeZone(), EXPECTED, REPOSITORY, TIME_ZONES, WORKER, MARKER, RFC-3339

### Community 26 - "ledger-state.test.ts"
Cohesion: 0.04
Nodes (102): itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime, Field (+94 more)

### Community 27 - "NodeClient"
Cohesion: 0.05
Nodes (66): NodeSourceOptions, Connection, HeadSubscriber, NodeClient, NodeSubscription, Pending, State, Subscription (+58 more)

### Community 275 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 28 - "BlockRef"
Cohesion: 0.04
Nodes (41): BlockEventSource, BodyExtrinsic, BlockBody, BlockItemSource, CoreBlockItems, HeadWait, NodeBlockSource, Prefetch (+33 more)

### Community 29 - "client.test.ts"
Cohesion: 0.03
Nodes (52): NodeRetry, NodeSocketEvents, HandSocket, HandSockets, Answer, FakeNode, Handler, Received (+44 more)

### Community 296 - "typed-config.test.ts"
Cohesion: 0.33
Nodes (3): Finding, CONFIG, FIXTURES

### Community 3 - "admin-harness.ts"
Cohesion: 0.02
Nodes (194): MountedAdminAnswer, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions (+186 more)

### Community 30 - "declaration.ts"
Cohesion: 0.04
Nodes (71): StatsRow, Outcome, UmbraConfig, BlockWriteHandle, ReadHandle, SchemaWriteHandle, cursorTable, CursorTableOptions (+63 more)

### Community 31 - "LedgerPackage"
Cohesion: 0.04
Nodes (52): ApplyInput, LedgerPackage, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, Driver, StagenetBlockJson (+44 more)

### Community 32 - "runtime-metadata.test.ts"
Cohesion: 0.04
Nodes (70): ConnectSocket, Boundary, Outage, FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest (+62 more)

### Community 33 - "channel-queue.test.ts"
Cohesion: 0.05
Nodes (64): HelloAck, PrivateTransport, Waiter, controlledTimers, PeerEnd, PeerMessage, rawPeer, TestEnd (+56 more)

### Community 34 - "adapter.ts"
Cohesion: 0.04
Nodes (69): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+61 more)

### Community 35 - "runner/process.ts"
Cohesion: 0.03
Nodes (68): BackupSeams, BackupWritten, backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, TransportReader (+60 more)

### Community 36 - "resolve.ts"
Cohesion: 0.04
Nodes (79): BlockParsed, BackupOutcome, commandTarget, AddressRequest, Asked, LinkPlan, NetworkInput, NetworkPlan (+71 more)

### Community 37 - "Process"
Cohesion: 0.05
Nodes (23): NodeWait, redactor, LedgerWorkerOptions, transportReaderFacts, RetryCode, PauseHold, LibraryChecks, Process (+15 more)

### Community 38 - "ledger-storage-checks.ts"
Cohesion: 0.05
Nodes (65): RetainedState, ChildReader, LedgerEvent, TransactionResult, VmLog, ledgerItemsSeen, childRefKeys(), readChildren() (+57 more)

### Community 39 - "core-private-source.ts"
Cohesion: 0.06
Nodes (50): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes, PrivateLink (+42 more)

### Community 4 - "vitest"
Cohesion: 0.02
Nodes (172): RestoreSeams, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome, BackupBackend, BackupDatabase, killedRestore, TickerHandle (+164 more)

### Community 40 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (57): TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses() (+49 more)

### Community 42 - "range.ts"
Cohesion: 0.05
Nodes (64): BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, CompletenessRange, Final, Height (+56 more)

### Community 43 - "config-check.ts"
Cohesion: 0.04
Nodes (55): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName (+47 more)

### Community 44 - "builder.test.ts"
Cohesion: 0.05
Nodes (30): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Frame, RawClient (+22 more)

### Community 45 - "containers.test.ts"
Cohesion: 0.04
Nodes (50): BenchEnv, SslMode, driverConnectionOptions, PostgresConnection, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+42 more)

### Community 46 - "transport-faults.test.ts"
Cohesion: 0.06
Nodes (48): CoreTransport, Message, Ended, rawClient, Escape, Refused, splitAddress(), startCoreTransport() (+40 more)

### Community 47 - "transform-checks.ts"
Cohesion: 0.08
Nodes (45): Failure, Variant, TransformError, CallRecord, NotifyRecord, recordKind, SubscriptionId, CallSelection (+37 more)

### Community 48 - "openPostgres"
Cohesion: 0.05
Nodes (39): PostgresOptions, CheckTarget, CliBackend, Snapshot, Phase, PostgresTestDatabase, PostgresTestServer, Job (+31 more)

### Community 49 - "writer-lock-checks.ts"
Cohesion: 0.07
Nodes (50): WriterSession, WriterProcess, WorkerEvent, PauseReport, startWriter(), takeWriterLock(), expectRefusedBeforeAnyWrite(), noHeight() (+42 more)

### Community 5 - "opt-out.test.ts"
Cohesion: 0.02
Nodes (168): TableDigest, TableDigestRow, DumpInput, CaptureColumn, CapturedTable, CaptureState, CheckedMigration, ModuleColumn (+160 more)

### Community 50 - "loop-stop-harness.ts"
Cohesion: 0.07
Nodes (52): coreEntry, SignalTarget, SourceShared, A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf (+44 more)

### Community 52 - "boundary.test.ts"
Cohesion: 0.07
Nodes (49): DesignTable, RowCoverage, ModuleReference, Finding, rule(), collationsWritten(), componentCode(), componentExports() (+41 more)

### Community 53 - "cursor-table.test.ts"
Cohesion: 0.04
Nodes (47): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, CursorValue, Case, cursorDatabase (+39 more)

### Community 54 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (34): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, DesignTable (+26 more)

### Community 56 - "node.test.ts"
Cohesion: 0.06
Nodes (30): heldClock, Metadata, Step, Failure, Variant, TapeError, TapeClock, expectAnswersByOccurrence() (+22 more)

### Community 57 - "cbor.ts"
Cohesion: 0.08
Nodes (45): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+37 more)

### Community 58 - "pglite.ts"
Cohesion: 0.07
Nodes (21): DurabilityWarning, Job, JobQueue, Outcome, PgliteDatabase, ServerErrorFields, Writer, WriterStart (+13 more)

### Community 59 - "column-rules.ts"
Cohesion: 0.04
Nodes (54): AllowedRule, DesignRow, PlacedRefusal, RefusalCode, RefusalOptions, RefusedRule, RuleBase, Token (+46 more)

### Community 6 - "core-ledger-state.ts"
Cohesion: 0.02
Nodes (147): BlockLedgerSource, CoreContractStatesOptions, ContractStateRow, LedgerBinding, LedgerStateItem, retainedStates, CoreRevision, StateRow (+139 more)

### Community 60 - "validation.ts"
Cohesion: 0.05
Nodes (49): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, WaitingListener, ConfigRow, ConfigHashRow, PlacedDeclaration (+41 more)

### Community 61 - "core-private-source.test.ts"
Cohesion: 0.04
Nodes (21): startHashDecision, bindingRefusal(), hex(), networkRefusal(), publicLockstepOf(), sameBytes(), startStop(), height() (+13 more)

### Community 62 - "private/lockstep-wait.test.ts"
Cohesion: 0.06
Nodes (30): Report, OpenTransaction, ExpectedWait, WaitSample, HeldLink, HoldingRelay, ReportRelay, RetargetProxy (+22 more)

### Community 63 - "slow-block-cases.test.ts"
Cohesion: 0.10
Nodes (41): ReadOpener, Times, Wait, Observed, OutsidePoint, Seen, afterCommitProblems(), earlyProblems() (+33 more)

### Community 64 - "validate.ts"
Cohesion: 0.08
Nodes (47): CursorRule, Issue, Plain, SettingsSchema, coreSettingsSchema(), closest(), configFindings(), contextOf() (+39 more)

### Community 65 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (38): BlockHeaderItem, BlockRow, CoreBlockHeader, StandInOptions, Commit, checkParent(), commitBlock(), hex() (+30 more)

### Community 67 - "backup/backup.ts"
Cohesion: 0.08
Nodes (44): BackupInput, BackupTarget, BackupFacts, PgliteDump, SnapshotSeams, Environment, PgDumpTool, BackupCommandOptions (+36 more)

### Community 68 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (35): PgTransactionHistoryStorage, rowToEntry(), reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import (+27 more)

### Community 69 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 7 - "refcount-model.ts"
Cohesion: 0.03
Nodes (107): BlockKind, BlockScript, BoundaryRewrite, Dice, DrivenBlock, GeneratedBlock, GeneratedState, GraphNode (+99 more)

### Community 70 - "backup/restore.ts"
Cohesion: 0.08
Nodes (32): PublicIdentity, Checked, PublicSide, RestoreChain, RestoreInput, RestoreTarget, BackupText, Chain (+24 more)

### Community 71 - "mapping.ts"
Cohesion: 0.07
Nodes (33): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+25 more)

### Community 72 - ".value"
Cohesion: 0.15
Nodes (22): MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef, ScaleError, ScaleReader, ValueReader (+14 more)

### Community 73 - "checkShape"
Cohesion: 0.07
Nodes (36): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+28 more)

### Community 74 - "chain-data.negative-control.test.ts"
Cohesion: 0.08
Nodes (39): MetadataVariant, BlockParsedOptions, TransactionParser, ChainTransaction, ChainEvent, RecordTypes, ScaleValue, decodeExtrinsics() (+31 more)

### Community 76 - "version-checks.ts"
Cohesion: 0.11
Nodes (35): LedgerTable, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk, Answers (+27 more)

### Community 77 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (32): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, ChildResult (+24 more)

### Community 79 - "networks.ts"
Cohesion: 0.06
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 8 - "adapter-fixtures.ts"
Cohesion: 0.03
Nodes (128): ApplyOutput, StateSummary, StoredNode, LedgerHeight, Upstream, contractFixture, Ledger, RawPackage (+120 more)

### Community 80 - "page.ts"
Cohesion: 0.06
Nodes (31): ApiChannel, LinkRecord, PageState, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp() (+23 more)

### Community 81 - "ChannelEndpoint"
Cohesion: 0.11
Nodes (12): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), discard(), isChannel(), 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard (+4 more)

### Community 85 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (26): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue() (+18 more)

### Community 87 - "browser/build.ts"
Cohesion: 0.07
Nodes (27): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+19 more)

### Community 88 - "TransactionHistoryEntry"
Cohesion: 0.09
Nodes (26): TransactionHistoryEntry, TransactionHistoryStorage, InMemoryTransactionHistoryStorage, ReplayableStorage, abortErrorLike(), capitalize(), Added, Impact (+18 more)

### Community 9 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (140): ContractLog, BlockTransaction, EventPhase, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program (+132 more)

### Community 92 - "core-chain-events.ts"
Cohesion: 0.09
Nodes (30): MetadataField, RuntimeMetadataView, boundEventSource(), chainEventsOf(), coreChainEventsOnFetch(), metadataView(), runtimeMetadataOf(), writeEventRows() (+22 more)

### Community 93 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (33): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+25 more)

### Community 94 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 95 - "process-worker.ts"
Cohesion: 0.10
Nodes (25): demoLink, ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker (+17 more)

### Community 98 - "redact.ts"
Cohesion: 0.10
Nodes (28): RedactionForms, SecretForm, TextPattern, Needs, findings(), databaseText(), isMemoryDatabase(), configRedactor() (+20 more)

### Community 99 - "paused-harness.ts"
Cohesion: 0.12
Nodes (30): AdminStarter, AdminRunOptions, A176Options, Body, PausedExpectation, Read, Reader, Running (+22 more)

### Community 262 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 280 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 89 - "refused"
Cohesion: 0.07
Nodes (32): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 12. When a callback fails, The node on `/status`, 7. Storage helpers (+24 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+26 more)

### Community 108 - ".off"
Cohesion: 0.06
Nodes (30): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases, 2.2 The three durability settings (+22 more)

### Community 109 - ".slowBlockMs"
Cohesion: 0.07
Nodes (28): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+20 more)

### Community 111 - "backupAtStop"
Cohesion: 0.07
Nodes (29): backupAtStop(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds, Writing a backup, ADDED Requirements (+21 more)

### Community 113 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.13
Nodes (18): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), registerSuiteLifecycle(), startTestDatabase(), registerSuiteLifecycle(), startTestDatabase() (+10 more)

### Community 138 - "code"
Cohesion: 0.09
Nodes (25): code(), 15. Relation to the existing design documents, Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true) (+17 more)

### Community 150 - "transportReader"
Cohesion: 0.09
Nodes (20): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 4. Configuration, 10. Requirement coverage (+12 more)

### Community 153 - "T"
Cohesion: 0.10
Nodes (21): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 0. Schema (+13 more)

### Community 155 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 164 - ".cwd"
Cohesion: 0.12
Nodes (16): 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented, Evidence, Problem, Suggested fix, 00067 — `startUmbraDB` throws synchronously when the host's working directory no longer exists, Evidence, Problem, Suggested fix (+8 more)

### Community 165 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 167 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.10
Nodes (18): up(), name, 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 3.1 The frozen catalog (the machine-facing API) (+10 more)

### Community 171 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.12
Nodes (16): transportReaderRule(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout, 2. Architecture (+8 more)

### Community 172 - ".source"
Cohesion: 0.11
Nodes (16): 17. Trying a module, 18. Running UmbraDB in your own program, 6. Options, refusals and the handle, 10. Definition of done, item by item, 1. Library-mode guarantees, 3. Lifecycle, 5. Modules and the ledger worker, 7. The command and shared resolution (+8 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): regular(), ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events (+9 more)

### Community 183 - "integer"
Cohesion: 0.12
Nodes (15): integer(), 4.1 Column types, 4.2 Rules, 4.3 Data that is not a function of the chain: `deterministic: false`, 4. Deterministic PostgreSQL, Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first) (+7 more)

### Community 187 - "core-block-fetch.test.ts"
Cohesion: 0.15
Nodes (8): bindCoreBlockFetch(), coreBlockFetchOnFetch(), isBlockItemSource(), blockContext(), BOUND, CORE_BLOCK_FETCH_ID, CORE_BLOCK_ITEMS, KNOWN_NETWORKS

### Community 192 - "log"
Cohesion: 0.15
Nodes (13): placeFor(), watchingPgDump(), log(), 00072 — `umbradb run` logs nothing when SIGTERM or SIGINT stops it, Evidence, Problem, Suggested fix, 7.1 Library-mode guarantees (+5 more)

### Community 197 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 199 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 200 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 208 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 216 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 218 - "browser.negative-control.test.ts"
Cohesion: 0.15
Nodes (12): contentsHashOf(), pageUrl(), statusOf(), chrome(), tapeNode(), BROWSER_TEST_TIMEOUT_MS, benches, browsers (+4 more)

### Community 223 - "Tasks — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.17
Nodes (10): 9.2 Browser build (BR), 0. Baseline, 11. Close-out, 2. The private link's settings renamed (D-6; CF-4), 5. Mounted handlers and the service lifecycle (LM-4, LM-5; design §5.3), 6. The private link over channels (LM-6; design §5.4), 7. The browser demo on the engine (LM-11; design §8), 8. The test sweep, the documents and the pack smoke (design §9; LS-1) (+2 more)

### Community 224 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 233 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 240 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 247 - "api-session.test.ts"
Cohesion: 0.24
Nodes (8): moduleApiFetch(), responseOf(), throwing(), unreadableAmount(), db, MALFORMED_CLIENT, POISONED, read

### Community 251 - "height-partitions.ts"
Cohesion: 0.22
Nodes (7): heightPartitionsSql(), HEIGHT_PARTITION_SIZE, PRECREATED_HEIGHT_PARTITIONS, 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 258 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 265 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 266 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.29
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 297 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 334 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 345 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 41 - "history"
Cohesion: 0.04
Nodes (65): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+57 more)

### Community 51 - ".put"
Cohesion: 0.03
Nodes (57): coreTxResultsOnParse(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+49 more)

### Community 55 - "data"
Cohesion: 0.04
Nodes (58): params(), n(), data(), 7. The module API, 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants, 2.4 Migrations: one per part (O-2) (+50 more)

### Community 66 - "table"
Cohesion: 0.06
Nodes (46): side(), migrations(), table(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 13. Providing items to other modules, 14. Private modules (+38 more)

### Community 86 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 112 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 114 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+21 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 140 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 145 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 147 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 148 - "README.md"
Cohesion: 0.10
Nodes (17): Choosing a database, At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails, Generate your local wallet (+9 more)

### Community 154 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.09
Nodes (22): 0. Baseline and decisions, 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words (+14 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 159 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 173 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 174 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 175 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker (+10 more)

### Community 179 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 180 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 181 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 186 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 191 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.12
Nodes (11): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+3 more)

### Community 198 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 204 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 205 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 214 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 215 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 220 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 226 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 227 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 230 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 231 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 234 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 235 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 236 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 237 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 238 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 239 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 241 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 242 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 243 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 244 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 245 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 246 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 249 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 250 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 252 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 253 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 254 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 259 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 260 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 261 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 263 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 264 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 267 - "The database"
Cohesion: 0.29
Nodes (7): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, TLS to PostgreSQL: `ssl`, UmbraDB operator guide

### Community 268 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 269 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 270 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 271 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 272 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 273 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 274 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 277 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 278 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 279 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 281 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.33
Nodes (5): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Problem, Resolution, Suggested fix

### Community 282 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 283 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 284 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 285 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 286 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 287 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 288 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 289 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 290 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 291 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, What changes — the 1.0.0 gate items this change addresses, Why

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

### Community 298 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

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

### Community 306 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 307 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 308 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 309 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 310 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 311 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 312 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 313 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 314 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 315 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 316 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 317 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 318 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 319 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 320 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 321 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 322 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 323 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 324 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 325 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 326 - "00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why"
Cohesion: 0.40
Nodes (4): 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why, Evidence, Problem, Suggested fix

### Community 327 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 328 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 329 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 330 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 331 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 332 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 335 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 336 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 337 - "00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes"
Cohesion: 0.50
Nodes (3): 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes, Evidence, Suggested fix

### Community 338 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 339 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 340 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 341 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 342 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 343 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 348 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+31 more)

### Community 84 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4231 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UmbraError`, `InMemoryBlockSource`, `process-build.ts`, `admin-harness.ts`, `opt-out.test.ts`, `core-ledger-state.ts`, `refcount-model.ts`, `adapter-fixtures.ts`, `core-block-parsed.ts`, `ModuleDeclaration`, `graph.ts`, `ledger/types.ts`, `messages.ts`, `FinalizedLoop`, `refused-configuration.test.ts`, `fetch-fixtures.ts`, `builds.ts`, `config/history.ts`, `loop.test.ts`, `tape/index.ts`, `binding.test.ts`, `.from`, `process-admin.ts`, `entries.ts`, `api-server.test.ts`, `ledger-state.test.ts`, `NodeClient`, `BlockRef`, `client.test.ts`, `declaration.ts`, `LedgerPackage`, `runtime-metadata.test.ts`, `channel-queue.test.ts`, `adapter.ts`, `runner/process.ts`, `resolve.ts`, `Process`, `ledger/ledger-tasks.test.ts`, `config-check.ts`, `builder.test.ts`, `containers.test.ts`, `transport-faults.test.ts`, `transform-checks.ts`, `openPostgres`, `writer-lock-checks.ts`, `loop-stop-harness.ts`, `boundary.test.ts`, `cursor-table.test.ts`, `column-rules.test.ts`, `node.test.ts`, `core-private-source.test.ts`, `private/lockstep-wait.test.ts`, `slow-block-cases.test.ts`, `core-block-commit.test.ts`, `backup/backup.ts`, `retirement.test.ts`, `backup/restore.ts`, `mapping.ts`, `chain-data.negative-control.test.ts`, `version-checks.ts`, `pglite-lock.ts`, `networks.ts`, `pg-tx-history-adapter.ts`, `browser/build.ts`, `core-chain-events.ts`, `cbor.property.test.ts`, `release-version.ts`, `redact.ts`, `child-processes.test.ts`, `code-registry.ts`, `resolver-boundary.ts`, `.name`, `options.ts`, `src/ledger/identity.ts`, `cold-boot-recovery.integration.test.ts`, `package.json`, `documents.ts`, `postgres/transaction-history-storage.ts`, `block-fetch-decode.test.ts`, `manifest.ts`, `config/plain-data.ts`, `Lockstep`, `read-gate.ts`, `test/postgres/setup.ts`, `example-checks.ts`, `digest.test.ts`, `height-versioned.property.test.ts`, `browser.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `node-bridge.ts`, `surface.test.ts`, `crash.test.ts`, `shims.test.ts`, `configuration-refusal.test.ts`, `src/config/load.ts`, `harness.ts`, `library-documents.test.ts`, `pglite-timeouts.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `durability-probe.test.ts`, `recovery.test.ts`, `LoopPauses`, `excluded-not-exported.test.ts`, `ws-mutual-tls.test.ts`, `core-block-fetch.test.ts`, `validation.test.ts`, `read-height.property.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `web-lock.ts`, `twox.ts`, `worker-threads.test.ts`, `Heartbeat`, `browser.negative-control.test.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `midnight-env — reproducible PREPROD dev environment`, `api-session.test.ts`, `postgres-image.test.ts`, `serve-checks.ts`, `time-values.test.ts`, `typed-config.test.ts`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.01606418121755545 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `InMemoryBlockSource`, `process-build.ts`, `admin-harness.ts`, `vitest`, `opt-out.test.ts`, `core-ledger-state.ts`, `core-block-parsed.ts`, `ModuleDeclaration`, `graph.ts`, `ledger/types.ts`, `messages.ts`, `FinalizedLoop`, `refused-configuration.test.ts`, `shims.test.ts`, `fetch-fixtures.ts`, `config/history.ts`, `src/db/postgres.ts`, `loop.test.ts`, `configuration-refusal.test.ts`, `binding.test.ts`, `process-admin.ts`, `entries.ts`, `api-server.test.ts`, `tape/index.ts`, `NodeClient`, `src/config/load.ts`, `BlockRef`, `client.test.ts`, `declaration.ts`, `runtime-metadata.test.ts`, `channel-queue.test.ts`, `runner/process.ts`, `resolve.ts`, `Process`, `core-private-source.ts`, `durability-probe.test.ts`, `range.ts`, `config-check.ts`, `.source`, `containers.test.ts`, `transport-faults.test.ts`, `transform-checks.ts`, `openPostgres`, `writer-lock-checks.ts`, `version-table.ts`, `cursor-table.test.ts`, `cbor.ts`, `pglite.ts`, `validation.ts`, `core-private-source.test.ts`, `validation.test.ts`, `slow-block-cases.test.ts`, `validate.ts`, `core-block-commit.test.ts`, `statementsOf`, `backup/backup.ts`, `RuntimeMetadata`, `log`, `backup/restore.ts`, `mapping.ts`, `checkShape`, `web-lock.ts`, `version-checks.ts`, `pglite-lock.ts`, `browser/src/config/load.ts`, `options.ts`, `src/ledger/identity.ts`, `backupAtStop`, `manifest.ts`, `config/plain-data.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `InMemoryBlockSource` be split into smaller, more focused modules?**
  _Cohesion score 0.01737991786203202 - nodes in this community are weakly interconnected._