# Graph Report - UmbraDB

## Corpus Check
- 1178 files · ~1,667,437 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12352 nodes · 38035 edges · 351 communities (316 shown, 35 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3163 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `1b0079dc78023338` (1178 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- vitest
- declaration.ts
- adapter-fixtures.ts
- example-checks.ts
- release-version.ts
- core.ts
- redact.ts
- fixtures/configuration.ts
- TransactionHistoryStorage
- host.ts
- node-fields-harness.ts
- resolver-boundary.ts
- module-api.test.ts
- child-processes.test.ts
- module-api.ts
- src/db/postgres.ts
- config/plain-data.ts
- postgres/transaction-history-storage.ts
- documents.ts
- file-modes.ts
- code-registry.ts
- pg-tx-history-adapter.ts
- options.ts
- fetch-fixtures.ts
- process-worker.ts
- interfaces/transaction-history-storage.ts
- Lockstep
- read-gate.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- core-ledger-state.ts
- surface.test.ts
- postgres-tls-server.ts
- core-block-commit.ts
- dispatch.ts
- pack-install.mjs
- src/ledger/identity.ts
- 5. Runner
- cbor.ts
- CheckedEntry
- core-socket.ts
- HeightRun
- ProcessContexts
- .name
- config/history.ts
- library-documents.test.ts
- parseJsonLossless
- chrome.ts
- key-handling-checks.ts
- core-block-fetch.test.ts
- block-fetch-decode.test.ts
- tape/index.ts
- HoldingRelay
- browser-harness.ts
- LoopPauses
- ws-mutual-tls.test.ts
- stats-module.ts
- version-checks.ts
- statementsOf
- api-answers.ts
- .concat
- api.ts
- cli/restore.ts
- component-table.test.ts
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- worker-threads.test.ts
- column-rules.ts
- NodeClient
- history.property.test.ts
- worker-threads-worker.ts
- buffer.ts
- midnight-env — reproducible PREPROD dev environment
- .send
- conformance-gate.test.ts
- NodeBlockSource
- Worker
- sha256
- loop.test.ts
- Buffer
- range.ts
- typescript
- CommitProxy
- runner/process.ts
- ledger/plain-data.ts
- vendored-ledger-files.test.ts
- admin/configuration.ts
- mutation-evidence.d.mts
- connectWebSocket
- builder.negative-control.test.ts
- AsyncLocalStorage
- channel-queue.test.ts
- pageBench
- LedgerPackage
- FinalizedLoop
- builds.ts
- .from
- adapter.ts
- node-format.ts
- PageApiChannel
- NodeFS
- ModeWatch
- ledger/types.ts
- core-private-source.ts
- entries.ts
- backup/backup.ts
- resolve.ts
- chain-data-tapes.ts
- Process
- admin-harness.ts
- contract-data-checks.ts
- refused-configuration.test.ts
- backup/restore.ts
- height-versioned.test.ts
- .put
- core-block-parsed.ts
- validate.test.ts
- loop-harness.ts
- order.property.test.ts
- cursor-table.test.ts
- Database
- PgTransactionHistoryStorage
- transport-faults.test.ts
- slow-block-harness.ts
- core-chain.test.ts
- dispatch.test.ts
- transform-checks.ts
- api-session.test.ts
- code
- loop.ts
- startUmbraDB
- core-transport.ts
- zero-timeouts-checks.ts
- graph.ts
- retirement.test.ts
- config-check.ts
- checkShape
- .value
- chain-events-decode.test.ts
- client.test.ts
- listening.test.ts
- page.ts
- ref_node_url
- private-transport.ts
- messages.ts
- validation.ts
- pglite-queue.test.ts
- ingest-harness.ts
- chain-placement.test.ts
- ledger-tasks-checks.ts
- boundary.test.ts
- paused-harness.ts
- pglite-lock.ts
- ChannelEndpoint
- validate.ts
- transaction-history-storage.property.test.ts
- UmbraError
- node-bridge.ts
- api-server.test.ts
- browser/build.ts
- test/postgres/setup.ts
- browser.test.ts
- Design — Sprint 3: CheckpointStore
- .configHash
- refused
- cold-boot-recovery.integration.test.ts
- .off
- UmbraDB module guide
- ref_node_child_process
- transportReader
- .slowBlockMs
- Design — START-UMBRADB: UmbraDB as a library
- Boundaries, threats and controls
- following
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- .disconnect
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- UmbraDB third-party component inventory (SBOM)
- path.ts
- 2. Points
- facade-merge-loader.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- text
- read-only-checks.ts
- crash-worker.ts
- data
- history
- T
- ADDED Requirements
- version
- core-private-source.test.ts
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- README.md
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Acceptance map — START-UMBRADB: UmbraDB as a library
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Requirement: CF-4 Every field is data, operational or secret
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- scoped-review-manifest
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Repository agent policy
- Contributing
- UmbraDB in a browser
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Requirement: BK-1 Backup
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- The database
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-infosec-signoff
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- lib.sh
- Vendored ledger builds
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time
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
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- bug-report.md
- feature-request.md
- MODIFIED Requirements
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
- ADDED Requirements
- ADDED Requirements
- package.json
- post-block-update/oracle/main.rs

## God Nodes (most connected - your core abstractions)
1. `vitest` - 404 edges
2. `UmbraError` - 346 edges
3. `ModuleDeclaration` - 194 edges
4. `InMemoryBlockSource` - 165 edges
5. `FinalizedLoop` - 133 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 102 edges
8. `Database` - 101 edges
9. `ReadHandle` - 92 edges
10. `startUmbraDB()` - 88 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (351 total, 35 thin omitted)

### Community 0 - "vitest"
Cohesion: 0.02
Nodes (233): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore (+225 more)

### Community 1 - "declaration.ts"
Cohesion: 0.02
Nodes (214): BlockItemSource, KnownPointsOnly, ModuleDeclaration, TableDeclaration, BlockRef, BlockSource, FinalityStallCondition, ProcessReason (+206 more)

### Community 10 - "adapter-fixtures.ts"
Cohesion: 0.03
Nodes (125): ApplyInput, ApplyOutput, StoredNode, V9Logs, Upstream, contractFixture, Ledger, RawPackage (+117 more)

### Community 100 - "example-checks.ts"
Cohesion: 0.11
Nodes (24): Served, BlockImport, ChildResult, CodeBlock, installedProject, isolationProblems(), serveCommand(), allowedSource() (+16 more)

### Community 103 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 104 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 106 - "redact.ts"
Cohesion: 0.10
Nodes (28): RedactionForms, SecretForm, TextPattern, Needs, findings(), databaseText(), isMemoryDatabase(), configRedactor() (+20 more)

### Community 107 - "fixtures/configuration.ts"
Cohesion: 0.08
Nodes (26): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+18 more)

### Community 108 - "TransactionHistoryStorage"
Cohesion: 0.07
Nodes (31): TransactionHistoryStorage, reason(), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier (+23 more)

### Community 11 - "host.ts"
Cohesion: 0.03
Nodes (110): LoadLedger, RetainedState, LedgerName, LedgerSource, LedgerSourceSettings, LedgerPackageOptions, LedgerTask, ParsedTransaction (+102 more)

### Community 110 - "node-fields-harness.ts"
Cohesion: 0.09
Nodes (26): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+18 more)

### Community 111 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 116 - "module-api.test.ts"
Cohesion: 0.09
Nodes (20): ApiRegistry, ApiRoutes, ModuleRegistration, AcceptsDuplicates, parsePath(), registerModuleApis(), shapeOf(), routesOf() (+12 more)

### Community 117 - "child-processes.test.ts"
Cohesion: 0.08
Nodes (26): ParentJob, Kill, Orphaned, SourceFile, alive(), bystander(), childrenOf(), commandOf() (+18 more)

### Community 118 - "module-api.ts"
Cohesion: 0.10
Nodes (20): ChainDataAnswer, ApiError, ApiErrorCode, ApiRequest, ApiResponse, HttpMethod, ModuleApi, PathSegment (+12 more)

### Community 12 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (117): SslMode, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, driverConnectionOptions, DriverError, Outcome (+109 more)

### Community 122 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (23): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+15 more)

### Community 123 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+11 more)

### Community 124 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 125 - "file-modes.ts"
Cohesion: 0.10
Nodes (24): Place, After, ModeObservation, ModeOracleOptions, PgDumpRun, PgDumpWatch, watchedBackup(), problemsAt() (+16 more)

### Community 126 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 127 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 129 - "options.ts"
Cohesion: 0.14
Nodes (26): readOptions, addressFindings(), configFindings(), finding(), guarded(), isAbortSignal(), isHost(), isObject() (+18 more)

### Community 13 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (120): NodeCallOptions, ProcessCondition, EventSpec, Scenario, RecordingClient, ArgType, BlockOptions, CallSpec (+112 more)

### Community 130 - "process-worker.ts"
Cohesion: 0.12
Nodes (21): Scope, crossedError, StartRun, ToProcessWorker, withDevelopmentOptIn(), answer(), backUp(), connectLink() (+13 more)

### Community 131 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 133 - "Lockstep"
Cohesion: 0.11
Nodes (10): InstanceView, PrivateInstance, Entry, Lockstep, LockstepOptions, LockstepRefusal, byId(), privateInstancesOf() (+2 more)

### Community 134 - "read-gate.ts"
Cohesion: 0.14
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 136 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 137 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 138 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 14 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (110): BlockLedgerSource, LedgerBinding, LedgerStateItem, retainedStates, CoreRevision, StateRow, StoredState, GreyView (+102 more)

### Community 140 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 142 - "postgres-tls-server.ts"
Cohesion: 0.11
Nodes (19): BenchEnv, TlsPostgres, RepositoryFile, makeCertificates(), startTlsPostgres(), canPin(), pinViolations(), repositoryFiles() (+11 more)

### Community 143 - "core-block-commit.ts"
Cohesion: 0.12
Nodes (23): AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock(), hex(), ledgerVersionOf(), sameBytes(), startOf() (+15 more)

### Community 145 - "dispatch.ts"
Cohesion: 0.18
Nodes (23): Callback, ParallelPoint, PointSchedule, CoreStopsFirst, boundaryModules(), dispatch(), entryIdOf(), isBackbonePart() (+15 more)

### Community 147 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 148 - "src/ledger/identity.ts"
Cohesion: 0.17
Nodes (20): ManifestLine, LedgerReleasePackage, checkLedgerPackage(), checkLedgerPackages(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+12 more)

### Community 149 - "5. Runner"
Cohesion: 0.18
Nodes (18): ChainDataView, AppendsVersion, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions() (+10 more)

### Community 15 - "cbor.ts"
Cohesion: 0.03
Nodes (126): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+118 more)

### Community 150 - "CheckedEntry"
Cohesion: 0.19
Nodes (21): CoreChainFacts, RestoreBase, CheckState, ConfigCheckOptions, CommandConfig, ProcessSide, HistoryInput, CheckedConfig (+13 more)

### Community 151 - "core-socket.ts"
Cohesion: 0.13
Nodes (15): PrivateLinkAddress, Connected, CoreTransportOptions, CoreSessionOptions, LinkSession, TransportTls, PrivateSocketTransportOptions, SocketLimits (+7 more)

### Community 152 - "HeightRun"
Cohesion: 0.10
Nodes (9): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, LateRedelivery, CommitsDespiteLastWrite, WaitsInTransaction (+1 more)

### Community 153 - "ProcessContexts"
Cohesion: 0.12
Nodes (4): ProcessContexts, ProcessItems, providesProcessItem(), sealed()

### Community 155 - ".name"
Cohesion: 0.13
Nodes (14): Fetching, Recorder, fakePackage(), regular(), system(), 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem (+6 more)

### Community 16 - "config/history.ts"
Cohesion: 0.04
Nodes (119): CoreVersion, CoreSettings, versionEntry, HistoryCheck, HistoryCode, HistoryContext, HistoryOptions, HistoryRow (+111 more)

### Community 160 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 161 - "parseJsonLossless"
Cohesion: 0.17
Nodes (10): SubscriptionCarrier, SubscriptionConnection, parseJsonLossless(), connectChannel(), errorMessage(), socketConnection(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence (+2 more)

### Community 163 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 164 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 167 - "core-block-fetch.test.ts"
Cohesion: 0.13
Nodes (10): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, coreBlockFetchOnFetch(), isBlockItemSource(), blockContext(), BOUND (+2 more)

### Community 168 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (16): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), concatBytes(), encodeCompact() (+8 more)

### Community 17 - "tape/index.ts"
Cohesion: 0.04
Nodes (84): Recorded, Failure, Variant, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest (+76 more)

### Community 172 - "HoldingRelay"
Cohesion: 0.15
Nodes (5): Report, HoldingRelay, ReportRelay, sendable(), typeOf()

### Community 173 - "browser-harness.ts"
Cohesion: 0.25
Nodes (17): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+9 more)

### Community 176 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 178 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (12): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+4 more)

### Community 179 - "stats-module.ts"
Cohesion: 0.20
Nodes (13): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+5 more)

### Community 18 - "version-checks.ts"
Cohesion: 0.03
Nodes (103): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, Boundary, BoundaryBlock, builtInNetwork, Issue (+95 more)

### Community 182 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 186 - "api-answers.ts"
Cohesion: 0.21
Nodes (12): HeadersArgument, answerNotServing(), byteLength(), isCoreHeader(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing() (+4 more)

### Community 188 - ".concat"
Cohesion: 0.16
Nodes (11): Armed, CommitArm, CommitFault, Pair, probe(), holds(), tailOf(), records (+3 more)

### Community 19 - "api.ts"
Cohesion: 0.03
Nodes (87): BlockRow, commandTarget, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, UmbraConfig, BlockWriteHandle (+79 more)

### Community 192 - "cli/restore.ts"
Cohesion: 0.19
Nodes (10): RestoreSeams, Chain, RestoreCommandOptions, RestoreOutcome, RestoreJob, nodeOptionsOf(), chainOf(), runRestore() (+2 more)

### Community 193 - "component-table.test.ts"
Cohesion: 0.15
Nodes (10): DesignTable, RowCoverage, rule(), opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS (+2 more)

### Community 195 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 196 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 197 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 2 - "column-rules.ts"
Cohesion: 0.01
Nodes (216): TableDigest, TableDigestRow, DumpInput, CaptureColumn, CapturedTable, CaptureState, CheckedMigration, ModuleColumn (+208 more)

### Community 20 - "NodeClient"
Cohesion: 0.05
Nodes (73): FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+65 more)

### Community 201 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 203 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 204 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 205 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.18
Nodes (9): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS) (+1 more)

### Community 209 - "conformance-gate.test.ts"
Cohesion: 0.20
Nodes (9): GateRun, Pids, alive(), kill(), runGate(), survivors(), GATE, REPOSITORY (+1 more)

### Community 21 - "NodeBlockSource"
Cohesion: 0.04
Nodes (46): CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, QueuedBlock, NodeSubscription, BlockItems (+38 more)

### Community 219 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 22 - "loop.test.ts"
Cohesion: 0.04
Nodes (72): WaitingInRead, Faults, LostCommit, Outcomes, Seen, AtGate, LoopClass, RunnerDatabase (+64 more)

### Community 227 - "Buffer"
Cohesion: 0.28
Nodes (4): Buffer, Hash, createHash(), How the page is built

### Community 23 - "range.ts"
Cohesion: 0.04
Nodes (79): NodeClientOptions, Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions (+71 more)

### Community 236 - "typescript"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 24 - "runner/process.ts"
Cohesion: 0.04
Nodes (74): ChainCheck, ChainCheckInput, TransportReader, LoadOptions, VerifyLedgerPackagesOptions, transportReaderFacts, BoundAddress, CloseStep (+66 more)

### Community 247 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 248 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 25 - "admin/configuration.ts"
Cohesion: 0.04
Nodes (72): ConfigFacts, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, RevisionSettings, DigestRow, ModuleFacts (+64 more)

### Community 258 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "connectWebSocket"
Cohesion: 0.04
Nodes (64): ConnectSocket, Outage, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+56 more)

### Community 260 - "builder.negative-control.test.ts"
Cohesion: 0.29
Nodes (3): Failure, Variant, WrongRecording

### Community 27 - "channel-queue.test.ts"
Cohesion: 0.05
Nodes (71): demoLink, Envelope, LinkTimers, MessagePortLike, EngineInput, controlledTimers, PeerEnd, PeerMessage (+63 more)

### Community 279 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 28 - "LedgerPackage"
Cohesion: 0.05
Nodes (42): LedgerPackage, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, StagenetBlockJson, StagenetFixtureJson, stagenetReplay (+34 more)

### Community 29 - "FinalizedLoop"
Cohesion: 0.05
Nodes (20): EntryBoundary, Activity, FinalizedLoop, LoopObserver, Startup, DoesNotHold, EndsTheRun, SkipsLockstep (+12 more)

### Community 3 - "builds.ts"
Cohesion: 0.02
Nodes (202): PrivateIntakeOptions, DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, LockstepCondition, LockstepInstance, TickerConfig (+194 more)

### Community 30 - ".from"
Cohesion: 0.05
Nodes (70): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, ModelBatch, SweepModel, TableSnapshot, FixtureNode (+62 more)

### Community 31 - "adapter.ts"
Cohesion: 0.04
Nodes (63): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+55 more)

### Community 32 - "node-format.ts"
Cohesion: 0.06
Nodes (57): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+49 more)

### Community 33 - "ledger/types.ts"
Cohesion: 0.05
Nodes (66): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+58 more)

### Community 34 - "core-private-source.ts"
Cohesion: 0.05
Nodes (56): ConfiguredGenesis, PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision (+48 more)

### Community 35 - "entries.ts"
Cohesion: 0.03
Nodes (71): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, CoreEntryInput, CoreSettingsBase, Entry (+63 more)

### Community 36 - "backup/backup.ts"
Cohesion: 0.06
Nodes (65): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, ManifestHistoryRow, ManifestMigration, ManifestTool (+57 more)

### Community 37 - "resolve.ts"
Cohesion: 0.04
Nodes (66): AddressRequest, Asked, LinkPlan, NetworkInput, NetworkPlan, NetworkProblem, NetworkRequest, NetworkRule (+58 more)

### Community 38 - "chain-data-tapes.ts"
Cohesion: 0.06
Nodes (61): BlockSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape (+53 more)

### Community 39 - "Process"
Cohesion: 0.06
Nodes (17): RetryCode, PauseHold, Process, RetryCondition, SignalTarget, openedCursorHeight(), isBlockEventSource(), bindLedgerParser() (+9 more)

### Community 4 - "admin-harness.ts"
Cohesion: 0.02
Nodes (203): NetworkShown, MountedAdminAnswer, AdminSeams, ProcessAdminOptions, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin (+195 more)

### Community 40 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (63): CoreContractStatesOptions, ContractStateRow, CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+55 more)

### Community 41 - "refused-configuration.test.ts"
Cohesion: 0.06
Nodes (59): EngineConfig, Answered, Start, Refusal, Start, first(), startProcess(), adminSource() (+51 more)

### Community 42 - "backup/restore.ts"
Cohesion: 0.05
Nodes (54): PublicIdentity, Checked, PublicSide, RestoreChain, RestoreInput, RestoreTarget, BackupText, createReadStream() (+46 more)

### Community 43 - "height-versioned.test.ts"
Cohesion: 0.05
Nodes (45): VersionedValue, TestBackend, HeldRead, Job, Outcome, Reads, Step, StoredVersion (+37 more)

### Community 44 - ".put"
Cohesion: 0.03
Nodes (60): ItemSink, 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+52 more)

### Community 45 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (54): BlockEventSource, CoreLedgerVersion, LedgerPackageIdentity, BlockContext, blockBodyOf(), blockParsedItemOf(), blockParsedOf(), boundLedgerParser() (+46 more)

### Community 46 - "validate.test.ts"
Cohesion: 0.05
Nodes (51): EntryRef, CursorRow, Expected, refusal(), validateConfig(), validateDeclarations(), checked(), findings() (+43 more)

### Community 47 - "loop-harness.ts"
Cohesion: 0.06
Nodes (48): OpenedFacts, Revision, EntryRange, ResolvedGraph, MisuseListener, ProcessContextsInput, PublishRefusal, Seen (+40 more)

### Community 48 - "order.property.test.ts"
Cohesion: 0.05
Nodes (54): PointName, PointArguments, PointRun, Misuse, SlowBlockCondition, CallEvent, Recorder, A43Case (+46 more)

### Community 49 - "cursor-table.test.ts"
Cohesion: 0.05
Nodes (46): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, CursorValue, Case, cursorDatabase (+38 more)

### Community 5 - "Database"
Cohesion: 0.02
Nodes (190): Database, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+182 more)

### Community 50 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (40): MergeEntriesFn, PgTransactionHistoryStorage, PgWalletSdkTransactionHistoryAdapter, rowToEntry(), phaseB_freshProcessRestoreAndVerify(), makeAdapter(), referenceMergeEntries(), 4. Wiring `PgTemporalKV`'s `opts.tx` (+32 more)

### Community 51 - "transport-faults.test.ts"
Cohesion: 0.07
Nodes (45): CoreTransport, Message, Ended, rawClient, Escape, Refused, splitAddress(), startCoreTransport() (+37 more)

### Community 52 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (47): Times, Wait, askedSource, BodyRead, HoldMode, Observed, OutsidePoint, Seen (+39 more)

### Community 53 - "core-chain.test.ts"
Cohesion: 0.06
Nodes (37): Bound, ChainSource, CoreChainBinding, NodeWait, WaitingListener, ConfigRow, ConfigHashRow, WaitingCondition (+29 more)

### Community 54 - "dispatch.test.ts"
Cohesion: 0.07
Nodes (46): GraphInput, HeightRange, PastFaultCase, RefusalCase, resolveGraph(), revisionAt(), reader(), backboneWithout() (+38 more)

### Community 55 - "transform-checks.ts"
Cohesion: 0.10
Nodes (36): TransformError, SubscriptionId, NotificationRange, baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape(), expectVariantOutput() (+28 more)

### Community 56 - "api-session.test.ts"
Cohesion: 0.09
Nodes (46): coreHeaders, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits (+38 more)

### Community 57 - "code"
Cohesion: 0.04
Nodes (47): Finding, code(), CONFIG, FIXTURES, Added, Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line (+39 more)

### Community 58 - "loop.ts"
Cohesion: 0.06
Nodes (40): CallbackFailure, ReasonCode, Unwrapped, HeightActivity, HeightFailure, Invoke, LockstepWait, LoopEnd (+32 more)

### Community 6 - "startUmbraDB"
Cohesion: 0.02
Nodes (186): PrivateLinkChannel, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork, UmbraDBOptions (+178 more)

### Community 61 - "core-transport.ts"
Cohesion: 0.06
Nodes (34): PrivateLinkConnect, EndpointOptions, CoreChannelSeams, CoreChannelsOptions, Queued, CoreLink, coreSessions, LinkConnection (+26 more)

### Community 62 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (34): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+26 more)

### Community 63 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+40 more)

### Community 65 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 66 - "config-check.ts"
Cohesion: 0.06
Nodes (39): CheckFinding, CheckStep, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, ConfigFinding (+31 more)

### Community 67 - "checkShape"
Cohesion: 0.07
Nodes (38): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+30 more)

### Community 68 - ".value"
Cohesion: 0.14
Nodes (21): TypeDef, ScaleError, ScaleReader, ValueReader, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic() (+13 more)

### Community 69 - "chain-events-decode.test.ts"
Cohesion: 0.08
Nodes (36): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+28 more)

### Community 7 - "client.test.ts"
Cohesion: 0.02
Nodes (89): NodeRetry, HandSocket, HandSockets, Answer, FakeNode, Handler, Received, recorded (+81 more)

### Community 70 - "listening.test.ts"
Cohesion: 0.06
Nodes (28): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+20 more)

### Community 71 - "page.ts"
Cohesion: 0.06
Nodes (34): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+26 more)

### Community 72 - "ref_node_url"
Cohesion: 0.07
Nodes (32): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, ReportedTest, guardContainers(), guardPid(), watcherInput() (+24 more)

### Community 73 - "private-transport.ts"
Cohesion: 0.08
Nodes (18): PublicSide, HelloAck, JsonValue, ReadResult, StatementResult, CarrierConnection, Pending, PrivateCarrier (+10 more)

### Community 74 - "messages.ts"
Cohesion: 0.06
Nodes (36): Committed, MessageFault, MessageType, instanceIdSchema(), bytesOf(), decodeParameter(), decodeValue(), describe() (+28 more)

### Community 76 - "validation.ts"
Cohesion: 0.06
Nodes (36): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, main(), pageHandler() (+28 more)

### Community 77 - "pglite-queue.test.ts"
Cohesion: 0.08
Nodes (25): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, openPgliteOn(), pgliteBackend() (+17 more)

### Community 8 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (160): Manifest, Restored, StateSummary, BlockHeader, ingest, IngestOptions, SourceClass, watched (+152 more)

### Community 80 - "chain-placement.test.ts"
Cohesion: 0.08
Nodes (37): BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, EventPhase, itemsSeen, Json (+29 more)

### Community 81 - "ledger-tasks-checks.ts"
Cohesion: 0.10
Nodes (32): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses(), expectedCallArgs(), plainWatchModule() (+24 more)

### Community 82 - "boundary.test.ts"
Cohesion: 0.11
Nodes (34): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+26 more)

### Community 83 - "paused-harness.ts"
Cohesion: 0.10
Nodes (32): ReadOnlyDatabase, A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running (+24 more)

### Community 84 - "pglite-lock.ts"
Cohesion: 0.09
Nodes (30): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, acquirePgliteLock(), directoryPath() (+22 more)

### Community 85 - "ChannelEndpoint"
Cohesion: 0.11
Nodes (11): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), messageEnvelope(), refuseChannel(), queuedSlowProblems(), 4. Channels (+3 more)

### Community 86 - "validate.ts"
Cohesion: 0.10
Nodes (37): ConfigRule, CursorRule, Issue, Plain, SettingsSchema, coreSettingsSchema(), closest(), configFindings() (+29 more)

### Community 87 - "transaction-history-storage.property.test.ts"
Cohesion: 0.08
Nodes (25): EntryContent, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, Command, ReplayableStorage, abortErrorLike(), capitalize(), isPlainObject() (+17 more)

### Community 9 - "UmbraError"
Cohesion: 0.02
Nodes (104): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, PgliteLockUse, ReadOptions, ReadTimeoutSetting (+96 more)

### Community 91 - "node-bridge.ts"
Cohesion: 0.09
Nodes (22): ChildReader, NodeStore, Thread, BridgeServer, bridgeStore, Growable, childRefKeys(), readChildren() (+14 more)

### Community 92 - "api-server.test.ts"
Cohesion: 0.09
Nodes (28): HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, Client, VersionsAnswersOnly, names(), configHashesOf() (+20 more)

### Community 93 - "browser/build.ts"
Cohesion: 0.07
Nodes (27): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+19 more)

### Community 95 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (30): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, Sql, SuiteWatchdogTimeoutError, pool() (+22 more)

### Community 97 - "browser.test.ts"
Cohesion: 0.08
Nodes (36): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+28 more)

### Community 156 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.10
Nodes (19): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions (+11 more)

### Community 245 - ".configHash"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, Spec delta — `private-processes` capability

### Community 99 - "refused"
Cohesion: 0.07
Nodes (33): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, The node on `/status`, 7. Storage helpers, Requirement: AE-3 States and conditions (+25 more)

### Community 109 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (21): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), packageDistFile(), buildUnshieldedConfig(), firstStateWhere(), registerSuiteLifecycle() (+13 more)

### Community 113 - ".off"
Cohesion: 0.06
Nodes (30): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 2.1 Where the probe runs (the one real design decision), 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract (+22 more)

### Community 114 - "UmbraDB module guide"
Cohesion: 0.07
Nodes (31): side(), migrations(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations (+23 more)

### Community 121 - "ref_node_child_process"
Cohesion: 0.06
Nodes (20): end(), removeContainers(), check, checker, deadlineMs, env, forwarded, killGraceMs (+12 more)

### Community 154 - "transportReader"
Cohesion: 0.10
Nodes (19): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 10. Requirement coverage, 2. Network (+11 more)

### Community 162 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 165 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.11
Nodes (17): moduleFacts(), transportReaderRule(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout (+9 more)

### Community 166 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 175 - "following"
Cohesion: 0.12
Nodes (18): cursorRead(), following(), Backup and restore, Check and run, Configuration files, Create a project, Example: loading `stats-module`, Install UmbraDB (+10 more)

### Community 183 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (13): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+5 more)

### Community 184 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 187 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 194 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 200 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 213 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 228 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 231 - "2. Points"
Cohesion: 0.22
Nodes (6): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix, 2. Points

### Community 243 - "facade-merge-loader.ts"
Cohesion: 0.54
Nodes (5): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), midnightWalletRepoRoot()

### Community 250 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 259 - "text"
Cohesion: 0.48
Nodes (7): committedProblems(), count(), landedProblems(), neitherProblems(), parsesBefore(), processedAgainProblems(), text()

### Community 310 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 322 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 59 - "data"
Cohesion: 0.04
Nodes (52): params(), n(), data(), 7. The module API, ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats (+44 more)

### Community 60 - "history"
Cohesion: 0.05
Nodes (47): history(), Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Scenario: A call with an already-aborted signal is rejected before any database work, Scenario: A label given at save time is returned by history and load, Scenario: A signal aborting after the call has begun does not interrupt it, Scenario: History for one wallet+network never includes another's checkpoints (+39 more)

### Community 64 - "T"
Cohesion: 0.04
Nodes (46): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+38 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 88 - "version"
Cohesion: 0.06
Nodes (37): deferred(), version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check (+29 more)

### Community 96 - "core-private-source.test.ts"
Cohesion: 0.06
Nodes (10): height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PRIVATE_CORE_DIGEST, ACK_OF_CORE (+2 more)

### Community 98 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 119 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.06
Nodes (26): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+18 more)

### Community 120 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 139 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 141 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (25): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+17 more)

### Community 144 - "README.md"
Cohesion: 0.10
Nodes (17): Choosing a database, At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails, Generate your local wallet (+9 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0, Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+15 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 158 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 159 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 169 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 170 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 174 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 177 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 180 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 181 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 189 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 190 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 191 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 198 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 199 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 202 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 206 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 207 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 210 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 211 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 214 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 215 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 216 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 217 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 218 - "Acceptance map — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.18
Nodes (10): 10. Definition of done, item by item, 1. Library-mode guarantees, 2. Network, 3. Lifecycle, 4. Channels, 5. Modules and the ledger worker, 7. The command and shared resolution, 8. Mounted admin, the database, security through the new paths (+2 more)

### Community 220 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 221 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 222 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 223 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-4 Every field is data, operational or secret, Scenario: A function in the configuration, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: A user module from the configuration file, Scenario: Two `core` revisions with different databases (+1 more)

### Community 224 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 225 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 226 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 229 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 230 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 232 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 233 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 234 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 235 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.22
Nodes (8): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution, Design — v1.0.0-perf-baseline

### Community 238 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 239 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 240 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 241 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 242 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 244 - "Requirement: BK-1 Backup"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 246 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 249 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 251 - "The database"
Cohesion: 0.29
Nodes (7): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, TLS to PostgreSQL: `ssl`, UmbraDB operator guide

### Community 252 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 253 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 254 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 255 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 256 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 257 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 262 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 263 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 264 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 265 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 266 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 267 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 268 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 269 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 270 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 271 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 272 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 273 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 274 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 275 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 276 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 277 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 278 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 280 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 281 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 282 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 283 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 284 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 285 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 286 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 287 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 288 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 289 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 290 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 291 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 292 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 293 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 294 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 295 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 296 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 297 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 298 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 299 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 300 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 301 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 302 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 303 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 304 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 305 - "00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)"
Cohesion: 0.40
Nodes (4): 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …), Evidence, Problem, Suggested fix

### Community 306 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 307 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 308 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 309 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 311 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 312 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 313 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 314 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 315 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 316 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 317 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 318 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 319 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 90 - "package.json"
Cohesion: 0.05
Nodes (39): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+31 more)

### Community 94 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-9110`, `RFC-3339`, `RFC-3339`, `RFC-8949` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4062 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `declaration.ts`, `column-rules.ts`, `builds.ts`, `admin-harness.ts`, `Database`, `startUmbraDB`, `client.test.ts`, `ingest-harness.ts`, `UmbraError`, `adapter-fixtures.ts`, `host.ts`, `src/db/postgres.ts`, `fetch-fixtures.ts`, `core-ledger-state.ts`, `cbor.ts`, `config/history.ts`, `tape/index.ts`, `version-checks.ts`, `api.ts`, `NodeClient`, `NodeBlockSource`, `loop.test.ts`, `runner/process.ts`, `admin/configuration.ts`, `connectWebSocket`, `channel-queue.test.ts`, `LedgerPackage`, `.from`, `adapter.ts`, `node-format.ts`, `ledger/types.ts`, `core-private-source.ts`, `entries.ts`, `backup/backup.ts`, `resolve.ts`, `contract-data-checks.ts`, `refused-configuration.test.ts`, `backup/restore.ts`, `height-versioned.test.ts`, `validate.test.ts`, `loop-harness.ts`, `order.property.test.ts`, `cursor-table.test.ts`, `transport-faults.test.ts`, `slow-block-harness.ts`, `core-chain.test.ts`, `dispatch.test.ts`, `transform-checks.ts`, `api-session.test.ts`, `code`, `loop.ts`, `zero-timeouts-checks.ts`, `retirement.test.ts`, `config-check.ts`, `chain-events-decode.test.ts`, `listening.test.ts`, `ref_node_url`, `messages.ts`, `validation.ts`, `pglite-queue.test.ts`, `chain-placement.test.ts`, `ledger-tasks-checks.ts`, `boundary.test.ts`, `pglite-lock.ts`, `transaction-history-storage.property.test.ts`, `package.json`, `node-bridge.ts`, `api-server.test.ts`, `browser/build.ts`, `test/postgres/setup.ts`, `core-private-source.test.ts`, `browser.test.ts`, `example-checks.ts`, `release-version.ts`, `core.ts`, `redact.ts`, `cold-boot-recovery.integration.test.ts`, `node-fields-harness.ts`, `resolver-boundary.ts`, `module-api.test.ts`, `child-processes.test.ts`, `ref_node_child_process`, `config/plain-data.ts`, `postgres/transaction-history-storage.ts`, `documents.ts`, `code-registry.ts`, `pg-tx-history-adapter.ts`, `options.ts`, `Lockstep`, `read-gate.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `surface.test.ts`, `postgres-tls-server.ts`, `src/ledger/identity.ts`, `5. Runner`, `core-socket.ts`, `library-documents.test.ts`, `key-handling-checks.ts`, `core-block-fetch.test.ts`, `block-fetch-decode.test.ts`, `excluded-not-exported.test.ts`, `LoopPauses`, `ws-mutual-tls.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `component-table.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `history.property.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `conformance-gate.test.ts`, `facade-merge-loader.ts`, `vendored-ledger-files.test.ts`, `builder.negative-control.test.ts`, `pglite.test.ts`?**
  _High betweenness centrality (0.250) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-9110`, `RFC-3339` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.01820712239050348 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `vitest`, `declaration.ts`, `column-rules.ts`, `options.ts`, `admin-harness.ts`, `Database`, `startUmbraDB`, `client.test.ts`, `ingest-harness.ts`, `builds.ts`, `host.ts`, `src/db/postgres.ts`, `fetch-fixtures.ts`, `core-ledger-state.ts`, `core-block-commit.ts`, `config/history.ts`, `cbor.ts`, `version-checks.ts`, `api.ts`, `src/ledger/identity.ts`, `NodeBlockSource`, `NodeClient`, `5. Runner`, `runner/process.ts`, `ProcessContexts`, `loop.test.ts`, `CheckedEntry`, `admin/configuration.ts`, `FinalizedLoop`, `channel-queue.test.ts`, `range.ts`, `ledger/types.ts`, `core-private-source.ts`, `backup/backup.ts`, `resolve.ts`, `Process`, `refused-configuration.test.ts`, `backup/restore.ts`, `height-versioned.test.ts`, `validate.test.ts`, `loop-harness.ts`, `cursor-table.test.ts`, `transport-faults.test.ts`, `slow-block-harness.ts`, `core-chain.test.ts`, `statementsOf`, `dispatch.test.ts`, `transform-checks.ts`, `loop.ts`, `core-transport.ts`, `zero-timeouts-checks.ts`, `graph.ts`, `cli/restore.ts`, `config-check.ts`, `checkShape`, `browser/src/config/load.ts`, `private-transport.ts`, `validation.ts`, `pglite-queue.test.ts`, `ledger-tasks-checks.ts`, `pglite-lock.ts`, `validate.ts`, `tape/index.ts`, `sha256`, `api-server.test.ts`, `core-private-source.test.ts`, `2. Points`, `fixtures/configuration.ts`, `module-api.test.ts`, `module-api.ts`, `ref_node_child_process`, `config/plain-data.ts`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.018262016654299613 - nodes in this community are weakly interconnected._