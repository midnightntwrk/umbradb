# Graph Report - UmbraDB

## Corpus Check
- 1201 files · ~1,698,033 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12504 nodes · 38530 edges · 343 communities (311 shown, 32 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3234 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `61961f78a16d9488` (1201 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- column-rules.ts
- process-build.ts
- ingest-harness.ts
- core-ledger-state/sql.ts
- core-block-commit/sql.ts
- release-version.ts
- browser/build.ts
- node-run.ts
- redact.ts
- config/history.ts
- pg-tx-history-adapter.ts
- validation.ts
- transaction-history-storage.property.test.ts
- file-modes.ts
- node-fields-harness.ts
- process-worker.ts
- adapter-fixtures.ts
- code-registry.ts
- paused-harness.ts
- documents.ts
- read-gate.ts
- crash.test.ts
- config/plain-data.ts
- core-private-source.test.ts
- checks.test.ts
- chrome.ts
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- restore-private.ts
- surface.test.ts
- node-bridge.ts
- tape/index.ts
- core-block-commit.test.ts
- pack-install.mjs
- start-umbradb.test.ts
- .concat
- ledger-sweep.test.ts
- demo-handlers.test.ts
- harness.ts
- module-api.ts
- block-fetch-decode.test.ts
- library-documents.test.ts
- version-table.ts
- signal-ignored-fixtures.ts
- childRefKeys
- ledger-table-config.test.ts
- key-handling-checks.ts
- UmbraError
- LoopPauses
- ledger-checks.ts
- listening.test.ts
- resolver-boundary.ts
- ws-mutual-tls.test.ts
- range.ts
- core-block-fetch.test.ts
- process-access.ts
- statementsOf
- InMemoryBlockSource
- items.ts
- quiet-host.child.ts
- core.ts
- sha256
- Buffer
- stats-module.ts
- NodeClient
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- worker-threads.test.ts
- api.ts
- builds.ts
- browser/serve.ts
- worker-threads-worker.ts
- buffer.ts
- Design — Sprint 1: project setup + TemporalKV
- Worker
- height-versioned.test.ts
- sweepStep
- RuntimeMetadata
- ledger/plain-data.ts
- TapeAnswers
- channel-queue.test.ts
- typescript
- ref_node_crypto
- .from
- vendored-ledger-files.test.ts
- binding.test.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- ref_node_url
- ProcessHandle
- runner/process.ts
- cbor.ts
- admin-harness.ts
- restore-ledger.ts
- FinalizedLoop
- BYTE_ORDER
- PageApiChannel
- NodeFS
- devnet-upgrade.test.ts
- LedgerPackage
- NodeBlockSource
- order.property.test.ts
- db/backends.ts
- core-transport.ts
- Process
- client.test.ts
- messages.ts
- api-server.test.ts
- db/errors.ts
- admin/configuration.ts
- resolve.ts
- refused-configuration.test.ts
- host.ts
- ledger/ledger-tasks.test.ts
- declaration.ts
- loop.ts
- src/db/postgres.ts
- mounted-admin.test.ts
- PgTransactionHistoryStorage
- transform-checks.ts
- config-check.ts
- ledger/types.ts
- database-parts.ts
- transport-faults.test.ts
- start-umbradb.ts
- fetch-fixtures.ts
- ledger-units.test.ts
- interfaces/transaction-history-storage.ts
- slow-block-harness.ts
- browser.test.ts
- vitest
- code
- loop-stop-harness.ts
- library/modules.test.ts
- ref_node_fs
- core-block-parsed.ts
- chain-events-decode.test.ts
- chain-placement.test.ts
- ChannelEndpoint
- src/config/load.ts
- boundary.test.ts
- graph.ts
- .#open
- checkShape
- validate.ts
- retirement.test.ts
- .value
- core-ledger-state.ts
- process-harness.ts
- networks.ts
- pglite-lock.ts
- real-tapes.ts
- contract-data-checks.ts
- private/lockstep-wait.test.ts
- page.ts
- version-checks.ts
- BlockRef
- test/postgres/setup.ts
- ADDED Requirements
- refused
- version
- cold-boot-recovery.integration.test.ts
- .off
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Requirement: BK-1 Backup
- .disconnect
- mutation-per-adapter.mjs
- core-ledger-state.test.ts
- twox.ts
- Design — v1.1.0: Quint model checking
- Boundaries, threats and controls
- UmbraDB third-party component inventory (SBOM)
- path.ts
- midnight-env — reproducible PREPROD dev environment
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- v9
- writeBlock
- orphan-watcher.mjs
- crash-worker.ts
- startUmbraDB
- history
- .put
- data
- .slowBlockMs
- ADDED Requirements
- T
- ADDED Requirements
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- ADDED Requirements
- devDependencies
- README.md
- Requirement: BK-1 Backup
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- Design — Sprint 4: Watermarks
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- [0.10.0] - 2026-10-27
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
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
- UmbraDB node architecture
- The laws of UmbraDB's storage helpers
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
- 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
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
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs

## God Nodes (most connected - your core abstractions)
1. `vitest` - 412 edges
2. `UmbraError` - 346 edges
3. `ModuleDeclaration` - 195 edges
4. `InMemoryBlockSource` - 175 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `startUmbraDB()` - 103 edges
8. `BlockRef` - 102 edges
9. `Database` - 101 edges
10. `ReadHandle` - 92 edges

## Surprising Connections (you probably didn't know these)
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts

## Import Cycles
- None detected.

## Communities (343 total, 32 thin omitted)

### Community 0 - "column-rules.ts"
Cohesion: 0.01
Nodes (196): DumpInput, CaptureColumn, CheckedMigration, ModuleColumn, ModuleContentsError, ModuleTable, ModuleTableOptions, PageOptions (+188 more)

### Community 1 - "process-build.ts"
Cohesion: 0.02
Nodes (176): InMemoryItems, InMemorySourceOptions, Wait, EngineBuild, EngineNetwork, ProcessingEnd, ProcessStatus, Job (+168 more)

### Community 10 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (142): CoreLedgerStateOptions, GreyPicker, Restored, FixtureRun, FixtureRunOptions, CrashEvent, CrashJob, ingest (+134 more)

### Community 102 - "core-ledger-state/sql.ts"
Cohesion: 0.12
Nodes (33): StateRow, StoredState, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks(), deleteGrey() (+25 more)

### Community 103 - "core-block-commit/sql.ts"
Cohesion: 0.08
Nodes (32): BlockRow, AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock(), hex(), sameBytes(), startOf() (+24 more)

### Community 106 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 107 - "browser/build.ts"
Cohesion: 0.08
Nodes (27): BrowserBuild, BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common() (+19 more)

### Community 108 - "node-run.ts"
Cohesion: 0.09
Nodes (27): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, PglitePathParts, NodeRunResult, core() (+19 more)

### Community 109 - "redact.ts"
Cohesion: 0.10
Nodes (28): RedactionForms, SecretForm, TextPattern, Needs, findings(), configRedactor(), credentialsIn(), decoded() (+20 more)

### Community 11 - "config/history.ts"
Cohesion: 0.03
Nodes (128): OpenedFacts, CoreVersion, CoreSettings, versionEntry, ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext (+120 more)

### Community 110 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (24): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+16 more)

### Community 112 - "validation.ts"
Cohesion: 0.07
Nodes (31): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+23 more)

### Community 113 - "transaction-history-storage.property.test.ts"
Cohesion: 0.09
Nodes (21): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, ReplayableStorage, abortErrorLike(), capitalize(), applyCommand(), replay(), TransactionHistoryEntrySchema (+13 more)

### Community 115 - "file-modes.ts"
Cohesion: 0.09
Nodes (25): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+17 more)

### Community 117 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (24): A168Observation, A168Phase, Expected, GatedConnector, StatusReader, a(), a168Problems(), a168Run() (+16 more)

### Community 118 - "process-worker.ts"
Cohesion: 0.10
Nodes (22): ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker, answer() (+14 more)

### Community 12 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (116): recordedGenesis, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost (+108 more)

### Community 120 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 122 - "paused-harness.ts"
Cohesion: 0.14
Nodes (26): Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, keeperModule(), keepingPause() (+18 more)

### Community 124 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 127 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 128 - "crash.test.ts"
Cohesion: 0.11
Nodes (24): CrashCall, CrashEvent, CrashOptions, CrashObservation, SkipsStartAtRestart, WORKER, CrashJob, CrashWorkerEvent (+16 more)

### Community 129 - "config/plain-data.ts"
Cohesion: 0.11
Nodes (24): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, copyArray(), copyObject(), instanceOf() (+16 more)

### Community 13 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (85): PrivateBlockSource, PrivateChecks, privateIntake, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision (+77 more)

### Community 130 - "checks.test.ts"
Cohesion: 0.10
Nodes (21): CheckFunctionsOptions, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName(), integerCheckStatements() (+13 more)

### Community 131 - "chrome.ts"
Cohesion: 0.15
Nodes (11): Cdp, CdpEvent, ChromeBrowser, ChromeTab, Download, chromePath(), exitsWithin(), launchChrome() (+3 more)

### Community 132 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.08
Nodes (21): ReadPool, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider) (+13 more)

### Community 133 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 134 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 135 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 137 - "restore-private.ts"
Cohesion: 0.16
Nodes (21): FileProcess, privateBackup, PublicSetting, PublicSide, PublicSideOptions, privateConfig(), heightsFrom(), pmModule() (+13 more)

### Community 138 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 139 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 14 - "tape/index.ts"
Cohesion: 0.04
Nodes (84): heldClock, Recorded, Failure, Variant, Link, TapeBuilder, TapeBuilderOptions, RecordingError (+76 more)

### Community 141 - "core-block-commit.test.ts"
Cohesion: 0.11
Nodes (16): StandInOptions, Commit, blockFetchStandIn(), standInHeader(), standInItems(), a145Stored(), contextAt(), partWrite() (+8 more)

### Community 143 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 144 - "start-umbradb.test.ts"
Cohesion: 0.14
Nodes (16): ModuleListRule, GoneCwdResult, moduleListProblems(), closedByItself(), hostile(), optionProblems(), throwing(), problemsOf() (+8 more)

### Community 145 - ".concat"
Cohesion: 0.12
Nodes (12): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+4 more)

### Community 147 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (13): SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints() (+5 more)

### Community 148 - "demo-handlers.test.ts"
Cohesion: 0.15
Nodes (17): Compared, ConnectSeen, PortPeer, comparedOfExchange(), comparedOfResponse(), connected(), engineOf(), fetchProblems() (+9 more)

### Community 149 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 15 - "module-api.ts"
Cohesion: 0.03
Nodes (100): coreHeaders, HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions (+92 more)

### Community 151 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+9 more)

### Community 152 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 153 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 154 - "signal-ignored-fixtures.ts"
Cohesion: 0.13
Nodes (18): ListenedRun, WorkerSignals, listenerProblems(), namesUnder(), pacedNode(), runWorkerInChild(), signalLines(), sigusr2Ignored() (+10 more)

### Community 155 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 156 - "ledger-table-config.test.ts"
Cohesion: 0.22
Nodes (17): Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts() (+9 more)

### Community 157 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 16 - "UmbraError"
Cohesion: 0.03
Nodes (73): ConfiguredDatabase, ConfiguredDatabaseOptions, PostgresConnection, PostgresOptions, PublicIdentity, Checked, PublicSide, RestoreTarget (+65 more)

### Community 162 - "LoopPauses"
Cohesion: 0.16
Nodes (6): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, PauseHold, watched()

### Community 164 - "ledger-checks.ts"
Cohesion: 0.25
Nodes (17): LedgerEvent, TransactionResult, ledgerItemsSeen, a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows() (+9 more)

### Community 166 - "listening.test.ts"
Cohesion: 0.12
Nodes (9): TestCertificates, configWhen(), libraryCore(), privateData(), readerOf(), until(), waitsForLockstep(), makeCertificates() (+1 more)

### Community 167 - "resolver-boundary.ts"
Cohesion: 0.18
Nodes (16): Boundary, Crossing, Guard, boundaryOf(), boundarySources(), guardedSymbols(), hostWith(), inRepository() (+8 more)

### Community 169 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 17 - "range.ts"
Cohesion: 0.03
Nodes (88): NodeClientOptions, ConnectSocket, NodeSocketEvents, IngestOptions, HandSocket, HandSockets, Outage, ScriptedRequest (+80 more)

### Community 173 - "core-block-fetch.test.ts"
Cohesion: 0.12
Nodes (7): LedgerTable, coreBlockFetchOnFetch(), isBlockItemSource(), chainBackbone(), blockContext(), CORE_BLOCK_FETCH_ID, KNOWN_NETWORKS

### Community 174 - "process-access.ts"
Cohesion: 0.20
Nodes (15): Access, AllowedRead, bare(), callsPathResolve(), checked(), declares(), inRepository(), inType() (+7 more)

### Community 177 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 18 - "InMemoryBlockSource"
Cohesion: 0.04
Nodes (87): InMemoryBlockSource, LoopEnd, Failing, Flaky, Contexts, Faults, LostCommit, Seen (+79 more)

### Community 182 - "items.ts"
Cohesion: 0.17
Nodes (12): BlockHeaderItem, BodyExtrinsic, ExtrinsicCall, BlockBody, CoreBlockHeader, MetadataPallet, RuntimeMetadataView, callOf() (+4 more)

### Community 184 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 185 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 186 - "sha256"
Cohesion: 0.22
Nodes (7): Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 187 - "Buffer"
Cohesion: 0.15
Nodes (9): Buffer, Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser (+1 more)

### Community 188 - "stats-module.ts"
Cohesion: 0.26
Nodes (11): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+3 more)

### Community 19 - "NodeClient"
Cohesion: 0.05
Nodes (73): FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+65 more)

### Community 193 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 194 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 195 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 2 - "api.ts"
Cohesion: 0.03
Nodes (161): Database, ReadOnlyDatabase, ReadOptions, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable (+153 more)

### Community 20 - "builds.ts"
Cohesion: 0.03
Nodes (75): Keeping, PrivateBackend, SessionSeen, PrivateProcess, PrivateRefusal, PublicCore, a162Run, HeaderSeen (+67 more)

### Community 201 - "browser/serve.ts"
Cohesion: 0.24
Nodes (8): pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS, PREVIEW_NODE

### Community 202 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 203 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 205 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 21 - "height-versioned.test.ts"
Cohesion: 0.03
Nodes (81): BlockWriteHandle, cursorTable, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration, TestBackend (+73 more)

### Community 215 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 216 - "RuntimeMetadata"
Cohesion: 0.24
Nodes (4): RuntimeMetadata, contentStateOf(), hexOf(), walkOver()

### Community 217 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 218 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 22 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (88): demoLink, EndpointOptions, Envelope, LinkTimers, PrivateLinkChannel, EngineInput, controlledTimers, PeerEnd (+80 more)

### Community 225 - "typescript"
Cohesion: 0.33
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 23 - "ref_node_crypto"
Cohesion: 0.03
Nodes (92): TableDigest, TableDigestRow, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow, GuardTableRow (+84 more)

### Community 24 - ".from"
Cohesion: 0.03
Nodes (88): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+80 more)

### Community 240 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 25 - "binding.test.ts"
Cohesion: 0.04
Nodes (90): a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome (+82 more)

### Community 250 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "ref_node_url"
Cohesion: 0.02
Nodes (87): Child, ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, GateRun (+79 more)

### Community 27 - "ProcessHandle"
Cohesion: 0.03
Nodes (73): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, backupSignalRelay, RunOptions, RunSeams, SignalSource (+65 more)

### Community 28 - "runner/process.ts"
Cohesion: 0.03
Nodes (84): ConfigFacts, SnapshotFacts, Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, CoreChainBinding (+76 more)

### Community 29 - "cbor.ts"
Cohesion: 0.04
Nodes (95): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+87 more)

### Community 3 - "admin-harness.ts"
Cohesion: 0.02
Nodes (171): NetworkShown, MountedAdminAnswer, AdminSeams, PrivateSideFacts, ProcessAdminOptions, adminRoutes, AdminChannel, AdminServeOptions (+163 more)

### Community 30 - "restore-ledger.ts"
Cohesion: 0.04
Nodes (83): BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool (+75 more)

### Community 31 - "FinalizedLoop"
Cohesion: 0.04
Nodes (28): EntryBoundary, Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, Startup, SkipsAfterReconnect (+20 more)

### Community 33 - "devnet-upgrade.test.ts"
Cohesion: 0.05
Nodes (66): Asked, Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable (+58 more)

### Community 34 - "LedgerPackage"
Cohesion: 0.05
Nodes (52): LedgerName, LedgerPackage, LedgerTaskBlock, StateHandle, Held, LedgerEngine, LedgerTaskFailed, Settled (+44 more)

### Community 35 - "NodeBlockSource"
Cohesion: 0.04
Nodes (42): BlockItemSource, CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeSubscription, NodeBlock (+34 more)

### Community 36 - "order.property.test.ts"
Cohesion: 0.04
Nodes (88): ErrorCode, GraphInput, PointRun, PastFaultCase, RefusalCase, Recorder, CheckName, GraphSpec (+80 more)

### Community 37 - "db/backends.ts"
Cohesion: 0.04
Nodes (57): Settings, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, Run (+49 more)

### Community 38 - "core-transport.ts"
Cohesion: 0.04
Nodes (54): PrivateLinkAddress, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransportOptions, CoreLink, CoreSessionOptions (+46 more)

### Community 39 - "Process"
Cohesion: 0.05
Nodes (16): ProcessAdmin, CoreTransport, BlockSource, Heartbeat, HeartbeatOptions, TimerHandle, Process, recordedHistory() (+8 more)

### Community 4 - "client.test.ts"
Cohesion: 0.02
Nodes (105): NodeRetry, Answer, FakeNode, Handler, Received, recorded, ManualTimers, ConnectionFrames (+97 more)

### Community 40 - "messages.ts"
Cohesion: 0.04
Nodes (55): PublicSide, Committed, HelloAck, JsonValue, MessageFault, ReadResult, StatementResult, CarrierConnection (+47 more)

### Community 41 - "api-server.test.ts"
Cohesion: 0.04
Nodes (63): ChainDataView, HttpHandler, HttpRoute, AcceptsDuplicates, AddsExtensions, AddsHeaders, AppendsVersion, Client (+55 more)

### Community 42 - "db/errors.ts"
Cohesion: 0.04
Nodes (60): databaseTarget, PgliteLockUse, ReadTimeoutSetting, ModuleContentsFailure, ErrorDetails, ResultColumn, ResultType, Case (+52 more)

### Community 43 - "admin/configuration.ts"
Cohesion: 0.05
Nodes (74): OpenedConfig, AllowedDetail, RevisionSettings, DigestRow, ModuleFacts, PartTable, ChainView, ConfigSnapshot (+66 more)

### Community 44 - "resolve.ts"
Cohesion: 0.04
Nodes (72): AddressRequest, Asked, LinkPlan, NetworkInput, NetworkPlan, NetworkProblem, NetworkRequest, NetworkRule (+64 more)

### Community 45 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (64): EngineConfig, Answered, Start, Refusal, Start, listenError(), startAdminServer(), startProcess() (+56 more)

### Community 46 - "host.ts"
Cohesion: 0.05
Nodes (48): RetainedState, ApplyBlock, BlockId, EvictionRefused, GenesisBlock, LoadedState, LoadState, TaskRun (+40 more)

### Community 47 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (62): ProbeRecord, TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw (+54 more)

### Community 48 - "declaration.ts"
Cohesion: 0.05
Nodes (47): UmbraConfig, ReadHandle, OwnPart, CursorTableOptions, ApiRegistry, BlockHeader, FieldKind, FieldSchema (+39 more)

### Community 49 - "loop.ts"
Cohesion: 0.05
Nodes (63): HeightRange, Callback, CallbackFailure, ParallelPoint, PointSchedule, ReasonCode, Unwrapped, HeightActivity (+55 more)

### Community 5 - "src/db/postgres.ts"
Cohesion: 0.02
Nodes (143): BenchEnv, PostgresParts, SslMode, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome (+135 more)

### Community 50 - "mounted-admin.test.ts"
Cohesion: 0.06
Nodes (58): gate, SecretHashes, SecretVariant, Expected, FactsRunOptions, SubscriptionSeen, Client, Exchanged (+50 more)

### Community 51 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (56): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, rowToEntry(), reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built) (+48 more)

### Community 52 - "transform-checks.ts"
Cohesion: 0.07
Nodes (46): Metadata, Step, TapeError, TransformError, SubscriptionId, NotificationRange, expectGoldenRoundTrip(), baseRecords() (+38 more)

### Community 53 - "config-check.ts"
Cohesion: 0.06
Nodes (61): BackupOutcome, CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, commandTarget, DatabaseState (+53 more)

### Community 54 - "ledger/types.ts"
Cohesion: 0.06
Nodes (47): LoadLedger, TransactionParser, LedgerStateItem, AdapterSpec, ApplyInput, ApplyOutput, LedgerPackageOptions, LedgerTask (+39 more)

### Community 55 - "database-parts.ts"
Cohesion: 0.05
Nodes (51): CheckStep, DatabaseParts, PostgresPartsInput, NetworkRuleName, TickerConfig, PausableConfig, PrivateConfig, CheckTarget (+43 more)

### Community 57 - "transport-faults.test.ts"
Cohesion: 0.06
Nodes (40): Message, MessageType, Report, Ended, rawClient, HeldLink, HoldingRelay, ReportRelay (+32 more)

### Community 59 - "start-umbradb.ts"
Cohesion: 0.07
Nodes (55): MessagePortLike, readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork, UmbraDBOptions (+47 more)

### Community 6 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (154): BlockParsed, NodeCallOptions, ProcessCondition, itemsSeen, BlockSpec, EventSpec, Json, Scenario (+146 more)

### Community 60 - "ledger-units.test.ts"
Cohesion: 0.07
Nodes (46): ManifestLine, VerifyLedgerPackagesOptions, LedgerRelease, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, V9Logs, checkLedgerPackage() (+38 more)

### Community 62 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (42): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+34 more)

### Community 63 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+41 more)

### Community 64 - "browser.test.ts"
Cohesion: 0.07
Nodes (56): Reachable, RestoreAttempt, PageBackup, PageEvent, PageLink, PageRestore, ProcessName, StatusBody (+48 more)

### Community 65 - "vitest"
Cohesion: 0.06
Nodes (32): Served, Finding, Lockfile, Manifest, BlockImport, ChildResult, CodeBlock, installedProject (+24 more)

### Community 66 - "code"
Cohesion: 0.04
Nodes (53): RepositoryFile, canPin(), code(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS (+45 more)

### Community 68 - "loop-stop-harness.ts"
Cohesion: 0.09
Nodes (42): A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore (+34 more)

### Community 69 - "library/modules.test.ts"
Cohesion: 0.06
Nodes (34): UmbraDBHandle, Hold, Signal, Job, Run, FaultedClose, OwnWords, Shown (+26 more)

### Community 7 - "ref_node_fs"
Cohesion: 0.03
Nodes (113): BackupBackend, BackupDatabase, killedRestore, TickerHandle, TickerProcess, BackupOnSignal, LoopClass, Pausable (+105 more)

### Community 70 - "core-block-parsed.ts"
Cohesion: 0.06
Nodes (46): BlockEventSource, MetadataField, Primitive, ledgerVersionOf(), blockBodyOf(), blockParsedOf(), coreBlockParsedOnParse(), hexOf() (+38 more)

### Community 71 - "chain-events-decode.test.ts"
Cohesion: 0.09
Nodes (41): eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, LedgerScenarioOptions (+33 more)

### Community 72 - "chain-placement.test.ts"
Cohesion: 0.07
Nodes (47): MetadataVariant, BlockParsedOptions, ChainTransaction, ChainEvent, EventPhase, RecordTypes, ScaleValue, isBlockEventSource() (+39 more)

### Community 73 - "ChannelEndpoint"
Cohesion: 0.08
Nodes (19): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), exceedsUtf8(), refuseChannel(), discard(), isChannel() (+11 more)

### Community 75 - "src/config/load.ts"
Cohesion: 0.06
Nodes (36): LoadOptions, SignalJob, Row, configModules(), configModuleUrl(), configPath(), importConfig(), invalid() (+28 more)

### Community 76 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+34 more)

### Community 77 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 78 - ".#open"
Cohesion: 0.06
Nodes (20): MisuseReports, ProcessContexts, ProcessItems, ChainStarted, bindCoreBlockFetch(), bindLedgerParser(), bindCoreChain(), bindCoreChainEvents() (+12 more)

### Community 79 - "checkShape"
Cohesion: 0.07
Nodes (39): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+31 more)

### Community 8 - "validate.ts"
Cohesion: 0.02
Nodes (155): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput (+147 more)

### Community 80 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 81 - ".value"
Cohesion: 0.15
Nodes (23): MetadataStorage, MetadataStorageEntry, MetadataType, TypeDef, ScaleError, ScaleReader, ValueReader, blockTimeOf() (+15 more)

### Community 82 - "core-ledger-state.ts"
Cohesion: 0.08
Nodes (37): BlockLedgerSource, LedgerBinding, retainedStates, CoreRevision, applyBlock(), boundLedger(), contractsOf(), hex() (+29 more)

### Community 84 - "process-harness.ts"
Cohesion: 0.07
Nodes (31): EntryRange, ResolvedGraph, LoopInput, MisuseListener, PublishRefusal, PublicCoreOptions, RunnerBackend, AllowsOutside (+23 more)

### Community 86 - "networks.ts"
Cohesion: 0.06
Nodes (38): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+30 more)

### Community 87 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (32): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, ChildResult (+24 more)

### Community 88 - "real-tapes.ts"
Cohesion: 0.09
Nodes (32): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+24 more)

### Community 9 - "contract-data-checks.ts"
Cohesion: 0.03
Nodes (135): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+127 more)

### Community 92 - "private/lockstep-wait.test.ts"
Cohesion: 0.09
Nodes (34): LockstepCondition, OpenTransaction, A118Observation, MismatchObservation, ExpectedWait, WaitSample, RetargetProxy, a118Problems() (+26 more)

### Community 93 - "page.ts"
Cohesion: 0.06
Nodes (31): ApiChannel, LinkRecord, PageState, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp() (+23 more)

### Community 94 - "version-checks.ts"
Cohesion: 0.10
Nodes (24): MetadataBlock, MetadataNode, RuntimeMetadataEntry, Boundary, CallRecord, CountingNode, MetadataSelector, Select (+16 more)

### Community 95 - "BlockRef"
Cohesion: 0.08
Nodes (19): QueuedBlock, BlockItems, BlockRef, CommitOutcome, HeldHeight, Fetching, Recorder, LateRedelivery (+11 more)

### Community 97 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+27 more)

### Community 56 - "refused"
Cohesion: 0.04
Nodes (63): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+55 more)

### Community 74 - "version"
Cohesion: 0.05
Nodes (48): side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+40 more)

### Community 100 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (25): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed(), ledgerV8NodeEntry() (+17 more)

### Community 119 - ".off"
Cohesion: 0.06
Nodes (29): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap (+21 more)

### Community 146 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 178 - "Requirement: BK-1 Backup"
Cohesion: 0.13
Nodes (11): 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented, Evidence, Problem, Suggested fix, MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing (+3 more)

### Community 179 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 181 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 183 - "core-ledger-state.test.ts"
Cohesion: 0.15
Nodes (8): boundLedgerParser(), itemsOf(), applied(), bound(), query(), refusing(), NODES_PER_STATEMENT, STORED_ROOT

### Community 192 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 199 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 204 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 210 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 227 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 230 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 242 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 258 - "v9"
Cohesion: 0.47
Nodes (5): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 272 - "writeBlock"
Cohesion: 0.33
Nodes (6): writeBlock(), addRootCounts(), insertEvents(), insertNodes(), insertSegmentResults(), insertStateRow()

### Community 273 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 314 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 32 - "startUmbraDB"
Cohesion: 0.03
Nodes (94): backupAtStop(), text(), transportReader(), transportReaderRule(), startUmbraDB(), found(), log(), ownKeys() (+86 more)

### Community 58 - "history"
Cohesion: 0.04
Nodes (60): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+52 more)

### Community 61 - ".put"
Cohesion: 0.04
Nodes (56): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+48 more)

### Community 67 - "data"
Cohesion: 0.04
Nodes (57): params(), n(), data(), 7. The module API, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret (+49 more)

### Community 83 - ".slowBlockMs"
Cohesion: 0.05
Nodes (39): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+31 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 90 - "T"
Cohesion: 0.05
Nodes (40): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Scenario: Version and timestamp addressing agree, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 6.1 — P3 is the differential gate's replay-equivalence / fold anchor (documentation, no new test code) (+32 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): 5. WalletState envelope, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll (+30 more)

### Community 99 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points (+26 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 121 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 123 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+21 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 140 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 150 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 163 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 165 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 168 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.12
Nodes (11): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+3 more)

### Community 170 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 171 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker (+8 more)

### Community 172 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 175 - "README.md"
Cohesion: 0.17
Nodes (6): Choosing a database, Launching it, stats-module, Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 176 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 180 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 189 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 190 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 191 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 196 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 198 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 200 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 206 - "ADDED Requirements"
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

### Community 214 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 219 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 220 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 221 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 222 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 223 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 224 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 226 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 228 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 229 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 231 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 232 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 233 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.22
Nodes (8): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution, Design — v1.0.0-perf-baseline

### Community 234 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 235 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 236 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 237 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 238 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 239 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 241 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 243 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 244 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 245 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 246 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 247 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 248 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 249 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 251 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 253 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 254 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 255 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 256 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 257 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 259 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 260 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 261 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.33
Nodes (6): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers

### Community 262 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 263 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 264 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 265 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 266 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 267 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 268 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 269 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 270 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 271 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 274 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 275 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 276 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 277 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 278 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 279 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 280 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 281 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 282 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 283 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 284 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 285 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 286 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 287 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 288 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 289 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 290 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 291 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 292 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 293 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 294 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 295 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 296 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 297 - "00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)"
Cohesion: 0.40
Nodes (4): 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …), Evidence, Problem, Suggested fix

### Community 298 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 299 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 300 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 301 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 302 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 303 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 304 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 305 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 306 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 307 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 308 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 309 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 310 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 311 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 317 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 98 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `RFC-3339` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4113 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `column-rules.ts`, `process-build.ts`, `api.ts`, `admin-harness.ts`, `client.test.ts`, `src/db/postgres.ts`, `fetch-fixtures.ts`, `ref_node_fs`, `validate.ts`, `contract-data-checks.ts`, `ingest-harness.ts`, `config/history.ts`, `adapter-fixtures.ts`, `core-private-source.test.ts`, `tape/index.ts`, `module-api.ts`, `UmbraError`, `range.ts`, `InMemoryBlockSource`, `NodeClient`, `builds.ts`, `height-versioned.test.ts`, `channel-queue.test.ts`, `ref_node_crypto`, `.from`, `binding.test.ts`, `ref_node_url`, `ProcessHandle`, `runner/process.ts`, `cbor.ts`, `restore-ledger.ts`, `devnet-upgrade.test.ts`, `LedgerPackage`, `NodeBlockSource`, `order.property.test.ts`, `db/backends.ts`, `core-transport.ts`, `Process`, `messages.ts`, `api-server.test.ts`, `db/errors.ts`, `admin/configuration.ts`, `resolve.ts`, `refused-configuration.test.ts`, `host.ts`, `ledger/ledger-tasks.test.ts`, `declaration.ts`, `loop.ts`, `mounted-admin.test.ts`, `transform-checks.ts`, `config-check.ts`, `ledger/types.ts`, `database-parts.ts`, `transport-faults.test.ts`, `start-umbradb.ts`, `ledger-units.test.ts`, `interfaces/transaction-history-storage.ts`, `slow-block-harness.ts`, `browser.test.ts`, `code`, `loop-stop-harness.ts`, `library/modules.test.ts`, `chain-events-decode.test.ts`, `chain-placement.test.ts`, `src/config/load.ts`, `boundary.test.ts`, `retirement.test.ts`, `core-ledger-state.ts`, `process-harness.ts`, `networks.ts`, `pglite-lock.ts`, `real-tapes.ts`, `private/lockstep-wait.test.ts`, `version-checks.ts`, `test/postgres/setup.ts`, `cold-boot-recovery.integration.test.ts`, `core-ledger-state/sql.ts`, `release-version.ts`, `browser/build.ts`, `redact.ts`, `pg-tx-history-adapter.ts`, `validation.ts`, `transaction-history-storage.property.test.ts`, `node-fields-harness.ts`, `code-registry.ts`, `package.json`, `documents.ts`, `read-gate.ts`, `crash.test.ts`, `config/plain-data.ts`, `checks.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `restore-private.ts`, `surface.test.ts`, `node-bridge.ts`, `core-block-commit.test.ts`, `start-umbradb.test.ts`, `ledger-sweep.test.ts`, `demo-handlers.test.ts`, `harness.ts`, `block-fetch-decode.test.ts`, `library-documents.test.ts`, `ledger-table-config.test.ts`, `key-handling-checks.ts`, `excluded-not-exported.test.ts`, `LoopPauses`, `listening.test.ts`, `resolver-boundary.ts`, `ws-mutual-tls.test.ts`, `core-block-fetch.test.ts`, `process-access.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `core-ledger-state.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `ledger/plain-data.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `column-rules.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.014841545474278272 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `column-rules.ts`, `config/plain-data.ts`, `api.ts`, `process-build.ts`, `admin-harness.ts`, `src/db/postgres.ts`, `client.test.ts`, `ref_node_fs`, `validate.ts`, `contract-data-checks.ts`, `fetch-fixtures.ts`, `config/history.ts`, `core-private-source.test.ts`, `core-block-commit.test.ts`, `module-api.ts`, `checks.test.ts`, `range.ts`, `InMemoryBlockSource`, `NodeClient`, `builds.ts`, `height-versioned.test.ts`, `channel-queue.test.ts`, `tape/index.ts`, `ref_node_crypto`, `version-table.ts`, `binding.test.ts`, `runner/process.ts`, `cbor.ts`, `restore-ledger.ts`, `ledger-table-config.test.ts`, `startUmbraDB`, `FinalizedLoop`, `LedgerPackage`, `NodeBlockSource`, `order.property.test.ts`, `db/backends.ts`, `core-transport.ts`, `Process`, `messages.ts`, `api-server.test.ts`, `db/errors.ts`, `admin/configuration.ts`, `resolve.ts`, `refused-configuration.test.ts`, `ledger/ledger-tasks.test.ts`, `declaration.ts`, `statementsOf`, `loop.ts`, `mounted-admin.test.ts`, `transform-checks.ts`, `config-check.ts`, `core-ledger-state.test.ts`, `database-parts.ts`, `transport-faults.test.ts`, `sha256`, `start-umbradb.ts`, `ledger-units.test.ts`, `slow-block-harness.ts`, `browser/src/config/load.ts`, `library/modules.test.ts`, `src/config/load.ts`, `graph.ts`, `.#open`, `checkShape`, `core-ledger-state.ts`, `process-harness.ts`, `pglite-lock.ts`, `RuntimeMetadata`, `private/lockstep-wait.test.ts`, `version-checks.ts`, `core-block-commit/sql.ts`, `validation.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `process-build.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.021749408983451537 - nodes in this community are weakly interconnected._