# Graph Report - UmbraDB

## Corpus Check
- 1189 files · ~1,677,327 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12408 nodes · 38290 edges · 334 communities (301 shown, 33 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3174 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `6bcca85762211833` (1189 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- column-rules.ts
- Database
- module-api.ts
- page.ts
- core-chain.ts
- test/postgres/setup.ts
- validate.ts
- adapter-fixtures.ts
- backup/restore.ts
- private/lockstep-wait.test.ts
- release-version.ts
- redact.ts
- browser/build.ts
- process-worker.ts
- node-fields-harness.ts
- refused-configuration.test.ts
- postgres/transaction-history-storage.ts
- TransactionHistoryEntry
- checks.test.ts
- documents.ts
- code-registry.ts
- read-gate.ts
- core.ts
- interfaces/transaction-history-storage.ts
- ledger-storage.test.ts
- restore-private.ts
- Lockstep
- Buffer
- core-contract-states.ts
- pg-tx-history-adapter.ts
- core-contract-logs-full.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- ref_node_url
- threat-model.test.ts
- crash.test.ts
- fixtures/configuration.ts
- options.ts
- config/plain-data.ts
- surface.test.ts
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- UmbraError
- answerChainData
- backupAtStop
- pack-install.mjs
- pglite-server.ts
- block-fetch-decode.test.ts
- transcripts.ts
- .concat
- builds.ts
- state-trees.test.ts
- library-documents.test.ts
- chrome.ts
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- tape/index.ts
- LoopPauses
- tabReport
- browser/serve.ts
- core-private-source.test.ts
- FakeNode
- ws-mutual-tls.test.ts
- statementsOf
- quiet-host.child.ts
- entries.ts
- browser/src/config/load.ts
- worker-threads.test.ts
- Heartbeat
- src/db/postgres.ts
- FinalizedLoop
- worker-threads-worker.ts
- .send
- Worker
- ledger/types.ts
- sha256
- config/history.ts
- core-transport.ts
- process-build.ts
- mutation-evidence.d.mts
- stats.ts
- AsyncLocalStorage
- loop.test.ts
- range.test.ts
- items.ts
- listening.test.ts
- host.ts
- order.property.test.ts
- InMemoryBlockSource
- ref_node_path
- NodeFS
- BlockRef
- heldClock
- transport-faults.test.ts
- LedgerPackage
- 5. Runner
- client.ts
- default.test.ts
- channel-checks.test.ts
- .from
- NodeClient
- node-format.ts
- process-admin.ts
- vitest
- cbor.ts
- transform-checks.ts
- networks.ts
- .value
- ledger/ledger-tasks.test.ts
- admin-harness.ts
- version-checks.ts
- loop-stop-harness.ts
- config-check.ts
- range.ts
- core-block-parsed.ts
- ModuleDeclaration
- slow-block-harness.ts
- loop.ts
- core-ledger-state.ts
- PgTransactionHistoryStorage
- startUmbraDB
- tape/command.test.ts
- chain-placement.test.ts
- binding.test.ts
- backup/backup.ts
- core-block-commit.test.ts
- ProcessDatabase
- signal-ignored-fixtures.ts
- src/ledger/identity.ts
- ingest-harness.ts
- boundary.test.ts
- devnet-upgrade.test.ts
- core-chain-events.ts
- ledger-sweep.test.ts
- graph.ts
- PgliteDatabase
- declaration.ts
- worker-storage.test.ts
- retirement.test.ts
- ref_node_crypto
- checkShape
- api-server.test.ts
- config-hash-checks.ts
- ReadHandle
- height-versioned.test.ts
- pause-fixtures.ts
- file-mode.test.ts
- validateDeclarations
- messages.ts
- .off
- runner/process.ts
- src/config/load.ts
- browser.test.ts
- pglite-lock.ts
- validation.ts
- core-ledger-state/sql.ts
- cold-boot-recovery.integration.test.ts
- paused-harness.ts
- .configHash
- history
- table
- .slowBlockMs
- graph.py
- ADDED Requirements
- core-block-commit.ts
- refused
- ADDED Requirements
- .disconnect
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- UmbraDB third-party component inventory (SBOM)
- path.ts
- midnight-env — reproducible PREPROD dev environment
- .block
- readPrivateCursor
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- fresh-instance.mjs
- crash-worker.ts
- .put
- version
- code
- transportReader
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- ADDED Requirements
- README.md
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- Boundaries, threats and controls
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
- Design — Sprint 2: Transaction/Lease
- MODIFIED Requirements
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- scoped-review-manifest
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- After 0.10.0
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Contributing
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
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
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
- 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 409 edges
2. `UmbraError` - 346 edges
3. `ModuleDeclaration` - 194 edges
4. `InMemoryBlockSource` - 172 edges
5. `FinalizedLoop` - 133 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 102 edges
8. `Database` - 101 edges
9. `startUmbraDB()` - 98 edges
10. `ReadHandle` - 92 edges

## Surprising Connections (you probably didn't know these)
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
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

## Communities (334 total, 33 thin omitted)

### Community 0 - "column-rules.ts"
Cohesion: 0.02
Nodes (183): CaptureColumn, CaptureState, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+175 more)

### Community 1 - "Database"
Cohesion: 0.02
Nodes (180): Database, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+172 more)

### Community 10 - "module-api.ts"
Cohesion: 0.03
Nodes (108): coreHeaders, HeadersArgument, LifecycleStatus, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules (+100 more)

### Community 100 - "page.ts"
Cohesion: 0.06
Nodes (31): ApiChannel, LinkRecord, PageState, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp() (+23 more)

### Community 101 - "core-chain.ts"
Cohesion: 0.09
Nodes (33): ChainCheck, ChainCheckInput, ChainSource, CoreChainBinding, WaitingListener, ConfigRow, ConfigHashRow, HistoryRule (+25 more)

### Community 103 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 107 - "validate.ts"
Cohesion: 0.11
Nodes (36): CursorRule, Issue, Plain, coreSettingsSchema(), pathOf(), closest(), configFindings(), configSecrets() (+28 more)

### Community 11 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (112): DeployTx, Freeable, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot (+104 more)

### Community 110 - "backup/restore.ts"
Cohesion: 0.11
Nodes (31): PublicIdentity, Checked, PublicSide, RestoreChain, Restored, RestoreInput, RestoreTarget, isBlockLedgerSource() (+23 more)

### Community 112 - "private/lockstep-wait.test.ts"
Cohesion: 0.12
Nodes (33): LockstepCondition, OpenTransaction, PublicCore, A118Observation, MismatchObservation, ExpectedWait, WaitSample, a118Problems() (+25 more)

### Community 113 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 115 - "redact.ts"
Cohesion: 0.10
Nodes (28): RedactionForms, SecretForm, TextPattern, Needs, findings(), databaseText(), isMemoryDatabase(), configRedactor() (+20 more)

### Community 116 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 117 - "process-worker.ts"
Cohesion: 0.10
Nodes (25): BrowserRun, ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker (+17 more)

### Community 119 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (24): A168Observation, A168Phase, Expected, GatedConnector, StatusReader, a(), a168Problems(), a168Run() (+16 more)

### Community 12 - "refused-configuration.test.ts"
Cohesion: 0.03
Nodes (103): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, DatabaseParts, PostgresPartsInput, EngineConfig (+95 more)

### Community 120 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+11 more)

### Community 121 - "TransactionHistoryEntry"
Cohesion: 0.11
Nodes (10): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, 4. Wiring `PgTemporalKV`'s `opts.tx`, 2. `set` (+2 more)

### Community 123 - "checks.test.ts"
Cohesion: 0.09
Nodes (23): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+15 more)

### Community 124 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 125 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 127 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 128 - "core.ts"
Cohesion: 0.15
Nodes (21): BaselineLoad, Comparison, CommitOptions, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline() (+13 more)

### Community 129 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 13 - "ledger-storage.test.ts"
Cohesion: 0.04
Nodes (112): transactionSpec, eventsRuntime, ingest, watched, Call, SeenLoad, retentionSeen, ledgerScenario (+104 more)

### Community 130 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): RestoreOutcome, FileProcess, privateBackup, PublicSetting, PublicSide, PublicSideOptions, privateConfig(), heightsFrom() (+14 more)

### Community 131 - "Lockstep"
Cohesion: 0.11
Nodes (11): InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal, byId() (+3 more)

### Community 132 - "Buffer"
Cohesion: 0.10
Nodes (21): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+13 more)

### Community 133 - "core-contract-states.ts"
Cohesion: 0.09
Nodes (20): CoreContractStatesOptions, ContractStateRow, coreContractStates(), writeStateRows(), insertStateRows(), heightPartitionsSql(), CONTRACT_STATES_ITEM, CORE_CONTRACT_STATES (+12 more)

### Community 134 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 137 - "core-contract-logs-full.ts"
Cohesion: 0.14
Nodes (23): ContractLog, CoreContractLogsFullOptions, LogEventType, DefinedModule, contractLogsItem(), contractLogsItemOf(), contractLogsMigrations(), frozenLogs() (+15 more)

### Community 138 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 139 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 14 - "ref_node_url"
Cohesion: 0.02
Nodes (103): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+95 more)

### Community 140 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 141 - "crash.test.ts"
Cohesion: 0.12
Nodes (22): CrashCall, CrashEvent, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule(), hex() (+14 more)

### Community 142 - "fixtures/configuration.ts"
Cohesion: 0.10
Nodes (20): BrowserConfiguration, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, PglitePathParts, core(), databaseOf(), defineConfig() (+12 more)

### Community 144 - "options.ts"
Cohesion: 0.17
Nodes (26): HistoryFinding, Finding, readOptions, named(), addressFindings(), configFindings(), cwdUnreadable(), finding() (+18 more)

### Community 145 - "config/plain-data.ts"
Cohesion: 0.11
Nodes (22): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, copyArray(), copyObject(), instanceOf() (+14 more)

### Community 146 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 148 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (15): BackupText, createReadStream(), firstLine(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst() (+7 more)

### Community 15 - "UmbraError"
Cohesion: 0.03
Nodes (90): ConfiguredDatabase, databaseTarget, PostgresConnection, PostgresOptions, PgliteLockUse, ReadOnlyDatabase, ReadOptions, ReadTimeoutSetting (+82 more)

### Community 150 - "answerChainData"
Cohesion: 0.13
Nodes (19): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), answerChainData(), migrations (+11 more)

### Community 151 - "backupAtStop"
Cohesion: 0.11
Nodes (19): BackupSeams, BackupWritten, SnapshotSeams, backupAtStop(), stoppedWith(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups (+11 more)

### Community 153 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 154 - "pglite-server.ts"
Cohesion: 0.15
Nodes (13): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, expectNoOutsideReads(), outsideReads() (+5 more)

### Community 155 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+9 more)

### Community 156 - "transcripts.ts"
Cohesion: 0.15
Nodes (18): LogSite, Program, V9Raw, LoadAdapter, bytesOfHex(), decode(), decoded(), freeGot() (+10 more)

### Community 159 - ".concat"
Cohesion: 0.13
Nodes (11): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+3 more)

### Community 16 - "builds.ts"
Cohesion: 0.03
Nodes (92): Keeping, SessionSeen, PrivateProcess, PrivateRefusal, PrivateSeen, InstanceHashes, OptedOutObservation, Refusal (+84 more)

### Community 161 - "state-trees.test.ts"
Cohesion: 0.12
Nodes (17): OracleState, OracleVersion, stateBytes(), stateTreesProblems(), written(), exported(), free(), ledger() (+9 more)

### Community 164 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 165 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 166 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 167 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 17 - "tape/index.ts"
Cohesion: 0.04
Nodes (77): BoundaryReading, Link, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json (+69 more)

### Community 173 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 175 - "tabReport"
Cohesion: 0.19
Nodes (14): PageApiChannel, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf() (+6 more)

### Community 176 - "browser/serve.ts"
Cohesion: 0.17
Nodes (12): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), randomPort() (+4 more)

### Community 18 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (65): PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision, StartHashes (+57 more)

### Community 182 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 183 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 187 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 19 - "entries.ts"
Cohesion: 0.02
Nodes (100): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase (+92 more)

### Community 192 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 193 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 198 - "Heartbeat"
Cohesion: 0.24
Nodes (7): Heartbeat, HeartbeatOptions, TimerHandle, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 2 - "src/db/postgres.ts"
Cohesion: 0.02
Nodes (169): BenchEnv, ConfiguredDatabaseOptions, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, PostgresParts, SslMode, CommittedHeight (+161 more)

### Community 20 - "FinalizedLoop"
Cohesion: 0.03
Nodes (35): Activity, CommitOutcome, FinalizedLoop, HeightRun, HeldHeight, LoopObserver, UnexpectedCursor, SkipsAfterReconnect (+27 more)

### Community 200 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 21 - "ledger/types.ts"
Cohesion: 0.03
Nodes (90): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+82 more)

### Community 211 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 22 - "config/history.ts"
Cohesion: 0.04
Nodes (99): CoreVersion, CoreSettings, versionEntry, HistoryCode, HistoryContext, HistoryOptions, ProvidesRow, Span (+91 more)

### Community 23 - "core-transport.ts"
Cohesion: 0.03
Nodes (57): PrivateLinkConnect, ChannelEndpoint, EndpointEvents, EndpointOptions, Envelope, LinkTimers, MessagePortLike, CoreChannels (+49 more)

### Community 24 - "process-build.ts"
Cohesion: 0.04
Nodes (88): AdminSeams, EngineOptions, AdminRun, Answered, gate, SecretHashes, Compared, ConnectSeen (+80 more)

### Community 244 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 246 - "stats.ts"
Cohesion: 0.33
Nodes (4): ManualOpts, TinybenchOpts, measureManual(), tinybench

### Community 25 - "loop.test.ts"
Cohesion: 0.04
Nodes (84): EntryRange, LockstepWait, LoopEnd, SlowBlockEvent, Contexts, Faults, LostCommit, Seen (+76 more)

### Community 26 - "range.test.ts"
Cohesion: 0.03
Nodes (54): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Frame, RawClient (+46 more)

### Community 263 - "items.ts"
Cohesion: 0.47
Nodes (5): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, CORE_BLOCK_ITEMS

### Community 27 - "listening.test.ts"
Cohesion: 0.03
Nodes (65): coreEntry, CloseHelper, NetworkRuleName, Hold, Signal, QuietResult, Job, ModuleListRule (+57 more)

### Community 28 - "host.ts"
Cohesion: 0.04
Nodes (67): LoadLedger, RetainedState, LedgerName, ChainOutcome, LedgerPackageOptions, NodeBatch, ParsedTransaction, AppliedState (+59 more)

### Community 29 - "order.property.test.ts"
Cohesion: 0.04
Nodes (90): GraphInput, PointRun, PastFaultCase, RefusalCase, Recorder, CheckName, GraphSpec, ModuleSpec (+82 more)

### Community 3 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (173): InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job, WorkerEvent, A77Observation (+165 more)

### Community 30 - "ref_node_path"
Cohesion: 0.06
Nodes (63): RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, TickerHandle, TickerProcess, WORKER, SignalEvent (+55 more)

### Community 31 - "BlockRef"
Cohesion: 0.05
Nodes (34): CoreBlockItems, BlockLedgerSource, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, LedgerBinding, NodeSubscription (+26 more)

### Community 32 - "transport-faults.test.ts"
Cohesion: 0.04
Nodes (68): CoreTransport, CoreTransportOptions, CoreSessionOptions, TransportTls, Message, MessageType, PrivateSocketTransportOptions, SocketLimits (+60 more)

### Community 33 - "LedgerPackage"
Cohesion: 0.04
Nodes (47): LedgerPackage, LedgerEngine, LedgerTaskFailed, AdapterWorkerRequest, stagenetReplay, hexOf(), idOf(), same() (+39 more)

### Community 34 - "5. Runner"
Cohesion: 0.04
Nodes (58): ResolvedGraph, Callback, EntryBoundary, ParallelPoint, PointSchedule, MisuseListener, MisuseReports, ProcessContexts (+50 more)

### Community 35 - "client.ts"
Cohesion: 0.05
Nodes (66): FinalizedHeightOptions, Connection, Pending, State, Subscription, Waiter, NodeBlock, NodeRuntimeVersion (+58 more)

### Community 36 - "default.test.ts"
Cohesion: 0.04
Nodes (78): Observation, Start, Decision, ReadinessCase, startProcess(), adminCore(), adminSource(), ask() (+70 more)

### Community 37 - "channel-checks.test.ts"
Cohesion: 0.04
Nodes (56): HelloAck, JsonValue, ReadResult, StatementResult, CarrierConnection, Pending, PrivateCarrier, PrivateTransport (+48 more)

### Community 38 - ".from"
Cohesion: 0.05
Nodes (82): contractScenario, ContractScenarioOptions, LogLine, Program, Ran, ScenarioTx, handoff, HandoffAt (+74 more)

### Community 4 - "NodeClient"
Cohesion: 0.02
Nodes (111): HeadSubscriber, NodeCallOptions, NodeClient, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents (+103 more)

### Community 40 - "node-format.ts"
Cohesion: 0.06
Nodes (56): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+48 more)

### Community 41 - "process-admin.ts"
Cohesion: 0.05
Nodes (72): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions (+64 more)

### Community 43 - "vitest"
Cohesion: 0.04
Nodes (50): Served, Finding, Lockfile, Manifest, RepositoryFile, BlockImport, ChildResult, CodeBlock (+42 more)

### Community 44 - "cbor.ts"
Cohesion: 0.04
Nodes (75): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+67 more)

### Community 45 - "transform-checks.ts"
Cohesion: 0.06
Nodes (52): Metadata, Step, Failure, Variant, TapeError, TransformError, expectGoldenRoundTrip(), baseRecords() (+44 more)

### Community 46 - "networks.ts"
Cohesion: 0.04
Nodes (66): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+58 more)

### Community 48 - ".value"
Cohesion: 0.07
Nodes (47): ExtrinsicCall, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, TypeDef, ScaleError, ScaleReader (+39 more)

### Community 49 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (56): Path, LedgerTask, EngineOptions, CallArgsItem, CallArguments, V9Raw, described(), differs() (+48 more)

### Community 5 - "admin-harness.ts"
Cohesion: 0.02
Nodes (141): MountedAdminAnswer, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions (+133 more)

### Community 50 - "version-checks.ts"
Cohesion: 0.06
Nodes (46): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, CallRecord, CountingNode, MetadataSelector (+38 more)

### Community 51 - "loop-stop-harness.ts"
Cohesion: 0.06
Nodes (56): CrashEvent, CrashJob, RestartEvent, RestartJob, A169Observation, LoopStopScenario, SourceOf, A167Observation (+48 more)

### Community 52 - "config-check.ts"
Cohesion: 0.05
Nodes (58): BackupCommandOptions, BackupOutcome, CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, commandTarget (+50 more)

### Community 53 - "range.ts"
Cohesion: 0.05
Nodes (52): TapeBuilder, TapeBuilderOptions, Arguments, Command, TapeCommandIo, CompletenessRange, RecordingError, Final (+44 more)

### Community 54 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (56): BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, UnsureReason, CoreLedgerVersion, LedgerPackageIdentity, ledgerVersionOf() (+48 more)

### Community 55 - "ModuleDeclaration"
Cohesion: 0.06
Nodes (58): CoreChainFacts, privateIntake, RestoreBase, CommandBuildOptions, CheckState, ConfigCheckOptions, CommandConfig, ProcessSide (+50 more)

### Community 56 - "slow-block-harness.ts"
Cohesion: 0.08
Nodes (52): BlockItemSource, BlockSource, LoopInput, ReadOpener, StatusBody, Times, Wait, askedSource (+44 more)

### Community 57 - "loop.ts"
Cohesion: 0.05
Nodes (46): QueuedBlock, PointName, BlockItems, CallbackFailure, PointArguments, ProcessReason, ReasonCode, Unwrapped (+38 more)

### Community 58 - "core-ledger-state.ts"
Cohesion: 0.06
Nodes (49): LedgerStateItem, retainedStates, CoreRevision, ContractKeys, boundLedgerParser(), applyBlock(), boundLedger(), computeBlock() (+41 more)

### Community 59 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (54): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers (+46 more)

### Community 6 - "startUmbraDB"
Cohesion: 0.02
Nodes (154): demoLink, PrivateLinkChannel, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork (+146 more)

### Community 60 - "tape/command.test.ts"
Cohesion: 0.06
Nodes (46): TypeCheckFinding, TypeCheckResult, Finding, Access, AllowedRead, Boundary, Crossing, Guard (+38 more)

### Community 61 - "chain-placement.test.ts"
Cohesion: 0.08
Nodes (50): BlockParsedOptions, TransactionParser, Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec (+42 more)

### Community 62 - "binding.test.ts"
Cohesion: 0.06
Nodes (42): a165Run, Attempt, PrivateBackend, TestDatabase, A113Observation, A156Observation, Binding, Created (+34 more)

### Community 63 - "backup/backup.ts"
Cohesion: 0.08
Nodes (51): BackupInput, BackupTarget, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool, DumpInput (+43 more)

### Community 65 - "core-block-commit.test.ts"
Cohesion: 0.05
Nodes (39): BlockRow, transportReaderFacts, StandInOptions, Commit, Committed, TestBackend, HeldRead, Job (+31 more)

### Community 66 - "ProcessDatabase"
Cohesion: 0.09
Nodes (48): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData (+40 more)

### Community 68 - "signal-ignored-fixtures.ts"
Cohesion: 0.06
Nodes (42): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+34 more)

### Community 69 - "src/ledger/identity.ts"
Cohesion: 0.07
Nodes (45): ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, V9Logs, SlowStep, TestLoaderData (+37 more)

### Community 7 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (151): BlockParsed, ProcessCondition, itemsSeen, BlockSpec, EventSpec, Json, Scenario, ArgType (+143 more)

### Community 70 - "boundary.test.ts"
Cohesion: 0.08
Nodes (45): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+37 more)

### Community 71 - "devnet-upgrade.test.ts"
Cohesion: 0.06
Nodes (43): Side, FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+35 more)

### Community 72 - "core-chain-events.ts"
Cohesion: 0.07
Nodes (46): BlockEventSource, MetadataField, MetadataVariant, Primitive, RuntimeMetadataView, ChainTransaction, ChainEvent, EventPhase (+38 more)

### Community 73 - "ledger-sweep.test.ts"
Cohesion: 0.08
Nodes (22): SweepState, SweepTables, SweepWrites, ChildReader, Block, MemoryTables, ModelBatch, ModelSnapshot (+14 more)

### Community 74 - "graph.ts"
Cohesion: 0.07
Nodes (49): Edge, GraphFacts, GraphPart, GraphRule, HeightRange, MidChain, Missing, RangeCheck (+41 more)

### Community 76 - "PgliteDatabase"
Cohesion: 0.08
Nodes (10): JobQueue, PgliteDatabase, ReadPool, Session, Writer, commitRolledBack(), handleClosed(), failedEarlier() (+2 more)

### Community 77 - "declaration.ts"
Cohesion: 0.09
Nodes (34): UmbraConfig, OwnPart, cursorTable, CursorTableOptions, heightVersionedTable, HeightVersionedTableOptions, ApiRegistry, BlockContext (+26 more)

### Community 78 - "worker-storage.test.ts"
Cohesion: 0.07
Nodes (33): NodeStore, StoredNode, Thread, BridgeServer, bridgeStore, Growable, StagenetBlockJson, StagenetFixtureJson (+25 more)

### Community 79 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 8 - "ref_node_crypto"
Cohesion: 0.03
Nodes (123): TableDigest, TableDigestRow, CapturedTable, SchemaPlan, ChangeKind, tableChanges, TouchedRow, GuardTableRow (+115 more)

### Community 80 - "checkShape"
Cohesion: 0.07
Nodes (38): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+30 more)

### Community 81 - "api-server.test.ts"
Cohesion: 0.07
Nodes (33): HttpHandler, HttpRoute, AcceptsDuplicates, AddsExtensions, AddsHeaders, AppendsVersion, Client, VersionsAnswersOnly (+25 more)

### Community 82 - "config-hash-checks.ts"
Cohesion: 0.07
Nodes (24): Report, A162Options, a162Run, HeaderSeen, HeldLink, HoldingRelay, ReportRelay, RetargetProxy (+16 more)

### Community 83 - "ReadHandle"
Cohesion: 0.06
Nodes (27): BlockWriteHandle, ReadHandle, CursorValue, PointCallbacks, cursorDatabase, Access, Block, BlockFails (+19 more)

### Community 84 - "height-versioned.test.ts"
Cohesion: 0.09
Nodes (31): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+23 more)

### Community 85 - "pause-fixtures.ts"
Cohesion: 0.08
Nodes (31): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, PausesInsideTheHeight (+23 more)

### Community 86 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (31): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+23 more)

### Community 87 - "validateDeclarations"
Cohesion: 0.08
Nodes (40): ImportedConfig, plainData, EntryView, commandBuild(), plainDataWith(), processCoreEntry(), refusal(), validateConfig() (+32 more)

### Community 88 - "messages.ts"
Cohesion: 0.06
Nodes (37): Committed, MessageFault, Parsed, Read, instanceIdSchema(), bytesOf(), decodeParameter(), decodeValue() (+29 more)

### Community 89 - ".off"
Cohesion: 0.05
Nodes (40): Key, Sql, Durability, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`) (+32 more)

### Community 9 - "runner/process.ts"
Cohesion: 0.03
Nodes (69): Bound, ConfiguredGenesis, NodeWait, RetryCode, SlowWindow, PauseBy, PauseHold, BoundAddress (+61 more)

### Community 91 - "src/config/load.ts"
Cohesion: 0.07
Nodes (31): LoadOptions, SignalJob, Row, configModules(), configModuleUrl(), configPath(), importConfig(), invalid() (+23 more)

### Community 92 - "browser.test.ts"
Cohesion: 0.08
Nodes (40): Reachable, RestoreAttempt, PageBackup, PageEvent, PageLink, PageRestore, ProcessName, StatusBody (+32 more)

### Community 93 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (32): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, ChildResult, acquirePgliteLock() (+24 more)

### Community 94 - "validation.ts"
Cohesion: 0.06
Nodes (36): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+28 more)

### Community 95 - "core-ledger-state/sql.ts"
Cohesion: 0.10
Nodes (36): StateRow, StoredState, GreyView, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks() (+28 more)

### Community 97 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 99 - "paused-harness.ts"
Cohesion: 0.11
Nodes (33): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, a176Project() (+25 more)

### Community 195 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 39 - "history"
Cohesion: 0.03
Nodes (84): history(), params(), n(), data(), 7. The module API, 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position (+76 more)

### Community 67 - "table"
Cohesion: 0.04
Nodes (53): side(), migrations(), table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, 10. Ready-made tables: cursor and height-versioned (+45 more)

### Community 102 - ".slowBlockMs"
Cohesion: 0.06
Nodes (34): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+26 more)

### Community 106 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 158 - "core-block-commit.ts"
Cohesion: 0.14
Nodes (20): blockHeaderOf(), checkParent(), commitBlock(), hex(), sameBytes(), startOf(), writeBlockRow(), writeHashRow() (+12 more)

### Community 160 - "refused"
Cohesion: 0.13
Nodes (20): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 12. When a callback fails, Requirement: AE-3 States and conditions, Scenario: A fault of the build's declarations ends the process (+12 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): A paused loop on `/status`, A private process and a changed public configuration, The node on `/status`, UmbraDB operator guide, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents (+7 more)

### Community 184 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 186 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 191 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 197 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 206 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 221 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 225 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 229 - ".block"
Cohesion: 0.47
Nodes (3): failingSource(), lookalike(), flakySource()

### Community 230 - "readPrivateCursor"
Cohesion: 0.32
Nodes (7): readPrivateCursor(), commandCommittedHeight(), readDatabaseState(), 00029 — `umbradb config check --database` reads a private database's cursor from the public cursor table, Evidence, Problem, Suggested fix

### Community 236 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 264 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 294 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 304 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 42 - ".put"
Cohesion: 0.03
Nodes (82): T(), input(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed (+74 more)

### Community 47 - "version"
Cohesion: 0.03
Nodes (76): deferred(), version(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log (+68 more)

### Community 64 - "code"
Cohesion: 0.04
Nodes (55): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+47 more)

### Community 75 - "transportReader"
Cohesion: 0.04
Nodes (45): text(), transportReader(), transportReaderRule(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 00061 — The threat model's `path:line` citations drift as the code moves (+37 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 105 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: load always fully verifies chunk integrity before returning, Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune (+27 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 122 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 147 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (25): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+17 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 157 - "README.md"
Cohesion: 0.11
Nodes (12): Choosing a database, At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails, Launching it (+4 more)

### Community 162 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 163 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 169 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 171 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (18): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+10 more)

### Community 172 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 174 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 177 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.12
Nodes (11): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+3 more)

### Community 179 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 180 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 189 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 190 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 194 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 196 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 199 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 201 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 203 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 204 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 207 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 208 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 209 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 210 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 212 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 213 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 214 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 215 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure, Design — Sprint 2: Transaction/Lease (+1 more)

### Community 216 - "MODIFIED Requirements"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A long awaiting callback does not fail liveness, Scenario: Before the first block, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 217 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 218 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 219 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 220 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 222 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 223 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 224 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 226 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 227 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 228 - "After 0.10.0"
Cohesion: 0.22
Nodes (9): 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals, Release gates still to run (+1 more)

### Community 231 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 232 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 233 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 234 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 235 - "Contributing"
Cohesion: 0.29
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 237 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 238 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 239 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 240 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 241 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 242 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 243 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 245 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 248 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 249 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 250 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 251 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 252 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 253 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 254 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 255 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 256 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 257 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 258 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 259 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 260 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 261 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 262 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 265 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 266 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 267 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 268 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 269 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 270 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 271 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 272 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 273 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 274 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 275 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

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

### Community 289 - "00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail"
Cohesion: 0.40
Nodes (4): 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix

### Community 290 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 291 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 292 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 293 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 295 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 296 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 297 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 298 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 299 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 300 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 301 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 302 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 303 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 307 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `RFC-3339` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4078 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `column-rules.ts`, `Database`, `src/db/postgres.ts`, `InMemoryBlockSource`, `NodeClient`, `admin-harness.ts`, `startUmbraDB`, `ingest-harness.ts`, `ref_node_crypto`, `runner/process.ts`, `module-api.ts`, `adapter-fixtures.ts`, `refused-configuration.test.ts`, `ledger-storage.test.ts`, `ref_node_url`, `UmbraError`, `builds.ts`, `tape/index.ts`, `core-private-source.test.ts`, `entries.ts`, `ledger/types.ts`, `config/history.ts`, `core-transport.ts`, `process-build.ts`, `loop.test.ts`, `range.test.ts`, `listening.test.ts`, `host.ts`, `order.property.test.ts`, `ref_node_path`, `transport-faults.test.ts`, `LedgerPackage`, `5. Runner`, `client.ts`, `default.test.ts`, `channel-checks.test.ts`, `.from`, `node-format.ts`, `process-admin.ts`, `cbor.ts`, `transform-checks.ts`, `networks.ts`, `ledger/ledger-tasks.test.ts`, `version-checks.ts`, `loop-stop-harness.ts`, `config-check.ts`, `core-block-parsed.ts`, `ModuleDeclaration`, `slow-block-harness.ts`, `loop.ts`, `core-ledger-state.ts`, `tape/command.test.ts`, `chain-placement.test.ts`, `binding.test.ts`, `backup/backup.ts`, `core-block-commit.test.ts`, `ProcessDatabase`, `signal-ignored-fixtures.ts`, `src/ledger/identity.ts`, `boundary.test.ts`, `devnet-upgrade.test.ts`, `core-chain-events.ts`, `ledger-sweep.test.ts`, `declaration.ts`, `worker-storage.test.ts`, `retirement.test.ts`, `api-server.test.ts`, `config-hash-checks.ts`, `ReadHandle`, `height-versioned.test.ts`, `pause-fixtures.ts`, `file-mode.test.ts`, `validateDeclarations`, `messages.ts`, `src/config/load.ts`, `browser.test.ts`, `pglite-lock.ts`, `validation.ts`, `core-ledger-state/sql.ts`, `cold-boot-recovery.integration.test.ts`, `paused-harness.ts`, `test/postgres/setup.ts`, `backup/restore.ts`, `private/lockstep-wait.test.ts`, `release-version.ts`, `redact.ts`, `browser/build.ts`, `node-fields-harness.ts`, `postgres/transaction-history-storage.ts`, `package.json`, `checks.test.ts`, `documents.ts`, `code-registry.ts`, `read-gate.ts`, `core.ts`, `restore-private.ts`, `Lockstep`, `pg-tx-history-adapter.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `crash.test.ts`, `config/plain-data.ts`, `surface.test.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `pglite-server.ts`, `block-fetch-decode.test.ts`, `state-trees.test.ts`, `library-documents.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `excluded-not-exported.test.ts`, `LoopPauses`, `ws-mutual-tls.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `twox.ts`, `worker-threads.test.ts`, `Heartbeat`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `column-rules.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01762892460566879 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `column-rules.ts`, `Database`, `src/db/postgres.ts`, `InMemoryBlockSource`, `NodeClient`, `admin-harness.ts`, `startUmbraDB`, `ingest-harness.ts`, `ref_node_crypto`, `runner/process.ts`, `module-api.ts`, `refused-configuration.test.ts`, `fixtures/configuration.ts`, `options.ts`, `config/plain-data.ts`, `core-private-source.test.ts`, `entries.ts`, `builds.ts`, `tape/index.ts`, `config/history.ts`, `backupAtStop`, `core-transport.ts`, `loop.test.ts`, `process-build.ts`, `listening.test.ts`, `FinalizedLoop`, `order.property.test.ts`, `core-block-commit.ts`, `BlockRef`, `transport-faults.test.ts`, `ref_node_path`, `5. Runner`, `client.ts`, `default.test.ts`, `channel-checks.test.ts`, `process-admin.ts`, `cbor.ts`, `transform-checks.ts`, `networks.ts`, `version`, `ledger/ledger-tasks.test.ts`, `version-checks.ts`, `loop-stop-harness.ts`, `config-check.ts`, `range.ts`, `core-block-parsed.ts`, `statementsOf`, `ModuleDeclaration`, `loop.ts`, `core-ledger-state.ts`, `slow-block-harness.ts`, `binding.test.ts`, `backup/backup.ts`, `browser/src/config/load.ts`, `core-block-commit.test.ts`, `src/ledger/identity.ts`, `graph.ts`, `PgliteDatabase`, `declaration.ts`, `checkShape`, `api-server.test.ts`, `sha256`, `ReadHandle`, `pause-fixtures.ts`, `height-versioned.test.ts`, `validateDeclarations`, `src/config/load.ts`, `pglite-lock.ts`, `validation.ts`, `.block`, `core-chain.ts`, `ledger/types.ts`, `validate.ts`, `backup/restore.ts`, `private/lockstep-wait.test.ts`, `checks.test.ts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.021246275424277757 - nodes in this community are weakly interconnected._