# Graph Report - UmbraDB

## Corpus Check
- 1220 files · ~1,739,529 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12750 nodes · 39147 edges · 376 communities (338 shown, 38 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3325 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `a35b26223560d684` (1220 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- declaration.ts
- InMemoryBlockSource
- core-ledger-state.ts
- core-settings.ts
- private/lockstep-wait.test.ts
- test/postgres/setup.ts
- browser.test.ts
- chain-events-decode.test.ts
- vendored-ledger-v9.test.ts
- real-tapes.ts
- validate.ts
- node-format.ts
- release-version.ts
- column-rules.ts
- code-registry.ts
- pg-tx-history-adapter.ts
- browser/build.ts
- node-fields-harness.ts
- checks.test.ts
- .concat
- Database
- ledger-sweep.test.ts
- paused-harness.ts
- mapping.ts
- documents.ts
- src/ledger/identity.ts
- read-gate.ts
- crash.test.ts
- entries.ts
- fixtures/configuration.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- buffer.ts
- db/errors.ts
- state-trees.test.ts
- node-bridge.ts
- ws-mutual-tls.test.ts
- module-api.ts
- configuration-refusal.test.ts
- TransactionHistoryEntry
- pack-install.mjs
- admin-harness.ts
- core-block-fetch.test.ts
- chrome.ts
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- browser-harness.ts
- process-backends.ts
- version-table.ts
- ledger-table-config.test.ts
- GraphWorld
- describeNodeStoreExports
- .from
- node-source.ts
- private/part-migrations.test.ts
- LoopPauses
- client.test.ts
- statementsOf
- quiet-host.child.ts
- no-indexer-or-wallet-sdk.test.ts
- src/db/postgres.ts
- host.ts
- stats-module.ts
- TapeAnswers
- browser/src/config/load.ts
- builds.ts
- history.property.test.ts
- ledger-test-loader.ts
- worker-threads-worker.ts
- core-private-source.test.ts
- sweepStep
- childRefKeys
- .send
- Worker
- adapter-fixtures.ts
- Design — Sprint 1: project setup + TemporalKV
- ledger/plain-data.ts
- ledger/types.ts
- Finding
- .read
- signal-backup.worker.ts
- vitest
- worker-threads.test.ts
- cli-fixtures.ts
- mutation-evidence.d.mts
- EventsRunner
- AsyncLocalStorage
- channels.ts
- LedgerPackage
- pageBench
- worker-threads-host.ts
- UmbraError
- adapter.ts
- backup-fixtures.ts
- runner/process.ts
- order.property.test.ts
- tape/index.ts
- PageApiChannel
- NodeFS
- containers.test.ts
- Process
- core-transport.ts
- FinalizedLoop
- validate.test.ts
- core-config.test.ts
- ref_node_url
- pause-fixtures.ts
- startUmbraDB
- loop-stop-harness.ts
- loop.test.ts
- contract-data-checks.ts
- cbor.ts
- node.test.ts
- private/backends.ts
- resolve.ts
- start-umbradb.ts
- messages.ts
- connectWebSocket
- PgTransactionHistoryStorage
- channel-queue.test.ts
- process-harness.ts
- chain-data.test.ts
- ledger/ledger-tasks.test.ts
- loop.ts
- admin/lifecycle.test.ts
- migrate.ts
- core-chain.test.ts
- BlockRef
- transform-checks.ts
- config/history.ts
- backup/backup.ts
- NodeBlockSource
- interfaces/transaction-history-storage.ts
- opt-out.test.ts
- slow-block-harness.ts
- binding.test.ts
- sweep-tapes.ts
- boundary.test.ts
- range.ts
- PgliteDatabase
- config/plain-data.ts
- validation.ts
- module-api.test.ts
- version-checks.ts
- ingest-harness.ts
- startup-stop-harness.ts
- TapeRecord
- ModuleDeclaration
- transport.test.ts
- chain-placement.test.ts
- graph.ts
- core-block-parsed.ts
- private-transport.ts
- file-mode.test.ts
- NodeClient
- surface.test.ts
- retirement.test.ts
- restore-private.ts
- pglite-lock.ts
- refcount-model.ts
- networks.ts
- height-versioned.test.ts
- api-server.test.ts
- page.ts
- resolver-boundary.ts
- .retrying
- .configHash
- version
- T
- ADDED Requirements
- .off
- graph.py
- cold-boot-recovery.integration.test.ts
- .boolean
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- refused
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- transportReader
- following
- .slowBlockMs
- Design — START-UMBRADB: UmbraDB as a library
- options.ts
- .disconnect
- Tasks — START-UMBRADB: UmbraDB as a library
- conformance-gate.mjs
- mutation-per-adapter.mjs
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- h
- twox.ts
- nodeKey
- Boundaries, threats and controls
- UmbraDB third-party component inventory (SBOM)
- path.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- host-signal.ts
- orphan-watcher.mjs
- fresh-instance.mjs
- crash-worker.ts
- history
- data
- .put
- code
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
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- package.json
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- ADDED Requirements
- devDependencies
- README.md
- ADDED Requirements
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
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
- ADDED Requirements
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
- scoped-review-manifest
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Repository agent policy
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Requirement: BK-3 Restore into an empty database, checked before and after loading
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
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
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
- 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
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
- 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- start-stack.sh
- peerDependenciesMeta
- repository
- graphify/run.sh
- build-in-container.sh
- stats-module/run.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bugs
- engines
- peerDependencies
- post-block-update/oracle/run.sh
- state-trees/oracle/run.sh
- modules-missing.ts
- modules-not-a-list.ts
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData

## God Nodes (most connected - your core abstractions)
1. `vitest` - 419 edges
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
- `Evidence` --references--> `ManualTimers`  [INFERRED]
  docs/issues/00016-heartbeat-above-timer-limit.md → test/node/manual-timers.ts
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (376 total, 38 thin omitted)

### Community 0 - "declaration.ts"
Cohesion: 0.02
Nodes (141): BlockRow, UmbraConfig, BlockWriteHandle, ReadHandle, SchemaWriteHandle, MigrationPart, SchemaPlan, ErrorCode (+133 more)

### Community 1 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (118): ChainCheck, ChainCheckInput, ChainIdentity, BackupWritten, BlockSource, InMemoryBlockSource, InMemoryItems, Wait (+110 more)

### Community 10 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (107): BlockLedgerSource, CoreContractStatesOptions, ContractStateRow, LedgerBinding, LedgerStateItem, RetainedState, retainedStates, CoreRevision (+99 more)

### Community 100 - "core-settings.ts"
Cohesion: 0.05
Nodes (40): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, Absent, DeepReadonly (+32 more)

### Community 106 - "private/lockstep-wait.test.ts"
Cohesion: 0.10
Nodes (34): LockstepCondition, OpenTransaction, A118Observation, MismatchObservation, ExpectedWait, WaitSample, RetargetProxy, a118Problems() (+26 more)

### Community 107 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 109 - "browser.test.ts"
Cohesion: 0.08
Nodes (36): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, heldClock, continuedProblems() (+28 more)

### Community 11 - "chain-events-decode.test.ts"
Cohesion: 0.04
Nodes (94): BodyExtrinsic, ExtrinsicCall, BlockBody, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType (+86 more)

### Community 110 - "vendored-ledger-v9.test.ts"
Cohesion: 0.12
Nodes (32): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, freeAll(), runInFreshInstance(), bigCell() (+24 more)

### Community 111 - "real-tapes.ts"
Cohesion: 0.08
Nodes (32): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+24 more)

### Community 115 - "validate.ts"
Cohesion: 0.11
Nodes (36): CursorRule, Issue, Plain, coreSettingsSchema(), pathOf(), closest(), configFindings(), configSecrets() (+28 more)

### Community 116 - "node-format.ts"
Cohesion: 0.11
Nodes (21): GeneratedBlock, GeneratedState, Child, Reader, Readable, Reader, TableNode, concat() (+13 more)

### Community 119 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 12 - "column-rules.ts"
Cohesion: 0.02
Nodes (105): DumpInput, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+97 more)

### Community 120 - "code-registry.ts"
Cohesion: 0.10
Nodes (32): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+24 more)

### Community 121 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (24): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+16 more)

### Community 123 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 124 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (26): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+18 more)

### Community 128 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+14 more)

### Community 129 - ".concat"
Cohesion: 0.08
Nodes (21): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+13 more)

### Community 13 - "Database"
Cohesion: 0.03
Nodes (79): Database, ReadOptions, Settings, TestBackend, TestDatabase, Case, LoadOutcome, OutsideRead (+71 more)

### Community 131 - "ledger-sweep.test.ts"
Cohesion: 0.13
Nodes (16): SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel (+8 more)

### Community 132 - "paused-harness.ts"
Cohesion: 0.14
Nodes (26): Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, keeperModule(), keepingPause() (+18 more)

### Community 133 - "mapping.ts"
Cohesion: 0.11
Nodes (28): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+20 more)

### Community 134 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 135 - "src/ledger/identity.ts"
Cohesion: 0.14
Nodes (25): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages() (+17 more)

### Community 138 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 139 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 14 - "entries.ts"
Cohesion: 0.03
Nodes (109): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase, Entry (+101 more)

### Community 140 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (20): BrowserConfiguration, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig(), coreConfiguration() (+12 more)

### Community 142 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 143 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 144 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 145 - "buffer.ts"
Cohesion: 0.11
Nodes (17): BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText(), charCodes(), encodingOf() (+9 more)

### Community 146 - "db/errors.ts"
Cohesion: 0.13
Nodes (12): ReadTimeoutSetting, ErrorDetails, mapRows(), mapValue(), TRUNCATE_NOT_ALLOWED_SQLSTATE, ERROR_CODES, RETRYABLE, RESULT_TYPES (+4 more)

### Community 147 - "state-trees.test.ts"
Cohesion: 0.11
Nodes (20): StateSummary, LedgerHeight, OracleState, OracleVersion, stateBytes(), stateTreesProblems(), written(), exported() (+12 more)

### Community 148 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 149 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 15 - "module-api.ts"
Cohesion: 0.04
Nodes (94): coreHeaders, HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions (+86 more)

### Community 153 - "configuration-refusal.test.ts"
Cohesion: 0.15
Nodes (18): ConfigFinding, configurationRefused(), findingText(), refusalFindings(), configurationFindings(), configurationRefusalLines(), isConfigurationRefusal(), messageOf() (+10 more)

### Community 154 - "TransactionHistoryEntry"
Cohesion: 0.15
Nodes (11): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+3 more)

### Community 155 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 16 - "admin-harness.ts"
Cohesion: 0.04
Nodes (110): AdminStarter, EngineConfig, AdminRun, AdminRunOptions, Answerer, Expected, Hold, Prober (+102 more)

### Community 162 - "core-block-fetch.test.ts"
Cohesion: 0.13
Nodes (10): BlockHeaderItem, BlockItemSource, CoreBlockHeader, bindCoreBlockFetch(), coreBlockFetchOnFetch(), isBlockItemSource(), BOUND, CORE_BLOCK_FETCH (+2 more)

### Community 164 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 165 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 166 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 168 - "browser-harness.ts"
Cohesion: 0.24
Nodes (18): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+10 more)

### Community 17 - "process-backends.ts"
Cohesion: 0.04
Nodes (92): DatabaseParts, PostgresPartsInput, Answered, gate, Observation, Renamed, SecretHashes, SecretVariant (+84 more)

### Community 174 - "version-table.ts"
Cohesion: 0.21
Nodes (18): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+10 more)

### Community 175 - "ledger-table-config.test.ts"
Cohesion: 0.25
Nodes (17): Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts() (+9 more)

### Community 177 - "describeNodeStoreExports"
Cohesion: 0.17
Nodes (5): Disposable, NodeStoreExports, NodeStoreSubject, hasEmbeddedChild(), describeNodeStoreExports()

### Community 18 - ".from"
Cohesion: 0.04
Nodes (107): SeenLoad, retentionSeen, ledgerScenario, LedgerTx, RawPackageClass, recordedGenesis, PackageStartup, ProcessDatabase (+99 more)

### Community 180 - "node-source.ts"
Cohesion: 0.13
Nodes (9): CoreBlockItems, Prefetch, NodeSubscription, SourceCondition, SourceNodeView, systemEventsKey(), decodeExtrinsics(), genesisStateOf() (+1 more)

### Community 181 - "private/part-migrations.test.ts"
Cohesion: 0.18
Nodes (14): FoldedPart, RecordedMigration, earlierBootstrapSql(), earlierRefusalProblems(), earlierRows(), earlierRowsSql(), recorded(), rowsSql() (+6 more)

### Community 183 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 19 - "client.test.ts"
Cohesion: 0.03
Nodes (63): NodeClientOptions, NodeRetry, ConnectSocket, HandSocket, HandSockets, Answer, FakeNode, Handler (+55 more)

### Community 190 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 197 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 198 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 2 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (126): SslMode, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, MultiStatementRunner, Job, Outcome (+118 more)

### Community 20 - "host.ts"
Cohesion: 0.04
Nodes (74): LoadLedger, TransactionParser, LedgerName, ChainOutcome, ParsedTransaction, AppliedState, ApplyBlock, BlockId (+66 more)

### Community 200 - "stats-module.ts"
Cohesion: 0.26
Nodes (11): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+3 more)

### Community 207 - "TapeAnswers"
Cohesion: 0.25
Nodes (9): TapeAnswers, FoundTape, Tape, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf() (+1 more)

### Community 209 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 21 - "builds.ts"
Cohesion: 0.04
Nodes (80): PrivateProcess, PrivateRefusal, PrivateSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation (+72 more)

### Community 214 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 215 - "ledger-test-loader.ts"
Cohesion: 0.19
Nodes (12): SlowStep, TestLoaderData, beat(), countDeserializations(), hexOf(), loadLedger(), probe(), deserialized (+4 more)

### Community 217 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 22 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (58): PrivateBlockSource, privateIntake, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision, StartHashes (+50 more)

### Community 221 - "sweepStep"
Cohesion: 0.26
Nodes (5): SweepTables, hexOf(), merged(), sweepStep(), 3.1 Where it runs

### Community 222 - "childRefKeys"
Cohesion: 0.38
Nodes (3): ChildReader, childRefKeys(), readChildren()

### Community 23 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (89): ApplyOutput, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+81 more)

### Community 231 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.20
Nodes (10): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+2 more)

### Community 235 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 24 - "ledger/types.ts"
Cohesion: 0.04
Nodes (84): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+76 more)

### Community 243 - "Finding"
Cohesion: 0.31
Nodes (10): Finding, readOptions, named(), elementsOf(), guarded(), keysOf(), readOption(), readValue() (+2 more)

### Community 25 - ".read"
Cohesion: 0.04
Nodes (97): TableDigest, TableDigestRow, CapturedTable, ChangeKind, tableChanges, TouchedRow, Chain, DigestRow (+89 more)

### Community 252 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 26 - "vitest"
Cohesion: 0.03
Nodes (61): Served, ProcessObservation, StartVia, Finding, Lockfile, Manifest, BlockImport, ChildResult (+53 more)

### Community 27 - "cli-fixtures.ts"
Cohesion: 0.04
Nodes (72): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, CommandResult, CheckTarget, CliBackend (+64 more)

### Community 270 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 28 - "channels.ts"
Cohesion: 0.04
Nodes (54): demoLink, PrivateLinkConnect, ChannelEndpoint, EndpointEvents, EndpointOptions, Envelope, LinkTimers, MessagePortLike (+46 more)

### Community 29 - "LedgerPackage"
Cohesion: 0.05
Nodes (49): ApplyInput, LedgerPackage, StateHandle, StoredNode, LedgerEngine, LedgerTaskFailed, AdapterWorkerRequest, StagenetBlockJson (+41 more)

### Community 293 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 294 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 3 - "UmbraError"
Cohesion: 0.02
Nodes (132): BrowserRun, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, PgliteLockUse, Scope (+124 more)

### Community 30 - "adapter.ts"
Cohesion: 0.03
Nodes (74): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+66 more)

### Community 31 - "backup-fixtures.ts"
Cohesion: 0.06
Nodes (65): BackupBackend, BackupDatabase, killedRestore, TickerConfig, TickerHandle, WORKER, SignalEvent, cliProject (+57 more)

### Community 32 - "runner/process.ts"
Cohesion: 0.03
Nodes (81): AllowedDetail, SanitizedError, NodeWait, PointName, LifecycleStatus, CallbackFailure, ProcessReason, ReasonCode (+73 more)

### Community 33 - "order.property.test.ts"
Cohesion: 0.04
Nodes (85): GraphInput, PastFaultCase, RefusalCase, CallEvent, Recorder, CheckName, GraphSpec, ModuleSpec (+77 more)

### Community 34 - "tape/index.ts"
Cohesion: 0.05
Nodes (57): RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError, Connection (+49 more)

### Community 35 - "containers.test.ts"
Cohesion: 0.04
Nodes (71): BaselineLoad, Comparison, CommitOptions, PostgresRun, BenchEnv, ManualOpts, TinybenchOpts, Backend (+63 more)

### Community 36 - "Process"
Cohesion: 0.05
Nodes (24): NetworkShown, ProcessAdmin, ProcessAdminOptions, NodeFacts, ConfigCheckSeams, redactor, LedgerWorkerOptions, Heartbeat (+16 more)

### Community 37 - "core-transport.ts"
Cohesion: 0.04
Nodes (51): Connected, CoreTransport, CoreTransportOptions, CoreLink, CoreSessionOptions, coreSessions, InstanceView, LinkConnection (+43 more)

### Community 38 - "FinalizedLoop"
Cohesion: 0.04
Nodes (25): PointRun, Activity, FinalizedLoop, HeightRun, LoopObserver, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction (+17 more)

### Community 39 - "validate.test.ts"
Cohesion: 0.04
Nodes (75): EntryView, PlainObject, RedactableConfig, RedactionForms, SecretForm, TextPattern, ConfigRule, EntryRef (+67 more)

### Community 4 - "core-config.test.ts"
Cohesion: 0.03
Nodes (128): PrivateSideFacts, RevisionSettings, adminRoutes, DigestRow, ModuleFacts, PartTable, PrivateInstanceFacts, SnapshotFacts (+120 more)

### Community 40 - "ref_node_url"
Cohesion: 0.03
Nodes (71): ParentJob, Kill, Orphaned, SourceFile, Run, WorkerEvent, LockResult, Report (+63 more)

### Community 41 - "pause-fixtures.ts"
Cohesion: 0.04
Nodes (68): backupSignalRelay, BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable, PausableConfig, PausableOptions (+60 more)

### Community 42 - "startUmbraDB"
Cohesion: 0.03
Nodes (78): Job, Run, backupAtStop(), startUmbraDB(), log(), database, gone, runs (+70 more)

### Community 43 - "loop-stop-harness.ts"
Cohesion: 0.05
Nodes (72): Manifest, Restored, RestoreInput, CrashEvent, CrashJob, ingest, watched, RestartEvent (+64 more)

### Community 44 - "loop.test.ts"
Cohesion: 0.05
Nodes (63): LockstepWait, LoopEnd, Faults, LostCommit, Seen, AtGate, LoopClass, Broken (+55 more)

### Community 45 - "contract-data-checks.ts"
Cohesion: 0.06
Nodes (78): CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx (+70 more)

### Community 46 - "cbor.ts"
Cohesion: 0.04
Nodes (74): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+66 more)

### Community 47 - "node.test.ts"
Cohesion: 0.04
Nodes (40): Outage, Metadata, Step, Frame, RawClient, Failure, Variant, TapeError (+32 more)

### Community 48 - "private/backends.ts"
Cohesion: 0.05
Nodes (46): PglitePathParts, PostgresParts, Keeping, PrivateBackend, SessionSeen, PublicCore, TestCertificates, A162Options (+38 more)

### Community 49 - "resolve.ts"
Cohesion: 0.05
Nodes (68): AddressRequest, Asked, LinkPlan, NetworkContext, NetworkInput, NetworkPlan, NetworkProblem, NetworkRequest (+60 more)

### Community 5 - "start-umbradb.ts"
Cohesion: 0.03
Nodes (117): RunOptions, RunSeams, SignalSource, stopSignal, coreEntry, Address, UmbraDBBackup, UmbraDBCondition (+109 more)

### Community 51 - "messages.ts"
Cohesion: 0.04
Nodes (50): Committed, MessageFault, MessageType, Report, HeldLink, HoldingRelay, ReportRelay, parseJsonLossless() (+42 more)

### Community 52 - "connectWebSocket"
Cohesion: 0.05
Nodes (36): Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+28 more)

### Community 53 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (57): TransactionHistoryStorage, PgTransactionHistoryStorage, rowToEntry(), reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 4. Wiring `PgTemporalKV`'s `opts.tx` (+49 more)

### Community 54 - "channel-queue.test.ts"
Cohesion: 0.06
Nodes (54): controlledTimers, PeerEnd, PeerMessage, rawPeer, TestEnd, TestEndOptions, Logged, QueueRun (+46 more)

### Community 55 - "process-harness.ts"
Cohesion: 0.05
Nodes (38): ResolvedGraph, LoopInput, MisuseListener, MisuseReports, ProcessContexts, ProcessItems, PublishRefusal, RunnerBackend (+30 more)

### Community 56 - "chain-data.test.ts"
Cohesion: 0.07
Nodes (63): BlockParsed, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec, chainBlock (+55 more)

### Community 57 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (49): LedgerTask, EngineOptions, CallArgsItem, CallArguments, V9Raw, bindLedgerTasks(), boundHost(), frozen() (+41 more)

### Community 58 - "loop.ts"
Cohesion: 0.06
Nodes (48): HeightRange, ResolvedRange, Callback, EntryBoundary, ParallelPoint, PointArguments, PointSchedule, HeightActivity (+40 more)

### Community 59 - "admin/lifecycle.test.ts"
Cohesion: 0.05
Nodes (42): MountedAdminAnswer, AdminSeams, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions (+34 more)

### Community 6 - "migrate.ts"
Cohesion: 0.03
Nodes (119): Transaction, AppliedRow, Runnable, Settling, StartupInput, Difference, OwnPart, PlannedSchema (+111 more)

### Community 60 - "core-chain.test.ts"
Cohesion: 0.05
Nodes (47): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, WaitingListener, ConfigRow, PrivateChecks, PrivateLinkAddress (+39 more)

### Community 62 - "BlockRef"
Cohesion: 0.05
Nodes (38): QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, CommitOutcome, HeldHeight, Fetching, Recorder (+30 more)

### Community 63 - "transform-checks.ts"
Cohesion: 0.08
Nodes (42): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, baseRecords() (+34 more)

### Community 64 - "config/history.ts"
Cohesion: 0.06
Nodes (53): CoreSettings, HistoryCode, HistoryContext, HistoryFinding, ProvidesRow, Span, SettingsSchema, errorCode() (+45 more)

### Community 65 - "backup/backup.ts"
Cohesion: 0.07
Nodes (54): BackupInput, BackupSeams, BackupTarget, BackupFacts, ManifestHistoryRow, ManifestMigration, ManifestTool, PgliteDump (+46 more)

### Community 68 - "NodeBlockSource"
Cohesion: 0.08
Nodes (16): HeadWait, NodeBlockSource, PreparedBlock, QueueRunner, NoWindow, Refetches, TrustsNotifications, Opened (+8 more)

### Community 69 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (40): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, JsonEncoded (+32 more)

### Community 7 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (102): CaptureColumn, CaptureState, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+94 more)

### Community 70 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (48): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+40 more)

### Community 71 - "binding.test.ts"
Cohesion: 0.06
Nodes (48): A165Options, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding, Created (+40 more)

### Community 72 - "sweep-tapes.ts"
Cohesion: 0.10
Nodes (49): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData (+41 more)

### Community 73 - "boundary.test.ts"
Cohesion: 0.08
Nodes (45): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+37 more)

### Community 74 - "range.ts"
Cohesion: 0.06
Nodes (49): BoundaryBlockReading, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange, Final, Height (+41 more)

### Community 75 - "PgliteDatabase"
Cohesion: 0.07
Nodes (12): JobQueue, PgliteDatabase, BoundedRead, ReadPool, Session, Writer, commitRolledBack(), handleClosed() (+4 more)

### Community 76 - "config/plain-data.ts"
Cohesion: 0.06
Nodes (41): ImportedConfig, LoadedConfig, LoadOptions, PlainArray, plainData, PlainDataNode, PlainDataRule, Walk (+33 more)

### Community 77 - "validation.ts"
Cohesion: 0.06
Nodes (42): DeclarationRule, PlacedDeclaration, Plain, Shape, Case, ShapeCase, Stats, checkItem() (+34 more)

### Community 78 - "module-api.test.ts"
Cohesion: 0.06
Nodes (43): ChainDataView, A47Observation, CommitsTheBoundary, Version, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight() (+35 more)

### Community 79 - "version-checks.ts"
Cohesion: 0.08
Nodes (29): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, Boundary, CallRecord, CountingNode, MetadataSelector (+21 more)

### Community 8 - "ingest-harness.ts"
Cohesion: 0.04
Nodes (103): NodeCallOptions, ProcessCondition, RecordingClient, ArgType, BlockOptions, CallSpec, RUNTIME, Decoded (+95 more)

### Community 80 - "startup-stop-harness.ts"
Cohesion: 0.07
Nodes (38): SignalTarget, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StartVia, stopBy (+30 more)

### Community 81 - "TapeRecord"
Cohesion: 0.07
Nodes (31): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Link, TapeBuilder (+23 more)

### Community 82 - "ModuleDeclaration"
Cohesion: 0.08
Nodes (47): ConfigFacts, OpenedConfig, OpenedFacts, CoreChainFacts, RestoreBase, CheckFinding, CheckState, ConfigCheckOptions (+39 more)

### Community 83 - "transport.test.ts"
Cohesion: 0.07
Nodes (34): ReadOnlyDatabase, Message, Ended, rawClient, Escape, publicState, Refused, hexOf() (+26 more)

### Community 84 - "chain-placement.test.ts"
Cohesion: 0.10
Nodes (40): eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, LedgerScenarioOptions (+32 more)

### Community 85 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck (+40 more)

### Community 87 - "core-block-parsed.ts"
Cohesion: 0.06
Nodes (43): BlockEventSource, ledgerVersionOf(), blockBodyOf(), blockParsedOf(), boundLedgerParser(), chainHashOf(), coreBlockParsedOnParse(), hexOf() (+35 more)

### Community 88 - "private-transport.ts"
Cohesion: 0.08
Nodes (21): PublicSide, HelloAck, JsonValue, ReadResult, StatementResult, CarrierConnection, Pending, PrivateCarrier (+13 more)

### Community 89 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (33): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+25 more)

### Community 9 - "NodeClient"
Cohesion: 0.05
Nodes (77): NodeSourceOptions, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription (+69 more)

### Community 90 - "surface.test.ts"
Cohesion: 0.07
Nodes (45): Document, EntryInput, Renamed, Surface, SurfaceAmendment, changelogEntryProblems(), entryTerms(), namesWord() (+37 more)

### Community 91 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 92 - "restore-private.ts"
Cohesion: 0.08
Nodes (35): RestoreSeams, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome, RestoreJob, FileProcess, privateBackup (+27 more)

### Community 93 - "pglite-lock.ts"
Cohesion: 0.07
Nodes (36): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, ChildResult (+28 more)

### Community 94 - "refcount-model.ts"
Cohesion: 0.08
Nodes (35): BlockKind, BlockScript, BoundaryRewrite, DrivenBlock, GraphNode, HistoryScript, OracleReport, R1Case (+27 more)

### Community 95 - "networks.ts"
Cohesion: 0.06
Nodes (40): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+32 more)

### Community 96 - "height-versioned.test.ts"
Cohesion: 0.09
Nodes (31): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+23 more)

### Community 97 - "api-server.test.ts"
Cohesion: 0.07
Nodes (31): ChainDataAnswer, HttpHandler, HttpRoute, AcceptsDuplicates, AddsExtensions, AddsHeaders, AppendsVersion, Client (+23 more)

### Community 98 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 99 - "resolver-boundary.ts"
Cohesion: 0.08
Nodes (38): TypeCheckFinding, TypeCheckResult, Access, AllowedRead, Boundary, Crossing, Guard, configCompilerOptions() (+30 more)

### Community 199 - ".retrying"
Cohesion: 0.14
Nodes (11): The node on `/status`, 7. Storage helpers, MODIFIED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 211 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 86 - "version"
Cohesion: 0.05
Nodes (46): side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+38 more)

### Community 102 - "T"
Cohesion: 0.05
Nodes (41): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+33 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 105 - ".off"
Cohesion: 0.05
Nodes (37): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears (+29 more)

### Community 113 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 114 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (25): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed(), ledgerV8NodeEntry() (+17 more)

### Community 126 - ".boolean"
Cohesion: 0.06
Nodes (31): 4.1 Column types, 4.2 Rules, 4.3 Data that is not a function of the chain: `deterministic: false`, 4. Deterministic PostgreSQL, 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order (+23 more)

### Community 137 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.07
Nodes (27): sweepReset(), 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents, 7. `core-arch` criteria rewritten by this change (+19 more)

### Community 156 - "refused"
Cohesion: 0.13
Nodes (21): bindLedgerParser(), bindCoreChainEvents(), refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 2. Points (+13 more)

### Community 157 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 159 - "transportReader"
Cohesion: 0.10
Nodes (19): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 10. Requirement coverage, 2. Network (+11 more)

### Community 160 - "following"
Cohesion: 0.10
Nodes (21): cursorRead(), following(), 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began, Evidence, Problem, Suggested fix, Backup and restore, Check and run (+13 more)

### Community 163 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 170 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.12
Nodes (16): transportReaderRule(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout, 2. Architecture (+8 more)

### Community 182 - "options.ts"
Cohesion: 0.22
Nodes (17): addressFindings(), configFindings(), finding(), isHost(), isObject(), networkFindings(), optionFindings(), privateSourceRefusal() (+9 more)

### Community 189 - ".disconnect"
Cohesion: 0.15
Nodes (14): fault(), Suggested fix, 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants (+6 more)

### Community 191 - "Tasks — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.13
Nodes (12): ownKeys(), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Rework (class 4), 0. Baseline, 10. Review (AGENTS.md stage 4, bounded), 11. Close-out, 2. The private link's settings renamed (D-6; CF-4), 4. The network request and plan (LM-3; design §5.1, §5.2) (+4 more)

### Community 195 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 196 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 201 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (12): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+4 more)

### Community 206 - "h"
Cohesion: 0.14
Nodes (13): h(), clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls (+5 more)

### Community 208 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 218 - "nodeKey"
Cohesion: 0.18
Nodes (11): node(), childKeys(), node(), nodeKey(), 4.1 Reachability does not depend on the form, 4.2 Safety: no deleted row is live in the stored graph; the eviction covers the rest, 4.3 No leak (I5) and the exact set (I6), 4.4 Determinism across worker histories (O-8) (+3 more)

### Community 219 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 227 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 244 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 255 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 260 - "host-signal.ts"
Cohesion: 0.32
Nodes (5): isAbortSignal(), followSignal(), isSignal(), ABORTED, REASON

### Community 290 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 332 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 343 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 50 - "history"
Cohesion: 0.03
Nodes (68): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+60 more)

### Community 61 - "data"
Cohesion: 0.03
Nodes (66): params(), data(), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not), Rework (class 3 continued — cross-vendor cold audit, rounds 2-4), Rework (class 3 — cross-vendor audit caught real correctness defects post-self-verify), 7. The module API (+58 more)

### Community 66 - ".put"
Cohesion: 0.04
Nodes (55): coreTxResultsOnParse(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+47 more)

### Community 67 - "code"
Cohesion: 0.04
Nodes (57): code(), Added, 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit (+49 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 112 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 130 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 152 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 158 - "package.json"
Cohesion: 0.09
Nodes (22): bin, umbradb, description, exports, files, homepage, license, main (+14 more)

### Community 161 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 169 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.11
Nodes (18): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7), Rework (class 1 — infra) (+10 more)

### Community 171 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 172 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 178 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 179 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 184 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 185 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.12
Nodes (11): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+3 more)

### Community 186 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker (+8 more)

### Community 188 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 192 - "README.md"
Cohesion: 0.19
Nodes (6): Choosing a database, Launching it, stats-module, Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 193 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 194 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.13
Nodes (14): 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words, 5. Eviction, the one-block lag and the worker restart (+6 more)

### Community 202 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception (+5 more)

### Community 203 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 204 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 205 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 210 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 212 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 213 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 216 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 220 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 224 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 225 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 228 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 229 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 230 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 232 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 233 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 234 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 236 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 237 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 238 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 239 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 240 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 241 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 242 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 245 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 246 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 247 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 248 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 249 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 250 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 251 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 253 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 254 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 256 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 257 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 258 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 259 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 262 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 263 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 264 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 265 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 266 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 267 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 268 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 269 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 271 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 274 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 275 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 276 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 277 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 278 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 279 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 280 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 281 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 282 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 283 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 284 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 285 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 286 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 287 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 288 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 289 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 291 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 292 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 295 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 296 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 297 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 298 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 299 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 300 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 301 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 302 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 303 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 304 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 305 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

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

### Community 323 - "00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered"
Cohesion: 0.40
Nodes (4): 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered, Evidence, Problem, Suggested fix

### Community 324 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 325 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 326 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 327 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 328 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 329 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 330 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 331 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 333 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 334 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 335 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 336 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 337 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 338 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 339 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 340 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 341 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 346 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 347 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-7693`, `RFC-7693`, `RFC-3339` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4223 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **38 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `declaration.ts`, `InMemoryBlockSource`, `src/db/postgres.ts`, `UmbraError`, `core-config.test.ts`, `start-umbradb.ts`, `migrate.ts`, `opt-out.test.ts`, `ingest-harness.ts`, `NodeClient`, `core-ledger-state.ts`, `chain-events-decode.test.ts`, `column-rules.ts`, `Database`, `entries.ts`, `module-api.ts`, `admin-harness.ts`, `process-backends.ts`, `.from`, `client.test.ts`, `host.ts`, `builds.ts`, `core-private-source.test.ts`, `adapter-fixtures.ts`, `ledger/types.ts`, `.read`, `cli-fixtures.ts`, `LedgerPackage`, `adapter.ts`, `backup-fixtures.ts`, `runner/process.ts`, `order.property.test.ts`, `tape/index.ts`, `containers.test.ts`, `core-transport.ts`, `validate.test.ts`, `ref_node_url`, `pause-fixtures.ts`, `loop-stop-harness.ts`, `loop.test.ts`, `contract-data-checks.ts`, `cbor.ts`, `node.test.ts`, `private/backends.ts`, `resolve.ts`, `messages.ts`, `connectWebSocket`, `channel-queue.test.ts`, `process-harness.ts`, `chain-data.test.ts`, `ledger/ledger-tasks.test.ts`, `loop.ts`, `admin/lifecycle.test.ts`, `core-chain.test.ts`, `BlockRef`, `transform-checks.ts`, `config/history.ts`, `backup/backup.ts`, `interfaces/transaction-history-storage.ts`, `slow-block-harness.ts`, `binding.test.ts`, `sweep-tapes.ts`, `boundary.test.ts`, `config/plain-data.ts`, `validation.ts`, `module-api.test.ts`, `version-checks.ts`, `startup-stop-harness.ts`, `TapeRecord`, `transport.test.ts`, `chain-placement.test.ts`, `file-mode.test.ts`, `surface.test.ts`, `retirement.test.ts`, `restore-private.ts`, `pglite-lock.ts`, `refcount-model.ts`, `networks.ts`, `height-versioned.test.ts`, `api-server.test.ts`, `resolver-boundary.ts`, `core-settings.ts`, `private/lockstep-wait.test.ts`, `test/postgres/setup.ts`, `browser.test.ts`, `vendored-ledger-v9.test.ts`, `real-tapes.ts`, `cold-boot-recovery.integration.test.ts`, `node-format.ts`, `release-version.ts`, `code-registry.ts`, `pg-tx-history-adapter.ts`, `browser/build.ts`, `node-fields-harness.ts`, `checks.test.ts`, `ledger-sweep.test.ts`, `documents.ts`, `src/ledger/identity.ts`, `read-gate.ts`, `crash.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `db/errors.ts`, `state-trees.test.ts`, `node-bridge.ts`, `ws-mutual-tls.test.ts`, `configuration-refusal.test.ts`, `package.json`, `core-block-fetch.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `excluded-not-exported.test.ts`, `ledger-table-config.test.ts`, `private/part-migrations.test.ts`, `LoopPauses`, `statementsOf`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `twox.ts`, `history.property.test.ts`, `ledger/plain-data.ts`, `host-signal.ts`, `worker-threads.test.ts`?**
  _High betweenness centrality (0.214) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-7693` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.023695602642971065 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `declaration.ts`, `InMemoryBlockSource`, `src/db/postgres.ts`, `core-config.test.ts`, `start-umbradb.ts`, `migrate.ts`, `opt-out.test.ts`, `ingest-harness.ts`, `NodeClient`, `core-ledger-state.ts`, `Database`, `entries.ts`, `module-api.ts`, `admin-harness.ts`, `process-backends.ts`, `client.test.ts`, `host.ts`, `builds.ts`, `core-private-source.test.ts`, `ledger/types.ts`, `.read`, `vitest`, `channels.ts`, `backup-fixtures.ts`, `runner/process.ts`, `order.property.test.ts`, `Process`, `core-transport.ts`, `FinalizedLoop`, `validate.test.ts`, `pause-fixtures.ts`, `startUmbraDB`, `loop-stop-harness.ts`, `loop.test.ts`, `cbor.ts`, `resolve.ts`, `channel-queue.test.ts`, `process-harness.ts`, `ledger/ledger-tasks.test.ts`, `loop.ts`, `core-chain.test.ts`, `transform-checks.ts`, `config/history.ts`, `backup/backup.ts`, `NodeBlockSource`, `slow-block-harness.ts`, `binding.test.ts`, `range.ts`, `PgliteDatabase`, `config/plain-data.ts`, `validation.ts`, `module-api.test.ts`, `version-checks.ts`, `TapeRecord`, `ModuleDeclaration`, `transport.test.ts`, `graph.ts`, `private-transport.ts`, `restore-private.ts`, `pglite-lock.ts`, `height-versioned.test.ts`, `api-server.test.ts`, `private/lockstep-wait.test.ts`, `validate.ts`, `checks.test.ts`, `mapping.ts`, `src/ledger/identity.ts`, `buffer.ts`, `db/errors.ts`, `configuration-refusal.test.ts`, `refused`, `following`, `version-table.ts`, `ledger-table-config.test.ts`, `node-source.ts`, `private/part-migrations.test.ts`, `options.ts`, `statementsOf`, `browser/src/config/load.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `InMemoryBlockSource` be split into smaller, more focused modules?**
  _Cohesion score 0.024543343167409453 - nodes in this community are weakly interconnected._