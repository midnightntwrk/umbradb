# Graph Report - UmbraDB

## Corpus Check
- 1248 files · ~1,787,401 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13085 nodes · 40500 edges · 388 communities (354 shown, 34 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3408 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `285d740a5734b110` (1248 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- UmbraError
- ledger/types.ts
- channel-queue.test.ts
- pglite.ts
- cbor.property.test.ts
- paused-harness.ts
- core-digest.ts
- browser.test.ts
- config-check.ts
- core-block-commit.test.ts
- Worker
- page.ts
- release-version.ts
- browser/build.ts
- entries.ts
- TransactionHistoryEntry
- binding.test.ts
- example-checks.ts
- code-registry.ts
- refcount-tables.test.ts
- node-fields-harness.ts
- process-worker.ts
- vitest
- api-server.test.ts
- ws
- process-build.ts
- cursor-table.test.ts
- documents.ts
- TapeRecord
- core-private-source.test.ts
- read-gate.ts
- node-run.ts
- interfaces/transaction-history-storage.ts
- pg-tx-history-adapter.ts
- Writer
- intake.test.ts
- config/plain-data.ts
- height-versioned.property.test.ts
- version-checks.ts
- fetch-fixtures.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- records.ts
- surface.test.ts
- crash.test.ts
- restore-private.ts
- connectChannel
- messages.ts
- pack-install.mjs
- block-fetch-decode.test.ts
- node-bridge.ts
- validation.test.ts
- api-session.test.ts
- NodeClient
- .name
- backbone/part-migrations.test.ts
- library-documents.test.ts
- ledger/metadata.ts
- chrome.ts
- key-handling-checks.ts
- ledger-table-config.test.ts
- admin-harness.ts
- version-table.ts
- browser-harness.ts
- typescript
- deterministic-postgresql/checks.ts
- ApiRoutes
- column-rules.ts
- commit-proxy.ts
- resolver-boundary.ts
- harness.ts
- listening.test.ts
- core.ts
- config/plain-data.test.ts
- declaration.ts
- ref_node_fs
- node-refs.ts
- quiet-host.child.ts
- no-indexer-or-wallet-sdk.test.ts
- web-lock.ts
- checkParent
- ref_node_timers
- Session
- browser/serve.ts
- browser/src/config/load.ts
- loop.ts
- LoopPauses
- ws-mutual-tls.test.ts
- shiftedSource
- refcount-checks.ts
- ref_node_crypto
- .send
- TapeAnswers
- mounted-admin.test.ts
- sha256
- FinalizedLoop
- ProcessItems
- shims.test.ts
- ledger/plain-data.ts
- config/history.ts
- vendored-ledger-files.test.ts
- record-and-replay.test.ts
- mutation-evidence.d.mts
- BlockRef
- AsyncLocalStorage
- tape/index.ts
- runner/process.ts
- sweep-tapes.ts
- .value
- ingest-harness.ts
- core-config.test.ts
- adapter.ts
- PageState
- refused-configuration.test.ts
- PageApiChannel
- cbor.ts
- NodeFS
- loop-stop-harness.ts
- pause-fixtures.ts
- resolve.ts
- builds.ts
- validate.ts
- .from
- transport-faults.test.ts
- ledger-storage.test.ts
- refcount-model.ts
- core-ledger-state.ts
- process-backends.ts
- contentsHash
- Process
- builder.test.ts
- adapter-fixtures.ts
- LedgerHost
- contract-modules.test.ts
- node-set.test.ts
- range.ts
- sweep-fixture.test.ts
- containers.test.ts
- process-admin.ts
- backup/restore.ts
- transform-checks.ts
- api.ts
- .read
- connectWebSocket
- contract-data-checks.ts
- backup/backup.ts
- refcount-step.test.ts
- start-umbradb.ts
- slow-block-harness.ts
- halts.test.ts
- ledger-tapes.ts
- openPostgres
- PgTransactionHistoryStorage
- core-ledger-state/sql.ts
- ReadHandle
- library/modules.test.ts
- redact.ts
- ledger-sweep.test.ts
- chain-events-decode.test.ts
- networks.ts
- writer-lock-checks.ts
- InMemoryBlockSource
- ProcessHandle
- postgres/transaction-history-storage.ts
- boundary.test.ts
- graph.ts
- cold-boot-recovery.integration.test.ts
- lockstep-refusals.test.ts
- retirement.test.ts
- mapping.ts
- validation.ts
- loop.test.ts
- file-mode.test.ts
- real-tapes.ts
- pglite-lock.ts
- src/db/postgres.ts
- api-socket.ts
- in-memory-source.ts
- ChannelEndpoint
- test/postgres/setup.ts
- module-api.ts
- data
- Problem
- ADDED Requirements
- graph.py
- .off
- ADDED Requirements
- .slowBlockMs
- .put
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Design — Sprint 2: Transaction/Lease
- T
- refused
- conformance-gate.mjs
- mutation-per-adapter.mjs
- .retrying
- twox.ts
- Design — v1.1.0: Quint model checking
- openssl
- path.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- v9
- orphan-watcher.mjs
- crash-worker.ts
- history
- startUmbraDB
- code
- version
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- package.json
- ADDED Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- README.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Requirement: DT-3 The contents hash
- explore.md
- ROADMAP.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Boundaries, threats and controls
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- scoped-review-manifest
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Requirement: PP-4 The process transport
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- Midnight Foundation Security Policy
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- UmbraDB node architecture
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Tasks — Sprint 2: Transaction/Lease
- Proposal — Sprint 4: Watermarks
- Proposal — Sprint 5: Lean M3a Watermarks W1
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
- 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
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
- 00056 — A private process with no way to read the public data is refused only after its admin listener opens
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream)
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Test wallets
- Requirement: PP-2 A private database is bound to one public database
- Requirement: a non-object JSON value round-trips correctly
- Gate notes — Task 6: differential state-equivalence gate (G11)
- Spec — capability `formal-completion`
- Requirement: listKeys streams without materializing the full result set first, and orders results correctly
- renovate.json
- start-stack.sh
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
- modules-missing.ts
- modules-not-a-list.ts
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 435 edges
2. `UmbraError` - 356 edges
3. `ModuleDeclaration` - 207 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `Database` - 104 edges
9. `startUmbraDB()` - 103 edges
10. `ReadHandle` - 96 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts

## Import Cycles
- None detected.

## Communities (388 total, 34 thin omitted)

### Community 0 - "UmbraError"
Cohesion: 0.02
Nodes (186): PostgresConnection, PostgresOptions, SchemaWriteHandle, CaptureColumn, CaptureState, ReadTimeoutSetting, AppliedRow, MigrationPart (+178 more)

### Community 1 - "ledger/types.ts"
Cohesion: 0.02
Nodes (146): LoadLedger, LedgerStateItem, LedgerName, AdapterSpec, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSource (+138 more)

### Community 10 - "channel-queue.test.ts"
Cohesion: 0.03
Nodes (89): demoLink, Envelope, MessagePortLike, PrivateLinkChannel, HelloAck, PrivateTransport, Waiter, controlledTimers (+81 more)

### Community 102 - "pglite.ts"
Cohesion: 0.10
Nodes (17): Job, JobQueue, Outcome, PgliteDatabase, ServerErrorFields, handleClosed(), statementRefused(), classifyPgliteError() (+9 more)

### Community 103 - "cbor.property.test.ts"
Cohesion: 0.07
Nodes (38): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+30 more)

### Community 104 - "paused-harness.ts"
Cohesion: 0.11
Nodes (32): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, a176Project() (+24 more)

### Community 107 - "core-digest.ts"
Cohesion: 0.09
Nodes (33): TableDigest, TableDigestRow, CapturedTable, ChangeKind, tableChanges, TouchedRow, capturedOf(), digestBlock() (+25 more)

### Community 108 - "browser.test.ts"
Cohesion: 0.08
Nodes (36): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, heldClock, continuedProblems() (+28 more)

### Community 11 - "config-check.ts"
Cohesion: 0.03
Nodes (109): RestoreSeams, Environment, BackupCommandOptions, BackupOutcome, CheckFinding, CheckStep, ConfigCheckSeams, StepName (+101 more)

### Community 113 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (26): BlockRow, transportReaderFacts, StandInOptions, Commit, openedCursorHeight(), refuseWritingReader(), blockFetchStandIn(), standInHeader() (+18 more)

### Community 114 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 115 - "page.ts"
Cohesion: 0.07
Nodes (30): ApiChannel, LinkRecord, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp(), beginCore() (+22 more)

### Community 118 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 119 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 12 - "entries.ts"
Cohesion: 0.02
Nodes (117): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput (+109 more)

### Community 121 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 122 - "binding.test.ts"
Cohesion: 0.10
Nodes (29): A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), contentsOf(), cursorOf() (+21 more)

### Community 123 - "example-checks.ts"
Cohesion: 0.11
Nodes (23): Finding, BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy() (+15 more)

### Community 125 - "code-registry.ts"
Cohesion: 0.10
Nodes (30): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+22 more)

### Community 127 - "refcount-tables.test.ts"
Cohesion: 0.07
Nodes (25): NodeSetFault, NodeSetOptions, NodeTableCheck, Tables, first(), hexOf(), inconsistent(), keyOrdered() (+17 more)

### Community 128 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (25): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+17 more)

### Community 129 - "process-worker.ts"
Cohesion: 0.10
Nodes (23): ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker, answer() (+15 more)

### Community 13 - "vitest"
Cohesion: 0.02
Nodes (93): Served, ParentJob, Kill, Orphaned, SourceFile, Run, Job, WorkerEvent (+85 more)

### Community 130 - "api-server.test.ts"
Cohesion: 0.10
Nodes (22): AppendsVersion, Client, configHashesOf(), duplicateProblems(), exchange(), helperProblems(), hex(), isConfigHash() (+14 more)

### Community 132 - "ws"
Cohesion: 0.09
Nodes (12): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, parseMessage(), hostPort(), sendable() (+4 more)

### Community 135 - "process-build.ts"
Cohesion: 0.08
Nodes (24): EngineBuild, EngineNetwork, ChainBuildOptions, CrashEvent, CrashJob, RestartEvent, RestartJob, CoreSeen (+16 more)

### Community 136 - "cursor-table.test.ts"
Cohesion: 0.09
Nodes (24): CursorValue, cursorDatabase, Access, Block, BlockFails, Counts, Write, BlockFails (+16 more)

### Community 137 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 138 - "TapeRecord"
Cohesion: 0.11
Nodes (16): Recorded, Refusal, Link, TapeBuilder, TapeBuilderOptions, RecordingError, TapeNodeOptions, Held (+8 more)

### Community 14 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (72): PrivateBlockSource, PrivateChecks, privateIntake, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision (+64 more)

### Community 140 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 141 - "node-run.ts"
Cohesion: 0.10
Nodes (21): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, NodeRunResult, databaseOf(), withDevelopmentOptIn() (+13 more)

### Community 143 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 144 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 145 - "Writer"
Cohesion: 0.10
Nodes (13): ReadPool, Writer, commitRolledBack(), allowMultiStatement(), rollBack(), Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`) (+5 more)

### Community 146 - "intake.test.ts"
Cohesion: 0.13
Nodes (16): PrivateSeen, A114Observation, A116Observation, TestLink, CountingLink, a114Problems(), a114Run(), a116Problems() (+8 more)

### Community 147 - "config/plain-data.ts"
Cohesion: 0.11
Nodes (23): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, copyArray(), copyObject(), instanceOf() (+15 more)

### Community 148 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 149 - "version-checks.ts"
Cohesion: 0.14
Nodes (20): Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk, copyVendoredLedger() (+12 more)

### Community 15 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (101): NodeCallOptions, ProcessCondition, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME (+93 more)

### Community 150 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 151 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 152 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 153 - "records.ts"
Cohesion: 0.13
Nodes (24): TapeError, TapeProblem, TransformProblem, DisconnectRecord, FaultRecord, checkRecord(), isPlainObject(), kindOf() (+16 more)

### Community 155 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 156 - "crash.test.ts"
Cohesion: 0.11
Nodes (21): CrashCall, CrashEvent, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+13 more)

### Community 158 - "restore-private.ts"
Cohesion: 0.17
Nodes (20): RestoreOutcome, FileProcess, privateBackup, PublicSetting, PublicSide, PublicSideOptions, heightsFrom(), pmModule() (+12 more)

### Community 159 - "connectChannel"
Cohesion: 0.15
Nodes (13): SubscriptionCarrier, SubscriptionConnection, connectChannel(), errorMessage(), socketConnection(), fault(), 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once, Evidence (+5 more)

### Community 16 - "messages.ts"
Cohesion: 0.03
Nodes (89): PrivateLinkAddress, PrivateLinkConnect, EndpointOptions, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected (+81 more)

### Community 164 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 165 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 166 - "node-bridge.ts"
Cohesion: 0.13
Nodes (17): Thread, BridgeServer, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 167 - "validation.test.ts"
Cohesion: 0.11
Nodes (15): Case, ShapeCase, Stats, schemaName(), module(), declared(), contentDeclared(), failures() (+7 more)

### Community 169 - "api-session.test.ts"
Cohesion: 0.13
Nodes (19): HeadersArgument, LifecycleStatus, answerNotServing(), byteLength(), isCoreHeader(), lifecycleBody(), lifecycleHeaders(), notServingResponse() (+11 more)

### Community 17 - "NodeClient"
Cohesion: 0.05
Nodes (74): CoreChainBinding, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription (+66 more)

### Community 170 - ".name"
Cohesion: 0.13
Nodes (13): Fetching, Recorder, cursorRead(), following(), 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix (+5 more)

### Community 172 - "backbone/part-migrations.test.ts"
Cohesion: 0.18
Nodes (16): ManifestMigration, FoldedPart, RecordedMigration, earlierBootstrapSql(), earlierRefusalProblems(), earlierRows(), earlierRowsSql(), recorded() (+8 more)

### Community 173 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 175 - "ledger/metadata.ts"
Cohesion: 0.16
Nodes (7): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, contentStateOf(), hexOf()

### Community 176 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 177 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 178 - "ledger-table-config.test.ts"
Cohesion: 0.23
Nodes (16): Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts(), haltOf() (+8 more)

### Community 18 - "admin-harness.ts"
Cohesion: 0.04
Nodes (96): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, BlockItemSource, ProcessState, AdminRun, Answered (+88 more)

### Community 183 - "version-table.ts"
Cohesion: 0.21
Nodes (18): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+10 more)

### Community 184 - "browser-harness.ts"
Cohesion: 0.26
Nodes (17): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+9 more)

### Community 187 - "typescript"
Cohesion: 0.19
Nodes (16): Access, AllowedRead, bare(), callsPathResolve(), checked(), declares(), inRepository(), inType() (+8 more)

### Community 188 - "deterministic-postgresql/checks.ts"
Cohesion: 0.13
Nodes (15): ModuleTableOptions, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, RefusalOptions, RelationFacts (+7 more)

### Community 189 - "ApiRoutes"
Cohesion: 0.17
Nodes (11): ModuleApiStart, MountedApiSeams, ApiRoutes, ApiStartup, ModuleApiOptions, ModuleRegistration, AcceptsDuplicates, registerModuleApis() (+3 more)

### Community 19 - "column-rules.ts"
Cohesion: 0.02
Nodes (99): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+91 more)

### Community 191 - "commit-proxy.ts"
Cohesion: 0.16
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 192 - "resolver-boundary.ts"
Cohesion: 0.18
Nodes (16): Boundary, Crossing, Guard, boundaryOf(), boundarySources(), guardedSymbols(), hostWith(), inRepository() (+8 more)

### Community 193 - "harness.ts"
Cohesion: 0.18
Nodes (12): BaselineLoad, Comparison, Backend, Baseline, compareToBaseline(), loadBaseline(), workloadName(), BASELINE_PATH (+4 more)

### Community 196 - "listening.test.ts"
Cohesion: 0.13
Nodes (8): TestCertificates, configWhen(), libraryCore(), privateData(), readerOf(), until(), waitsForLockstep(), CONFIG_SCHEMA

### Community 197 - "core.ts"
Cohesion: 0.21
Nodes (13): CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, LatencyStats, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples() (+5 more)

### Community 198 - "config/plain-data.test.ts"
Cohesion: 0.16
Nodes (9): Row, plainDataWith(), failures(), refusal(), thrown(), valueOf(), A26, files (+1 more)

### Community 2 - "declaration.ts"
Cohesion: 0.02
Nodes (171): StatsRow, Outcome, BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, BlockParsedOptions, TransactionParser (+163 more)

### Community 20 - "ref_node_fs"
Cohesion: 0.05
Nodes (78): recordedGenesis, BackupBackend, BackupDatabase, killedRestore, TickerHandle, FileRow, ledgerBackup, RestoreBuild (+70 more)

### Community 205 - "node-refs.ts"
Cohesion: 0.29
Nodes (4): ChildReader, ChildVisitor, readChildList(), readChildren()

### Community 206 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 207 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 208 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 209 - "checkParent"
Cohesion: 0.18
Nodes (12): AlwaysLanded, checkParent(), sameBytes(), hashAt(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix (+4 more)

### Community 21 - "ref_node_timers"
Cohesion: 0.04
Nodes (82): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, CommandResult, CheckTarget, Renamed, RunningCommand (+74 more)

### Community 214 - "Session"
Cohesion: 0.21
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 216 - "browser/serve.ts"
Cohesion: 0.22
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 217 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 22 - "loop.ts"
Cohesion: 0.04
Nodes (94): PointName, HeightRange, Callback, CallbackFailure, ParallelPoint, PointArguments, PointRun, PointSchedule (+86 more)

### Community 222 - "LoopPauses"
Cohesion: 0.23
Nodes (3): LoopPaused, LoopPauses, watched()

### Community 227 - "ws-mutual-tls.test.ts"
Cohesion: 0.23
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 228 - "shiftedSource"
Cohesion: 0.41
Nodes (5): CoreBlockItems, failingSource(), lookalike(), shiftedSource(), flakySource()

### Community 229 - "refcount-checks.ts"
Cohesion: 0.38
Nodes (11): Reach, closureProblems(), fixtureProblems(), fixtureReach(), leakProblems(), reachIn(), reachProblems(), referenceCounts() (+3 more)

### Community 23 - "ref_node_crypto"
Cohesion: 0.04
Nodes (78): nodeKeys, StoredNode, Reader, NodeKeyTape, Written, GenesisNodes, Disposable, NodeBatch (+70 more)

### Community 239 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 24 - "mounted-admin.test.ts"
Cohesion: 0.04
Nodes (87): UmbraDBHandle, NodeHttpHandler, NodeUpgradeHandler, gate, SecretHashes, SecretVariant, Compared, ConnectSeen (+79 more)

### Community 240 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 25 - "FinalizedLoop"
Cohesion: 0.04
Nodes (30): EntryBoundary, Activity, FinalizedLoop, HeightActivity, HeightRun, LoopObserver, UnexpectedCursor, Startup (+22 more)

### Community 253 - "shims.test.ts"
Cohesion: 0.28
Nodes (6): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PgliteOptions, databaseOptions(), openConfiguredDatabase()

### Community 259 - "ledger/plain-data.ts"
Cohesion: 0.36
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 26 - "config/history.ts"
Cohesion: 0.04
Nodes (87): CoreVersion, versionEntry, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions, HistoryRow, ProvidesRow (+79 more)

### Community 265 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 27 - "record-and-replay.test.ts"
Cohesion: 0.03
Nodes (47): NodeRetry, NodeSocketEvents, HandSocket, HandSockets, Answer, FakeNode, Handler, Received (+39 more)

### Community 279 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 28 - "BlockRef"
Cohesion: 0.05
Nodes (35): BlockLedgerSource, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, QueuedBlock, NodeSubscription, NodeHeader (+27 more)

### Community 29 - "tape/index.ts"
Cohesion: 0.06
Nodes (49): RecordingProblem, readRequest, RequestId, Json, NotJsonError, Connection, TapeClock, TapeNode (+41 more)

### Community 3 - "runner/process.ts"
Cohesion: 0.02
Nodes (141): OpenedFacts, Bound, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait, WaitingListener, ConfigRow (+133 more)

### Community 30 - "sweep-tapes.ts"
Cohesion: 0.05
Nodes (78): NodeBatch, contentsHash, FixtureRun, FixtureRunOptions, FileEntries, Cbor, DigestRow, DigestRows (+70 more)

### Community 31 - ".value"
Cohesion: 0.06
Nodes (62): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+54 more)

### Community 32 - "ingest-harness.ts"
Cohesion: 0.05
Nodes (74): BlockParsed, itemsSeen, ingest, IngestOptions, SourceClass, TasksRun, Asked, Side (+66 more)

### Community 33 - "core-config.test.ts"
Cohesion: 0.05
Nodes (66): MountedAdminAnswer, AdminSeams, adminRoutes, AdminAnswer, AdminEndpoint, AdminPart, AdminView, ChainView (+58 more)

### Community 34 - "adapter.ts"
Cohesion: 0.04
Nodes (67): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+59 more)

### Community 35 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (71): AdminStarter, EngineConfig, WorkerWithStreams, Start, Child, Refusal, Start, listenError() (+63 more)

### Community 36 - "cbor.ts"
Cohesion: 0.05
Nodes (73): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ContentOptions (+65 more)

### Community 37 - "loop-stop-harness.ts"
Cohesion: 0.05
Nodes (57): ChainCheck, ChainCheckInput, NodeClientOptions, ConnectSocket, EngineOptions, SignalTarget, HookedSource, PlainSubclass (+49 more)

### Community 38 - "pause-fixtures.ts"
Cohesion: 0.05
Nodes (61): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, PausesInsideTheHeight (+53 more)

### Community 39 - "resolve.ts"
Cohesion: 0.04
Nodes (74): AddressRequest, Asked, LinkPlan, NetworkInput, NetworkProblem, NetworkRequest, NetworkRule, PlannedAddress (+66 more)

### Community 4 - "builds.ts"
Cohesion: 0.03
Nodes (140): DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, EngineInput, TickerConfig, PausableConfig, PrivateConfig (+132 more)

### Community 40 - "validate.ts"
Cohesion: 0.06
Nodes (77): ConfigFacts, OpenedConfig, RevisionSettings, EntryView, RecordedView, ChainIdentity, RestoreBase, CommandBuildOptions (+69 more)

### Community 41 - ".from"
Cohesion: 0.03
Nodes (61): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+53 more)

### Community 42 - "transport-faults.test.ts"
Cohesion: 0.05
Nodes (53): CoreTransport, Message, PublicCore, Ended, rawClient, Escape, publicState, Refused (+45 more)

### Community 43 - "ledger-storage.test.ts"
Cohesion: 0.06
Nodes (65): RetainedState, Restored, ChainOutcome, CallTx, SeenLoad, retentionSeen, LedgerTx, WindowBackup (+57 more)

### Community 44 - "refcount-model.ts"
Cohesion: 0.06
Nodes (46): Node, BlockKind, BlockScript, BoundaryRewrite, Dice, DrivenBlock, GeneratedBlock, GeneratedState (+38 more)

### Community 45 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (64): ComputedBlock, CoreLedgerStateOptions, retainedStates, RefcountCheck, RefcountFault, CoreRevision, blockHeaderOf(), boundLedgerParser() (+56 more)

### Community 46 - "process-backends.ts"
Cohesion: 0.05
Nodes (44): CloseHelper, NetworkRuleName, Flaky, ChangedFile, GenesisFixture, installationCopy, PackageStartup, StartPackageProcess (+36 more)

### Community 47 - "contentsHash"
Cohesion: 0.06
Nodes (49): CheckedMigration, ModuleContentsError, ModuleContentsFailure, ModuleTable, RefusalCode, RefusalPlace, Case, refuseNonDeterministic() (+41 more)

### Community 48 - "Process"
Cohesion: 0.06
Nodes (22): Process, NetworkPlan, configurationFindings(), configurationRefusalLines(), isConfigurationRefusal(), messageOf(), redactedFindings(), redactedFindingText() (+14 more)

### Community 49 - "builder.test.ts"
Cohesion: 0.05
Nodes (33): ConnectionFrames, Failure, Variant, WrongRecording, Metadata, Step, Frame, RawClient (+25 more)

### Community 5 - "adapter-fixtures.ts"
Cohesion: 0.03
Nodes (140): StoredNode, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+132 more)

### Community 50 - "LedgerHost"
Cohesion: 0.05
Nodes (45): LedgerBinding, LedgerHost, LedgerWorkerFailure, NodeDatabase, SentParses, NodeReader, SlowStep, TestLoaderData (+37 more)

### Community 51 - "contract-modules.test.ts"
Cohesion: 0.06
Nodes (56): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+48 more)

### Community 52 - "node-set.test.ts"
Cohesion: 0.05
Nodes (49): PageOptions, ConsistentRead, StoredRow, Tables, DeterminismBackend, Call, TestDatabase, TestServer (+41 more)

### Community 53 - "range.ts"
Cohesion: 0.05
Nodes (61): BoundaryBlockReading, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange, Final, Height (+53 more)

### Community 54 - "sweep-fixture.test.ts"
Cohesion: 0.06
Nodes (60): Child, extendedCases, FixtureNode, NodeContent, ExtendedState, FakeState, Keeping, Driver (+52 more)

### Community 55 - "containers.test.ts"
Cohesion: 0.04
Nodes (49): BenchEnv, SslMode, driverConnectionOptions, PostgresConnection, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+41 more)

### Community 56 - "process-admin.ts"
Cohesion: 0.06
Nodes (46): NetworkShown, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, AdminServer, AdminStartOptions, DigestRow, ModuleFacts (+38 more)

### Community 57 - "backup/restore.ts"
Cohesion: 0.06
Nodes (49): RestoreChain, RestoreInput, RestoreTarget, MetaCommands, Piece, State, StatementSplitter, BackupText (+41 more)

### Community 58 - "transform-checks.ts"
Cohesion: 0.08
Nodes (44): Failure, Variant, TransformError, NotifyRecord, recordKind, SubscriptionId, CallSelection, NotificationRange (+36 more)

### Community 6 - "api.ts"
Cohesion: 0.03
Nodes (111): BackupInput, DumpInput, CommittedHeight, Database, ReadOnlyDatabase, ReadOptions, SchemaPlan, ContentDefinedTables (+103 more)

### Community 60 - ".read"
Cohesion: 0.05
Nodes (55): ChainOptions, DigestRow, shadowTableName(), identityRow(), captured(), hex(), moduleM(), restart() (+47 more)

### Community 61 - "connectWebSocket"
Cohesion: 0.05
Nodes (37): Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+29 more)

### Community 62 - "contract-data-checks.ts"
Cohesion: 0.08
Nodes (60): contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx, handoff (+52 more)

### Community 63 - "backup/backup.ts"
Cohesion: 0.07
Nodes (54): BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestTool, PgliteDump (+46 more)

### Community 64 - "refcount-step.test.ts"
Cohesion: 0.04
Nodes (54): refcountStep, RefcountTables, Given, Halt, Outcome, bytesOf(), hexOf(), once() (+46 more)

### Community 65 - "start-umbradb.ts"
Cohesion: 0.07
Nodes (58): Finding, readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork, UmbraDBOptions (+50 more)

### Community 66 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (51): BlockEventSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+43 more)

### Community 67 - "halts.test.ts"
Cohesion: 0.05
Nodes (51): ProcessingEnd, ProcessStatus, Q142Observation, A43Case, A43Observation, CursorElsewhere, Halt, Outcome (+43 more)

### Community 68 - "ledger-tapes.ts"
Cohesion: 0.07
Nodes (56): BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime, Phase, ledgerScenario (+48 more)

### Community 69 - "openPostgres"
Cohesion: 0.06
Nodes (37): PostgresOptions, CliBackend, Snapshot, Phase, PostgresTestDatabase, Job, openPgliteOn(), openPostgres() (+29 more)

### Community 70 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (52): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema (+44 more)

### Community 71 - "core-ledger-state/sql.ts"
Cohesion: 0.07
Nodes (50): KeyCounts, RefcountStatement, StateRow, StoredState, GreyView, SweepPhase, chunksOf(), invalid() (+42 more)

### Community 72 - "ReadHandle"
Cohesion: 0.05
Nodes (37): ReadHandle, PointCallbacks, ChainDataView, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView() (+29 more)

### Community 74 - "library/modules.test.ts"
Cohesion: 0.06
Nodes (39): Hold, Signal, Job, ModuleListRule, OwnWords, Shown, GoneCwdResult, HOLDS (+31 more)

### Community 75 - "redact.ts"
Cohesion: 0.06
Nodes (44): AllowedDetail, SanitizedError, RedactionForms, redactor, SecretForm, TextPattern, StatusFacts, Needs (+36 more)

### Community 76 - "ledger-sweep.test.ts"
Cohesion: 0.06
Nodes (34): GreyPicker, SweepState, SweepTables, SweepWrites, MemoryTables, ModelBatch, ModelSnapshot, hexOf() (+26 more)

### Community 77 - "chain-events-decode.test.ts"
Cohesion: 0.09
Nodes (42): Field, PalletMetadata, Registry, RuntimeShape, StorageSpec, chainEventsOf(), metadataView(), fill() (+34 more)

### Community 78 - "networks.ts"
Cohesion: 0.05
Nodes (40): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+32 more)

### Community 79 - "writer-lock-checks.ts"
Cohesion: 0.09
Nodes (40): WriterProcess, WorkerEvent, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf(), startWriterProcess() (+32 more)

### Community 8 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (116): InMemoryBlockSource, Job, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+108 more)

### Community 81 - "ProcessHandle"
Cohesion: 0.06
Nodes (38): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, ProcessHandle, UserModulesSource (+30 more)

### Community 82 - "postgres/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (35): EntryContent, JsonEncoded, TxHistoryRow, Command, ReplayableStorage, assertStoredEntryShape(), decodeContent(), decodeRow() (+27 more)

### Community 83 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+34 more)

### Community 84 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts, ResolvedRange (+39 more)

### Community 85 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (30): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+22 more)

### Community 86 - "lockstep-refusals.test.ts"
Cohesion: 0.08
Nodes (28): InstanceView, PrivateInstance, Entry, Lockstep, LockstepCondition, LockstepInstance, LockstepOptions, LockstepRefusal (+20 more)

### Community 87 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 88 - "mapping.ts"
Cohesion: 0.07
Nodes (33): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+25 more)

### Community 89 - "validation.ts"
Cohesion: 0.09
Nodes (34): DeclarationRule, PlacedDeclaration, Plain, Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape() (+26 more)

### Community 9 - "loop.test.ts"
Cohesion: 0.03
Nodes (114): Transaction, EntryRange, GraphInput, CommitOutcome, HeldHeight, LockstepWait, LoopEnd, LoopInput (+106 more)

### Community 90 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (32): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+24 more)

### Community 91 - "real-tapes.ts"
Cohesion: 0.08
Nodes (35): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+27 more)

### Community 92 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (33): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, ChildResult (+25 more)

### Community 93 - "src/db/postgres.ts"
Cohesion: 0.09
Nodes (36): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, DriverError, Outcome, Role, SchemaChanges (+28 more)

### Community 95 - "api-socket.ts"
Cohesion: 0.11
Nodes (37): coreHeaders, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits, ServedConnection, ModuleApiHandlerOptions (+29 more)

### Community 96 - "in-memory-source.ts"
Cohesion: 0.05
Nodes (26): BlockSource, InMemoryItems, Wait, RestoreJob, SignalJob, Job, Run, checkHeight() (+18 more)

### Community 97 - "ChannelEndpoint"
Cohesion: 0.11
Nodes (13): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), messageEnvelope(), refuseChannel(), discard(), isChannel() (+5 more)

### Community 98 - "test/postgres/setup.ts"
Cohesion: 0.07
Nodes (34): Key, Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, Sql, SuiteWatchdogTimeoutError (+26 more)

### Community 99 - "module-api.ts"
Cohesion: 0.08
Nodes (29): ChainDataAnswer, ApiError, ApiErrorCode, ApiRequest, ApiResponse, HttpHandler, HttpMethod, HttpRoute (+21 more)

### Community 142 - "data"
Cohesion: 0.09
Nodes (27): params(), n(), data(), 7. The module API, 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants, 2.4 Migrations: one per part (O-2) (+19 more)

### Community 285 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 100 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 110 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 111 - ".off"
Cohesion: 0.05
Nodes (34): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears (+26 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 124 - ".slowBlockMs"
Cohesion: 0.07
Nodes (29): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+21 more)

### Community 133 - ".put"
Cohesion: 0.08
Nodes (28): coreBlockFetchOnFetch(), "on-fetch"(), Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level, Scenario: Sequential puts to the same key in separate transactions succeed, outside the millisecond-collision caveat, Scenario: Sequential unconditional writes produce consecutive versions, Scenario: The CAS-guarded and unconditional paths agree on version assignment (+20 more)

### Community 168 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 199 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.13
Nodes (11): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 4. Wiring `PgTemporalKV`'s `opts.tx`, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure (+3 more)

### Community 200 - "T"
Cohesion: 0.16
Nodes (15): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Scenario: Version and timestamp addressing agree, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape (+7 more)

### Community 201 - "refused"
Cohesion: 0.22
Nodes (14): refused(), Requirement: AE-3 States and conditions, Scenario: A fault of the build's declarations ends the process, Scenario: A paused loop, Scenario: A refused configuration ends the process, Scenario: A refused start stays up, Requirement: AE-3 States and conditions, Scenario: A fault of the build's declarations ends the process (+6 more)

### Community 203 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 204 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 210 - ".retrying"
Cohesion: 0.14
Nodes (12): The node on `/status`, Requirement: AE-5 `/status` and `/config` contents, Scenario: Before the first block, MODIFIED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Scenario: A blocking callback fails liveness, and the endpoints still answer (+4 more)

### Community 215 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 221 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 224 - "openssl"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 266 - "path.ts"
Cohesion: 0.33
Nodes (4): join(), normalize(), delimiter, sep

### Community 269 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 289 - "v9"
Cohesion: 0.47
Nodes (5): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 304 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 359 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 59 - "history"
Cohesion: 0.04
Nodes (61): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+53 more)

### Community 7 - "startUmbraDB"
Cohesion: 0.02
Nodes (142): resolve(), text(), transportReader(), transportReaderRule(), startUmbraDB(), log(), ownKeys(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever (+134 more)

### Community 73 - "code"
Cohesion: 0.04
Nodes (55): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+47 more)

### Community 80 - "version"
Cohesion: 0.05
Nodes (49): side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+41 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+31 more)

### Community 109 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune (+29 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 131 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 134 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, optional, engines, node (+22 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 157 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (25): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+17 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+16 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 162 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+15 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: set rejects a top-level null value with ValidationError before any statement (+15 more)

### Community 171 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 174 - "Requirements"
Cohesion: 0.10
Nodes (20): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in, Requirements (+12 more)

### Community 179 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 180 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 181 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 185 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 186 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 190 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 194 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 195 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 202 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 211 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 212 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 213 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 218 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 219 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 220 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 223 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 225 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 226 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 231 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 232 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 233 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 234 - "README.md"
Cohesion: 0.29
Nodes (3): Choosing a database, Launching it, stats-module

### Community 235 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 236 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 237 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 238 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 241 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 242 - "ROADMAP.md"
Cohesion: 0.20
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 243 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 244 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 245 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 246 - "Boundaries, threats and controls"
Cohesion: 0.20
Nodes (10): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+2 more)

### Community 247 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 248 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 249 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 250 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 251 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 254 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 255 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 256 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 257 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 258 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 260 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 261 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 262 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 263 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 264 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 267 - "scoped-review-manifest"
Cohesion: 0.29
Nodes (6): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 4 — Write the manifest

### Community 268 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 270 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 271 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 272 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 273 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 274 - "Requirement: PP-4 The process transport"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, Spec delta — `private-processes` capability

### Community 275 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 276 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 277 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 278 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 280 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 282 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 283 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 284 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 286 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.33
Nodes (5): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Problem, Resolution, Suggested fix

### Community 287 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 288 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 290 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 291 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 292 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 293 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 294 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 295 - "Tasks — Sprint 2: Transaction/Lease"
Cohesion: 0.33
Nodes (5): 0. `PgTransactionLeaseLayer` — transactions, 1. `PgTransactionLeaseLayer` — leases, 2. Wire `PgTemporalKV`'s `opts.tx`, 3. Sprint close-out, Tasks — Sprint 2: Transaction/Lease

### Community 296 - "Proposal — Sprint 4: Watermarks"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes, Why

### Community 297 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 298 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 299 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 300 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 301 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 302 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 303 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 305 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 306 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 307 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 308 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 309 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 310 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 311 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 312 - "00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond"
Cohesion: 0.40
Nodes (4): 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix

### Community 313 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 314 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 315 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 316 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 317 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 318 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 319 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 320 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 321 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 322 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 323 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 324 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 325 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 326 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 327 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 328 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 329 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 330 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 331 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 332 - "00056 — A private process with no way to read the public data is refused only after its admin listener opens"
Cohesion: 0.40
Nodes (4): 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix

### Community 333 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 334 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 335 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 336 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 337 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 338 - "00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream)"
Cohesion: 0.40
Nodes (4): 00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream), Evidence, Problem, Suggested fix (upstream; the ledger team's choice)

### Community 339 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 340 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 341 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 342 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 343 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 345 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 346 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 347 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 348 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 349 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 350 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 351 - "Requirement: PP-2 A private database is bound to one public database"
Cohesion: 0.50
Nodes (4): Requirement: PP-2 A private database is bound to one public database, Scenario: Configured for another network, Scenario: Pointed at another public database, Scenario: The public core never started

### Community 352 - "Requirement: a non-object JSON value round-trips correctly"
Cohesion: 0.50
Nodes (4): Requirement: a non-object JSON value round-trips correctly, Scenario: A bare numeric watermark value round-trips exactly, Scenario: A bare string watermark value round-trips exactly, Scenario: A large integer encoded as a decimal string round-trips exactly

### Community 353 - "Gate notes — Task 6: differential state-equivalence gate (G11)"
Cohesion: 0.50
Nodes (3): 6.1 — P3 is the differential gate's replay-equivalence / fold anchor (documentation, no new test code), 6.2 — fault-schedule differential (`test/postgres/differential-equivalence.test.ts`), Gate notes — Task 6: differential state-equivalence gate (G11)

### Community 354 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 355 - "Requirement: listKeys streams without materializing the full result set first, and orders results correctly"
Cohesion: 0.50
Nodes (4): Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Scenario: Aborting mid-iteration rejects with AbortError and releases the cursor, Scenario: Only the newest version of each key is yielded, Scenario: The first key is yielded before the full scan completes

### Community 356 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 362 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-8949`, `RFC-3339`, `RFC-8949` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4308 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UmbraError`, `ledger/types.ts`, `declaration.ts`, `runner/process.ts`, `builds.ts`, `adapter-fixtures.ts`, `api.ts`, `InMemoryBlockSource`, `loop.test.ts`, `channel-queue.test.ts`, `config-check.ts`, `entries.ts`, `core-private-source.test.ts`, `fetch-fixtures.ts`, `messages.ts`, `NodeClient`, `admin-harness.ts`, `column-rules.ts`, `ref_node_fs`, `ref_node_timers`, `loop.ts`, `ref_node_crypto`, `mounted-admin.test.ts`, `config/history.ts`, `record-and-replay.test.ts`, `tape/index.ts`, `sweep-tapes.ts`, `ingest-harness.ts`, `core-config.test.ts`, `adapter.ts`, `refused-configuration.test.ts`, `cbor.ts`, `loop-stop-harness.ts`, `pause-fixtures.ts`, `resolve.ts`, `.from`, `transport-faults.test.ts`, `ledger-storage.test.ts`, `refcount-model.ts`, `core-ledger-state.ts`, `process-backends.ts`, `contentsHash`, `builder.test.ts`, `LedgerHost`, `contract-modules.test.ts`, `node-set.test.ts`, `sweep-fixture.test.ts`, `containers.test.ts`, `process-admin.ts`, `backup/restore.ts`, `transform-checks.ts`, `.read`, `connectWebSocket`, `contract-data-checks.ts`, `backup/backup.ts`, `refcount-step.test.ts`, `start-umbradb.ts`, `slow-block-harness.ts`, `halts.test.ts`, `ledger-tapes.ts`, `openPostgres`, `core-ledger-state/sql.ts`, `ReadHandle`, `library/modules.test.ts`, `redact.ts`, `ledger-sweep.test.ts`, `chain-events-decode.test.ts`, `networks.ts`, `writer-lock-checks.ts`, `ProcessHandle`, `postgres/transaction-history-storage.ts`, `boundary.test.ts`, `cold-boot-recovery.integration.test.ts`, `lockstep-refusals.test.ts`, `retirement.test.ts`, `mapping.ts`, `file-mode.test.ts`, `real-tapes.ts`, `pglite-lock.ts`, `src/db/postgres.ts`, `in-memory-source.ts`, `test/postgres/setup.ts`, `pglite.ts`, `cbor.property.test.ts`, `paused-harness.ts`, `core-digest.ts`, `browser.test.ts`, `core-block-commit.test.ts`, `Worker`, `release-version.ts`, `browser/build.ts`, `binding.test.ts`, `example-checks.ts`, `code-registry.ts`, `refcount-tables.test.ts`, `node-fields-harness.ts`, `api-server.test.ts`, `package.json`, `cursor-table.test.ts`, `documents.ts`, `read-gate.ts`, `pg-tx-history-adapter.ts`, `intake.test.ts`, `config/plain-data.ts`, `height-versioned.property.test.ts`, `version-checks.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `surface.test.ts`, `crash.test.ts`, `restore-private.ts`, `block-fetch-decode.test.ts`, `node-bridge.ts`, `validation.test.ts`, `api-session.test.ts`, `backbone/part-migrations.test.ts`, `library-documents.test.ts`, `key-handling-checks.ts`, `ledger-table-config.test.ts`, `excluded-not-exported.test.ts`, `typescript`, `resolver-boundary.ts`, `listening.test.ts`, `config/plain-data.test.ts`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `twox.ts`, `LoopPauses`, `ws-mutual-tls.test.ts`, `shims.test.ts`, `vendored-ledger-files.test.ts`, `pglite.test.ts`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-8949` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.019805481874447393 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `ledger/types.ts`, `declaration.ts`, `runner/process.ts`, `builds.ts`, `api.ts`, `startUmbraDB`, `InMemoryBlockSource`, `loop.test.ts`, `channel-queue.test.ts`, `config-check.ts`, `entries.ts`, `core-private-source.test.ts`, `fetch-fixtures.ts`, `messages.ts`, `NodeClient`, `admin-harness.ts`, `ref_node_fs`, `ref_node_timers`, `loop.ts`, `mounted-admin.test.ts`, `FinalizedLoop`, `config/history.ts`, `record-and-replay.test.ts`, `BlockRef`, `tape/index.ts`, `sweep-tapes.ts`, `refused-configuration.test.ts`, `cbor.ts`, `pause-fixtures.ts`, `resolve.ts`, `validate.ts`, `.from`, `transport-faults.test.ts`, `core-ledger-state.ts`, `process-backends.ts`, `contentsHash`, `Process`, `contract-modules.test.ts`, `node-set.test.ts`, `range.ts`, `sweep-fixture.test.ts`, `containers.test.ts`, `process-admin.ts`, `backup/restore.ts`, `transform-checks.ts`, `backup/backup.ts`, `refcount-step.test.ts`, `start-umbradb.ts`, `slow-block-harness.ts`, `halts.test.ts`, `openPostgres`, `core-ledger-state/sql.ts`, `ReadHandle`, `redact.ts`, `writer-lock-checks.ts`, `ProcessHandle`, `graph.ts`, `lockstep-refusals.test.ts`, `mapping.ts`, `validation.ts`, `pglite-lock.ts`, `src/db/postgres.ts`, `module-api.ts`, `pglite.ts`, `core-block-commit.test.ts`, `binding.test.ts`, `refcount-tables.test.ts`, `api-server.test.ts`, `cursor-table.test.ts`, `TapeRecord`, `Writer`, `config/plain-data.ts`, `version-checks.ts`, `validation.test.ts`, `backbone/part-migrations.test.ts`, `ledger/metadata.ts`, `ledger-table-config.test.ts`, `version-table.ts`, `ApiRoutes`, `config/plain-data.test.ts`, `web-lock.ts`, `checkParent`, `Session`, `browser/src/config/load.ts`, `shiftedSource`, `sha256`, `shims.test.ts`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `ledger/types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024004538524270466 - nodes in this community are weakly interconnected._