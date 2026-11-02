# Graph Report - UmbraDB

## Corpus Check
- 1198 files · ~1,695,959 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12489 nodes · 38513 edges · 341 communities (306 shown, 35 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3229 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `34579ef4a109ff73` (1198 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- startUmbraDB
- ref_node_fs
- .from
- checks.test.ts
- TransactionHistoryEntry
- node.test.ts
- resolver-boundary.ts
- .concat
- file-modes.ts
- options.ts
- ledger/types.ts
- node-fields-harness.ts
- src/ledger/identity.ts
- code-registry.ts
- test/postgres/setup.ts
- process-worker.ts
- pg-tx-history-adapter.ts
- src/db/postgres.ts
- paused-harness.ts
- documents.ts
- ref_node_http
- config/plain-data.ts
- core.ts
- node-bridge.ts
- example-checks.ts
- core-ledger-state.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- surface.test.ts
- browser.test.ts
- declaration.ts
- ledger/metadata.ts
- pack-install.mjs
- block-fetch-decode.test.ts
- core-block-fetch/metadata.ts
- manifest.ts
- validation.ts
- core-block-parsed.ts
- demo-handlers.test.ts
- .value
- library-documents.test.ts
- chrome.ts
- key-handling-checks.ts
- browser-harness.ts
- client.test.ts
- read-height.property.test.ts
- version-table.ts
- text.test.ts
- readRuntimeMetadata
- core-config.test.ts
- LoopPauses
- validation.test.ts
- readiness.test.ts
- ws-mutual-tls.test.ts
- checkShape
- validate.ts
- stats-module.ts
- browser/serve.ts
- quiet-host.child.ts
- UmbraError
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- worker-threads.test.ts
- history.property.test.ts
- column-rules.ts
- core-transport.ts
- worker-threads-worker.ts
- Design — Sprint 1: project setup + TemporalKV
- .send
- TapeAnswers
- Worker
- NodeClient
- compare.ts
- ref_node_crypto
- typescript
- module-api.ts
- tape/index.ts
- mutation-evidence.d.mts
- TransportProxy
- AsyncLocalStorage
- vitest
- config/history.ts
- ReadHandle
- transform-checks.ts
- core-private-source.test.ts
- api.ts
- contract-data-checks.ts
- channel-queue.test.ts
- PageApiChannel
- CliBackend
- NodeFS
- Keeping
- FinalizedLoop
- devnet-upgrade.test.ts
- loop.ts
- range.test.ts
- ingest-harness.ts
- adapter.ts
- LedgerPackage
- db/backends.ts
- InMemoryBlockSource
- cbor.ts
- api-server.test.ts
- configured.ts
- signal-ignored-fixtures.ts
- runner/process.ts
- entries.ts
- interfaces/transaction-history-storage.ts
- messages.ts
- resolve.ts
- adapter-fixtures.ts
- PgTransactionHistoryStorage
- binding.test.ts
- slow-block-harness.ts
- Process
- redact.ts
- code
- PointName
- admin-harness.ts
- range.ts
- containers.test.ts
- ModuleDeclaration
- boundary.test.ts
- admin/configuration.ts
- core-block-commit.test.ts
- cold-boot-recovery.integration.test.ts
- retirement.test.ts
- writer-lock-checks.ts
- builds.ts
- private/lockstep-wait.test.ts
- zero-timeouts-checks.ts
- graph.ts
- page.ts
- config-check.ts
- src/config/load.ts
- loop.test.ts
- fetch-fixtures.ts
- events-fixtures.ts
- backup/backup.ts
- networks.ts
- ChannelEndpoint
- Buffer
- held-height.test.ts
- BlockRef
- browser/build.ts
- node-run.ts
- transport.test.ts
- release-version.ts
- ProcessAdmin
- chain-data.negative-control.test.ts
- core-chain-events.ts
- version-checks.ts
- .retrying
- data
- .slowBlockMs
- transportReader
- refused
- .source
- ADDED Requirements
- backupAtStop
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- Boundaries, threats and controls
- Design — START-UMBRADB: UmbraDB as a library
- .boolean
- conformance-gate.mjs
- mutation-per-adapter.mjs
- inMemoryBlock
- twox.ts
- Design — v1.1.0: Quint model checking
- UmbraDB third-party component inventory (SBOM)
- browser.negative-control.test.ts
- path.ts
- midnight-env — reproducible PREPROD dev environment
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- fresh-instance.mjs
- crash-worker.ts
- .put
- history
- .off
- version
- UmbraDB module guide
- ADDED Requirements
- graph.py
- ADDED Requirements
- package.json
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- README.md
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- ADDED Requirements
- devDependencies
- Requirement: BK-1 Backup
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- Requirement: CF-4 Every field is data, operational or secret
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- MODIFIED Requirements
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
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
- dependencies
- lib.sh
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00023 — The blocks table's height partitions end at 5,000,000
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
- 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes
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
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 412 edges
2. `UmbraError` - 346 edges
3. `ModuleDeclaration` - 195 edges
4. `InMemoryBlockSource` - 175 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 102 edges
8. `startUmbraDB()` - 102 edges
9. `Database` - 101 edges
10. `ReadHandle` - 92 edges

## Surprising Connections (you probably didn't know these)
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
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

## Communities (341 total, 35 thin omitted)

### Community 0 - "startUmbraDB"
Cohesion: 0.02
Nodes (203): BackupWritten, MainProcess, DatabaseParts, PostgresParts, PostgresPartsInput, Address, UmbraDBBackup, UmbraDBCondition (+195 more)

### Community 1 - "ref_node_fs"
Cohesion: 0.02
Nodes (180): BackupSeams, Manifest, RestoreChain, RestoreSeams, BackupOutcome, CommandHandler, CommandIo, Chain (+172 more)

### Community 10 - ".from"
Cohesion: 0.03
Nodes (138): CoreLedgerStateOptions, RetainedState, GreyPicker, LedgerEvent, TransactionResult, VmLog, FixtureRun, FixtureRunOptions (+130 more)

### Community 100 - "checks.test.ts"
Cohesion: 0.08
Nodes (25): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkId(), checkNames() (+17 more)

### Community 101 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 102 - "node.test.ts"
Cohesion: 0.08
Nodes (8): heldClock, Frame, RawClient, TapeClock, randomPort(), BARRIER_METHOD, SYSTEM_CLOCK, PORT_ATTEMPTS

### Community 103 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 104 - ".concat"
Cohesion: 0.07
Nodes (22): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+14 more)

### Community 105 - "file-modes.ts"
Cohesion: 0.09
Nodes (25): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+17 more)

### Community 109 - "options.ts"
Cohesion: 0.13
Nodes (30): Finding, readOptions, named(), addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding() (+22 more)

### Community 11 - "ledger/types.ts"
Cohesion: 0.03
Nodes (105): LedgerBinding, LedgerName, Path, LedgerPackageOptions, LedgerTask, AppliedState, ApplyBlock, BlockId (+97 more)

### Community 110 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (25): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+17 more)

### Community 111 - "src/ledger/identity.ts"
Cohesion: 0.12
Nodes (27): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages() (+19 more)

### Community 115 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 117 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 118 - "process-worker.ts"
Cohesion: 0.11
Nodes (23): Scope, crossedError, StartRun, ToProcessWorker, databaseOptions(), openConfiguredDatabase(), answer(), backUp() (+15 more)

### Community 119 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 12 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (90): SslMode, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, MultiStatementRunner, Job, JobQueue (+82 more)

### Community 120 - "paused-harness.ts"
Cohesion: 0.15
Nodes (25): Body, PausedExpectation, Read, Reader, Running, keeperModule(), keepingPause(), pausedOf() (+17 more)

### Community 121 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 123 - "ref_node_http"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 124 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 125 - "core.ts"
Cohesion: 0.13
Nodes (21): CommitOptions, PostgresRun, BenchEnv, ManualOpts, TinybenchOpts, Backend, Baseline, LatencyStats (+13 more)

### Community 128 - "node-bridge.ts"
Cohesion: 0.11
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 129 - "example-checks.ts"
Cohesion: 0.15
Nodes (19): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+11 more)

### Community 13 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (105): LedgerStateItem, retainedStates, CoreRevision, StateRow, StoredState, GreyView, SweepPhase, SweepState (+97 more)

### Community 130 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 131 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 132 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 135 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 138 - "browser.test.ts"
Cohesion: 0.11
Nodes (24): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+16 more)

### Community 14 - "declaration.ts"
Cohesion: 0.03
Nodes (119): ItemDeclaration, KnownPointsOnly, TableDeclaration, EntryRange, GraphInput, LockstepWait, LoopEnd, SlowBlockEvent (+111 more)

### Community 142 - "ledger/metadata.ts"
Cohesion: 0.13
Nodes (9): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, MetadataSelector, OwnStateMetadata, contentStateOf() (+1 more)

### Community 144 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 145 - "block-fetch-decode.test.ts"
Cohesion: 0.14
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 146 - "core-block-fetch/metadata.ts"
Cohesion: 0.12
Nodes (18): ExtrinsicCall, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, RuntimeMetadataView, RecordTypes (+10 more)

### Community 147 - "manifest.ts"
Cohesion: 0.15
Nodes (17): ManifestHistoryRow, ManifestMigration, ManifestTool, MetaCommands, Piece, State, StatementSplitter, formatUnknown() (+9 more)

### Community 149 - "validation.ts"
Cohesion: 0.09
Nodes (21): PlacedDeclaration, Plain, FIELD_KINDS, LIFETIMES, TABLE_KINDS, badId, DECLARATION_PROPERTIES, duplicateId (+13 more)

### Community 15 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (118): ContractLog, BlockTransaction, LoadLedger, TransactionParser, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite (+110 more)

### Community 150 - "demo-handlers.test.ts"
Cohesion: 0.15
Nodes (17): Compared, ConnectSeen, PortPeer, Exchanged, comparedOfExchange(), comparedOfResponse(), connected(), fetchProblems() (+9 more)

### Community 151 - ".value"
Cohesion: 0.26
Nodes (7): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 154 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 156 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 157 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 159 - "browser-harness.ts"
Cohesion: 0.23
Nodes (18): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), contentsHashOf(), eventsOf() (+10 more)

### Community 16 - "client.test.ts"
Cohesion: 0.03
Nodes (77): NodeRetry, ConnectSocket, NodeSocketEvents, HandSocket, HandSockets, Answer, FakeNode, Handler (+69 more)

### Community 160 - "read-height.property.test.ts"
Cohesion: 0.14
Nodes (12): TestBackend, HeldRead, Job, Outcome, Reads, Step, concurrent(), queued() (+4 more)

### Community 164 - "version-table.ts"
Cohesion: 0.21
Nodes (18): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+10 more)

### Community 165 - "text.test.ts"
Cohesion: 0.16
Nodes (9): BackupText, createReadStream(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir (+1 more)

### Community 169 - "readRuntimeMetadata"
Cohesion: 0.37
Nodes (10): TypeDef, ScaleError, decodeExtrinsic(), field(), pallet(), readRuntimeMetadata(), readTypeRegistry(), storageEntry() (+2 more)

### Community 17 - "core-config.test.ts"
Cohesion: 0.04
Nodes (105): MountedAdminAnswer, AdminSeams, PrivateSideFacts, adminRoutes, AdminServeOptions, ToAdmin, AdminStartOptions, DigestRow (+97 more)

### Community 170 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 175 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 176 - "readiness.test.ts"
Cohesion: 0.19
Nodes (13): ProcessState, Decision, ReadinessCase, ae4(), caseText(), readinessProblems(), observedProblems(), ready() (+5 more)

### Community 177 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 179 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 18 - "validate.ts"
Cohesion: 0.02
Nodes (124): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, ConfigRule, CursorRule (+116 more)

### Community 180 - "stats-module.ts"
Cohesion: 0.23
Nodes (12): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+4 more)

### Community 185 - "browser/serve.ts"
Cohesion: 0.21
Nodes (10): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), CONTENT_TYPES (+2 more)

### Community 189 - "quiet-host.child.ts"
Cohesion: 0.16
Nodes (10): Job, Outcome, Stated, until(), added, before, db, during (+2 more)

### Community 19 - "UmbraError"
Cohesion: 0.03
Nodes (102): databaseTarget, PostgresConnection, PostgresOptions, PgliteLockUse, PublicIdentity, Checked, PublicSide, RestoreInput (+94 more)

### Community 191 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 192 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 193 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 198 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 2 - "column-rules.ts"
Cohesion: 0.02
Nodes (189): DumpInput, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions (+181 more)

### Community 20 - "core-transport.ts"
Cohesion: 0.03
Nodes (83): PrivateLinkAddress, PrivateLinkConnect, PublicSide, ResultColumn, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued (+75 more)

### Community 200 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 201 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 204 - "TapeAnswers"
Cohesion: 0.32
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 21 - "NodeClient"
Cohesion: 0.04
Nodes (82): FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+74 more)

### Community 213 - "compare.ts"
Cohesion: 0.27
Nodes (7): BaselineLoad, Comparison, compareToBaseline(), loadBaseline(), BASELINE_PATH, REGRESSION_FACTOR, dir

### Community 22 - "ref_node_crypto"
Cohesion: 0.03
Nodes (110): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow (+102 more)

### Community 223 - "typescript"
Cohesion: 0.33
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 23 - "module-api.ts"
Cohesion: 0.03
Nodes (100): coreHeaders, HeadersArgument, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler (+92 more)

### Community 24 - "tape/index.ts"
Cohesion: 0.04
Nodes (81): Recorded, Failure, Variant, Failure, Variant, Link, TapeBuilderOptions, RecordingError (+73 more)

### Community 246 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 25 - "vitest"
Cohesion: 0.02
Nodes (92): Served, ParentJob, Kill, Orphaned, SourceFile, Lockfile, Manifest, LockResult (+84 more)

### Community 26 - "config/history.ts"
Cohesion: 0.03
Nodes (110): CoreVersion, CoreSettings, ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions (+102 more)

### Community 27 - "ReadHandle"
Cohesion: 0.03
Nodes (79): BlockWriteHandle, ReadHandle, OwnPart, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+71 more)

### Community 28 - "transform-checks.ts"
Cohesion: 0.04
Nodes (87): Metadata, Step, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+79 more)

### Community 29 - "core-private-source.test.ts"
Cohesion: 0.04
Nodes (65): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, PrivateLink, PublicConfiguration (+57 more)

### Community 3 - "api.ts"
Cohesion: 0.02
Nodes (180): Database, ReadOnlyDatabase, ReadOptions, SchemaWriteHandle, Transaction, AppliedMigration, AppliedRow, MigrationPart (+172 more)

### Community 30 - "contract-data-checks.ts"
Cohesion: 0.04
Nodes (102): CoreContractStatesOptions, ContractStateRow, DefinedModule, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+94 more)

### Community 31 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (84): demoLink, EndpointOptions, Envelope, MessagePortLike, PrivateLinkChannel, controlledTimers, PeerEnd, PeerMessage (+76 more)

### Community 32 - "FinalizedLoop"
Cohesion: 0.04
Nodes (33): Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, DoesNotHold, EndsTheRun, IgnoresTheStop (+25 more)

### Community 33 - "devnet-upgrade.test.ts"
Cohesion: 0.05
Nodes (69): Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch (+61 more)

### Community 34 - "loop.ts"
Cohesion: 0.04
Nodes (86): BlockHeader, ProcessContext, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint (+78 more)

### Community 35 - "range.test.ts"
Cohesion: 0.04
Nodes (53): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Script, ScriptedNode, ScriptedRequest (+45 more)

### Community 36 - "ingest-harness.ts"
Cohesion: 0.04
Nodes (75): Restored, NodeClientOptions, CrashEvent, CrashJob, IngestOptions, SourceClass, watched, RestartEvent (+67 more)

### Community 37 - "adapter.ts"
Cohesion: 0.04
Nodes (73): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+65 more)

### Community 38 - "LedgerPackage"
Cohesion: 0.05
Nodes (48): LedgerPackage, LedgerTaskBlock, StateHandle, EvictionRefused, LedgerEngine, LedgerTaskFailed, Settled, stagenetReplay (+40 more)

### Community 39 - "db/backends.ts"
Cohesion: 0.04
Nodes (45): PostgresOptions, Snapshot, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer (+37 more)

### Community 4 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (180): InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job, WorkerEvent, A77Observation (+172 more)

### Community 40 - "cbor.ts"
Cohesion: 0.05
Nodes (76): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+68 more)

### Community 41 - "api-server.test.ts"
Cohesion: 0.05
Nodes (62): ApiRegistry, ChainDataAnswer, ChainDataView, HttpHandler, HttpRoute, AcceptsDuplicates, AddsExtensions, AddsHeaders (+54 more)

### Community 42 - "configured.ts"
Cohesion: 0.04
Nodes (66): ConfiguredDatabase, ConfiguredDatabaseOptions, ConfigRow, commandTarget, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget (+58 more)

### Community 43 - "signal-ignored-fixtures.ts"
Cohesion: 0.04
Nodes (58): ConfigCheckReport, backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, EngineInput (+50 more)

### Community 44 - "runner/process.ts"
Cohesion: 0.03
Nodes (58): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, RetryCode, PauseBy (+50 more)

### Community 45 - "entries.ts"
Cohesion: 0.04
Nodes (66): CheckStep, DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder (+58 more)

### Community 47 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.04
Nodes (53): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, JsonEncoded, StoredEntryJson (+45 more)

### Community 48 - "messages.ts"
Cohesion: 0.05
Nodes (59): Committed, MessageFault, MessageType, readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable (+51 more)

### Community 49 - "resolve.ts"
Cohesion: 0.05
Nodes (62): AddressRequest, Asked, LinkPlan, NetworkContext, NetworkInput, NetworkPlan, NetworkProblem, NetworkRequest (+54 more)

### Community 5 - "adapter-fixtures.ts"
Cohesion: 0.03
Nodes (150): ApplyInput, ApplyOutput, StateSummary, StoredNode, LedgerHeight, RawPackageClass, recordedGenesis, Upstream (+142 more)

### Community 51 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (52): TransactionHistoryReader, TransactionHistoryStorage, TransactionHistoryWriter, PgTransactionHistoryStorage, store(), reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout (+44 more)

### Community 52 - "binding.test.ts"
Cohesion: 0.06
Nodes (53): PrivateIntakeOptions, startHashDecision, StartHashes, A165Options, a165Run, Attempt, A113Observation, A156Observation (+45 more)

### Community 53 - "slow-block-harness.ts"
Cohesion: 0.08
Nodes (51): ReadOpener, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec, Observed (+43 more)

### Community 54 - "Process"
Cohesion: 0.08
Nodes (6): PauseHold, Process, openedCursorHeight(), hasLedgerTasks(), messageOf(), resolve()

### Community 55 - "redact.ts"
Cohesion: 0.06
Nodes (48): AllowedDetail, SnapshotFacts, SanitizedError, RedactionForms, redactor, SecretForm, TextPattern, transportReaderFacts (+40 more)

### Community 57 - "code"
Cohesion: 0.04
Nodes (53): RepositoryFile, canPin(), code(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS (+45 more)

### Community 58 - "PointName"
Cohesion: 0.05
Nodes (38): ItemSink, PointName, LateUse, ReasonCode, Unwrapped, HeightActivity, HeightFailure, Misuse (+30 more)

### Community 6 - "admin-harness.ts"
Cohesion: 0.02
Nodes (156): AdminChannel, FromAdmin, AdminServer, AdminStarter, EngineConfig, EngineOptions, WorkerWithStreams, AdminRun (+148 more)

### Community 60 - "range.ts"
Cohesion: 0.06
Nodes (48): BoundaryBlockReading, BoundaryReading, Arguments, Command, CompletenessRange, Final, Height, RangeRecording (+40 more)

### Community 61 - "containers.test.ts"
Cohesion: 0.05
Nodes (38): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, TlsPostgres, guardContainers(), removeAttempt(), startContainer() (+30 more)

### Community 62 - "ModuleDeclaration"
Cohesion: 0.07
Nodes (26): ModuleDeclaration, Revision, GraphFacts, ResolvedGraph, LoopInput, MisuseListener, MisuseReports, ProcessContexts (+18 more)

### Community 63 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+34 more)

### Community 64 - "admin/configuration.ts"
Cohesion: 0.09
Nodes (45): ConfigFacts, OpenedConfig, OpenedFacts, RevisionSettings, DeclarationView, EntryView, RecordedView, CoreChainFacts (+37 more)

### Community 65 - "core-block-commit.test.ts"
Cohesion: 0.08
Nodes (38): BlockRow, StandInOptions, Commit, checkParent(), commitBlock(), hex(), sameBytes(), startOf() (+30 more)

### Community 66 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (31): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+23 more)

### Community 68 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 69 - "writer-lock-checks.ts"
Cohesion: 0.10
Nodes (36): WriterProcess, WorkerEvent, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf(), startWriterProcess() (+28 more)

### Community 7 - "builds.ts"
Cohesion: 0.03
Nodes (125): PglitePathParts, PrivateBackend, SessionSeen, TestDatabase, PrivateOptions, PrivateProcess, PrivateRefusal, PrivateSeen (+117 more)

### Community 70 - "private/lockstep-wait.test.ts"
Cohesion: 0.07
Nodes (29): InstanceView, PrivateInstance, Entry, Lockstep, LockstepCondition, LockstepInstance, LockstepOptions, LockstepRefusal (+21 more)

### Community 71 - "zero-timeouts-checks.ts"
Cohesion: 0.09
Nodes (34): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+26 more)

### Community 72 - "graph.ts"
Cohesion: 0.08
Nodes (44): Edge, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts, Spanned (+36 more)

### Community 73 - "page.ts"
Cohesion: 0.06
Nodes (34): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+26 more)

### Community 74 - "config-check.ts"
Cohesion: 0.07
Nodes (37): CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, ConfigFinding, LoadedConfig (+29 more)

### Community 77 - "src/config/load.ts"
Cohesion: 0.07
Nodes (32): LoadOptions, SignalJob, Finding, configModules(), configModuleUrl(), configPath(), importConfig(), invalid() (+24 more)

### Community 78 - "loop.test.ts"
Cohesion: 0.07
Nodes (27): Contexts, Started, EagerItems, EagerLoop, FailingAfter, Lost, Seen, Shifted (+19 more)

### Community 8 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (148): ProcessCondition, BlockSpec, EventSpec, Scenario, transactionSpec, ArgType, BlockOptions, CallSpec (+140 more)

### Community 81 - "events-fixtures.ts"
Cohesion: 0.12
Nodes (31): eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, LedgerScenarioOptions (+23 more)

### Community 82 - "backup/backup.ts"
Cohesion: 0.10
Nodes (38): BackupInput, BackupTarget, BackupFacts, PgliteDump, SnapshotSeams, Environment, PgDumpTool, BackupCommandOptions (+30 more)

### Community 83 - "networks.ts"
Cohesion: 0.06
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 84 - "ChannelEndpoint"
Cohesion: 0.11
Nodes (12): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), discard(), isChannel(), 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard (+4 more)

### Community 85 - "Buffer"
Cohesion: 0.07
Nodes (26): Buffer, BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText(), charCodes() (+18 more)

### Community 86 - "held-height.test.ts"
Cohesion: 0.07
Nodes (31): CommitOutcome, HeldHeight, Faults, LostCommit, Outcomes, Seen, AlwaysLanded, DropsHeld (+23 more)

### Community 9 - "BlockRef"
Cohesion: 0.03
Nodes (66): BlockHeaderItem, BlockEventSource, BlockItemSource, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, HeadWait, NodeBlockSource (+58 more)

### Community 90 - "browser/build.ts"
Cohesion: 0.07
Nodes (27): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+19 more)

### Community 91 - "node-run.ts"
Cohesion: 0.09
Nodes (28): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, NodeRunResult, core(), databaseOf() (+20 more)

### Community 92 - "transport.test.ts"
Cohesion: 0.10
Nodes (26): Message, Ended, rawClient, Escape, publicState, Refused, confinementProblems(), endedWithin() (+18 more)

### Community 94 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 95 - "ProcessAdmin"
Cohesion: 0.10
Nodes (16): NetworkShown, ProcessAdmin, ProcessAdminOptions, NodeFacts, NodeStatus, NodeConnection, Heartbeat, HeartbeatOptions (+8 more)

### Community 97 - "chain-data.negative-control.test.ts"
Cohesion: 0.10
Nodes (31): BodyExtrinsic, BlockBody, BlockParsed, BlockParsedOptions, ChainTransaction, ChainEvent, EventPhase, ScaleValue (+23 more)

### Community 98 - "core-chain-events.ts"
Cohesion: 0.09
Nodes (30): MetadataField, Primitive, bindCoreChainEvents(), boundEventSource(), chainEventsOf(), coreChainEventsOnFetch(), metadataView(), writeEventRows() (+22 more)

### Community 99 - "version-checks.ts"
Cohesion: 0.15
Nodes (29): Boundary, CallRecord, CountingNode, Select, UpgradeCase, Walk, Answers, toHex() (+21 more)

### Community 231 - ".retrying"
Cohesion: 0.25
Nodes (6): The node on `/status`, 7. Storage helpers, Requirement: AE-5 `/status` and `/config` contents, Scenario: Before the first block, Requirement: AE-5 `/status` and `/config` contents, Scenario: Before the first block

### Community 56 - "data"
Cohesion: 0.04
Nodes (58): params(), n(), data(), 7. The module API, 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore (+50 more)

### Community 106 - ".slowBlockMs"
Cohesion: 0.07
Nodes (29): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+21 more)

### Community 113 - "transportReader"
Cohesion: 0.07
Nodes (30): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 4. Configuration, 10. Requirement coverage (+22 more)

### Community 133 - "refused"
Cohesion: 0.10
Nodes (24): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, Requirement: AE-3 States and conditions, Scenario: A fault of the build's declarations ends the process, Scenario: A paused loop (+16 more)

### Community 136 - ".source"
Cohesion: 0.08
Nodes (23): found(), ownKeys(), Rework (class 4), 18. Running UmbraDB in your own program, 10. Definition of done, item by item, 1. Library-mode guarantees, 3. Lifecycle, 5. Modules and the ledger worker (+15 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.08
Nodes (22): 1. Schema, ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract (+14 more)

### Community 148 - "backupAtStop"
Cohesion: 0.10
Nodes (21): backupAtStop(), A backup at the core's stop, A backup of a running process (SIGUSR2), A paused loop on `/status`, A private process and a changed public configuration, Backups, Restoring a backup, UmbraDB operator guide (+13 more)

### Community 155 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (18): log(), 00072 — `umbradb run` logs nothing when SIGTERM or SIGINT stops it, Evidence, Problem, Suggested fix, 13. Contract data, 18. Whole-system faults, differentials and measurements, 19. Close-out (+10 more)

### Community 158 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 166 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.12
Nodes (15): transportReaderRule(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout, 2. Architecture (+7 more)

### Community 167 - ".boolean"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block (+8 more)

### Community 182 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 183 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 184 - "inMemoryBlock"
Cohesion: 0.18
Nodes (15): hashAt(), inMemoryBlock(), a77Problems(), a78Problems(), hex(), blockAt(), blockContext(), blockHex() (+7 more)

### Community 190 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 197 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 208 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 212 - "browser.negative-control.test.ts"
Cohesion: 0.18
Nodes (10): pageUrl(), statusOf(), tamperedBackup(), tapeNode(), benches, browsers, chain, directories (+2 more)

### Community 224 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 227 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 238 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 265 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 300 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 312 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 46 - ".put"
Cohesion: 0.03
Nodes (71): T(), input(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed (+63 more)

### Community 50 - "history"
Cohesion: 0.04
Nodes (61): history(), revision(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+53 more)

### Community 59 - ".off"
Cohesion: 0.04
Nodes (54): Durability, 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract, ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data (+46 more)

### Community 67 - "version"
Cohesion: 0.05
Nodes (45): deferred(), version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored) (+37 more)

### Community 79 - "UmbraDB module guide"
Cohesion: 0.05
Nodes (39): side(), migrations(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations (+31 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 89 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 108 - "package.json"
Cohesion: 0.06
Nodes (33): bin, umbradb, bugs, url, description, optional, engines, node (+25 more)

### Community 112 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.06
Nodes (27): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+19 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 116 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 134 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 139 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 140 - "README.md"
Cohesion: 0.10
Nodes (17): Choosing a database, At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails, Generate your local wallet (+9 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 152 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 153 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 162 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 168 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 171 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 172 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 173 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker (+8 more)

### Community 174 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 178 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 181 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 186 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 187 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 188 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 194 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 196 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 199 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 202 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 205 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 206 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 209 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 210 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 211 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 214 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 215 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 216 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 217 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 218 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 219 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-4 Every field is data, operational or secret, Scenario: A function in the configuration, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: A user module from the configuration file, Scenario: Two `core` revisions with different databases (+1 more)

### Community 220 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 221 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 222 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 225 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 226 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 228 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 229 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 230 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 232 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 233 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 234 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 235 - "MODIFIED Requirements"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy, Spec delta — `admin-endpoints` capability

### Community 236 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 237 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 239 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 240 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 241 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 242 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 243 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 244 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 245 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 249 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 250 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 251 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 252 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 253 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 254 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 255 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 256 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 257 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 258 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 259 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 260 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 261 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 262 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 263 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 264 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 266 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 267 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 268 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 269 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 270 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 271 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 272 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 273 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 274 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 275 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 276 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 277 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 278 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 279 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 280 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 281 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 282 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 283 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 284 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 285 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 286 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 287 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 288 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 289 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 290 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 291 - "00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail"
Cohesion: 0.40
Nodes (4): 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix

### Community 292 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 293 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 294 - "00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)"
Cohesion: 0.40
Nodes (4): 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …), Evidence, Problem, Suggested fix

### Community 295 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 296 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 297 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 298 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 299 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 301 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 302 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 303 - "00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes"
Cohesion: 0.50
Nodes (3): 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes, Evidence, Suggested fix

### Community 304 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 305 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 306 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 307 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 308 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 309 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 88 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx`, `typedoc` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4104 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `startUmbraDB`, `ref_node_fs`, `column-rules.ts`, `api.ts`, `InMemoryBlockSource`, `adapter-fixtures.ts`, `admin-harness.ts`, `builds.ts`, `fetch-fixtures.ts`, `BlockRef`, `.from`, `ledger/types.ts`, `src/db/postgres.ts`, `core-ledger-state.ts`, `declaration.ts`, `core-block-parsed.ts`, `client.test.ts`, `core-config.test.ts`, `validate.ts`, `UmbraError`, `core-transport.ts`, `NodeClient`, `ref_node_crypto`, `module-api.ts`, `tape/index.ts`, `config/history.ts`, `ReadHandle`, `transform-checks.ts`, `core-private-source.test.ts`, `contract-data-checks.ts`, `channel-queue.test.ts`, `devnet-upgrade.test.ts`, `loop.ts`, `range.test.ts`, `ingest-harness.ts`, `adapter.ts`, `db/backends.ts`, `cbor.ts`, `api-server.test.ts`, `configured.ts`, `signal-ignored-fixtures.ts`, `runner/process.ts`, `entries.ts`, `interfaces/transaction-history-storage.ts`, `messages.ts`, `resolve.ts`, `binding.test.ts`, `slow-block-harness.ts`, `redact.ts`, `code`, `PointName`, `containers.test.ts`, `boundary.test.ts`, `core-block-commit.test.ts`, `cold-boot-recovery.integration.test.ts`, `retirement.test.ts`, `writer-lock-checks.ts`, `private/lockstep-wait.test.ts`, `zero-timeouts-checks.ts`, `config-check.ts`, `src/config/load.ts`, `loop.test.ts`, `networks.ts`, `held-height.test.ts`, `browser/build.ts`, `transport.test.ts`, `release-version.ts`, `ProcessAdmin`, `chain-data.negative-control.test.ts`, `core-chain-events.ts`, `version-checks.ts`, `checks.test.ts`, `node.test.ts`, `resolver-boundary.ts`, `package.json`, `options.ts`, `node-fields-harness.ts`, `src/ledger/identity.ts`, `code-registry.ts`, `test/postgres/setup.ts`, `pg-tx-history-adapter.ts`, `documents.ts`, `config/plain-data.ts`, `node-bridge.ts`, `example-checks.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `surface.test.ts`, `browser.test.ts`, `block-fetch-decode.test.ts`, `manifest.ts`, `demo-handlers.test.ts`, `library-documents.test.ts`, `key-handling-checks.ts`, `read-height.property.test.ts`, `excluded-not-exported.test.ts`, `text.test.ts`, `LoopPauses`, `validation.test.ts`, `readiness.test.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `history.property.test.ts`, `browser.negative-control.test.ts`, `compare.ts`?**
  _High betweenness centrality (0.246) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `startUmbraDB` be split into smaller, more focused modules?**
  _Cohesion score 0.017993545541083327 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `startUmbraDB`, `ref_node_fs`, `column-rules.ts`, `api.ts`, `InMemoryBlockSource`, `adapter-fixtures.ts`, `admin-harness.ts`, `builds.ts`, `fetch-fixtures.ts`, `BlockRef`, `.source`, `ledger/types.ts`, `src/db/postgres.ts`, `core-ledger-state.ts`, `ledger/metadata.ts`, `core-block-parsed.ts`, `client.test.ts`, `declaration.ts`, `validate.ts`, `manifest.ts`, `backupAtStop`, `NodeClient`, `core-transport.ts`, `module-api.ts`, `validation.ts`, `ref_node_crypto`, `config/history.ts`, `ReadHandle`, `tape/index.ts`, `core-private-source.test.ts`, `transform-checks.ts`, `channel-queue.test.ts`, `FinalizedLoop`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `loop.ts`, `ingest-harness.ts`, `version-table.ts`, `LedgerPackage`, `db/backends.ts`, `cbor.ts`, `api-server.test.ts`, `configured.ts`, `runner/process.ts`, `entries.ts`, `validation.test.ts`, `readiness.test.ts`, `resolve.ts`, `checkShape`, `binding.test.ts`, `slow-block-harness.ts`, `Process`, `redact.ts`, `PointName`, `range.ts`, `containers.test.ts`, `ModuleDeclaration`, `browser/src/config/load.ts`, `core-block-commit.test.ts`, `writer-lock-checks.ts`, `zero-timeouts-checks.ts`, `graph.ts`, `config-check.ts`, `src/config/load.ts`, `loop.test.ts`, `backup/backup.ts`, `Buffer`, `held-height.test.ts`, `ProcessAdmin`, `version-checks.ts`, `checks.test.ts`, `options.ts`, `src/ledger/identity.ts`, `config/plain-data.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `ref_node_fs` be split into smaller, more focused modules?**
  _Cohesion score 0.024414970009292894 - nodes in this community are weakly interconnected._