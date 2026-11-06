# Graph Report - UmbraDB

## Corpus Check
- 1519 files · ~1,920,907 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 148 file(s) not represented in the graph (top: .bin 75, (none) 21, .patch 18)

## Summary
- 14220 nodes · 43614 edges · 383 communities (342 shown, 41 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3534 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `81f33d64bdf30e73` (1519 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- ref_node_fs
- declaration.ts
- core-block-parsed.ts
- ledger/fixtures/task-modules.ts
- browser/browser.test.ts
- browser/build.ts
- .name
- node-run.ts
- process-worker.ts
- containers.test.ts
- binding.test.ts
- configuration-refusal.test.ts
- HeightRun
- release-version.ts
- core.ts
- file-modes.ts
- PointName
- api-session.test.ts
- tape/index.ts
- child-processes.test.ts
- code-registry.ts
- postgres/transaction-history-storage.ts
- stagenet.test.ts
- options.ts
- documents.ts
- apply.ts
- paused-harness.ts
- ledger-storage.negative-control.test.ts
- core-ledger-state.ts
- surface.test.ts
- read-gate.ts
- example-checks.ts
- interfaces/transaction-history-storage.ts
- restore-private.ts
- Buffer
- ws-mutual-tls.test.ts
- client.test.ts
- pg-tx-history-adapter.ts
- node-bridge.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- src/index.ts
- config/history.ts
- backbone/part-migrations.test.ts
- pack-install.mjs
- defineModule
- node-fields-harness.ts
- Registry
- core-chain.test.ts
- browser-harness.ts
- library-documents.test.ts
- .concat
- envelope.ts
- chrome.ts
- node-set.test.ts
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- validation.test.ts
- cli/run.ts
- version-table.ts
- postgres-image.test.ts
- adapter-fixtures.ts
- LoopPauses
- real-tapes.ts
- resolver-boundary.ts
- core-block-fetch.test.ts
- config-check-database.test.ts
- process-access.ts
- token-metadata/browser.test.ts
- startUmbraDB
- NodeClient
- REPOSITORY
- RuntimeMetadata
- web-lock.ts
- backup/restore.ts
- browser/src/config/load.ts
- .from
- text.test.ts
- postgres-tls-server.ts
- stats-module.ts
- SubscriptionConnection
- .send
- host.ts
- Design — Sprint 1: project setup + TemporalKV
- provenance.ts
- TapeAnswers
- sha256
- ReadHandle
- ref_typescript
- ProcessItems
- validate.ts
- core-transport.ts
- ledger/plain-data.ts
- vendored-ledger-files.test.ts
- transport.test.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- runner/process.ts
- core-private-source.test.ts
- column-rules.ts
- contract-data-checks.ts
- cbor.ts
- BlockRef
- process-admin.ts
- PageState
- LedgerPackage
- NodeFS
- UmbraError
- refcount-model.ts
- token-metadata/api.ts
- migrate.ts
- InMemoryBlockSource
- token-metadata/harness.ts
- .read
- channel-queue.test.ts
- state.ts
- codec/src/index.ts
- order.property.test.ts
- resolve.ts
- loop.test.ts
- FinalizedLoop
- config-check.ts
- ledger-graph-tapes.ts
- ledger/types.ts
- range.ts
- loop-stop-harness.ts
- core-block-commit.test.ts
- PgTransactionHistoryStorage
- boundary.test.ts
- messages.ts
- runner-core.ts
- pglite-queue.test.ts
- refcount-restart.ts
- ref_vitest
- module-api.test.ts
- slow-block-harness.ts
- ChannelEndpoint
- private-transport.ts
- graph.ts
- api-socket.ts
- src/db/postgres.ts
- retirement.test.ts
- version-checks.ts
- networks.ts
- pglite-lock.ts
- config/plain-data.ts
- module-api.ts
- log-reader.test.ts
- db/errors.ts
- api-server.test.ts
- redact.ts
- validation.ts
- loop.ts
- cold-boot-recovery.integration.test.ts
- page.ts
- TransactionHistoryEntry
- test/postgres/setup.ts
- ledger-state.test.ts
- process-context.test.ts
- Worker
- Tasks — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0
- refused
- ADDED Requirements
- data
- ADDED Requirements
- .slowBlockMs
- .source
- transportReader
- UmbraDB module guide
- .cwd
- Boundaries, threats and controls
- Design — v1.0.0 API Surface & Release Contract
- local-preprod-sync.mjs
- sweep-fixture.test.ts
- Acceptance — START-UMBRADB: UmbraDB as a library
- .disconnect
- Requirement: BK-1 Backup
- conformance-gate.mjs
- mutation-per-adapter.mjs
- ledger-checks.ts
- twox.ts
- Design — v1.1.0: Quint model checking
- Endpoints
- ledger-refcount-removal.test.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- answers.test.ts
- text
- orphan-watcher.mjs
- py.py
- crash-worker.ts
- .put
- history
- version
- .off
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- vectors/package.json
- ADDED Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- codec/package.json
- package.json
- stryker.token-metadata.conf.json
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- Rework (class 4)
- mip
- UmbraDB third-party component inventory (SBOM)
- mip
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- compilerOptions
- compilerOptions
- ADDED Requirements
- UmbraDB
- compilerOptions
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- Requirement: DT-3 The contents hash
- [0.10.0] - 2026-10-27
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Requirement: CC-3 `core-contract-logs-fast` stores the logs it can read, and records the rest as unresolved
- Proposal — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0 (`token-metadata`)
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- try.sh
- ADDED Requirements
- ADDED Requirements
- Proposal — FAST-LOGS-UNRESOLVED: the fast contract-log provider records what it cannot read instead of halting (`fast-logs-unresolved`)
- Acceptance — v1.0.0 API Surface & Release Contract
- Tasks — v1.0.0-infosec-signoff
- node.mjs
- Repository agent policy
- scoped-review-manifest
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0 API Surface & Release Contract
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
- 00023 — The blocks table's height partitions end at 5,000,000
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
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00072 — `umbradb run` logs nothing when SIGTERM or SIGINT stops it
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- 00085 — The fast contract-log provider limits mid-chain use: development-only, and it halts on partial transactions
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- real/manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00083 — Four timing-bound tests fail when the machine runs several test lanes at once
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
- Provenance of the copied Stagenet case expectations
- build-in-container.sh
- stats-module/run.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bin
- bugs
- engines
- peerDependencies
- vendor/mip0018/SOURCE.md
- fixtures/mip0018/SOURCE.md
- uri/README.md
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
- ADDED Requirements
- ADDED Requirements
- README.md
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `UmbraError` - 357 edges
2. `ModuleDeclaration` - 221 edges
3. `InMemoryBlockSource` - 180 edges
4. `FinalizedLoop` - 139 edges
5. `NodeClient` - 116 edges
6. `PROCESS_BACKENDS` - 115 edges
7. `BlockRef` - 105 edges
8. `startUmbraDB()` - 105 edges
9. `Database` - 104 edges
10. `ReadHandle` - 103 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Evidence` --references--> `probedThrough()`  [INFERRED]
  docs/issues/00064-full-suite-timing-budgets-under-a-loaded-machine.md → test/backbone/core-health/liveness.test.ts
- `Evidence` --references--> `heightPartitionsSql()`  [INFERRED]
  docs/issues/00023-blocks-table-partitions-end-at-five-million.md → src/backbone/height-partitions.ts

## Import Cycles
- None detected.

## Communities (383 total, 41 thin omitted)

### Community 0 - "ref_node_fs"
Cohesion: 0.02
Nodes (228): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore (+220 more)

### Community 1 - "declaration.ts"
Cohesion: 0.02
Nodes (228): ProcessAdminOptions, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStarter (+220 more)

### Community 10 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (145): BlockHeaderItem, BlockEventSource, BodyExtrinsic, ExtrinsicCall, BlockBody, CoreBlockHeader, MetadataField, MetadataPallet (+137 more)

### Community 102 - "ledger/fixtures/task-modules.ts"
Cohesion: 0.10
Nodes (30): CallArgsItem, CallArguments, taskSeen, V9Raw, expectedCallArgs(), plainWatchModule(), transactionsOf(), mainThreadLogReader() (+22 more)

### Community 103 - "browser/browser.test.ts"
Cohesion: 0.08
Nodes (34): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+26 more)

### Community 104 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuild, BrowserBuildOptions, BrowserControl, checkedLedgers, pageBench, browserLedgerEntry(), browserPlugin(), buildBrowser() (+18 more)

### Community 105 - ".name"
Cohesion: 0.08
Nodes (26): Fetching, Recorder, common(), 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix, Errors (+18 more)

### Community 106 - "node-run.ts"
Cohesion: 0.10
Nodes (26): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, NodeRunResult, core(), databaseOf() (+18 more)

### Community 107 - "process-worker.ts"
Cohesion: 0.10
Nodes (26): databaseTarget, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, RestoreSeams, databaseOptions() (+18 more)

### Community 109 - "containers.test.ts"
Cohesion: 0.08
Nodes (26): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), guardPid(), watcherInput(), removeAttempt() (+18 more)

### Community 11 - "binding.test.ts"
Cohesion: 0.02
Nodes (150): LockstepCondition, PublicSide, A165Options, a165Run, Attempt, OpenTransaction, TestDatabase, A113Observation (+142 more)

### Community 111 - "configuration-refusal.test.ts"
Cohesion: 0.10
Nodes (26): ConfigFinding, LifecycleStatus, ProcessReason, ReasonCode, Unwrapped, StatusFacts, configurationRefused(), findingText() (+18 more)

### Community 112 - "HeightRun"
Cohesion: 0.06
Nodes (16): HeightRun, IgnoresTheStop, PausesInsideTheHeight, StaysPaused, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching (+8 more)

### Community 113 - "release-version.ts"
Cohesion: 0.13
Nodes (33): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+25 more)

### Community 114 - "core.ts"
Cohesion: 0.12
Nodes (25): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+17 more)

### Community 116 - "file-modes.ts"
Cohesion: 0.09
Nodes (25): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+17 more)

### Community 118 - "PointName"
Cohesion: 0.09
Nodes (18): ItemSink, PointName, BlockItems, LateUse, CallbackFailure, HeightFailure, Misuse, A43Case (+10 more)

### Community 119 - "api-session.test.ts"
Cohesion: 0.10
Nodes (24): MountedAdminAnswer, HeadersArgument, headersOf(), mountedAdminFetch(), mountedAdminHandler(), answerNotServing(), byteLength(), isCoreHeader() (+16 more)

### Community 12 - "tape/index.ts"
Cohesion: 0.03
Nodes (119): Failure, Variant, Link, TapeBuilderOptions, RecordingError, RecordingProblem, TapeError, TapeProblem (+111 more)

### Community 120 - "child-processes.test.ts"
Cohesion: 0.08
Nodes (26): ParentJob, Kill, Orphaned, SourceFile, alive(), bystander(), childrenOf(), commandOf() (+18 more)

### Community 121 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 122 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+11 more)

### Community 124 - "stagenet.test.ts"
Cohesion: 0.08
Nodes (27): Answer, CaseIndex, ExpectedField, ExpectedIdentity, ExpectedState, IndexSummary, json(), RefEvent (+19 more)

### Community 125 - "options.ts"
Cohesion: 0.14
Nodes (28): readOptions, addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding(), guarded(), isAbortSignal() (+20 more)

### Community 126 - "documents.ts"
Cohesion: 0.13
Nodes (28): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+20 more)

### Community 127 - "apply.ts"
Cohesion: 0.13
Nodes (27): Candidate, LogReader, TokenMetadataLogError, TransactionHashes, EventRow, FieldRow, IdentityKey, Position (+19 more)

### Community 128 - "paused-harness.ts"
Cohesion: 0.15
Nodes (25): Body, PausedExpectation, Read, Reader, Running, keeperModule(), keepingPause(), pausedOf() (+17 more)

### Community 129 - "ledger-storage.negative-control.test.ts"
Cohesion: 0.13
Nodes (24): SeenLoad, LedgerTx, Reader, a100Problems(), a102Problems(), a104KeyProblems(), a104Scenario(), bytesOf() (+16 more)

### Community 13 - "core-ledger-state.ts"
Cohesion: 0.02
Nodes (137): ComputedBlock, LedgerStateItem, RetainedState, retainedStates, NodeSetFault, NodeSetOptions, NodeTableCheck, KeyCounts (+129 more)

### Community 130 - "surface.test.ts"
Cohesion: 0.11
Nodes (29): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+21 more)

### Community 132 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 133 - "example-checks.ts"
Cohesion: 0.14
Nodes (19): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+11 more)

### Community 136 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 137 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSideOptions, privateConfig(), heightsFrom() (+14 more)

### Community 138 - "Buffer"
Cohesion: 0.10
Nodes (21): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+13 more)

### Community 139 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (21): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+13 more)

### Community 14 - "client.test.ts"
Cohesion: 0.02
Nodes (91): NodeRetry, ConnectSocket, NodeSocketEvents, GatedConnector, HandSocket, HandSockets, Answer, FakeNode (+83 more)

### Community 140 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 142 - "node-bridge.ts"
Cohesion: 0.11
Nodes (20): NodeStore, EngineOptions, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes() (+12 more)

### Community 143 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 144 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 145 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 146 - "src/index.ts"
Cohesion: 0.13
Nodes (20): MessagePortLike, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork, UmbraDBReason, UmbraDBStarted (+12 more)

### Community 15 - "config/history.ts"
Cohesion: 0.02
Nodes (146): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettings, CoreSettingsBase (+138 more)

### Community 151 - "backbone/part-migrations.test.ts"
Cohesion: 0.15
Nodes (19): FoldedPart, RecordedMigration, earlierBackup(), earlierBootstrapSql(), earlierRefusalProblems(), earlierRows(), earlierRowsSql(), recorded() (+11 more)

### Community 153 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 154 - "defineModule"
Cohesion: 0.16
Nodes (21): ObservedEvent, Generated, splitMiscData(), recordsSize(), defineModule(), keysModule(), digestProbe(), build() (+13 more)

### Community 156 - "node-fields-harness.ts"
Cohesion: 0.13
Nodes (19): A168Observation, A168Phase, Expected, StatusReader, a168Run(), atLeast(), attempts(), holding() (+11 more)

### Community 158 - "Registry"
Cohesion: 0.21
Nodes (13): Field, Registry, metadataWith(), metadataV14(), midnightMetadata(), some(), text(), vec() (+5 more)

### Community 16 - "core-chain.test.ts"
Cohesion: 0.03
Nodes (117): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, WaitingListener, ChainIdentity, ConfigRow, ConfigHashRow (+109 more)

### Community 161 - "browser-harness.ts"
Cohesion: 0.19
Nodes (18): PageApiChannel, PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf() (+10 more)

### Community 164 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 166 - ".concat"
Cohesion: 0.14
Nodes (11): Cbor, Armed, CommitArm, CommitFault, CommitProxy, Pair, head(), holds() (+3 more)

### Community 167 - "envelope.ts"
Cohesion: 0.18
Nodes (15): ChainDataView, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions(), chainApi() (+7 more)

### Community 168 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 17 - "node-set.test.ts"
Cohesion: 0.03
Nodes (120): StoredRow, Node, Tables, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader (+112 more)

### Community 170 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 173 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 175 - "validation.test.ts"
Cohesion: 0.13
Nodes (17): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), declared(), contentDeclared() (+9 more)

### Community 176 - "cli/run.ts"
Cohesion: 0.15
Nodes (12): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+4 more)

### Community 177 - "version-table.ts"
Cohesion: 0.19
Nodes (19): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+11 more)

### Community 179 - "postgres-image.test.ts"
Cohesion: 0.14
Nodes (15): BenchEnv, RepositoryFile, canPin(), code(), pinViolations(), repositoryFiles(), PG_SETTINGS, container (+7 more)

### Community 18 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (118): ApplyInput, ApplyOutput, StateSummary, StoredNode, LedgerHeight, Upstream, contractFixture, Ledger (+110 more)

### Community 187 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 19 - "real-tapes.ts"
Cohesion: 0.02
Nodes (83): heldClock, ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata (+75 more)

### Community 190 - "resolver-boundary.ts"
Cohesion: 0.18
Nodes (16): Boundary, Crossing, Guard, boundaryOf(), boundarySources(), guardedSymbols(), hostWith(), inRepository() (+8 more)

### Community 194 - "core-block-fetch.test.ts"
Cohesion: 0.15
Nodes (7): LedgerTable, coreBlockFetchOnFetch(), isBlockItemSource(), BOUND, CORE_BLOCK_FETCH_ID, CORE_BLOCK_ITEMS, KNOWN_NETWORKS

### Community 195 - "config-check-database.test.ts"
Cohesion: 0.12
Nodes (8): CheckTarget, CliBackend, core(), fileOf(), filesDatabase, HISTORY, RECORDED, CLI_BACKENDS

### Community 198 - "process-access.ts"
Cohesion: 0.20
Nodes (15): Access, AllowedRead, bare(), callsPathResolve(), checked(), declares(), inRepository(), inType() (+7 more)

### Community 199 - "token-metadata/browser.test.ts"
Cohesion: 0.17
Nodes (12): PageServer, main(), pageHandler(), pageUrl(), servePage(), CONTENT_TYPES, PAGE_HEADERS, PREVIEW_NODE (+4 more)

### Community 2 - "startUmbraDB"
Cohesion: 0.02
Nodes (203): AdminSeams, DatabaseParts, PostgresParts, PostgresPartsInput, UmbraDBHandle, UmbraDBOptions, EngineInput, NetworkRuleName (+195 more)

### Community 20 - "NodeClient"
Cohesion: 0.04
Nodes (95): FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, NodeClientOptions, Pending, State, Subscription (+87 more)

### Community 201 - "REPOSITORY"
Cohesion: 0.17
Nodes (8): Served, Finding, isolationProblems(), serveCommand(), ISOLATION, REPOSITORY, CONFIG, FIXTURES

### Community 207 - "RuntimeMetadata"
Cohesion: 0.19
Nodes (4): MetadataNode, RuntimeMetadata, OwnStateMetadata, hexOf()

### Community 209 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 21 - "backup/restore.ts"
Cohesion: 0.03
Nodes (128): PublicIdentity, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+120 more)

### Community 215 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 22 - ".from"
Cohesion: 0.02
Nodes (119): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+111 more)

### Community 220 - "text.test.ts"
Cohesion: 0.23
Nodes (6): BackupText, blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir

### Community 222 - "postgres-tls-server.ts"
Cohesion: 0.20
Nodes (8): TlsPostgres, makeCertificates(), startTlsPostgres(), HBA, 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …), Evidence, Problem, Suggested fix

### Community 224 - "stats-module.ts"
Cohesion: 0.32
Nodes (10): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+2 more)

### Community 227 - "SubscriptionConnection"
Cohesion: 0.35
Nodes (4): SubscriptionCarrier, SubscriptionConnection, errorMessage(), socketConnection()

### Community 23 - "host.ts"
Cohesion: 0.03
Nodes (88): LoadLedger, LedgerName, LedgerSource, ChainOutcome, LedgerTask, ParsedTransaction, AppliedState, ApplyBlock (+80 more)

### Community 233 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.20
Nodes (10): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+2 more)

### Community 235 - "provenance.ts"
Cohesion: 0.31
Nodes (9): Port, SourceRow, filesUnder(), portProblems(), ports(), provenanceProblems(), sha256Of(), sourceRows() (+1 more)

### Community 236 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 237 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 24 - "ReadHandle"
Cohesion: 0.03
Nodes (86): BlockWriteHandle, ReadHandle, Ctx, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+78 more)

### Community 247 - "ref_typescript"
Cohesion: 0.33
Nodes (6): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile()

### Community 25 - "validate.ts"
Cohesion: 0.03
Nodes (119): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, HistoryFinding, ConfigRule (+111 more)

### Community 26 - "core-transport.ts"
Cohesion: 0.03
Nodes (85): PrivateLinkAddress, PrivateLinkConnect, ResultColumn, EndpointOptions, Envelope, LinkTimers, CoreChannelSeams, CoreChannelsOptions (+77 more)

### Community 262 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 263 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 27 - "transport.test.ts"
Cohesion: 0.03
Nodes (86): PglitePathParts, Message, MessageType, PrivateBackend, SessionSeen, Pem, TestCertificates, A162Options (+78 more)

### Community 273 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 28 - "runner/process.ts"
Cohesion: 0.03
Nodes (62): NodeWait, ImportedConfig, LoadOptions, transportReaderFacts, RetryCode, PauseBy, PauseHold, BoundAddress (+54 more)

### Community 29 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (62): PrivateBlockSource, PrivateChecks, privateIntake, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision (+54 more)

### Community 3 - "column-rules.ts"
Cohesion: 0.02
Nodes (199): CheckedMigration, ContentDefinedTables, ContentOptions, TableContent, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+191 more)

### Community 30 - "contract-data-checks.ts"
Cohesion: 0.04
Nodes (102): CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw, CoreContractStatesOptions (+94 more)

### Community 31 - "cbor.ts"
Cohesion: 0.03
Nodes (102): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+94 more)

### Community 32 - "BlockRef"
Cohesion: 0.04
Nodes (47): CoreBlockItems, BlockLedgerSource, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, QueuedBlock, LedgerBinding (+39 more)

### Community 33 - "process-admin.ts"
Cohesion: 0.04
Nodes (84): NetworkShown, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, RevisionSettings, DigestRow (+76 more)

### Community 34 - "LedgerPackage"
Cohesion: 0.04
Nodes (59): LedgerPackage, LedgerTaskBlock, StateHandle, EvictionRefused, LedgerEngine, LedgerTaskFailed, Settled, Driver (+51 more)

### Community 35 - "UmbraError"
Cohesion: 0.03
Nodes (63): PostgresConnection, PostgresOptions, JobQueue, PgliteDatabase, BoundedRead, Session, UmbraError, ResultType (+55 more)

### Community 36 - "refcount-model.ts"
Cohesion: 0.04
Nodes (68): RefcountFault, BlockKind, BlockScript, BoundaryRewrite, Dice, DrivenBlock, GeneratedBlock, GeneratedState (+60 more)

### Community 37 - "token-metadata/api.ts"
Cohesion: 0.04
Nodes (100): Answer, BuiltinJson, BytesJson, commonJson, ContractTokensCursor, EventFilter, EventJson, EventPositionJson (+92 more)

### Community 39 - "migrate.ts"
Cohesion: 0.04
Nodes (82): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, AppliedRow, Runnable, Settling (+74 more)

### Community 4 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (195): ChainCheck, ChainCheckInput, BlockSource, FinalityStallCondition, InMemoryBlockSource, Wait, LoopInput, EngineConfig (+187 more)

### Community 40 - "token-metadata/harness.ts"
Cohesion: 0.04
Nodes (90): ContractLog, CoreContractLogsFullOptions, LogEventType, InMemoryItems, Handler, Json, Got, Halt (+82 more)

### Community 41 - ".read"
Cohesion: 0.04
Nodes (80): SchemaItem, Chain, ChainOptions, DigestRow, Op, States, TableName, MigrationRow (+72 more)

### Community 42 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (67): demoLink, PrivateLinkChannel, controlledTimers, PeerEnd, PeerMessage, rawPeer, TestEnd, TestEndOptions (+59 more)

### Community 43 - "state.ts"
Cohesion: 0.04
Nodes (75): ImageJson, markJson, ChainOrderError, ChainPosition, FieldEffect, GroupableIdentity, IdentityRef, IdentityState (+67 more)

### Community 44 - "codec/src/index.ts"
Cohesion: 0.06
Nodes (73): ObservedMisc, IgnoreReason, Kind, RejectReason, ValType, BoundsInvariantError, DecodedRecord, DecodeFail (+65 more)

### Community 45 - "order.property.test.ts"
Cohesion: 0.05
Nodes (74): ResolvedRange, Callback, EntryBoundary, ParallelPoint, PointArguments, PointRun, PointSchedule, CallEvent (+66 more)

### Community 46 - "resolve.ts"
Cohesion: 0.04
Nodes (76): AddressRequest, Asked, LinkPlan, NetworkInput, NetworkPlan, NetworkProblem, NetworkRequest, NetworkRule (+68 more)

### Community 47 - "loop.test.ts"
Cohesion: 0.06
Nodes (59): Contexts, Faults, LostCommit, Seen, AtGate, LoopClass, RunnerDatabase, SeenCall (+51 more)

### Community 48 - "FinalizedLoop"
Cohesion: 0.05
Nodes (18): Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, DoesNotHold, EndsTheRun, WaitingInRead, ItemsAfterWrite (+10 more)

### Community 49 - "config-check.ts"
Cohesion: 0.05
Nodes (65): ConfigFacts, SnapshotFacts, CoreChainFacts, BackupInput, RestoreBase, Environment, BackupCommandOptions, BackupOutcome (+57 more)

### Community 5 - "ledger-graph-tapes.ts"
Cohesion: 0.03
Nodes (209): CoreLedgerStateOptions, NodeBatch, contentsHash, FixtureRun, FixtureRunOptions, Reader, Seen, TableSnapshot (+201 more)

### Community 50 - "ledger/types.ts"
Cohesion: 0.05
Nodes (60): ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSourceSettings, LedgerPackageOptions, V9Logs, LoadAdapter, AdapterWorkerRequest (+52 more)

### Community 51 - "range.ts"
Cohesion: 0.05
Nodes (55): BoundaryBlockReading, BoundaryReading, TapeBuilder, Arguments, Command, TapeCommandIo, CompletenessRange, Final (+47 more)

### Community 52 - "loop-stop-harness.ts"
Cohesion: 0.06
Nodes (52): SignalJob, A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation (+44 more)

### Community 53 - "core-block-commit.test.ts"
Cohesion: 0.05
Nodes (54): BlockRow, StandInOptions, Commit, Committed, AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock() (+46 more)

### Community 54 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (57): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema (+49 more)

### Community 55 - "boundary.test.ts"
Cohesion: 0.07
Nodes (49): DesignTable, RowCoverage, ModuleReference, Finding, rule(), collationsWritten(), componentCode(), componentExports() (+41 more)

### Community 56 - "messages.ts"
Cohesion: 0.05
Nodes (42): Committed, MessageFault, Report, HeldLink, HoldingRelay, ReportRelay, bytesOf(), decodeParameter() (+34 more)

### Community 57 - "runner-core.ts"
Cohesion: 0.06
Nodes (53): ManifestEntry, Comparison, Json, Args, LineConsumer, Consumer, Json, LoadedVector (+45 more)

### Community 58 - "pglite-queue.test.ts"
Cohesion: 0.05
Nodes (38): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, Run, Job (+30 more)

### Community 59 - "refcount-restart.ts"
Cohesion: 0.06
Nodes (48): BatchJson, ContentsHash, databaseNow, Hold, Light, Line, NodeSetKeeper, Observed (+40 more)

### Community 6 - "ref_vitest"
Cohesion: 0.02
Nodes (168): NodeDatabase, BlockHeader, ModuleDeclaration, ChainBuildOptions, CrashEvent, CrashJob, ingest, IngestOptions (+160 more)

### Community 62 - "module-api.test.ts"
Cohesion: 0.06
Nodes (49): EntryRange, GraphInput, HeightRange, PastFaultCase, RefusalCase, reader(), backboneWithout(), blockItem() (+41 more)

### Community 63 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (48): StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, Observed, OutsidePoint (+40 more)

### Community 65 - "ChannelEndpoint"
Cohesion: 0.08
Nodes (20): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), exceedsUtf8(), messageEnvelope(), refuseChannel(), discard() (+12 more)

### Community 67 - "private-transport.ts"
Cohesion: 0.08
Nodes (20): PublicSide, HelloAck, JsonValue, ReadResult, StatementResult, CarrierConnection, Pending, PrivateCarrier (+12 more)

### Community 68 - "graph.ts"
Cohesion: 0.07
Nodes (46): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts, Spanned (+38 more)

### Community 69 - "api-socket.ts"
Cohesion: 0.10
Nodes (43): coreHeaders, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits (+35 more)

### Community 7 - "src/db/postgres.ts"
Cohesion: 0.02
Nodes (153): ConfiguredDatabase, ConfiguredDatabaseOptions, DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, SslMode (+145 more)

### Community 70 - "retirement.test.ts"
Cohesion: 0.06
Nodes (44): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+36 more)

### Community 72 - "version-checks.ts"
Cohesion: 0.11
Nodes (35): MetadataBlock, RuntimeMetadataEntry, OwnStateMetadata, Boundary, CallRecord, CountingNode, MetadataSelector, Select (+27 more)

### Community 74 - "networks.ts"
Cohesion: 0.06
Nodes (41): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+33 more)

### Community 75 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (32): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, ChildResult, acquirePgliteLock() (+24 more)

### Community 77 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (32): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, copyArray(), copyObject() (+24 more)

### Community 78 - "module-api.ts"
Cohesion: 0.07
Nodes (27): ApiError, ApiErrorCode, ApiRequest, ApiResponse, ApiRoutes, HttpMethod, ModuleApi, ModuleRegistration (+19 more)

### Community 79 - "log-reader.test.ts"
Cohesion: 0.08
Nodes (30): NotACell, Reader, UnknownLogSerialization, Package, alignment(), atom(), atomWith(), miscAtom() (+22 more)

### Community 8 - "db/errors.ts"
Cohesion: 0.02
Nodes (144): SchemaWriteHandle, ReadTimeoutSetting, MigrationPart, Difference, PlannedSchema, Provision, QualifiedTable, SchemaMigration (+136 more)

### Community 80 - "api-server.test.ts"
Cohesion: 0.08
Nodes (29): ChainDataAnswer, HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, AppendsVersion, Client, VersionsAnswersOnly (+21 more)

### Community 81 - "redact.ts"
Cohesion: 0.08
Nodes (33): RedactionForms, SecretForm, TextPattern, Needs, findings(), databaseText(), isMemoryDatabase(), configRedactor() (+25 more)

### Community 82 - "validation.ts"
Cohesion: 0.10
Nodes (32): PlacedDeclaration, Plain, Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject() (+24 more)

### Community 85 - "loop.ts"
Cohesion: 0.07
Nodes (32): CommitOutcome, HeightActivity, HeldHeight, Invoke, LockstepWait, LoopEnd, Progress, ReadOpener (+24 more)

### Community 86 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 87 - "page.ts"
Cohesion: 0.07
Nodes (32): ApiChannel, LinkRecord, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog() (+24 more)

### Community 88 - "TransactionHistoryEntry"
Cohesion: 0.09
Nodes (15): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, 4. Wiring `PgTemporalKV`'s `opts.tx` (+7 more)

### Community 89 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 9 - "ledger-state.test.ts"
Cohesion: 0.03
Nodes (173): BlockParsed, NodeCallOptions, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec (+165 more)

### Community 91 - "process-context.test.ts"
Cohesion: 0.07
Nodes (27): MisuseListener, PublishRefusal, Seen, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, a141Problems() (+19 more)

### Community 98 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 99 - "Tasks — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0"
Cohesion: 0.06
Nodes (33): TokenMetadataStartAfterDatabase, ignore(), params(), 19. A module UmbraDB ships: `token-metadata`, 7. The module API, Context, D1. A module, not an archive and a scanner, D2. Starting with the database (TM-1) (+25 more)

### Community 61 - "refused"
Cohesion: 0.05
Nodes (51): moduleFacts(), refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix (+43 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.04
Nodes (43): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+35 more)

### Community 73 - "data"
Cohesion: 0.05
Nodes (43): n(), data(), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not), Rework (class 3 continued — cross-vendor cold audit, rounds 2-4), Rework (class 3 — cross-vendor audit caught real correctness defects post-self-verify), 2.1 The tables of `core-ledger-state` (+35 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 108 - ".slowBlockMs"
Cohesion: 0.07
Nodes (31): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+23 more)

### Community 115 - ".source"
Cohesion: 0.06
Nodes (30): placeFor(), watchingPgDump(), 17. Trying a module, 6. Options, refusals and the handle, 7.1 Library-mode guarantees, 7.2 Refusal classes, 7. Guarantees and refusals, ADDED Requirements (+22 more)

### Community 135 - "transportReader"
Cohesion: 0.08
Nodes (25): text(), transportReader(), transportReaderRule(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 00061 — The threat model's `path:line` citations drift as the code moves (+17 more)

### Community 150 - "UmbraDB module guide"
Cohesion: 0.08
Nodes (25): hexBytes(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations, 16. Upgrades (+17 more)

### Community 157 - ".cwd"
Cohesion: 0.10
Nodes (20): 00067 — `startUmbraDB` throws synchronously when the host's working directory no longer exists, Evidence, Problem, Suggested fix, A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database (+12 more)

### Community 172 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 174 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.10
Nodes (18): up(), name, 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 3.1 The frozen catalog (the machine-facing API) (+10 more)

### Community 186 - "local-preprod-sync.mjs"
Cohesion: 0.21
Nodes (17): commitOf(), configText(), docker(), dockerHas(), dockerLater(), imageDigests(), main(), nodeRpc() (+9 more)

### Community 189 - "sweep-fixture.test.ts"
Cohesion: 0.18
Nodes (15): applyInput(), at(), batchText(), blockHash(), embeddedOf(), hex(), keysOf(), nodeSetOf() (+7 more)

### Community 191 - "Acceptance — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.13
Nodes (13): join(), normalize(), resolve(), delimiter, sep, 10. Requirement coverage, 1. Library-mode guarantees, 3. Lifecycle (+5 more)

### Community 200 - ".disconnect"
Cohesion: 0.15
Nodes (14): fault(), Suggested fix, 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants (+6 more)

### Community 202 - "Requirement: BK-1 Backup"
Cohesion: 0.13
Nodes (12): 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented, Evidence, Problem, Suggested fix, 9. `core-arch` criteria rewritten by this change, MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process (+4 more)

### Community 205 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 206 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 213 - "ledger-checks.ts"
Cohesion: 0.36
Nodes (13): a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows(), expectedStates(), nodeProblems(), plainHex() (+5 more)

### Community 214 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 219 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 221 - "Endpoints"
Cohesion: 0.17
Nodes (12): note(), Endpoints, `GET /v1/contracts/{address}/tokens?limit=&cursor=`, `GET /v1/events?contract=&tx=&limit=&cursor=`, `GET /v1/identities/{contract}/{domainSep}/{kind}?limit=&cursor=`, `GET /v1/lookup/{color}?held=shielded|unshielded`, `GET /v1/status`, `GET /v1/tokens/{color}` (+4 more)

### Community 261 - "ledger-refcount-removal.test.ts"
Cohesion: 0.25
Nodes (5): partsOf(), LEDGER_STATE_ITEM, ROOT, SWEEP_NAMES, WITHOUT_MIGRATIONS

### Community 265 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 266 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.29
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 274 - "answers.test.ts"
Cohesion: 0.33
Nodes (5): problems(), sha256(), DIR, files, table

### Community 275 - "text"
Cohesion: 0.48
Nodes (7): committedProblems(), count(), landedProblems(), neitherProblems(), parsesBefore(), processedAgainProblems(), text()

### Community 295 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 345 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 38 - ".put"
Cohesion: 0.02
Nodes (99): T(), input(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, ADDED Requirements (+91 more)

### Community 60 - "history"
Cohesion: 0.04
Nodes (54): history(), Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Scenario: A call with an already-aborted signal is rejected before any database work, Scenario: A label given at save time is returned by history and load, Scenario: A signal aborting after the call has begun does not interrupt it, Scenario: History for one wallet+network never includes another's checkpoints (+46 more)

### Community 64 - "version"
Cohesion: 0.04
Nodes (52): side(), deferred(), version(), 1. Overview, Appendix A. Reference, 0. Project setup, 1. TemporalKV, 2. Sprint close-out (+44 more)

### Community 66 - ".off"
Cohesion: 0.04
Nodes (47): Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25) (+39 more)

### Community 94 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Purpose, Requirement: TM-10 Symbol groups have two or more members of one contract, Requirement: TM-12 The proof of concept's metadata API, from finalized data, Requirement: TM-13 What the first port serves differently, Requirement: TM-14 Stored rows are a pure function of the chain, Requirement: TM-15 Payload bytes and served values are untrusted, Requirement: TM-16 It runs in the browser build (+27 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 123 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 134 - "vectors/package.json"
Cohesion: 0.07
Nodes (29): description, devDependencies, ajv, @types/node, typescript, vitest, engines, node (+21 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 147 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.07
Nodes (21): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+13 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 149 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 152 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+15 more)

### Community 155 - "codec/package.json"
Cohesion: 0.08
Nodes (23): description, devDependencies, @mip0018/vectors, @types/node, typescript, vitest, engines, node (+15 more)

### Community 159 - "package.json"
Cohesion: 0.09
Nodes (22): description, exports, files, homepage, license, main, name, type (+14 more)

### Community 160 - "stryker.token-metadata.conf.json"
Cohesion: 0.09
Nodes (22): cleanTempDir, _comment, concurrency, coverageAnalysis, disableTypeChecks, htmlReporter, fileName, jsonReporter (+14 more)

### Community 162 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 163 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 165 - "Rework (class 4)"
Cohesion: 0.10
Nodes (20): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+12 more)

### Community 169 - "mip"
Cohesion: 0.10
Nodes (20): counts, informative-payload, informative-state, normative-payload, normative-state, total, eventName, hex (+12 more)

### Community 171 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 178 - "mip"
Cohesion: 0.10
Nodes (19): counts, informative-payload, informative-state, normative-payload, normative-state, total, eventName, hex (+11 more)

### Community 180 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 181 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 182 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 184 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 185 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 188 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 192 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 193 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 196 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleResolution, noEmit, noImplicitOverride (+8 more)

### Community 197 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleResolution, noEmit, noImplicitOverride (+8 more)

### Community 203 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 204 - "UmbraDB"
Cohesion: 0.13
Nodes (15): Backup and restore, Check and run, Create a project, Example: loading `stats-module`, In your own program: `startUmbraDB`, Install UmbraDB, Project status, development and links, Quick start (browser) (+7 more)

### Community 208 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowImportingTsExtensions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess (+6 more)

### Community 210 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 211 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 212 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 216 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 217 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 218 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 223 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 225 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 226 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.17
Nodes (11): 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents, 7. `core-arch` criteria rewritten by this change, 8. Required test ids (+3 more)

### Community 229 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 230 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 231 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 232 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 234 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 238 - "[0.10.0] - 2026-10-27"
Cohesion: 0.20
Nodes (9): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changed since `v0.10.0-rc.2`: ledger nodes reclaimed by reference counting (`ledger-refcount`), Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface) (+1 more)

### Community 239 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 240 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 241 - "Requirement: CC-3 `core-contract-logs-fast` stores the logs it can read, and records the rest as unresolved"
Cohesion: 0.20
Nodes (9): ADDED Requirements, MODIFIED Requirements, Requirement: CC-3 `core-contract-logs-fast` stores the logs it can read, and records the rest as unresolved, Requirement: CC-5 Unresolved sites are part of the contract-logs item, Scenario: A computed log value, Scenario: A consumer reads both, Scenario: A partially successful transaction, Scenario: Fast equals full without unresolved sites (+1 more)

### Community 242 - "Proposal — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0 (`token-metadata`)"
Cohesion: 0.20
Nodes (9): Capabilities, Decisions taken (2026-11-05), Impact, Modified Capabilities, New Capabilities, Non-goals (what this change does NOT cover), Proposal — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0 (`token-metadata`), What changes (+1 more)

### Community 243 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 244 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 245 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 246 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 249 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 250 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Restore on the other backend, Spec delta — `backups` capability

### Community 251 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 252 - "Proposal — FAST-LOGS-UNRESOLVED: the fast contract-log provider records what it cannot read instead of halting (`fast-logs-unresolved`)"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal — FAST-LOGS-UNRESOLVED: the fast contract-log provider records what it cannot read instead of halting (`fast-logs-unresolved`), What changes, Why

### Community 253 - "Acceptance — v1.0.0 API Surface & Release Contract"
Cohesion: 0.22
Nodes (8): Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in), Precondition (blocks the whole change)

### Community 254 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 255 - "node.mjs"
Cohesion: 0.28
Nodes (5): cases, out, ABS, URI, RFC-3986

### Community 256 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 257 - "scoped-review-manifest"
Cohesion: 0.25
Nodes (7): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest

### Community 258 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 259 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 260 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 264 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 267 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 268 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 269 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 270 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 271 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 272 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 277 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 278 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 279 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 280 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 281 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 282 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 283 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 284 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 285 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 286 - "Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`), What changes, Why

### Community 287 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 288 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 289 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 290 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, What changes — the 1.0.0 gate items this change addresses, Why

### Community 291 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 292 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 293 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 294 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 296 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 297 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 298 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 299 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 300 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 301 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 302 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 303 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 304 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 305 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 306 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 307 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 308 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 309 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 310 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 311 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 312 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 313 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 314 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 315 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 316 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 317 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 318 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 319 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 320 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 321 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 322 - "00072 — `umbradb run` logs nothing when SIGTERM or SIGINT stops it"
Cohesion: 0.40
Nodes (4): 00072 — `umbradb run` logs nothing when SIGTERM or SIGINT stops it, Evidence, Problem, Suggested fix

### Community 323 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 324 - "00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why"
Cohesion: 0.40
Nodes (4): 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why, Evidence, Problem, Suggested fix

### Community 325 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 326 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 327 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 328 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 329 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 330 - "00085 — The fast contract-log provider limits mid-chain use: development-only, and it halts on partial transactions"
Cohesion: 0.40
Nodes (4): 00085 — The fast contract-log provider limits mid-chain use: development-only, and it halts on partial transactions, Evidence, Problem, Suggested fix

### Community 331 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 332 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 333 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 334 - "real/manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 336 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 337 - "00083 — Four timing-bound tests fail when the machine runs several test lanes at once"
Cohesion: 0.50
Nodes (3): 00083 — Four timing-bound tests fail when the machine runs several test lanes at once, Problem, Suggested fix

### Community 338 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 339 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 340 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 341 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 342 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 343 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 348 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 349 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 76 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 92 - "README.md"
Cohesion: 0.06
Nodes (26): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:, Choosing a database (+18 more)

### Community 93 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune (+29 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+29 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+29 more)

## Knowledge Gaps
- **78 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-7693` (+73 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4813 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `UmbraError` connect `UmbraError` to `ref_node_fs`, `declaration.ts`, `startUmbraDB`, `column-rules.ts`, `InMemoryBlockSource`, `ledger-graph-tapes.ts`, `ref_vitest`, `src/db/postgres.ts`, `db/errors.ts`, `binding.test.ts`, `tape/index.ts`, `core-ledger-state.ts`, `client.test.ts`, `config/history.ts`, `core-chain.test.ts`, `src/index.ts`, `NodeClient`, `backup/restore.ts`, `host.ts`, `ReadHandle`, `validate.ts`, `core-transport.ts`, `backbone/part-migrations.test.ts`, `runner/process.ts`, `core-private-source.test.ts`, `contract-data-checks.ts`, `cbor.ts`, `BlockRef`, `process-admin.ts`, `transport.test.ts`, `LedgerPackage`, `refcount-model.ts`, `migrate.ts`, `envelope.ts`, `.read`, `channel-queue.test.ts`, `resolve.ts`, `loop.test.ts`, `FinalizedLoop`, `config-check.ts`, `ledger/types.ts`, `version-table.ts`, `validation.test.ts`, `core-block-commit.test.ts`, `range.ts`, `pglite-queue.test.ts`, `module-api.test.ts`, `slow-block-harness.ts`, `private-transport.ts`, `graph.ts`, `version-checks.ts`, `pglite-lock.ts`, `UmbraDB`, `config/plain-data.ts`, `module-api.ts`, `RuntimeMetadata`, `api-server.test.ts`, `web-lock.ts`, `validation.ts`, `loop.ts`, `browser/src/config/load.ts`, `process-context.test.ts`, `ledger/fixtures/task-modules.ts`, `process-worker.ts`, `sha256`, `configuration-refusal.test.ts`, `options.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _78 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_node_fs` be split into smaller, more focused modules?**
  _Cohesion score 0.017933419214862023 - nodes in this community are weakly interconnected._
- **Why does `ModuleDeclaration` connect `ref_vitest` to `declaration.ts`, `startUmbraDB`, `column-rules.ts`, `InMemoryBlockSource`, `ledger-graph-tapes.ts`, `ledger-refcount-removal.test.ts`, `ledger-storage.negative-control.test.ts`, `ledger-state.test.ts`, `core-block-parsed.ts`, `binding.test.ts`, `core-ledger-state.ts`, `config/history.ts`, `core-chain.test.ts`, `node-set.test.ts`, `src/index.ts`, `backup/restore.ts`, `host.ts`, `ReadHandle`, `validate.ts`, `defineModule`, `transport.test.ts`, `runner/process.ts`, `core-private-source.test.ts`, `contract-data-checks.ts`, `node-fields-harness.ts`, `process-admin.ts`, `token-metadata/harness.ts`, `.read`, `channel-queue.test.ts`, `order.property.test.ts`, `resolve.ts`, `loop.test.ts`, `validation.test.ts`, `config-check.ts`, `FinalizedLoop`, `loop-stop-harness.ts`, `core-block-commit.test.ts`, `refcount-restart.ts`, `module-api.test.ts`, `slow-block-harness.ts`, `version`, `graph.ts`, `token-metadata/browser.test.ts`, `api-server.test.ts`, `validation.ts`, `loop.ts`, `ledger-checks.ts`, `process-context.test.ts`, `ledger/fixtures/task-modules.ts`, `node-run.ts`, `PointName`, `stagenet.test.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.018676762976437243 - nodes in this community are weakly interconnected._