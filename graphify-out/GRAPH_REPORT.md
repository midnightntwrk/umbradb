# Graph Report - UmbraDB

## Corpus Check
- 1209 files · ~1,717,088 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12611 nodes · 38737 edges · 367 communities (331 shown, 36 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3288 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `60fe4a7f9a5cba61` (1209 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- builds.ts
- process-backends.ts
- validation.ts
- TransactionHistoryStorage
- test/postgres/setup.ts
- listening.test.ts
- signal-backup.test.ts
- browser.test.ts
- release-version.ts
- admin-harness.ts
- redact.ts
- browser/build.ts
- block-fetch-decode.test.ts
- page.ts
- checks.test.ts
- text.test.ts
- .value
- host.ts
- version-checks.ts
- code-registry.ts
- LoopPauses
- paused-harness.ts
- halts.test.ts
- documents.ts
- backup/restore.ts
- crash.test.ts
- networks.ts
- read-gate.ts
- sigterm.test.ts
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- height-versioned.property.test.ts
- example-checks.ts
- check-required-tests.ts
- fetch-fixtures.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- configuration-refusal.test.ts
- surface.test.ts
- ledger-table-config.test.ts
- core-block-commit.test.ts
- fixtures/configuration.ts
- pack-install.mjs
- start-umbradb.test.ts
- HeightRun
- demo-handlers.test.ts
- harness.ts
- adapter-fixtures.ts
- core-block-fetch/metadata.ts
- library-documents.test.ts
- chrome.ts
- transaction-history-storage.property.test.ts
- browser-harness.ts
- ModuleDeclaration
- postgres-tls-server.ts
- network.test.ts
- package-startup-checks.ts
- loop.test.ts
- read-height.property.test.ts
- ws-mutual-tls.test.ts
- checkShape
- validation.test.ts
- src/protocol.ts
- core-block-fetch.test.ts
- networks.test.ts
- config/history.ts
- quiet-host.child.ts
- core.ts
- browser/serve.ts
- stats-module.ts
- Session
- upgrade-boundary.test.ts
- migrate.ts
- NodeClient
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- worker-threads.test.ts
- worker-threads-worker.ts
- backup-fixtures.ts
- .send
- Worker
- Design — Sprint 1: project setup + TemporalKV
- process-build.ts
- RuntimeMetadata
- ledger/plain-data.ts
- ApiRoutes
- sha256
- declaration.ts
- ProcessItems
- TapeAnswers
- worker-output.test.ts
- contract-modules.test.ts
- ref_node_path
- renamed-setting.test.ts
- ledger/types.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- devnet-upgrade.test.ts
- Process
- NodeBlockSource
- range.ts
- adapter.ts
- .read
- runner/process.ts
- PageState
- resolve.ts
- PageApiChannel
- CliBackend
- ApiChannel
- NodeFS
- config-check.ts
- pause-fixtures.ts
- api-server.test.ts
- contract-data-checks.ts
- vitest
- mounted-admin.test.ts
- UmbraError
- transport-faults.test.ts
- api-session.test.ts
- LedgerPackage
- FinalizedLoop
- process-admin.ts
- cli/command.ts
- core-transport.ts
- in-memory-source.ts
- tape/index.ts
- private-transport.ts
- PgTransactionHistoryStorage
- column-rules.ts
- startProcess
- cold-boot-recovery.integration.test.ts
- backup/backup.ts
- interfaces/transaction-history-storage.ts
- private/lockstep-wait.test.ts
- client.test.ts
- slow-block-harness.ts
- column-rules.test.ts
- start-umbradb.ts
- src/db/postgres.ts
- boundary.test.ts
- channels.ts
- writer-lock-checks.ts
- chain-process.test.ts
- channel-queue.test.ts
- core-ledger-state.ts
- graph.ts
- node-bridge.ts
- cbor.ts
- retirement.test.ts
- mapping.ts
- InMemoryBlockSource
- openPostgres
- .from
- file-mode.test.ts
- opt-out.test.ts
- refused-configuration.test.ts
- connectChannel
- startup-stop-harness.ts
- messages.ts
- pglite-lock.ts
- node-fields-harness.ts
- validate.ts
- config/plain-data.ts
- core-block-parsed.ts
- containers.test.ts
- resolver-boundary.ts
- restore-private.ts
- recovery.test.ts
- PrivateLinkChannel
- cbor.property.test.ts
- Design — Sprint 3: CheckpointStore
- .configHash
- refused
- graph.py
- .cwd
- T
- process-worker.ts
- .slowBlockMs
- mutation-per-adapter.mjs
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- twox.ts
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- midnight-env — reproducible PREPROD dev environment
- Requirement: BK-1 Backup
- .boolean
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- selectLedgerVersion
- crash-worker.ts
- startUmbraDB
- history
- code
- .put
- version
- ADDED Requirements
- .off
- data
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- ADDED Requirements
- ADDED Requirements
- devDependencies
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
- README.md
- UmbraDB and SLSA — supply-chain integrity assessment
- Design — Sprint 4: Watermarks
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Boundaries, threats and controls
- Requirement: CF-4 Every field is data, operational or secret
- Design — v1.0.0-infosec-signoff
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- [0.10.0] - 2026-10-27
- scoped-review-manifest
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
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
- UmbraDB node architecture
- The laws of UmbraDB's storage helpers
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 4: Watermarks
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
- 00023 — The blocks table's height partitions end at 5,000,000
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask
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
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- bug-report.md
- feature-request.md
- Requirement: RN-16 Chain-data reads name their view and height
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Test wallets
- Requirement: RN-13 SIGTERM stops cleanly
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 414 edges
2. `UmbraError` - 346 edges
3. `ModuleDeclaration` - 197 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `startUmbraDB()` - 103 edges
9. `Database` - 101 edges
10. `ReadHandle` - 92 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (367 total, 36 thin omitted)

### Community 0 - "builds.ts"
Cohesion: 0.02
Nodes (168): PrivateIntakeOptions, DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, Keeping, A165Options, a165Run (+160 more)

### Community 1 - "process-backends.ts"
Cohesion: 0.03
Nodes (193): BlockParsed, Manifest, Restored, itemsSeen, FixtureRun, ingest, IngestOptions, SourceClass (+185 more)

### Community 10 - "validation.ts"
Cohesion: 0.02
Nodes (135): CoreLedgerVersion, LedgerPackageIdentity, LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader (+127 more)

### Community 100 - "TransactionHistoryStorage"
Cohesion: 0.06
Nodes (35): TransactionHistoryStorage, reason(), 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it, Evidence, Problem, Suggested fix, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import (+27 more)

### Community 101 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 102 - "listening.test.ts"
Cohesion: 0.07
Nodes (26): RunOptions, RunSeams, SignalSource, stopSignal, EngineInput, UserModulesSource, ChannelCoreOptions, ChannelPrivateOptions (+18 more)

### Community 103 - "signal-backup.test.ts"
Cohesion: 0.08
Nodes (30): ImportedConfig, LoadOptions, WORKER, SignalEvent, SignalJob, configModules(), configModuleUrl(), configPath() (+22 more)

### Community 105 - "browser.test.ts"
Cohesion: 0.08
Nodes (36): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+28 more)

### Community 108 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 11 - "admin-harness.ts"
Cohesion: 0.03
Nodes (127): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer, AdminSnapshot (+119 more)

### Community 111 - "redact.ts"
Cohesion: 0.10
Nodes (28): RedactionForms, SecretForm, TextPattern, Needs, findings(), databaseText(), isMemoryDatabase(), configRedactor() (+20 more)

### Community 112 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 114 - "block-fetch-decode.test.ts"
Cohesion: 0.10
Nodes (26): ExtrinsicCall, MetadataPallet, PalletSpec, blake2b256(), compress(), rotateRight(), words(), blockTimeOf() (+18 more)

### Community 115 - "page.ts"
Cohesion: 0.08
Nodes (29): LinkRecord, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp(), beginCore(), element() (+21 more)

### Community 117 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+14 more)

### Community 118 - "text.test.ts"
Cohesion: 0.10
Nodes (21): MetaCommands, Piece, State, StatementSplitter, createReadStream(), formatUnknown(), dumpLines(), checkStatement() (+13 more)

### Community 119 - ".value"
Cohesion: 0.15
Nodes (15): MetadataField, MetadataType, Primitive, ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), littleEndian() (+7 more)

### Community 12 - "host.ts"
Cohesion: 0.03
Nodes (106): TransactionParser, CoreLedgerStateOptions, LedgerStateItem, RetainedState, LedgerName, ApplyOutput, ChainOutcome, LedgerTask (+98 more)

### Community 121 - "version-checks.ts"
Cohesion: 0.11
Nodes (22): MetadataNode, VersionedBlock, Boundary, CallRecord, MetadataSelector, Select, UpgradeCase, Walk (+14 more)

### Community 122 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 125 - "LoopPauses"
Cohesion: 0.08
Nodes (17): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 127 - "paused-harness.ts"
Cohesion: 0.14
Nodes (24): ReadOnlyDatabase, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, keepingPause() (+16 more)

### Community 128 - "halts.test.ts"
Cohesion: 0.09
Nodes (28): ProcessingEnd, ProcessStatus, Q142Observation, A43Case, A43Observation, CursorElsewhere, Halt, Outcome (+20 more)

### Community 129 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 13 - "backup/restore.ts"
Cohesion: 0.03
Nodes (96): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport (+88 more)

### Community 130 - "crash.test.ts"
Cohesion: 0.11
Nodes (24): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+16 more)

### Community 132 - "networks.ts"
Cohesion: 0.08
Nodes (27): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+19 more)

### Community 133 - "read-gate.ts"
Cohesion: 0.14
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 134 - "sigterm.test.ts"
Cohesion: 0.11
Nodes (23): Job, WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent, report() (+15 more)

### Community 136 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.08
Nodes (21): ReadPool, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider) (+13 more)

### Community 137 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 138 - "example-checks.ts"
Cohesion: 0.15
Nodes (19): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+11 more)

### Community 139 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 14 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (121): NodeCallOptions, ProcessCondition, Scenario, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock (+113 more)

### Community 140 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 141 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 144 - "configuration-refusal.test.ts"
Cohesion: 0.14
Nodes (21): ConfigFinding, ReasonCode, Unwrapped, findingText(), refusalFindings(), configurationFindings(), configurationRefusalLines(), isConfigurationRefusal() (+13 more)

### Community 145 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 149 - "ledger-table-config.test.ts"
Cohesion: 0.17
Nodes (20): CountingNode, Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked() (+12 more)

### Community 15 - "core-block-commit.test.ts"
Cohesion: 0.03
Nodes (109): BlockRow, MigrationPart, SchemaModule, SchemaPlan, ProcessContext, ResolvedGraph, LoopInput, ApiStartup (+101 more)

### Community 150 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (17): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, databaseOf(), coreConfiguration(), param() (+9 more)

### Community 151 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 152 - "start-umbradb.test.ts"
Cohesion: 0.14
Nodes (16): ModuleListRule, GoneCwdResult, moduleListProblems(), closedByItself(), hostile(), optionProblems(), throwing(), problemsOf() (+8 more)

### Community 154 - "HeightRun"
Cohesion: 0.10
Nodes (9): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, WaitsInTransaction (+1 more)

### Community 155 - "demo-handlers.test.ts"
Cohesion: 0.15
Nodes (17): Compared, ConnectSeen, PortPeer, comparedOfExchange(), comparedOfResponse(), connected(), engineOf(), fetchProblems() (+9 more)

### Community 156 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 16 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (112): ApplyInput, StoredNode, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot (+104 more)

### Community 160 - "core-block-fetch/metadata.ts"
Cohesion: 0.29
Nodes (14): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 161 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 163 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 164 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 168 - "browser-harness.ts"
Cohesion: 0.25
Nodes (17): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+9 more)

### Community 17 - "ModuleDeclaration"
Cohesion: 0.03
Nodes (108): ModuleDeclaration, PointName, HeightRange, ResolvedRange, BlockItems, LateUse, Callback, CallbackFailure (+100 more)

### Community 170 - "postgres-tls-server.ts"
Cohesion: 0.16
Nodes (13): SslMode, driverConnectionOptions, PostgresConnection, TlsPostgres, makeCertificates(), startTlsPostgres(), noHeight(), readError() (+5 more)

### Community 172 - "network.test.ts"
Cohesion: 0.24
Nodes (14): NetworkRuleName, Parsed, Expected, schemaCase(), commandRefusalProblems(), listeningSockets(), portFree(), refusedProblems() (+6 more)

### Community 174 - "package-startup-checks.ts"
Cohesion: 0.16
Nodes (13): ChangedFile, GenesisFixture, installationCopy, StartPackageProcess, expectWorkerChecks(), genesisOf(), hex(), withoutCheck() (+5 more)

### Community 18 - "loop.test.ts"
Cohesion: 0.03
Nodes (112): EntryRange, GraphInput, CommitOutcome, HeldHeight, LockstepWait, PastFaultCase, RefusalCase, Contexts (+104 more)

### Community 180 - "read-height.property.test.ts"
Cohesion: 0.17
Nodes (11): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+3 more)

### Community 182 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 183 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 184 - "validation.test.ts"
Cohesion: 0.16
Nodes (12): DeclarationRule, Case, ShapeCase, Stats, validateWith(), failures(), loose(), refusal() (+4 more)

### Community 185 - "src/protocol.ts"
Cohesion: 0.17
Nodes (10): ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker, hexOf() (+2 more)

### Community 188 - "core-block-fetch.test.ts"
Cohesion: 0.14
Nodes (6): LedgerTable, coreBlockFetchOnFetch(), isBlockItemSource(), chainBackbone(), CORE_BLOCK_ITEMS, KNOWN_NETWORKS

### Community 189 - "networks.test.ts"
Cohesion: 0.15
Nodes (11): Answers, File, FormatRow, FoundTape, Tape, H(), validFile(), BUILT_IN_NETWORKS (+3 more)

### Community 19 - "config/history.ts"
Cohesion: 0.03
Nodes (121): OpenedFacts, CoreVersion, CoreSettings, versionEntry, ConfigHashRow, HistoryCode, HistoryFinding, HistoryInput (+113 more)

### Community 190 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 191 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 192 - "browser/serve.ts"
Cohesion: 0.21
Nodes (10): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), CONTENT_TYPES (+2 more)

### Community 193 - "stats-module.ts"
Cohesion: 0.26
Nodes (11): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+3 more)

### Community 198 - "Session"
Cohesion: 0.21
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 199 - "upgrade-boundary.test.ts"
Cohesion: 0.21
Nodes (12): A47Observation, CommitsTheBoundary, Controls, Version, a47Problems(), a47Run(), big(), buildOf() (+4 more)

### Community 2 - "migrate.ts"
Cohesion: 0.02
Nodes (162): Transaction, AppliedRow, Runnable, Settling, StartupInput, MultiStatementRunner, Difference, OwnPart (+154 more)

### Community 20 - "NodeClient"
Cohesion: 0.04
Nodes (73): NodeSourceOptions, CoreChainBinding, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending (+65 more)

### Community 201 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 202 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 203 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 207 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 21 - "backup-fixtures.ts"
Cohesion: 0.04
Nodes (84): CheckStep, BackupBackend, BackupDatabase, killedRestore, TickerConfig, TickerHandle, cliProject, CheckTarget (+76 more)

### Community 219 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.20
Nodes (10): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+2 more)

### Community 22 - "process-build.ts"
Cohesion: 0.04
Nodes (84): MountedAdminAnswer, adminRoutes, AdminEndpoint, AdminPart, AdminView, ChainView, InstanceStatus, ItemView (+76 more)

### Community 221 - "RuntimeMetadata"
Cohesion: 0.24
Nodes (4): RuntimeMetadata, contentStateOf(), hexOf(), walkOver()

### Community 222 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 223 - "ApiRoutes"
Cohesion: 0.31
Nodes (6): ApiRoutes, parsePath(), shapeOf(), routesOf(), api(), routesOf()

### Community 224 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 23 - "declaration.ts"
Cohesion: 0.04
Nodes (74): BlockWriteHandle, ReadHandle, SchemaWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+66 more)

### Community 236 - "TapeAnswers"
Cohesion: 0.40
Nodes (6): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), devnetUpgradeOf(), isCall()

### Community 237 - "worker-output.test.ts"
Cohesion: 0.22
Nodes (8): Seen, noisy(), outputProblems(), ADMIN_ENTRY, LEDGER_ENTRY, LOGGED, PGLITE_MEMORY, WRITTEN

### Community 24 - "contract-modules.test.ts"
Cohesion: 0.04
Nodes (85): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+77 more)

### Community 25 - "ref_node_path"
Cohesion: 0.03
Nodes (79): Served, ParentJob, Kill, Orphaned, SourceFile, Run, WorkerEvent, LockResult (+71 more)

### Community 254 - "renamed-setting.test.ts"
Cohesion: 0.39
Nodes (6): Renamed, databaseOf(), dataOf(), escaped(), fileOf(), FINDING()

### Community 26 - "ledger/types.ts"
Cohesion: 0.04
Nodes (76): LoadLedger, ManifestLine, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerPackageOptions, V9Logs, LedgerPin (+68 more)

### Community 263 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "devnet-upgrade.test.ts"
Cohesion: 0.05
Nodes (65): Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch (+57 more)

### Community 28 - "Process"
Cohesion: 0.04
Nodes (23): ProcessAdmin, BlockSource, SourceNodeView, ProcessReason, PauseHold, Opened, Process, withNetwork() (+15 more)

### Community 29 - "NodeBlockSource"
Cohesion: 0.04
Nodes (41): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, CoreBlockItems, HeadWait, NodeBlockSource, Prefetch (+33 more)

### Community 3 - "range.ts"
Cohesion: 0.02
Nodes (146): NodeClientOptions, ConnectSocket, Outage, Refusal, Metadata, Step, FindTapeOptions, ReportedTest (+138 more)

### Community 30 - "adapter.ts"
Cohesion: 0.03
Nodes (76): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+68 more)

### Community 31 - ".read"
Cohesion: 0.04
Nodes (89): TableDigest, TableDigestRow, CapturedTable, ChangeKind, tableChanges, TouchedRow, ChainOptions, DigestRow (+81 more)

### Community 32 - "runner/process.ts"
Cohesion: 0.03
Nodes (75): AdminSeams, Bound, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait, WaitingListener, ConfigRow (+67 more)

### Community 33 - "resolve.ts"
Cohesion: 0.04
Nodes (88): EntryView, plainData, ConfigContext, EntryView, AddressRequest, Asked, LinkPlan, NetworkInput (+80 more)

### Community 34 - "config-check.ts"
Cohesion: 0.04
Nodes (80): ConfigFacts, BackupInput, RestoreBase, BackupText, Environment, BackupCommandOptions, BackupOutcome, CommandBuildOptions (+72 more)

### Community 35 - "pause-fixtures.ts"
Cohesion: 0.04
Nodes (71): backupSignalRelay, BackupSignals, BackupOnSignal, LoopClass, Pausable, PausableConfig, PausableOptions, RecorderGlobals (+63 more)

### Community 36 - "api-server.test.ts"
Cohesion: 0.04
Nodes (69): ApiRegistry, ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode, ApiRequest, HttpHandler, HttpMethod (+61 more)

### Community 37 - "contract-data-checks.ts"
Cohesion: 0.05
Nodes (80): CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx (+72 more)

### Community 38 - "vitest"
Cohesion: 0.03
Nodes (57): ProcessObservation, StartVia, Lockfile, Manifest, RepositoryFile, Upstream, Leftover, RemovedName (+49 more)

### Community 39 - "mounted-admin.test.ts"
Cohesion: 0.05
Nodes (66): gate, SecretHashes, SecretVariant, Expected, SubscriptionSeen, Client, Exchanged, MapiHooks (+58 more)

### Community 4 - "UmbraError"
Cohesion: 0.02
Nodes (120): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, PgliteLockUse, BackupFacts, DumpInput (+112 more)

### Community 41 - "transport-faults.test.ts"
Cohesion: 0.05
Nodes (59): CoreTransport, CoreTransportOptions, CoreSessionOptions, TransportTls, Message, PrivateSocketTransportOptions, SocketLimits, Ended (+51 more)

### Community 42 - "api-session.test.ts"
Cohesion: 0.06
Nodes (69): coreHeaders, HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions (+61 more)

### Community 43 - "LedgerPackage"
Cohesion: 0.05
Nodes (41): LedgerPackage, LedgerEngine, StagenetBlockJson, StagenetFixtureJson, stagenetReplay, hexOf(), idOf(), same() (+33 more)

### Community 44 - "FinalizedLoop"
Cohesion: 0.06
Nodes (18): Activity, FinalizedLoop, LoopObserver, Startup, SkipsLockstep, WaitingInRead, FailingAfter, call() (+10 more)

### Community 45 - "process-admin.ts"
Cohesion: 0.05
Nodes (67): NetworkShown, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdminOptions, RevisionSettings, DigestRow, ModuleFacts (+59 more)

### Community 46 - "cli/command.ts"
Cohesion: 0.05
Nodes (55): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, CommandResult, RunningCommand, statsConfig, backupArguments() (+47 more)

### Community 47 - "core-transport.ts"
Cohesion: 0.04
Nodes (38): CoreChannelsOptions, Queued, Connected, CoreLink, coreSessions, InstanceView, LinkConnection, LinkSession (+30 more)

### Community 49 - "in-memory-source.ts"
Cohesion: 0.05
Nodes (42): UmbraDBHandle, InMemoryItems, Wait, CloseHelper, Hold, Signal, Job, Run (+34 more)

### Community 5 - "tape/index.ts"
Cohesion: 0.03
Nodes (126): LoopStopScenario, Recorded, Failure, Variant, Link, TapeBuilderOptions, RecordingError, RecordingProblem (+118 more)

### Community 50 - "private-transport.ts"
Cohesion: 0.06
Nodes (35): PrivateLinkConnect, PublicSide, LinkTimers, CoreChannelSeams, Received, TransportLimits, HelloAck, JsonValue (+27 more)

### Community 51 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (45): MergeEntriesFn, TransactionHistoryEntry, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, encodeStoredEntry(), rowToEntry(), abortErrorLike(), capitalize() (+37 more)

### Community 52 - "column-rules.ts"
Cohesion: 0.04
Nodes (67): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+59 more)

### Community 53 - "startProcess"
Cohesion: 0.07
Nodes (43): testBuild, A42Observation, Seen, Hold, NoRedelivery, Phase, counted(), processOn() (+35 more)

### Community 54 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.07
Nodes (42): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed() (+34 more)

### Community 57 - "backup/backup.ts"
Cohesion: 0.06
Nodes (48): BackupSeams, BackupTarget, BackupWritten, ManifestHistoryRow, ManifestMigration, ManifestTool, PgliteDump, SnapshotSeams (+40 more)

### Community 58 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (39): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, JsonEncoded (+31 more)

### Community 59 - "private/lockstep-wait.test.ts"
Cohesion: 0.06
Nodes (39): LockstepCondition, OpenTransaction, A118Observation, MismatchObservation, ExpectedWait, WaitSample, HeldLink, HoldingRelay (+31 more)

### Community 6 - "client.test.ts"
Cohesion: 0.02
Nodes (81): heldClock, HandSocket, HandSockets, Answer, FakeNode, Handler, Received, recorded (+73 more)

### Community 60 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (48): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+40 more)

### Community 61 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+24 more)

### Community 62 - "start-umbradb.ts"
Cohesion: 0.09
Nodes (51): readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork, UmbraDBOptions, UmbraDBReason (+43 more)

### Community 64 - "src/db/postgres.ts"
Cohesion: 0.07
Nodes (38): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, DriverError, Outcome, Role (+30 more)

### Community 65 - "boundary.test.ts"
Cohesion: 0.08
Nodes (43): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+35 more)

### Community 66 - "channels.ts"
Cohesion: 0.05
Nodes (39): demoLink, EndpointOptions, Envelope, MessagePortLike, onLink(), parseJsonLossless(), exceedsUtf8(), hasKeys() (+31 more)

### Community 67 - "writer-lock-checks.ts"
Cohesion: 0.09
Nodes (40): WriterProcess, WorkerEvent, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf(), startWriterProcess() (+32 more)

### Community 68 - "chain-process.test.ts"
Cohesion: 0.06
Nodes (38): WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing, Flaky (+30 more)

### Community 69 - "channel-queue.test.ts"
Cohesion: 0.08
Nodes (39): PeerEnd, PeerMessage, rawPeer, TestEnd, TestEndOptions, Logged, QueueRun, confinedCore() (+31 more)

### Community 7 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (124): BlockLedgerSource, LedgerBinding, retainedStates, CoreRevision, StateRow, StoredState, GreyPicker, GreyView (+116 more)

### Community 70 - "graph.ts"
Cohesion: 0.07
Nodes (46): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+38 more)

### Community 72 - "node-bridge.ts"
Cohesion: 0.07
Nodes (31): ChildReader, Thread, BridgeServer, bridgeStore, Growable, childRefKeys(), readChildren(), bridgeMemory() (+23 more)

### Community 73 - "cbor.ts"
Cohesion: 0.09
Nodes (38): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+30 more)

### Community 74 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 75 - "mapping.ts"
Cohesion: 0.07
Nodes (33): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+25 more)

### Community 76 - "InMemoryBlockSource"
Cohesion: 0.08
Nodes (24): QueuedBlock, BlockRef, InMemoryBlockSource, InMemorySourceOptions, Flaky, Fetching, Recorder, LateRedelivery (+16 more)

### Community 77 - "openPostgres"
Cohesion: 0.09
Nodes (26): PostgresOptions, Phase, PostgresTestDatabase, PostgresTestServer, Job, openPostgres(), postgresBackend(), databaseAs() (+18 more)

### Community 78 - ".from"
Cohesion: 0.06
Nodes (35): Buffer, BufferEncoding, Hash, FixtureNode, FakeState, RefusalData, bytesOfText(), charCodes() (+27 more)

### Community 79 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (31): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+23 more)

### Community 8 - "opt-out.test.ts"
Cohesion: 0.03
Nodes (118): CaptureColumn, CaptureState, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+110 more)

### Community 80 - "refused-configuration.test.ts"
Cohesion: 0.08
Nodes (33): EngineConfig, ProcessHandle, Refusal, Start, codeOnly(), commandProblems(), declarationsOf(), endedProblems() (+25 more)

### Community 81 - "connectChannel"
Cohesion: 0.07
Nodes (29): SubscriptionCarrier, SubscriptionConnection, discard(), isChannel(), connectChannel(), errorMessage(), socketConnection(), fault() (+21 more)

### Community 82 - "startup-stop-harness.ts"
Cohesion: 0.08
Nodes (32): A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StartVia, stopBy, StopHandle (+24 more)

### Community 83 - "messages.ts"
Cohesion: 0.06
Nodes (36): Committed, MessageFault, MessageType, instanceIdSchema(), bytesOf(), decodeParameter(), decodeValue(), describe() (+28 more)

### Community 84 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (33): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, ChildResult (+25 more)

### Community 87 - "node-fields-harness.ts"
Cohesion: 0.07
Nodes (31): AdminStarter, LockstepInstance, AdminRunOptions, Validator, A168Observation, A168Phase, A168RunOptions, Expected (+23 more)

### Community 88 - "validate.ts"
Cohesion: 0.09
Nodes (39): ConfigRule, CursorRule, Finding, Issue, Plain, SettingsSchema, coreSettingsSchema(), pathOf() (+31 more)

### Community 89 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (31): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, copyArray(), copyObject() (+23 more)

### Community 9 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (143): BlockEventSource, MetadataVariant, RuntimeMetadataView, BlockParsedOptions, BlockTransaction, ChainTransaction, ChainEvent, EventPhase (+135 more)

### Community 90 - "containers.test.ts"
Cohesion: 0.07
Nodes (29): BenchEnv, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer() (+21 more)

### Community 93 - "resolver-boundary.ts"
Cohesion: 0.08
Nodes (35): Finding, Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve() (+27 more)

### Community 94 - "restore-private.ts"
Cohesion: 0.09
Nodes (31): RestoreChain, RestoreSeams, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome, RestoreJob, FileProcess (+23 more)

### Community 95 - "recovery.test.ts"
Cohesion: 0.08
Nodes (28): Armed, CommitArm, CommitFault, CommitProxy, Pair, AlwaysLanded, AlwaysLost, DropsHeld (+20 more)

### Community 98 - "PrivateLinkChannel"
Cohesion: 0.11
Nodes (11): ChannelEndpoint, EndpointEvents, PrivateLinkChannel, CoreChannels, Link, controlEnvelope(), messageEnvelope(), refuseChannel() (+3 more)

### Community 99 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (37): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+29 more)

### Community 157 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.10
Nodes (19): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions (+11 more)

### Community 205 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 48 - "refused"
Cohesion: 0.04
Nodes (67): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+59 more)

### Community 106 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 113 - ".cwd"
Cohesion: 0.08
Nodes (28): join(), normalize(), resolve(), log(), delimiter, sep, 00067 — `startUmbraDB` throws synchronously when the host's working directory no longer exists, Evidence (+20 more)

### Community 153 - "T"
Cohesion: 0.10
Nodes (21): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 0. Schema (+13 more)

### Community 169 - "process-worker.ts"
Cohesion: 0.18
Nodes (13): withDevelopmentOptIn(), answer(), backUp(), connectLink(), coreCommittedHeight(), openedProcess(), post(), restoreInto() (+5 more)

### Community 181 - ".slowBlockMs"
Cohesion: 0.17
Nodes (13): 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix, 00043 — slow-block-outside.negative-control.test.ts's 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+5 more)

### Community 187 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 194 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (12): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+4 more)

### Community 200 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 209 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 215 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 242 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 245 - "Requirement: BK-1 Backup"
Cohesion: 0.22
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 252 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 256 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 265 - "selectLedgerVersion"
Cohesion: 0.52
Nodes (7): blockNamed(), checkPins(), hexOf(), isMnsvItem(), ledgerOfSpecVersion(), mnsvSpecVersion(), selectLedgerVersion()

### Community 337 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 40 - "startUmbraDB"
Cohesion: 0.03
Nodes (75): backupAtStop(), text(), transportReader(), transportReaderRule(), startUmbraDB(), libraryCore(), readerOf(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever (+67 more)

### Community 55 - "history"
Cohesion: 0.04
Nodes (56): integer(), history(), Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Scenario: A call with an already-aborted signal is rejected before any database work, Scenario: A label given at save time is returned by history and load, Scenario: A signal aborting after the call has begun does not interrupt it (+48 more)

### Community 56 - "code"
Cohesion: 0.04
Nodes (57): code(), Added, 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit (+49 more)

### Community 63 - ".put"
Cohesion: 0.04
Nodes (48): coreTxResultsOnParse(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+40 more)

### Community 71 - "version"
Cohesion: 0.05
Nodes (45): deferred(), version(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log (+37 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 96 - ".off"
Cohesion: 0.05
Nodes (38): 0. Baseline, decisions and open questions, 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 14. External claims and their evidence (+30 more)

### Community 97 - "data"
Cohesion: 0.06
Nodes (41): params(), data(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations (+33 more)

### Community 104 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning, Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune (+27 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 123 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points, Requirement: RN-2 The runner does only its five duties (+22 more)

### Community 126 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 143 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 146 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (25): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+17 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 159 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 162 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric` (+12 more)

### Community 165 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 171 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 173 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 175 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.12
Nodes (11): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+3 more)

### Community 176 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.12
Nodes (16): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node only the batch references, Scenario: A node queued and referenced again is kept, Scenario: A re-inserted node changes no count (+8 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker (+8 more)

### Community 179 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 186 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 196 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 197 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 204 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 206 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 208 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 210 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 212 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 213 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 216 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 217 - "README.md"
Cohesion: 0.29
Nodes (3): Choosing a database, Launching it, stats-module

### Community 218 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 220 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 225 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 226 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 227 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 228 - "Boundaries, threats and controls"
Cohesion: 0.20
Nodes (10): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+2 more)

### Community 229 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-4 Every field is data, operational or secret, Scenario: A function in the configuration, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: A user module from the configuration file, Scenario: Two `core` revisions with different databases (+1 more)

### Community 230 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 231 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.20
Nodes (9): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Full-sync soak + load-under-prune (G10), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Postgres-kill mid-save + retry contract (G9 / T2), Process-kill mid-save (G9 / T1) (+1 more)

### Community 232 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 233 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 234 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 238 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 239 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 240 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 241 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 243 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Restore on the other backend, Spec delta — `backups` capability

### Community 244 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 246 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 247 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.22
Nodes (8): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution, Design — v1.0.0-perf-baseline

### Community 248 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 249 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 250 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 251 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 253 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 255 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 257 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 258 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 259 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 260 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 261 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 262 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 264 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 267 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 268 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 269 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 270 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 271 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 272 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 273 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 274 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.33
Nodes (6): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers

### Community 275 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 276 - "Proposal — Sprint 4: Watermarks"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes, Why

### Community 277 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 278 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 279 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 280 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 281 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 282 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 283 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 284 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 285 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 286 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 287 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 288 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 289 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 290 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 291 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 292 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 293 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 294 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 295 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 296 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 297 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 298 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 299 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 300 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 301 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 302 - "00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask"
Cohesion: 0.40
Nodes (4): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix

### Community 303 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 304 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 305 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 306 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 307 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 308 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 309 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 310 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 311 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 312 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 313 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 314 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 315 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 316 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 317 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 318 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 319 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Problem, Suggested fix

### Community 320 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 321 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 322 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 323 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 324 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 326 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 327 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 328 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 329 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 330 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 331 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 332 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.50
Nodes (4): Requirement: RN-13 SIGTERM stops cleanly, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable, Scenario: SIGTERM while the loop waits on an unreachable node

### Community 333 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 334 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 341 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-7693`, `RFC-7693`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4178 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `builds.ts`, `process-backends.ts`, `migrate.ts`, `range.ts`, `UmbraError`, `tape/index.ts`, `client.test.ts`, `core-ledger-state.ts`, `opt-out.test.ts`, `core-block-parsed.ts`, `validation.ts`, `admin-harness.ts`, `host.ts`, `backup/restore.ts`, `fetch-fixtures.ts`, `core-block-commit.test.ts`, `adapter-fixtures.ts`, `ModuleDeclaration`, `loop.test.ts`, `config/history.ts`, `NodeClient`, `backup-fixtures.ts`, `process-build.ts`, `declaration.ts`, `contract-modules.test.ts`, `ref_node_path`, `ledger/types.ts`, `devnet-upgrade.test.ts`, `NodeBlockSource`, `adapter.ts`, `.read`, `runner/process.ts`, `resolve.ts`, `pause-fixtures.ts`, `api-server.test.ts`, `contract-data-checks.ts`, `mounted-admin.test.ts`, `transport-faults.test.ts`, `api-session.test.ts`, `LedgerPackage`, `process-admin.ts`, `cli/command.ts`, `core-transport.ts`, `in-memory-source.ts`, `private-transport.ts`, `startProcess`, `cold-boot-recovery.integration.test.ts`, `backup/backup.ts`, `interfaces/transaction-history-storage.ts`, `private/lockstep-wait.test.ts`, `slow-block-harness.ts`, `column-rules.test.ts`, `start-umbradb.ts`, `src/db/postgres.ts`, `boundary.test.ts`, `channels.ts`, `writer-lock-checks.ts`, `chain-process.test.ts`, `channel-queue.test.ts`, `node-bridge.ts`, `retirement.test.ts`, `mapping.ts`, `openPostgres`, `file-mode.test.ts`, `refused-configuration.test.ts`, `startup-stop-harness.ts`, `messages.ts`, `pglite-lock.ts`, `node-fields-harness.ts`, `config/plain-data.ts`, `containers.test.ts`, `resolver-boundary.ts`, `restore-private.ts`, `recovery.test.ts`, `cbor.property.test.ts`, `test/postgres/setup.ts`, `listening.test.ts`, `signal-backup.test.ts`, `browser.test.ts`, `release-version.ts`, `redact.ts`, `browser/build.ts`, `block-fetch-decode.test.ts`, `checks.test.ts`, `text.test.ts`, `version-checks.ts`, `code-registry.ts`, `LoopPauses`, `package.json`, `halts.test.ts`, `documents.ts`, `crash.test.ts`, `read-gate.ts`, `sigterm.test.ts`, `height-versioned.property.test.ts`, `example-checks.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `configuration-refusal.test.ts`, `surface.test.ts`, `ledger-table-config.test.ts`, `start-umbradb.test.ts`, `demo-handlers.test.ts`, `harness.ts`, `library-documents.test.ts`, `transaction-history-storage.property.test.ts`, `excluded-not-exported.test.ts`, `postgres-tls-server.ts`, `network.test.ts`, `package-startup-checks.ts`, `read-height.property.test.ts`, `ws-mutual-tls.test.ts`, `validation.test.ts`, `mutation-per-adapter.mjs`, `core-block-fetch.test.ts`, `networks.test.ts`, `upgrade-boundary.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `facade-merge-loader.ts`, `ledger/plain-data.ts`, `worker-output.test.ts`, `renamed-setting.test.ts`?**
  _High betweenness centrality (0.241) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-7693`, `RFC-7693` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `builds.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.023228915662650604 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `builds.ts`, `process-backends.ts`, `migrate.ts`, `range.ts`, `tape/index.ts`, `client.test.ts`, `core-ledger-state.ts`, `opt-out.test.ts`, `validation.ts`, `admin-harness.ts`, `host.ts`, `backup/restore.ts`, `fetch-fixtures.ts`, `core-block-commit.test.ts`, `ModuleDeclaration`, `loop.test.ts`, `config/history.ts`, `NodeClient`, `backup-fixtures.ts`, `process-build.ts`, `declaration.ts`, `contract-modules.test.ts`, `ledger/types.ts`, `Process`, `NodeBlockSource`, `.read`, `runner/process.ts`, `resolve.ts`, `config-check.ts`, `pause-fixtures.ts`, `api-server.test.ts`, `contract-data-checks.ts`, `vitest`, `mounted-admin.test.ts`, `startUmbraDB`, `transport-faults.test.ts`, `FinalizedLoop`, `process-admin.ts`, `core-transport.ts`, `refused`, `in-memory-source.ts`, `private-transport.ts`, `startProcess`, `backup/backup.ts`, `private/lockstep-wait.test.ts`, `slow-block-harness.ts`, `start-umbradb.ts`, `src/db/postgres.ts`, `writer-lock-checks.ts`, `chain-process.test.ts`, `channel-queue.test.ts`, `graph.ts`, `version`, `cbor.ts`, `mapping.ts`, `InMemoryBlockSource`, `openPostgres`, `refused-configuration.test.ts`, `pglite-lock.ts`, `validate.ts`, `config/plain-data.ts`, `restore-private.ts`, `signal-backup.test.ts`, `checks.test.ts`, `text.test.ts`, `version-checks.ts`, `halts.test.ts`, `configuration-refusal.test.ts`, `ledger-table-config.test.ts`, `postgres-tls-server.ts`, `checkShape`, `validation.test.ts`, `Session`, `upgrade-boundary.test.ts`, `browser/src/config/load.ts`, `RuntimeMetadata`, `ApiRoutes`, `sha256`, `renamed-setting.test.ts`, `selectLedgerVersion`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `process-backends.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.028444850743644737 - nodes in this community are weakly interconnected._