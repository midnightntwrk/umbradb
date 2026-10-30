# Graph Report - UmbraDB

## Corpus Check
- 1090 files · ~1,525,157 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11365 nodes · 34674 edges · 345 communities (314 shown, 31 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2664 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `da24566d9b5df7b0` (1090 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- admin-harness.ts
- loop.ts
- FinalizedLoop
- core-ledger-state/sql.ts
- lockstep-refusals.test.ts
- cold-boot-recovery.integration.test.ts
- release-version.ts
- page.ts
- checks.test.ts
- process-admin.ts
- cli/run.ts
- postgres/transaction-history-storage.ts
- backup/restore.ts
- node-run.ts
- worker-host.test.ts
- chrome.ts
- test/postgres/setup.ts
- documents.ts
- ingest-harness.ts
- crash.test.ts
- code-registry.ts
- ref_node_http
- Lockstep
- read-gate.ts
- TransactionHistoryEntry
- Registry
- ReadHandle
- process-worker.ts
- pg-tx-history-adapter.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- interfaces/transaction-history-storage.ts
- adapter-fixtures.ts
- shims.test.ts
- core-private-source.ts
- restore-private.ts
- .concat
- core-transport.ts
- node-bridge.ts
- block-fetch-decode.test.ts
- ledger-sweep.test.ts
- ledger/metadata.ts
- selectLedgerVersion
- transaction-history-storage.property.test.ts
- cbor.ts
- h
- harness.ts
- core.ts
- .query
- TapeRecord
- secretStrings
- pauseRun
- FakeNode
- PortSocket
- ws-mutual-tls.test.ts
- Design — Sprint 1: project setup + TemporalKV
- statementsOf
- childRefKeys
- tape/index.ts
- LoopPauses
- config/plain-data.ts
- no-indexer-or-wallet-sdk.test.ts
- web-lock.ts
- adapter.ts
- core-contract-states.ts
- configuration-refusal.ts
- browser/serve.ts
- worker-threads.test.ts
- column-rules.ts
- record-and-replay.test.ts
- history.property.test.ts
- worker-threads-worker.ts
- buffer.ts
- Worker
- stored-values.ts
- spawnChild
- sweepStep
- ledger/plain-data.ts
- NodeBlockSource
- devnet-upgrade.test.ts
- ProcessItems
- ingest-crash.worker.ts
- .write
- builds.ts
- fetch-fixtures.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- LedgerPackage
- client.test.ts
- client.ts
- NodeClient
- db/errors.ts
- writer-lock-checks.ts
- aborted
- listenerProblems
- cursor-harness.ts
- BYTE_ORDER
- backup/backup.ts
- https.ts
- NodeFS
- UmbraError
- change-capture.ts
- range.ts
- vitest
- core-block-parsed.ts
- transport-faults.test.ts
- ledger/types.ts
- loop.test.ts
- run.test.ts
- slow-block-harness.ts
- DatabaseParts
- loop-stop-harness.ts
- database-parts.ts
- boundary.test.ts
- deterministic-postgresql/index.ts
- core-block-commit.test.ts
- sweep-tapes.ts
- Process
- runner/process.ts
- transform-checks.ts
- validate.test.ts
- config/history.ts
- PgTransactionHistoryStorage
- .value
- src/index.ts
- ref_node_path
- browser.test.ts
- InMemoryBlockSource
- 14. Private processes
- cli/command.ts
- contract-data-checks.ts
- graph.ts
- node.test.ts
- core-ledger-state.ts
- core-settings.ts
- core-chain-events.ts
- history.test.ts
- migrate.ts
- retirement.test.ts
- file-mode.test.ts
- config/plain-data.test.ts
- zero-timeouts-checks.ts
- version-table.ts
- tape/command.ts
- version-checks.ts
- checkShape
- ref_node_fs
- history-database.test.ts
- net.test.ts
- config-check.ts
- core-contract-logs-fast.ts
- real-tapes.ts
- validate.ts
- host.ts
- pack-install.mjs
- contract-modules.test.ts
- networks.ts
- ledger-tasks-checks.ts
- browser/build.ts
- 3. Block source and ingest
- ADDED Requirements
- Proposal — Sprint 3: CheckpointStore
- graph.py
- ADDED Requirements
- ADDED Requirements
- UmbraDB module guide
- T
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- UmbraDB
- .slowBlockMs
- Boundaries, threats and controls
- core-ledger-state.test.ts
- conformance-gate.mjs
- mutation-per-adapter.mjs
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- fault
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- readPrivateCursor
- midnight-env — reproducible PREPROD dev environment
- path.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- firstRegularAtParentTime
- orphan-watcher.mjs
- fresh-instance.mjs
- crash-worker.ts
- .put
- history
- version
- code
- .from
- ADDED Requirements
- core-private-source.test.ts
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- README.md
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- [0.9.5] - 2026-07-25 — "Penumbra"
- scoped-review-manifest
- try.sh
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Repository agent policy
- Contributing
- UmbraDB in a browser
- stats-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- Midnight Foundation Security Policy
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- UmbraDB node architecture
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-infosec-signoff
- Tasks — v1.0.0-perf-baseline
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
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- Problem
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
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
- 00054 — A slow-block test hung inside PGlite for over an hour
- bug-report.md
- feature-request.md
- manifest.json
- Vendored ledger builds
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
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 374 edges
2. `UmbraError` - 314 edges
3. `ModuleDeclaration` - 177 edges
4. `FinalizedLoop` - 133 edges
5. `InMemoryBlockSource` - 120 edges
6. `NodeClient` - 113 edges
7. `Database` - 101 edges
8. `BlockRef` - 97 edges
9. `ReadHandle` - 91 edges
10. `NodeBlockSource` - 81 edges

## Surprising Connections (you probably didn't know these)
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Evidence` --references--> `ManualTimers`  [INFERRED]
  docs/issues/00016-heartbeat-above-timer-limit.md → test/node/manual-timers.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (345 total, 31 thin omitted)

### Community 0 - "admin-harness.ts"
Cohesion: 0.02
Nodes (247): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStarter, AdminStartOptions (+239 more)

### Community 1 - "loop.ts"
Cohesion: 0.02
Nodes (173): ModuleApiServer, ModuleApiStart, StartedModuleApi, ApiRegistry, ProcessContext, Revision, HeightRange, ResolvedGraph (+165 more)

### Community 10 - "FinalizedLoop"
Cohesion: 0.03
Nodes (42): ResolvedRange, BlockRef, EntryBoundary, PointSchedule, InMemorySourceOptions, Activity, CommitOutcome, FinalizedLoop (+34 more)

### Community 100 - "core-ledger-state/sql.ts"
Cohesion: 0.11
Nodes (34): StateRow, StoredState, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks(), deleteGrey() (+26 more)

### Community 101 - "lockstep-refusals.test.ts"
Cohesion: 0.12
Nodes (33): LockstepCondition, PublicCore, A118Observation, MismatchObservation, ExpectedWait, WaitSample, a118Problems(), a118Run() (+25 more)

### Community 104 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (23): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+15 more)

### Community 105 - "release-version.ts"
Cohesion: 0.12
Nodes (35): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+27 more)

### Community 106 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 109 - "checks.test.ts"
Cohesion: 0.08
Nodes (25): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, integer(), checkFunctionsSql() (+17 more)

### Community 11 - "process-admin.ts"
Cohesion: 0.04
Nodes (88): ConfigFacts, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, DigestRow (+80 more)

### Community 110 - "cli/run.ts"
Cohesion: 0.09
Nodes (24): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, TickerOptions, PausableOptions (+16 more)

### Community 111 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (21): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+13 more)

### Community 112 - "backup/restore.ts"
Cohesion: 0.12
Nodes (27): RestoreBase, RestoreChain, RestoreInput, RestoreTarget, BackupText, readCursor(), isBlockLedgerSource(), bindingRefusal() (+19 more)

### Community 114 - "node-run.ts"
Cohesion: 0.10
Nodes (24): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, NodeRunResult, core(), databaseOf() (+16 more)

### Community 115 - "worker-host.test.ts"
Cohesion: 0.08
Nodes (26): SlowStep, TestLoaderData, errorOf(), beat(), countDeserializations(), hexOf(), loadLedger(), probe() (+18 more)

### Community 116 - "chrome.ts"
Cohesion: 0.12
Nodes (15): Cdp, CdpEvent, ChromeBrowser, ChromeTab, Download, PageRequest, chrome(), chrome() (+7 more)

### Community 117 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 119 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 12 - "ingest-harness.ts"
Cohesion: 0.05
Nodes (99): NodeClientOptions, ingest, IngestOptions, SourceClass, watched, Call, SeenLoad, RestartEvent (+91 more)

### Community 120 - "crash.test.ts"
Cohesion: 0.11
Nodes (24): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+16 more)

### Community 121 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 125 - "ref_node_http"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 126 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 127 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 128 - "TransactionHistoryEntry"
Cohesion: 0.12
Nodes (8): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 129 - "Registry"
Cohesion: 0.16
Nodes (19): Field, Registry, metadataWith(), metadataV14(), midnightMetadata(), phaseBytes(), record(), some() (+11 more)

### Community 13 - "ReadHandle"
Cohesion: 0.03
Nodes (72): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue (+64 more)

### Community 130 - "process-worker.ts"
Cohesion: 0.12
Nodes (21): Scope, StartRun, ToProcessWorker, openedProcess, adminAnswer(), messageAdmin(), databaseOptions(), openConfiguredDatabase() (+13 more)

### Community 131 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 135 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 136 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 137 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 139 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (19): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, EntryContentSchema, EntryLifecycleSchema (+11 more)

### Community 14 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (93): ApplyOutput, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+85 more)

### Community 141 - "shims.test.ts"
Cohesion: 0.13
Nodes (12): crossedError, Buffer, Hash, sha256, hex(), instantiateLedger(), hexOf(), jsonSafe() (+4 more)

### Community 144 - "core-private-source.ts"
Cohesion: 0.14
Nodes (22): PrivateChecks, privateIntake, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, PublicConfiguration, PublicIdentity, PublicSide (+14 more)

### Community 145 - "restore-private.ts"
Cohesion: 0.17
Nodes (20): FileProcess, privateBackup, PublicSetting, PublicSide, PublicSideOptions, heightsFrom(), pmModule(), privateHashOf() (+12 more)

### Community 147 - ".concat"
Cohesion: 0.12
Nodes (12): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+4 more)

### Community 15 - "core-transport.ts"
Cohesion: 0.03
Nodes (75): Session, TransportLimits, TransportTls, Committed, Hello, HelloAck, JsonValue, MessageFault (+67 more)

### Community 150 - "node-bridge.ts"
Cohesion: 0.13
Nodes (17): Thread, BridgeServer, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 152 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 154 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (12): SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints(), compare() (+4 more)

### Community 155 - "ledger/metadata.ts"
Cohesion: 0.15
Nodes (8): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, contentStateOf(), hexOf(), walkOver()

### Community 157 - "selectLedgerVersion"
Cohesion: 0.17
Nodes (16): TapeAnswers, FoundTape, Tape, blockNamed(), checkPins(), hexOf(), isMnsvItem(), ledgerOfSpecVersion() (+8 more)

### Community 159 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 16 - "cbor.ts"
Cohesion: 0.04
Nodes (94): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+86 more)

### Community 160 - "h"
Cohesion: 0.10
Nodes (18): startHashDecision, startStop(), h(), acceptsAny(), neverCompares(), clock(), [A, B, C], 1. Module layout (+10 more)

### Community 161 - "harness.ts"
Cohesion: 0.19
Nodes (12): BaselineLoad, Comparison, Baseline, compareToBaseline(), loadBaseline(), workloadName(), BASELINE_PATH, REGRESSION_FACTOR (+4 more)

### Community 162 - "core.ts"
Cohesion: 0.15
Nodes (15): CommitOptions, PostgresRun, BenchEnv, ManualOpts, TinybenchOpts, Backend, LatencyStats, commitEmptyBlockPglite() (+7 more)

### Community 163 - ".query"
Cohesion: 0.18
Nodes (15): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), snapshot(), "on-after-db-write"() (+7 more)

### Community 17 - "TapeRecord"
Cohesion: 0.05
Nodes (87): ProcessCondition, Scenario, chainBlock, RUNTIME, Decoded, FetchSeen, A84Observation, LoggedRetry (+79 more)

### Community 172 - "secretStrings"
Cohesion: 0.13
Nodes (14): SecretForm, TextPattern, findings(), credentialsIn(), decoded(), kindOf(), redactedCopy(), redactorWith() (+6 more)

### Community 173 - "pauseRun"
Cohesion: 0.26
Nodes (12): Reader, pausedOf(), pausedProblems(), pauseRun(), reach(), readinessProblems(), runningProblems(), samePause() (+4 more)

### Community 175 - "PortSocket"
Cohesion: 0.21
Nodes (5): PortSocket, 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 176 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 177 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 178 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 179 - "childRefKeys"
Cohesion: 0.25
Nodes (5): ChildReader, ModelBatch, childRefKeys(), readChildren(), hexOf()

### Community 18 - "tape/index.ts"
Cohesion: 0.05
Nodes (64): Failure, Variant, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json (+56 more)

### Community 180 - "LoopPauses"
Cohesion: 0.19
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 185 - "config/plain-data.ts"
Cohesion: 0.22
Nodes (13): PlainArray, PlainDataNode, PlainDataRule, Walk, copyArray(), copyObject(), instanceOf(), isElementKey() (+5 more)

### Community 186 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 187 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 19 - "adapter.ts"
Cohesion: 0.03
Nodes (79): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+71 more)

### Community 191 - "core-contract-states.ts"
Cohesion: 0.22
Nodes (10): CoreContractStatesOptions, ContractStateRow, contractStatesOf(), coreContractStates(), hex(), writeStateRows(), insertStateRows(), CONTRACT_STATES_ITEM (+2 more)

### Community 192 - "configuration-refusal.ts"
Cohesion: 0.25
Nodes (11): ConfigFinding, HistoryFinding, Finding, configurationRefused(), findingText(), refusalFindings(), named(), configurationFindings() (+3 more)

### Community 193 - "browser/serve.ts"
Cohesion: 0.23
Nodes (9): pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 194 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 2 - "column-rules.ts"
Cohesion: 0.02
Nodes (176): CheckedMigration, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, CatalogColumn (+168 more)

### Community 20 - "record-and-replay.test.ts"
Cohesion: 0.03
Nodes (47): NodeRetry, Answer, Handler, Received, ConnectionFrames, Recorded, Failure, Variant (+39 more)

### Community 200 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 202 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 203 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 208 - "stored-values.ts"
Cohesion: 0.24
Nodes (5): Readable, Reader, TableNode, untag(), nodesOfTagged()

### Community 21 - "spawnChild"
Cohesion: 0.03
Nodes (71): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+63 more)

### Community 214 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 215 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 22 - "NodeBlockSource"
Cohesion: 0.05
Nodes (32): CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeCallOptions, NodeSubscription, NodeHeader (+24 more)

### Community 23 - "devnet-upgrade.test.ts"
Cohesion: 0.06
Nodes (57): Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch (+49 more)

### Community 234 - "ingest-crash.worker.ts"
Cohesion: 0.28
Nodes (8): CrashEvent, CrashJob, report(), tipWriter(), handle, job, orphanGuard, poll

### Community 235 - ".write"
Cohesion: 0.22
Nodes (5): IgnoresTheStop, PausesInsideTheHeight, StaysPaused, abortOf(), never()

### Community 24 - "builds.ts"
Cohesion: 0.05
Nodes (66): PrivateProcess, PrivateRefusal, PrivateSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation (+58 more)

### Community 25 - "fetch-fixtures.ts"
Cohesion: 0.05
Nodes (82): itemsSeen, BlockSpec, EventSpec, Json, transactionSpec, eventsRuntime, PalletMetadata, Phase (+74 more)

### Community 253 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "LedgerPackage"
Cohesion: 0.06
Nodes (37): LedgerEventKind, LedgerPackage, LedgerTaskBlock, NodeStore, StateHandle, EvictionRefused, LedgerEngine, LedgerTaskFailed (+29 more)

### Community 27 - "client.test.ts"
Cohesion: 0.04
Nodes (41): ConnectSocket, HandSocket, HandSockets, recorded, Outage, TapeNode, ReplayTapeOptions, eventsRead() (+33 more)

### Community 28 - "client.ts"
Cohesion: 0.06
Nodes (57): Connection, Pending, State, Subscription, Waiter, NodeBlock, NodeRuntimeVersion, connectionFailure (+49 more)

### Community 29 - "NodeClient"
Cohesion: 0.05
Nodes (50): NodeClient, Opened, ManualTimers, ConnectionFrames, RecordAndReplayOptions, ReplaySession, connectWebSocket(), askingAgain() (+42 more)

### Community 3 - "db/errors.ts"
Cohesion: 0.02
Nodes (156): ConfiguredDatabase, ConfiguredDatabaseOptions, PostgresConnection, PostgresOptions, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget (+148 more)

### Community 30 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (61): CreatedDirectory, Held, PgliteLockUse, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport (+53 more)

### Community 305 - "aborted"
Cohesion: 0.40
Nodes (3): DoesNotHold, EndsTheRun, aborted()

### Community 31 - "cursor-harness.ts"
Cohesion: 0.05
Nodes (58): SchemaPlan, Committed, Chain, ChainOptions, DigestRow, TestBackend, TestDatabase, HeldRead (+50 more)

### Community 32 - "backup/backup.ts"
Cohesion: 0.05
Nodes (69): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+61 more)

### Community 33 - "UmbraError"
Cohesion: 0.05
Nodes (29): LoadedConfig, LoadOptions, databaseTarget, JobQueue, PgliteDatabase, BoundedRead, ReadPool, Session (+21 more)

### Community 34 - "change-capture.ts"
Cohesion: 0.05
Nodes (68): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow (+60 more)

### Community 35 - "range.ts"
Cohesion: 0.04
Nodes (55): HeadSubscriber, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, CompletenessRange, Final (+47 more)

### Community 36 - "vitest"
Cohesion: 0.03
Nodes (50): Lockfile, Manifest, RepositoryFile, Report, Upstream, Leftover, RemovedName, ReportedTest (+42 more)

### Community 37 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (64): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser (+56 more)

### Community 38 - "transport-faults.test.ts"
Cohesion: 0.06
Nodes (47): Message, PrivateBackend, TestCertificates, Ended, rawClient, Escape, publicState, Refused (+39 more)

### Community 39 - "ledger/types.ts"
Cohesion: 0.06
Nodes (44): ApplyInput, LedgerPackageOptions, StateSummary, StoredNode, V9Logs, LedgerHeight, AdapterWorkerRequest, OracleState (+36 more)

### Community 4 - "loop.test.ts"
Cohesion: 0.02
Nodes (179): QueuedBlock, BlockHeader, PointName, GraphInput, BlockItems, PointRun, HeightFailure, LockstepWait (+171 more)

### Community 40 - "run.test.ts"
Cohesion: 0.05
Nodes (45): CheckStep, ConfigCheckReport, CheckTarget, CliBackend, RunningCommand, statsConfig, runArguments(), runProcessCommand() (+37 more)

### Community 41 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (52): HeightActivity, LoopInput, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead (+44 more)

### Community 42 - "DatabaseParts"
Cohesion: 0.05
Nodes (55): DatabaseParts, TickerConfig, PausableConfig, PrivateConfig, a165Run, Attempt, TestDatabase, A113Observation (+47 more)

### Community 43 - "loop-stop-harness.ts"
Cohesion: 0.07
Nodes (45): ProcessHandle, SignalTarget, A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch (+37 more)

### Community 44 - "database-parts.ts"
Cohesion: 0.06
Nodes (39): PglitePathParts, PostgresParts, PostgresPartsInput, transportReaderFacts, SessionSeen, A162Options, a162Run, HeaderSeen (+31 more)

### Community 45 - "boundary.test.ts"
Cohesion: 0.07
Nodes (46): Fetching, Recorder, DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports() (+38 more)

### Community 46 - "deterministic-postgresql/index.ts"
Cohesion: 0.06
Nodes (46): ResultColumn, ResultType, Case, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject() (+38 more)

### Community 47 - "core-block-commit.test.ts"
Cohesion: 0.05
Nodes (48): BlockRow, StandInOptions, Commit, AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock(), hex() (+40 more)

### Community 48 - "sweep-tapes.ts"
Cohesion: 0.09
Nodes (49): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, SweepModel, TableSnapshot, FixtureNode, FakeState (+41 more)

### Community 49 - "Process"
Cohesion: 0.07
Nodes (13): CoreTransport, PauseHold, Process, openedCursorHeight(), isBlockEventSource(), messageOf(), nodeSignals(), get() (+5 more)

### Community 5 - "runner/process.ts"
Cohesion: 0.02
Nodes (144): OpenedFacts, Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, CoreChainBinding, CoreChainFacts (+136 more)

### Community 50 - "transform-checks.ts"
Cohesion: 0.09
Nodes (38): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, baseRecords() (+30 more)

### Community 52 - "validate.test.ts"
Cohesion: 0.05
Nodes (47): DatabasePartsInput, ConfigRule, EntryRef, Accepts, ConfigOf, CoreSettingsGiven, Minimal, PricesSettings (+39 more)

### Community 54 - "config/history.ts"
Cohesion: 0.08
Nodes (50): CoreVersion, CoreSettings, HistoryCode, HistoryContext, ProvidesRow, Span, SettingsSchema, UpgradeEntry (+42 more)

### Community 55 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (47): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 4. Multi-wallet identity, Impact, Non-goals (+39 more)

### Community 56 - ".value"
Cohesion: 0.12
Nodes (30): ExtrinsicCall, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, TypeDef, ScaleError, ScaleReader (+22 more)

### Community 57 - "src/index.ts"
Cohesion: 0.07
Nodes (48): UmbraConfig, FieldKind, FieldSchema, ItemDeclaration, Lifetime, Seen, A47Observation, CommitsTheBoundary (+40 more)

### Community 58 - "ref_node_path"
Cohesion: 0.07
Nodes (33): TypeCheckFinding, TypeCheckResult, Served, Finding, BlockImport, ChildResult, CodeBlock, installedProject (+25 more)

### Community 59 - "browser.test.ts"
Cohesion: 0.08
Nodes (49): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, ProcessName, StatusBody, continuedProblems() (+41 more)

### Community 6 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (144): InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job, WorkerEvent, ChainBuildOptions (+136 more)

### Community 60 - "14. Private processes"
Cohesion: 0.08
Nodes (30): PrivateBlockSource, SourceTransport, StartHashes, PublicDatabase, PublicSide, PublicSideOptions, PublicWakes, TransportPosition (+22 more)

### Community 61 - "cli/command.ts"
Cohesion: 0.07
Nodes (39): RestoreSeams, BackupOutcome, CommandHandler, CommandIo, MainProcess, commandTarget, Chain, RestoreCommandOptions (+31 more)

### Community 62 - "contract-data-checks.ts"
Cohesion: 0.10
Nodes (47): CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx (+39 more)

### Community 64 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck (+40 more)

### Community 65 - "node.test.ts"
Cohesion: 0.07
Nodes (26): Metadata, Step, Frame, TapeError, TapeClock, expectDelayHonoured(), expectGoldenRoundTrip(), manualClock() (+18 more)

### Community 66 - "core-ledger-state.ts"
Cohesion: 0.07
Nodes (41): BlockLedgerSource, LedgerBinding, retainedStates, CoreRevision, applyBlock(), boundLedger(), chainOutcomesOf(), contractsOf() (+33 more)

### Community 67 - "core-settings.ts"
Cohesion: 0.05
Nodes (43): LedgerTableSettings, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, Absent, DeepReadonly, PrivateKeys, PrivateOnly (+35 more)

### Community 68 - "core-chain-events.ts"
Cohesion: 0.08
Nodes (40): BlockEventSource, MetadataField, MetadataVariant, Primitive, RuntimeMetadataView, ChainEvent, RecordTypes, ScaleValue (+32 more)

### Community 69 - "history.test.ts"
Cohesion: 0.07
Nodes (41): HistoryOptions, HistoryRow, Simulation, Start, Case, graphInputOf(), load(), noHeight() (+33 more)

### Community 7 - "migrate.ts"
Cohesion: 0.02
Nodes (147): Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference, OwnPart (+139 more)

### Community 70 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 71 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (32): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+24 more)

### Community 72 - "config/plain-data.test.ts"
Cohesion: 0.05
Nodes (30): LoadOptions, WORKER, SignalEvent, SignalJob, Row, invalid(), isFile(), loadConfig() (+22 more)

### Community 73 - "zero-timeouts-checks.ts"
Cohesion: 0.09
Nodes (34): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+26 more)

### Community 74 - "version-table.ts"
Cohesion: 0.09
Nodes (38): ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerPin, LedgerRow, LedgerSelection (+30 more)

### Community 75 - "tape/command.ts"
Cohesion: 0.08
Nodes (31): BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command (+23 more)

### Community 77 - "version-checks.ts"
Cohesion: 0.11
Nodes (36): VersionedBlock, Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk (+28 more)

### Community 79 - "checkShape"
Cohesion: 0.07
Nodes (35): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+27 more)

### Community 8 - "ref_node_fs"
Cohesion: 0.05
Nodes (95): BackupBackend, BackupDatabase, killedRestore, BackupOnSignal, LoopClass, Pausable, RecorderGlobals, cliProject (+87 more)

### Community 81 - "history-database.test.ts"
Cohesion: 0.08
Nodes (37): ConfigRow, ConfigHashRow, HistoryCheck, HistoryInput, HistoryRule, PlacedEntry, AppliedMigration, Holder (+29 more)

### Community 82 - "net.test.ts"
Cohesion: 0.08
Nodes (22): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade (+14 more)

### Community 85 - "config-check.ts"
Cohesion: 0.07
Nodes (36): EntryView, CheckFinding, CheckState, ConfigCheckOptions, ConfigCheckSeams, StepName, StepReport, StepStatus (+28 more)

### Community 86 - "core-contract-logs-fast.ts"
Cohesion: 0.10
Nodes (36): ContractLog, CoreContractLogsFastOptions, FastLogReader, CoreContractLogsFullOptions, LogEventType, BlockContext, DefinedModule, contractLogsItem() (+28 more)

### Community 87 - "real-tapes.ts"
Cohesion: 0.08
Nodes (33): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+25 more)

### Community 88 - "validate.ts"
Cohesion: 0.10
Nodes (39): CursorRule, Issue, Plain, coreSettingsSchema(), pathOf(), closest(), configFindings(), configSecrets() (+31 more)

### Community 9 - "host.ts"
Cohesion: 0.04
Nodes (80): LoadLedger, LedgerStateItem, RetainedState, LedgerName, ChainOutcome, LedgerTask, NodeBatch, ParsedTransaction (+72 more)

### Community 91 - "pack-install.mjs"
Cohesion: 0.09
Nodes (35): Surface, SmokeFailure, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12() (+27 more)

### Community 92 - "contract-modules.test.ts"
Cohesion: 0.08
Nodes (30): UnsureLog, LogSite, Program, UnsureReason, V9Raw, Freeable, LoadAdapter, bytesOfHex() (+22 more)

### Community 94 - "networks.ts"
Cohesion: 0.06
Nodes (36): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+28 more)

### Community 95 - "ledger-tasks-checks.ts"
Cohesion: 0.10
Nodes (33): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses(), plainWatchModule(), tasksScenario() (+25 more)

### Community 96 - "browser/build.ts"
Cohesion: 0.07
Nodes (29): BrowserBuild, BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common() (+21 more)

### Community 103 - "3. Block source and ingest"
Cohesion: 0.07
Nodes (30): refused(), A paused loop on `/status`, A private process and a changed public configuration, The node on `/status`, UmbraDB operator guide, 7. Storage helpers, 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence (+22 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 241 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 102 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.07
Nodes (25): 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage, ADDED Requirements (+17 more)

### Community 138 - "UmbraDB module guide"
Cohesion: 0.07
Nodes (27): hexBytes(), params(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations (+19 more)

### Community 143 - "T"
Cohesion: 0.09
Nodes (24): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get` (+16 more)

### Community 148 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (15): createReadStream(), firstLine(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir (+7 more)

### Community 149 - "UmbraDB"
Cohesion: 0.09
Nodes (24): text(), transportReader(), A PGlite directory that does not exist, Checking a configuration against its database, The database, The transport reader, TLS to PostgreSQL: `ssl`, Backup and restore (+16 more)

### Community 156 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 158 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 168 - "core-ledger-state.test.ts"
Cohesion: 0.13
Nodes (11): bindLedgerParser(), boundLedgerParser(), bindCoreLedgerState(), itemsOf(), retainedStatesOf(), applied(), bound(), query() (+3 more)

### Community 183 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 184 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 188 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (12): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+4 more)

### Community 196 - "fault"
Cohesion: 0.15
Nodes (12): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+4 more)

### Community 206 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 211 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 218 - "readPrivateCursor"
Cohesion: 0.24
Nodes (9): readPrivateCursor(), commandCommittedHeight(), readDatabaseState(), committedHeight(), database(), 00029 — `umbradb config check --database` reads a private database's cursor from the public cursor table, Evidence, Problem (+1 more)

### Community 228 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 237 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 245 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 274 - "firstRegularAtParentTime"
Cohesion: 0.47
Nodes (4): parentTimeOf(), blockTimeMsAt(), firstRegularAtParentTime(), parentTimestampMs()

### Community 275 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 307 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 319 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 51 - ".put"
Cohesion: 0.04
Nodes (52): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+44 more)

### Community 53 - "history"
Cohesion: 0.04
Nodes (55): history(), n(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+47 more)

### Community 63 - "version"
Cohesion: 0.04
Nodes (47): side(), version(), Appendix A. Reference, 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Requirement: MD-1 A module is a declaration the host imports (+39 more)

### Community 76 - "code"
Cohesion: 0.05
Nodes (42): code(), Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in) (+34 more)

### Community 78 - ".from"
Cohesion: 0.10
Nodes (39): a91Problems(), a92Problems(), a93Problems(), parsedRows(), resultRows(), text(), hexOf(), hex() (+31 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 93 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (12): publicLockstepOf(), height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), identity() (+4 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 118 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 140 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 146 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 151 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.09
Nodes (17): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+9 more)

### Community 153 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 164 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 165 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 167 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 169 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 170 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 171 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 181 - "README.md"
Cohesion: 0.19
Nodes (6): Choosing a database, Launching it, stats-module, Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 182 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 189 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 190 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 195 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 198 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 199 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 201 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 205 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 207 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 209 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 210 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 212 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 213 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 216 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 217 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 219 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 220 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 221 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 222 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 223 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 224 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 225 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 226 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 227 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 229 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Restore on the other backend, Spec delta — `backups` capability

### Community 230 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 231 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 232 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 236 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 238 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 239 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 240 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 242 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 243 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 244 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 246 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 247 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 248 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 249 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 250 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 251 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 252 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 254 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 256 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 257 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 258 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 259 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 260 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 261 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 262 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 263 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 264 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 265 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 266 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 267 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 268 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 269 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 270 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

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

### Community 283 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 284 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 285 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 286 - "Problem"
Cohesion: 0.40
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 287 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 288 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 289 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 290 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 291 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 292 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 293 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 294 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 295 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 296 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 297 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 298 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 299 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 300 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 301 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 302 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 303 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 304 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 308 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 309 - "Vendored ledger builds"
Cohesion: 0.40
Nodes (4): Rebuilding, Updating a version, Vendored ledger builds, What the patches add

### Community 310 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 311 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 312 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 313 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 314 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 315 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 316 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 317 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 323 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 80 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 98 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3772 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `admin-harness.ts`, `loop.ts`, `column-rules.ts`, `db/errors.ts`, `loop.test.ts`, `runner/process.ts`, `InMemoryBlockSource`, `migrate.ts`, `ref_node_fs`, `host.ts`, `process-admin.ts`, `ingest-harness.ts`, `ReadHandle`, `adapter-fixtures.ts`, `core-transport.ts`, `cbor.ts`, `TapeRecord`, `tape/index.ts`, `adapter.ts`, `record-and-replay.test.ts`, `spawnChild`, `devnet-upgrade.test.ts`, `builds.ts`, `fetch-fixtures.ts`, `client.test.ts`, `client.ts`, `writer-lock-checks.ts`, `cursor-harness.ts`, `backup/backup.ts`, `UmbraError`, `change-capture.ts`, `range.ts`, `core-block-parsed.ts`, `transport-faults.test.ts`, `ledger/types.ts`, `run.test.ts`, `slow-block-harness.ts`, `DatabaseParts`, `loop-stop-harness.ts`, `database-parts.ts`, `boundary.test.ts`, `deterministic-postgresql/index.ts`, `core-block-commit.test.ts`, `sweep-tapes.ts`, `transform-checks.ts`, `validate.test.ts`, `src/index.ts`, `ref_node_path`, `browser.test.ts`, `cli/command.ts`, `contract-data-checks.ts`, `node.test.ts`, `core-ledger-state.ts`, `core-settings.ts`, `core-chain-events.ts`, `history.test.ts`, `retirement.test.ts`, `file-mode.test.ts`, `config/plain-data.test.ts`, `zero-timeouts-checks.ts`, `version-table.ts`, `version-checks.ts`, `.from`, `history-database.test.ts`, `net.test.ts`, `real-tapes.ts`, `pack-install.mjs`, `contract-modules.test.ts`, `core-private-source.test.ts`, `networks.ts`, `ledger-tasks-checks.ts`, `browser/build.ts`, `core-ledger-state/sql.ts`, `lockstep-refusals.test.ts`, `cold-boot-recovery.integration.test.ts`, `release-version.ts`, `checks.test.ts`, `cli/run.ts`, `postgres/transaction-history-storage.ts`, `backup/restore.ts`, `worker-host.test.ts`, `test/postgres/setup.ts`, `package.json`, `documents.ts`, `crash.test.ts`, `code-registry.ts`, `Lockstep`, `read-gate.ts`, `pg-tx-history-adapter.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `shims.test.ts`, `restore-private.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `node-bridge.ts`, `block-fetch-decode.test.ts`, `ledger-sweep.test.ts`, `transaction-history-storage.property.test.ts`, `h`, `harness.ts`, `excluded-not-exported.test.ts`, `core-ledger-state.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `LoopPauses`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `configuration-refusal.ts`, `worker-threads.test.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `ledger/plain-data.ts`, `firstRegularAtParentTime`?**
  _High betweenness centrality (0.236) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0170765404807958 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `admin-harness.ts`, `loop.ts`, `process-worker.ts`, `db/errors.ts`, `column-rules.ts`, `runner/process.ts`, `InMemoryBlockSource`, `migrate.ts`, `ref_node_fs`, `host.ts`, `loop.test.ts`, `process-admin.ts`, `FinalizedLoop`, `shims.test.ts`, `ReadHandle`, `core-transport.ts`, `core-private-source.ts`, `cbor.ts`, `TapeRecord`, `tape/index.ts`, `record-and-replay.test.ts`, `NodeBlockSource`, `LedgerPackage`, `ledger/metadata.ts`, `client.ts`, `selectLedgerVersion`, `writer-lock-checks.ts`, `cursor-harness.ts`, `h`, `backup/backup.ts`, `client.test.ts`, `range.ts`, `transport-faults.test.ts`, `core-ledger-state.test.ts`, `slow-block-harness.ts`, `DatabaseParts`, `deterministic-postgresql/index.ts`, `core-block-commit.test.ts`, `aborted`, `statementsOf`, `transform-checks.ts`, `validate.test.ts`, `config/history.ts`, `config/plain-data.ts`, `src/index.ts`, `web-lock.ts`, `14. Private processes`, `cli/command.ts`, `configuration-refusal.ts`, `graph.ts`, `core-ledger-state.ts`, `history.test.ts`, `config/plain-data.test.ts`, `zero-timeouts-checks.ts`, `version-table.ts`, `tape/command.ts`, `version-checks.ts`, `checkShape`, `history-database.test.ts`, `config-check.ts`, `core-contract-logs-fast.ts`, `validate.ts`, `core-private-source.test.ts`, `ledger-tasks-checks.ts`, `lockstep-refusals.test.ts`, `3. Block source and ingest`, `checks.test.ts`, `backup/restore.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `loop.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.018596813725490196 - nodes in this community are weakly interconnected._