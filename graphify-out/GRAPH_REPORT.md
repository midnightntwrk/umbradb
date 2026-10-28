# Graph Report - UmbraDB

## Corpus Check
- 1013 files · ~1,453,574 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10805 nodes · 32617 edges · 331 communities (298 shown, 33 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2540 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `f675dc1c5fcaa448` (1013 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- UmbraError
- src/db/postgres.ts
- NodeClient
- lockstep-refusals.test.ts
- page.ts
- block-source.ts
- shims.test.ts
- zero-timeouts-checks.ts
- browser/build.ts
- worker-host.test.ts
- node-fields-harness.ts
- host.ts
- release-version.test.ts
- src/ledger/identity.ts
- .concat
- builds.ts
- chrome.ts
- code-registry.ts
- ref_node_timers
- test/postgres/setup.ts
- pg-tx-history-adapter.ts
- adapter-fixtures.ts
- node-source.ts
- version.negative-control.test.ts
- connection-state.test.ts
- ws
- config/plain-data.ts
- Lockstep
- node-run.ts
- tape/index.ts
- BlockRef
- documents.ts
- restore-private.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- TransactionHistoryEntry
- ws-mutual-tls.test.ts
- startup-stop-harness.ts
- read-gate.ts
- core-block-fetch/metadata.ts
- .value
- node-bridge.ts
- crash.test.ts
- type-check.ts
- FinalizedLoop
- block-fetch-decode.test.ts
- net.test.ts
- key-handling-checks.ts
- development-opt-in.test.ts
- order.property.test.ts
- version-table.ts
- recovery.test.ts
- browser-harness.ts
- core-transport.ts
- read-height.property.test.ts
- Design — Sprint 1: project setup + TemporalKV
- statementsOf
- checkShape
- PortSocket
- 15. Backups
- loop.test.ts
- truncate-guard.ts
- web-lock.ts
- ws.ts
- .start
- api-server.test.ts
- history.property.test.ts
- worker-threads-worker.ts
- Worker
- upgrade-boundary.test.ts
- declaration.ts
- fetch-fixtures.ts
- TapeAnswers
- module-api.test.ts
- transport-intake.test.ts
- stats.ts
- HeldHeight
- client.test.ts
- LoopPauses
- EventsRunner
- ledger/plain-data.ts
- worker-threads.test.ts
- TapeRecord
- mutation-evidence.d.mts
- ref_node_crypto
- browser/src/config/load.ts
- NetworkBroker
- AsyncLocalStorage
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- process-admin.ts
- .once
- node-format.ts
- worker-threads-host.ts
- cbor.ts
- interfaces/transaction-history-storage.ts
- ModuleDeclaration
- opt-out.test.ts
- range.ts
- https.ts
- NodeFS
- core-chain-events.ts
- config-check.ts
- loop.ts
- validate.ts
- PgTransactionHistoryStorage
- vitest
- ledger/types.ts
- connectWebSocket
- core-ledger-state.ts
- pglite.ts
- backup-fixtures.ts
- spawnChild
- LedgerPackage
- runner/process.ts
- cursor-table.test.ts
- mapping.ts
- transform-checks.ts
- refused-configuration.test.ts
- process-build.ts
- InMemoryBlockSource
- config/history.ts
- intake.test.ts
- core-private-source.ts
- transport-faults.test.ts
- validate.test.ts
- backup/backup.ts
- ledger-state.test.ts
- cli/command.ts
- builder.test.ts
- ledger-sweep.test.ts
- column-rules.ts
- node.test.ts
- slow-block-harness.ts
- pause-fixtures.ts
- entries.ts
- height-versioned.test.ts
- sweep-tapes.ts
- boundary.test.ts
- admin-harness.ts
- binding.test.ts
- graph.ts
- NodeBlockSource
- contract-data-checks.ts
- cold-boot-recovery.integration.test.ts
- private/backends.ts
- retirement.test.ts
- file-mode.test.ts
- browser.test.ts
- .from
- networks.ts
- Process
- in-memory-source.ts
- process-backends.ts
- real-tapes.ts
- ingest-harness.ts
- process-worker.ts
- validation.ts
- version-checks.ts
- backup/restore.ts
- signal-backup.test.ts
- Design — Sprint 3: CheckpointStore
- ADDED Requirements
- .slowBlockMs
- .boolean
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- v9
- mutation-per-adapter.mjs
- UmbraDB third-party component inventory (SBOM)
- refused
- path.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- read-only-checks.ts
- fresh-instance.mjs
- crash-worker.ts
- 9.2 Browser build (BR)
- history
- .put
- code
- T
- version
- ADDED Requirements
- core-private-source.test.ts
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- package.json
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- UmbraDB
- stryker.conf.json
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- ADDED Requirements
- UmbraDB module guide
- Requirement: BK-1 Backup
- ADDED Requirements
- REMOVED Requirements
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- Design — v1.1.0: Quint model checking
- explore.md
- Backups
- UmbraDB software supply-chain directory
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
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
- bug-report.md
- feature-request.md
- Requirement: RN-16 Chain-data reads name their view and height
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Requirement: PP-2 A private database is bound to one public database
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
- engines
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
- Repository agent policy
- post-block-update/oracle/main.rs
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 341 edges
2. `UmbraError` - 306 edges
3. `ModuleDeclaration` - 174 edges
4. `FinalizedLoop` - 131 edges
5. `NodeClient` - 113 edges
6. `InMemoryBlockSource` - 113 edges
7. `Database` - 97 edges
8. `BlockRef` - 94 edges
9. `ReadHandle` - 85 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (331 total, 33 thin omitted)

### Community 0 - "UmbraError"
Cohesion: 0.02
Nodes (184): PostgresOptions, BlockWriteHandle, Database, ReadOnlyDatabase, ReadOptions, SchemaWriteHandle, Transaction, ReadTimeoutSetting (+176 more)

### Community 1 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (124): BenchEnv, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, DriverError, Outcome, PostgresOptions (+116 more)

### Community 10 - "NodeClient"
Cohesion: 0.05
Nodes (66): CoreChainBinding, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+58 more)

### Community 100 - "lockstep-refusals.test.ts"
Cohesion: 0.11
Nodes (34): LockstepCondition, PublicCore, A118Observation, MismatchObservation, ExpectedWait, WaitSample, hashAt(), inMemoryBlock() (+26 more)

### Community 101 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 103 - "block-source.ts"
Cohesion: 0.07
Nodes (18): BlockSource, FinalityStallCondition, gate, Decision, ae4(), caseText(), readinessProblems(), holding() (+10 more)

### Community 104 - "shims.test.ts"
Cohesion: 0.10
Nodes (21): databaseTarget, Buffer, BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText() (+13 more)

### Community 105 - "zero-timeouts-checks.ts"
Cohesion: 0.11
Nodes (22): Settings, Outcome, setUp(), idleBlock(), migrated(), part(), seenAt(), slowCallbackRead() (+14 more)

### Community 106 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, CheckedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 107 - "worker-host.test.ts"
Cohesion: 0.08
Nodes (27): LedgerWorkerFailure, SlowStep, TestLoaderData, errorOf(), beat(), countDeserializations(), hexOf(), loadLedger() (+19 more)

### Community 109 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (25): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+17 more)

### Community 11 - "host.ts"
Cohesion: 0.04
Nodes (77): LoadLedger, RetainedState, LedgerName, LedgerTask, ParsedTransaction, StateHandle, AppliedState, ApplyBlock (+69 more)

### Community 110 - "release-version.test.ts"
Cohesion: 0.12
Nodes (32): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+24 more)

### Community 111 - "src/ledger/identity.ts"
Cohesion: 0.12
Nodes (28): ManifestLine, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), text(), checkLedgerPackage(), checkLedgerPackages() (+20 more)

### Community 112 - ".concat"
Cohesion: 0.08
Nodes (21): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+13 more)

### Community 114 - "builds.ts"
Cohesion: 0.10
Nodes (20): PrivateRefusal, Pause, Q142Observation, SkipsLockstep, privateBackbone(), privateConfig(), genesisBlock(), genesisHex() (+12 more)

### Community 115 - "chrome.ts"
Cohesion: 0.12
Nodes (15): Cdp, CdpEvent, ChromeBrowser, ChromeTab, Download, PageRequest, chrome(), chrome() (+7 more)

### Community 116 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 117 - "ref_node_timers"
Cohesion: 0.10
Nodes (24): Job, WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent, probe() (+16 more)

### Community 118 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 119 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 12 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (95): DeployTx, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost (+87 more)

### Community 121 - "node-source.ts"
Cohesion: 0.08
Nodes (19): ExtrinsicCall, BlockLedgerSource, NodeSourceOptions, Prefetch, QueuedBlock, LedgerBinding, NodeSubscription, SourceCondition (+11 more)

### Community 122 - "version.negative-control.test.ts"
Cohesion: 0.11
Nodes (13): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, MetadataSelector, Select, OwnStateMetadata (+5 more)

### Community 123 - "connection-state.test.ts"
Cohesion: 0.09
Nodes (16): NodeSocketEvents, HandSocket, HandSockets, connectWebSocket(), "on-compute"(), scriptedSockets(), handClient(), DEFAULT_HEARTBEAT_MS (+8 more)

### Community 124 - "ws"
Cohesion: 0.10
Nodes (10): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+2 more)

### Community 125 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 126 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 127 - "node-run.ts"
Cohesion: 0.11
Nodes (21): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, NodeRunResult, core(), databaseOf(), defineConfig() (+13 more)

### Community 13 - "tape/index.ts"
Cohesion: 0.05
Nodes (70): RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError, Connection (+62 more)

### Community 130 - "BlockRef"
Cohesion: 0.13
Nodes (8): CoreBlockItems, BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, failingSource(), flakySource()

### Community 131 - "documents.ts"
Cohesion: 0.12
Nodes (26): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+18 more)

### Community 134 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+14 more)

### Community 135 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 136 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 137 - "TransactionHistoryEntry"
Cohesion: 0.14
Nodes (8): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 138 - "ws-mutual-tls.test.ts"
Cohesion: 0.10
Nodes (20): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+12 more)

### Community 14 - "startup-stop-harness.ts"
Cohesion: 0.04
Nodes (78): ProcessingEnd, ProcessObservation, Outcome, testBuild, A149Observation, A149Startup, A42Observation, Seen (+70 more)

### Community 140 - "read-gate.ts"
Cohesion: 0.15
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 141 - "core-block-fetch/metadata.ts"
Cohesion: 0.22
Nodes (17): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, Primitive, TypeDef, ScaleError, field() (+9 more)

### Community 142 - ".value"
Cohesion: 0.21
Nodes (9): MetadataType, ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), littleEndian(), read(), Requirement: set rejects an invalid value with ValidationError before any statement (+1 more)

### Community 144 - "node-bridge.ts"
Cohesion: 0.13
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 145 - "crash.test.ts"
Cohesion: 0.13
Nodes (20): CrashCall, CrashEvent, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule(), a44Problems() (+12 more)

### Community 148 - "type-check.ts"
Cohesion: 0.15
Nodes (14): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), moduleSpecifier() (+6 more)

### Community 15 - "FinalizedLoop"
Cohesion: 0.04
Nodes (30): EntryBoundary, Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, Startup, SkipsAfterReconnect (+22 more)

### Community 150 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 151 - "net.test.ts"
Cohesion: 0.15
Nodes (12): IncomingMessage, Server, WebSocket, createServer(), connect(), listen(), pagePort(), unlisten() (+4 more)

### Community 156 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 159 - "development-opt-in.test.ts"
Cohesion: 0.17
Nodes (14): ConfiguredDatabase, ConfiguredDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, CommittedHeight, PgliteOptions, databaseOptions(), openConfiguredDatabase() (+6 more)

### Community 16 - "order.property.test.ts"
Cohesion: 0.04
Nodes (94): ErrorCode, GraphInput, PointArguments, PointRun, PastFaultCase, RefusalCase, CallEvent, Recorder (+86 more)

### Community 167 - "version-table.ts"
Cohesion: 0.25
Nodes (16): LedgerPin, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin(), freezeRow(), hexOf() (+8 more)

### Community 168 - "recovery.test.ts"
Cohesion: 0.21
Nodes (16): ProcessStatus, A43Observation, Fault, Recorded, RecoveryObservation, StatusRead, committedProblems(), count() (+8 more)

### Community 169 - "browser-harness.ts"
Cohesion: 0.29
Nodes (15): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+7 more)

### Community 17 - "core-transport.ts"
Cohesion: 0.04
Nodes (74): PublicSide, Session, TransportLimits, TransportTls, Committed, Hello, HelloAck, JsonValue (+66 more)

### Community 170 - "read-height.property.test.ts"
Cohesion: 0.17
Nodes (11): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+3 more)

### Community 171 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 173 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 174 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 175 - "PortSocket"
Cohesion: 0.24
Nodes (5): PortSocket, pair(), Contract states and contract logs, Requirement: RN-15 Module APIs are registered once, at startup, Scenario: Two modules claim one path

### Community 177 - "15. Backups"
Cohesion: 0.14
Nodes (12): BackupWritten, readPrivateBinding(), readPrivateRow(), ownerOnlyFile(), chmod(), snapshot(), "on-after-db-write"(), "on-compute"() (+4 more)

### Community 18 - "loop.test.ts"
Cohesion: 0.04
Nodes (80): LockstepWait, SlowWindow, Contexts, Faults, LostCommit, Seen, AtGate, LoopClass (+72 more)

### Community 180 - "truncate-guard.ts"
Cohesion: 0.17
Nodes (7): GuardTableRow, MARK_MIGRATION_SQL, MIGRATION_MARKED_CONDITION, MIGRATION_MARKED_SQL, TRUNCATE_GUARD_FUNCTION_SQL, TRUNCATE_GUARD_TABLES_SQL, TRUNCATE_GUARD_TRIGGER

### Community 181 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 182 - "ws.ts"
Cohesion: 0.18
Nodes (6): Emitter, Frame, Listener, PortUpgrade, RawData, WebSocketServer

### Community 188 - ".start"
Cohesion: 0.19
Nodes (9): BrowserBuild, pageBench, PageServer, tapeNode(), tapeNode(), servePage(), listenOnRandomPort(), ISOLATION_HEADERS (+1 more)

### Community 19 - "api-server.test.ts"
Cohesion: 0.04
Nodes (68): ReadHandle, OwnPart, ApiRegistry, FieldKind, FieldSchema, ItemDeclaration, ItemSink, Lifetime (+60 more)

### Community 191 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 193 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 197 - "upgrade-boundary.test.ts"
Cohesion: 0.27
Nodes (11): versionEntry, A47Observation, Version, a47Problems(), a47Run(), big(), buildOf(), moduleM() (+3 more)

### Community 2 - "declaration.ts"
Cohesion: 0.03
Nodes (125): ContractLog, BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, BlockTransaction, CoreContractLogsFastOptions, FastLogReader (+117 more)

### Community 20 - "fetch-fixtures.ts"
Cohesion: 0.05
Nodes (92): BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase (+84 more)

### Community 204 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 21 - "module-api.test.ts"
Cohesion: 0.04
Nodes (70): ModuleApiServer, ModuleApiStart, StartedModuleApi, Connection, HeadersArgument, ModuleApiServerOptions, ModuleApiStart, StartedModuleApi (+62 more)

### Community 215 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 219 - "HeldHeight"
Cohesion: 0.28
Nodes (5): CommitOutcome, HeldHeight, Outcomes, AlwaysLost, DropsHeld

### Community 22 - "client.test.ts"
Cohesion: 0.03
Nodes (51): NodeRetry, Answer, FakeNode, Handler, Received, recorded, ManualTimers, TapeCall (+43 more)

### Community 228 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 23 - "TapeRecord"
Cohesion: 0.05
Nodes (72): NodeCallOptions, ProcessCondition, RecordingClient, RUNTIME, Decoded, FetchSeen, A84Observation, LoggedRetry (+64 more)

### Community 239 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 24 - "ref_node_crypto"
Cohesion: 0.04
Nodes (85): ChangeKind, tableChanges, TouchedRow, Op, States, TableName, digestBlock(), changeOf() (+77 more)

### Community 240 - "browser/src/config/load.ts"
Cohesion: 0.33
Nodes (5): LoadedConfig, LoadOptions, loadConfig(), DEFAULT_CONFIG_FILE, MODULES_EXPORT

### Community 247 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 25 - "process-admin.ts"
Cohesion: 0.05
Nodes (69): OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, DigestRow, ModuleFacts, NodeFacts (+61 more)

### Community 258 - ".once"
Cohesion: 0.33
Nodes (4): SignalTarget, heldPort(), startChild(), startWorker()

### Community 26 - "node-format.ts"
Cohesion: 0.06
Nodes (56): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+48 more)

### Community 262 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 27 - "cbor.ts"
Cohesion: 0.04
Nodes (74): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+66 more)

### Community 28 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (56): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader (+48 more)

### Community 29 - "ModuleDeclaration"
Cohesion: 0.05
Nodes (47): ModuleDeclaration, ProcessContext, Revision, ResolvedGraph, LateUse, LoopInput, MisuseListener, MisuseReports (+39 more)

### Community 3 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (110): CaptureColumn, CapturedTable, CaptureState, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+102 more)

### Community 30 - "range.ts"
Cohesion: 0.04
Nodes (69): BoundaryBlockReading, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange, Final, Height (+61 more)

### Community 31 - "core-chain-events.ts"
Cohesion: 0.05
Nodes (67): BlockEventSource, MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions, TransactionParser, ChainTransaction, ChainEvent (+59 more)

### Community 32 - "config-check.ts"
Cohesion: 0.05
Nodes (66): ConfigFacts, CoreChainFacts, privateIntake, RestoreBase, CommandBuildOptions, CheckFinding, CheckState, ConfigCheckOptions (+58 more)

### Community 33 - "loop.ts"
Cohesion: 0.05
Nodes (54): PointName, HeightRange, BlockItems, Callback, CallbackFailure, ParallelPoint, PointSchedule, ReasonCode (+46 more)

### Community 34 - "validate.ts"
Cohesion: 0.06
Nodes (65): RevisionSettings, PlainObject, RedactableConfig, RedactionForms, redactor, SecretForm, TextPattern, ConfigInput (+57 more)

### Community 35 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (68): TransactionHistoryStorage, PgTransactionHistoryStorage, store(), reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 2. Dependency direction: structural mirror, not a runtime import (+60 more)

### Community 36 - "vitest"
Cohesion: 0.04
Nodes (45): Finding, RepositoryFile, Upstream, Pem, processProblems(), canPin(), pinViolations(), repositoryFiles() (+37 more)

### Community 37 - "ledger/types.ts"
Cohesion: 0.06
Nodes (48): LedgerReleasePackage, ApplyInput, ApplyOutput, LedgerPackageOptions, StateSummary, StoredNode, V9Logs, LedgerHeight (+40 more)

### Community 38 - "connectWebSocket"
Cohesion: 0.04
Nodes (45): ConnectSocket, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, BoundaryOptions, RangeOptions (+37 more)

### Community 39 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (63): LedgerStateItem, retainedStates, CoreRevision, ContractKeys, bindLedgerParser(), boundLedgerParser(), applyBlock(), bindCoreLedgerState() (+55 more)

### Community 4 - "pglite.ts"
Cohesion: 0.03
Nodes (78): DatabaseState, ReadDatabaseOptions, MultiStatementRunner, Job, JobQueue, Held, PgliteLockUse, Outcome (+70 more)

### Community 40 - "backup-fixtures.ts"
Cohesion: 0.08
Nodes (48): RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, TickerConfig, cliProject, catalogOf(), hashOf() (+40 more)

### Community 41 - "spawnChild"
Cohesion: 0.04
Nodes (60): ParentJob, Kill, Orphaned, SourceFile, Run, WorkerEvent, LockResult, Report (+52 more)

### Community 42 - "LedgerPackage"
Cohesion: 0.07
Nodes (28): LedgerPackage, LedgerTaskBlock, LedgerEngine, LedgerTaskFailed, stagenetReplay, hexOf(), idOf(), same() (+20 more)

### Community 43 - "runner/process.ts"
Cohesion: 0.04
Nodes (47): Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, VerifyLedgerPackagesOptions (+39 more)

### Community 44 - "cursor-table.test.ts"
Cohesion: 0.04
Nodes (50): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, cursorTable, CursorTableOptions (+42 more)

### Community 45 - "mapping.ts"
Cohesion: 0.05
Nodes (45): BoundedRead, Session, ResultColumn, ResultType, queryTimeout(), classifyDriverError(), arrayLiteral(), hexOf() (+37 more)

### Community 46 - "transform-checks.ts"
Cohesion: 0.07
Nodes (48): Failure, Variant, TapeError, TransformError, SubscriptionId, NotificationRange, until(), baseRecords() (+40 more)

### Community 47 - "refused-configuration.test.ts"
Cohesion: 0.06
Nodes (61): ProcessConfig, Answered, Observation, Start, Refusal, Start, startProcess(), adminSnapshot() (+53 more)

### Community 48 - "process-build.ts"
Cohesion: 0.05
Nodes (52): coreEntry, AdminRun, Validator, Child, CoreSeen, statusOf(), adminCore(), adminCoreSettings() (+44 more)

### Community 49 - "InMemoryBlockSource"
Cohesion: 0.05
Nodes (48): InMemoryBlockSource, ProcessHandle, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation (+40 more)

### Community 5 - "config/history.ts"
Cohesion: 0.04
Nodes (116): OpenedFacts, CoreVersion, CoreSettings, ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding (+108 more)

### Community 50 - "intake.test.ts"
Cohesion: 0.06
Nodes (55): PrivateProcess, PrivateSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation, A116Observation (+47 more)

### Community 51 - "core-private-source.ts"
Cohesion: 0.07
Nodes (44): PrivateBlockSource, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes, PublicDatabase, PublicSideOptions, PublicWakes (+36 more)

### Community 52 - "transport-faults.test.ts"
Cohesion: 0.06
Nodes (45): Message, PrivateBackend, TestCertificates, Ended, rawClient, Escape, publicState, Refused (+37 more)

### Community 53 - "validate.test.ts"
Cohesion: 0.04
Nodes (58): EntryView, Entry, UmbraConfig, plainData, ConfigContext, EntryRef, EntryView, Accepts (+50 more)

### Community 54 - "backup/backup.ts"
Cohesion: 0.07
Nodes (58): BackupInput, BackupSeams, BackupTarget, BackupFacts, ManifestHistoryRow, ManifestMigration, ManifestTool, DumpInput (+50 more)

### Community 55 - "ledger-state.test.ts"
Cohesion: 0.06
Nodes (54): recordedGenesis, Side, ProcessDatabase, FoundTape, Tape, heightsIn(), halted(), until() (+46 more)

### Community 56 - "cli/command.ts"
Cohesion: 0.06
Nodes (49): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, CommandResult, backupArguments(), backupCommand() (+41 more)

### Community 57 - "builder.test.ts"
Cohesion: 0.06
Nodes (35): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Script, ScriptedNode (+27 more)

### Community 58 - "ledger-sweep.test.ts"
Cohesion: 0.06
Nodes (31): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, ChildReader, NodeBatch, Block (+23 more)

### Community 6 - "column-rules.ts"
Cohesion: 0.02
Nodes (101): CatalogColumn, CatalogOptions, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts, columnVerdict (+93 more)

### Community 60 - "node.test.ts"
Cohesion: 0.05
Nodes (22): Outage, Metadata, Step, Frame, RawClient, Failure, Variant, TapeClock (+14 more)

### Community 61 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (51): BlockItemSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+43 more)

### Community 63 - "pause-fixtures.ts"
Cohesion: 0.07
Nodes (40): BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable, PausableConfig, PausableOptions, RecorderGlobals (+32 more)

### Community 64 - "entries.ts"
Cohesion: 0.04
Nodes (54): LedgerTableSettings, CoreEntryInput, CoreSettingsBase, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+46 more)

### Community 66 - "height-versioned.test.ts"
Cohesion: 0.07
Nodes (37): heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration, Control, StoredVersion, Block, BlockFails (+29 more)

### Community 67 - "sweep-tapes.ts"
Cohesion: 0.10
Nodes (47): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData (+39 more)

### Community 68 - "boundary.test.ts"
Cohesion: 0.08
Nodes (44): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+36 more)

### Community 7 - "admin-harness.ts"
Cohesion: 0.04
Nodes (89): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+81 more)

### Community 70 - "binding.test.ts"
Cohesion: 0.07
Nodes (42): PrivateIntakeOptions, startHashDecision, A165Options, a165Run, Attempt, TestDatabase, A113Observation, A156Observation (+34 more)

### Community 71 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts (+40 more)

### Community 72 - "NodeBlockSource"
Cohesion: 0.10
Nodes (12): HeadWait, NodeBlockSource, NodeHeader, PreparedBlock, QueueRunner, NoWindow, Refetches, TrustsNotifications (+4 more)

### Community 73 - "contract-data-checks.ts"
Cohesion: 0.11
Nodes (44): contractScenario, ContractScenarioOptions, LogLine, Program, Ran, ScenarioTx, handoff, HandoffAt (+36 more)

### Community 74 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (30): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+22 more)

### Community 76 - "private/backends.ts"
Cohesion: 0.09
Nodes (34): AdminStarter, SessionSeen, PublicCoreOptions, A162Options, a162Run, HeaderSeen, InstancesOptions, instancesRun (+26 more)

### Community 77 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 78 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (31): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+23 more)

### Community 79 - "browser.test.ts"
Cohesion: 0.08
Nodes (42): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, Broken, continuedProblems() (+34 more)

### Community 8 - ".from"
Cohesion: 0.03
Nodes (98): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+90 more)

### Community 81 - "networks.ts"
Cohesion: 0.06
Nodes (40): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+32 more)

### Community 82 - "Process"
Cohesion: 0.11
Nodes (4): CoreTransport, PauseHold, Process, messageOf()

### Community 85 - "in-memory-source.ts"
Cohesion: 0.05
Nodes (29): InMemoryItems, Wait, StandInOptions, RestoreJob, SignalJob, isBlockItemSource(), checkHeight(), blockFetchStandIn() (+21 more)

### Community 86 - "process-backends.ts"
Cohesion: 0.10
Nodes (32): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, ProcessBackend, countMainThreadParses(), plainWatchModule() (+24 more)

### Community 89 - "real-tapes.ts"
Cohesion: 0.08
Nodes (33): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+25 more)

### Community 9 - "ingest-harness.ts"
Cohesion: 0.04
Nodes (101): Manifest, Restored, BlockHeader, NodeClientOptions, CrashEvent, CrashJob, ingest, IngestOptions (+93 more)

### Community 91 - "process-worker.ts"
Cohesion: 0.09
Nodes (31): Scope, crossedError, StartRun, ToProcessWorker, openedProcess, RestoreChain, RestoreSeams, commandTarget (+23 more)

### Community 92 - "validation.ts"
Cohesion: 0.06
Nodes (34): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+26 more)

### Community 93 - "version-checks.ts"
Cohesion: 0.12
Nodes (33): LedgerSelection, VersionedBlock, Boundary, CallRecord, CountingNode, UpgradeCase, Walk, Answers (+25 more)

### Community 94 - "backup/restore.ts"
Cohesion: 0.10
Nodes (28): PrivateChecks, PublicConfiguration, PublicIdentity, Checked, PublicSide, RestoreInput, RestoreTarget, BackupText (+20 more)

### Community 99 - "signal-backup.test.ts"
Cohesion: 0.09
Nodes (23): WORKER, SignalEvent, RunningCommand, statsConfig, write(), adminPortIn(), chainNode(), exitWithin() (+15 more)

### Community 163 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.13
Nodes (14): 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions, 6. Migration (`002_checkpoint_store.ts`), 7. Error translation — no additions to `src/postgres/errors.ts`, 8. Composing Transaction/Lease (Sprint 2 dependency), 9. Test infrastructure (+6 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.08
Nodes (22): 1. Schema, ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract (+14 more)

### Community 154 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 157 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 160 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API, 3. Modules (+7 more)

### Community 176 - "v9"
Cohesion: 0.15
Nodes (13): ledger(), v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix, Blocks from the node, Ledger tasks (+5 more)

### Community 179 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 195 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.17
Nodes (11): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+3 more)

### Community 201 - "refused"
Cohesion: 0.22
Nodes (10): refused(), When a callback fails, Requirement: AE-3 States and conditions, Scenario: A fault of the build's declarations ends the process, Scenario: A paused loop, Scenario: A refused configuration ends the process, Scenario: A refused start stays up, Requirement: PP-4 The process transport (+2 more)

### Community 221 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 224 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 231 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 259 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 292 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 293 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 303 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 59 - "history"
Cohesion: 0.04
Nodes (59): history(), revision(), n(), 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect (+51 more)

### Community 62 - ".put"
Cohesion: 0.04
Nodes (52): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+44 more)

### Community 65 - "code"
Cohesion: 0.04
Nodes (56): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+48 more)

### Community 69 - "T"
Cohesion: 0.04
Nodes (49): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+41 more)

### Community 75 - "version"
Cohesion: 0.05
Nodes (44): version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5) (+36 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 97 - "core-private-source.test.ts"
Cohesion: 0.06
Nodes (10): height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PRIVATE_CORE_DIGEST, ACK_OF_CORE (+2 more)

### Community 98 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-1 The main program is a fixed sequence of points, Requirement: RN-2 The runner does only its five duties (+24 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+23 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+20 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+19 more)

### Community 139 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 143 - "package.json"
Cohesion: 0.08
Nodes (24): bin, umbradb, bugs, url, description, exports, files, homepage (+16 more)

### Community 146 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+14 more)

### Community 152 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 153 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 161 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 162 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 164 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 165 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 166 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 172 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 183 - "UmbraDB module guide"
Cohesion: 0.14
Nodes (13): Cursor tables, Data that is not a function of the chain, Height-versioned tables, Private modules, Reading through `db`, Running a module with the `umbradb` command, Start and stop heights, Stored values and digests (+5 more)

### Community 184 - "Requirement: BK-1 Backup"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 186 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 189 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 190 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 192 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 196 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 198 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 199 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 200 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 202 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 203 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.18
Nodes (10): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds, 8. CI (+2 more)

### Community 205 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 206 - "Backups"
Cohesion: 0.20
Nodes (9): A backup at the core's stop, A backup of a running process (SIGUSR2), A private process and a changed public configuration, Backups, Restoring a backup, The database, UmbraDB operator guide, What a backup holds (+1 more)

### Community 207 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 208 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 209 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

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

### Community 216 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 217 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 218 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 222 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 223 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.25
Nodes (7): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Suggested fix, Suggested fix

### Community 225 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 226 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 230 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 232 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 233 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 234 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

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

### Community 243 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 244 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 245 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 246 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 248 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 249 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 250 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 251 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 252 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 253 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 254 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 255 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 256 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 257 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 260 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 261 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 263 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 264 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 265 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 266 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 267 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 268 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 269 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 270 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 271 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

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

### Community 289 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 290 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 291 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 294 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 295 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 296 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 297 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 298 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 299 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 300 - "Requirement: PP-2 A private database is bound to one public database"
Cohesion: 0.50
Nodes (4): Requirement: PP-2 A private database is bound to one public database, Scenario: Configured for another network, Scenario: Pointed at another public database, Scenario: The public core never started

### Community 301 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 302 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 308 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 309 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 80 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 90 - "Repository agent policy"
Cohesion: 0.05
Nodes (32): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, [0.10.0] - 2026-10-27 (+24 more)

### Community 95 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-6455`, `@stryker-mutator/core` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3601 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UmbraError`, `src/db/postgres.ts`, `declaration.ts`, `opt-out.test.ts`, `pglite.ts`, `config/history.ts`, `column-rules.ts`, `admin-harness.ts`, `.from`, `ingest-harness.ts`, `NodeClient`, `host.ts`, `adapter-fixtures.ts`, `tape/index.ts`, `startup-stop-harness.ts`, `order.property.test.ts`, `core-transport.ts`, `loop.test.ts`, `api-server.test.ts`, `fetch-fixtures.ts`, `module-api.test.ts`, `client.test.ts`, `TapeRecord`, `ref_node_crypto`, `process-admin.ts`, `node-format.ts`, `cbor.ts`, `interfaces/transaction-history-storage.ts`, `ModuleDeclaration`, `range.ts`, `core-chain-events.ts`, `config-check.ts`, `loop.ts`, `validate.ts`, `ledger/types.ts`, `connectWebSocket`, `core-ledger-state.ts`, `backup-fixtures.ts`, `spawnChild`, `runner/process.ts`, `cursor-table.test.ts`, `mapping.ts`, `transform-checks.ts`, `refused-configuration.test.ts`, `process-build.ts`, `InMemoryBlockSource`, `intake.test.ts`, `transport-faults.test.ts`, `validate.test.ts`, `backup/backup.ts`, `ledger-state.test.ts`, `cli/command.ts`, `builder.test.ts`, `ledger-sweep.test.ts`, `node.test.ts`, `slow-block-harness.ts`, `pause-fixtures.ts`, `entries.ts`, `height-versioned.test.ts`, `sweep-tapes.ts`, `boundary.test.ts`, `binding.test.ts`, `contract-data-checks.ts`, `cold-boot-recovery.integration.test.ts`, `private/backends.ts`, `retirement.test.ts`, `file-mode.test.ts`, `browser.test.ts`, `networks.ts`, `in-memory-source.ts`, `process-backends.ts`, `real-tapes.ts`, `validation.ts`, `version-checks.ts`, `backup/restore.ts`, `core-private-source.test.ts`, `signal-backup.test.ts`, `lockstep-refusals.test.ts`, `block-source.ts`, `shims.test.ts`, `zero-timeouts-checks.ts`, `browser/build.ts`, `worker-host.test.ts`, `node-fields-harness.ts`, `release-version.test.ts`, `src/ledger/identity.ts`, `builds.ts`, `code-registry.ts`, `ref_node_timers`, `test/postgres/setup.ts`, `pg-tx-history-adapter.ts`, `version.negative-control.test.ts`, `connection-state.test.ts`, `config/plain-data.ts`, `Lockstep`, `documents.ts`, `restore-private.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `ws-mutual-tls.test.ts`, `read-gate.ts`, `package.json`, `node-bridge.ts`, `crash.test.ts`, `type-check.ts`, `block-fetch-decode.test.ts`, `net.test.ts`, `key-handling-checks.ts`, `development-opt-in.test.ts`, `recovery.test.ts`, `read-height.property.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `web-lock.ts`, `excluded-not-exported.test.ts`, `history.property.test.ts`, `upgrade-boundary.test.ts`, `transport-intake.test.ts`, `worker-threads.test.ts`?**
  _High betweenness centrality (0.225) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `The ledger state`) actually correct?**
  _`UmbraError` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.022842493374812766 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `src/db/postgres.ts`, `declaration.ts`, `opt-out.test.ts`, `pglite.ts`, `config/history.ts`, `BlockRef`, `.from`, `ingest-harness.ts`, `NodeClient`, `host.ts`, `tape/index.ts`, `startup-stop-harness.ts`, `FinalizedLoop`, `order.property.test.ts`, `core-transport.ts`, `loop.test.ts`, `api-server.test.ts`, `module-api.test.ts`, `client.test.ts`, `TapeRecord`, `ref_node_crypto`, `process-admin.ts`, `cbor.ts`, `ModuleDeclaration`, `range.ts`, `development-opt-in.test.ts`, `config-check.ts`, `loop.ts`, `validate.ts`, `vitest`, `core-ledger-state.ts`, `version-table.ts`, `backup-fixtures.ts`, `runner/process.ts`, `cursor-table.test.ts`, `statementsOf`, `mapping.ts`, `checkShape`, `process-build.ts`, `InMemoryBlockSource`, `refused-configuration.test.ts`, `core-private-source.ts`, `transport-faults.test.ts`, `web-lock.ts`, `backup/backup.ts`, `ledger-state.test.ts`, `validate.test.ts`, `intake.test.ts`, `UmbraDB module guide`, `builder.test.ts`, `slow-block-harness.ts`, `pause-fixtures.ts`, `height-versioned.test.ts`, `upgrade-boundary.test.ts`, `binding.test.ts`, `graph.ts`, `NodeBlockSource`, `process-backends.ts`, `process-worker.ts`, `validation.ts`, `version-checks.ts`, `backup/restore.ts`, `core-private-source.test.ts`, `lockstep-refusals.test.ts`, `block-source.ts`, `shims.test.ts`, `zero-timeouts-checks.ts`, `transform-checks.ts`, `src/ledger/identity.ts`, `browser/src/config/load.ts`, `node-source.ts`, `version.negative-control.test.ts`, `config/plain-data.ts`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `src/db/postgres.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.025050857308921825 - nodes in this community are weakly interconnected._