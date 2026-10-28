# Graph Report - UmbraDB

## Corpus Check
- 1043 files · ~1,489,057 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 11099 nodes · 33773 edges · 335 communities (307 shown, 28 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2592 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `8113187647d192e7` (1043 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- UmbraError
- admin-harness.ts
- contract-data-checks.ts
- release-version.test.ts
- browser/build.ts
- .concat
- browser.test.ts
- src/ledger/identity.ts
- src/db/postgres.ts
- declaration.ts
- test/postgres/setup.ts
- LoopPauses
- src/config/load.ts
- browser-harness.ts
- code-registry.ts
- transaction-history-storage.property.test.ts
- postgres/transaction-history-storage.ts
- chain-placement.test.ts
- config/plain-data.ts
- node-fields-harness.ts
- Lockstep
- process-worker.ts
- interfaces/transaction-history-storage.ts
- documents.ts
- NodeClient
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- Writer
- encodeCanonical
- pglite-server.ts
- version-table.ts
- builds.ts
- node-bridge.ts
- lockstep-refusals.test.ts
- read-gate.ts
- threat-model.test.ts
- fixtures/configuration.ts
- node/socket.ts
- relays.ts
- host.ts
- block-fetch-decode.test.ts
- core-block-fetch/metadata.ts
- harness.ts
- shims.test.ts
- ws-mutual-tls.test.ts
- .value
- fetch-fixtures.ts
- chrome.ts
- private/lockstep-wait.test.ts
- process-admin.ts
- TransactionHistoryEntry
- validation.test.ts
- Design — Sprint 1: project setup + TemporalKV
- tape/index.ts
- statementsOf
- checkShape
- Worker
- no-indexer-or-wallet-sdk.test.ts
- .from
- core.ts
- web-lock.ts
- tape.ts
- worker-threads.test.ts
- FinalizedLoop
- BlockRef
- pglite-directory-fixtures.ts
- text.test.ts
- Session
- history.property.test.ts
- component-table.test.ts
- worker-threads-worker.ts
- buffer.ts
- core-block-parsed.ts
- Heartbeat
- .send
- extrinsics.ts
- ref_node_fs
- scale-value.ts
- transport-intake.test.ts
- ledger/plain-data.test.ts
- validate.ts
- type-check.ts
- devnet-upgrade.test.ts
- ref_node_crypto
- mutation-evidence.d.mts
- NetworkBroker
- AsyncLocalStorage
- adapter.ts
- process-backends.ts
- core-transport.ts
- builder.test.ts
- InMemoryBlockSource
- .read
- core-ledger-state.ts
- https.ts
- NodeFS
- LedgerPackage
- range.ts
- ingest-harness.ts
- PgTransactionHistoryStorage
- column-rules.ts
- cli/command.ts
- refused-configuration.test.ts
- vitest
- config/history.ts
- backup/backup.ts
- halts.test.ts
- intake.test.ts
- validation.ts
- ledger-sweep.test.ts
- ledger/ledger-tasks.test.ts
- range.test.ts
- private/backends.ts
- transport.test.ts
- ModuleDeclaration
- runner/process.ts
- writer-lock-checks.ts
- transform-checks.ts
- slow-block-harness.ts
- database-parts.ts
- signal-ignored-fixtures.ts
- binding.test.ts
- networks.ts
- cbor.ts
- column-rules.test.ts
- adapter-fixtures.ts
- version-checks.ts
- config-check.ts
- module-tables.ts
- pause-fixtures.ts
- core-block-commit.test.ts
- graph.ts
- net.test.ts
- mapping.ts
- retirement.test.ts
- loop.test.ts
- client.ts
- real-tapes.ts
- file-mode.test.ts
- restore-private.ts
- openPostgres
- api-server.test.ts
- pglite.ts
- column-refusals.test.ts
- pack-install.mjs
- messages.ts
- backup/restore.ts
- pg-tx-history-adapter.ts
- db/errors.ts
- durability-probe.test.ts
- openPglite
- .close
- boundary.test.ts
- order.property.test.ts
- page.ts
- paused-harness.ts
- cbor.property.test.ts
- ADDED Requirements
- Design — Sprint 3: CheckpointStore
- refused
- UmbraDB third-party component inventory (SBOM)
- cold-boot-recovery.integration.test.ts
- 1. Determinism primitives
- recordRange
- UmbraDB module guide
- Boundaries, threats and controls
- .query
- T
- writer-lock.negative-control.test.ts
- migrations
- .slowBlockMs
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- twox.ts
- facade-merge-loader.ts
- path.ts
- .boolean
- v9
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- crash-worker.ts
- history
- code
- ADDED Requirements
- graph.py
- .put
- version
- ADDED Requirements
- Repository agent policy
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- ADDED Requirements
- stryker.conf.json
- ADDED Requirements
- devDependencies
- scripts
- UmbraDB
- Requirement: BK-1 Backup
- Roadmap
- ADDED Requirements
- Backups
- ADDED Requirements
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- compilerOptions
- ADDED Requirements
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- Design — Sprint 4: Watermarks
- explore.md
- ADDED Requirements
- ADDED Requirements
- Design — Sprint 2: Transaction/Lease
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.9.5] - 2026-07-25 — "Penumbra"
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- ADDED Requirements
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0-infosec-signoff
- Contributing
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
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Tasks — Sprint 2: Transaction/Lease
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
- 00023 — The blocks table's height partitions end at 5,000,000
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask
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
- 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Requirement: RN-13 SIGTERM stops cleanly
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
1. `vitest` - 355 edges
2. `UmbraError` - 311 edges
3. `ModuleDeclaration` - 175 edges
4. `FinalizedLoop` - 131 edges
5. `InMemoryBlockSource` - 120 edges
6. `NodeClient` - 113 edges
7. `Database` - 99 edges
8. `BlockRef` - 95 edges
9. `ReadHandle` - 87 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `1. Vendor/pin manifest (for the nightly live tier)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/tasks.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (335 total, 28 thin omitted)

### Community 0 - "UmbraError"
Cohesion: 0.02
Nodes (174): Transaction, CaptureColumn, CapturedTable, CaptureState, AppliedRow, MigrationPart, Runnable, Settling (+166 more)

### Community 1 - "admin-harness.ts"
Cohesion: 0.02
Nodes (173): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+165 more)

### Community 10 - "contract-data-checks.ts"
Cohesion: 0.03
Nodes (121): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+113 more)

### Community 100 - "release-version.test.ts"
Cohesion: 0.11
Nodes (33): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+25 more)

### Community 101 - "browser/build.ts"
Cohesion: 0.08
Nodes (25): BrowserBuildOptions, BrowserControl, CheckedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+17 more)

### Community 102 - ".concat"
Cohesion: 0.07
Nodes (21): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+13 more)

### Community 104 - "browser.test.ts"
Cohesion: 0.10
Nodes (31): Reachable, RestoreAttempt, PageRestore, continuedProblems(), midChainProblems(), networkProblems(), plain(), restoreProblems() (+23 more)

### Community 106 - "src/ledger/identity.ts"
Cohesion: 0.12
Nodes (28): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages() (+20 more)

### Community 109 - "src/db/postgres.ts"
Cohesion: 0.09
Nodes (25): SslMode, DurabilityWarning, Outcome, driverConnectionOptions, DriverError, Outcome, PostgresConnection, Role (+17 more)

### Community 11 - "declaration.ts"
Cohesion: 0.03
Nodes (93): BlockWriteHandle, ReadHandle, SchemaWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+85 more)

### Community 111 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 114 - "LoopPauses"
Cohesion: 0.08
Nodes (17): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 115 - "src/config/load.ts"
Cohesion: 0.08
Nodes (22): SignalJob, Finding, invalid(), isFile(), loadConfig(), modulesOf(), report(), DEFAULT_CONFIG_FILE (+14 more)

### Community 116 - "browser-harness.ts"
Cohesion: 0.13
Nodes (25): BrowserBuild, PageBackup, pageBench, PageEvent, ProcessName, StatusBody, PageServer, backupThrough() (+17 more)

### Community 117 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 118 - "transaction-history-storage.property.test.ts"
Cohesion: 0.08
Nodes (24): EntryContent, Command, ReplayableStorage, isPlainObject(), mergeSections(), referenceMergeEntries(), applyCommand(), replay() (+16 more)

### Community 119 - "postgres/transaction-history-storage.ts"
Cohesion: 0.10
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+11 more)

### Community 12 - "chain-placement.test.ts"
Cohesion: 0.04
Nodes (115): MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent (+107 more)

### Community 120 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 121 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (23): A168Observation, A168Phase, Expected, GatedConnector, StatusReader, a(), a168Run(), atLeast() (+15 more)

### Community 122 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 123 - "process-worker.ts"
Cohesion: 0.13
Nodes (21): ProcessView, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, messageAdmin(), withDevelopmentOptIn() (+13 more)

### Community 124 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 127 - "documents.ts"
Cohesion: 0.12
Nodes (26): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+18 more)

### Community 13 - "NodeClient"
Cohesion: 0.04
Nodes (85): BrowserRun, NodeSourceOptions, NodeCallOptions, NodeClient, NodeClientOptions, ConnectSocket, SourceShared, RecordingClient (+77 more)

### Community 131 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 132 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 133 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 135 - "Writer"
Cohesion: 0.11
Nodes (12): ReadPool, Writer, commitRolledBack(), rollBack(), Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling (+4 more)

### Community 137 - "encodeCanonical"
Cohesion: 0.12
Nodes (24): ChangeKind, tableChanges, TouchedRow, digestBlock(), encodeCanonical(), changeOf(), concat(), isCheckpointHeight() (+16 more)

### Community 138 - "pglite-server.ts"
Cohesion: 0.14
Nodes (16): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, pgliteBackend(), expectNoOutsideReads() (+8 more)

### Community 139 - "version-table.ts"
Cohesion: 0.14
Nodes (24): LedgerPin, LedgerSelection, VersionedBlock, BoundaryBlockReading, BoundaryOptions, BoundaryReading, blockNamed(), checkPins() (+16 more)

### Community 14 - "builds.ts"
Cohesion: 0.03
Nodes (67): AdminStarter, ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, privateIntake, PrivateIntakeOptions, PrivateShared (+59 more)

### Community 140 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 141 - "lockstep-refusals.test.ts"
Cohesion: 0.15
Nodes (24): LockstepCondition, ProcessStatus, Q142Observation, A118Observation, MismatchObservation, WaitSample, A43Observation, Recorded (+16 more)

### Community 142 - "read-gate.ts"
Cohesion: 0.16
Nodes (22): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+14 more)

### Community 143 - "threat-model.test.ts"
Cohesion: 0.14
Nodes (23): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+15 more)

### Community 144 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (18): BrowserConfiguration, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, PglitePathParts, core(), databaseOf(), defineConfig() (+10 more)

### Community 148 - "node/socket.ts"
Cohesion: 0.12
Nodes (14): Connection, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure, connectWebSocket(), "on-compute"(), scriptedSockets() (+6 more)

### Community 149 - "relays.ts"
Cohesion: 0.13
Nodes (7): Report, HeldLink, HoldingRelay, ReportRelay, sendable(), typeOf(), RFC-6455

### Community 15 - "host.ts"
Cohesion: 0.04
Nodes (84): LoadLedger, LedgerName, ChainOutcome, LedgerPackageOptions, LedgerTask, ParsedTransaction, AppliedState, ApplyBlock (+76 more)

### Community 150 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 151 - "core-block-fetch/metadata.ts"
Cohesion: 0.27
Nodes (14): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 152 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 153 - "shims.test.ts"
Cohesion: 0.15
Nodes (9): databaseTarget, Buffer, Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL (+1 more)

### Community 155 - "ws-mutual-tls.test.ts"
Cohesion: 0.13
Nodes (18): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+10 more)

### Community 157 - ".value"
Cohesion: 0.26
Nodes (7): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 16 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (102): ProcessCondition, Scenario, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded (+94 more)

### Community 163 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 165 - "private/lockstep-wait.test.ts"
Cohesion: 0.17
Nodes (14): ExpectedWait, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf(), rowsIn(), sampleWait() (+6 more)

### Community 17 - "process-admin.ts"
Cohesion: 0.04
Nodes (98): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+90 more)

### Community 171 - "TransactionHistoryEntry"
Cohesion: 0.22
Nodes (8): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends, 3.1 Field mapping (write path)

### Community 177 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 178 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 18 - "tape/index.ts"
Cohesion: 0.05
Nodes (75): Link, CompletenessRange, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json (+67 more)

### Community 181 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 182 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 183 - "Worker"
Cohesion: 0.21
Nodes (3): Worker, 9.2 Browser build (BR), 9. Backups and browser

### Community 189 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 19 - ".from"
Cohesion: 0.02
Nodes (63): HandSocket, HandSockets, Answer, FakeNode, Handler, Received, recorded, ManualTimers (+55 more)

### Community 190 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 191 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 195 - "tape.ts"
Cohesion: 0.26
Nodes (12): TapeError, changedLines(), checkRecord(), isPlainObject(), recordLine(), sessionCheck(), deepFreeze(), readLine() (+4 more)

### Community 197 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 2 - "FinalizedLoop"
Cohesion: 0.02
Nodes (99): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+91 more)

### Community 20 - "BlockRef"
Cohesion: 0.04
Nodes (34): BlockHeaderItem, BlockEventSource, BodyExtrinsic, BlockBody, BlockItemSource, CoreBlockHeader, CoreBlockItems, HeadWait (+26 more)

### Community 202 - "pglite-directory-fixtures.ts"
Cohesion: 0.18
Nodes (7): ProcessObservation, committedIn(), processProblems(), rowsIn(), S, control, @electric-sql/pglite

### Community 203 - "text.test.ts"
Cohesion: 0.23
Nodes (6): BackupText, blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir

### Community 204 - "Session"
Cohesion: 0.22
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 205 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 206 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 208 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 209 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 21 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (93): EventSpec, Call, SeenLoad, ledgerScenario, LedgerTx, RawPackageClass, recordedGenesis, TasksRun (+85 more)

### Community 213 - "Heartbeat"
Cohesion: 0.27
Nodes (5): Heartbeat, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 219 - "extrinsics.ts"
Cohesion: 0.27
Nodes (9): ExtrinsicCall, MetadataPallet, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), decodeExtrinsics(), isCompactU64() (+1 more)

### Community 22 - "ref_node_fs"
Cohesion: 0.07
Nodes (63): BackupBackend, killedRestore, WORKER, SignalEvent, cliProject, a176Project(), catalogOf(), connectionOf() (+55 more)

### Community 220 - "scale-value.ts"
Cohesion: 0.18
Nodes (9): MetadataField, MetadataType, Primitive, hexOf(), littleEndian(), BIT_STORES, INTEGERS, MAX_DEPTH (+1 more)

### Community 222 - "ledger/plain-data.test.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 23 - "validate.ts"
Cohesion: 0.04
Nodes (87): coreEntry, ConfigRule, CursorRule, EntryRef, Finding, Issue, Plain, SettingsSchema (+79 more)

### Community 235 - "type-check.ts"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 24 - "devnet-upgrade.test.ts"
Cohesion: 0.05
Nodes (63): Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch (+55 more)

### Community 25 - "ref_node_crypto"
Cohesion: 0.03
Nodes (77): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+69 more)

### Community 251 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "adapter.ts"
Cohesion: 0.04
Nodes (67): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+59 more)

### Community 27 - "process-backends.ts"
Cohesion: 0.06
Nodes (77): FixtureRun, ingest, TableSnapshot, FixtureNode, RefusalData, ProcessBackend, a168Problems(), refusalHalt() (+69 more)

### Community 28 - "core-transport.ts"
Cohesion: 0.05
Nodes (54): ResultColumn, Session, TransportLimits, TransportTls, Hello, HelloAck, JsonValue, Read (+46 more)

### Community 29 - "builder.test.ts"
Cohesion: 0.04
Nodes (38): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Metadata, Step, Frame (+30 more)

### Community 3 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (144): InMemoryBlockSource, InMemoryItems, Wait, Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation (+136 more)

### Community 30 - ".read"
Cohesion: 0.04
Nodes (68): SchemaPlan, Chain, ChainOptions, DigestRow, Op, States, TableName, identityRow() (+60 more)

### Community 31 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (63): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, LedgerStateItem, RetainedState, retainedStates, CoreRevision, GreyPicker (+55 more)

### Community 32 - "LedgerPackage"
Cohesion: 0.06
Nodes (34): LedgerPackage, LedgerTaskBlock, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, stagenetReplay, hexOf() (+26 more)

### Community 33 - "range.ts"
Cohesion: 0.05
Nodes (60): Refusal, TapeBuilder, TapeBuilderOptions, Arguments, Command, TapeCommandIo, RecordingError, Final (+52 more)

### Community 34 - "ingest-harness.ts"
Cohesion: 0.05
Nodes (48): Manifest, Restored, MetadataBlock, RuntimeMetadata, RuntimeMetadataEntry, SourceClass, watched, OwnStateMetadata (+40 more)

### Community 35 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (58): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, rowToEntry(), reason(), Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout (+50 more)

### Community 36 - "column-rules.ts"
Cohesion: 0.04
Nodes (74): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+66 more)

### Community 37 - "cli/command.ts"
Cohesion: 0.05
Nodes (49): BackupWritten, CommandHandler, CommandIo, MainProcess, backupSignalRelay, RunOptions, RunSeams, SignalSource (+41 more)

### Community 38 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (60): ProcessConfig, Answered, Start, Refusal, Start, listenError(), startAdminServer(), startProcess() (+52 more)

### Community 39 - "vitest"
Cohesion: 0.04
Nodes (49): Lockfile, Manifest, RepositoryFile, Upstream, Leftover, RemovedName, ReportedTest, canPin() (+41 more)

### Community 4 - "config/history.ts"
Cohesion: 0.02
Nodes (155): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettings, CoreSettingsBase (+147 more)

### Community 40 - "backup/backup.ts"
Cohesion: 0.07
Nodes (57): BackupInput, BackupSeams, BackupTarget, BackupFacts, ManifestHistoryRow, ManifestMigration, ManifestTool, DumpInput (+49 more)

### Community 41 - "halts.test.ts"
Cohesion: 0.05
Nodes (55): ChainDataView, Seen, A43Case, Outcome, Process, A47Observation, CommitsTheBoundary, Version (+47 more)

### Community 42 - "intake.test.ts"
Cohesion: 0.07
Nodes (52): PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation, A116Observation (+44 more)

### Community 43 - "validation.ts"
Cohesion: 0.03
Nodes (60): LedgerTableSettings, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, PlacedDeclaration, Plain, Absent, DeepReadonly (+52 more)

### Community 44 - "ledger-sweep.test.ts"
Cohesion: 0.06
Nodes (31): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, ChildReader, NodeBatch, Block (+23 more)

### Community 45 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (50): CallArgsItem, CallArguments, taskSeen, V9Raw, boundHost(), frozen(), resultsOf(), withItems() (+42 more)

### Community 46 - "range.test.ts"
Cohesion: 0.05
Nodes (31): Script, ScriptedNode, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, quietConnect() (+23 more)

### Community 47 - "private/backends.ts"
Cohesion: 0.07
Nodes (44): PrivateBackend, SessionSeen, A162Options, a162Run, HeaderSeen, Pause, SkipsLockstep, InstancesOptions (+36 more)

### Community 48 - "transport.test.ts"
Cohesion: 0.06
Nodes (40): Message, transportReaderFacts, TestCertificates, Ended, rawClient, Escape, publicState, Refused (+32 more)

### Community 49 - "ModuleDeclaration"
Cohesion: 0.06
Nodes (37): QueuedBlock, ModuleDeclaration, GraphFacts, ResolvedGraph, BlockItems, MisuseListener, ProcessContextsInput, PublishRefusal (+29 more)

### Community 5 - "runner/process.ts"
Cohesion: 0.02
Nodes (77): Bound, ChainIdentity, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, LoadOptions (+69 more)

### Community 50 - "writer-lock-checks.ts"
Cohesion: 0.07
Nodes (45): CreatedDirectory, Held, WriterProcess, Job, WorkerEvent, PauseReport, acquirePgliteLock(), directoryPath() (+37 more)

### Community 51 - "transform-checks.ts"
Cohesion: 0.09
Nodes (37): Failure, Variant, TransformError, NotificationRange, until(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect() (+29 more)

### Community 52 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+41 more)

### Community 53 - "database-parts.ts"
Cohesion: 0.05
Nodes (41): CheckStep, DatabaseParts, PostgresPartsInput, TickerConfig, PausableConfig, PrivateConfig, CheckTarget, CliBackend (+33 more)

### Community 54 - "signal-ignored-fixtures.ts"
Cohesion: 0.06
Nodes (44): ConfigCheckReport, ListenedRun, WorkerSignals, RunningCommand, statsConfig, listenerProblems(), namesUnder(), pacedNode() (+36 more)

### Community 55 - "binding.test.ts"
Cohesion: 0.07
Nodes (46): startHashDecision, StartHashes, A165Options, a165Run, Attempt, TestDatabase, A113Observation, A156Observation (+38 more)

### Community 56 - "networks.ts"
Cohesion: 0.05
Nodes (47): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+39 more)

### Community 57 - "cbor.ts"
Cohesion: 0.08
Nodes (46): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+38 more)

### Community 59 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+24 more)

### Community 6 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (132): ApplyInput, ApplyOutput, LedgerEvent, LogItem, StateSummary, StoredNode, TransactionResult, VmLog (+124 more)

### Community 60 - "version-checks.ts"
Cohesion: 0.10
Nodes (39): MetadataNode, LedgerTable, Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase (+31 more)

### Community 61 - "config-check.ts"
Cohesion: 0.07
Nodes (43): CoreChainFacts, RestoreBase, CheckFinding, CheckState, ConfigCheckOptions, ConfigCheckSeams, StepName, StepReport (+35 more)

### Community 62 - "module-tables.ts"
Cohesion: 0.08
Nodes (33): CanonicalEncodingFailure, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ColumnType, RefusalCode (+25 more)

### Community 63 - "pause-fixtures.ts"
Cohesion: 0.08
Nodes (35): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, PausesInsideTheHeight (+27 more)

### Community 64 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (38): StandInOptions, Commit, AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock(), hex(), sameBytes() (+30 more)

### Community 65 - "graph.ts"
Cohesion: 0.07
Nodes (46): Edge, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts, Spanned (+38 more)

### Community 66 - "net.test.ts"
Cohesion: 0.08
Nodes (20): IncomingMessage, Server, Emitter, Frame, Listener, PortSocket, PortUpgrade, RawData (+12 more)

### Community 67 - "mapping.ts"
Cohesion: 0.07
Nodes (32): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+24 more)

### Community 68 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 7 - "loop.test.ts"
Cohesion: 0.03
Nodes (119): EntryRange, GraphInput, LockstepWait, PastFaultCase, RefusalCase, Contexts, Faults, Seen (+111 more)

### Community 70 - "client.ts"
Cohesion: 0.11
Nodes (39): State, Subscription, NodeBlock, NodeHeader, NodeRuntimeVersion, NodeCallMethod, SubscribeMethod, backoffDelay() (+31 more)

### Community 72 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 73 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (31): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+23 more)

### Community 76 - "restore-private.ts"
Cohesion: 0.09
Nodes (32): RestoreSeams, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome, BackupDatabase, RestoreJob, FileProcess (+24 more)

### Community 77 - "openPostgres"
Cohesion: 0.08
Nodes (21): PostgresParts, Phase, PostgresTestDatabase, PostgresTestServer, Job, openPostgres(), postgresBackend(), databaseAs() (+13 more)

### Community 8 - "api-server.test.ts"
Cohesion: 0.03
Nodes (104): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ModuleTableOptions, Connection, HeadersArgument, ModuleApiServer (+96 more)

### Community 80 - "pglite.ts"
Cohesion: 0.10
Nodes (19): ReadOptions, MultiStatementRunner, Job, JobQueue, PgliteDatabase, ServerErrorFields, handleClosed(), statementRefused() (+11 more)

### Community 81 - "column-refusals.test.ts"
Cohesion: 0.09
Nodes (21): ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase(), hashOf() (+13 more)

### Community 82 - "pack-install.mjs"
Cohesion: 0.09
Nodes (35): Surface, SmokeFailure, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12() (+27 more)

### Community 83 - "messages.ts"
Cohesion: 0.07
Nodes (34): Committed, MessageFault, MessageType, Parsed, bytesOf(), decodeParameter(), decodeValue(), describe() (+26 more)

### Community 84 - "backup/restore.ts"
Cohesion: 0.11
Nodes (35): PublicIdentity, Checked, PublicSide, RestoreChain, RestoreInput, RestoreTarget, createReadStream(), bindingRefusal() (+27 more)

### Community 86 - "pg-tx-history-adapter.ts"
Cohesion: 0.08
Nodes (26): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue() (+18 more)

### Community 9 - "db/errors.ts"
Cohesion: 0.03
Nodes (98): LoadedConfig, LoadOptions, PostgresConnection, PostgresOptions, Database, ReadOnlyDatabase, ReadTimeoutSetting, ErrorCode (+90 more)

### Community 91 - "durability-probe.test.ts"
Cohesion: 0.12
Nodes (27): BenchEnv, DurabilityProbeOptions, DurabilityViolation, ProbeSession, PostgresOptions, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites() (+19 more)

### Community 92 - "openPglite"
Cohesion: 0.08
Nodes (28): ConfiguredDatabase, ConfiguredDatabaseOptions, DatabaseState, ReadDatabaseOptions, ConfiguredDatabaseOptions, CommittedHeight, PgliteLockUse, PgliteOptions (+20 more)

### Community 94 - ".close"
Cohesion: 0.12
Nodes (11): HeadSubscriber, NodeRetry, Pending, Waiter, connectionFailure, NodeMethod, isRecord(), isRetryable() (+3 more)

### Community 95 - "boundary.test.ts"
Cohesion: 0.15
Nodes (32): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+24 more)

### Community 96 - "order.property.test.ts"
Cohesion: 0.09
Nodes (30): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce() (+22 more)

### Community 97 - "page.ts"
Cohesion: 0.07
Nodes (28): PageState, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog(), backUp(), beginCore() (+20 more)

### Community 98 - "paused-harness.ts"
Cohesion: 0.13
Nodes (29): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, commandBuild() (+21 more)

### Community 99 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (31): CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical() (+23 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): Private modules, ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database (+21 more)

### Community 156 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.10
Nodes (19): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions (+11 more)

### Community 185 - "refused"
Cohesion: 0.18
Nodes (11): refused(), When a callback fails, The node on `/status`, 7. Storage helpers, Requirement: AE-3 States and conditions, Requirement: AE-5 `/status` and `/config` contents, Scenario: A fault of the build's declarations ends the process, Scenario: A paused loop (+3 more)

### Community 107 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (29): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+21 more)

### Community 125 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.14
Nodes (16): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), registerSuiteLifecycle(), startTestDatabase(), stopTestDatabase(), EXPECTED_NIGHT_VALUE (+8 more)

### Community 128 - "1. Determinism primitives"
Cohesion: 0.08
Nodes (25): databaseRefusals(), explain(), explainRefusal(), refusalMessage(), relationRefusals(), tableRefusals(), Cleanup, scoped-review-manifest (+17 more)

### Community 136 - "recordRange"
Cohesion: 0.17
Nodes (11): positive(), hashParameter(), blockUnavailable(), askingAgain(), pass(), passFence(), walkOver(), recordBlockZero() (+3 more)

### Community 154 - "UmbraDB module guide"
Cohesion: 0.10
Nodes (22): fakePackage(), regular(), system(), Chain events, transactions and their outcomes, Contract states and contract logs, Cursor tables, Data that is not a function of the chain, Height-versioned tables (+14 more)

### Community 160 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (21): ownerOnlyFile(), chmod(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process (+13 more)

### Community 164 - ".query"
Cohesion: 0.23
Nodes (18): a76Problems(), heightsIn(), a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows(), expectedStates() (+10 more)

### Community 166 - "T"
Cohesion: 0.12
Nodes (18): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Scenario: Version and timestamp addressing agree, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape (+10 more)

### Community 169 - "writer-lock.negative-control.test.ts"
Cohesion: 0.21
Nodes (14): opened(), loginOn(), expectLockLostWhenTakenMeanwhile(), expectLockRetakenAfterTermination(), expectSecondPostgresWriterRefused(), lockReleased(), nextTransaction(), pidOf() (+6 more)

### Community 170 - "migrations"
Cohesion: 0.11
Nodes (16): migrations(), Migrations, 6. Storage helpers, 0. Preconditions and schema, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes (+8 more)

### Community 184 - ".slowBlockMs"
Cohesion: 0.18
Nodes (12): 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix, 00043 — slow-block-outside.negative-control.test.ts's 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+4 more)

### Community 186 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (13): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+5 more)

### Community 188 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 196 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 210 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 236 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 238 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 241 - "v9"
Cohesion: 0.38
Nodes (6): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix, Blocks from the node

### Community 242 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 270 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 309 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 58 - "history"
Cohesion: 0.05
Nodes (50): integer(), history(), Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Scenario: A call with an already-aborted signal is rejected before any database work, Scenario: A label given at save time is returned by history and load, Scenario: A signal aborting after the call has begun does not interrupt it (+42 more)

### Community 69 - "code"
Cohesion: 0.05
Nodes (43): code(), Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in) (+35 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 88 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 89 - ".put"
Cohesion: 0.06
Nodes (32): coreBlockFetchOnFetch(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+24 more)

### Community 93 - "version"
Cohesion: 0.06
Nodes (33): version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5) (+25 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 105 - "Repository agent policy"
Cohesion: 0.06
Nodes (24): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, Captured transcript (+16 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points, Requirement: RN-2 The runner does only its five duties (+22 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 130 - "package.json"
Cohesion: 0.07
Nodes (27): bin, umbradb, bugs, url, description, engines, node, exports (+19 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 145 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 146 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 159 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 161 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric` (+12 more)

### Community 162 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 172 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 173 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 174 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 175 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 176 - "UmbraDB"
Cohesion: 0.12
Nodes (17): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, License, Performance and ceilings, Schema and migrations, Security, Status (+9 more)

### Community 179 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 180 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 192 - "Backups"
Cohesion: 0.14
Nodes (13): A backup at the core's stop, A backup of a running process (SIGUSR2), A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Backups, Checking a configuration against its database, Restoring a backup (+5 more)

### Community 193 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 194 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 198 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 199 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 200 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 201 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 207 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 211 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 212 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 5. Full-sync soak + load-under-concurrent-prune (G10), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring (+3 more)

### Community 215 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 216 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 217 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 218 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 223 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 224 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 225 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 226 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure, Design — Sprint 2: Transaction/Lease (+1 more)

### Community 227 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 228 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 229 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 230 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 231 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.22
Nodes (8): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Problem, Suggested fix, Suggested fix

### Community 232 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 233 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 2. Envelope module (Pg-only — required gate), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 234 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 237 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 239 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 240 - "Our Pledge"
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

### Community 247 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 248 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 249 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 250 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 254 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 255 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 256 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 257 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 258 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 259 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 260 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 261 - "Tasks — Sprint 2: Transaction/Lease"
Cohesion: 0.33
Nodes (5): 0. `PgTransactionLeaseLayer` — transactions, 1. `PgTransactionLeaseLayer` — leases, 2. Wire `PgTemporalKV`'s `opts.tx`, 3. Sprint close-out, Tasks — Sprint 2: Transaction/Lease

### Community 262 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 263 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 264 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 265 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 266 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 267 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 268 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 269 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 271 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 272 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

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

### Community 278 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 279 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 280 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 281 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 282 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 283 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 284 - "00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask"
Cohesion: 0.40
Nodes (4): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix

### Community 285 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 286 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

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

### Community 298 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 299 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 300 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 301 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 302 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 303 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 304 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

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

### Community 71 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 85 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

## Knowledge Gaps
- **55 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `@stryker-mutator/core` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3698 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UmbraError`, `admin-harness.ts`, `FinalizedLoop`, `InMemoryBlockSource`, `config/history.ts`, `runner/process.ts`, `adapter-fixtures.ts`, `loop.test.ts`, `api-server.test.ts`, `db/errors.ts`, `contract-data-checks.ts`, `declaration.ts`, `chain-placement.test.ts`, `NodeClient`, `builds.ts`, `host.ts`, `fetch-fixtures.ts`, `process-admin.ts`, `tape/index.ts`, `.from`, `core-block-parsed.ts`, `ref_node_fs`, `validate.ts`, `devnet-upgrade.test.ts`, `ref_node_crypto`, `adapter.ts`, `process-backends.ts`, `core-transport.ts`, `builder.test.ts`, `.read`, `core-ledger-state.ts`, `ingest-harness.ts`, `cli/command.ts`, `refused-configuration.test.ts`, `backup/backup.ts`, `halts.test.ts`, `intake.test.ts`, `validation.ts`, `ledger-sweep.test.ts`, `ledger/ledger-tasks.test.ts`, `range.test.ts`, `private/backends.ts`, `transport.test.ts`, `ModuleDeclaration`, `writer-lock-checks.ts`, `transform-checks.ts`, `slow-block-harness.ts`, `database-parts.ts`, `signal-ignored-fixtures.ts`, `binding.test.ts`, `networks.ts`, `column-rules.test.ts`, `version-checks.ts`, `config-check.ts`, `module-tables.ts`, `pause-fixtures.ts`, `core-block-commit.test.ts`, `net.test.ts`, `mapping.ts`, `retirement.test.ts`, `client.ts`, `real-tapes.ts`, `file-mode.test.ts`, `restore-private.ts`, `openPostgres`, `column-refusals.test.ts`, `pack-install.mjs`, `messages.ts`, `pg-tx-history-adapter.ts`, `durability-probe.test.ts`, `openPglite`, `boundary.test.ts`, `order.property.test.ts`, `cbor.property.test.ts`, `release-version.test.ts`, `browser/build.ts`, `browser.test.ts`, `src/ledger/identity.ts`, `src/db/postgres.ts`, `test/postgres/setup.ts`, `LoopPauses`, `src/config/load.ts`, `code-registry.ts`, `transaction-history-storage.property.test.ts`, `postgres/transaction-history-storage.ts`, `config/plain-data.ts`, `Lockstep`, `cold-boot-recovery.integration.test.ts`, `documents.ts`, `package.json`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `encodeCanonical`, `pglite-server.ts`, `node-bridge.ts`, `lockstep-refusals.test.ts`, `read-gate.ts`, `threat-model.test.ts`, `block-fetch-decode.test.ts`, `harness.ts`, `shims.test.ts`, `ws-mutual-tls.test.ts`, `private/lockstep-wait.test.ts`, `excluded-not-exported.test.ts`, `writer-lock.negative-control.test.ts`, `validation.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `twox.ts`, `worker-threads.test.ts`, `pglite-directory-fixtures.ts`, `text.test.ts`, `history.property.test.ts`, `component-table.test.ts`, `facade-merge-loader.ts`, `Heartbeat`, `transport-intake.test.ts`, `ledger/plain-data.test.ts`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `The ledger state`) actually correct?**
  _`UmbraError` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.020268133813950547 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `admin-harness.ts`, `FinalizedLoop`, `InMemoryBlockSource`, `config/history.ts`, `runner/process.ts`, `Writer`, `recordRange`, `db/errors.ts`, `contract-data-checks.ts`, `version-table.ts`, `api-server.test.ts`, `declaration.ts`, `builds.ts`, `loop.test.ts`, `fetch-fixtures.ts`, `process-admin.ts`, `NodeClient`, `.from`, `BlockRef`, `lockstep-refusals.test.ts`, `ref_node_fs`, `validate.ts`, `tape/index.ts`, `shims.test.ts`, `UmbraDB module guide`, `core-transport.ts`, `.read`, `core-ledger-state.ts`, `range.ts`, `ingest-harness.ts`, `refused-configuration.test.ts`, `backup/backup.ts`, `halts.test.ts`, `writer-lock.negative-control.test.ts`, `validation.ts`, `intake.test.ts`, `ledger/ledger-tasks.test.ts`, `transport.test.ts`, `ModuleDeclaration`, `writer-lock-checks.ts`, `validation.test.ts`, `slow-block-harness.ts`, `statementsOf`, `checkShape`, `binding.test.ts`, `transform-checks.ts`, `cbor.ts`, `version-checks.ts`, `config-check.ts`, `module-tables.ts`, `web-lock.ts`, `core-block-commit.test.ts`, `graph.ts`, `pause-fixtures.ts`, `mapping.ts`, `client.ts`, `pglite-directory-fixtures.ts`, `Session`, `openPostgres`, `restore-private.ts`, `host.ts`, `pglite.ts`, `backup/restore.ts`, `durability-probe.test.ts`, `openPglite`, `.close`, `src/ledger/identity.ts`, `src/db/postgres.ts`, `src/config/load.ts`, `config/plain-data.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024204702627939143 - nodes in this community are weakly interconnected._