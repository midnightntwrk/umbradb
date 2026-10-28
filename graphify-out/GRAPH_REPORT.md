# Graph Report - UmbraDB

## Corpus Check
- 1025 files · ~1,470,169 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10947 nodes · 33051 edges · 332 communities (301 shown, 31 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2557 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `6a8f3d695c0d6d99` (1025 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- InMemoryBlockSource
- loop.ts
- api-server.test.ts
- restore-private.ts
- postgres/transaction-history-storage.ts
- dispatch.ts
- code-registry.ts
- transforms.ts
- Lockstep
- test/postgres/setup.ts
- interfaces/transaction-history-storage.ts
- digest.test.ts
- client.test.ts
- PrivateTransport
- documents.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- node/socket.ts
- read-gate.ts
- .concat
- ReadHandle
- threat-model.test.ts
- pglite-lock.ts
- PortSocket
- declaration.ts
- transaction-history-storage.property.test.ts
- node-bridge.ts
- HeightRun
- shims.test.ts
- ledger-table-config.test.ts
- fixtures/configuration.ts
- config-check.ts
- intake.test.ts
- chrome.ts
- InMemoryTransactionHistoryStorage
- call
- host.ts
- ledger-checks.ts
- LoopPauses
- browser-harness.ts
- ws-mutual-tls.test.ts
- backup/restore.ts
- failures.ts
- read-height.property.test.ts
- Design — Sprint 1: project setup + TemporalKV
- checkShape
- web-lock.ts
- NodeClient
- .#close
- no-indexer-or-wallet-sdk.test.ts
- worker-threads.test.ts
- core-private-source.test.ts
- chain-events-source.test.ts
- tapes.ts
- history.property.test.ts
- worker-threads-worker.ts
- buffer.ts
- Worker
- tape/index.ts
- configuration-refusal.ts
- .send
- TapeAnswers
- ledger/plain-data.test.ts
- UmbraError
- runner/process.ts
- process-worker.ts
- RuntimeMetadata
- ProcessItems
- ingest-crash.worker.ts
- stats.ts
- module-tables.ts
- .name
- 5. Runner
- mutation-evidence.d.mts
- migrate.ts
- AsyncLocalStorage
- src/db/postgres.ts
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- contract-data-checks.ts
- pageBench
- runtime-metadata.test.ts
- LedgerPackage
- private/backends.ts
- ledger-storage.test.ts
- .from
- https.ts
- NodeFS
- core-transport.ts
- opt-out.test.ts
- node-format.ts
- fetch-fixtures.ts
- pglite.ts
- range.ts
- core-block-parsed.ts
- validate.ts
- lockstep-refusals.test.ts
- admin-harness.ts
- contract-modules.test.ts
- ledger/types.ts
- real-tapes.ts
- core-ledger-state.ts
- binding.test.ts
- column-rules.ts
- builder.test.ts
- ledger-sweep.test.ts
- slow-block-harness.ts
- ref_node_fs
- config/plain-data.ts
- FinalizedLoop
- loop-stop-harness.ts
- NodeBlockSource
- column-rules.test.ts
- PgliteDatabase
- cbor.ts
- .value
- graph.ts
- adapter-fixtures.ts
- chain-events-decode.test.ts
- mapping.ts
- node-source.ts
- boundary.test.ts
- retirement.test.ts
- file-mode.test.ts
- PgTransactionHistoryStorage
- config/history.ts
- core-settings.ts
- config-hash-checks.ts
- paused-harness.ts
- zero-timeouts-checks.ts
- networks.ts
- vitest
- net.test.ts
- page.ts
- version-checks.ts
- browser/build.ts
- pg-tx-history-adapter.ts
- mutation-per-adapter.mjs
- cbor.property.test.ts
- browser.test.ts
- TransactionHistoryStorage
- ModuleDeclaration
- release-version.test.ts
- order.property.test.ts
- node-fields-harness.ts
- Process
- Proposal — Sprint 3: CheckpointStore
- Problem
- refused
- table
- .slowBlockMs
- Design — v1.0.0 API Surface & Release Contract
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- .boolean
- code
- twox.ts
- migrations
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- scoped-review-manifest
- path.ts
- schemaName
- midnight-env — reproducible PREPROD dev environment
- selectLedgerVersion
- effectiveLedgerTable
- outageRun
- orphan-watcher.mjs
- crash-worker.ts
- history
- .put
- version
- T
- graph.py
- cold-boot-recovery.integration.test.ts
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Midnight Foundation Security Policy
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- stryker.conf.json
- Boundaries, threats and controls
- ADDED Requirements
- ADDED Requirements
- devDependencies
- scripts
- Requirement: BK-1 Backup
- Roadmap
- ADDED Requirements
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- UmbraDB
- compilerOptions
- ADDED Requirements
- Design — Sprint 4: Watermarks
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- Backups
- UmbraDB software supply-chain directory
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Tasks — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- ADDED Requirements
- Tasks — Sprint 7: Transaction History Storage
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0-infosec-signoff
- Contributing
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Repository agent policy
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Changelog
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- The laws of UmbraDB's storage helpers
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0 API Surface & Release Contract
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
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00023 — The blocks table's height partitions end at 5,000,000
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00026 — A configuration's `core` revisions may name different networks
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
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
- Requirement: RN-16 Chain-data reads name their view and height
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
- repository
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bin
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
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 348 edges
2. `UmbraError` - 306 edges
3. `ModuleDeclaration` - 174 edges
4. `FinalizedLoop` - 131 edges
5. `InMemoryBlockSource` - 116 edges
6. `NodeClient` - 113 edges
7. `Database` - 97 edges
8. `BlockRef` - 94 edges
9. `ReadHandle` - 85 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (332 total, 31 thin omitted)

### Community 0 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (196): BlockHeader, ProcessReason, InMemoryBlockSource, InMemoryItems, Wait, ProcessHandle, ProcessingEnd, ProcessStatus (+188 more)

### Community 1 - "loop.ts"
Cohesion: 0.02
Nodes (176): QueuedBlock, Transaction, PointName, EntryRange, GraphInput, HeightRange, BlockItems, LateUse (+168 more)

### Community 10 - "api-server.test.ts"
Cohesion: 0.03
Nodes (103): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ModuleTableOptions, ApiRegistry, Connection, HeadersArgument (+95 more)

### Community 100 - "restore-private.ts"
Cohesion: 0.14
Nodes (24): BackupDatabase, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, pgliteBackend() (+16 more)

### Community 101 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+11 more)

### Community 102 - "dispatch.ts"
Cohesion: 0.15
Nodes (22): Callback, EntryBoundary, ParallelPoint, PointSchedule, CoreStopsFirst, boundaryModules(), dispatch(), entryIdOf() (+14 more)

### Community 103 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 104 - "transforms.ts"
Cohesion: 0.21
Nodes (27): TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, checkTape(), liveSubscriptions(), notificationLines() (+19 more)

### Community 105 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 106 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 107 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 109 - "digest.test.ts"
Cohesion: 0.11
Nodes (25): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+17 more)

### Community 11 - "client.test.ts"
Cohesion: 0.02
Nodes (71): NodeClientOptions, NodeRetry, HandSocket, HandSockets, Answer, FakeNode, Handler, Received (+63 more)

### Community 110 - "PrivateTransport"
Cohesion: 0.14
Nodes (8): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), unrefTimer()

### Community 111 - "documents.ts"
Cohesion: 0.12
Nodes (26): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+18 more)

### Community 113 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 114 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 115 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 116 - "node/socket.ts"
Cohesion: 0.11
Nodes (16): Connection, NodeSocket, NodeSocketEvents, NodeTimers, connectWebSocket(), "on-compute"(), DEFAULT_HEARTBEAT_MS, DEFAULT_HEARTBEAT_MS (+8 more)

### Community 118 - "read-gate.ts"
Cohesion: 0.15
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 119 - ".concat"
Cohesion: 0.10
Nodes (14): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+6 more)

### Community 12 - "ReadHandle"
Cohesion: 0.02
Nodes (92): BlockWriteHandle, ReadHandle, OwnPart, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+84 more)

### Community 121 - "threat-model.test.ts"
Cohesion: 0.14
Nodes (23): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+15 more)

### Community 123 - "pglite-lock.ts"
Cohesion: 0.15
Nodes (19): Held, PgliteLockUse, Job, acquirePgliteLock(), createPgliteDirectory(), directoryPath(), lockHeld(), openFailed() (+11 more)

### Community 128 - "PortSocket"
Cohesion: 0.13
Nodes (8): Emitter, PortSocket, WebSocketServer, 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix, Contract states and contract logs

### Community 13 - "declaration.ts"
Cohesion: 0.03
Nodes (105): adminRoutes, AdminEndpoint, AdminPart, ReadinessFacts, privateIntake, CommandBuildOptions, coreEntry, DefinedModule (+97 more)

### Community 130 - "transaction-history-storage.property.test.ts"
Cohesion: 0.10
Nodes (18): EntryContent, Command, ReplayableStorage, isPlainObject(), mergeSections(), applyCommand(), replay(), arbitraryCommand (+10 more)

### Community 131 - "node-bridge.ts"
Cohesion: 0.14
Nodes (17): Thread, BridgeServer, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 132 - "HeightRun"
Cohesion: 0.10
Nodes (9): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, WaitsInTransaction (+1 more)

### Community 133 - "shims.test.ts"
Cohesion: 0.15
Nodes (9): databaseTarget, Buffer, Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL (+1 more)

### Community 136 - "ledger-table-config.test.ts"
Cohesion: 0.20
Nodes (19): Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts() (+11 more)

### Community 138 - "fixtures/configuration.ts"
Cohesion: 0.14
Nodes (16): BrowserConfiguration, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration(), param(), privateConfiguration() (+8 more)

### Community 14 - "config-check.ts"
Cohesion: 0.03
Nodes (100): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName (+92 more)

### Community 142 - "intake.test.ts"
Cohesion: 0.19
Nodes (11): PrivateSeen, A114Observation, A116Observation, TestLink, a114Problems(), a114Run(), a116Problems(), heights() (+3 more)

### Community 143 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 144 - "InMemoryTransactionHistoryStorage"
Cohesion: 0.16
Nodes (7): MergeEntriesFn, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 146 - "call"
Cohesion: 0.15
Nodes (5): Activity, call(), isBlock(), sameBytes(), tracked()

### Community 15 - "host.ts"
Cohesion: 0.03
Nodes (85): LoadLedger, TransactionParser, LedgerName, ChainOutcome, ParsedTransaction, AppliedState, ApplyBlock, BlockId (+77 more)

### Community 151 - "ledger-checks.ts"
Cohesion: 0.24
Nodes (18): LedgerEvent, TransactionResult, VmLog, ledgerItemsSeen, a106Problems(), a107Problems(), a99Problems(), blockZeroProblems() (+10 more)

### Community 152 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 154 - "browser-harness.ts"
Cohesion: 0.27
Nodes (16): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+8 more)

### Community 155 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (12): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+4 more)

### Community 16 - "backup/restore.ts"
Cohesion: 0.04
Nodes (104): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+96 more)

### Community 161 - "failures.ts"
Cohesion: 0.15
Nodes (11): ReasonCode, Unwrapped, UnexpectedCursor, isListenFailure(), retryOf(), unwrap(), HALT_CODES, NAMED (+3 more)

### Community 162 - "read-height.property.test.ts"
Cohesion: 0.17
Nodes (11): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+3 more)

### Community 163 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 166 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 168 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 17 - "NodeClient"
Cohesion: 0.05
Nodes (68): CoreChainBinding, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter, NodeBlock (+60 more)

### Community 170 - ".#close"
Cohesion: 0.18
Nodes (3): CoreTransport, SignalTarget, publicLockstepOf()

### Community 173 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 174 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 18 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (63): ConfiguredGenesis, PrivateBlockSource, PrivateChecks, PrivateShared, PrivateSourceOptions, SourceTransport, PublicConfiguration, PublicDatabase (+55 more)

### Community 180 - "chain-events-source.test.ts"
Cohesion: 0.21
Nodes (6): NodeCallOptions, RecordingClient, open(), quiet(), chain, closing

### Community 181 - "tapes.ts"
Cohesion: 0.28
Nodes (11): EventSpec, browserChain, Broken, at(), continueSession(), headSession(), height(), restoreSession() (+3 more)

### Community 182 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 184 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 185 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 19 - "tape/index.ts"
Cohesion: 0.05
Nodes (69): Recorded, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError (+61 more)

### Community 190 - "configuration-refusal.ts"
Cohesion: 0.35
Nodes (9): ConfigFinding, configurationRefused(), findingText(), refusalFindings(), configurationFindings(), configurationRefusalLines(), isConfigurationRefusal(), messageOf() (+1 more)

### Community 192 - "TapeAnswers"
Cohesion: 0.32
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 198 - "ledger/plain-data.test.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 2 - "UmbraError"
Cohesion: 0.02
Nodes (148): LoadedConfig, LoadOptions, PostgresOptions, Bound, Database, ReadOnlyDatabase, ReadOptions, SchemaWriteHandle (+140 more)

### Community 20 - "runner/process.ts"
Cohesion: 0.03
Nodes (60): BlockHeaderItem, BodyExtrinsic, BlockItemSource, CoreBlockHeader, ChainCheck, ChainCheckInput, ChainSource, CoreChainFacts (+52 more)

### Community 21 - "process-worker.ts"
Cohesion: 0.04
Nodes (83): BrowserRun, PrivateInstance, ConfiguredDatabase, ConfiguredDatabaseOptions, Scope, crossedError, StartRun, ToProcessWorker (+75 more)

### Community 211 - "RuntimeMetadata"
Cohesion: 0.27
Nodes (3): RuntimeMetadata, contentStateOf(), hexOf()

### Community 213 - "ingest-crash.worker.ts"
Cohesion: 0.24
Nodes (9): CrashEvent, CrashJob, report(), tipWriter(), fenceAt(), handle, job, orphanGuard (+1 more)

### Community 214 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 22 - "module-tables.ts"
Cohesion: 0.04
Nodes (71): CaptureColumn, CheckedMigration, ModuleColumn, ModuleContentsError, ModuleTable, PageOptions, CatalogTable, ConsistentRead (+63 more)

### Community 23 - "5. Runner"
Cohesion: 0.03
Nodes (77): AppliedMigration, StartupInput, SchemaPlan, Revision, ResolvedGraph, MisuseListener, MisuseReports, ProcessContexts (+69 more)

### Community 239 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 24 - "migrate.ts"
Cohesion: 0.04
Nodes (83): CapturedTable, CaptureState, AppliedRow, Runnable, Settling, MultiStatementRunner, GuardTableRow, CheckFunctionsOptions (+75 more)

### Community 25 - "src/db/postgres.ts"
Cohesion: 0.04
Nodes (83): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, DriverError, Outcome, PostgresOptions, Role (+75 more)

### Community 250 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 26 - "contract-data-checks.ts"
Cohesion: 0.04
Nodes (90): ContractStateRow, CoreContractStatesOptions, CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+82 more)

### Community 267 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 27 - "runtime-metadata.test.ts"
Cohesion: 0.03
Nodes (57): ConnectSocket, Boundary, Outage, FoundTape, Script, ScriptedNode, ScriptedRequest, Step (+49 more)

### Community 28 - "LedgerPackage"
Cohesion: 0.05
Nodes (51): RetainedState, LedgerEventKind, LedgerPackage, LedgerTask, LedgerTaskBlock, NodeStore, StateHandle, EngineOptions (+43 more)

### Community 29 - "private/backends.ts"
Cohesion: 0.05
Nodes (61): Message, PrivateBackend, SessionSeen, PublicCore, TestCertificates, InstanceHashes, OptedOutObservation, Refusal (+53 more)

### Community 3 - "ledger-storage.test.ts"
Cohesion: 0.03
Nodes (184): BlockParsed, CoreLedgerStateOptions, GreyPicker, Restored, itemsSeen, BlockSpec, Json, Scenario (+176 more)

### Community 30 - ".from"
Cohesion: 0.04
Nodes (72): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+64 more)

### Community 31 - "core-transport.ts"
Cohesion: 0.04
Nodes (80): Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, MessageFault, MessageType (+72 more)

### Community 32 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (81): ProcessContext, DeclarationRule, Chain, DigestRow, Op, States, TableName, Case (+73 more)

### Community 33 - "node-format.ts"
Cohesion: 0.05
Nodes (59): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+51 more)

### Community 34 - "fetch-fixtures.ts"
Cohesion: 0.05
Nodes (79): ProcessCondition, ArgType, BlockOptions, CallSpec, chainBlock, PalletSpec, RUNTIME, Decoded (+71 more)

### Community 35 - "pglite.ts"
Cohesion: 0.04
Nodes (56): Job, Outcome, ServerErrorFields, CheckTarget, CliBackend, Snapshot, LoadOutcome, OutsideRead (+48 more)

### Community 36 - "range.ts"
Cohesion: 0.04
Nodes (66): Refusal, BoundaryBlockReading, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command (+58 more)

### Community 37 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (75): BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsedOptions, ChainTransaction, ChainEvent, EventPhase, RecordTypes (+67 more)

### Community 38 - "validate.ts"
Cohesion: 0.05
Nodes (70): ConfigRule, CursorRule, EntryRef, Finding, Issue, Plain, SettingsSchema, CursorRow (+62 more)

### Community 39 - "lockstep-refusals.test.ts"
Cohesion: 0.06
Nodes (65): LockstepCondition, PrivateProcess, Pause, Q142Observation, A118Observation, MismatchObservation, ExpectedWait, WaitSample (+57 more)

### Community 4 - "admin-harness.ts"
Cohesion: 0.02
Nodes (158): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer, AdminSnapshot (+150 more)

### Community 40 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (61): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+53 more)

### Community 41 - "ledger/types.ts"
Cohesion: 0.06
Nodes (56): ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerPackageOptions, V9Logs, LedgerPin (+48 more)

### Community 42 - "real-tapes.ts"
Cohesion: 0.05
Nodes (55): Metadata, Step, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+47 more)

### Community 43 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (60): LedgerBinding, LedgerStateItem, retainedStates, CoreRevision, ContractKeys, blockHeaderOf(), ledgerVersionOf(), writeBlockRow() (+52 more)

### Community 45 - "binding.test.ts"
Cohesion: 0.05
Nodes (57): PrivateIntakeOptions, startHashDecision, StartHashes, builtInNetwork, A165Options, a165Run, Attempt, TestDatabase (+49 more)

### Community 46 - "column-rules.ts"
Cohesion: 0.04
Nodes (69): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+61 more)

### Community 47 - "builder.test.ts"
Cohesion: 0.05
Nodes (31): ConnectionFrames, Failure, Variant, WrongRecording, Frame, RawClient, Failure, Variant (+23 more)

### Community 48 - "ledger-sweep.test.ts"
Cohesion: 0.06
Nodes (32): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, ChildReader, NodeBatch, Block (+24 more)

### Community 49 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (52): LoopInput, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+44 more)

### Community 5 - "ref_node_fs"
Cohesion: 0.03
Nodes (128): BackupBackend, killedRestore, TickerConfig, BackupOnSignal, LoopClass, Pausable, PausableConfig, RecorderGlobals (+120 more)

### Community 50 - "config/plain-data.ts"
Cohesion: 0.05
Nodes (45): LoadOptions, PlainArray, PlainDataNode, PlainDataRule, Walk, SignalJob, Row, Finding (+37 more)

### Community 51 - "FinalizedLoop"
Cohesion: 0.06
Nodes (16): FinalizedLoop, LoopObserver, Startup, SkipsLockstep, WaitingInRead, ItemsAfterWrite, SilentHalt, FailingAfter (+8 more)

### Community 52 - "loop-stop-harness.ts"
Cohesion: 0.07
Nodes (43): SourceShared, A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation (+35 more)

### Community 53 - "NodeBlockSource"
Cohesion: 0.08
Nodes (13): HeadWait, NodeBlockSource, NodeHeader, PreparedBlock, QueueRunner, EventsRunner, NoWindow, Refetches (+5 more)

### Community 54 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TreeNode, DesignTable, becauseOf() (+24 more)

### Community 55 - "PgliteDatabase"
Cohesion: 0.07
Nodes (14): JobQueue, PgliteDatabase, BoundedRead, ReadPool, Session, Writer, commitRolledBack(), handleClosed() (+6 more)

### Community 56 - "cbor.ts"
Cohesion: 0.08
Nodes (45): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+37 more)

### Community 57 - ".value"
Cohesion: 0.11
Nodes (31): MetadataField, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef, ScaleError, ScaleReader (+23 more)

### Community 58 - "graph.ts"
Cohesion: 0.07
Nodes (49): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+41 more)

### Community 6 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (127): ApplyInput, ApplyOutput, StateSummary, StoredNode, LedgerHeight, Upstream, contractFixture, Ledger (+119 more)

### Community 60 - "chain-events-decode.test.ts"
Cohesion: 0.10
Nodes (39): eventsRuntime, Field, PalletMetadata, Registry, RuntimeShape, StorageSpec, LedgerScenarioOptions, fill() (+31 more)

### Community 61 - "mapping.ts"
Cohesion: 0.07
Nodes (37): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+29 more)

### Community 62 - "node-source.ts"
Cohesion: 0.06
Nodes (35): BlockEventSource, ExtrinsicCall, CoreBlockItems, BlockLedgerSource, MetadataPallet, NodeSourceOptions, Prefetch, NodeSubscription (+27 more)

### Community 63 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+34 more)

### Community 64 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 65 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (31): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+23 more)

### Community 66 - "PgTransactionHistoryStorage"
Cohesion: 0.08
Nodes (33): TransactionHistoryEntry, PgTransactionHistoryStorage, rowToEntry(), referenceMergeEntries(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 5. WalletState envelope (+25 more)

### Community 7 - "config/history.ts"
Cohesion: 0.03
Nodes (132): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder (+124 more)

### Community 70 - "core-settings.ts"
Cohesion: 0.06
Nodes (38): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, Absent, DeepReadonly, PrivateKeys, PrivateOnly (+30 more)

### Community 72 - "config-hash-checks.ts"
Cohesion: 0.07
Nodes (22): Report, A162Options, a162Run, HeaderSeen, HeldLink, HoldingRelay, ReportRelay, RetargetProxy (+14 more)

### Community 74 - "paused-harness.ts"
Cohesion: 0.11
Nodes (31): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, a176Project() (+23 more)

### Community 77 - "zero-timeouts-checks.ts"
Cohesion: 0.10
Nodes (30): Settings, Outcome, openBlockWrites(), commitHeight(), block(), asModule(), count(), expectCrossSchemaWriteRejected() (+22 more)

### Community 79 - "networks.ts"
Cohesion: 0.07
Nodes (33): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, LedgerTableIssue (+25 more)

### Community 8 - "vitest"
Cohesion: 0.02
Nodes (111): BenchEnv, ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts (+103 more)

### Community 80 - "net.test.ts"
Cohesion: 0.09
Nodes (20): NetworkBroker, IncomingMessage, Server, NetworkMessage, Frame, Listener, PortUpgrade, RawData (+12 more)

### Community 81 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 82 - "version-checks.ts"
Cohesion: 0.10
Nodes (24): MetadataBlock, MetadataNode, RuntimeMetadataEntry, VersionedBlock, OwnStateMetadata, CallRecord, CountingNode, MetadataSelector (+16 more)

### Community 83 - "browser/build.ts"
Cohesion: 0.08
Nodes (27): BrowserBuildOptions, BrowserControl, CheckedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+19 more)

### Community 84 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (25): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue() (+17 more)

### Community 85 - "mutation-per-adapter.mjs"
Cohesion: 0.07
Nodes (27): Leftover, RemovedName, gateAdapters(), tallyMutants(), described(), keyLeftovers(), leftoversIn(), scannedFiles() (+19 more)

### Community 86 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 87 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 88 - "TransactionHistoryStorage"
Cohesion: 0.07
Nodes (32): TransactionHistoryStorage, reason(), [0.9.5] - 2026-07-25 — "Penumbra", Added, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import (+24 more)

### Community 9 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (123): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+115 more)

### Community 92 - "release-version.test.ts"
Cohesion: 0.11
Nodes (33): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+25 more)

### Community 94 - "order.property.test.ts"
Cohesion: 0.09
Nodes (31): CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce(), checkParallelWaits() (+23 more)

### Community 95 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (25): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+17 more)

### Community 98 - "Process"
Cohesion: 0.14
Nodes (5): PauseHold, Process, messageOf(), nodeClientClosed(), nodeSignals()

### Community 225 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 248 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 122 - "refused"
Cohesion: 0.09
Nodes (23): refused(), clock(), When a callback fails, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Scenario: A fault of the build's declarations ends the process, Scenario: A paused loop, Scenario: A refused configuration ends the process (+15 more)

### Community 129 - "table"
Cohesion: 0.09
Nodes (23): table(), Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Private modules, Reading through `db`, Running a module with the `umbradb` command (+15 more)

### Community 139 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 140 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.10
Nodes (19): up(), name, 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.1 The barrel: `src/index.ts`, 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG (+11 more)

### Community 147 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (16): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+8 more)

### Community 148 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 150 - "code"
Cohesion: 0.13
Nodes (18): code(), Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in) (+10 more)

### Community 172 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 175 - "migrations"
Cohesion: 0.15
Nodes (12): migrations(), Migrations, Requirement: DB-9 Bootstrap, migrations and setup, Scenario: A changed migration refuses startup, Scenario: The second of two migrations fails, 6. Storage helpers, Impact, Non-goals (explicitly out of scope for this sprint) (+4 more)

### Community 187 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 195 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 200 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 221 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 224 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.29
Nodes (7): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 240 - "selectLedgerVersion"
Cohesion: 0.52
Nodes (7): blockNamed(), checkPins(), hexOf(), isMnsvItem(), ledgerOfSpecVersion(), mnsvSpecVersion(), selectLedgerVersion()

### Community 241 - "effectiveLedgerTable"
Cohesion: 0.33
Nodes (7): covers(), effectiveLedgerTable(), freezePin(), freezeRow(), ledgerTableIssues(), uncovered(), wellFormed()

### Community 242 - "outageRun"
Cohesion: 0.38
Nodes (5): outageRun(), retriesIn(), sampledClient(), status, status

### Community 264 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 305 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 44 - "history"
Cohesion: 0.04
Nodes (66): integer(), history(), n(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()` (+58 more)

### Community 59 - ".put"
Cohesion: 0.04
Nodes (46): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+38 more)

### Community 67 - "version"
Cohesion: 0.05
Nodes (43): version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5) (+35 more)

### Community 71 - "T"
Cohesion: 0.05
Nodes (41): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+33 more)

### Community 78 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 99 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.13
Nodes (19): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), registerSuiteLifecycle(), startTestDatabase(), registerSuiteLifecycle(), startTestDatabase() (+11 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 120 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 126 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 127 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 134 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 135 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 137 - "Midnight Foundation Security Policy"
Cohesion: 0.10
Nodes (10): Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes (+2 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 145 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 153 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 156 - "Boundaries, threats and controls"
Cohesion: 0.12
Nodes (17): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process, 9. Browser origin → page, workers and storage (+9 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+8 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 159 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 160 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 164 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 165 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 169 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 176 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 177 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 179 - "UmbraDB"
Cohesion: 0.15
Nodes (13): Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security, Status (+5 more)

### Community 183 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 189 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 2. `set`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 193 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 194 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 196 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 197 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 199 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 201 - "Backups"
Cohesion: 0.20
Nodes (10): A backup at the core's stop, A backup of a running process (SIGUSR2), A paused loop on `/status`, A private process and a changed public configuration, Backups, Restoring a backup, The database, UmbraDB operator guide (+2 more)

### Community 202 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 203 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 204 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 206 - "Tasks — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 1. Pre-freeze: retryability field (G3), 2. Pre-freeze: strip / mark-experimental the chain-archive error classes (G3), 3. The freeze: build + package.json (G1), 4. The freeze: the public barrel (G1), 5. Release contract docs (G2, G4), 6. Freeze the Lean cut-line (G20), 7. Packed-tarball install smoke test (G1), 8. Change close-out (+1 more)

### Community 207 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 208 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 209 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 210 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 215 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.22
Nodes (8): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Problem, Suggested fix, Suggested fix

### Community 216 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 217 - "Tasks — Sprint 7: Transaction History Storage"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest, 3. PgTransactionHistoryStorage implementation, 4. WalletState envelope, 5. Storage-swappable conformance harness (Pg-only tier — required merge gate), 6. Live-sync tier (nightly/labeled — blocked on design.md §7's open question), 7. Close-out, Tasks — Sprint 7: Transaction History Storage

### Community 218 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 2. Envelope module (Pg-only — required gate), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 219 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 223 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 226 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 227 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 228 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 229 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 230 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 231 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 232 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 233 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 234 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 235 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 236 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 237 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 238 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 244 - "Changelog"
Cohesion: 0.33
Nodes (5): [0.10.0] - 2026-10-27, Added, Breaking changes, Changelog, [Unreleased]

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

### Community 251 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 252 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.33
Nodes (6): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers

### Community 253 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 254 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

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

### Community 259 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, What changes — the 1.0.0 gate items this change addresses, Why

### Community 260 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 261 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 262 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 263 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 265 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 266 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 268 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 269 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 270 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 271 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 272 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 273 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 274 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 275 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 276 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 277 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 278 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 279 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 280 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 281 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 282 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 283 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 284 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.40
Nodes (4): 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

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

### Community 294 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 295 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 296 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

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

### Community 310 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 68 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 75 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+26 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-17 Ledger tasks give modules the native objects (+26 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points (+26 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+24 more)

## Knowledge Gaps
- **55 isolated node(s):** `RFC-9110`, `RFC-6455`, `RFC-6455`, `RFC-8949`, `RFC-3339` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3645 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `InMemoryBlockSource`, `loop.ts`, `UmbraError`, `ledger-storage.test.ts`, `admin-harness.ts`, `ref_node_fs`, `adapter-fixtures.ts`, `config/history.ts`, `ModuleDeclaration`, `api-server.test.ts`, `client.test.ts`, `ReadHandle`, `declaration.ts`, `config-check.ts`, `host.ts`, `backup/restore.ts`, `NodeClient`, `core-private-source.test.ts`, `tape/index.ts`, `runner/process.ts`, `process-worker.ts`, `module-tables.ts`, `5. Runner`, `migrate.ts`, `src/db/postgres.ts`, `contract-data-checks.ts`, `runtime-metadata.test.ts`, `private/backends.ts`, `.from`, `core-transport.ts`, `opt-out.test.ts`, `node-format.ts`, `fetch-fixtures.ts`, `pglite.ts`, `core-block-parsed.ts`, `validate.ts`, `lockstep-refusals.test.ts`, `contract-modules.test.ts`, `ledger/types.ts`, `real-tapes.ts`, `core-ledger-state.ts`, `binding.test.ts`, `builder.test.ts`, `ledger-sweep.test.ts`, `slow-block-harness.ts`, `config/plain-data.ts`, `loop-stop-harness.ts`, `column-rules.test.ts`, `chain-events-decode.test.ts`, `mapping.ts`, `node-source.ts`, `boundary.test.ts`, `retirement.test.ts`, `file-mode.test.ts`, `core-settings.ts`, `config-hash-checks.ts`, `paused-harness.ts`, `zero-timeouts-checks.ts`, `networks.ts`, `net.test.ts`, `version-checks.ts`, `browser/build.ts`, `pg-tx-history-adapter.ts`, `mutation-per-adapter.mjs`, `cbor.property.test.ts`, `browser.test.ts`, `release-version.test.ts`, `order.property.test.ts`, `node-fields-harness.ts`, `cold-boot-recovery.integration.test.ts`, `restore-private.ts`, `postgres/transaction-history-storage.ts`, `code-registry.ts`, `Lockstep`, `test/postgres/setup.ts`, `digest.test.ts`, `PrivateTransport`, `documents.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `read-gate.ts`, `package.json`, `threat-model.test.ts`, `transaction-history-storage.property.test.ts`, `node-bridge.ts`, `shims.test.ts`, `ledger-table-config.test.ts`, `intake.test.ts`, `LoopPauses`, `ws-mutual-tls.test.ts`, `failures.ts`, `read-height.property.test.ts`, `web-lock.ts`, `excluded-not-exported.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `chain-events-source.test.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `configuration-refusal.ts`, `ledger/plain-data.test.ts`?**
  _High betweenness centrality (0.240) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `The ledger state`) actually correct?**
  _`UmbraError` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-9110`, `RFC-6455`, `RFC-6455` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InMemoryBlockSource` be split into smaller, more focused modules?**
  _Cohesion score 0.02103813851025747 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `InMemoryBlockSource`, `loop.ts`, `table`, `admin-harness.ts`, `shims.test.ts`, `ref_node_fs`, `config/history.ts`, `ledger-table-config.test.ts`, `ModuleDeclaration`, `api-server.test.ts`, `client.test.ts`, `ReadHandle`, `declaration.ts`, `config-check.ts`, `backup/restore.ts`, `NodeClient`, `core-private-source.test.ts`, `tape/index.ts`, `runner/process.ts`, `process-worker.ts`, `module-tables.ts`, `5. Runner`, `migrate.ts`, `src/db/postgres.ts`, `contract-data-checks.ts`, `runtime-metadata.test.ts`, `LedgerPackage`, `core-transport.ts`, `opt-out.test.ts`, `failures.ts`, `fetch-fixtures.ts`, `pglite.ts`, `range.ts`, `validate.ts`, `checkShape`, `web-lock.ts`, `contract-modules.test.ts`, `ledger/types.ts`, `core-ledger-state.ts`, `lockstep-refusals.test.ts`, `binding.test.ts`, `slow-block-harness.ts`, `config/plain-data.ts`, `FinalizedLoop`, `NodeBlockSource`, `PgliteDatabase`, `cbor.ts`, `graph.ts`, `mapping.ts`, `configuration-refusal.ts`, `node-source.ts`, `zero-timeouts-checks.ts`, `version-checks.ts`, `RuntimeMetadata`, `transforms.ts`, `PrivateTransport`, `selectLedgerVersion`, `pglite-lock.ts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `loop.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.019404483104717297 - nodes in this community are weakly interconnected._