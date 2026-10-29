# Graph Report - UmbraDB

## Corpus Check
- 1075 files · ~1,505,427 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11250 nodes · 34254 edges · 321 communities (292 shown, 29 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2646 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `4f625d2a07c9799f` (1075 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- InMemoryBlockSource
- vitest
- db/errors.ts
- lockstep-refusals.test.ts
- release-version.ts
- page.ts
- pg-tx-history-adapter.ts
- PortSocket
- accepted-hash-checks.ts
- browser.test.ts
- browser/build.ts
- core-config.test.ts
- child-processes.test.ts
- spawnChild
- redact.ts
- checks.test.ts
- TransactionHistoryEntry
- cli/command.ts
- paused-harness.ts
- core-transport.ts
- documents.ts
- code-registry.ts
- ref_node_http
- ledger-sweep.test.ts
- config/plain-data.ts
- node-fields-harness.ts
- Lockstep
- read-gate.ts
- test/postgres/setup.ts
- column-rules.ts
- sweep.ts
- fixtures/configuration.ts
- restore-private.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- Design — CORE-ARCH: the standalone indexer's core architecture
- opt-out.test.ts
- .concat
- PrivateTransport
- pglite-lock.ts
- client.test.ts
- BlockItems
- example-checks.ts
- node-format.ts
- Registry
- block-fetch-decode.test.ts
- core-contract-states.ts
- config-check.ts
- worker-host.test.ts
- binding.test.ts
- chrome.ts
- key-handling-checks.ts
- devnet-upgrade.test.ts
- LoopPauses
- loop.ts
- signal-backup.test.ts
- browser-harness.ts
- describeNodeStoreExports
- sweep-fixture.ts
- ws-mutual-tls.test.ts
- module-api.test.ts
- statementsOf
- browser/serve.ts
- web-lock.ts
- worker-threads.test.ts
- midnight-env — reproducible PREPROD dev environment
- adapter-fixtures.ts
- history.property.test.ts
- vendored-ledger-node-roots.test.ts
- worker-threads-worker.ts
- Worker
- migrate.ts
- FinalizedLoop
- .send
- Reader
- stats-module.ts
- childRefKeys
- loop.test.ts
- ledger/plain-data.ts
- writer-lock-checks.ts
- host.ts
- nodesOfTagged
- vendored-ledger-files.test.ts
- process-admin.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- ref_node_crypto
- records.ts
- adapter.ts
- cbor.ts
- startup-stop-harness.ts
- https.ts
- NodeFS
- tape/index.ts
- runner/process.ts
- RecordingClient
- process-context.test.ts
- interfaces/transaction-history-storage.ts
- LedgerPackage
- pause-fixtures.ts
- range.ts
- contract-modules.test.ts
- transform-checks.ts
- backup/backup.ts
- ingest-harness.ts
- UmbraError
- version-checks.ts
- backup-fixtures.ts
- private/backends.ts
- boundary.test.ts
- ledger/types.ts
- NodeClient
- NodeBlockSource
- core-block-parsed.ts
- entries.ts
- Process
- replay-check.ts
- code
- ref_node_fs
- networks.ts
- api-server.test.ts
- ledger/ledger-tasks.test.ts
- slow-block-harness.ts
- node.test.ts
- PgTransactionHistoryStorage
- ledger-storage.test.ts
- ModuleDeclaration
- .value
- process-worker.ts
- builder.test.ts
- mapping.ts
- intake.test.ts
- core-block-commit.test.ts
- core-ledger-state.ts
- builds.ts
- Database
- graph.ts
- worker-storage.test.ts
- containers.test.ts
- contract-data-checks.ts
- retirement.test.ts
- file-mode.test.ts
- client.ts
- real-tapes.ts
- declaration.ts
- checkShape
- shims.test.ts
- state-trees.test.ts
- pack-install.mjs
- config/history.ts
- BlockRef
- cli-fixtures.ts
- validation.ts
- Design — Sprint 1: project setup + TemporalKV
- core-chain-events.ts
- validate.ts
- Proposal — Sprint 3: CheckpointStore
- version
- ADDED Requirements
- .slowBlockMs
- UmbraDB module guide
- vendored-ledger-v9.test.ts
- T
- Boundaries, threats and controls
- core-ledger-state.test.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- Design — v1.1.0: Quint model checking
- UmbraDB third-party component inventory (SBOM)
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- v9
- orphan-watcher.mjs
- crash-worker.ts
- .put
- history
- cold-boot-recovery.integration.test.ts
- refused
- ADDED Requirements
- .from
- graph.py
- ADDED Requirements
- ADDED Requirements
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
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
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- UmbraDB software supply-chain directory
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.9.5] - 2026-07-25 — "Penumbra"
- scoped-review-manifest
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- try.sh
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- UmbraDB in a browser
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
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
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
- lib.sh
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
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
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements

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

## Communities (321 total, 29 thin omitted)

### Community 0 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (177): BlockItemSource, InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job, WorkerEvent (+169 more)

### Community 1 - "vitest"
Cohesion: 0.02
Nodes (184): AdminStarter, DatabaseParts, PostgresParts, PostgresPartsInput, ProcessConfig, ProcessHandle, AdminRun, AdminRunOptions (+176 more)

### Community 10 - "db/errors.ts"
Cohesion: 0.03
Nodes (73): ConfiguredDatabase, ConfiguredDatabaseOptions, CommittedHeight, ReadOnlyDatabase, ReadOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning (+65 more)

### Community 100 - "lockstep-refusals.test.ts"
Cohesion: 0.11
Nodes (35): LockstepCondition, A118Observation, MismatchObservation, ExpectedWait, WaitSample, hashAt(), inMemoryBlock(), a77Problems() (+27 more)

### Community 101 - "release-version.ts"
Cohesion: 0.12
Nodes (35): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+27 more)

### Community 102 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 103 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (24): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+16 more)

### Community 105 - "PortSocket"
Cohesion: 0.09
Nodes (15): Emitter, Frame, Listener, PortSocket, PortUpgrade, RawData, WebSocket, WebSocketServer (+7 more)

### Community 107 - "accepted-hash-checks.ts"
Cohesion: 0.10
Nodes (21): a165Run, Attempt, TestDatabase, TransportProxy, privateCursorHeight(), a165Problems(), contentsOf(), cursorOf() (+13 more)

### Community 108 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 109 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 11 - "core-config.test.ts"
Cohesion: 0.04
Nodes (86): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+78 more)

### Community 110 - "child-processes.test.ts"
Cohesion: 0.07
Nodes (29): ParentJob, Kill, Orphaned, SourceFile, guardPid(), alive(), bystander(), childrenOf() (+21 more)

### Community 111 - "spawnChild"
Cohesion: 0.08
Nodes (26): RunningCommand, LockResult, heldPort(), startChild(), startWorker(), namesUnder(), pacedNode(), runWorkerInChild() (+18 more)

### Community 115 - "redact.ts"
Cohesion: 0.10
Nodes (28): RedactionForms, SecretForm, TextPattern, transportReaderFacts, findings(), databaseText(), isMemoryDatabase(), configRedactor() (+20 more)

### Community 116 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+14 more)

### Community 117 - "TransactionHistoryEntry"
Cohesion: 0.12
Nodes (12): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+4 more)

### Community 118 - "cli/command.ts"
Cohesion: 0.12
Nodes (23): BackupSeams, CommandHandler, CommandIo, MainProcess, CommandResult, backupArguments(), backupCommand(), checkArguments() (+15 more)

### Community 119 - "paused-harness.ts"
Cohesion: 0.15
Nodes (25): Body, PausedExpectation, Read, Reader, Running, keepingPause(), pausedOf(), pausedProblems() (+17 more)

### Community 12 - "core-transport.ts"
Cohesion: 0.03
Nodes (99): ResultColumn, Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, Message (+91 more)

### Community 120 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 121 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 123 - "ref_node_http"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 124 - "ledger-sweep.test.ts"
Cohesion: 0.14
Nodes (14): SweepState, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel, sweepReset(), bigints() (+6 more)

### Community 125 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 126 - "node-fields-harness.ts"
Cohesion: 0.11
Nodes (23): A168Observation, A168Phase, Expected, StatusReader, a(), a168Problems(), a168Run(), atLeast() (+15 more)

### Community 127 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 128 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 129 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 13 - "column-rules.ts"
Cohesion: 0.02
Nodes (102): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+94 more)

### Community 131 - "sweep.ts"
Cohesion: 0.11
Nodes (15): GreyView, SweepPhase, SweepTables, SweepWrites, BYTE_ORDER(), hexOf(), merged(), sqlSweepTables() (+7 more)

### Community 132 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (20): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+12 more)

### Community 135 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+14 more)

### Community 136 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 137 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 138 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 139 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (16): BackupText, createReadStream(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir (+8 more)

### Community 14 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (82): CheckedMigration, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, ConsistentRead (+74 more)

### Community 144 - ".concat"
Cohesion: 0.11
Nodes (14): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+6 more)

### Community 146 - "PrivateTransport"
Cohesion: 0.16
Nodes (7): HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), client()

### Community 149 - "pglite-lock.ts"
Cohesion: 0.15
Nodes (18): CreatedDirectory, Held, PgliteLockUse, acquirePgliteLock(), directoryPath(), lockHeld(), openFailed(), pgliteLockFile() (+10 more)

### Community 15 - "client.test.ts"
Cohesion: 0.03
Nodes (55): Connection, NodeRetry, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets, Answer (+47 more)

### Community 150 - "BlockItems"
Cohesion: 0.11
Nodes (11): BlockItems, LateUse, EagerItems, EagerLoop, KeptItems, KeptLoop, revisionAt(), h() (+3 more)

### Community 151 - "example-checks.ts"
Cohesion: 0.16
Nodes (17): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+9 more)

### Community 153 - "node-format.ts"
Cohesion: 0.20
Nodes (17): Child, Readable, TableNode, node(), childKey(), concat(), decodeChildren(), encodeChild() (+9 more)

### Community 155 - "Registry"
Cohesion: 0.21
Nodes (13): Field, Registry, metadataWith(), metadataV14(), midnightMetadata(), some(), text(), vec() (+5 more)

### Community 158 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+9 more)

### Community 159 - "core-contract-states.ts"
Cohesion: 0.10
Nodes (19): ContractStateRow, CoreContractStatesOptions, DefinedModule, blockParsedItemOf(), writeTransactionRows(), contractStatesOf(), coreContractStates(), hex() (+11 more)

### Community 16 - "config-check.ts"
Cohesion: 0.04
Nodes (94): RestoreChain, Environment, BackupCommandOptions, BackupOutcome, CheckFinding, CheckStep, ConfigCheckSeams, StepName (+86 more)

### Community 160 - "worker-host.test.ts"
Cohesion: 0.12
Nodes (18): SlowStep, TestLoaderData, beat(), countDeserializations(), hexOf(), loadLedger(), probe(), applyBlock() (+10 more)

### Community 162 - "binding.test.ts"
Cohesion: 0.17
Nodes (19): A113Observation, A156Observation, Binding, Created, Outcome, a113Problems(), a113Run(), a156Problems() (+11 more)

### Community 163 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 164 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 166 - "devnet-upgrade.test.ts"
Cohesion: 0.16
Nodes (13): Side, TapeAnswers, FoundTape, found(), nodeRootAt(), recording(), storedRoots(), expectTableHolds() (+5 more)

### Community 169 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 17 - "loop.ts"
Cohesion: 0.04
Nodes (92): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointRun (+84 more)

### Community 171 - "signal-backup.test.ts"
Cohesion: 0.16
Nodes (13): WORKER, SignalEvent, SignalJob, startWorker(), report(), PGLITE, REPOSITORY, handle (+5 more)

### Community 172 - "browser-harness.ts"
Cohesion: 0.27
Nodes (16): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+8 more)

### Community 173 - "describeNodeStoreExports"
Cohesion: 0.18
Nodes (4): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports()

### Community 177 - "sweep-fixture.ts"
Cohesion: 0.18
Nodes (16): FixtureNode, firstVersion(), hex(), node(), rootOf(), stateNodes(), subtree(), utf8() (+8 more)

### Community 178 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 18 - "module-api.test.ts"
Cohesion: 0.03
Nodes (74): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions (+66 more)

### Community 180 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 183 - "browser/serve.ts"
Cohesion: 0.21
Nodes (10): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), CONTENT_TYPES (+2 more)

### Community 184 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 187 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 189 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 19 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (87): DeployTx, Upstream, contractFixture, RawPackage, AdapterSubject, AdapterWorkerHost, Decimal, Fullness (+79 more)

### Community 192 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 193 - "vendored-ledger-node-roots.test.ts"
Cohesion: 0.18
Nodes (11): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, runInFreshInstance(), V9_RC3_PACKAGE_PATH, fixtures (+3 more)

### Community 195 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 2 - "migrate.ts"
Cohesion: 0.02
Nodes (164): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference (+156 more)

### Community 20 - "FinalizedLoop"
Cohesion: 0.04
Nodes (28): Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, Startup, SkipsAfterReconnect, SkipsUnseen (+20 more)

### Community 202 - "Reader"
Cohesion: 0.33
Nodes (5): Reader, decodeChild(), readChild(), readChildList(), taggedRootKey()

### Community 208 - "stats-module.ts"
Cohesion: 0.31
Nodes (9): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+1 more)

### Community 209 - "childRefKeys"
Cohesion: 0.40
Nodes (3): ChildReader, childRefKeys(), readChildren()

### Community 21 - "loop.test.ts"
Cohesion: 0.04
Nodes (77): CommitOutcome, HeldHeight, LockstepWait, LoopEnd, SlowBlockEvent, SlowWindow, Contexts, SilentHalt (+69 more)

### Community 210 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 22 - "writer-lock-checks.ts"
Cohesion: 0.05
Nodes (71): PostgresOptions, Snapshot, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PostgresTestServer, PauseReport (+63 more)

### Community 23 - "host.ts"
Cohesion: 0.05
Nodes (64): LedgerStateItem, RetainedState, LedgerName, LedgerTask, LedgerTaskBlock, ParsedTransaction, AppliedState, ApplyBlock (+56 more)

### Community 230 - "nodesOfTagged"
Cohesion: 0.36
Nodes (3): Reader, untag(), nodesOfTagged()

### Community 231 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 24 - "process-admin.ts"
Cohesion: 0.05
Nodes (83): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+75 more)

### Community 242 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 248 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 25 - "ref_node_crypto"
Cohesion: 0.04
Nodes (83): CaptureColumn, CapturedTable, CaptureState, SchemaPlan, ChangeKind, tableChanges, TouchedRow, ColumnType (+75 more)

### Community 26 - "records.ts"
Cohesion: 0.05
Nodes (62): RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError, Connection (+54 more)

### Community 27 - "adapter.ts"
Cohesion: 0.04
Nodes (73): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+65 more)

### Community 28 - "cbor.ts"
Cohesion: 0.05
Nodes (78): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+70 more)

### Community 29 - "startup-stop-harness.ts"
Cohesion: 0.04
Nodes (62): CommitOptions, ChainCheck, ChainCheckInput, privateIntake, CommandBuildOptions, backupSignalRelay, RunOptions, RunSeams (+54 more)

### Community 3 - "tape/index.ts"
Cohesion: 0.03
Nodes (174): ProcessCondition, BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, PalletMetadata, Phase (+166 more)

### Community 30 - "runner/process.ts"
Cohesion: 0.04
Nodes (49): ChainSource, NodeWait, WaitingListener, RetryCode, PauseBy, PausedCondition, RetryCondition, StartedProcess (+41 more)

### Community 31 - "process-context.test.ts"
Cohesion: 0.04
Nodes (45): EntryRange, ResolvedGraph, StartedModuleApi, MisuseListener, MisuseReports, ProcessContexts, ProcessContextsInput, ProcessItems (+37 more)

### Community 32 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (57): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+49 more)

### Community 33 - "LedgerPackage"
Cohesion: 0.06
Nodes (35): LedgerPackage, StateHandle, Held, LedgerEngine, LedgerTaskFailed, stagenetReplay, hexOf(), idOf() (+27 more)

### Community 34 - "pause-fixtures.ts"
Cohesion: 0.05
Nodes (54): BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable, PausableConfig, PausableOptions, RecorderGlobals (+46 more)

### Community 35 - "range.ts"
Cohesion: 0.04
Nodes (56): ConnectSocket, GatedConnector, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, CompletenessRange (+48 more)

### Community 36 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (62): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+54 more)

### Community 37 - "transform-checks.ts"
Cohesion: 0.07
Nodes (52): Failure, Variant, TapeError, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange (+44 more)

### Community 38 - "backup/backup.ts"
Cohesion: 0.06
Nodes (65): BackupInput, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool (+57 more)

### Community 39 - "ingest-harness.ts"
Cohesion: 0.06
Nodes (52): NodeClientOptions, IngestOptions, SourceClass, watched, RestartEvent, RestartJob, WindowBackup, A169Observation (+44 more)

### Community 4 - "UmbraError"
Cohesion: 0.02
Nodes (106): LoadedConfig, LoadOptions, PostgresConnection, PostgresOptions, ConfiguredGenesis, PrivateBlockSource, PrivateChecks, PrivateShared (+98 more)

### Community 40 - "version-checks.ts"
Cohesion: 0.07
Nodes (47): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, LedgerTable, Boundary, CallRecord, CountingNode (+39 more)

### Community 41 - "backup-fixtures.ts"
Cohesion: 0.08
Nodes (49): RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, TickerConfig, catalogOf(), connectionOf(), dockerExec() (+41 more)

### Community 43 - "private/backends.ts"
Cohesion: 0.06
Nodes (44): PglitePathParts, PrivateBackend, SessionSeen, A162Options, a162Run, HeaderSeen, Escape, publicState (+36 more)

### Community 44 - "boundary.test.ts"
Cohesion: 0.06
Nodes (52): DesignTable, RowCoverage, ModuleReference, Finding, collationsWritten(), componentCode(), componentExports(), componentTexts() (+44 more)

### Community 45 - "ledger/types.ts"
Cohesion: 0.07
Nodes (44): LoadLedger, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerPackageOptions, NodeBatch (+36 more)

### Community 46 - "NodeClient"
Cohesion: 0.08
Nodes (27): CoreChainBinding, HeadSubscriber, NodeClient, Pending, Waiter, connectionFailure, NodeMethod, finalizedHeight() (+19 more)

### Community 48 - "NodeBlockSource"
Cohesion: 0.07
Nodes (23): CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeSubscription, NodeBlock, NodeHeader (+15 more)

### Community 49 - "core-block-parsed.ts"
Cohesion: 0.06
Nodes (60): BodyExtrinsic, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions, TransactionParser, ChainTransaction (+52 more)

### Community 5 - "entries.ts"
Cohesion: 0.02
Nodes (135): CoreLedgerVersion, LedgerPackageIdentity, LedgerTableSettings, TransportReaderSettings, DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput (+127 more)

### Community 50 - "Process"
Cohesion: 0.06
Nodes (13): CoreTransport, Heartbeat, PauseHold, Process, SignalTarget, publicLockstepOf(), messageOf(), beat() (+5 more)

### Community 51 - "replay-check.ts"
Cohesion: 0.06
Nodes (49): Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments (+41 more)

### Community 52 - "code"
Cohesion: 0.04
Nodes (59): RepositoryFile, canPin(), code(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS (+51 more)

### Community 53 - "ref_node_fs"
Cohesion: 0.05
Nodes (41): BaselineLoad, Comparison, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline, LatencyStats (+33 more)

### Community 54 - "networks.ts"
Cohesion: 0.05
Nodes (57): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+49 more)

### Community 55 - "api-server.test.ts"
Cohesion: 0.06
Nodes (46): ChainDataAnswer, ChainDataView, HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, AppendsVersion, Client (+38 more)

### Community 56 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (46): CallArgsItem, CallArguments, V9Raw, bindLedgerTasks(), boundHost(), frozen(), hasLedgerTasks(), resultsOf() (+38 more)

### Community 57 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (50): LoopInput, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, Observed (+42 more)

### Community 58 - "node.test.ts"
Cohesion: 0.05
Nodes (21): Metadata, Step, Frame, RawClient, Failure, Variant, TapeClock, expectAnswersByOccurrence() (+13 more)

### Community 59 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (51): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 2. Dependency direction: structural mirror, not a runtime import (+43 more)

### Community 6 - "ledger-storage.test.ts"
Cohesion: 0.04
Nodes (136): itemsSeen, Json, FixtureRun, ingest, Call, SeenLoad, retentionSeen, LedgerTx (+128 more)

### Community 60 - "ModuleDeclaration"
Cohesion: 0.08
Nodes (48): ErrorCode, ModuleDeclaration, GraphInput, RestoreBuild, PastFaultCase, RefusalCase, declaration(), logsProvider() (+40 more)

### Community 62 - ".value"
Cohesion: 0.12
Nodes (29): ExtrinsicCall, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, TypeDef, ScaleError, ScaleReader (+21 more)

### Community 63 - "process-worker.ts"
Cohesion: 0.06
Nodes (35): NetworkBroker, IncomingMessage, Server, NetworkMessage, Scope, crossedError, StartRun, ToProcessWorker (+27 more)

### Community 64 - "builder.test.ts"
Cohesion: 0.07
Nodes (28): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Script, ScriptedNode, Step (+20 more)

### Community 65 - "mapping.ts"
Cohesion: 0.06
Nodes (37): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+29 more)

### Community 66 - "intake.test.ts"
Cohesion: 0.09
Nodes (39): PrivateProcess, PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation (+31 more)

### Community 67 - "core-block-commit.test.ts"
Cohesion: 0.06
Nodes (40): BlockHeaderItem, CoreBlockHeader, StandInOptions, Commit, blockHeaderOf(), checkParent(), commitBlock(), hex() (+32 more)

### Community 68 - "core-ledger-state.ts"
Cohesion: 0.07
Nodes (42): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions, applyBlock(), boundLedger(), bytesOf() (+34 more)

### Community 69 - "builds.ts"
Cohesion: 0.07
Nodes (37): PrivateIntakeOptions, PublicWakes, A165Options, PrivateOptions, PrivateRefusal, Pause, Q142Observation, SkipsLockstep (+29 more)

### Community 7 - "Database"
Cohesion: 0.02
Nodes (107): Bound, Database, Committed, Settings, TestBackend, TestDatabase, Case, LoadOutcome (+99 more)

### Community 70 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+40 more)

### Community 71 - "worker-storage.test.ts"
Cohesion: 0.07
Nodes (33): ChainOutcome, NodeStore, StoredNode, Thread, BridgeServer, bridgeStore, Growable, CallTx (+25 more)

### Community 72 - "containers.test.ts"
Cohesion: 0.07
Nodes (33): BenchEnv, driverConnectionOptions, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, TlsPostgres, guardContainers() (+25 more)

### Community 73 - "contract-data-checks.ts"
Cohesion: 0.12
Nodes (43): contractScenario, ContractScenarioOptions, LogLine, Program, Ran, ScenarioTx, handoff, HandoffAt (+35 more)

### Community 74 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 75 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (32): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+24 more)

### Community 77 - "client.ts"
Cohesion: 0.11
Nodes (39): State, Subscription, NodeRuntimeVersion, NodeCallMethod, SubscribeMethod, SocketFailure, backoffDelay(), positive() (+31 more)

### Community 79 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 8 - "declaration.ts"
Cohesion: 0.03
Nodes (105): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue (+97 more)

### Community 82 - "checkShape"
Cohesion: 0.08
Nodes (34): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+26 more)

### Community 84 - "shims.test.ts"
Cohesion: 0.08
Nodes (24): databaseTarget, Buffer, BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText() (+16 more)

### Community 88 - "state-trees.test.ts"
Cohesion: 0.07
Nodes (32): ApplyInput, ApplyOutput, StateSummary, LedgerHeight, Ledger, NodeRoot, AdapterWorkerAnswer, AdapterWorkerRequest (+24 more)

### Community 89 - "pack-install.mjs"
Cohesion: 0.09
Nodes (35): Surface, SmokeFailure, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12() (+27 more)

### Community 9 - "config/history.ts"
Cohesion: 0.03
Nodes (124): CoreVersion, CoreSettings, ConfigHashRow, HistoryCode, HistoryContext, HistoryFinding, HistoryInput, HistoryOptions (+116 more)

### Community 91 - "BlockRef"
Cohesion: 0.08
Nodes (12): BlockLedgerSource, QueuedBlock, LedgerBinding, BlockRef, InMemorySourceOptions, EventsRunner, Fetching, Recorder (+4 more)

### Community 92 - "cli-fixtures.ts"
Cohesion: 0.08
Nodes (25): ConfigCheckReport, cliProject, CheckTarget, CliBackend, configText(), coreSettings(), emitDeclarations(), inChild() (+17 more)

### Community 93 - "validation.ts"
Cohesion: 0.06
Nodes (34): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+26 more)

### Community 97 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.05
Nodes (36): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+28 more)

### Community 98 - "core-chain-events.ts"
Cohesion: 0.09
Nodes (31): BlockEventSource, MetadataField, Primitive, systemEventsKey(), boundEventSource(), chainEventsOf(), coreChainEventsOnFetch(), metadataView() (+23 more)

### Community 99 - "validate.ts"
Cohesion: 0.11
Nodes (35): ConfigRule, CursorRule, Finding, Issue, Plain, coreSettingsSchema(), closest(), configFindings() (+27 more)

### Community 228 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 106 - "version"
Cohesion: 0.06
Nodes (33): version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5) (+25 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+25 more)

### Community 145 - ".slowBlockMs"
Cohesion: 0.10
Nodes (21): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+13 more)

### Community 148 - "UmbraDB module guide"
Cohesion: 0.08
Nodes (24): params(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 13. Providing items to other modules, 14. Private modules, 15. Migrations, 16. Upgrades, 2.1 The declaration (+16 more)

### Community 152 - "vendored-ledger-v9.test.ts"
Cohesion: 0.21
Nodes (19): freeAll(), bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex() (+11 more)

### Community 154 - "T"
Cohesion: 0.10
Nodes (21): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 0. Schema (+13 more)

### Community 165 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 176 - "core-ledger-state.test.ts"
Cohesion: 0.13
Nodes (10): boundLedgerParser(), itemsOf(), writeBlock(), applied(), bound(), query(), refusing(), CORE_LEDGER_STATE_MIGRATIONS (+2 more)

### Community 179 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (14): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+6 more)

### Community 182 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 200 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 205 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 233 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 250 - "v9"
Cohesion: 0.47
Nodes (5): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 259 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 295 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 42 - ".put"
Cohesion: 0.03
Nodes (62): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+54 more)

### Community 47 - "history"
Cohesion: 0.04
Nodes (62): history(), n(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+54 more)

### Community 76 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (30): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed(), ledgerV8NodeEntry() (+22 more)

### Community 80 - "refused"
Cohesion: 0.06
Nodes (43): refused(), text(), transportReader(), cursorRead(), following(), 12. When a callback fails, 17. Trying a module against another node, A paused loop on `/status` (+35 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 87 - ".from"
Cohesion: 0.06
Nodes (34): hexOf(), hex(), hex(), hex(), unhex(), blockHex(), hex(), hex() (+26 more)

### Community 96 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 114 - "README.md"
Cohesion: 0.07
Nodes (24): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:, Choosing a database (+16 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+21 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+19 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 141 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 142 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.08
Nodes (20): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+12 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 147 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 157 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 170 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 174 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 175 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 181 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 186 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 188 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 190 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 191 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 194 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 197 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 198 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 199 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 5. Full-sync soak + load-under-concurrent-prune (G10), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring (+3 more)

### Community 203 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 204 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 206 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 207 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 211 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 212 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 213 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 214 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 215 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 216 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 217 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 218 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 219 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 220 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 221 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.22
Nodes (8): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Suggested fix, Suggested fix

### Community 222 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 223 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Restore on the other backend, Spec delta — `backups` capability

### Community 224 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 225 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 226 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 227 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 229 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 232 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 234 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 235 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 236 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 237 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 238 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 239 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 240 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 241 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 244 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 245 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 246 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 247 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 249 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 251 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 252 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 253 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 254 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 255 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 256 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 257 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 258 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 260 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 261 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 262 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 263 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 264 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 265 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 266 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 267 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 268 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 269 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 270 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 271 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 272 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 273 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 274 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 275 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 276 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 277 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 278 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 279 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 280 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 281 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 282 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 283 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 284 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 285 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 286 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 287 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 288 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 289 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 290 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 291 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 292 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 293 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 294 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 61 - "package.json"
Cohesion: 0.03
Nodes (57): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+49 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 94 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3762 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `InMemoryBlockSource`, `migrate.ts`, `tape/index.ts`, `UmbraError`, `entries.ts`, `ledger-storage.test.ts`, `Database`, `declaration.ts`, `config/history.ts`, `db/errors.ts`, `core-config.test.ts`, `core-transport.ts`, `column-rules.ts`, `opt-out.test.ts`, `client.test.ts`, `config-check.ts`, `loop.ts`, `module-api.test.ts`, `adapter-fixtures.ts`, `loop.test.ts`, `writer-lock-checks.ts`, `host.ts`, `process-admin.ts`, `ref_node_crypto`, `records.ts`, `adapter.ts`, `cbor.ts`, `startup-stop-harness.ts`, `runner/process.ts`, `process-context.test.ts`, `interfaces/transaction-history-storage.ts`, `pause-fixtures.ts`, `range.ts`, `contract-modules.test.ts`, `transform-checks.ts`, `backup/backup.ts`, `ingest-harness.ts`, `version-checks.ts`, `backup-fixtures.ts`, `private/backends.ts`, `boundary.test.ts`, `ledger/types.ts`, `core-block-parsed.ts`, `code`, `ref_node_fs`, `networks.ts`, `api-server.test.ts`, `ledger/ledger-tasks.test.ts`, `slow-block-harness.ts`, `node.test.ts`, `ModuleDeclaration`, `package.json`, `process-worker.ts`, `builder.test.ts`, `mapping.ts`, `intake.test.ts`, `core-block-commit.test.ts`, `core-ledger-state.ts`, `builds.ts`, `worker-storage.test.ts`, `containers.test.ts`, `contract-data-checks.ts`, `retirement.test.ts`, `file-mode.test.ts`, `cold-boot-recovery.integration.test.ts`, `client.ts`, `real-tapes.ts`, `shims.test.ts`, `.from`, `state-trees.test.ts`, `pack-install.mjs`, `cli-fixtures.ts`, `validation.ts`, `core-chain-events.ts`, `lockstep-refusals.test.ts`, `release-version.ts`, `pg-tx-history-adapter.ts`, `accepted-hash-checks.ts`, `browser.test.ts`, `browser/build.ts`, `child-processes.test.ts`, `spawnChild`, `redact.ts`, `checks.test.ts`, `cli/command.ts`, `documents.ts`, `code-registry.ts`, `ledger-sweep.test.ts`, `config/plain-data.ts`, `node-fields-harness.ts`, `Lockstep`, `read-gate.ts`, `test/postgres/setup.ts`, `sweep.ts`, `restore-private.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `Design — CORE-ARCH: the standalone indexer's core architecture`, `BlockItems`, `example-checks.ts`, `vendored-ledger-v9.test.ts`, `node-format.ts`, `block-fetch-decode.test.ts`, `worker-host.test.ts`, `binding.test.ts`, `key-handling-checks.ts`, `devnet-upgrade.test.ts`, `excluded-not-exported.test.ts`, `LoopPauses`, `signal-backup.test.ts`, `core-ledger-state.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `web-lock.ts`, `worker-threads.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `history.property.test.ts`, `vendored-ledger-node-roots.test.ts`, `ledger/plain-data.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.241) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InMemoryBlockSource` be split into smaller, more focused modules?**
  _Cohesion score 0.022323404793524314 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `InMemoryBlockSource`, `vitest`, `migrate.ts`, `tape/index.ts`, `entries.ts`, `Database`, `declaration.ts`, `config/history.ts`, `db/errors.ts`, `Design — CORE-ARCH: the standalone indexer's core architecture`, `core-transport.ts`, `opt-out.test.ts`, `client.test.ts`, `config-check.ts`, `loop.ts`, `PrivateTransport`, `module-api.test.ts`, `FinalizedLoop`, `pglite-lock.ts`, `writer-lock-checks.ts`, `loop.test.ts`, `process-admin.ts`, `ref_node_crypto`, `records.ts`, `host.ts`, `cbor.ts`, `runner/process.ts`, `process-context.test.ts`, `pause-fixtures.ts`, `binding.test.ts`, `contract-modules.test.ts`, `range.ts`, `backup/backup.ts`, `ingest-harness.ts`, `version-checks.ts`, `transform-checks.ts`, `private/backends.ts`, `ledger/types.ts`, `NodeClient`, `NodeBlockSource`, `core-ledger-state.test.ts`, `replay-check.ts`, `statementsOf`, `code`, `networks.ts`, `api-server.test.ts`, `web-lock.ts`, `ledger/ledger-tasks.test.ts`, `slow-block-harness.ts`, `ModuleDeclaration`, `mapping.ts`, `core-block-commit.test.ts`, `core-ledger-state.ts`, `builds.ts`, `graph.ts`, `containers.test.ts`, `client.ts`, `checkShape`, `shims.test.ts`, `BlockRef`, `validation.ts`, `validate.ts`, `lockstep-refusals.test.ts`, `redact.ts`, `checks.test.ts`, `config/plain-data.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.01992387092349371 - nodes in this community are weakly interconnected._