# Graph Report - UmbraDB

## Corpus Check
- 1075 files · ~1,504,997 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11250 nodes · 34253 edges · 336 communities (303 shown, 33 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2646 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `4aa651c51b02180e` (1075 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- tape/index.ts
- vitest
- cbor.ts
- shims.test.ts
- page.ts
- core-chain-events.ts
- browser.test.ts
- browser/build.ts
- .concat
- child-processes.test.ts
- chain-placement.test.ts
- config/history.ts
- TransactionHistoryEntry
- restore-private.ts
- private/lockstep-wait.test.ts
- process-worker.ts
- cli/command.ts
- checks.test.ts
- documents.ts
- process-admin.ts
- code-registry.ts
- envelope.ts
- ledger-sweep.test.ts
- config/plain-data.ts
- read-gate.ts
- test/postgres/setup.ts
- mapping.ts
- sweep.ts
- entries.ts
- relays.ts
- paused-harness.ts
- fixtures/configuration.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- pg-tx-history-adapter.ts
- durability-probe.test.ts
- node-fields-harness.ts
- pglite-lock.ts
- run.test.ts
- example-checks.ts
- .from
- BlockItems
- harness.ts
- block-fetch-decode.test.ts
- core-contract-states.ts
- worker-host.test.ts
- column-rules.ts
- chrome.ts
- key-handling-checks.ts
- lockstep-refusals.test.ts
- LoopPauses
- config-check.ts
- signal-backup.test.ts
- browser-harness.ts
- sweep-fixture.ts
- FakeNode
- PortSocket
- records.ts
- ws-mutual-tls.test.ts
- statementsOf
- checkShape
- no-indexer-or-wallet-sdk.test.ts
- browser/serve.ts
- web-lock.ts
- FinalizedLoop
- worker-threads.test.ts
- midnight-env — reproducible PREPROD dev environment
- history.property.test.ts
- component-table.test.ts
- admin-harness.ts
- ModuleDeclaration
- worker-threads-worker.ts
- Worker
- .send
- adapter-fixtures.ts
- childRefKeys
- ledger/plain-data.ts
- core-transport.ts
- transport-intake.test.ts
- declaration.ts
- loop.test.ts
- mutation-evidence.d.mts
- host.ts
- NetworkBroker
- AsyncLocalStorage
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- adapter.ts
- node-format.ts
- stats.ts
- backup/backup.ts
- runner/process.ts
- BlockParsed
- db/errors.ts
- builds.ts
- https.ts
- range.ts
- NodeFS
- RecordingClient
- interfaces/transaction-history-storage.ts
- BlockRef
- LedgerPackage
- loop-stop-harness.ts
- contract-modules.test.ts
- process-context.test.ts
- pause-fixtures.ts
- version-checks.ts
- migrate.ts
- loop.ts
- backup-fixtures.ts
- ledger/types.ts
- .read
- transform-checks.ts
- code
- slow-block-harness.ts
- ledger/ledger-tasks.test.ts
- networks.ts
- InMemoryBlockSource
- node.test.ts
- PgTransactionHistoryStorage
- transport.test.ts
- builder.test.ts
- .value
- connectWebSocket
- Process
- contract-data-checks.ts
- UmbraError
- zero-timeouts-checks.ts
- graph.ts
- core-block-commit.test.ts
- core-block-parsed.ts
- core-ledger-state.ts
- worker-storage.test.ts
- ref_node_fs
- height-versioned.test.ts
- retirement.test.ts
- file-mode.test.ts
- core-config.test.ts
- transport-faults.test.ts
- client.ts
- private/backends.ts
- determinism-checks.ts
- real-tapes.ts
- node-source.ts
- PgliteDatabase
- opt-out.test.ts
- boundary.test.ts
- state-trees.test.ts
- ref_node_crypto
- pack-install.mjs
- cold-boot-recovery.integration.test.ts
- cli-fixtures.ts
- api-server.test.ts
- validation.ts
- crash.test.ts
- NodeClient
- validate.ts
- net.test.ts
- Design — Sprint 1: project setup + TemporalKV
- release-version.ts
- Design — Sprint 3: CheckpointStore
- ADDED Requirements
- 10. Node client and ingest
- T
- UmbraDB module guide
- mapping.test.ts
- following
- .slowBlockMs
- Boundaries, threats and controls
- .boolean
- core-ledger-state.test.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- refused
- path.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- failingSource
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- v9
- orphan-watcher.mjs
- fresh-instance.mjs
- crash-worker.ts
- .put
- history
- version
- ADDED Requirements
- graph.py
- ledger-storage-checks.ts
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- Requirements
- README.md
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- UmbraDB software supply-chain directory
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Design — Sprint 2: Transaction/Lease
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.9.5] - 2026-07-25 — "Penumbra"
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- try.sh
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- UmbraDB operator guide
- stats-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Midnight Foundation Security Policy
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
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
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
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
- bug-report.md
- feature-request.md
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
- repository
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
- ADDED Requirements
- post-block-update/oracle/main.rs

## God Nodes (most connected - your core abstractions)
1. `vitest` - 372 edges
2. `UmbraError` - 314 edges
3. `ModuleDeclaration` - 177 edges
4. `FinalizedLoop` - 133 edges
5. `InMemoryBlockSource` - 120 edges
6. `NodeClient` - 113 edges
7. `Database` - 100 edges
8. `BlockRef` - 95 edges
9. `ReadHandle` - 89 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts

## Import Cycles
- None detected.

## Communities (336 total, 33 thin omitted)

### Community 0 - "tape/index.ts"
Cohesion: 0.02
Nodes (198): ProcessCondition, BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime, PalletMetadata (+190 more)

### Community 1 - "vitest"
Cohesion: 0.03
Nodes (154): itemsSeen, FixtureRun, CrashEvent, CrashJob, ingest, IngestOptions, SourceClass, watched (+146 more)

### Community 10 - "cbor.ts"
Cohesion: 0.03
Nodes (133): CaptureColumn, CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode (+125 more)

### Community 100 - "shims.test.ts"
Cohesion: 0.09
Nodes (21): databaseTarget, Buffer, BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText() (+13 more)

### Community 101 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 104 - "core-chain-events.ts"
Cohesion: 0.09
Nodes (30): BlockEventSource, MetadataField, Primitive, systemEventsKey(), boundEventSource(), chainEventsOf(), coreChainEventsOnFetch(), metadataView() (+22 more)

### Community 105 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 106 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 107 - ".concat"
Cohesion: 0.07
Nodes (23): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+15 more)

### Community 108 - "child-processes.test.ts"
Cohesion: 0.07
Nodes (29): ParentJob, Kill, Orphaned, SourceFile, guardPid(), alive(), bystander(), childrenOf() (+21 more)

### Community 109 - "chain-placement.test.ts"
Cohesion: 0.12
Nodes (24): Field, Registry, decodeExtrinsics(), inThreadParser(), metadataWith(), block(), counting(), fill() (+16 more)

### Community 11 - "config/history.ts"
Cohesion: 0.03
Nodes (128): CoreVersion, CoreSettings, versionEntry, ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext, HistoryInput (+120 more)

### Community 111 - "TransactionHistoryEntry"
Cohesion: 0.11
Nodes (11): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), 4. Wiring `PgTemporalKV`'s `opts.tx`, 2. `set` (+3 more)

### Community 113 - "restore-private.ts"
Cohesion: 0.13
Nodes (24): RestoreOutcome, BackupDatabase, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions (+16 more)

### Community 114 - "private/lockstep-wait.test.ts"
Cohesion: 0.12
Nodes (29): PrivateProcess, PrivateSeen, A114Observation, A116Observation, ExpectedWait, hashAt(), inMemoryBlock(), a77Problems() (+21 more)

### Community 115 - "process-worker.ts"
Cohesion: 0.11
Nodes (23): Scope, crossedError, StartRun, ToProcessWorker, RestoreSeams, messageAdmin(), withDevelopmentOptIn(), databaseOptions() (+15 more)

### Community 116 - "cli/command.ts"
Cohesion: 0.12
Nodes (23): BackupSeams, CommandHandler, CommandIo, MainProcess, CommandResult, backupArguments(), backupCommand(), checkArguments() (+15 more)

### Community 117 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+14 more)

### Community 118 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 12 - "process-admin.ts"
Cohesion: 0.03
Nodes (109): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+101 more)

### Community 120 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 121 - "envelope.ts"
Cohesion: 0.12
Nodes (24): StatsRow, Outcome, ChainDataView, insertRow(), lastTotal(), recentRows(), rowAt(), answerChainData() (+16 more)

### Community 123 - "ledger-sweep.test.ts"
Cohesion: 0.14
Nodes (14): SweepState, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel, sweepReset(), bigints() (+6 more)

### Community 124 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 125 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 126 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 127 - "mapping.ts"
Cohesion: 0.13
Nodes (26): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+18 more)

### Community 129 - "sweep.ts"
Cohesion: 0.11
Nodes (15): GreyView, SweepPhase, SweepTables, SweepWrites, BYTE_ORDER(), hexOf(), merged(), sqlSweepTables() (+7 more)

### Community 13 - "entries.ts"
Cohesion: 0.02
Nodes (117): LedgerTableSettings, TransportReaderSettings, DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput, CoreSettingsBase, Entry (+109 more)

### Community 130 - "relays.ts"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 131 - "paused-harness.ts"
Cohesion: 0.16
Nodes (23): Body, PausedExpectation, Read, Reader, Running, keepingPause(), pausedOf(), pausedProblems() (+15 more)

### Community 132 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (20): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+12 more)

### Community 136 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 137 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 138 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 139 - "pg-tx-history-adapter.ts"
Cohesion: 0.12
Nodes (21): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+13 more)

### Community 14 - "durability-probe.test.ts"
Cohesion: 0.04
Nodes (93): BenchEnv, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, WriterSession, WriterStart (+85 more)

### Community 142 - "node-fields-harness.ts"
Cohesion: 0.11
Nodes (22): A168Observation, A168Phase, Expected, StatusReader, a(), a168Run(), atLeast(), attempts() (+14 more)

### Community 147 - "pglite-lock.ts"
Cohesion: 0.15
Nodes (18): CreatedDirectory, Held, PgliteLockUse, acquirePgliteLock(), directoryPath(), lockHeld(), openFailed(), pgliteLockFile() (+10 more)

### Community 148 - "run.test.ts"
Cohesion: 0.11
Nodes (15): RunningCommand, statsConfig, check(), write(), exitWithin(), statsModule(), headAt(), reachHead() (+7 more)

### Community 149 - "example-checks.ts"
Cohesion: 0.16
Nodes (17): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+9 more)

### Community 15 - ".from"
Cohesion: 0.03
Nodes (73): Connection, NodeRetry, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets, Answer (+65 more)

### Community 150 - "BlockItems"
Cohesion: 0.12
Nodes (11): BlockItems, LateUse, EagerItems, EagerLoop, KeptItems, KeptLoop, revisionAt(), h() (+3 more)

### Community 151 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 155 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+9 more)

### Community 156 - "core-contract-states.ts"
Cohesion: 0.10
Nodes (19): ContractStateRow, CoreContractStatesOptions, DefinedModule, blockParsedItemOf(), writeTransactionRows(), contractStatesOf(), coreContractStates(), hex() (+11 more)

### Community 157 - "worker-host.test.ts"
Cohesion: 0.12
Nodes (18): SlowStep, TestLoaderData, beat(), countDeserializations(), hexOf(), loadLedger(), probe(), applyBlock() (+10 more)

### Community 16 - "column-rules.ts"
Cohesion: 0.02
Nodes (101): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+93 more)

### Community 161 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 162 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 164 - "lockstep-refusals.test.ts"
Cohesion: 0.22
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+10 more)

### Community 169 - "LoopPauses"
Cohesion: 0.16
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 17 - "config-check.ts"
Cohesion: 0.04
Nodes (89): RestoreChain, BackupOutcome, CheckFinding, CheckStep, ConfigCheckSeams, StepName, StepReport, StepStatus (+81 more)

### Community 172 - "signal-backup.test.ts"
Cohesion: 0.16
Nodes (13): WORKER, SignalEvent, SignalJob, startWorker(), report(), PGLITE, REPOSITORY, handle (+5 more)

### Community 173 - "browser-harness.ts"
Cohesion: 0.27
Nodes (16): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+8 more)

### Community 177 - "sweep-fixture.ts"
Cohesion: 0.18
Nodes (16): FixtureNode, firstVersion(), hex(), node(), rootOf(), stateNodes(), subtree(), utf8() (+8 more)

### Community 179 - "PortSocket"
Cohesion: 0.21
Nodes (5): PortSocket, 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 18 - "records.ts"
Cohesion: 0.05
Nodes (71): RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError (+63 more)

### Community 180 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 181 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 182 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 186 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 187 - "browser/serve.ts"
Cohesion: 0.21
Nodes (10): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), CONTENT_TYPES (+2 more)

### Community 188 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 19 - "FinalizedLoop"
Cohesion: 0.04
Nodes (29): EntryBoundary, Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, Startup, SkipsAfterReconnect (+21 more)

### Community 192 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 194 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 198 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 199 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 2 - "admin-harness.ts"
Cohesion: 0.02
Nodes (167): FromAdmin, AdminServer, AdminStarter, AdminStartOptions, AdminSnapshot, DatabaseParts, PostgresParts, PostgresPartsInput (+159 more)

### Community 20 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (91): ErrorCode, ModuleDeclaration, GraphInput, PointRun, RestoreBuild, PastFaultCase, RefusalCase, Seen (+83 more)

### Community 201 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 21 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (87): DeployTx, Upstream, contractFixture, RawPackage, AdapterSubject, AdapterWorkerHost, Decimal, Fullness (+79 more)

### Community 213 - "childRefKeys"
Cohesion: 0.40
Nodes (3): ChildReader, childRefKeys(), readChildren()

### Community 214 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 22 - "core-transport.ts"
Cohesion: 0.04
Nodes (73): Session, TransportLimits, TransportTls, Committed, Hello, HelloAck, JsonValue, MessageFault (+65 more)

### Community 23 - "declaration.ts"
Cohesion: 0.04
Nodes (72): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, ApiRegistry (+64 more)

### Community 24 - "loop.test.ts"
Cohesion: 0.04
Nodes (73): CommitOutcome, HeldHeight, LockstepWait, LoopEnd, SlowBlockEvent, SlowWindow, Contexts, Faults (+65 more)

### Community 248 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 25 - "host.ts"
Cohesion: 0.05
Nodes (64): LedgerStateItem, RetainedState, LedgerName, LedgerTask, LedgerTaskBlock, ParsedTransaction, AppliedState, ApplyBlock (+56 more)

### Community 257 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 26 - "adapter.ts"
Cohesion: 0.04
Nodes (73): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+65 more)

### Community 27 - "node-format.ts"
Cohesion: 0.05
Nodes (59): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+51 more)

### Community 271 - "stats.ts"
Cohesion: 0.40
Nodes (3): ManualOpts, TinybenchOpts, tinybench

### Community 28 - "backup/backup.ts"
Cohesion: 0.04
Nodes (77): BackupInput, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool (+69 more)

### Community 29 - "runner/process.ts"
Cohesion: 0.04
Nodes (57): ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait, WaitingListener, RestoreBase, CheckState, CoreLedgerVersion (+49 more)

### Community 294 - "BlockParsed"
Cohesion: 0.40
Nodes (4): BlockParsed, 00053 — the exported `startProcess` cannot be called with the package alone, Evidence, Suggested fix

### Community 3 - "db/errors.ts"
Cohesion: 0.02
Nodes (119): ConfiguredDatabase, ConfiguredDatabaseOptions, PostgresConnection, PostgresOptions, Bound, SslMode, CommittedHeight, Database (+111 more)

### Community 30 - "builds.ts"
Cohesion: 0.04
Nodes (73): PrivateIntakeOptions, PublicWakes, A165Options, a165Run, Attempt, TestDatabase, A113Observation, A156Observation (+65 more)

### Community 31 - "range.ts"
Cohesion: 0.04
Nodes (70): BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command (+62 more)

### Community 32 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (57): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus (+49 more)

### Community 33 - "BlockRef"
Cohesion: 0.06
Nodes (19): HeadWait, NodeBlockSource, NodeHeader, BlockRef, PreparedBlock, QueueRunner, InMemorySourceOptions, EventsRunner (+11 more)

### Community 34 - "LedgerPackage"
Cohesion: 0.06
Nodes (35): LedgerPackage, StateHandle, Held, LedgerEngine, LedgerTaskFailed, stagenetReplay, hexOf(), idOf() (+27 more)

### Community 35 - "loop-stop-harness.ts"
Cohesion: 0.06
Nodes (50): ChainCheck, ChainCheckInput, RunSeams, NodeClientOptions, BlockSource, FinalityStallCondition, ProcessHandle, ProcessInput (+42 more)

### Community 36 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (62): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+54 more)

### Community 37 - "process-context.test.ts"
Cohesion: 0.05
Nodes (39): EntryRange, ResolvedGraph, MisuseListener, MisuseReports, ProcessContexts, ProcessContextsInput, ProcessItems, PublishRefusal (+31 more)

### Community 38 - "pause-fixtures.ts"
Cohesion: 0.05
Nodes (52): BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable, PausableConfig, PausableOptions, RecorderGlobals (+44 more)

### Community 39 - "version-checks.ts"
Cohesion: 0.07
Nodes (53): LedgerTable, Side, Boundary, CallRecord, CountingNode, MetadataSelector, Select, TapeAnswers (+45 more)

### Community 4 - "migrate.ts"
Cohesion: 0.03
Nodes (136): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference (+128 more)

### Community 41 - "loop.ts"
Cohesion: 0.06
Nodes (57): PointName, HeightRange, Callback, CallbackFailure, ParallelPoint, PointSchedule, ProcessReason, ReasonCode (+49 more)

### Community 42 - "backup-fixtures.ts"
Cohesion: 0.09
Nodes (46): RestoreCommandSeams, BackupBackend, killedRestore, TickerConfig, catalogOf(), connectionOf(), dockerExec(), hashOf() (+38 more)

### Community 43 - "ledger/types.ts"
Cohesion: 0.07
Nodes (44): LoadLedger, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerPackageOptions, NodeBatch (+36 more)

### Community 44 - ".read"
Cohesion: 0.05
Nodes (57): Chain, ChainOptions, DigestRow, identityRow(), captured(), captureFunction(), hex(), moduleM() (+49 more)

### Community 45 - "transform-checks.ts"
Cohesion: 0.08
Nodes (45): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, baseRecords() (+37 more)

### Community 46 - "code"
Cohesion: 0.03
Nodes (61): RepositoryFile, canPin(), code(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS (+53 more)

### Community 47 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (51): BlockItemSource, LoopInput, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+43 more)

### Community 48 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (46): CallArgsItem, CallArguments, V9Raw, bindLedgerTasks(), boundHost(), frozen(), hasLedgerTasks(), resultsOf() (+38 more)

### Community 49 - "networks.ts"
Cohesion: 0.05
Nodes (56): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+48 more)

### Community 5 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (137): InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job, WorkerEvent, ChainBuildOptions (+129 more)

### Community 50 - "node.test.ts"
Cohesion: 0.05
Nodes (23): Metadata, Step, Frame, RawClient, Failure, Variant, TapeClock, expectAnswersByOccurrence() (+15 more)

### Community 51 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (50): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 5. WalletState envelope (+42 more)

### Community 52 - "transport.test.ts"
Cohesion: 0.07
Nodes (36): Message, PrivateBackend, PublicCore, TestCertificates, Ended, rawClient, Escape, publicState (+28 more)

### Community 53 - "builder.test.ts"
Cohesion: 0.06
Nodes (30): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Script, ScriptedNode (+22 more)

### Community 54 - ".value"
Cohesion: 0.12
Nodes (30): ExtrinsicCall, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, RuntimeMetadataView, TypeDef, ScaleError (+22 more)

### Community 55 - "connectWebSocket"
Cohesion: 0.06
Nodes (32): ConnectSocket, GatedConnector, Outage, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+24 more)

### Community 57 - "Process"
Cohesion: 0.09
Nodes (8): CoreTransport, PauseHold, Process, SignalTarget, isBlockEventSource(), messageOf(), namedStartDb(), nodeSignals()

### Community 59 - "contract-data-checks.ts"
Cohesion: 0.11
Nodes (45): contractScenario, ContractScenarioOptions, LogLine, Program, Ran, ScenarioTx, handoff, HandoffAt (+37 more)

### Community 6 - "UmbraError"
Cohesion: 0.02
Nodes (104): LoadedConfig, LoadOptions, PrivateBlockSource, PrivateChecks, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes (+96 more)

### Community 60 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (34): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+26 more)

### Community 61 - "graph.ts"
Cohesion: 0.07
Nodes (49): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+41 more)

### Community 62 - "core-block-commit.test.ts"
Cohesion: 0.06
Nodes (40): BlockHeaderItem, CoreBlockHeader, StandInOptions, Commit, blockHeaderOf(), checkParent(), commitBlock(), hex() (+32 more)

### Community 63 - "core-block-parsed.ts"
Cohesion: 0.07
Nodes (45): BodyExtrinsic, BlockBody, MetadataVariant, BlockParsedOptions, TransactionParser, ChainTransaction, ChainEvent, EventPhase (+37 more)

### Community 64 - "core-ledger-state.ts"
Cohesion: 0.07
Nodes (42): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions, applyBlock(), boundLedger(), bytesOf() (+34 more)

### Community 65 - "worker-storage.test.ts"
Cohesion: 0.07
Nodes (33): ChainOutcome, NodeStore, StoredNode, Thread, BridgeServer, bridgeStore, Growable, CallTx (+25 more)

### Community 66 - "ref_node_fs"
Cohesion: 0.05
Nodes (30): Served, Finding, Upstream, Pem, ReportedTest, isolationProblems(), serveCommand(), filesUnder() (+22 more)

### Community 67 - "height-versioned.test.ts"
Cohesion: 0.08
Nodes (32): VersionedValue, helperDatabase, StoredVersion, Block, BlockFails, Counts, Effect, Model (+24 more)

### Community 68 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 69 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (32): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+24 more)

### Community 7 - "core-config.test.ts"
Cohesion: 0.03
Nodes (112): CommitOptions, adminRoutes, AdminChannel, AdminServeOptions, ToAdmin, AdminAnswer, AdminEndpoint, AdminPart (+104 more)

### Community 70 - "transport-faults.test.ts"
Cohesion: 0.07
Nodes (26): ResultColumn, CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions (+18 more)

### Community 71 - "client.ts"
Cohesion: 0.10
Nodes (41): State, Subscription, NodeBlock, NodeRuntimeVersion, NodeCallMethod, SubscribeMethod, SocketFailure, backoffDelay() (+33 more)

### Community 72 - "private/backends.ts"
Cohesion: 0.08
Nodes (30): startHashDecision, PglitePathParts, SessionSeen, A162Options, a162Run, HeaderSeen, A112Observation, Wiring (+22 more)

### Community 74 - "determinism-checks.ts"
Cohesion: 0.10
Nodes (32): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, TestLink, a113Run(), against(), withCore() (+24 more)

### Community 75 - "real-tapes.ts"
Cohesion: 0.08
Nodes (33): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+25 more)

### Community 78 - "node-source.ts"
Cohesion: 0.07
Nodes (20): CoreBlockItems, BlockLedgerSource, NodeSourceOptions, Prefetch, QueuedBlock, LedgerBinding, MetadataBlock, MetadataNode (+12 more)

### Community 79 - "PgliteDatabase"
Cohesion: 0.10
Nodes (10): JobQueue, PgliteDatabase, ReadPool, Writer, commitRolledBack(), handleClosed(), failedEarlier(), nestedCall() (+2 more)

### Community 8 - "opt-out.test.ts"
Cohesion: 0.03
Nodes (103): CapturedTable, CaptureState, CheckedMigration, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, GuardTableRow (+95 more)

### Community 82 - "boundary.test.ts"
Cohesion: 0.11
Nodes (35): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+27 more)

### Community 83 - "state-trees.test.ts"
Cohesion: 0.07
Nodes (32): ApplyInput, ApplyOutput, StateSummary, LedgerHeight, Ledger, NodeRoot, AdapterWorkerAnswer, AdapterWorkerRequest (+24 more)

### Community 84 - "ref_node_crypto"
Cohesion: 0.08
Nodes (27): driverConnectionOptions, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, TlsPostgres, guardContainers(), removeAttempt() (+19 more)

### Community 86 - "pack-install.mjs"
Cohesion: 0.09
Nodes (35): Surface, SmokeFailure, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12() (+27 more)

### Community 87 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (24): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+16 more)

### Community 89 - "cli-fixtures.ts"
Cohesion: 0.08
Nodes (25): ConfigCheckReport, cliProject, CheckTarget, CliBackend, configText(), coreSettings(), emitDeclarations(), inChild() (+17 more)

### Community 9 - "api-server.test.ts"
Cohesion: 0.02
Nodes (107): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions (+99 more)

### Community 90 - "validation.ts"
Cohesion: 0.06
Nodes (34): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+26 more)

### Community 92 - "crash.test.ts"
Cohesion: 0.08
Nodes (30): LockResult, CrashCall, CrashEvent, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, heldPort() (+22 more)

### Community 93 - "NodeClient"
Cohesion: 0.14
Nodes (12): CoreChainBinding, HeadSubscriber, NodeClient, Pending, Waiter, connectionFailure, NodeMethod, clientClosed() (+4 more)

### Community 94 - "validate.ts"
Cohesion: 0.10
Nodes (36): HistoryFinding, ConfigRule, CursorRule, Finding, Issue, Plain, coreSettingsSchema(), pathOf() (+28 more)

### Community 96 - "net.test.ts"
Cohesion: 0.09
Nodes (20): IncomingMessage, Server, Emitter, Frame, Listener, PortUpgrade, RawData, WebSocket (+12 more)

### Community 97 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.05
Nodes (36): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+28 more)

### Community 99 - "release-version.ts"
Cohesion: 0.12
Nodes (35): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+27 more)

### Community 160 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.10
Nodes (18): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions (+10 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 119 - "10. Node client and ingest"
Cohesion: 0.16
Nodes (15): finalizedHeight(), hashParameter(), blockUnavailable(), isNodeCallMethod(), askingAgain(), pass(), passFence(), nodeRun() (+7 more)

### Community 133 - "T"
Cohesion: 0.08
Nodes (26): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Scenario: Version and timestamp addressing agree, 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get` (+18 more)

### Community 145 - "UmbraDB module guide"
Cohesion: 0.08
Nodes (25): params(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations, 16. Upgrades (+17 more)

### Community 152 - "mapping.test.ts"
Cohesion: 0.12
Nodes (10): mapValue(), parseJsonLossless(), oid(), identity(), RESULT_COLUMNS, RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence (+2 more)

### Community 153 - "following"
Cohesion: 0.10
Nodes (22): text(), transportReader(), cursorRead(), following(), 17. Trying a module against another node, Backup and restore, Check and run, Configuration files (+14 more)

### Community 158 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 163 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 165 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 176 - "core-ledger-state.test.ts"
Cohesion: 0.13
Nodes (10): boundLedgerParser(), itemsOf(), writeBlock(), applied(), bound(), query(), refusing(), CORE_LEDGER_STATE_MIGRATIONS (+2 more)

### Community 183 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (13): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+5 more)

### Community 185 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 191 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 197 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 204 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 210 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 217 - "refused"
Cohesion: 0.27
Nodes (9): refused(), Requirement: AE-3 States and conditions, Scenario: A fault of the build's declarations ends the process, Scenario: A paused loop, Scenario: A refused configuration ends the process, Scenario: A refused start stays up, Requirement: PP-4 The process transport, Scenario: A read through the core (+1 more)

### Community 231 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 233 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 239 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 259 - "v9"
Cohesion: 0.47
Nodes (5): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 269 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 298 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 308 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 40 - ".put"
Cohesion: 0.03
Nodes (66): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed (+58 more)

### Community 56 - "history"
Cohesion: 0.05
Nodes (48): history(), n(), Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Scenario: A call with an already-aborted signal is rejected before any database work, Scenario: A label given at save time is returned by history and load, Scenario: A signal aborting after the call has begun does not interrupt it (+40 more)

### Community 58 - "version"
Cohesion: 0.04
Nodes (47): version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5) (+39 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 95 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 98 - "ledger-storage-checks.ts"
Cohesion: 0.13
Nodes (35): heightsIn(), a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows(), expectedStates(), ledgerItemsWatcher() (+27 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+21 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+19 more)

### Community 135 - "package.json"
Cohesion: 0.07
Nodes (27): bin, umbradb, bugs, url, description, engines, node, exports (+19 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 141 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 143 - "README.md"
Cohesion: 0.10
Nodes (17): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs, Choosing a database (+9 more)

### Community 144 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.08
Nodes (20): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+12 more)

### Community 146 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 154 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 170 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 171 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 174 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 175 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 184 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 189 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 190 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 193 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 196 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 200 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 203 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 206 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 208 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 209 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 211 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 212 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 215 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 216 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 218 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 219 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 220 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure, Design — Sprint 2: Transaction/Lease (+1 more)

### Community 221 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 222 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 223 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 225 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 226 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.22
Nodes (8): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Suggested fix, Suggested fix

### Community 227 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 228 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Restore on the other backend, Spec delta — `backups` capability

### Community 229 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 230 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 232 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 234 - "UmbraDB operator guide"
Cohesion: 0.25
Nodes (8): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The transport reader, TLS to PostgreSQL: `ssl`, UmbraDB operator guide

### Community 235 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 236 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 238 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 240 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 241 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 242 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 243 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 244 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 245 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 246 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 247 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 249 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 252 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 253 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 254 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 255 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.33
Nodes (5): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Problem, Resolution, Suggested fix

### Community 256 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 258 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 260 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 261 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 262 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 263 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 264 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 265 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 266 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 267 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 268 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 270 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 272 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 273 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 274 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 275 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 276 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 277 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 278 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 279 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 280 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 281 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 282 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 283 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 284 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 285 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 286 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 287 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 288 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 289 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 290 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 291 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 292 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 293 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 295 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 296 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 297 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 299 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 300 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 301 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 302 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 303 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 304 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 305 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 306 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 307 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 312 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 313 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 73 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped (+32 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 91 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-8949`, `RFC-8949`, `RFC-3339` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3762 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `tape/index.ts`, `admin-harness.ts`, `db/errors.ts`, `migrate.ts`, `InMemoryBlockSource`, `UmbraError`, `core-config.test.ts`, `opt-out.test.ts`, `api-server.test.ts`, `cbor.ts`, `config/history.ts`, `process-admin.ts`, `entries.ts`, `durability-probe.test.ts`, `.from`, `column-rules.ts`, `config-check.ts`, `records.ts`, `ModuleDeclaration`, `adapter-fixtures.ts`, `core-transport.ts`, `declaration.ts`, `loop.test.ts`, `host.ts`, `adapter.ts`, `node-format.ts`, `backup/backup.ts`, `runner/process.ts`, `builds.ts`, `interfaces/transaction-history-storage.ts`, `loop-stop-harness.ts`, `contract-modules.test.ts`, `process-context.test.ts`, `pause-fixtures.ts`, `version-checks.ts`, `loop.ts`, `backup-fixtures.ts`, `ledger/types.ts`, `.read`, `transform-checks.ts`, `code`, `slow-block-harness.ts`, `ledger/ledger-tasks.test.ts`, `networks.ts`, `node.test.ts`, `transport.test.ts`, `builder.test.ts`, `connectWebSocket`, `contract-data-checks.ts`, `zero-timeouts-checks.ts`, `core-block-commit.test.ts`, `core-ledger-state.ts`, `worker-storage.test.ts`, `ref_node_fs`, `height-versioned.test.ts`, `retirement.test.ts`, `file-mode.test.ts`, `transport-faults.test.ts`, `client.ts`, `private/backends.ts`, `determinism-checks.ts`, `real-tapes.ts`, `boundary.test.ts`, `state-trees.test.ts`, `ref_node_crypto`, `pack-install.mjs`, `cold-boot-recovery.integration.test.ts`, `cli-fixtures.ts`, `validation.ts`, `crash.test.ts`, `net.test.ts`, `release-version.ts`, `shims.test.ts`, `core-chain-events.ts`, `browser.test.ts`, `browser/build.ts`, `child-processes.test.ts`, `chain-placement.test.ts`, `restore-private.ts`, `private/lockstep-wait.test.ts`, `cli/command.ts`, `checks.test.ts`, `documents.ts`, `code-registry.ts`, `envelope.ts`, `ledger-sweep.test.ts`, `config/plain-data.ts`, `read-gate.ts`, `test/postgres/setup.ts`, `sweep.ts`, `package.json`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `pg-tx-history-adapter.ts`, `run.test.ts`, `example-checks.ts`, `BlockItems`, `harness.ts`, `mapping.test.ts`, `block-fetch-decode.test.ts`, `worker-host.test.ts`, `key-handling-checks.ts`, `lockstep-refusals.test.ts`, `excluded-not-exported.test.ts`, `LoopPauses`, `signal-backup.test.ts`, `core-ledger-state.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `twox.ts`, `worker-threads.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `history.property.test.ts`, `component-table.test.ts`, `facade-merge-loader.ts`, `ledger/plain-data.ts`, `transport-intake.test.ts`?**
  _High betweenness centrality (0.253) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-8949` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tape/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.023902059852312477 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `tape/index.ts`, `vitest`, `admin-harness.ts`, `db/errors.ts`, `migrate.ts`, `InMemoryBlockSource`, `core-config.test.ts`, `opt-out.test.ts`, `api-server.test.ts`, `cbor.ts`, `config/history.ts`, `process-admin.ts`, `entries.ts`, `durability-probe.test.ts`, `.from`, `config-check.ts`, `records.ts`, `pglite-lock.ts`, `ModuleDeclaration`, `FinalizedLoop`, `core-transport.ts`, `declaration.ts`, `mapping.test.ts`, `loop.test.ts`, `host.ts`, `backup/backup.ts`, `runner/process.ts`, `builds.ts`, `range.ts`, `BlockRef`, `contract-modules.test.ts`, `process-context.test.ts`, `pause-fixtures.ts`, `version-checks.ts`, `lockstep-refusals.test.ts`, `loop.ts`, `ledger/types.ts`, `transform-checks.ts`, `code`, `slow-block-harness.ts`, `core-ledger-state.test.ts`, `networks.ts`, `ledger/ledger-tasks.test.ts`, `transport.test.ts`, `statementsOf`, `checkShape`, `web-lock.ts`, `graph.ts`, `core-block-commit.test.ts`, `zero-timeouts-checks.ts`, `core-ledger-state.ts`, `height-versioned.test.ts`, `transport-faults.test.ts`, `client.ts`, `private/backends.ts`, `node-source.ts`, `PgliteDatabase`, `ref_node_crypto`, `validation.ts`, `NodeClient`, `validate.ts`, `shims.test.ts`, `failingSource`, `checks.test.ts`, `10. Node client and ingest`, `envelope.ts`, `config/plain-data.ts`, `mapping.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.03136989392913563 - nodes in this community are weakly interconnected._