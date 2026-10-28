# Graph Report - UmbraDB

## Corpus Check
- 1073 files · ~1,502,495 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11235 nodes · 34230 edges · 339 communities (304 shown, 35 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2645 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `8688434521eae0ac` (1073 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- admin-harness.ts
- InMemoryBlockSource
- db/api.ts
- core.ts
- page.ts
- .concat
- zero-timeouts-checks.ts
- lockstep-refusals.test.ts
- browser/build.ts
- TransactionHistoryEntry
- Buffer
- config/history.ts
- core-chain-events.ts
- config/database.ts
- documents.ts
- code-registry.ts
- pg-tx-history-adapter.ts
- Lockstep
- read-gate.ts
- interfaces/transaction-history-storage.ts
- ledger-storage.test.ts
- ledger-units.test.ts
- node-bridge.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- loop.test.ts
- ref_node_http
- restore-private.ts
- .send
- height-versioned.property.test.ts
- .value
- cbor.property.test.ts
- host.ts
- Registry
- block-fetch-decode.test.ts
- cli-fixtures.ts
- example-checks.ts
- type-check.ts
- core-block-fetch/metadata.ts
- ingest-harness.ts
- ledger-sweep.test.ts
- key-handling-checks.ts
- extrinsics.ts
- childRefKeys
- config-hash-checks.ts
- ws.ts
- net.test.ts
- core-private-source.test.ts
- retention.ts
- sweep.ts
- browser-harness.ts
- read-height.property.test.ts
- ws-mutual-tls.test.ts
- fetch-fixtures.ts
- signal-backup.test.ts
- node/socket.ts
- checkShape
- cursor-table.property.test.ts
- PortSocket
- core-block-commit.test.ts
- browser/serve.ts
- web-lock.ts
- worker-threads.test.ts
- migrate.ts
- history.property.test.ts
- component-table.test.ts
- worker-threads-worker.ts
- Worker
- FinalizedLoop
- UmbraError
- source-scan.ts
- Design — Sprint 1: project setup + TemporalKV
- adapter.ts
- sweepStep
- transport-intake.test.ts
- ProcessItems
- src/db/postgres.ts
- .name
- config-check.ts
- vitest
- mutation-evidence.d.mts
- nodesOfTagged
- builder.negative-control.test.ts
- NetworkBroker
- ledger/types.ts
- AsyncLocalStorage
- roles.ts
- node-format.ts
- core-transport.ts
- signal-ignored-fixtures.ts
- declaration.ts
- backup-fixtures.ts
- ReadHandle
- https.ts
- NodeFS
- database-parts.ts
- validate.ts
- process-worker.ts
- LedgerPackage
- ledger/ledger-tasks.test.ts
- paused-harness.ts
- .from
- backup/restore.ts
- client.test.ts
- slow-block-harness.ts
- private/backends.ts
- admin/configuration.ts
- chain-placement.test.ts
- mapping.ts
- transport.test.ts
- Transaction
- client.ts
- api-server.test.ts
- version-checks.ts
- Process
- builds.ts
- write-handles.test.ts
- DatabaseParts
- PgTransactionHistoryStorage
- NodeBlockSource
- column-refusals.test.ts
- networks.ts
- adapter-fixtures.ts
- transform-checks.ts
- config/plain-data.ts
- spawnChild
- sweep-tapes.ts
- core-block-parsed.ts
- column-rules.test.ts
- postgres/transaction-history-storage.ts
- column-rules.ts
- file-mode.test.ts
- NodeClient
- redact.ts
- graph.ts
- retirement.test.ts
- cbor.ts
- catalog.ts
- encodeRow
- runner/process.ts
- PgliteDatabase
- cold-boot-recovery.integration.test.ts
- test/postgres/setup.ts
- pack-install.mjs
- .#ended
- real-tapes.ts
- node-source.ts
- db/errors.ts
- tape/index.ts
- module-tables.ts
- core-ledger-state.ts
- browser.test.ts
- release-version.ts
- messages.ts
- Design — Sprint 3: CheckpointStore
- Problem
- 2. Points
- table
- T
- boundary.test.ts
- .boolean
- UmbraDB
- core-ledger-state.test.ts
- .slowBlockMs
- mutation-per-adapter.mjs
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- fault
- twox.ts
- Boundaries, threats and controls
- Design — v1.1.0: Quint model checking
- UmbraDB third-party component inventory (SBOM)
- scoped-review-manifest
- height-partitions.ts
- h
- path.ts
- midnight-env — reproducible PREPROD dev environment
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- ref_node_worker_threads
- orphan-watcher.mjs
- crash-worker.ts
- version
- .put
- history
- code
- ADDED Requirements
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Requirements
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- package.json
- ADDED Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- compilerOptions
- README.md
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.9.5] - 2026-07-25 — "Penumbra"
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Contributing
- UmbraDB in a browser
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
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
- UmbraDB node architecture
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
- Building from source
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time
- 00026 — A configuration's `core` revisions may name different networks
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true
- 00045 — Mutual TLS does not bind a certificate to an instance id
- 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy
- 00047 — Resource limits are per message or connection, not per service
- 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance
- 00049 — A141's "within 2 s" on PostgreSQL fails once under load
- 00050 — A165's race step on PostgreSQL with a transport failed once under load
- 00051 — The transport's instance id is any text: line breaks reach the core's log
- 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents
- bug-report.md
- feature-request.md
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Requirement: RN-13 SIGTERM stops cleanly
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
- bin
- engines
- peerDependencies
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
- post-block-update/oracle/main.rs
- ADDED Requirements
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
- `Evidence` --references--> `ManualTimers`  [INFERRED]
  docs/issues/00016-heartbeat-above-timer-limit.md → test/node/manual-timers.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (339 total, 35 thin omitted)

### Community 0 - "admin-harness.ts"
Cohesion: 0.02
Nodes (228): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+220 more)

### Community 1 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (206): InMemoryBlockSource, InMemoryItems, Wait, ProcessHandle, ProcessingEnd, ProcessStatus, Job, WorkerEvent (+198 more)

### Community 10 - "db/api.ts"
Cohesion: 0.03
Nodes (83): ConfiguredDatabaseOptions, ConfiguredDatabaseOptions, CommittedHeight, Database, ReadOptions, Job, Outcome, PgliteOptions (+75 more)

### Community 100 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 101 - "page.ts"
Cohesion: 0.07
Nodes (29): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog(), backUp() (+21 more)

### Community 102 - ".concat"
Cohesion: 0.07
Nodes (23): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+15 more)

### Community 104 - "zero-timeouts-checks.ts"
Cohesion: 0.11
Nodes (26): Settings, Job, Outcome, apiRead(), engine(), report(), setUp(), idleBlock() (+18 more)

### Community 105 - "lockstep-refusals.test.ts"
Cohesion: 0.12
Nodes (31): LockstepCondition, PublicCore, A118Observation, MismatchObservation, ExpectedWait, WaitSample, a118Problems(), a118Run() (+23 more)

### Community 106 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 107 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 109 - "Buffer"
Cohesion: 0.09
Nodes (20): Buffer, BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText(), charCodes() (+12 more)

### Community 11 - "config/history.ts"
Cohesion: 0.03
Nodes (115): ConfigFacts, CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreSettings, HistoryCode, HistoryContext, HistoryOptions (+107 more)

### Community 111 - "core-chain-events.ts"
Cohesion: 0.09
Nodes (30): MetadataField, Primitive, bindCoreChainEvents(), boundEventSource(), chainEventsOf(), coreChainEventsOnFetch(), metadataView(), runtimeMetadataOf() (+22 more)

### Community 113 - "config/database.ts"
Cohesion: 0.12
Nodes (24): ConfiguredDatabase, CreatedDirectory, Held, PgliteLockUse, openRestoreTarget(), databaseOptions(), openConfiguredDatabase(), acquirePgliteLock() (+16 more)

### Community 114 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 115 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 116 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 117 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 118 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 119 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 12 - "ledger-storage.test.ts"
Cohesion: 0.04
Nodes (118): itemsSeen, ingest, watched, Call, SeenLoad, RestartEvent, RestartJob, retentionSeen (+110 more)

### Community 121 - "ledger-units.test.ts"
Cohesion: 0.11
Nodes (20): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), bindLedgerTasks() (+12 more)

### Community 124 - "node-bridge.ts"
Cohesion: 0.11
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 125 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 126 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 127 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 13 - "loop.test.ts"
Cohesion: 0.03
Nodes (93): Outcome, QueuedBlock, BlockItems, HeightFailure, LockstepWait, LoopEnd, SlowBlockEvent, LoopPause (+85 more)

### Community 131 - "ref_node_http"
Cohesion: 0.11
Nodes (11): Report, HeldLink, HoldingRelay, ReportRelay, describe(), isObject(), parseMessage(), sendable() (+3 more)

### Community 132 - "restore-private.ts"
Cohesion: 0.16
Nodes (21): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+13 more)

### Community 133 - ".send"
Cohesion: 0.14
Nodes (10): Cdp, ChromeBrowser, ChromeTab, chrome(), chrome(), chromePath(), exitsWithin(), launchChrome() (+2 more)

### Community 136 - "height-versioned.property.test.ts"
Cohesion: 0.16
Nodes (17): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+9 more)

### Community 137 - ".value"
Cohesion: 0.22
Nodes (9): MetadataType, ScaleReader, ValueReader, blockTimeOf(), bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement (+1 more)

### Community 139 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 14 - "host.ts"
Cohesion: 0.04
Nodes (90): LoadLedger, TransactionParser, LedgerStateItem, RetainedState, LedgerName, ApplyOutput, LedgerPackageOptions, LedgerTask (+82 more)

### Community 143 - "Registry"
Cohesion: 0.21
Nodes (13): Field, Registry, metadataWith(), metadataV14(), midnightMetadata(), some(), text(), vec() (+5 more)

### Community 144 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 145 - "cli-fixtures.ts"
Cohesion: 0.13
Nodes (17): CommandIo, CommandResult, runArguments(), runCommand(), runProcessCommand(), USAGE, emitDeclarations(), inProcess() (+9 more)

### Community 146 - "example-checks.ts"
Cohesion: 0.17
Nodes (16): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+8 more)

### Community 147 - "type-check.ts"
Cohesion: 0.16
Nodes (14): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), moduleSpecifier() (+6 more)

### Community 149 - "core-block-fetch/metadata.ts"
Cohesion: 0.29
Nodes (14): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 15 - "ingest-harness.ts"
Cohesion: 0.04
Nodes (103): ProcessCondition, SourceShared, A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader (+95 more)

### Community 150 - "ledger-sweep.test.ts"
Cohesion: 0.20
Nodes (11): SweepState, Block, MemoryTables, ModelSnapshot, bigints(), compare(), fixtureBlocks(), hex() (+3 more)

### Community 151 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 152 - "extrinsics.ts"
Cohesion: 0.13
Nodes (18): ExtrinsicCall, MetadataPallet, RuntimeMetadataView, callOf(), callVariants(), decodeExtrinsic(), decodeExtrinsics(), isCompactU64() (+10 more)

### Community 153 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 154 - "config-hash-checks.ts"
Cohesion: 0.14
Nodes (14): A162Options, a162Run, HeaderSeen, RetargetProxy, a162Problems(), asLogin(), formsOf(), headersOf() (+6 more)

### Community 155 - "ws.ts"
Cohesion: 0.13
Nodes (9): Emitter, Frame, Listener, PortUpgrade, RawData, WebSocket, WebSocketServer, connect() (+1 more)

### Community 158 - "net.test.ts"
Cohesion: 0.18
Nodes (10): IncomingMessage, Server, createServer(), listen(), pagePort(), unlisten(), UPGRADE_REQUEST, connecting (+2 more)

### Community 16 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (64): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes, PublicConfiguration (+56 more)

### Community 163 - "retention.ts"
Cohesion: 0.16
Nodes (12): retainedStates, CoreRevision, boundLedger(), releasesOf(), revisionsOf(), sweepOf(), coreRevisionsOf(), releasedBy() (+4 more)

### Community 164 - "sweep.ts"
Cohesion: 0.16
Nodes (11): GreyView, SweepPhase, SweepWrites, BYTE_ORDER(), sqlSweepTables(), sweepReset(), writeSweep(), hex() (+3 more)

### Community 166 - "browser-harness.ts"
Cohesion: 0.26
Nodes (16): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+8 more)

### Community 167 - "read-height.property.test.ts"
Cohesion: 0.16
Nodes (10): TestBackend, HeldRead, Job, Outcome, Reads, Step, concurrent(), queued() (+2 more)

### Community 168 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (12): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+4 more)

### Community 17 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (103): BlockParsed, NodeCallOptions, BlockSpec, EventSpec, Json, Scenario, transactionSpec, RecordingClient (+95 more)

### Community 172 - "signal-backup.test.ts"
Cohesion: 0.18
Nodes (12): WORKER, SignalEvent, SignalJob, report(), PGLITE, REPOSITORY, handle, job (+4 more)

### Community 173 - "node/socket.ts"
Cohesion: 0.20
Nodes (8): Connection, NodeSocket, NodeSocketEvents, NodeTimers, connectWebSocket(), "on-compute"(), DEFAULT_HEARTBEAT_MS, DEFAULT_HEARTBEAT_MS

### Community 175 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 176 - "cursor-table.property.test.ts"
Cohesion: 0.17
Nodes (15): Access, Block, BlockFails, Counts, Write, canonicalText(), expectValue(), holds() (+7 more)

### Community 177 - "PortSocket"
Cohesion: 0.24
Nodes (5): PortSocket, params(), pair(), Evidence, 7. The module API

### Community 18 - "core-block-commit.test.ts"
Cohesion: 0.04
Nodes (88): SchemaPlan, Commit, Committed, Chain, ChainOptions, DigestRow, Op, States (+80 more)

### Community 180 - "browser/serve.ts"
Cohesion: 0.21
Nodes (10): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), CONTENT_TYPES (+2 more)

### Community 181 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 186 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 19 - "migrate.ts"
Cohesion: 0.03
Nodes (73): CapturedTable, AppliedRow, Runnable, Settling, StartupInput, CheckedMigration, MultiStatementRunner, WriteHandleOptions (+65 more)

### Community 191 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 192 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 194 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 2 - "FinalizedLoop"
Cohesion: 0.02
Nodes (145): PointName, HeightRange, ResolvedRange, BlockRef, Callback, CallbackFailure, EntryBoundary, ParallelPoint (+137 more)

### Community 20 - "UmbraError"
Cohesion: 0.05
Nodes (84): LoadedConfig, LoadOptions, BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest (+76 more)

### Community 201 - "source-scan.ts"
Cohesion: 0.32
Nodes (11): ModuleReference, boundaryViolations(), declaredNames(), eachNode(), lineOf(), literalText(), moduleReferences(), propertyNameText() (+3 more)

### Community 208 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.20
Nodes (10): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+2 more)

### Community 21 - "adapter.ts"
Cohesion: 0.04
Nodes (72): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+64 more)

### Community 210 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 22 - "src/db/postgres.ts"
Cohesion: 0.04
Nodes (70): BenchEnv, SslMode, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, driverConnectionOptions, DriverError (+62 more)

### Community 23 - "config-check.ts"
Cohesion: 0.04
Nodes (69): CommandHandler, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport (+61 more)

### Community 24 - "vitest"
Cohesion: 0.03
Nodes (50): CdpEvent, Download, Served, Finding, Lockfile, Manifest, RepositoryFile, Upstream (+42 more)

### Community 245 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 248 - "builder.negative-control.test.ts"
Cohesion: 0.29
Nodes (3): Failure, Variant, WrongRecording

### Community 25 - "ledger/types.ts"
Cohesion: 0.05
Nodes (69): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+61 more)

### Community 26 - "roles.ts"
Cohesion: 0.04
Nodes (66): SchemaWriteHandle, MigrationPart, Difference, OwnPart, PlannedSchema, Provision, QualifiedTable, SchemaItem (+58 more)

### Community 27 - "node-format.ts"
Cohesion: 0.06
Nodes (56): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+48 more)

### Community 28 - "core-transport.ts"
Cohesion: 0.05
Nodes (54): PublicSide, ResultColumn, Session, TransportLimits, TransportTls, Hello, HelloAck, JsonValue (+46 more)

### Community 29 - "signal-ignored-fixtures.ts"
Cohesion: 0.04
Nodes (61): backupSignalRelay, BackupSignals, TickerOptions, Pausable, PausableOptions, IgnoredJob, ListenedRun, WorkerSignals (+53 more)

### Community 3 - "declaration.ts"
Cohesion: 0.02
Nodes (161): OpenedFacts, coreEntry, UmbraConfig, HistoryCheck, HistoryInput, HistoryRule, AppliedMigration, ErrorCode (+153 more)

### Community 30 - "backup-fixtures.ts"
Cohesion: 0.07
Nodes (53): BackupBackend, BackupDatabase, killedRestore, cliProject, restoreCommand(), catalogOf(), connectionOf(), hashOf() (+45 more)

### Community 31 - "ReadHandle"
Cohesion: 0.04
Nodes (46): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, PointCallbacks (+38 more)

### Community 32 - "database-parts.ts"
Cohesion: 0.03
Nodes (70): LedgerTableSettings, TransportReaderSettings, DatabasePartsInput, PostgresPartsInput, TransportReader, CoreEntryInput, CoreSettingsBase, EntryBuilder (+62 more)

### Community 33 - "validate.ts"
Cohesion: 0.04
Nodes (72): HistoryFinding, ConfigRule, CursorRule, EntryRef, Finding, Issue, Plain, CursorRow (+64 more)

### Community 34 - "process-worker.ts"
Cohesion: 0.05
Nodes (60): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, ConfiguredDatabase, databaseTarget, Scope, crossedError (+52 more)

### Community 35 - "LedgerPackage"
Cohesion: 0.06
Nodes (35): LedgerPackage, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, stagenetReplay, hexOf(), idOf() (+27 more)

### Community 36 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (60): TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses() (+52 more)

### Community 37 - "paused-harness.ts"
Cohesion: 0.05
Nodes (57): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, BackupOnSignal (+49 more)

### Community 38 - ".from"
Cohesion: 0.07
Nodes (63): ContractStateRow, CoreContractStatesOptions, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+55 more)

### Community 39 - "backup/restore.ts"
Cohesion: 0.05
Nodes (51): PublicIdentity, Checked, PublicSide, Restored, RestoreInput, RestoreTarget, MetaCommands, Piece (+43 more)

### Community 4 - "client.test.ts"
Cohesion: 0.02
Nodes (91): NodeRetry, HandSocket, HandSockets, Answer, FakeNode, Handler, Received, recorded (+83 more)

### Community 40 - "slow-block-harness.ts"
Cohesion: 0.07
Nodes (56): BlockEventSource, HeightActivity, ReadOpener, StatusBody, Validator, Times, Wait, askedSource (+48 more)

### Community 41 - "private/backends.ts"
Cohesion: 0.06
Nodes (52): PostgresParts, PrivateBackend, SessionSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, InstancesOptions (+44 more)

### Community 43 - "admin/configuration.ts"
Cohesion: 0.06
Nodes (60): AllowedDetail, RevisionSettings, DigestRow, PartTable, SnapshotFacts, ChainView, ConfigSnapshot, DeclarationView (+52 more)

### Community 44 - "chain-placement.test.ts"
Cohesion: 0.06
Nodes (49): AdapterSpec, ManifestLine, VerifyLedgerPackagesOptions, LedgerRelease, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, V9Logs (+41 more)

### Community 45 - "mapping.ts"
Cohesion: 0.05
Nodes (47): ResultType, Case, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+39 more)

### Community 46 - "transport.test.ts"
Cohesion: 0.06
Nodes (42): ReadOnlyDatabase, Message, TestCertificates, Ended, rawClient, Escape, publicState, Refused (+34 more)

### Community 48 - "Transaction"
Cohesion: 0.07
Nodes (47): Transaction, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), blocksIn() (+39 more)

### Community 49 - "client.ts"
Cohesion: 0.09
Nodes (47): State, Subscription, NodeBlock, NodeRuntimeVersion, NodeCallMethod, SubscribeMethod, SocketFailure, finalizedHeight() (+39 more)

### Community 5 - "api-server.test.ts"
Cohesion: 0.02
Nodes (118): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ModuleTableOptions, Connection, HeadersArgument, ModuleApiServer (+110 more)

### Community 51 - "version-checks.ts"
Cohesion: 0.08
Nodes (46): MetadataNode, LedgerSelection, VersionedBlock, Boundary, CallRecord, CountingNode, MetadataSelector, Select (+38 more)

### Community 52 - "Process"
Cohesion: 0.07
Nodes (12): CoreTransport, LoopPaused, LoopPauses, PauseHold, Process, SignalTarget, utcText(), messageOf() (+4 more)

### Community 53 - "builds.ts"
Cohesion: 0.07
Nodes (43): PrivateProcess, PrivateRefusal, PrivateSeen, A114Observation, A116Observation, TestLink, Pause, Q142Observation (+35 more)

### Community 54 - "write-handles.test.ts"
Cohesion: 0.06
Nodes (47): BlockWrites, Point, BlockOpener, writeHandleClosed(), restoreGrants(), prepareSchemas(), setModuleRole(), guardTables() (+39 more)

### Community 55 - "DatabaseParts"
Cohesion: 0.06
Nodes (50): PrivateIntakeOptions, startHashDecision, DatabaseParts, TickerConfig, PausableConfig, A165Options, a165Run, Attempt (+42 more)

### Community 56 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (50): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity (+42 more)

### Community 57 - "NodeBlockSource"
Cohesion: 0.08
Nodes (12): HeadWait, NodeBlockSource, NodeHeader, PreparedBlock, QueueRunner, EventsRunner, NoWindow, OwnStateMetadata (+4 more)

### Community 58 - "column-refusals.test.ts"
Cohesion: 0.06
Nodes (32): ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, Case, pgliteBackend(), startPgliteServer() (+24 more)

### Community 59 - "networks.ts"
Cohesion: 0.06
Nodes (53): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+45 more)

### Community 6 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (124): ApplyInput, StoredNode, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot (+116 more)

### Community 60 - "transform-checks.ts"
Cohesion: 0.10
Nodes (36): TransformError, NotificationRange, baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape(), expectVariantOutput(), forkRecords() (+28 more)

### Community 61 - "config/plain-data.ts"
Cohesion: 0.05
Nodes (40): Entry, PlainArray, PlainDataNode, PlainDataRule, Walk, Accepts, ConfigOf, CoreSettingsGiven (+32 more)

### Community 63 - "spawnChild"
Cohesion: 0.05
Nodes (44): ParentJob, Kill, Orphaned, SourceFile, Run, WorkerEvent, LockResult, dockerExec() (+36 more)

### Community 64 - "sweep-tapes.ts"
Cohesion: 0.10
Nodes (46): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData (+38 more)

### Community 65 - "core-block-parsed.ts"
Cohesion: 0.06
Nodes (47): BodyExtrinsic, BlockBody, MetadataVariant, BlockParsedOptions, ChainTransaction, ChainEvent, EventPhase, RecordTypes (+39 more)

### Community 66 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (30): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TypeRule, DesignTable (+22 more)

### Community 67 - "postgres/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (35): EntryContent, JsonEncoded, TxHistoryRow, Command, ReplayableStorage, assertStoredEntryShape(), decodeContent(), decodeRow() (+27 more)

### Community 68 - "column-rules.ts"
Cohesion: 0.05
Nodes (51): AllowedRule, DesignRow, PlacedRefusal, RefusalOptions, RefusedRule, RuleBase, Token, TreeItem (+43 more)

### Community 69 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (35): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+27 more)

### Community 7 - "NodeClient"
Cohesion: 0.03
Nodes (119): CoreChainBinding, NodeClient, NodeClientOptions, ConnectSocket, IngestOptions, Opened, Outage, ScriptedRequest (+111 more)

### Community 70 - "redact.ts"
Cohesion: 0.07
Nodes (38): RestoreChain, RestoreSeams, CommandConfig, Chain, RestoreCommandOptions, RestoreCommandSeams, RedactionForms, redactor (+30 more)

### Community 71 - "graph.ts"
Cohesion: 0.07
Nodes (45): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+37 more)

### Community 72 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 73 - "cbor.ts"
Cohesion: 0.09
Nodes (37): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+29 more)

### Community 76 - "catalog.ts"
Cohesion: 0.07
Nodes (40): CaptureState, CatalogColumn, CatalogOptions, CatalogTable, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog (+32 more)

### Community 79 - "encodeRow"
Cohesion: 0.08
Nodes (38): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ChangeKind, tableChanges, TouchedRow, encodeArrayHead(), encodeCanonical() (+30 more)

### Community 8 - "runner/process.ts"
Cohesion: 0.03
Nodes (94): OpenedConfig, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, AdminStarter, ModuleFacts, NodeFacts, PrivateInstanceFacts (+86 more)

### Community 82 - "PgliteDatabase"
Cohesion: 0.10
Nodes (9): JobQueue, PgliteDatabase, ReadPool, Writer, commitRolledBack(), handleClosed(), failedEarlier(), openOn() (+1 more)

### Community 83 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 84 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (28): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+20 more)

### Community 85 - "pack-install.mjs"
Cohesion: 0.09
Nodes (35): Surface, SmokeFailure, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12() (+27 more)

### Community 86 - ".#ended"
Cohesion: 0.10
Nodes (13): HeadSubscriber, Pending, Waiter, connectionFailure, NodeMethod, backoffDelay(), isRecord(), isRetryable() (+5 more)

### Community 87 - "real-tapes.ts"
Cohesion: 0.08
Nodes (33): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+25 more)

### Community 88 - "node-source.ts"
Cohesion: 0.08
Nodes (19): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, NodeSourceOptions, Prefetch, MetadataBlock, RuntimeMetadata, RuntimeMetadataEntry (+11 more)

### Community 89 - "db/errors.ts"
Cohesion: 0.07
Nodes (18): PostgresConnection, PostgresOptions, ReadTimeoutSetting, BoundedRead, Session, ErrorDetails, openPostgres(), queryTimeout() (+10 more)

### Community 9 - "tape/index.ts"
Cohesion: 0.04
Nodes (93): Failure, Variant, Link, TapeBuilder, TapeBuilderOptions, RecordingError, RecordingProblem, TapeError (+85 more)

### Community 91 - "module-tables.ts"
Cohesion: 0.11
Nodes (27): CaptureColumn, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ColumnType, RefusalCode (+19 more)

### Community 94 - "core-ledger-state.ts"
Cohesion: 0.09
Nodes (33): BlockLedgerSource, LedgerBinding, blockHeaderOf(), ledgerVersionOf(), writeBlockRow(), applyBlock(), bytesOf(), contractsOf() (+25 more)

### Community 95 - "browser.test.ts"
Cohesion: 0.08
Nodes (35): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, PageRequest, continuedProblems() (+27 more)

### Community 96 - "release-version.ts"
Cohesion: 0.12
Nodes (35): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+27 more)

### Community 99 - "messages.ts"
Cohesion: 0.08
Nodes (30): Committed, MessageFault, MessageType, Parsed, bytesOf(), decodeParameter(), decodeValue(), elementType() (+22 more)

### Community 169 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.13
Nodes (14): 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions, 6. Migration (`002_checkpoint_store.ts`), 7. Error translation — no additions to `src/postgres/errors.ts`, 8. Composing Transaction/Lease (Sprint 2 dependency), 9. Test infrastructure (+6 more)

### Community 254 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 74 - "2. Points"
Cohesion: 0.06
Nodes (39): refused(), cursorRead(), following(), A backup at the core's stop, A backup of a running process (SIGUSR2), A paused loop on `/status`, A private process and a changed public configuration, Backups (+31 more)

### Community 108 - "table"
Cohesion: 0.06
Nodes (33): table(), ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+25 more)

### Community 135 - "T"
Cohesion: 0.09
Nodes (24): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get` (+16 more)

### Community 138 - "boundary.test.ts"
Cohesion: 0.17
Nodes (21): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+13 more)

### Community 141 - ".boolean"
Cohesion: 0.09
Nodes (21): 4.1 Column types, 4.2 Rules, 4.3 Data that is not a function of the chain: `deterministic: false`, 4. Deterministic PostgreSQL, 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order (+13 more)

### Community 142 - "UmbraDB"
Cohesion: 0.09
Nodes (23): text(), transportReader(), A PGlite directory that does not exist, Checking a configuration against its database, The database, The transport reader, TLS to PostgreSQL: `ssl`, Backup and restore (+15 more)

### Community 162 - "core-ledger-state.test.ts"
Cohesion: 0.13
Nodes (11): boundLedgerParser(), bindCoreLedgerState(), itemsOf(), writeBlock(), applied(), bound(), query(), refusing() (+3 more)

### Community 174 - ".slowBlockMs"
Cohesion: 0.17
Nodes (13): 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix, 00043 — slow-block-outside.negative-control.test.ts's 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+5 more)

### Community 179 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 182 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (12): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+4 more)

### Community 183 - "fault"
Cohesion: 0.14
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 185 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 198 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 200 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 204 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 206 - "scoped-review-manifest"
Cohesion: 0.20
Nodes (10): explain(), explainRefusal(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation (+2 more)

### Community 221 - "height-partitions.ts"
Cohesion: 0.22
Nodes (7): heightPartitionsSql(), HEIGHT_PARTITION_SIZE, PRECREATED_HEIGHT_PARTITIONS, 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 223 - "h"
Cohesion: 0.22
Nodes (8): h(), 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers, 5. L1 model sketch

### Community 228 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 233 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.29
Nodes (7): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 237 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 269 - "ref_node_worker_threads"
Cohesion: 0.40
Nodes (4): hex(), requested, store, stored

### Community 270 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 309 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 42 - "version"
Cohesion: 0.03
Nodes (67): hexBytes(), side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules (+59 more)

### Community 47 - ".put"
Cohesion: 0.04
Nodes (56): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+48 more)

### Community 50 - "history"
Cohesion: 0.04
Nodes (58): history(), n(), 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips (+50 more)

### Community 62 - "code"
Cohesion: 0.04
Nodes (50): code(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log, The five stages (+42 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 93 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Requirement: RN-1 The main program is a fixed sequence of points (+27 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+19 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 129 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.07
Nodes (26): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 2.1 Where the probe runs (the one real design decision), 2.2 The three durability settings (+18 more)

### Community 130 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 140 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 148 - "package.json"
Cohesion: 0.09
Nodes (21): bugs, url, description, exports, files, homepage, license, main (+13 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 159 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.11
Nodes (14): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict, 0.10.0: the core architecture (`openspec/changes/core-arch`) (+6 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+9 more)

### Community 161 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 165 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 170 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 171 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 184 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 187 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 189 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 190 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 193 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 196 - "README.md"
Cohesion: 0.26
Nodes (4): Choosing a database, Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 197 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 199 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 202 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 203 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 205 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 207 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 209 - "ADDED Requirements"
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

### Community 215 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 216 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 217 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 218 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 220 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 222 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 224 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 225 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 226 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 229 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 230 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 231 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 232 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 234 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 235 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 236 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 238 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 239 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 240 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 241 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 242 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 243 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 244 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 246 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 251 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 252 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 253 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 255 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.33
Nodes (5): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Problem, Resolution, Suggested fix

### Community 256 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 257 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 258 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 259 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 260 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

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

### Community 271 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 272 - "Building from source"
Cohesion: 0.40
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 273 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 274 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 275 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 276 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 277 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 278 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 279 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 280 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 281 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 282 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 283 - "00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask"
Cohesion: 0.40
Nodes (4): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix

### Community 284 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 285 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 286 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.40
Nodes (4): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Suggested fix

### Community 287 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 288 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 289 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 290 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 291 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 292 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 293 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 294 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 295 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 296 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 297 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 298 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 299 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 300 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.50
Nodes (3): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Problem, Suggested fix

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

### Community 306 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.50
Nodes (4): Requirement: RN-13 SIGTERM stops cleanly, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable, Scenario: SIGTERM while the loop waits on an unreachable node

### Community 307 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 308 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 313 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 314 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 75 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 90 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3753 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `admin-harness.ts`, `InMemoryBlockSource`, `FinalizedLoop`, `declaration.ts`, `client.test.ts`, `api-server.test.ts`, `adapter-fixtures.ts`, `NodeClient`, `runner/process.ts`, `tape/index.ts`, `db/api.ts`, `config/history.ts`, `ledger-storage.test.ts`, `loop.test.ts`, `host.ts`, `ingest-harness.ts`, `core-private-source.test.ts`, `fetch-fixtures.ts`, `core-block-commit.test.ts`, `migrate.ts`, `UmbraError`, `adapter.ts`, `src/db/postgres.ts`, `config-check.ts`, `ledger/types.ts`, `roles.ts`, `node-format.ts`, `core-transport.ts`, `signal-ignored-fixtures.ts`, `backup-fixtures.ts`, `ReadHandle`, `database-parts.ts`, `validate.ts`, `process-worker.ts`, `ledger/ledger-tasks.test.ts`, `paused-harness.ts`, `.from`, `backup/restore.ts`, `slow-block-harness.ts`, `private/backends.ts`, `admin/configuration.ts`, `chain-placement.test.ts`, `mapping.ts`, `transport.test.ts`, `Transaction`, `version-checks.ts`, `Process`, `builds.ts`, `write-handles.test.ts`, `DatabaseParts`, `column-refusals.test.ts`, `networks.ts`, `transform-checks.ts`, `config/plain-data.ts`, `spawnChild`, `sweep-tapes.ts`, `column-rules.test.ts`, `postgres/transaction-history-storage.ts`, `file-mode.test.ts`, `redact.ts`, `retirement.test.ts`, `encodeRow`, `cold-boot-recovery.integration.test.ts`, `test/postgres/setup.ts`, `pack-install.mjs`, `.#ended`, `real-tapes.ts`, `db/errors.ts`, `module-tables.ts`, `core-ledger-state.ts`, `browser.test.ts`, `release-version.ts`, `messages.ts`, `core.ts`, `zero-timeouts-checks.ts`, `lockstep-refusals.test.ts`, `browser/build.ts`, `core-chain-events.ts`, `documents.ts`, `code-registry.ts`, `pg-tx-history-adapter.ts`, `Lockstep`, `read-gate.ts`, `ledger-units.test.ts`, `node-bridge.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `restore-private.ts`, `height-versioned.property.test.ts`, `boundary.test.ts`, `cbor.property.test.ts`, `block-fetch-decode.test.ts`, `cli-fixtures.ts`, `example-checks.ts`, `type-check.ts`, `package.json`, `ledger-sweep.test.ts`, `key-handling-checks.ts`, `excluded-not-exported.test.ts`, `net.test.ts`, `core-ledger-state.test.ts`, `retention.ts`, `sweep.ts`, `read-height.property.test.ts`, `ws-mutual-tls.test.ts`, `signal-backup.test.ts`, `cursor-table.property.test.ts`, `mutation-per-adapter.mjs`, `web-lock.ts`, `twox.ts`, `worker-threads.test.ts`, `history.property.test.ts`, `component-table.test.ts`, `transport-intake.test.ts`, `builder.negative-control.test.ts`?**
  _High betweenness centrality (0.246) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01718734202810636 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `admin-harness.ts`, `InMemoryBlockSource`, `FinalizedLoop`, `declaration.ts`, `client.test.ts`, `api-server.test.ts`, `adapter-fixtures.ts`, `NodeClient`, `runner/process.ts`, `tape/index.ts`, `db/api.ts`, `config/history.ts`, `loop.test.ts`, `host.ts`, `ingest-harness.ts`, `core-private-source.test.ts`, `core-block-commit.test.ts`, `migrate.ts`, `src/db/postgres.ts`, `config-check.ts`, `ledger/types.ts`, `roles.ts`, `core-transport.ts`, `backup-fixtures.ts`, `ReadHandle`, `database-parts.ts`, `validate.ts`, `process-worker.ts`, `core-ledger-state.test.ts`, `ledger/ledger-tasks.test.ts`, `paused-harness.ts`, `backup/restore.ts`, `slow-block-harness.ts`, `private/backends.ts`, `admin/configuration.ts`, `chain-placement.test.ts`, `mapping.ts`, `transport.test.ts`, `checkShape`, `Transaction`, `client.ts`, `version-checks.ts`, `Process`, `web-lock.ts`, `write-handles.test.ts`, `DatabaseParts`, `NodeBlockSource`, `networks.ts`, `transform-checks.ts`, `config/plain-data.ts`, `code`, `redact.ts`, `graph.ts`, `cbor.ts`, `2. Points`, `catalog.ts`, `encodeRow`, `PgliteDatabase`, `.#ended`, `node-source.ts`, `db/errors.ts`, `module-tables.ts`, `core-ledger-state.ts`, `zero-timeouts-checks.ts`, `lockstep-refusals.test.ts`, `Buffer`, `config/database.ts`, `ledger-units.test.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `InMemoryBlockSource` be split into smaller, more focused modules?**
  _Cohesion score 0.018770898189784387 - nodes in this community are weakly interconnected._