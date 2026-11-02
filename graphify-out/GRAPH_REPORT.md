# Graph Report - UmbraDB

## Corpus Check
- 1193 files · ~1,690,933 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12459 nodes · 38439 edges · 342 communities (309 shown, 33 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3229 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `fd6d95ea999abc2f` (1193 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- core-config.test.ts
- startUmbraDB
- config/history.ts
- paused-harness.ts
- startup-stop-harness.ts
- browser.test.ts
- core-contract-logs-fast.ts
- validation.ts
- private/lockstep-wait.test.ts
- fetch-fixtures.ts
- zod
- core-ledger-state/sql.ts
- release-version.ts
- browser/build.ts
- pg-tx-history-adapter.ts
- ChannelEndpoint
- column-rules.ts
- version-checks.ts
- node-bridge.ts
- PointName
- transaction-history-storage.property.test.ts
- ledger-sweep.test.ts
- config-check-database.test.ts
- resolver-boundary.ts
- FinalizedLoop
- height-versioned.property.test.ts
- node-fields-harness.ts
- documents.ts
- code-registry.ts
- loop.test.ts
- readiness.test.ts
- read-gate.ts
- core.ts
- relays.ts
- TransactionHistoryStorage
- CheckedEntry
- restore-private.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- backup/restore.ts
- threat-model.test.ts
- surface.test.ts
- networks.ts
- options.ts
- Buffer
- ws-mutual-tls.test.ts
- NodeBlockSource
- pack-install.mjs
- ProcessContexts
- library-documents.test.ts
- chrome.ts
- .concat
- version-table.ts
- NodeClient
- ledger-table-config.test.ts
- browser-harness.ts
- .query
- spawnChild
- cursor-table.property.test.ts
- LoopPauses
- shims.test.ts
- statementsOf
- crash.test.ts
- networks.test.ts
- ledger/types.ts
- browser/serve.ts
- read-height.property.test.ts
- browser/src/config/load.ts
- InMemoryBlockSource
- ProcessHandle
- worker-threads-worker.ts
- RuntimeMetadata
- .send
- Worker
- vitest
- ledger/plain-data.ts
- TapeAnswers
- compare.ts
- runner/process.ts
- sha256
- .from
- signal-backup.worker.ts
- adapter-fixtures.ts
- worker-threads.test.ts
- record-and-replay.test.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- durability-probe.test.ts
- module-tables.ts
- worker-threads-host.ts
- declaration.ts
- private/backends.ts
- db/errors.ts
- core-transport.ts
- .value
- PageApiChannel
- NodeFS
- node-format.ts
- backup-fixtures.ts
- channel-queue.test.ts
- transform-checks.ts
- chain-placement.test.ts
- pause-fixtures.ts
- resolve.ts
- builds.ts
- roles.ts
- messages.ts
- entries.ts
- tape/index.ts
- UmbraError
- api-server.test.ts
- process-worker.ts
- core-block-commit.test.ts
- client.test.ts
- core-block-parsed.ts
- admin-harness.ts
- range.ts
- contract-data-checks.ts
- validate.ts
- LedgerPackage
- core-ledger-state.ts
- graph.ts
- order.property.test.ts
- transport-faults.test.ts
- sweep-tapes.ts
- ingest-harness.ts
- BlockRef
- backup/backup.ts
- ref_node_timers
- interfaces/transaction-history-storage.ts
- worker-storage.test.ts
- node.test.ts
- Process
- PgTransactionHistoryStorage
- cbor.ts
- ledger-units.test.ts
- binding.test.ts
- ledger/load.ts
- boundary.test.ts
- cli/command.ts
- example-checks.ts
- ledger/ledger-tasks.test.ts
- module-api.ts
- run.test.ts
- retirement.test.ts
- checkShape
- builder.test.ts
- file-mode.test.ts
- config-check.ts
- network.test.ts
- mapping.ts
- redact.ts
- contract-modules.test.ts
- migrate.ts
- real-tapes.ts
- page.ts
- config/plain-data.ts
- cursor-table.test.ts
- process-context.test.ts
- pglite-lock.ts
- test/postgres/setup.ts
- .configHash
- history
- refused
- graph.py
- .off
- .slowBlockMs
- cold-boot-recovery.integration.test.ts
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- ADDED Requirements
- Boundaries, threats and controls
- .disconnect
- conformance-gate.mjs
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- core-chain-events.ts
- UmbraDB third-party component inventory (SBOM)
- core-block-fetch.test.ts
- .block
- path.ts
- committedHeight
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- host-signal.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- crash-worker.ts
- .put
- code
- transportReader
- version
- T
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Design — v1.0.0-durable-checkpoint-cursor
- README.md
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- scoped-review-manifest
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- After 0.10.0
- Contributing
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
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
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
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
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
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
1. `vitest` - 409 edges
2. `UmbraError` - 346 edges
3. `ModuleDeclaration` - 195 edges
4. `InMemoryBlockSource` - 174 edges
5. `FinalizedLoop` - 134 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 102 edges
8. `Database` - 101 edges
9. `startUmbraDB()` - 101 edges
10. `ReadHandle` - 92 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts

## Import Cycles
- None detected.

## Communities (342 total, 33 thin omitted)

### Community 0 - "core-config.test.ts"
Cohesion: 0.02
Nodes (180): ConfigFacts, NetworkShown, AllowedDetail, MountedAdminAnswer, AdminSeams, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions (+172 more)

### Community 1 - "startUmbraDB"
Cohesion: 0.02
Nodes (154): UmbraDBHandle, UmbraDBOptions, EngineOptions, gate, SecretHashes, Compared, ConnectSeen, PortPeer (+146 more)

### Community 10 - "config/history.ts"
Cohesion: 0.03
Nodes (117): OpenedFacts, CoreVersion, CoreSettings, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions (+109 more)

### Community 100 - "paused-harness.ts"
Cohesion: 0.11
Nodes (33): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, loadConfig() (+25 more)

### Community 101 - "startup-stop-harness.ts"
Cohesion: 0.10
Nodes (30): A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StartVia, stopBy, StopHandle (+22 more)

### Community 102 - "browser.test.ts"
Cohesion: 0.07
Nodes (37): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, heldClock, continuedProblems() (+29 more)

### Community 105 - "core-contract-logs-fast.ts"
Cohesion: 0.10
Nodes (33): ContractLog, CoreContractLogsFastOptions, FastLogReader, CoreContractLogsFullOptions, LogEventType, DefinedModule, contractLogsItem(), contractLogsItemOf() (+25 more)

### Community 108 - "validation.ts"
Cohesion: 0.06
Nodes (34): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+26 more)

### Community 109 - "private/lockstep-wait.test.ts"
Cohesion: 0.11
Nodes (36): LockstepCondition, OpenTransaction, A118Observation, MismatchObservation, ExpectedWait, WaitSample, hashAt(), inMemoryBlock() (+28 more)

### Community 11 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (110): NodeCallOptions, ProcessCondition, itemsSeen, EventSpec, Scenario, RecordingClient, ArgType, BlockOptions (+102 more)

### Community 113 - "zod"
Cohesion: 0.09
Nodes (25): CoreContractStatesOptions, ContractStateRow, CoreLedgerVersion, LedgerPackageIdentity, contractStatesOf(), coreContractStates(), hex(), writeStateRows() (+17 more)

### Community 114 - "core-ledger-state/sql.ts"
Cohesion: 0.11
Nodes (33): StateRow, StoredState, GreyView, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks() (+25 more)

### Community 115 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 116 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 117 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (24): LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+16 more)

### Community 118 - "ChannelEndpoint"
Cohesion: 0.13
Nodes (7): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), queuedSlowProblems(), 4. Channels

### Community 12 - "column-rules.ts"
Cohesion: 0.02
Nodes (115): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+107 more)

### Community 120 - "version-checks.ts"
Cohesion: 0.10
Nodes (26): MetadataNode, LedgerSelection, VersionedBlock, Boundary, CallRecord, CountingNode, MetadataSelector, Select (+18 more)

### Community 121 - "node-bridge.ts"
Cohesion: 0.10
Nodes (20): ChildReader, Thread, BridgeServer, Growable, childRefKeys(), readChildren(), bridgeMemory(), decodeNodes() (+12 more)

### Community 122 - "PointName"
Cohesion: 0.08
Nodes (26): PointName, ReasonCode, Unwrapped, HeightFailure, Misuse, SlowBlockCondition, CrashEvent, CrashOptions (+18 more)

### Community 123 - "transaction-history-storage.property.test.ts"
Cohesion: 0.07
Nodes (28): EntryContent, Command, ReplayableStorage, facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), isPlainObject() (+20 more)

### Community 124 - "ledger-sweep.test.ts"
Cohesion: 0.11
Nodes (18): SweepState, SweepTables, SweepWrites, NodeBatch, Block, MemoryTables, ModelSnapshot, hexOf() (+10 more)

### Community 125 - "config-check-database.test.ts"
Cohesion: 0.08
Nodes (22): CheckStep, ConfigCheckReport, CheckTarget, CliBackend, configCheck(), configText(), coreSettings(), inChild() (+14 more)

### Community 126 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 13 - "FinalizedLoop"
Cohesion: 0.04
Nodes (61): HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments, PointRun (+53 more)

### Community 131 - "height-versioned.property.test.ts"
Cohesion: 0.12
Nodes (24): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+16 more)

### Community 132 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (25): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+17 more)

### Community 137 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 138 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 14 - "loop.test.ts"
Cohesion: 0.04
Nodes (90): EntryRange, LockstepWait, LoopEnd, BlockFails, Height, WaitingInRead, Contexts, SilentHalt (+82 more)

### Community 140 - "readiness.test.ts"
Cohesion: 0.11
Nodes (23): ReadinessFacts, ProcessState, Decision, ReadinessCase, readinessOf(), ae4(), caseText(), readinessProblems() (+15 more)

### Community 141 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 142 - "core.ts"
Cohesion: 0.13
Nodes (21): CommitOptions, PostgresRun, BenchEnv, ManualOpts, TinybenchOpts, Backend, Baseline, LatencyStats (+13 more)

### Community 143 - "relays.ts"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 144 - "TransactionHistoryStorage"
Cohesion: 0.09
Nodes (25): TransactionHistoryStorage, reason(), Impact, Non-goals, Proposal — Sprint 7: Transaction History Storage (Wallet Integration Surface), What changes, Why, Why this sprint is numbered 7, not 5 (+17 more)

### Community 146 - "CheckedEntry"
Cohesion: 0.13
Nodes (26): OpenedConfig, CoreChainFacts, ChainIdentity, RestoreBase, BackupText, CommandBuildOptions, CheckState, ConfigCheckOptions (+18 more)

### Community 147 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, privateConfig(), heightsFrom() (+14 more)

### Community 148 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 149 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 15 - "backup/restore.ts"
Cohesion: 0.04
Nodes (74): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport (+66 more)

### Community 150 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 153 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 154 - "networks.ts"
Cohesion: 0.09
Nodes (24): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, ledgerTableRule() (+16 more)

### Community 155 - "options.ts"
Cohesion: 0.18
Nodes (25): Finding, readOptions, named(), addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding() (+17 more)

### Community 158 - "Buffer"
Cohesion: 0.13
Nodes (15): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+7 more)

### Community 159 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 16 - "NodeBlockSource"
Cohesion: 0.03
Nodes (59): BlockHeaderItem, BlockEventSource, BodyExtrinsic, BlockBody, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, HeadWait (+51 more)

### Community 160 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 161 - "ProcessContexts"
Cohesion: 0.12
Nodes (4): ProcessContexts, ProcessItems, providesProcessItem(), sealed()

### Community 164 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 166 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 167 - ".concat"
Cohesion: 0.15
Nodes (10): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+2 more)

### Community 169 - "version-table.ts"
Cohesion: 0.19
Nodes (19): ConfiguredLedgerTable, LedgerPin, LedgerRow, LedgerTableIssue, blockNamed(), checkPins(), covers(), effectiveLedgerTable() (+11 more)

### Community 17 - "NodeClient"
Cohesion: 0.05
Nodes (73): CoreChainBinding, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription (+65 more)

### Community 173 - "ledger-table-config.test.ts"
Cohesion: 0.25
Nodes (17): Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts() (+9 more)

### Community 176 - "browser-harness.ts"
Cohesion: 0.27
Nodes (16): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+8 more)

### Community 177 - ".query"
Cohesion: 0.21
Nodes (14): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), "on-after-db-write"(), "on-compute"() (+6 more)

### Community 18 - "spawnChild"
Cohesion: 0.02
Nodes (93): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+85 more)

### Community 180 - "cursor-table.property.test.ts"
Cohesion: 0.16
Nodes (16): CursorValue, Access, Block, BlockFails, Counts, Write, canonicalText(), expectValue() (+8 more)

### Community 181 - "LoopPauses"
Cohesion: 0.18
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 182 - "shims.test.ts"
Cohesion: 0.19
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 184 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 185 - "crash.test.ts"
Cohesion: 0.21
Nodes (13): CrashCall, CrashObservation, WORKER, CrashWorkerEvent, a44Problems(), a46Problems(), at(), calls() (+5 more)

### Community 189 - "networks.test.ts"
Cohesion: 0.15
Nodes (11): Answers, File, FormatRow, FoundTape, Tape, H(), validFile(), BUILT_IN_NETWORKS (+3 more)

### Community 19 - "ledger/types.ts"
Cohesion: 0.04
Nodes (81): LoadLedger, LedgerStateItem, RetainedState, LedgerName, ApplyOutput, ChainOutcome, LedgerPackageOptions, LedgerTaskBlock (+73 more)

### Community 190 - "browser/serve.ts"
Cohesion: 0.21
Nodes (10): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), CONTENT_TYPES (+2 more)

### Community 194 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 196 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 2 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (167): InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job, WorkerEvent, ChainBuildOptions (+159 more)

### Community 20 - "ProcessHandle"
Cohesion: 0.02
Nodes (104): demoLink, BackupWritten, PrivateLinkChannel, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork (+96 more)

### Community 202 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 205 - "RuntimeMetadata"
Cohesion: 0.21
Nodes (3): RuntimeMetadata, contentStateOf(), hexOf()

### Community 21 - "vitest"
Cohesion: 0.03
Nodes (67): Served, Row, Finding, Lockfile, Manifest, RepositoryFile, Upstream, Pem (+59 more)

### Community 216 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 218 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 219 - "compare.ts"
Cohesion: 0.27
Nodes (7): BaselineLoad, Comparison, compareToBaseline(), loadBaseline(), BASELINE_PATH, REGRESSION_FACTOR, dir

### Community 22 - "runner/process.ts"
Cohesion: 0.03
Nodes (85): Bound, ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ConfigRow, ConfigHashRow, builtInNetwork (+77 more)

### Community 220 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 23 - ".from"
Cohesion: 0.03
Nodes (85): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+77 more)

### Community 238 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 24 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (90): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, Decimal (+82 more)

### Community 25 - "record-and-replay.test.ts"
Cohesion: 0.03
Nodes (60): ConnectSocket, Answer, Handler, Received, recorded, Script, ScriptedNode, ScriptedRequest (+52 more)

### Community 255 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "durability-probe.test.ts"
Cohesion: 0.04
Nodes (80): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, Outcome, WriterSession, WriterStart (+72 more)

### Community 27 - "module-tables.ts"
Cohesion: 0.05
Nodes (68): BackupFacts, CaptureColumn, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions (+60 more)

### Community 276 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 28 - "declaration.ts"
Cohesion: 0.04
Nodes (59): UmbraConfig, ReadHandle, cursorTable, CursorTableOptions, heightVersionedTable, HeightVersionedTableOptions, ApiRegistry, BlockContext (+51 more)

### Community 29 - "private/backends.ts"
Cohesion: 0.04
Nodes (67): PglitePathParts, PostgresParts, Keeping, PrivateBackend, SessionSeen, A162Options, a162Run, HeaderSeen (+59 more)

### Community 3 - "db/errors.ts"
Cohesion: 0.02
Nodes (136): ConfiguredDatabase, ConfiguredDatabaseOptions, PostgresConnection, PostgresOptions, commandTarget, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions (+128 more)

### Community 30 - "core-transport.ts"
Cohesion: 0.04
Nodes (52): PrivateLinkConnect, EndpointOptions, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransportOptions, CoreLink (+44 more)

### Community 31 - ".value"
Cohesion: 0.06
Nodes (63): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+55 more)

### Community 32 - "node-format.ts"
Cohesion: 0.05
Nodes (59): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+51 more)

### Community 33 - "backup-fixtures.ts"
Cohesion: 0.07
Nodes (60): BackupBackend, BackupDatabase, killedRestore, TickerConfig, TickerHandle, WORKER, SignalEvent, cliProject (+52 more)

### Community 34 - "channel-queue.test.ts"
Cohesion: 0.05
Nodes (67): Envelope, LinkTimers, MessagePortLike, controlledTimers, PeerEnd, PeerMessage, rawPeer, TestEnd (+59 more)

### Community 35 - "transform-checks.ts"
Cohesion: 0.06
Nodes (66): Failure, Variant, TapeError, TapeProblem, TransformError, TransformProblem, CallRecord, DisconnectRecord (+58 more)

### Community 36 - "chain-placement.test.ts"
Cohesion: 0.06
Nodes (78): BlockSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape (+70 more)

### Community 37 - "pause-fixtures.ts"
Cohesion: 0.04
Nodes (68): backupSignalRelay, BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable, PausableConfig, PausableOptions (+60 more)

### Community 38 - "resolve.ts"
Cohesion: 0.04
Nodes (79): AddressRequest, Asked, LinkPlan, NetworkInput, NetworkPlan, NetworkProblem, NetworkRule, PlannedAddress (+71 more)

### Community 39 - "builds.ts"
Cohesion: 0.05
Nodes (63): PrivateIntakeOptions, ReadOnlyDatabase, PrivateOptions, PrivateProcess, PrivateRefusal, PrivateSeen, PublicCore, InstanceHashes (+55 more)

### Community 4 - "roles.ts"
Cohesion: 0.02
Nodes (154): SchemaWriteHandle, MigrationPart, Difference, OwnPart, PlannedSchema, Provision, QualifiedTable, SchemaItem (+146 more)

### Community 40 - "messages.ts"
Cohesion: 0.04
Nodes (54): PublicSide, Committed, HelloAck, JsonValue, MessageFault, MessageType, ReadResult, StatementResult (+46 more)

### Community 41 - "entries.ts"
Cohesion: 0.03
Nodes (78): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase (+70 more)

### Community 42 - "tape/index.ts"
Cohesion: 0.06
Nodes (49): RecordingProblem, readRequest, RequestId, Json, NotJsonError, Connection, TapeCall, TapeNodeOptions (+41 more)

### Community 44 - "UmbraError"
Cohesion: 0.05
Nodes (33): databaseTarget, JobQueue, PgliteDatabase, BoundedRead, ReadPool, Session, Writer, UmbraError (+25 more)

### Community 45 - "api-server.test.ts"
Cohesion: 0.05
Nodes (57): ChainDataAnswer, ChainDataView, HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, AppendsVersion, Client (+49 more)

### Community 46 - "process-worker.ts"
Cohesion: 0.05
Nodes (58): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, Scope, crossedError, FromProcessWorker, StartRun (+50 more)

### Community 47 - "core-block-commit.test.ts"
Cohesion: 0.04
Nodes (61): BlockRow, StandInOptions, Commit, AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock(), hex() (+53 more)

### Community 48 - "client.test.ts"
Cohesion: 0.04
Nodes (35): NodeRetry, NodeSocketEvents, HandSocket, HandSockets, FakeNode, ManualTimers, connectWebSocket(), "on-compute"() (+27 more)

### Community 49 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (63): BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, EventPhase, Json, blockBodyOf() (+55 more)

### Community 5 - "admin-harness.ts"
Cohesion: 0.03
Nodes (146): AdminServer, AdminStarter, DatabaseParts, PostgresPartsInput, redactor, EngineConfig, AdminRun, AdminRunOptions (+138 more)

### Community 50 - "range.ts"
Cohesion: 0.04
Nodes (58): BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange, Final (+50 more)

### Community 51 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (62): Manifest, Restored, CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+54 more)

### Community 53 - "validate.ts"
Cohesion: 0.05
Nodes (60): ConfigRule, CursorRule, EntryRef, Issue, Plain, SettingsSchema, CursorRow, Expected (+52 more)

### Community 54 - "LedgerPackage"
Cohesion: 0.05
Nodes (41): LedgerPackage, StateHandle, Settled, StagenetBlockJson, StagenetFixtureJson, stagenetReplay, expectSmallStateReloadsByKey(), replay() (+33 more)

### Community 55 - "core-ledger-state.ts"
Cohesion: 0.06
Nodes (52): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions, boundLedgerParser(), applyBlock(), boundLedger() (+44 more)

### Community 56 - "graph.ts"
Cohesion: 0.05
Nodes (62): ErrorCode, Edge, GraphFacts, GraphInput, GraphPart, GraphRule, MidChain, Missing (+54 more)

### Community 57 - "order.property.test.ts"
Cohesion: 0.05
Nodes (55): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, resolveGraph(), reader(), consumer() (+47 more)

### Community 58 - "transport-faults.test.ts"
Cohesion: 0.06
Nodes (41): CoreTransport, Message, TestCertificates, Ended, rawClient, TransportProxy, mutualTlsOptions(), splitAddress() (+33 more)

### Community 59 - "sweep-tapes.ts"
Cohesion: 0.08
Nodes (49): FixtureRun, ModelBatch, SweepModel, TableSnapshot, FixtureNode, FakeState, RefusalData, hex() (+41 more)

### Community 6 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (137): NodeClientOptions, CrashEvent, CrashJob, ingest, IngestOptions, SourceClass, watched, Call (+129 more)

### Community 60 - "BlockRef"
Cohesion: 0.05
Nodes (28): QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, CommitOutcome, HeightRun, HeldHeight, Fetching (+20 more)

### Community 61 - "backup/backup.ts"
Cohesion: 0.07
Nodes (49): BackupInput, BackupTarget, ManifestHistoryRow, ManifestMigration, ManifestTool, DumpInput, PgliteDump, SnapshotSeams (+41 more)

### Community 62 - "ref_node_timers"
Cohesion: 0.09
Nodes (49): BlockItemSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+41 more)

### Community 65 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (40): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus, TransactionHistoryWriter (+32 more)

### Community 66 - "worker-storage.test.ts"
Cohesion: 0.09
Nodes (23): LedgerTask, NodeStore, StoredNode, EngineOptions, LedgerEngine, LedgerTaskFailed, bridgeStore, Nodes (+15 more)

### Community 67 - "node.test.ts"
Cohesion: 0.06
Nodes (22): Metadata, Step, Frame, RawClient, Failure, Variant, TapeClock, expectAnswersByOccurrence() (+14 more)

### Community 68 - "Process"
Cohesion: 0.08
Nodes (5): PauseHold, Process, SignalTarget, messageOf(), resolve()

### Community 69 - "PgTransactionHistoryStorage"
Cohesion: 0.07
Nodes (32): MergeEntriesFn, TransactionHistoryEntry, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, encodeStoredEntry(), rowToEntry(), abortErrorLike(), capitalize() (+24 more)

### Community 7 - "cbor.ts"
Cohesion: 0.03
Nodes (135): TableDigest, TableDigestRow, BlockWriteHandle, CapturedTable, CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode (+127 more)

### Community 70 - "ledger-units.test.ts"
Cohesion: 0.07
Nodes (41): AdapterSpec, ManifestLine, VerifyLedgerPackagesOptions, LedgerRelease, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, V9Logs (+33 more)

### Community 72 - "binding.test.ts"
Cohesion: 0.07
Nodes (43): startHashDecision, A165Options, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding (+35 more)

### Community 73 - "ledger/load.ts"
Cohesion: 0.06
Nodes (40): ApplyInput, StateSummary, LedgerHeight, AdapterWorkerAnswer, AdapterWorkerRequest, LoadedState, SlowStep, TestLoaderData (+32 more)

### Community 74 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+34 more)

### Community 77 - "cli/command.ts"
Cohesion: 0.07
Nodes (38): BackupSeams, RestoreChain, RestoreSeams, BackupOutcome, CommandHandler, CommandIo, MainProcess, CommandConfig (+30 more)

### Community 78 - "example-checks.ts"
Cohesion: 0.08
Nodes (33): TypeCheckFinding, TypeCheckResult, BlockImport, ChildResult, CodeBlock, installedProject, Finding, configCompilerOptions() (+25 more)

### Community 79 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.06
Nodes (35): CallArgsItem, CallArguments, V9Raw, base(), blank(), callArgsModule(), decode(), free() (+27 more)

### Community 8 - "module-api.ts"
Cohesion: 0.03
Nodes (111): coreHeaders, HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions (+103 more)

### Community 80 - "run.test.ts"
Cohesion: 0.07
Nodes (35): Renamed, RunningCommand, statsConfig, runArguments(), runProcessCommand(), inProcess(), check(), check() (+27 more)

### Community 81 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 82 - "checkShape"
Cohesion: 0.07
Nodes (38): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+30 more)

### Community 83 - "builder.test.ts"
Cohesion: 0.07
Nodes (27): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Link, TapeBuilder (+19 more)

### Community 84 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (32): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+24 more)

### Community 85 - "config-check.ts"
Cohesion: 0.07
Nodes (37): CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, ConfigFinding, databaseFinding() (+29 more)

### Community 86 - "network.test.ts"
Cohesion: 0.07
Nodes (36): RunOptions, RunSeams, SignalSource, stopSignal, EngineInput, UserModulesSource, NetworkRuleName, ChannelCoreOptions (+28 more)

### Community 87 - "mapping.ts"
Cohesion: 0.08
Nodes (33): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+25 more)

### Community 88 - "redact.ts"
Cohesion: 0.07
Nodes (36): EntryView, PlainObject, RedactableConfig, RedactionForms, SecretForm, TextPattern, EntryView, transportReaderFacts (+28 more)

### Community 89 - "contract-modules.test.ts"
Cohesion: 0.07
Nodes (34): UnsureLog, LogSite, Program, UnsureReason, V9Raw, LogItem, VmLog, Freeable (+26 more)

### Community 9 - "migrate.ts"
Cohesion: 0.03
Nodes (100): Transaction, CaptureState, AppliedRow, Runnable, Settling, StartupInput, CheckedMigration, BlockWrites (+92 more)

### Community 90 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 91 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 92 - "config/plain-data.ts"
Cohesion: 0.08
Nodes (38): ImportedConfig, LoadedConfig, LoadOptions, PlainArray, plainData, PlainDataNode, PlainDataRule, Walk (+30 more)

### Community 94 - "cursor-table.test.ts"
Cohesion: 0.06
Nodes (30): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, cursorDatabase, BlockFails (+22 more)

### Community 95 - "process-context.test.ts"
Cohesion: 0.07
Nodes (30): MisuseListener, PublishRefusal, AcceptsDuplicates, Seen, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass (+22 more)

### Community 96 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (32): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, ChildResult (+24 more)

### Community 97 - "test/postgres/setup.ts"
Cohesion: 0.07
Nodes (34): Key, Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, Sql, SuiteWatchdogTimeoutError (+26 more)

### Community 198 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 43 - "history"
Cohesion: 0.03
Nodes (79): history(), n(), data(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()` (+71 more)

### Community 64 - "refused"
Cohesion: 0.05
Nodes (53): refused(), halted(), cursorRead(), following(), replay(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem (+45 more)

### Community 110 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 111 - ".off"
Cohesion: 0.06
Nodes (33): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases (+25 more)

### Community 127 - ".slowBlockMs"
Cohesion: 0.07
Nodes (29): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+21 more)

### Community 128 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.13
Nodes (20): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile(), buildUnshieldedConfig(), firstStateWhere() (+12 more)

### Community 134 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.06
Nodes (30): deferred(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log, The five stages (+22 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.06
Nodes (28): 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage, ADDED Requirements (+20 more)

### Community 168 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 183 - ".disconnect"
Cohesion: 0.15
Nodes (14): fault(), Suggested fix, 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants (+6 more)

### Community 187 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 188 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 195 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 200 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 204 - "core-chain-events.ts"
Cohesion: 0.24
Nodes (9): chainEventsItemOf(), writeEventRows(), insertEventRows(), BOUND, CHAIN_EVENTS_ITEM, CORE_CHAIN_EVENTS_ID, VIEWS, CORE_CHAIN_EVENTS_MIGRATIONS (+1 more)

### Community 210 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 215 - "core-block-fetch.test.ts"
Cohesion: 0.18
Nodes (3): chainBackbone(), blockContext(), KNOWN_NETWORKS

### Community 217 - ".block"
Cohesion: 0.42
Nodes (5): failingSource(), lookalike(), rowsOfAnotherHeight(), shiftedSource(), flakySource()

### Community 227 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 231 - "committedHeight"
Cohesion: 0.25
Nodes (8): readDatabaseState(), committedHeight(), database(), 00029 — `umbradb config check --database` reads a private database's cursor from the public cursor table, Evidence, Problem, Suggested fix, 6. Options, refusals and the handle

### Community 240 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 244 - "host-signal.ts"
Cohesion: 0.32
Nodes (5): isAbortSignal(), followSignal(), isSignal(), ABORTED, REASON

### Community 247 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 274 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 314 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 52 - ".put"
Cohesion: 0.03
Nodes (61): coreBlockFetchOnFetch(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+53 more)

### Community 63 - "code"
Cohesion: 0.04
Nodes (57): code(), Added, 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit (+49 more)

### Community 71 - "transportReader"
Cohesion: 0.04
Nodes (49): text(), transportReader(), transportReaderRule(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 00061 — The threat model's `path:line` citations drift as the code moves (+41 more)

### Community 75 - "version"
Cohesion: 0.05
Nodes (48): side(), params(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules (+40 more)

### Community 76 - "T"
Cohesion: 0.04
Nodes (49): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+41 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+31 more)

### Community 106 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning (+30 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 130 - "package.json"
Cohesion: 0.06
Nodes (33): bin, umbradb, bugs, url, description, optional, engines, node (+25 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 135 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 145 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 152 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 156 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 162 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.09
Nodes (17): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+9 more)

### Community 163 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 165 - "README.md"
Cohesion: 0.12
Nodes (12): Choosing a database, At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails, Launching it (+4 more)

### Community 170 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 171 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 174 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 175 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 179 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 186 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 191 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 192 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 193 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 199 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 201 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 203 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 207 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 208 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 211 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 212 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 213 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 214 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 221 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 222 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 223 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 224 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 225 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 226 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 228 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 229 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 230 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 232 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 233 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 234 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 2. Envelope module (Pg-only — required gate), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 235 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 236 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 237 - "After 0.10.0"
Cohesion: 0.22
Nodes (9): 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals, Release gates still to run (+1 more)

### Community 239 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 241 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 242 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 243 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 246 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 248 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 249 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 250 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 251 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 252 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 253 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 254 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 256 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 258 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 259 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 260 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 261 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 262 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 263 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 264 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 265 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 266 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 267 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

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

### Community 275 - "lib.sh"
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

### Community 283 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 284 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 285 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 286 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 287 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 288 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 289 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 290 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 291 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 292 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 293 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 294 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 295 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 296 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 297 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 298 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 299 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 300 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

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

### Community 305 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 306 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 307 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 308 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 309 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 310 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 311 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 312 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 93 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4090 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `core-config.test.ts`, `startUmbraDB`, `InMemoryBlockSource`, `db/errors.ts`, `roles.ts`, `admin-harness.ts`, `ingest-harness.ts`, `cbor.ts`, `module-api.ts`, `migrate.ts`, `config/history.ts`, `fetch-fixtures.ts`, `column-rules.ts`, `loop.test.ts`, `backup/restore.ts`, `NodeBlockSource`, `NodeClient`, `spawnChild`, `ledger/types.ts`, `runner/process.ts`, `.from`, `adapter-fixtures.ts`, `record-and-replay.test.ts`, `durability-probe.test.ts`, `module-tables.ts`, `declaration.ts`, `private/backends.ts`, `core-transport.ts`, `.value`, `node-format.ts`, `backup-fixtures.ts`, `channel-queue.test.ts`, `transform-checks.ts`, `chain-placement.test.ts`, `pause-fixtures.ts`, `resolve.ts`, `builds.ts`, `messages.ts`, `entries.ts`, `tape/index.ts`, `UmbraError`, `api-server.test.ts`, `core-block-commit.test.ts`, `client.test.ts`, `core-block-parsed.ts`, `range.ts`, `contract-data-checks.ts`, `validate.ts`, `LedgerPackage`, `core-ledger-state.ts`, `graph.ts`, `order.property.test.ts`, `transport-faults.test.ts`, `sweep-tapes.ts`, `backup/backup.ts`, `ref_node_timers`, `interfaces/transaction-history-storage.ts`, `worker-storage.test.ts`, `node.test.ts`, `ledger-units.test.ts`, `binding.test.ts`, `ledger/load.ts`, `boundary.test.ts`, `cli/command.ts`, `example-checks.ts`, `ledger/ledger-tasks.test.ts`, `run.test.ts`, `retirement.test.ts`, `builder.test.ts`, `file-mode.test.ts`, `config-check.ts`, `network.test.ts`, `mapping.ts`, `redact.ts`, `contract-modules.test.ts`, `real-tapes.ts`, `config/plain-data.ts`, `cursor-table.test.ts`, `process-context.test.ts`, `pglite-lock.ts`, `test/postgres/setup.ts`, `paused-harness.ts`, `startup-stop-harness.ts`, `browser.test.ts`, `validation.ts`, `private/lockstep-wait.test.ts`, `zod`, `release-version.ts`, `browser/build.ts`, `pg-tx-history-adapter.ts`, `version-checks.ts`, `node-bridge.ts`, `PointName`, `transaction-history-storage.property.test.ts`, `ledger-sweep.test.ts`, `config-check-database.test.ts`, `resolver-boundary.ts`, `cold-boot-recovery.integration.test.ts`, `package.json`, `height-versioned.property.test.ts`, `node-fields-harness.ts`, `documents.ts`, `code-registry.ts`, `readiness.test.ts`, `read-gate.ts`, `restore-private.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `surface.test.ts`, `ws-mutual-tls.test.ts`, `library-documents.test.ts`, `excluded-not-exported.test.ts`, `ledger-table-config.test.ts`, `cursor-table.property.test.ts`, `LoopPauses`, `shims.test.ts`, `statementsOf`, `crash.test.ts`, `mutation-per-adapter.mjs`, `networks.test.ts`, `read-height.property.test.ts`, `twox.ts`, `core-block-fetch.test.ts`, `ledger/plain-data.ts`, `compare.ts`, `host-signal.ts`, `worker-threads.test.ts`?**
  _High betweenness centrality (0.207) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `core-config.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.019993415342252553 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `core-config.test.ts`, `startUmbraDB`, `InMemoryBlockSource`, `db/errors.ts`, `roles.ts`, `admin-harness.ts`, `ingest-harness.ts`, `cbor.ts`, `module-api.ts`, `migrate.ts`, `config/history.ts`, `fetch-fixtures.ts`, `FinalizedLoop`, `loop.test.ts`, `backup/restore.ts`, `NodeBlockSource`, `NodeClient`, `ledger/types.ts`, `ProcessHandle`, `vitest`, `runner/process.ts`, `record-and-replay.test.ts`, `durability-probe.test.ts`, `module-tables.ts`, `declaration.ts`, `private/backends.ts`, `core-transport.ts`, `backup-fixtures.ts`, `channel-queue.test.ts`, `transform-checks.ts`, `pause-fixtures.ts`, `resolve.ts`, `builds.ts`, `messages.ts`, `entries.ts`, `tape/index.ts`, `api-server.test.ts`, `core-block-commit.test.ts`, `client.test.ts`, `range.ts`, `validate.ts`, `LedgerPackage`, `core-ledger-state.ts`, `graph.ts`, `order.property.test.ts`, `transport-faults.test.ts`, `backup/backup.ts`, `ref_node_timers`, `Process`, `ledger-units.test.ts`, `binding.test.ts`, `cli/command.ts`, `ledger/ledger-tasks.test.ts`, `run.test.ts`, `checkShape`, `builder.test.ts`, `config-check.ts`, `mapping.ts`, `redact.ts`, `config/plain-data.ts`, `cursor-table.test.ts`, `process-context.test.ts`, `pglite-lock.ts`, `core-contract-logs-fast.ts`, `validation.ts`, `private/lockstep-wait.test.ts`, `version-checks.ts`, `PointName`, `Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)`, `readiness.test.ts`, `CheckedEntry`, `options.ts`, `ProcessContexts`, `version-table.ts`, `ledger-table-config.test.ts`, `shims.test.ts`, `statementsOf`, `browser/src/config/load.ts`, `RuntimeMetadata`, `.block`, `sha256`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `startUmbraDB` be split into smaller, more focused modules?**
  _Cohesion score 0.022125203492674262 - nodes in this community are weakly interconnected._