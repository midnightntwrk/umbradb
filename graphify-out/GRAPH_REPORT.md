# Graph Report - UmbraDB

## Corpus Check
- 1203 files · ~1,703,298 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12529 nodes · 38618 edges · 335 communities (304 shown, 31 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3246 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `c286cc413b48897f` (1203 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- admin-harness.ts
- vitest
- openPostgres
- ledger-checks.ts
- process-worker.ts
- cold-boot-recovery.integration.test.ts
- mounted-api.test.ts
- adapter-fixtures.ts
- browser/build.ts
- paused-harness.ts
- halts.test.ts
- resolver-boundary.ts
- .concat
- file-modes.ts
- library/modules.test.ts
- browser.test.ts
- spawnChild
- src/index.ts
- documents.ts
- postgres/transaction-history-storage.ts
- code-registry.ts
- pg-tx-history-adapter.ts
- read-gate.ts
- NodeClient
- PrivateTransport
- relays.ts
- browser-harness.ts
- release-version.ts
- crash.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- TransactionHistoryEntry
- core-block-fetch/metadata.ts
- host.ts
- demo-handlers.test.ts
- surface.test.ts
- node-bridge.ts
- pack-install.mjs
- start-umbradb.test.ts
- BlockItems
- harness.ts
- range.test.ts
- .value
- library-documents.test.ts
- ledger/metadata.ts
- chrome.ts
- key-handling-checks.ts
- Buffer
- .name
- defineModule
- core-ledger-state.ts
- ReadHandle
- LoopPauses
- module-api.ts
- ws-mutual-tls.test.ts
- readRuntimeMetadata
- statementsOf
- core.ts
- backup/restore.ts
- component-table.test.ts
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- worker-threads.test.ts
- NodeBlockSource
- history.property.test.ts
- worker-threads-worker.ts
- .send
- Worker
- api.ts
- binding.test.ts
- placement.ts
- TapeAnswers
- sha256
- config/history.ts
- pageBench
- builds.ts
- typescript
- order.property.test.ts
- chain-placement.test.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- ref_node_crypto
- zod
- contract-modules.test.ts
- process-build.ts
- channel-queue.test.ts
- column-rules.ts
- .from
- NodeFS
- cbor.ts
- loop.test.ts
- devnet-upgrade.test.ts
- core-block-parsed.ts
- ledger/types.ts
- builder.test.ts
- FinalizedLoop
- process-backends.ts
- height-versioned.test.ts
- UmbraError
- runner/process.ts
- InMemoryBlockSource
- pause-fixtures.ts
- LedgerPackage
- declaration.ts
- ModuleDeclaration
- core-transport.ts
- api-server.test.ts
- validate.ts
- server.ts
- backup/backup.ts
- PgTransactionHistoryStorage
- Process
- config-check.ts
- db/backends.ts
- ref_node_url
- private/lockstep-wait.test.ts
- ingest-harness.ts
- backupAtStop
- loop.ts
- loop-stop-harness.ts
- restore-ledger.ts
- contract-data-checks.ts
- slow-block-harness.ts
- guarantees.test.ts
- code
- resolve.ts
- core-settings.ts
- core-chain.ts
- interfaces/transaction-history-storage.ts
- ledger-tasks-checks.ts
- deterministic-postgresql/index.ts
- core-block-commit/sql.ts
- checkShape
- retirement.test.ts
- client.test.ts
- graph.ts
- configured.ts
- page.ts
- pglite-lock.ts
- start-umbradb.ts
- shims.test.ts
- tape/index.ts
- boundary.test.ts
- networks.ts
- version-checks.ts
- ChannelEndpoint
- test/postgres/setup.ts
- database-parts.ts
- zero-timeouts-checks.ts
- Problem
- refused
- data
- ADDED Requirements
- graph.py
- ADDED Requirements
- .slowBlockMs
- mutation-per-adapter.mjs
- twox.ts
- Tasks — START-UMBRADB: UmbraDB as a library
- Design — v1.1.0: Quint model checking
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- midnight-env — reproducible PREPROD dev environment
- Requirement: BK-1 Backup
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- selectLedgerVersion
- orphan-watcher.mjs
- checked-ledgers.test.ts
- decodeExtrinsic
- crash-worker.ts
- .put
- history
- startUmbraDB
- table
- T
- version
- .cwd
- ADDED Requirements
- .off
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- package.json
- ADDED Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- Boundaries, threats and controls
- scripts
- stryker.conf.json
- ADDED Requirements
- ADDED Requirements
- devDependencies
- The laws of UmbraDB's storage helpers
- README.md
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- ADDED Requirements
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
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Contributing
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
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
- Vendored ledger builds
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
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
- 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it
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
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Evidence` --references--> `probedThrough()`  [INFERRED]
  docs/issues/00064-full-suite-timing-budgets-under-a-loaded-machine.md → test/backbone/core-health/liveness.test.ts

## Import Cycles
- None detected.

## Communities (335 total, 31 thin omitted)

### Community 0 - "admin-harness.ts"
Cohesion: 0.02
Nodes (195): AdminSeams, adminRoutes, AdminServer, AdminEndpoint, AdminPart, AdminView, ReadinessFacts, versionEntry (+187 more)

### Community 1 - "vitest"
Cohesion: 0.02
Nodes (165): CommandHandler, CommandIo, MainProcess, RestoreOutcome, BackupBackend, BackupDatabase, killedRestore, TickerConfig (+157 more)

### Community 10 - "openPostgres"
Cohesion: 0.03
Nodes (106): BenchEnv, SslMode, driverConnectionOptions, PostgresConnection, PostgresOptions, Started, FailsOnceStarted, SlowToReportPorts (+98 more)

### Community 100 - "ledger-checks.ts"
Cohesion: 0.11
Nodes (24): ChildReader, LedgerEvent, TransactionResult, VmLog, ledgerItemsSeen, ModelBatch, SweepModel, childRefKeys() (+16 more)

### Community 101 - "process-worker.ts"
Cohesion: 0.08
Nodes (26): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, Scope, crossedError, FromProcessWorker, StartRun (+18 more)

### Community 105 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (23): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+15 more)

### Community 109 - "mounted-api.test.ts"
Cohesion: 0.09
Nodes (26): SecretHashes, SecretVariant, SubscriptionSeen, Client, Mounted, formsOf(), hashesOfSecrets(), hashProblems() (+18 more)

### Community 11 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (116): ApplyInput, ApplyOutput, StoredNode, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject (+108 more)

### Community 110 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 111 - "paused-harness.ts"
Cohesion: 0.12
Nodes (29): AdminStarter, AdminRunOptions, A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader (+21 more)

### Community 112 - "halts.test.ts"
Cohesion: 0.09
Nodes (32): ProcessingEnd, ProcessStatus, Q142Observation, A43Case, A43Observation, CursorElsewhere, Halt, Outcome (+24 more)

### Community 113 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 114 - ".concat"
Cohesion: 0.07
Nodes (22): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+14 more)

### Community 115 - "file-modes.ts"
Cohesion: 0.09
Nodes (25): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+17 more)

### Community 118 - "library/modules.test.ts"
Cohesion: 0.09
Nodes (28): OwnWords, Shown, handleOf(), startedOf(), adminOf(), adminOrigin(), closedByItself(), dataWith() (+20 more)

### Community 119 - "browser.test.ts"
Cohesion: 0.10
Nodes (30): Reachable, RestoreAttempt, PageRestore, continuedProblems(), midChainProblems(), networkProblems(), plain(), restoreProblems() (+22 more)

### Community 12 - "spawnChild"
Cohesion: 0.02
Nodes (111): Served, ParentJob, Kill, Orphaned, SourceFile, Finding, Run, WorkerEvent (+103 more)

### Community 120 - "src/index.ts"
Cohesion: 0.13
Nodes (23): MessagePortLike, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork, UmbraDBOptions (+15 more)

### Community 122 - "documents.ts"
Cohesion: 0.13
Nodes (28): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+20 more)

### Community 123 - "postgres/transaction-history-storage.ts"
Cohesion: 0.10
Nodes (18): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+10 more)

### Community 125 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 126 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 129 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 13 - "NodeClient"
Cohesion: 0.04
Nodes (96): CoreChainBinding, FinalizedHeightOptions, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+88 more)

### Community 130 - "PrivateTransport"
Cohesion: 0.12
Nodes (8): HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), rowsOf(), stopProblems()

### Community 131 - "relays.ts"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 132 - "browser-harness.ts"
Cohesion: 0.13
Nodes (24): PageApiChannel, PageBackup, PageEvent, PageLink, ProcessName, StatusBody, apiChannel(), backupThrough() (+16 more)

### Community 133 - "release-version.ts"
Cohesion: 0.15
Nodes (27): FoundDeclaration, SourceText, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration(), lineOf() (+19 more)

### Community 134 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 135 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 136 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 137 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 138 - "TransactionHistoryEntry"
Cohesion: 0.14
Nodes (8): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 139 - "core-block-fetch/metadata.ts"
Cohesion: 0.11
Nodes (21): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive, RecordTypes (+13 more)

### Community 14 - "host.ts"
Cohesion: 0.03
Nodes (96): TransactionParser, CoreLedgerStateOptions, LedgerName, Path, ChainOutcome, LedgerTask, ParsedTransaction, AppliedState (+88 more)

### Community 140 - "demo-handlers.test.ts"
Cohesion: 0.12
Nodes (21): Compared, ConnectSeen, PortPeer, Exchanged, comparedOfExchange(), comparedOfResponse(), connected(), engineOf() (+13 more)

### Community 141 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 142 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 145 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 146 - "start-umbradb.test.ts"
Cohesion: 0.14
Nodes (16): ModuleListRule, GoneCwdResult, moduleListProblems(), closedByItself(), hostile(), optionProblems(), throwing(), problemsOf() (+8 more)

### Community 147 - "BlockItems"
Cohesion: 0.11
Nodes (11): QueuedBlock, BlockItems, EagerItems, EagerLoop, KeptItems, KeptLoop, revisionAt(), h() (+3 more)

### Community 148 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 15 - "range.test.ts"
Cohesion: 0.03
Nodes (99): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+91 more)

### Community 150 - ".value"
Cohesion: 0.27
Nodes (7): ScaleReader, ValueReader, blockTimeOf(), isCompactU64(), bytesArgument(), decodeChainEvents(), read()

### Community 151 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 152 - "ledger/metadata.ts"
Cohesion: 0.15
Nodes (8): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, contentStateOf(), hexOf(), walkOver()

### Community 153 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 154 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 155 - "Buffer"
Cohesion: 0.15
Nodes (13): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+5 more)

### Community 156 - ".name"
Cohesion: 0.14
Nodes (11): Fetching, Recorder, Job, Run, database, gone, runs, 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail (+3 more)

### Community 157 - "defineModule"
Cohesion: 0.16
Nodes (15): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), defineModule(), keysModule() (+7 more)

### Community 16 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (109): LedgerBinding, LedgerStateItem, RetainedState, retainedStates, CoreRevision, StateRow, StoredState, GreyPicker (+101 more)

### Community 163 - "ReadHandle"
Cohesion: 0.14
Nodes (3): ReadHandle, PointCallbacks, get()

### Community 164 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 17 - "module-api.ts"
Cohesion: 0.03
Nodes (100): coreHeaders, HeadersArgument, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler (+92 more)

### Community 171 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 172 - "readRuntimeMetadata"
Cohesion: 0.43
Nodes (9): TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry(), storageEntry(), strings() (+1 more)

### Community 173 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 176 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 18 - "backup/restore.ts"
Cohesion: 0.03
Nodes (80): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision, StartHashes (+72 more)

### Community 180 - "component-table.test.ts"
Cohesion: 0.15
Nodes (10): DesignTable, RowCoverage, rule(), opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS (+2 more)

### Community 182 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 184 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 185 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 19 - "NodeBlockSource"
Cohesion: 0.03
Nodes (66): BlockHeaderItem, BlockEventSource, BodyExtrinsic, ExtrinsicCall, BlockBody, BlockItemSource, CoreBlockHeader, CoreBlockItems (+58 more)

### Community 191 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 193 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 2 - "api.ts"
Cohesion: 0.02
Nodes (159): Database, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+151 more)

### Community 20 - "binding.test.ts"
Cohesion: 0.03
Nodes (97): PrivateIntakeOptions, ReadOnlyDatabase, A165Options, a165Run, Attempt, A113Observation, A156Observation, Binding (+89 more)

### Community 204 - "placement.ts"
Cohesion: 0.24
Nodes (10): ChainTransaction, EventPhase, callVariant(), carried(), is(), refuse(), systemBytes(), MIDNIGHT (+2 more)

### Community 205 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 206 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 21 - "config/history.ts"
Cohesion: 0.03
Nodes (102): CoreVersion, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding, HistoryRule, ProvidesRow, Span (+94 more)

### Community 215 - "pageBench"
Cohesion: 0.31
Nodes (6): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage()

### Community 22 - "builds.ts"
Cohesion: 0.04
Nodes (73): PostgresParts, transportReaderFacts, Keeping, PrivateBackend, SessionSeen, TestDatabase, PrivateProcess, PrivateRefusal (+65 more)

### Community 225 - "typescript"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 23 - "order.property.test.ts"
Cohesion: 0.03
Nodes (102): ErrorCode, BlockHeader, GraphInput, PointRun, PastFaultCase, RefusalCase, CallEvent, Recorder (+94 more)

### Community 24 - "chain-placement.test.ts"
Cohesion: 0.04
Nodes (102): BlockParsed, BlockParsedOptions, ChainEvent, ScaleValue, itemsSeen, BlockSpec, EventSpec, Json (+94 more)

### Community 241 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 25 - "ref_node_crypto"
Cohesion: 0.03
Nodes (97): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, Op, States, TableName (+89 more)

### Community 26 - "zod"
Cohesion: 0.03
Nodes (85): CoreTransport, Committed, JsonValue, Message, MessageFault, MessageType, ReadResult, Pending (+77 more)

### Community 27 - "contract-modules.test.ts"
Cohesion: 0.04
Nodes (91): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+83 more)

### Community 28 - "process-build.ts"
Cohesion: 0.04
Nodes (87): HistoryOptions, InMemoryItems, Wait, EngineBuild, EngineNetwork, Job, ProcessObservation, StartVia (+79 more)

### Community 29 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (87): demoLink, EndpointOptions, Envelope, PrivateLinkChannel, EngineInput, controlledTimers, PeerEnd, PeerMessage (+79 more)

### Community 3 - "column-rules.ts"
Cohesion: 0.02
Nodes (172): ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, CatalogColumn, CatalogOptions (+164 more)

### Community 30 - ".from"
Cohesion: 0.03
Nodes (87): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+79 more)

### Community 31 - "cbor.ts"
Cohesion: 0.04
Nodes (99): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+91 more)

### Community 32 - "loop.test.ts"
Cohesion: 0.04
Nodes (82): CommitOutcome, HeldHeight, LockstepWait, LoopEnd, LoopInput, SlowBlockEvent, Contexts, Faults (+74 more)

### Community 33 - "devnet-upgrade.test.ts"
Cohesion: 0.05
Nodes (68): Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch (+60 more)

### Community 34 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (86): ChangedFile, GenesisFixture, installationCopy, PackageStartup, StartPackageProcess, ProcessBackend, Seen, core() (+78 more)

### Community 35 - "ledger/types.ts"
Cohesion: 0.04
Nodes (82): LoadLedger, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerPackageOptions, LedgerTaskBlock (+74 more)

### Community 36 - "builder.test.ts"
Cohesion: 0.03
Nodes (44): heldClock, ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+36 more)

### Community 37 - "FinalizedLoop"
Cohesion: 0.04
Nodes (28): Activity, FinalizedLoop, HeightActivity, HeightRun, LoopObserver, UnexpectedCursor, SkipsAfterReconnect, SkipsUnseen (+20 more)

### Community 38 - "process-backends.ts"
Cohesion: 0.05
Nodes (83): FixtureRun, FixtureRunOptions, SeenLoad, LedgerTx, TableSnapshot, FixtureNode, RefusalData, ProcessDatabase (+75 more)

### Community 39 - "height-versioned.test.ts"
Cohesion: 0.04
Nodes (67): BlockWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration (+59 more)

### Community 4 - "UmbraError"
Cohesion: 0.02
Nodes (129): ConfiguredDatabase, ConfiguredDatabaseOptions, PostgresConnection, PostgresOptions, DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions (+121 more)

### Community 40 - "runner/process.ts"
Cohesion: 0.04
Nodes (62): NodeWait, PointName, LifecycleStatus, CallbackFailure, ProcessReason, ReasonCode, RetryCode, Unwrapped (+54 more)

### Community 41 - "InMemoryBlockSource"
Cohesion: 0.04
Nodes (48): BlockRef, InMemoryBlockSource, InMemorySourceOptions, ProcessHandle, WorkerEvent, A77Observation, A78Observation, A78Refusal (+40 more)

### Community 42 - "pause-fixtures.ts"
Cohesion: 0.04
Nodes (63): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+55 more)

### Community 43 - "LedgerPackage"
Cohesion: 0.06
Nodes (38): LedgerPackage, StateHandle, LedgerEngine, LedgerTaskFailed, StagenetBlockJson, StagenetFixtureJson, stagenetReplay, hexOf() (+30 more)

### Community 44 - "declaration.ts"
Cohesion: 0.04
Nodes (66): OwnPart, BlockContext, FieldKind, FieldSchema, ItemDeclaration, ItemSink, KnownPointsOnly, Lifetime (+58 more)

### Community 46 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (44): OpenedFacts, ModuleDeclaration, Revision, EntryRange, GraphFacts, ResolvedGraph, PlacedDeclaration, LateUse (+36 more)

### Community 47 - "core-transport.ts"
Cohesion: 0.05
Nodes (51): ResultColumn, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransportOptions, CoreLink (+43 more)

### Community 48 - "api-server.test.ts"
Cohesion: 0.05
Nodes (58): ApiRegistry, ChainDataAnswer, ChainDataView, SlowWindow, HttpHandler, HttpRoute, SlowBlockCondition, AddsExtensions (+50 more)

### Community 5 - "validate.ts"
Cohesion: 0.02
Nodes (166): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+158 more)

### Community 51 - "server.ts"
Cohesion: 0.04
Nodes (50): MountedAdminAnswer, AdminChannel, FromAdmin, ToAdmin, AdminStartOptions, Heartbeat, HeartbeatOptions, TimerHandle (+42 more)

### Community 52 - "backup/backup.ts"
Cohesion: 0.06
Nodes (62): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+54 more)

### Community 53 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (57): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built) (+49 more)

### Community 55 - "Process"
Cohesion: 0.07
Nodes (8): PauseHold, Process, SignalTarget, openedCursorHeight(), retryOf(), messageOf(), losingCommits(), landingCommits()

### Community 56 - "config-check.ts"
Cohesion: 0.04
Nodes (49): CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, ConfigFinding (+41 more)

### Community 57 - "db/backends.ts"
Cohesion: 0.05
Nodes (42): Settings, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, Report (+34 more)

### Community 58 - "ref_node_url"
Cohesion: 0.04
Nodes (46): ImportedConfig, LoadOptions, SignalJob, Row, Lockfile, Manifest, Upstream, Lock (+38 more)

### Community 59 - "private/lockstep-wait.test.ts"
Cohesion: 0.06
Nodes (44): InstanceView, PrivateInstance, Entry, Lockstep, LockstepCondition, LockstepInstance, LockstepOptions, LockstepRefusal (+36 more)

### Community 6 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (153): NodeCallOptions, ProcessCondition, Scenario, RecordingClient, A168Observation, A168Phase, A168RunOptions, Expected (+145 more)

### Community 60 - "backupAtStop"
Cohesion: 0.05
Nodes (46): BackupText, createReadStream(), isBlockLedgerSource(), backupAtStop(), firstLine(), ownerOnlyFile(), hex(), checkBeforeLoading() (+38 more)

### Community 62 - "loop.ts"
Cohesion: 0.07
Nodes (41): HeightRange, Callback, EntryBoundary, ParallelPoint, PointArguments, PointSchedule, Invoke, Progress (+33 more)

### Community 64 - "loop-stop-harness.ts"
Cohesion: 0.07
Nodes (43): NodeClientOptions, ConnectSocket, IngestOptions, A169Observation, Outage, SourceOf, A167Observation, CheckOf (+35 more)

### Community 65 - "restore-ledger.ts"
Cohesion: 0.07
Nodes (51): RestoreInput, ChainBuildOptions, ingest, watched, RestartEvent, RestartJob, retentionSeen, ledgerScenario (+43 more)

### Community 66 - "contract-data-checks.ts"
Cohesion: 0.10
Nodes (53): CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx (+45 more)

### Community 67 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): ReadOpener, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec, Observed (+41 more)

### Community 68 - "guarantees.test.ts"
Cohesion: 0.06
Nodes (34): CloseHelper, NetworkRuleName, Hold, Signal, QuietResult, Parsed, Expected, runProcess() (+26 more)

### Community 69 - "code"
Cohesion: 0.04
Nodes (51): RepositoryFile, canPin(), code(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS (+43 more)

### Community 7 - "resolve.ts"
Cohesion: 0.02
Nodes (157): DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder (+149 more)

### Community 70 - "core-settings.ts"
Cohesion: 0.05
Nodes (49): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, Absent, DeepReadonly (+41 more)

### Community 72 - "core-chain.ts"
Cohesion: 0.07
Nodes (40): Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, WaitingListener, ChainIdentity, ConfigRow (+32 more)

### Community 73 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (38): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+30 more)

### Community 74 - "ledger-tasks-checks.ts"
Cohesion: 0.08
Nodes (42): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, run(), halted(), replayRange() (+34 more)

### Community 75 - "deterministic-postgresql/index.ts"
Cohesion: 0.06
Nodes (32): CheckedMigration, GuardTableRow, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, optOut (+24 more)

### Community 76 - "core-block-commit/sql.ts"
Cohesion: 0.06
Nodes (42): BlockRow, AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock(), hex(), ledgerVersionOf(), sameBytes() (+34 more)

### Community 77 - "checkShape"
Cohesion: 0.07
Nodes (39): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+31 more)

### Community 78 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 8 - "client.test.ts"
Cohesion: 0.02
Nodes (82): Connection, NodeRetry, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets, Answer (+74 more)

### Community 81 - "graph.ts"
Cohesion: 0.08
Nodes (45): Edge, GraphPart, GraphRule, MidChain, Missing, RangeFacts, ResolvedRange, Spanned (+37 more)

### Community 82 - "configured.ts"
Cohesion: 0.09
Nodes (41): CoreChainFacts, RestoreBase, RestoreChain, RestoreSeams, BackupOutcome, CommandBuildOptions, CheckState, ConfigCheckOptions (+33 more)

### Community 83 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 84 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (33): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, ChildResult (+25 more)

### Community 86 - "start-umbradb.ts"
Cohesion: 0.11
Nodes (39): readOptions, addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding(), guarded(), isAbortSignal() (+31 more)

### Community 87 - "shims.test.ts"
Cohesion: 0.07
Nodes (28): databaseTarget, PgliteLockUse, TestBackend, Case, HeldRead, Job, Outcome, Reads (+20 more)

### Community 9 - "tape/index.ts"
Cohesion: 0.04
Nodes (108): LoopStopScenario, Recorded, Link, TapeBuilderOptions, RecordingError, RecordingProblem, TapeError, TapeProblem (+100 more)

### Community 91 - "boundary.test.ts"
Cohesion: 0.11
Nodes (35): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+27 more)

### Community 92 - "networks.ts"
Cohesion: 0.06
Nodes (36): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+28 more)

### Community 93 - "version-checks.ts"
Cohesion: 0.12
Nodes (33): VersionedBlock, Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk (+25 more)

### Community 94 - "ChannelEndpoint"
Cohesion: 0.11
Nodes (13): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), discard(), isChannel(), queuedSlowProblems() (+5 more)

### Community 95 - "test/postgres/setup.ts"
Cohesion: 0.07
Nodes (32): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, Sql, SuiteWatchdogTimeoutError, pool() (+24 more)

### Community 96 - "database-parts.ts"
Cohesion: 0.07
Nodes (23): DatabaseParts, PglitePathParts, PostgresPartsInput, Job, Outcome, Stated, TestCertificates, event() (+15 more)

### Community 99 - "zero-timeouts-checks.ts"
Cohesion: 0.10
Nodes (25): Job, Outcome, apiRead(), engine(), report(), setUp(), idleBlock(), migrated() (+17 more)

### Community 248 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 50 - "refused"
Cohesion: 0.04
Nodes (67): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+59 more)

### Community 54 - "data"
Cohesion: 0.03
Nodes (66): params(), n(), data(), 2.1 The declaration, 2.2 Its table, 2.3 Writing each block, 2.4 Serving it, 2.5 The configuration file (+58 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+36 more)

### Community 103 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 116 - ".slowBlockMs"
Cohesion: 0.07
Nodes (29): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+21 more)

### Community 175 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 181 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 183 - "Tasks — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.17
Nodes (12): found(), ownKeys(), Rework (class 4), 0. Baseline, 10. Review (AGENTS.md stage 4, bounded), 11. Close-out, 2. The private link's settings renamed (D-6; CF-4), 4. The network request and plan (LM-3; design §5.1, §5.2) (+4 more)

### Community 190 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 194 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 200 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 220 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 222 - "Requirement: BK-1 Backup"
Cohesion: 0.22
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 227 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 233 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 243 - "selectLedgerVersion"
Cohesion: 0.52
Nodes (7): blockNamed(), checkPins(), hexOf(), isMnsvItem(), ledgerOfSpecVersion(), mnsvSpecVersion(), selectLedgerVersion()

### Community 262 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 296 - "checked-ledgers.test.ts"
Cohesion: 0.40
Nodes (3): copyVendoredLedger(), copy, VENDORED_ROOT

### Community 305 - "decodeExtrinsic"
Cohesion: 0.50
Nodes (3): callOf(), callVariants(), decodeExtrinsic()

### Community 306 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 45 - ".put"
Cohesion: 0.03
Nodes (77): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed (+69 more)

### Community 49 - "history"
Cohesion: 0.03
Nodes (68): history(), revision(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+60 more)

### Community 61 - "startUmbraDB"
Cohesion: 0.04
Nodes (54): text(), transportReader(), transportReaderRule(), startUmbraDB(), open(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem (+46 more)

### Community 63 - "table"
Cohesion: 0.04
Nodes (56): side(), migrations(), table(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 13. Providing items to other modules, 14. Private modules, 15. Migrations (+48 more)

### Community 71 - "T"
Cohesion: 0.04
Nodes (50): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Scenario: Version and timestamp addressing agree, 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get` (+42 more)

### Community 79 - "version"
Cohesion: 0.05
Nodes (44): deferred(), version(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log (+36 more)

### Community 88 - ".cwd"
Cohesion: 0.06
Nodes (34): join(), normalize(), resolve(), placeFor(), watchingPgDump(), log(), delimiter, sep (+26 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 97 - ".off"
Cohesion: 0.05
Nodes (36): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases (+28 more)

### Community 102 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 121 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 124 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+21 more)

### Community 143 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 144 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 149 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 161 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (18): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+10 more)

### Community 162 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 165 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker (+8 more)

### Community 168 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 169 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.12
Nodes (10): Build commands, Build the package and install it, Building from source, Run from a clone, 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model (+2 more)

### Community 170 - "README.md"
Cohesion: 0.17
Nodes (6): Choosing a database, Launching it, stats-module, Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 174 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 178 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 179 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 186 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 188 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 189 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 192 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 197 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 198 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 201 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 202 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 203 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 207 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 208 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 209 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 210 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 211 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 212 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 213 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 214 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 216 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 217 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 218 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 219 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 221 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 223 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 224 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 226 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 228 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 229 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 230 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 231 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 232 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 234 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 235 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 236 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 237 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 238 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 239 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 240 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 242 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 245 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 246 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 247 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 249 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 250 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 251 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 252 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 253 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 254 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 255 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 256 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 257 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 258 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 259 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 260 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 261 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 263 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 264 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 265 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 266 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 267 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 268 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 269 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 270 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 271 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 272 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 273 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 274 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 275 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 276 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 277 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 278 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 279 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 280 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 281 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 282 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 283 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 284 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 285 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 286 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 287 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 288 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 289 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 290 - "00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it"
Cohesion: 0.40
Nodes (4): 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it, Evidence, Problem, Suggested fix

### Community 291 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 292 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 293 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 294 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 295 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 297 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 298 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 299 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 300 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 301 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 302 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 303 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 304 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 309 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4126 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `admin-harness.ts`, `api.ts`, `column-rules.ts`, `UmbraError`, `validate.ts`, `ingest-harness.ts`, `resolve.ts`, `client.test.ts`, `tape/index.ts`, `openPostgres`, `adapter-fixtures.ts`, `spawnChild`, `NodeClient`, `host.ts`, `range.test.ts`, `core-ledger-state.ts`, `module-api.ts`, `backup/restore.ts`, `NodeBlockSource`, `binding.test.ts`, `config/history.ts`, `builds.ts`, `order.property.test.ts`, `chain-placement.test.ts`, `ref_node_crypto`, `zod`, `contract-modules.test.ts`, `process-build.ts`, `channel-queue.test.ts`, `.from`, `cbor.ts`, `loop.test.ts`, `devnet-upgrade.test.ts`, `core-block-parsed.ts`, `ledger/types.ts`, `builder.test.ts`, `process-backends.ts`, `height-versioned.test.ts`, `runner/process.ts`, `InMemoryBlockSource`, `pause-fixtures.ts`, `LedgerPackage`, `declaration.ts`, `ModuleDeclaration`, `core-transport.ts`, `api-server.test.ts`, `server.ts`, `backup/backup.ts`, `config-check.ts`, `db/backends.ts`, `ref_node_url`, `private/lockstep-wait.test.ts`, `backupAtStop`, `loop.ts`, `loop-stop-harness.ts`, `restore-ledger.ts`, `contract-data-checks.ts`, `slow-block-harness.ts`, `guarantees.test.ts`, `code`, `core-settings.ts`, `interfaces/transaction-history-storage.ts`, `ledger-tasks-checks.ts`, `deterministic-postgresql/index.ts`, `retirement.test.ts`, `pglite-lock.ts`, `start-umbradb.ts`, `shims.test.ts`, `boundary.test.ts`, `networks.ts`, `version-checks.ts`, `test/postgres/setup.ts`, `database-parts.ts`, `zero-timeouts-checks.ts`, `cold-boot-recovery.integration.test.ts`, `mounted-api.test.ts`, `browser/build.ts`, `halts.test.ts`, `resolver-boundary.ts`, `library/modules.test.ts`, `browser.test.ts`, `documents.ts`, `postgres/transaction-history-storage.ts`, `package.json`, `code-registry.ts`, `pg-tx-history-adapter.ts`, `read-gate.ts`, `release-version.ts`, `crash.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `demo-handlers.test.ts`, `surface.test.ts`, `node-bridge.ts`, `start-umbradb.test.ts`, `BlockItems`, `harness.ts`, `library-documents.test.ts`, `key-handling-checks.ts`, `excluded-not-exported.test.ts`, `LoopPauses`, `ws-mutual-tls.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `component-table.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `checked-ledgers.test.ts`?**
  _High betweenness centrality (0.219) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.022093559165802513 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `admin-harness.ts`, `vitest`, `api.ts`, `column-rules.ts`, `PrivateTransport`, `validate.ts`, `ingest-harness.ts`, `resolve.ts`, `client.test.ts`, `tape/index.ts`, `openPostgres`, `NodeClient`, `host.ts`, `core-ledger-state.ts`, `module-api.ts`, `backup/restore.ts`, `NodeBlockSource`, `binding.test.ts`, `config/history.ts`, `builds.ts`, `order.property.test.ts`, `ledger/metadata.ts`, `ref_node_crypto`, `zod`, `contract-modules.test.ts`, `process-build.ts`, `channel-queue.test.ts`, `defineModule`, `cbor.ts`, `loop.test.ts`, `core-block-parsed.ts`, `ledger/types.ts`, `FinalizedLoop`, `height-versioned.test.ts`, `runner/process.ts`, `InMemoryBlockSource`, `pause-fixtures.ts`, `declaration.ts`, `statementsOf`, `ModuleDeclaration`, `core-transport.ts`, `api-server.test.ts`, `backup/backup.ts`, `Process`, `browser/src/config/load.ts`, `config-check.ts`, `ref_node_url`, `db/backends.ts`, `backupAtStop`, `private/lockstep-wait.test.ts`, `loop.ts`, `startUmbraDB`, `restore-ledger.ts`, `slow-block-harness.ts`, `guarantees.test.ts`, `core-settings.ts`, `core-chain.ts`, `ledger-tasks-checks.ts`, `deterministic-postgresql/index.ts`, `core-block-commit/sql.ts`, `checkShape`, `sha256`, `version`, `graph.ts`, `configured.ts`, `pglite-lock.ts`, `start-umbradb.ts`, `shims.test.ts`, `.cwd`, `version-checks.ts`, `zero-timeouts-checks.ts`, `halts.test.ts`, `selectLedgerVersion`, `src/index.ts`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.024961838915327286 - nodes in this community are weakly interconnected._