# Graph Report - UmbraDB

## Corpus Check
- 1034 files · ~1,484,055 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 11034 nodes · 33518 edges · 337 communities (307 shown, 30 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2587 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `93d7c1d26ef46f97` (1034 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- ModuleDeclaration
- opt-out.test.ts
- client.test.ts
- redact.ts
- cbor.property.test.ts
- .concat
- browser/build.ts
- dispatch.ts
- release-version.test.ts
- process-worker.ts
- order.property.test.ts
- vitest
- browser.test.ts
- TransactionHistoryEntry
- config-check-database.test.ts
- file-modes.ts
- ledger-storage.negative-control.test.ts
- ledger-sweep.test.ts
- node-fields-harness.ts
- run.test.ts
- tape/index.ts
- mapping.ts
- config/plain-data.ts
- height-versioned.property.test.ts
- test/postgres/setup.ts
- chain-events-source.test.ts
- documents.ts
- adapter-fixtures.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- check-required-tests.ts
- crash.test.ts
- Buffer
- pg-tx-history-adapter.ts
- api-server.ts
- read-gate.ts
- threat-model.test.ts
- UmbraError
- worker-threads.test.ts
- builder.ts
- manifest.ts
- sweep.ts
- core-config.test.ts
- .#process
- HeightRun
- checkShape
- catalog.ts
- browser-harness.ts
- chrome.ts
- key-handling-checks.ts
- host.ts
- lockstep-refusals.test.ts
- devnet-upgrade.test.ts
- worker-host.test.ts
- describeNodeStoreExports
- LoopPauses
- core-transport.ts
- validation.test.ts
- call
- Design — Sprint 1: project setup + TemporalKV
- process-admin.ts
- node-source.test.ts
- cursor-table.property.test.ts
- sha256
- Worker
- text.test.ts
- read-height.property.test.ts
- web-lock.ts
- .value
- no-indexer-or-wallet-sdk.test.ts
- db/errors.ts
- fetch-fixtures.ts
- ws-mutual-tls.test.ts
- history.property.test.ts
- component-table.test.ts
- .send
- ledger/types.ts
- type-check.ts
- childRefKeys
- Connection
- core-block-parsed.ts
- ProcessItems
- stats.ts
- page-server.ts
- adapter.ts
- .write
- ledger/plain-data.ts
- validation.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- validate.ts
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- loop-stop-harness.ts
- runner/process.ts
- TapeRecord
- .from
- aborted
- pglite.ts
- interfaces/transaction-history-storage.ts
- CliBackend
- contract-modules.test.ts
- https.ts
- NodeFS
- tools_tape_index_taperecord
- core-ledger-state.ts
- private/backends.ts
- ledger-tapes.ts
- connectWebSocket
- ingest-harness.ts
- version-checks.ts
- range.ts
- InMemoryBlockSource
- PgTransactionHistoryStorage
- process-backends.ts
- pause-fixtures.ts
- Process
- NodeBlockSource
- failures.ts
- startLedgerWorker
- networks.ts
- paused-harness.ts
- ledger/ledger-tasks.test.ts
- admin-harness.ts
- net.test.ts
- restore-ledger.ts
- intake.test.ts
- NodeClient
- binding.test.ts
- code
- containers.test.ts
- column-rules.ts
- column-rules.test.ts
- core-settings.ts
- ref_node_fs
- transport-faults.test.ts
- client.ts
- backup/backup.ts
- worker-storage.test.ts
- cold-boot-recovery.integration.test.ts
- FinalizedLoop
- config-check.ts
- PgliteDatabase
- graph.ts
- config/history.ts
- retirement.test.ts
- db/backends.ts
- chain-events-decode.test.ts
- BlockRef
- cbor.ts
- builds.ts
- LedgerEngine
- api-server.test.ts
- private/lockstep-wait.test.ts
- real-tapes.ts
- config-hash-checks.ts
- declaration.ts
- node-format.ts
- checks.test.ts
- vendored-ledger-v9.test.ts
- page.ts
- boundary.test.ts
- ADDED Requirements
- refused
- Design — Sprint 3: CheckpointStore
- Problem
- table
- mapping.test.ts
- .slowBlockMs
- 15. Backups
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- T
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- UmbraDB module guide
- fault
- twox.ts
- Design — v1.1.0: Quint model checking
- openssl
- UmbraDB third-party component inventory (SBOM)
- path.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- ledger-identity.test.ts
- orphan-watcher.mjs
- run
- fresh-instance.mjs
- crash-worker.ts
- ledger-storage.test.ts
- history
- ADDED Requirements
- core-private-source.test.ts
- version
- graph.py
- .put
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Repository agent policy
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- Boundaries, threats and controls
- stryker.conf.json
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Design — Sprint 4: Watermarks
- explore.md
- UmbraDB software supply-chain directory
- ADDED Requirements
- Design — Sprint 2: Transaction/Lease
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
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
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 2: Transaction/Lease
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
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
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
- UmbraDB
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 353 edges
2. `UmbraError` - 310 edges
3. `ModuleDeclaration` - 174 edges
4. `FinalizedLoop` - 131 edges
5. `InMemoryBlockSource` - 116 edges
6. `NodeClient` - 113 edges
7. `Database` - 99 edges
8. `BlockRef` - 94 edges
9. `ReadHandle` - 86 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (337 total, 30 thin omitted)

### Community 0 - "ModuleDeclaration"
Cohesion: 0.02
Nodes (206): RestoreBase, Database, ReadOnlyDatabase, AppliedMigration, ItemSink, ModuleDeclaration, PointName, Revision (+198 more)

### Community 1 - "opt-out.test.ts"
Cohesion: 0.02
Nodes (192): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, SchemaPlan, CanonicalEncodingError, ChangeKind, tableChanges (+184 more)

### Community 10 - "client.test.ts"
Cohesion: 0.03
Nodes (68): Connection, NodeClientOptions, NodeSocket, NodeSocketEvents, SocketFailure, HandSocket, HandSockets, Answer (+60 more)

### Community 100 - "redact.ts"
Cohesion: 0.10
Nodes (27): RedactionForms, SecretForm, TextPattern, Needs, findings(), configRedactor(), credentialsIn(), decoded() (+19 more)

### Community 101 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 102 - ".concat"
Cohesion: 0.07
Nodes (23): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+15 more)

### Community 104 - "browser/build.ts"
Cohesion: 0.08
Nodes (24): BrowserBuildOptions, BrowserControl, CheckedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+16 more)

### Community 106 - "dispatch.ts"
Cohesion: 0.13
Nodes (25): Callback, EntryBoundary, ParallelPoint, PointSchedule, CoreStopsFirst, boundaryModules(), dispatch(), entryIdOf() (+17 more)

### Community 107 - "release-version.test.ts"
Cohesion: 0.12
Nodes (32): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+24 more)

### Community 108 - "process-worker.ts"
Cohesion: 0.12
Nodes (23): Scope, crossedError, StartRun, ToProcessWorker, openedProcess, adminAnswer(), messageAdmin(), withDevelopmentOptIn() (+15 more)

### Community 109 - "order.property.test.ts"
Cohesion: 0.10
Nodes (30): CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce(), checkParallelWaits() (+22 more)

### Community 11 - "vitest"
Cohesion: 0.02
Nodes (90): ParentJob, Kill, Orphaned, SourceFile, Finding, Run, WorkerEvent, Lockfile (+82 more)

### Community 110 - "browser.test.ts"
Cohesion: 0.10
Nodes (30): Reachable, RestoreAttempt, PageRestore, continuedProblems(), midChainProblems(), networkProblems(), plain(), restoreProblems() (+22 more)

### Community 111 - "TransactionHistoryEntry"
Cohesion: 0.11
Nodes (10): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, 4. Wiring `PgTemporalKV`'s `opts.tx`, 2. `set` (+2 more)

### Community 112 - "config-check-database.test.ts"
Cohesion: 0.09
Nodes (22): CheckStep, ConfigCheckReport, CheckTarget, configCheck(), configText(), coreSettings(), inChild(), lineOf() (+14 more)

### Community 113 - "file-modes.ts"
Cohesion: 0.09
Nodes (25): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+17 more)

### Community 116 - "ledger-storage.negative-control.test.ts"
Cohesion: 0.13
Nodes (26): Call, SeenLoad, coreLedgerState(), writeSweep(), until(), cappedAt(), firstParam(), hashAt() (+18 more)

### Community 117 - "ledger-sweep.test.ts"
Cohesion: 0.13
Nodes (15): SweepState, SweepWrites, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel, sweepReset() (+7 more)

### Community 118 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (24): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Run() (+16 more)

### Community 119 - "run.test.ts"
Cohesion: 0.11
Nodes (19): RunningCommand, statsConfig, check(), write(), exitWithin(), runCoreSettings(), runInChild(), statsModule() (+11 more)

### Community 12 - "tape/index.ts"
Cohesion: 0.05
Nodes (85): Failure, Variant, TapeError, TapeProblem, TransformError, TransformProblem, NotJsonError, Connection (+77 more)

### Community 120 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+19 more)

### Community 121 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 122 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (21): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+13 more)

### Community 123 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 127 - "chain-events-source.test.ts"
Cohesion: 0.08
Nodes (16): NodeCallOptions, RecordingClient, open(), quiet(), a, b, fence(), open() (+8 more)

### Community 128 - "documents.ts"
Cohesion: 0.12
Nodes (26): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+18 more)

### Community 13 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (95): ApplyInput, recordedGenesis, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot (+87 more)

### Community 130 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.08
Nodes (21): ReadPool, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider) (+13 more)

### Community 131 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 132 - "crash.test.ts"
Cohesion: 0.12
Nodes (22): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+14 more)

### Community 133 - "Buffer"
Cohesion: 0.11
Nodes (19): Buffer, BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64() (+11 more)

### Community 135 - "pg-tx-history-adapter.ts"
Cohesion: 0.12
Nodes (21): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+13 more)

### Community 136 - "api-server.ts"
Cohesion: 0.11
Nodes (24): HeadersArgument, ModuleApiServer, ModuleApiServerOptions, answerHead(), coreHeaders(), coreHeadersResponse(), isCoreHeader(), listenModuleApi() (+16 more)

### Community 137 - "read-gate.ts"
Cohesion: 0.15
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 139 - "threat-model.test.ts"
Cohesion: 0.14
Nodes (23): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+15 more)

### Community 14 - "UmbraError"
Cohesion: 0.04
Nodes (80): LoadedConfig, LoadOptions, PostgresConnection, PostgresOptions, Bound, ChainCheck, ChainCheckInput, ChainSource (+72 more)

### Community 140 - "worker-threads.test.ts"
Cohesion: 0.09
Nodes (13): Listener, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread, parentPort (+5 more)

### Community 146 - "builder.ts"
Cohesion: 0.13
Nodes (11): Refusal, Link, TapeBuilder, TapeBuilderOptions, RecordingError, SessionEnd, withBuilder(), frameText() (+3 more)

### Community 148 - "manifest.ts"
Cohesion: 0.15
Nodes (17): ManifestHistoryRow, ManifestMigration, ManifestTool, MetaCommands, Piece, State, StatementSplitter, formatUnknown() (+9 more)

### Community 149 - "sweep.ts"
Cohesion: 0.13
Nodes (12): GreyView, SweepPhase, SweepTables, byBytes(), BYTE_ORDER(), hexOf(), merged(), sweepStep() (+4 more)

### Community 15 - "core-config.test.ts"
Cohesion: 0.04
Nodes (71): adminRoutes, AdminChannel, AdminServeOptions, ToAdmin, AdminStartOptions, AdminAnswer, AdminEndpoint, AdminPart (+63 more)

### Community 150 - ".#process"
Cohesion: 0.13
Nodes (4): Activity, LoopObserver, cursorText(), tracked()

### Community 151 - "HeightRun"
Cohesion: 0.10
Nodes (9): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, WaitsInTransaction (+1 more)

### Community 154 - "checkShape"
Cohesion: 0.23
Nodes (12): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+4 more)

### Community 156 - "catalog.ts"
Cohesion: 0.11
Nodes (20): CatalogColumn, CatalogOptions, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference, defaultCatalog() (+12 more)

### Community 157 - "browser-harness.ts"
Cohesion: 0.20
Nodes (19): PageBackup, PageEvent, ProcessName, StatusBody, backupThrough(), byDeadline(), call(), eventsOf() (+11 more)

### Community 158 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 159 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 16 - "host.ts"
Cohesion: 0.05
Nodes (74): LoadLedger, LedgerStateItem, RetainedState, LedgerName, LedgerTask, LedgerTaskBlock, NodeBatch, ParsedTransaction (+66 more)

### Community 161 - "lockstep-refusals.test.ts"
Cohesion: 0.21
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+10 more)

### Community 162 - "devnet-upgrade.test.ts"
Cohesion: 0.17
Nodes (13): Side, TapeAnswers, FoundTape, found(), nodeRootAt(), recording(), replay(), expectTableHolds() (+5 more)

### Community 163 - "worker-host.test.ts"
Cohesion: 0.13
Nodes (16): SlowStep, TestLoaderData, beat(), countDeserializations(), hexOf(), loadLedger(), applyBlock(), at() (+8 more)

### Community 164 - "describeNodeStoreExports"
Cohesion: 0.17
Nodes (4): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports()

### Community 169 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 17 - "core-transport.ts"
Cohesion: 0.04
Nodes (70): PublicSide, ResultColumn, Session, TransportLimits, TransportTls, Committed, Hello, HelloAck (+62 more)

### Community 176 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 177 - "call"
Cohesion: 0.18
Nodes (4): UnexpectedCursor, call(), isBlock(), sameBytes()

### Community 178 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 18 - "process-admin.ts"
Cohesion: 0.05
Nodes (76): ConfigFacts, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, DigestRow (+68 more)

### Community 180 - "node-source.test.ts"
Cohesion: 0.15
Nodes (10): Opened, cursorRead(), open(), passFence(), quiet(), sameHash(), NEW_HEADS, chain (+2 more)

### Community 181 - "cursor-table.property.test.ts"
Cohesion: 0.17
Nodes (15): Access, Block, BlockFails, Counts, Write, canonicalText(), expectValue(), holds() (+7 more)

### Community 182 - "sha256"
Cohesion: 0.20
Nodes (7): Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 183 - "Worker"
Cohesion: 0.21
Nodes (3): Worker, 9.2 Browser build (BR), 9. Backups and browser

### Community 186 - "text.test.ts"
Cohesion: 0.20
Nodes (8): BackupText, firstLine(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir

### Community 187 - "read-height.property.test.ts"
Cohesion: 0.20
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+2 more)

### Community 188 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 19 - ".value"
Cohesion: 0.06
Nodes (65): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef (+57 more)

### Community 195 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 2 - "db/errors.ts"
Cohesion: 0.02
Nodes (169): SchemaWriteHandle, ReadTimeoutSetting, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner (+161 more)

### Community 20 - "fetch-fixtures.ts"
Cohesion: 0.05
Nodes (81): ProcessCondition, ArgType, BlockOptions, CallSpec, RUNTIME, Decoded, FetchSeen, A84Observation (+73 more)

### Community 200 - "ws-mutual-tls.test.ts"
Cohesion: 0.21
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 201 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 202 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 21 - "ledger/types.ts"
Cohesion: 0.04
Nodes (60): AdapterSpec, LedgerRelease, LedgerReleasePackage, ApplyOutput, LedgerEvent, LedgerPackage, LedgerPackageOptions, LogItem (+52 more)

### Community 215 - "type-check.ts"
Cohesion: 0.31
Nodes (8): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), isRegularFile(), packageType(), typeCheckFile(), typescript

### Community 216 - "childRefKeys"
Cohesion: 0.40
Nodes (3): ChildReader, childRefKeys(), readChildren()

### Community 217 - "Connection"
Cohesion: 0.35
Nodes (4): Connection, errorMessage(), encodeJson(), hex()

### Community 22 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (83): BlockEventSource, BodyExtrinsic, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsedOptions, BlockTransaction, TransactionParser (+75 more)

### Community 226 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 227 - "page-server.ts"
Cohesion: 0.28
Nodes (6): BrowserBuild, pageBench, PageServer, servePage(), ISOLATION_HEADERS, TYPES

### Community 23 - "adapter.ts"
Cohesion: 0.04
Nodes (67): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+59 more)

### Community 232 - ".write"
Cohesion: 0.22
Nodes (5): IgnoresTheStop, PausesInsideTheHeight, StaysPaused, abortOf(), never()

### Community 237 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 24 - "validation.ts"
Cohesion: 0.03
Nodes (80): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, DatabasePartsInput, PgliteMemoryParts, TransportReader, coreEntry (+72 more)

### Community 246 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 25 - "validate.ts"
Cohesion: 0.04
Nodes (78): EntryView, plainData, ConfigContext, ConfigRule, CursorRule, EntryRef, EntryView, Issue (+70 more)

### Community 254 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 26 - "loop-stop-harness.ts"
Cohesion: 0.05
Nodes (61): privateIntake, backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, ProcessHandle (+53 more)

### Community 27 - "runner/process.ts"
Cohesion: 0.04
Nodes (46): NodeWait, LoadOptions, PauseBy, PausedCondition, StartedProcess, upgradeBoundary, UpgradeCondition, WaitingCondition (+38 more)

### Community 28 - "TapeRecord"
Cohesion: 0.06
Nodes (40): Outage, Recorded, RecordingProblem, readRequest, RequestId, Json, TapeCall, TapeClock (+32 more)

### Community 29 - ".from"
Cohesion: 0.06
Nodes (72): ContractStateRow, CoreContractStatesOptions, Manifest, Restored, contractScenario, ContractScenarioOptions, DeployTx, LogLine (+64 more)

### Community 298 - "aborted"
Cohesion: 0.40
Nodes (3): DoesNotHold, EndsTheRun, aborted()

### Community 3 - "pglite.ts"
Cohesion: 0.02
Nodes (170): ReadDatabaseOptions, SslMode, ReadOptions, Transaction, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession (+162 more)

### Community 30 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (57): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus (+49 more)

### Community 31 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (61): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+53 more)

### Community 32 - "tools_tape_index_taperecord"
Cohesion: 0.05
Nodes (34): ConnectionFrames, Failure, Variant, WrongRecording, Metadata, Step, Frame, RawClient (+26 more)

### Community 33 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (59): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions, blockHeaderOf(), ledgerVersionOf(), writeBlockRow() (+51 more)

### Community 34 - "private/backends.ts"
Cohesion: 0.06
Nodes (42): PglitePathParts, transportReaderFacts, PrivateBackend, SessionSeen, InstancesOptions, instancesRun, Escape, publicState (+34 more)

### Community 35 - "ledger-tapes.ts"
Cohesion: 0.07
Nodes (66): BlockParsed, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime (+58 more)

### Community 36 - "connectWebSocket"
Cohesion: 0.05
Nodes (37): Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+29 more)

### Community 37 - "ingest-harness.ts"
Cohesion: 0.08
Nodes (56): FixtureRun, ingest, SourceClass, TableSnapshot, FixtureNode, FakeState, RefusalData, run() (+48 more)

### Community 38 - "version-checks.ts"
Cohesion: 0.07
Nodes (45): BlockHeaderItem, CoreBlockHeader, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, LedgerTable, OwnStateMetadata (+37 more)

### Community 39 - "range.ts"
Cohesion: 0.06
Nodes (60): ConnectSocket, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange (+52 more)

### Community 4 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (148): BlockSource, FinalityStallCondition, InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job (+140 more)

### Community 40 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (57): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built) (+49 more)

### Community 41 - "process-backends.ts"
Cohesion: 0.08
Nodes (56): BlockItemSource, LoopInput, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead (+48 more)

### Community 42 - "pause-fixtures.ts"
Cohesion: 0.07
Nodes (51): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, ListenedRun, WorkerSignals, backupAtPause(), eachHeightOnce() (+43 more)

### Community 43 - "Process"
Cohesion: 0.06
Nodes (21): CoreTransport, ProcessReason, RetryCode, PauseHold, Process, RetryCondition, SignalTarget, StatusFacts (+13 more)

### Community 44 - "NodeBlockSource"
Cohesion: 0.08
Nodes (19): CoreBlockItems, HeadWait, NodeBlockSource, Prefetch, NodeSubscription, NodeBlock, NodeHeader, PreparedBlock (+11 more)

### Community 45 - "failures.ts"
Cohesion: 0.05
Nodes (55): ReasonCode, Unwrapped, VitestConfig, CodeList, CodeTest, RegistryInput, Section11, TestLiterals (+47 more)

### Community 46 - "startLedgerWorker"
Cohesion: 0.06
Nodes (48): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, NodeDatabase, SentParses, ChangedFile, GenesisFixture (+40 more)

### Community 47 - "networks.ts"
Cohesion: 0.05
Nodes (57): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+49 more)

### Community 48 - "paused-harness.ts"
Cohesion: 0.06
Nodes (47): Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, SignalJob, invalid() (+39 more)

### Community 49 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.06
Nodes (47): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses(), expectedCallArgs(), plainWatchModule() (+39 more)

### Community 5 - "admin-harness.ts"
Cohesion: 0.03
Nodes (162): FromAdmin, AdminServer, AdminStarter, DatabaseParts, PostgresParts, PostgresPartsInput, ProcessConfig, ProcessInput (+154 more)

### Community 50 - "net.test.ts"
Cohesion: 0.06
Nodes (27): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortSocket (+19 more)

### Community 51 - "restore-ledger.ts"
Cohesion: 0.07
Nodes (50): RestoreInput, CrashEvent, CrashJob, IngestOptions, watched, RestartEvent, RestartJob, retentionSeen (+42 more)

### Community 52 - "intake.test.ts"
Cohesion: 0.08
Nodes (44): PrivateProcess, PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation (+36 more)

### Community 53 - "NodeClient"
Cohesion: 0.09
Nodes (25): NodeSourceOptions, CoreChainBinding, HeadSubscriber, NodeClient, Pending, connectionFailure, NodeMethod, NodeTimers (+17 more)

### Community 54 - "binding.test.ts"
Cohesion: 0.06
Nodes (46): startHashDecision, StartHashes, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding (+38 more)

### Community 55 - "code"
Cohesion: 0.04
Nodes (51): RepositoryFile, canPin(), code(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS (+43 more)

### Community 56 - "containers.test.ts"
Cohesion: 0.06
Nodes (36): BenchEnv, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, TlsPostgres, guardContainers(), removeAttempt() (+28 more)

### Community 57 - "column-rules.ts"
Cohesion: 0.04
Nodes (54): AllowedRule, Because, DesignRow, keyOrder, PlacedRefusal, RefusalCode, RefusalOptions, RefusedRule (+46 more)

### Community 58 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (27): columnVerdict, DefaultPart, Refusal, TableRule, TypeRule, DesignTable, becauseOf(), refusalOfTypeName() (+19 more)

### Community 59 - "core-settings.ts"
Cohesion: 0.05
Nodes (45): LedgerTableSettings, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, Absent, DeepReadonly, PrivateKeys, PrivateOnly (+37 more)

### Community 6 - "ref_node_fs"
Cohesion: 0.03
Nodes (125): RestoreChain, RestoreSeams, CommandHandler, CommandIo, MainProcess, Chain, RestoreCommandOptions, RestoreCommandSeams (+117 more)

### Community 60 - "transport-faults.test.ts"
Cohesion: 0.08
Nodes (38): Message, MessageType, TestCertificates, Ended, rawClient, codeOf(), mutualTlsOptions(), splitAddress() (+30 more)

### Community 61 - "client.ts"
Cohesion: 0.10
Nodes (39): NodeRetry, State, Subscription, Waiter, NodeRuntimeVersion, NodeCallMethod, SubscribeMethod, Final (+31 more)

### Community 62 - "backup/backup.ts"
Cohesion: 0.08
Nodes (47): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, DumpInput, PgliteDump, SnapshotSeams (+39 more)

### Community 63 - "worker-storage.test.ts"
Cohesion: 0.06
Nodes (36): ChainOutcome, NodeStore, StoredNode, EngineOptions, Thread, BridgeServer, bridgeStore, Growable (+28 more)

### Community 64 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (32): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+24 more)

### Community 65 - "FinalizedLoop"
Cohesion: 0.06
Nodes (17): FinalizedLoop, Startup, SkipsLockstep, WaitingInRead, ItemsAfterWrite, SilentHalt, EagerLoop, FailingAfter (+9 more)

### Community 67 - "config-check.ts"
Cohesion: 0.08
Nodes (41): CoreChainFacts, CheckFinding, CheckState, ConfigCheckOptions, ConfigCheckSeams, StepName, StepReport, StepStatus (+33 more)

### Community 68 - "PgliteDatabase"
Cohesion: 0.08
Nodes (11): JobQueue, PgliteDatabase, BoundedRead, Session, Writer, commitRolledBack(), handleClosed(), queryTimeout() (+3 more)

### Community 69 - "graph.ts"
Cohesion: 0.07
Nodes (45): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+37 more)

### Community 7 - "config/history.ts"
Cohesion: 0.03
Nodes (128): OpenedFacts, CoreVersion, ConfiguredDatabase, ConfiguredDatabaseOptions, CoreSettings, versionEntry, ConfigHashRow, HistoryCheck (+120 more)

### Community 70 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 71 - "db/backends.ts"
Cohesion: 0.07
Nodes (30): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, PgliteOptions, Settings, Case, LoadOutcome (+22 more)

### Community 72 - "chain-events-decode.test.ts"
Cohesion: 0.11
Nodes (34): Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, fill(), le() (+26 more)

### Community 73 - "BlockRef"
Cohesion: 0.07
Nodes (16): BlockLedgerSource, QueuedBlock, LedgerBinding, BlockItems, BlockRef, InMemorySourceOptions, EventsRunner, Fetching (+8 more)

### Community 74 - "cbor.ts"
Cohesion: 0.09
Nodes (37): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+29 more)

### Community 78 - "builds.ts"
Cohesion: 0.07
Nodes (34): PrivateIntakeOptions, PublicWakes, A165Options, PrivateOptions, PrivateRefusal, Pause, Q142Observation, A155Observation (+26 more)

### Community 79 - "LedgerEngine"
Cohesion: 0.12
Nodes (13): StateHandle, LedgerEngine, Settled, stagenetReplay, hexOf(), idOf(), same(), sameBytes() (+5 more)

### Community 8 - "api-server.test.ts"
Cohesion: 0.03
Nodes (91): ModuleApiServer, ModuleApiStart, StartedModuleApi, ModuleApiStart, ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode (+83 more)

### Community 81 - "private/lockstep-wait.test.ts"
Cohesion: 0.08
Nodes (24): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+16 more)

### Community 82 - "real-tapes.ts"
Cohesion: 0.09
Nodes (32): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+24 more)

### Community 86 - "config-hash-checks.ts"
Cohesion: 0.07
Nodes (21): Report, A162Options, a162Run, HeaderSeen, HeldLink, HoldingRelay, ReportRelay, RetargetProxy (+13 more)

### Community 9 - "declaration.ts"
Cohesion: 0.03
Nodes (88): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, ApiRegistry (+80 more)

### Community 92 - "node-format.ts"
Cohesion: 0.12
Nodes (23): Child, Reader, Readable, Reader, TableNode, node(), childKey(), concat() (+15 more)

### Community 94 - "checks.test.ts"
Cohesion: 0.08
Nodes (27): ModuleTableOptions, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, RelationFacts, optOut (+19 more)

### Community 95 - "vendored-ledger-v9.test.ts"
Cohesion: 0.13
Nodes (32): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, freeAll(), runInFreshInstance(), bigCell() (+24 more)

### Community 96 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 99 - "boundary.test.ts"
Cohesion: 0.14
Nodes (32): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+24 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): Private modules, ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database (+21 more)

### Community 134 - "refused"
Cohesion: 0.10
Nodes (21): refused(), 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix, A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration (+13 more)

### Community 155 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.10
Nodes (18): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions (+10 more)

### Community 252 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 124 - "table"
Cohesion: 0.07
Nodes (28): table(), Data that is not a function of the chain, Height-versioned tables, 14. Private processes, Requirement: DB-6 Each module's schema is guarded by its own database role, Scenario: Writing into another module's schema is rejected by the database, Requirement: LG-16 What `core-ledger-state` provides, Scenario: A partially successful transaction (+20 more)

### Community 144 - "mapping.test.ts"
Cohesion: 0.11
Nodes (12): mapRows(), mapValue(), parseJsonLossless(), oid(), identity(), RESULT_COLUMNS, RESULT_TYPES, RFC-3339 (+4 more)

### Community 153 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 160 - "15. Backups"
Cohesion: 0.14
Nodes (18): backupAtStop(), ownerOnlyFile(), chmod(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds (+10 more)

### Community 165 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (17): migrations(), Migrations, Requirement: DB-9 Bootstrap, migrations and setup, Scenario: A changed migration refuses startup, Scenario: The second of two migrations fails, 11. Chain data, 13. Contract data, 18. Whole-system faults, differentials and measurements (+9 more)

### Community 171 - "T"
Cohesion: 0.13
Nodes (16): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Scenario: Version and timestamp addressing agree, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape (+8 more)

### Community 172 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (14): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API, 3. Modules (+6 more)

### Community 185 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 189 - "UmbraDB module guide"
Cohesion: 0.14
Nodes (14): params(), Blocks from the node, Cursor tables, Process items and APIs, Reading through `db`, Running a module with the `umbradb` command, Start and stop heights, Stored values and digests (+6 more)

### Community 190 - "fault"
Cohesion: 0.14
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 194 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 199 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 204 - "openssl"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 210 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 233 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 235 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 247 - "ledger-identity.test.ts"
Cohesion: 0.53
Nodes (4): checkLedgerPackage(), checkLedgerPackages(), checkLedgerSources(), SUBSTITUTES

### Community 268 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 297 - "run"
Cohesion: 0.40
Nodes (5): run(), refusal(), failureReason(), failure(), refusalOf()

### Community 299 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 310 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 75 - "ledger-storage.test.ts"
Cohesion: 0.10
Nodes (41): heightsIn(), a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows(), expectedStates(), ledgerItemsWatcher() (+33 more)

### Community 76 - "history"
Cohesion: 0.06
Nodes (42): history(), n(), Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Scenario: A call with an already-aborted signal is rejected before any database work, Scenario: A label given at save time is returned by history and load, Scenario: A signal aborting after the call has begun does not interrupt it (+34 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 85 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (13): publicLockstepOf(), height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), CORE_PRIVATE_SOURCE_MIGRATIONS (+5 more)

### Community 89 - "version"
Cohesion: 0.06
Nodes (36): version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Scenario: The kv_current HOT ratio is measured and recorded under the soak workload, Scenario: The kv_current table reports fillfactor=90 after migration (+28 more)

### Community 93 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 97 - ".put"
Cohesion: 0.06
Nodes (33): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+25 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-17 Ledger tasks give modules the native objects (+26 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 114 - "Repository agent policy"
Cohesion: 0.06
Nodes (27): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, Captured transcript (+19 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+20 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 138 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 142 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 143 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 145 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 147 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+15 more)

### Community 152 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 168 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (18): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+10 more)

### Community 170 - "stryker.conf.json"
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

### Community 179 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 184 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 191 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 192 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 196 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 198 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 203 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 206 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 5. Full-sync soak + load-under-concurrent-prune (G10), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring (+3 more)

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

### Community 213 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 214 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 218 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 219 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 220 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 221 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure, Design — Sprint 2: Transaction/Lease (+1 more)

### Community 222 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 223 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 224 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 228 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 229 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.22
Nodes (8): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Problem, Suggested fix, Suggested fix

### Community 230 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 231 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 234 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 236 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 238 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 239 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 240 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 241 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 242 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 243 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 244 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 245 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 249 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 250 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 251 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 253 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 255 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 256 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 257 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 258 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 259 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease, What changes, Why

### Community 260 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 261 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 262 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 263 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 264 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 265 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 266 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 267 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 269 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 270 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 271 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 272 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 273 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 274 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 275 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 276 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 277 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 278 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 279 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

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

### Community 284 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 285 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 286 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 287 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 288 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 289 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 290 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 291 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 292 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 293 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 294 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 295 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 296 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 300 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 301 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

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

### Community 306 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 307 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 314 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 315 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 66 - "UmbraDB"
Cohesion: 0.04
Nodes (42): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased] (+34 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 88 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+30 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

## Knowledge Gaps
- **55 isolated node(s):** `RFC-8949`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `RFC-8949` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3671 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ModuleDeclaration`, `opt-out.test.ts`, `db/errors.ts`, `pglite.ts`, `InMemoryBlockSource`, `admin-harness.ts`, `ref_node_fs`, `config/history.ts`, `api-server.test.ts`, `declaration.ts`, `client.test.ts`, `tape/index.ts`, `adapter-fixtures.ts`, `core-config.test.ts`, `host.ts`, `core-transport.ts`, `process-admin.ts`, `.value`, `fetch-fixtures.ts`, `ledger/types.ts`, `core-block-parsed.ts`, `adapter.ts`, `validation.ts`, `validate.ts`, `loop-stop-harness.ts`, `runner/process.ts`, `TapeRecord`, `.from`, `interfaces/transaction-history-storage.ts`, `contract-modules.test.ts`, `tools_tape_index_taperecord`, `core-ledger-state.ts`, `private/backends.ts`, `ledger-tapes.ts`, `connectWebSocket`, `ingest-harness.ts`, `version-checks.ts`, `process-backends.ts`, `pause-fixtures.ts`, `Process`, `failures.ts`, `startLedgerWorker`, `networks.ts`, `paused-harness.ts`, `ledger/ledger-tasks.test.ts`, `net.test.ts`, `restore-ledger.ts`, `intake.test.ts`, `NodeClient`, `binding.test.ts`, `code`, `containers.test.ts`, `column-rules.test.ts`, `core-settings.ts`, `transport-faults.test.ts`, `worker-storage.test.ts`, `cold-boot-recovery.integration.test.ts`, `config-check.ts`, `retirement.test.ts`, `db/backends.ts`, `chain-events-decode.test.ts`, `ledger-storage.test.ts`, `builds.ts`, `private/lockstep-wait.test.ts`, `real-tapes.ts`, `core-private-source.test.ts`, `node-format.ts`, `checks.test.ts`, `vendored-ledger-v9.test.ts`, `boundary.test.ts`, `redact.ts`, `cbor.property.test.ts`, `browser/build.ts`, `release-version.test.ts`, `process-worker.ts`, `order.property.test.ts`, `browser.test.ts`, `config-check-database.test.ts`, `ledger-storage.negative-control.test.ts`, `ledger-sweep.test.ts`, `run.test.ts`, `config/plain-data.ts`, `height-versioned.property.test.ts`, `test/postgres/setup.ts`, `chain-events-source.test.ts`, `documents.ts`, `check-required-tests.ts`, `crash.test.ts`, `pg-tx-history-adapter.ts`, `read-gate.ts`, `package.json`, `threat-model.test.ts`, `worker-threads.test.ts`, `mapping.test.ts`, `manifest.ts`, `key-handling-checks.ts`, `lockstep-refusals.test.ts`, `devnet-upgrade.test.ts`, `worker-host.test.ts`, `LoopPauses`, `validation.test.ts`, `node-source.test.ts`, `cursor-table.property.test.ts`, `mutation-per-adapter.mjs`, `text.test.ts`, `read-height.property.test.ts`, `web-lock.ts`, `excluded-not-exported.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `ws-mutual-tls.test.ts`, `history.property.test.ts`, `component-table.test.ts`, `ledger-identity.test.ts`, `pglite.test.ts`?**
  _High betweenness centrality (0.191) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `The ledger state`) actually correct?**
  _`UmbraError` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ModuleDeclaration` be split into smaller, more focused modules?**
  _Cohesion score 0.019660805651507674 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `ModuleDeclaration`, `opt-out.test.ts`, `db/errors.ts`, `pglite.ts`, `InMemoryBlockSource`, `admin-harness.ts`, `ref_node_fs`, `config/history.ts`, `api-server.test.ts`, `declaration.ts`, `client.test.ts`, `tape/index.ts`, `mapping.test.ts`, `core-transport.ts`, `process-admin.ts`, `builder.ts`, `manifest.ts`, `fetch-fixtures.ts`, `host.ts`, `validation.ts`, `validate.ts`, `checkShape`, `runner/process.ts`, `TapeRecord`, `contract-modules.test.ts`, `15. Backups`, `core-ledger-state.ts`, `lockstep-refusals.test.ts`, `private/backends.ts`, `version-checks.ts`, `range.ts`, `process-backends.ts`, `aborted`, `Process`, `NodeBlockSource`, `failures.ts`, `startLedgerWorker`, `networks.ts`, `paused-harness.ts`, `pause-fixtures.ts`, `validation.test.ts`, `restore-ledger.ts`, `node-source.test.ts`, `NodeClient`, `sha256`, `binding.test.ts`, `core-settings.ts`, `web-lock.ts`, `client.ts`, `backup/backup.ts`, `transport-faults.test.ts`, `UmbraDB module guide`, `FinalizedLoop`, `config-check.ts`, `PgliteDatabase`, `graph.ts`, `db/backends.ts`, `BlockRef`, `cbor.ts`, `builds.ts`, `core-private-source.test.ts`, `checks.test.ts`, `process-worker.ts`, `mapping.ts`, `config/plain-data.ts`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `opt-out.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020143383740167765 - nodes in this community are weakly interconnected._