# Graph Report - UmbraDB

## Corpus Check
- 1165 files · ~1,638,626 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12222 nodes · 37588 edges · 344 communities (307 shown, 37 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3012 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `fdb2b0ca658f61f7` (1165 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- api.ts
- loop.test.ts
- tape/index.ts
- core-ledger-state/sql.ts
- ingest-harness.ts
- entries.ts
- release-version.ts
- process-worker.ts
- backup-fixtures.ts
- browser/build.ts
- TransactionHistoryEntry
- ChannelEndpoint
- core-digest.ts
- resolver-boundary.ts
- cli/command.ts
- node-run.ts
- admin-harness.ts
- paused-harness.ts
- node-fields-harness.ts
- chrome.ts
- binding.test.ts
- compact
- documents.ts
- code-registry.ts
- ref_node_fs
- ws
- read-gate.ts
- test/postgres/setup.ts
- crash.test.ts
- .concat
- mapping.ts
- openPglite
- pg-tx-history-adapter.ts
- adapter-fixtures.ts
- channel-processes.ts
- Process
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- config/history.ts
- chain-data.negative-control.test.ts
- .name
- core-block-fetch/metadata.ts
- Writer
- ledger-table-config.test.ts
- cbor.property.test.ts
- process-admin.ts
- node-bridge.ts
- example-checks.ts
- demo-handlers.test.ts
- read-timeouts.test.ts
- .value
- ledger-sweep.test.ts
- harness.ts
- shims.test.ts
- block-fetch-decode.test.ts
- column-rules.ts
- childRefKeys
- devnet-upgrade.test.ts
- source-scan.ts
- core-private-source.test.ts
- statementsOf
- version-table.ts
- listening.test.ts
- transcripts.ts
- cursor-table.property.test.ts
- ws-mutual-tls.test.ts
- spawnChild
- placement.ts
- core.ts
- extrinsics.ts
- deterministic-postgresql/checks.ts
- component-table.test.ts
- runner/process.ts
- host.ts
- read-height.property.test.ts
- no-indexer-or-wallet-sdk.test.ts
- worker-threads.test.ts
- history.property.test.ts
- quiet-host.child.ts
- core-transport.ts
- worker-threads-worker.ts
- LoopPauses
- Worker
- NodeClient
- sweepStep
- browser/src/config/load.ts
- sha256
- vitest
- a114Run
- .#close
- port.ts
- process-backends.ts
- ProcessItems
- ledger/plain-data.ts
- backup/backup.ts
- mutation-evidence.d.mts
- .#backupOnSignal
- TransportProxy
- AsyncLocalStorage
- api-server.test.ts
- records.ts
- node-format.ts
- adapter.ts
- builds.ts
- client.test.ts
- validate.ts
- BYTE_ORDER
- PageApiChannel
- NodeFS
- LedgerPackage
- range.ts
- messages.ts
- record-and-replay.test.ts
- ledger/ledger-tasks.test.ts
- UmbraError
- interfaces/transaction-history-storage.ts
- PgTransactionHistoryStorage
- FinalizedLoop
- channel-checks.test.ts
- mounted-admin.test.ts
- NodeBlockSource
- ledger/types.ts
- changes.property.test.ts
- ingest
- core-config.test.ts
- cbor.ts
- declaration.ts
- transform-checks.ts
- api-socket.ts
- module-tables.ts
- slow-block-harness.ts
- resolve.ts
- ProcessHandle
- core-ledger-state.ts
- InMemoryBlockSource
- guarantees.test.ts
- browser.test.ts
- config-check.ts
- real-tapes.ts
- containers.test.ts
- config/plain-data.ts
- loop-stop-harness.ts
- default.test.ts
- core-block-parsed.ts
- pack-install.mjs
- contract-data-checks.ts
- graph.ts
- checkShape
- core-settings.ts
- start-umbradb.ts
- retirement.test.ts
- writer-lock-checks.ts
- networks.ts
- fetch-fixtures.ts
- version-checks.ts
- transport.test.ts
- page.ts
- .from
- file-mode.test.ts
- src/db/postgres.ts
- chain-process.test.ts
- restore-private.ts
- both-backends.test.ts
- openPostgres
- validation.ts
- column-refusals.test.ts
- pglite-lock.ts
- cold-boot-recovery.integration.test.ts
- Problem
- refused
- table
- graph.py
- ADDED Requirements
- .slowBlockMs
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- .off
- chain-events-decode.test.ts
- boundary.test.ts
- mapping.test.ts
- core-ledger-state.test.ts
- .disconnect
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- scoped-review-manifest
- path.ts
- midnight-env — reproducible PREPROD dev environment
- Requirement: CF-4 Every field is data, operational or secret
- .#startup
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- orphan-watcher.mjs
- rowProblems
- fresh-instance.mjs
- crash-worker.ts
- history
- startUmbraDB
- .put
- code
- T
- following
- ADDED Requirements
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- Boundaries, threats and controls
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
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.9.5] - 2026-07-25 — "Penumbra"
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- stats-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
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
- 00054 — A slow-block test hung inside PGlite for over an hour
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
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
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs

## God Nodes (most connected - your core abstractions)
1. `vitest` - 400 edges
2. `UmbraError` - 341 edges
3. `ModuleDeclaration` - 194 edges
4. `InMemoryBlockSource` - 157 edges
5. `FinalizedLoop` - 133 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 102 edges
8. `Database` - 101 edges
9. `ReadHandle` - 92 edges
10. `startProcess()` - 85 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `Suggested fix` --references--> `prepareSchemas()`  [INFERRED]
  docs/issues/00030-concurrent-role-provisioning.md → src/db/roles.ts

## Import Cycles
- None detected.

## Communities (344 total, 37 thin omitted)

### Community 0 - "api.ts"
Cohesion: 0.02
Nodes (226): CommittedHeight, Database, ReadOptions, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable (+218 more)

### Community 1 - "loop.test.ts"
Cohesion: 0.02
Nodes (189): EntryRange, GraphInput, ResolvedGraph, PointRun, LockstepWait, LoopEnd, SlowBlockEvent, SlowWindow (+181 more)

### Community 10 - "tape/index.ts"
Cohesion: 0.03
Nodes (83): NodeCallOptions, NodeClientOptions, ConnectSocket, RecordingClient, Outage, ScriptedRequest, syntheticChain, SyntheticChainOptions (+75 more)

### Community 100 - "core-ledger-state/sql.ts"
Cohesion: 0.11
Nodes (34): StateRow, StoredState, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks(), deleteGrey() (+26 more)

### Community 106 - "ingest-harness.ts"
Cohesion: 0.10
Nodes (29): RestoreInput, IngestOptions, SourceClass, watched, RestartEvent, RestartJob, recordedGenesis, RestoreBuild (+21 more)

### Community 107 - "entries.ts"
Cohesion: 0.06
Nodes (34): DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+26 more)

### Community 108 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 109 - "process-worker.ts"
Cohesion: 0.10
Nodes (26): demoLink, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, withDevelopmentOptIn(), answer() (+18 more)

### Community 11 - "backup-fixtures.ts"
Cohesion: 0.04
Nodes (96): BackupBackend, BackupDatabase, killedRestore, TickerHandle, TickerProcess, BackupOnSignal, LoopClass, Pausable (+88 more)

### Community 111 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuild, BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common() (+18 more)

### Community 113 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 114 - "ChannelEndpoint"
Cohesion: 0.13
Nodes (7): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), 4. Channels, 5.4 Channels

### Community 115 - "core-digest.ts"
Cohesion: 0.10
Nodes (30): TableDigest, TableDigestRow, CapturedTable, ChangeKind, tableChanges, TouchedRow, capturedOf(), digestBlock() (+22 more)

### Community 116 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 117 - "cli/command.ts"
Cohesion: 0.10
Nodes (25): CommandHandler, CommandIo, MainProcess, CommandResult, main(), pageHandler(), backupArguments(), backupCommand() (+17 more)

### Community 118 - "node-run.ts"
Cohesion: 0.09
Nodes (25): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, PglitePathParts, NodeRunResult, core() (+17 more)

### Community 12 - "admin-harness.ts"
Cohesion: 0.03
Nodes (115): adminRoutes, AdminEndpoint, AdminPart, AdminView, ReadinessFacts, ProcessState, AdminRun, Answered (+107 more)

### Community 120 - "paused-harness.ts"
Cohesion: 0.14
Nodes (27): Body, PausedExpectation, Read, Reader, Running, commandBuild(), resolveDeclarations(), keeperModule() (+19 more)

### Community 121 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (24): A168Observation, A168Phase, Expected, GatedConnector, StatusReader, a(), a168Problems(), a168Run() (+16 more)

### Community 122 - "chrome.ts"
Cohesion: 0.12
Nodes (15): Cdp, CdpEvent, ChromeBrowser, ChromeTab, Download, PageRequest, chrome(), chrome() (+7 more)

### Community 125 - "binding.test.ts"
Cohesion: 0.12
Nodes (28): A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), contentsOf(), cursorOf() (+20 more)

### Community 126 - "compact"
Cohesion: 0.16
Nodes (21): Field, Registry, metadataWith(), metadataV14(), midnightMetadata(), phaseBytes(), record(), some() (+13 more)

### Community 128 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 129 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 13 - "ref_node_fs"
Cohesion: 0.03
Nodes (93): ConfigCheckReport, DatabaseParts, PostgresPartsInput, EngineConfig, Refusal, Start, TickerConfig, PausableConfig (+85 more)

### Community 131 - "ws"
Cohesion: 0.10
Nodes (10): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+2 more)

### Community 132 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 133 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 134 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+15 more)

### Community 135 - ".concat"
Cohesion: 0.09
Nodes (18): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+10 more)

### Community 136 - "mapping.ts"
Cohesion: 0.13
Nodes (26): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+18 more)

### Community 137 - "openPglite"
Cohesion: 0.10
Nodes (23): DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PgliteLockUse, openRestoreTarget(), open() (+15 more)

### Community 138 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (21): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+13 more)

### Community 14 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (108): ApplyInput, ApplyOutput, StateSummary, StoredNode, LedgerHeight, Upstream, contractFixture, Ledger (+100 more)

### Community 140 - "channel-processes.ts"
Cohesion: 0.11
Nodes (22): PrivateLinkChannel, NetworkRuleName, ChannelCoreOptions, ChannelPrivateOptions, Link, Expected, confinedCore(), publicReads() (+14 more)

### Community 144 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.08
Nodes (21): ReadPool, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider) (+13 more)

### Community 145 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 146 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 147 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 148 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 15 - "config/history.ts"
Cohesion: 0.03
Nodes (110): OpenedConfig, CoreVersion, CoreSettings, versionEntry, ConfigHashRow, HistoryCode, HistoryContext, HistoryRow (+102 more)

### Community 151 - "chain-data.negative-control.test.ts"
Cohesion: 0.12
Nodes (23): BlockParsed, BlockParsedOptions, TransactionParser, itemsSeen, Json, inThreadParser(), is(), placeTransactions() (+15 more)

### Community 152 - ".name"
Cohesion: 0.10
Nodes (17): Fetching, Recorder, Key, Sql, 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix (+9 more)

### Community 153 - "core-block-fetch/metadata.ts"
Cohesion: 0.23
Nodes (16): MetadataField, MetadataStorage, MetadataStorageEntry, Primitive, TypeDef, ScaleError, field(), pallet() (+8 more)

### Community 154 - "Writer"
Cohesion: 0.13
Nodes (5): BoundedRead, Session, Writer, queryTimeout(), rollBack()

### Community 155 - "ledger-table-config.test.ts"
Cohesion: 0.17
Nodes (20): CountingNode, Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked() (+12 more)

### Community 156 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 16 - "process-admin.ts"
Cohesion: 0.03
Nodes (85): ConfigFacts, NetworkShown, AllowedDetail, MountedAdminAnswer, AdminSeams, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions (+77 more)

### Community 160 - "node-bridge.ts"
Cohesion: 0.13
Nodes (17): Thread, BridgeServer, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 161 - "example-checks.ts"
Cohesion: 0.16
Nodes (17): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+9 more)

### Community 162 - "demo-handlers.test.ts"
Cohesion: 0.14
Nodes (18): Compared, ConnectSeen, PortPeer, SubscriptionSeen, Exchanged, comparedOfExchange(), comparedOfResponse(), connected() (+10 more)

### Community 163 - "read-timeouts.test.ts"
Cohesion: 0.10
Nodes (13): PostgresOptions, PostgresTestDatabase, readDatabaseState(), opened(), committedHeight(), database(), preparedCount(), loginOn() (+5 more)

### Community 164 - ".value"
Cohesion: 0.25
Nodes (8): MetadataType, ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 165 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (13): SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints() (+5 more)

### Community 166 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 167 - "shims.test.ts"
Cohesion: 0.13
Nodes (15): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PgliteLockUse, databaseOptions(), openConfiguredDatabase(), acquirePgliteLock(), lockHeld() (+7 more)

### Community 169 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+9 more)

### Community 17 - "column-rules.ts"
Cohesion: 0.02
Nodes (104): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+96 more)

### Community 170 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 171 - "devnet-upgrade.test.ts"
Cohesion: 0.15
Nodes (14): Side, TapeAnswers, FoundTape, found(), bytesOf(), hexOf(), nodeRootAt(), recording() (+6 more)

### Community 179 - "source-scan.ts"
Cohesion: 0.20
Nodes (17): ModuleReference, boundaryViolations(), codeFingerprints(), declaredNames(), eachNode(), isInside(), lineOf(), literalText() (+9 more)

### Community 18 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (71): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision, StartHashes (+63 more)

### Community 183 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 184 - "version-table.ts"
Cohesion: 0.25
Nodes (16): LedgerPin, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin(), freezeRow(), hexOf() (+8 more)

### Community 185 - "listening.test.ts"
Cohesion: 0.13
Nodes (8): TestCertificates, configWhen(), libraryCore(), readerOf(), until(), waitsForLockstep(), makeCertificates(), CONFIG_SCHEMA

### Community 186 - "transcripts.ts"
Cohesion: 0.21
Nodes (12): Program, V9Raw, bytesOfHex(), decode(), decoded(), freeGot(), literalAt(), logSitesOf() (+4 more)

### Community 187 - "cursor-table.property.test.ts"
Cohesion: 0.17
Nodes (15): Access, Block, BlockFails, Counts, Write, canonicalText(), expectValue(), holds() (+7 more)

### Community 188 - "ws-mutual-tls.test.ts"
Cohesion: 0.19
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 19 - "spawnChild"
Cohesion: 0.02
Nodes (93): Child, ParentJob, Kill, Orphaned, SourceFile, Run, Job, WorkerEvent (+85 more)

### Community 192 - "placement.ts"
Cohesion: 0.23
Nodes (13): MetadataVariant, ChainTransaction, ChainEvent, EventPhase, RecordTypes, ScaleValue, callVariant(), carried() (+5 more)

### Community 193 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 197 - "extrinsics.ts"
Cohesion: 0.20
Nodes (12): BodyExtrinsic, ExtrinsicCall, BlockBody, MetadataPallet, RuntimeMetadataView, blockTimeOf(), callOf(), callVariants() (+4 more)

### Community 198 - "deterministic-postgresql/checks.ts"
Cohesion: 0.18
Nodes (13): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, checkFunctionsSql(), numericOkPredicate(), refusedNumbersPath() (+5 more)

### Community 199 - "component-table.test.ts"
Cohesion: 0.15
Nodes (10): DesignTable, RowCoverage, rule(), opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS (+2 more)

### Community 2 - "runner/process.ts"
Cohesion: 0.02
Nodes (147): OpenedFacts, Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait (+139 more)

### Community 20 - "host.ts"
Cohesion: 0.04
Nodes (82): LedgerStateItem, LedgerName, ChainOutcome, LedgerTask, ParsedTransaction, AppliedState, ApplyBlock, BlockId (+74 more)

### Community 200 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 202 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 203 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 207 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 208 - "quiet-host.child.ts"
Cohesion: 0.18
Nodes (9): Job, Outcome, Stated, until(), before, db, during, [first, refusedLate, failingSql, halting] (+1 more)

### Community 21 - "core-transport.ts"
Cohesion: 0.03
Nodes (78): PrivateLinkAddress, PrivateLinkConnect, ResultColumn, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected (+70 more)

### Community 210 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 213 - "LoopPauses"
Cohesion: 0.24
Nodes (3): LoopPaused, LoopPauses, watched()

### Community 22 - "NodeClient"
Cohesion: 0.05
Nodes (70): NodeSourceOptions, CoreChainBinding, FinalizedHeightOptions, HeadSubscriber, NodeClient, NodeRetry, Pending, State (+62 more)

### Community 221 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 222 - "browser/src/config/load.ts"
Cohesion: 0.29
Nodes (9): LoadedConfig, LoadOptions, configModuleUrl(), configPath(), loadConfig(), loadModuleList(), noFile(), DEFAULT_CONFIG_FILE (+1 more)

### Community 223 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 23 - "vitest"
Cohesion: 0.03
Nodes (64): Served, Row, Finding, Lockfile, Manifest, RepositoryFile, Upstream, Leftover (+56 more)

### Community 233 - "port.ts"
Cohesion: 0.29
Nodes (6): pageBench, PageServer, servePage(), listenOnRandomPort(), randomPort(), PORT_ATTEMPTS

### Community 24 - "process-backends.ts"
Cohesion: 0.05
Nodes (92): Call, SeenLoad, retentionSeen, LedgerTx, WindowBackup, PackageStartup, ProcessBackend, ProcessDatabase (+84 more)

### Community 246 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 25 - "backup/backup.ts"
Cohesion: 0.04
Nodes (89): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+81 more)

### Community 255 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "api-server.test.ts"
Cohesion: 0.04
Nodes (76): coreHeaders, ModuleApiStart, MountedApiSeams, StartedModuleApi, FetchHandler, ModuleApiLimits, ModuleApiHandlerOptions, ModuleApiServer (+68 more)

### Community 27 - "records.ts"
Cohesion: 0.05
Nodes (67): RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId, NotJsonError, Connection (+59 more)

### Community 28 - "node-format.ts"
Cohesion: 0.05
Nodes (65): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+57 more)

### Community 29 - "adapter.ts"
Cohesion: 0.03
Nodes (75): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+67 more)

### Community 3 - "builds.ts"
Cohesion: 0.03
Nodes (153): AdminStarter, PrivateIntakeOptions, PostgresParts, ReadOnlyDatabase, LockstepCondition, EngineInput, A168RunOptions, A176Options (+145 more)

### Community 30 - "client.test.ts"
Cohesion: 0.03
Nodes (45): Connection, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets, ManualTimers, Frame (+37 more)

### Community 31 - "validate.ts"
Cohesion: 0.04
Nodes (84): HistoryFinding, plainData, ConfigInput, ConfigRule, CursorRule, EntryRef, EntryView, Finding (+76 more)

### Community 32 - "LedgerPackage"
Cohesion: 0.05
Nodes (43): LedgerPackage, NodeStore, StateHandle, LedgerEngine, bridgeStore, StagenetBlockJson, StagenetFixtureJson, stagenetReplay (+35 more)

### Community 33 - "range.ts"
Cohesion: 0.04
Nodes (67): NodeSubscription, Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions (+59 more)

### Community 34 - "messages.ts"
Cohesion: 0.04
Nodes (51): PublicSide, Committed, HelloAck, JsonValue, MessageFault, ReadResult, StatementResult, CarrierConnection (+43 more)

### Community 35 - "record-and-replay.test.ts"
Cohesion: 0.04
Nodes (43): Answer, FakeNode, Handler, Received, recorded, ConnectionFrames, Recorded, Failure (+35 more)

### Community 36 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.04
Nodes (63): LedgerTaskBlock, TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw (+55 more)

### Community 37 - "UmbraError"
Cohesion: 0.05
Nodes (46): PostgresConnection, PostgresOptions, ConfigFinding, ReadTimeoutSetting, Job, JobQueue, PgliteDatabase, PgliteOptions (+38 more)

### Community 38 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (57): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus (+49 more)

### Community 39 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (70): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema (+62 more)

### Community 4 - "FinalizedLoop"
Cohesion: 0.02
Nodes (100): PointName, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointSchedule, ProcessReason (+92 more)

### Community 41 - "channel-checks.test.ts"
Cohesion: 0.05
Nodes (56): EndpointOptions, Envelope, controlledTimers, PeerEnd, PeerMessage, rawPeer, TestEnd, TestEndOptions (+48 more)

### Community 42 - "mounted-admin.test.ts"
Cohesion: 0.06
Nodes (56): UmbraDBHandle, NodeHttpHandler, NodeUpgradeHandler, gate, Expected, Client, MapiHooks, Mountable (+48 more)

### Community 44 - "NodeBlockSource"
Cohesion: 0.06
Nodes (21): HeadWait, NodeBlockSource, Prefetch, NodeBlock, NodeHeader, PreparedBlock, QueueRunner, EventsRunner (+13 more)

### Community 45 - "ledger/types.ts"
Cohesion: 0.06
Nodes (46): LoadLedger, ManifestLine, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerPackageOptions, V9Logs, LoadAdapter (+38 more)

### Community 46 - "changes.property.test.ts"
Cohesion: 0.05
Nodes (60): ChainOptions, DigestRow, Op, States, TableName, captured(), captureFunction(), hex() (+52 more)

### Community 47 - "ingest"
Cohesion: 0.08
Nodes (60): FixtureRun, ingest, TableSnapshot, ledgerBackup, FixtureNode, FakeState, RefusalData, startLedgerWorker() (+52 more)

### Community 48 - "core-config.test.ts"
Cohesion: 0.06
Nodes (54): coreEntry, StatusFacts, upgradeBoundary, UpgradeCondition, Validator, configOf(), declarationView(), entryView() (+46 more)

### Community 49 - "cbor.ts"
Cohesion: 0.07
Nodes (57): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+49 more)

### Community 5 - "declaration.ts"
Cohesion: 0.03
Nodes (112): UmbraConfig, BlockWriteHandle, ReadHandle, OwnPart, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable (+104 more)

### Community 50 - "transform-checks.ts"
Cohesion: 0.08
Nodes (44): Failure, Variant, TransformError, CallRecord, recordKind, CallSelection, baseRecords(), expectedText() (+36 more)

### Community 51 - "api-socket.ts"
Cohesion: 0.06
Nodes (50): HeadersArgument, LifecycleStatus, ChannelConnectOptions, connectionRules, ServedConnection, SubscriptionCarrier, SubscriptionConnection, moduleApiHandlers (+42 more)

### Community 52 - "module-tables.ts"
Cohesion: 0.07
Nodes (45): CaptureColumn, CaptureState, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, GuardTableRow (+37 more)

### Community 53 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (50): HeightActivity, LoopInput, LoopPause, Times, Wait, askedSource, HoldMode, Observed (+42 more)

### Community 55 - "resolve.ts"
Cohesion: 0.05
Nodes (56): AddressRequest, Asked, LinkPlan, NetworkContext, NetworkInput, NetworkPlan, NetworkProblem, NetworkRequest (+48 more)

### Community 57 - "ProcessHandle"
Cohesion: 0.05
Nodes (43): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, ProcessHandle, UserModulesSource (+35 more)

### Community 59 - "core-ledger-state.ts"
Cohesion: 0.06
Nodes (49): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, RetainedState, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions (+41 more)

### Community 6 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (95): BlockHeaderItem, BlockRow, BlockEventSource, BlockItemSource, CoreBlockHeader, CoreBlockItems, QueuedBlock, BlockItems (+87 more)

### Community 60 - "guarantees.test.ts"
Cohesion: 0.06
Nodes (29): CloseHelper, Hold, Signal, FaultedClose, QuietResult, Job, PlainSubclass, closeSteps() (+21 more)

### Community 61 - "browser.test.ts"
Cohesion: 0.08
Nodes (53): Reachable, RestoreAttempt, PageBackup, PageEvent, PageLink, PageRestore, ProcessName, StatusBody (+45 more)

### Community 62 - "config-check.ts"
Cohesion: 0.06
Nodes (47): CheckFinding, CheckStep, ConfigCheckSeams, StepName, StepReport, StepStatus, TypeCheckFinding, TypeCheckResult (+39 more)

### Community 64 - "real-tapes.ts"
Cohesion: 0.05
Nodes (40): Metadata, Step, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+32 more)

### Community 65 - "containers.test.ts"
Cohesion: 0.06
Nodes (38): BenchEnv, SslMode, driverConnectionOptions, PostgresConnection, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+30 more)

### Community 66 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (44): RevisionSettings, EntryView, RecordedView, SanitizedError, PlainArray, PlainDataNode, PlainDataRule, PlainObject (+36 more)

### Community 67 - "loop-stop-harness.ts"
Cohesion: 0.09
Nodes (39): A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore (+31 more)

### Community 68 - "default.test.ts"
Cohesion: 0.08
Nodes (46): Start, startAdminServer(), startProcess(), adminSource(), observe(), stateProblems(), within(), commandProcess() (+38 more)

### Community 7 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (125): StatsRow, Outcome, ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite (+117 more)

### Community 70 - "pack-install.mjs"
Cohesion: 0.08
Nodes (45): Surface, SurfaceAmendment, SmokeFailure, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph() (+37 more)

### Community 71 - "contract-data-checks.ts"
Cohesion: 0.12
Nodes (45): contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx, handoff (+37 more)

### Community 72 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, HeightRange, MidChain, Missing, RangeCheck (+40 more)

### Community 73 - "checkShape"
Cohesion: 0.06
Nodes (40): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+32 more)

### Community 74 - "core-settings.ts"
Cohesion: 0.05
Nodes (44): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, Absent, DeepReadonly, PrivateKeys, PrivateOnly (+36 more)

### Community 76 - "start-umbradb.ts"
Cohesion: 0.08
Nodes (41): MessagePortLike, readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork, UmbraDBOptions (+33 more)

### Community 77 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 78 - "writer-lock-checks.ts"
Cohesion: 0.10
Nodes (36): WriterProcess, WorkerEvent, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf(), startWriterProcess() (+28 more)

### Community 79 - "networks.ts"
Cohesion: 0.06
Nodes (40): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+32 more)

### Community 8 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (137): ProcessCondition, BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, PalletMetadata, Phase (+129 more)

### Community 80 - "version-checks.ts"
Cohesion: 0.09
Nodes (26): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, LedgerSelection, VersionedBlock, Boundary, CallRecord (+18 more)

### Community 81 - "transport.test.ts"
Cohesion: 0.08
Nodes (34): Message, MessageType, Ended, rawClient, Escape, publicState, Refused, hexOf() (+26 more)

### Community 82 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 83 - ".from"
Cohesion: 0.06
Nodes (35): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+27 more)

### Community 84 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (31): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+23 more)

### Community 88 - "src/db/postgres.ts"
Cohesion: 0.09
Nodes (35): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, DriverError, Outcome, Role (+27 more)

### Community 9 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (115): Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+107 more)

### Community 91 - "restore-private.ts"
Cohesion: 0.10
Nodes (32): RestoreChain, RestoreSeams, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome, RestoreJob, FileProcess (+24 more)

### Community 92 - "both-backends.test.ts"
Cohesion: 0.10
Nodes (26): ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, freshDatabase(), hashOf(), hex() (+18 more)

### Community 93 - "openPostgres"
Cohesion: 0.10
Nodes (23): Phase, PostgresTestServer, Job, classifyDriverError(), openPostgres(), postgresBackend(), databaseAs(), postgresCliBackend() (+15 more)

### Community 95 - "validation.ts"
Cohesion: 0.06
Nodes (34): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+26 more)

### Community 97 - "column-refusals.test.ts"
Cohesion: 0.09
Nodes (26): CheckedMigration, Case, refuseNonDeterministic(), describeTable(), moduleTables(), catalogRelations(), catalogTables(), compareUtf8() (+18 more)

### Community 98 - "pglite-lock.ts"
Cohesion: 0.09
Nodes (29): CreatedDirectory, EmitWarning, Held, WarningArguments, WarningHook, Job, acquirePgliteLock(), directoryPath() (+21 more)

### Community 99 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (24): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+16 more)

### Community 262 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 56 - "refused"
Cohesion: 0.04
Nodes (56): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 12. When a callback fails, A paused loop on `/status`, A PGlite directory that does not exist (+48 more)

### Community 63 - "table"
Cohesion: 0.05
Nodes (52): hexBytes(), side(), params(), migrations(), table(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights (+44 more)

### Community 101 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 112 - ".slowBlockMs"
Cohesion: 0.07
Nodes (29): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+21 more)

### Community 123 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.06
Nodes (30): deferred(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log, The five stages (+22 more)

### Community 124 - ".off"
Cohesion: 0.06
Nodes (29): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap (+21 more)

### Community 158 - "chain-events-decode.test.ts"
Cohesion: 0.13
Nodes (19): writeEventRows(), canonicalJson(), hexOf(), littleEndian(), insertEventRows(), fill(), le(), merge() (+11 more)

### Community 159 - "boundary.test.ts"
Cohesion: 0.17
Nodes (18): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+10 more)

### Community 172 - "mapping.test.ts"
Cohesion: 0.14
Nodes (7): mapRows(), mapValue(), oid(), identity(), RESULT_COLUMNS, RESULT_TYPES, RFC-3339

### Community 182 - "core-ledger-state.test.ts"
Cohesion: 0.13
Nodes (10): boundLedgerParser(), workerParser(), itemsOf(), retainedStatesOf(), applied(), bound(), query(), refusing() (+2 more)

### Community 189 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 191 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 201 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 206 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 211 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 217 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 225 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 234 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 237 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 238 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.22
Nodes (9): released(), Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears (+1 more)

### Community 242 - ".#startup"
Cohesion: 0.28
Nodes (3): messageOf(), privateLinkOf(), sourceOf()

### Community 248 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.29
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 274 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 275 - "rowProblems"
Cohesion: 0.60
Nodes (6): a114Problems(), a116Problems(), heights(), readProblems(), rowProblems(), writes()

### Community 305 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 316 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 40 - "history"
Cohesion: 0.03
Nodes (73): integer(), history(), n(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()` (+65 more)

### Community 43 - "startUmbraDB"
Cohesion: 0.03
Nodes (62): startUmbraDB(), log(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Problem, 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented, Evidence, Problem, Suggested fix (+54 more)

### Community 54 - ".put"
Cohesion: 0.04
Nodes (56): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+48 more)

### Community 58 - "code"
Cohesion: 0.04
Nodes (56): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+48 more)

### Community 69 - "T"
Cohesion: 0.04
Nodes (49): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+41 more)

### Community 75 - "following"
Cohesion: 0.05
Nodes (46): text(), transportReader(), transportReaderRule(), cursorRead(), following(), api(), Evidence, Suggested fix (+38 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 102 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.05
Nodes (32): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+24 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 127 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 150 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 157 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 168 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 173 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 174 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 176 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (18): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+10 more)

### Community 177 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 178 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 180 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 181 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 190 - "ADDED Requirements"
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

### Community 204 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 205 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 209 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 212 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 214 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 215 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 218 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 219 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 220 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 224 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 226 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 227 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 228 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 229 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 230 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 235 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 236 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 239 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 240 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 243 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 244 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 245 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 247 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 249 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 250 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 251 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 252 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 253 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 254 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 259 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 260 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 261 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 263 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 264 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 265 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 266 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 267 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 268 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 269 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 270 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 271 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 272 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 273 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 276 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 277 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 278 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 279 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 280 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 281 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 282 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 283 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 284 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 285 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 286 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 287 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 288 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 289 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 290 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 291 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 292 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 293 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 294 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 295 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 296 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 297 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 298 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 299 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 300 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 301 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 302 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 303 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 304 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 306 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 307 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 308 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 309 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 310 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 311 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 312 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 313 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 319 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 85 - "README.md"
Cohesion: 0.05
Nodes (34): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:, Backups and status (+26 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 96 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8949`, `RFC-3339` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4031 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `api.ts`, `loop.test.ts`, `runner/process.ts`, `builds.ts`, `FinalizedLoop`, `declaration.ts`, `InMemoryBlockSource`, `core-block-parsed.ts`, `fetch-fixtures.ts`, `chain-process.test.ts`, `tape/index.ts`, `backup-fixtures.ts`, `admin-harness.ts`, `ref_node_fs`, `adapter-fixtures.ts`, `config/history.ts`, `process-admin.ts`, `column-rules.ts`, `core-private-source.test.ts`, `spawnChild`, `host.ts`, `core-transport.ts`, `NodeClient`, `process-backends.ts`, `backup/backup.ts`, `api-server.test.ts`, `records.ts`, `node-format.ts`, `adapter.ts`, `client.test.ts`, `validate.ts`, `LedgerPackage`, `messages.ts`, `record-and-replay.test.ts`, `ledger/ledger-tasks.test.ts`, `UmbraError`, `interfaces/transaction-history-storage.ts`, `channel-checks.test.ts`, `mounted-admin.test.ts`, `ledger/types.ts`, `changes.property.test.ts`, `ingest`, `core-config.test.ts`, `cbor.ts`, `transform-checks.ts`, `slow-block-harness.ts`, `resolve.ts`, `ProcessHandle`, `core-ledger-state.ts`, `guarantees.test.ts`, `browser.test.ts`, `real-tapes.ts`, `containers.test.ts`, `config/plain-data.ts`, `loop-stop-harness.ts`, `default.test.ts`, `pack-install.mjs`, `contract-data-checks.ts`, `core-settings.ts`, `retirement.test.ts`, `writer-lock-checks.ts`, `networks.ts`, `version-checks.ts`, `transport.test.ts`, `file-mode.test.ts`, `src/db/postgres.ts`, `restore-private.ts`, `both-backends.test.ts`, `openPostgres`, `validation.ts`, `column-refusals.test.ts`, `pglite-lock.ts`, `cold-boot-recovery.integration.test.ts`, `core-ledger-state/sql.ts`, `entries.ts`, `release-version.ts`, `browser/build.ts`, `core-digest.ts`, `resolver-boundary.ts`, `cli/command.ts`, `node-fields-harness.ts`, `binding.test.ts`, `package.json`, `documents.ts`, `code-registry.ts`, `read-gate.ts`, `test/postgres/setup.ts`, `crash.test.ts`, `openPglite`, `pg-tx-history-adapter.ts`, `channel-processes.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `chain-data.negative-control.test.ts`, `ledger-table-config.test.ts`, `cbor.property.test.ts`, `chain-events-decode.test.ts`, `boundary.test.ts`, `node-bridge.ts`, `example-checks.ts`, `demo-handlers.test.ts`, `read-timeouts.test.ts`, `ledger-sweep.test.ts`, `harness.ts`, `shims.test.ts`, `block-fetch-decode.test.ts`, `devnet-upgrade.test.ts`, `mapping.test.ts`, `excluded-not-exported.test.ts`, `core-ledger-state.test.ts`, `statementsOf`, `listening.test.ts`, `cursor-table.property.test.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `component-table.test.ts`, `read-height.property.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `LoopPauses`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 19 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.016766467065868262 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `api.ts`, `loop.test.ts`, `runner/process.ts`, `builds.ts`, `FinalizedLoop`, `declaration.ts`, `InMemoryBlockSource`, `core-block-parsed.ts`, `mapping.ts`, `openPglite`, `chain-process.test.ts`, `backup-fixtures.ts`, `admin-harness.ts`, `ref_node_fs`, `fetch-fixtures.ts`, `config/history.ts`, `process-admin.ts`, `tape/index.ts`, `core-private-source.test.ts`, `host.ts`, `core-transport.ts`, `NodeClient`, `vitest`, `backup/backup.ts`, `Writer`, `api-server.test.ts`, `ledger-table-config.test.ts`, `client.test.ts`, `validate.ts`, `range.ts`, `messages.ts`, `read-timeouts.test.ts`, `record-and-replay.test.ts`, `shims.test.ts`, `channel-checks.test.ts`, `mounted-admin.test.ts`, `NodeBlockSource`, `ledger/types.ts`, `changes.property.test.ts`, `mapping.test.ts`, `core-config.test.ts`, `cbor.ts`, `transform-checks.ts`, `module-tables.ts`, `slow-block-harness.ts`, `core-ledger-state.test.ts`, `statementsOf`, `version-table.ts`, `resolve.ts`, `core-ledger-state.ts`, `guarantees.test.ts`, `config-check.ts`, `containers.test.ts`, `config/plain-data.ts`, `graph.ts`, `checkShape`, `start-umbradb.ts`, `writer-lock-checks.ts`, `version-checks.ts`, `src/db/postgres.ts`, `restore-private.ts`, `openPostgres`, `browser/src/config/load.ts`, `sha256`, `validation.ts`, `column-refusals.test.ts`, `pglite-lock.ts`, `ingest-harness.ts`, `Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)`, `binding.test.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `loop.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0194325689856199 - nodes in this community are weakly interconnected._