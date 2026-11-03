# Graph Report - UmbraDB

## Corpus Check
- 1213 files · ~1,725,882 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12648 nodes · 38781 edges · 362 communities (325 shown, 37 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 3299 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `75b2f2e7930ba13d` (1213 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- process-backends.ts
- builds.ts
- process-build.ts
- options.ts
- checks.test.ts
- code-registry.ts
- containers.test.ts
- read-gate.ts
- process-worker.ts
- pg-tx-history-adapter.ts
- roles.ts
- core-private-source.ts
- HeightRun
- documents.ts
- api-server.test.ts
- config/plain-data.ts
- test/postgres/setup.ts
- src/ledger/identity.ts
- mapping.ts
- start-umbradb.ts
- relays.ts
- height-versioned.property.test.ts
- example-checks.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- recovery.test.ts
- .value
- NodeClient
- BlockRef
- PgliteDatabase
- version-checks.ts
- pack-install.mjs
- channel-queue.test.ts
- ledger-table-config.test.ts
- block-fetch-decode.test.ts
- core-block-fetch/metadata.ts
- browser-harness.ts
- Buffer
- ledger/metadata.ts
- tape/index.ts
- ledger-sweep.test.ts
- version-table.ts
- .concat
- .#open
- childRefKeys
- chrome.ts
- key-handling-checks.ts
- fixtures/configuration.ts
- ledger/types.ts
- Process
- LoopPauses
- loop.test.ts
- FakeNode
- statementsOf
- BlockSource
- .#log
- ws-mutual-tls.test.ts
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- resolve.ts
- web-lock.ts
- .constructor
- Session
- ApiRoutes
- InMemoryBlockSource
- browser/serve.ts
- browser/src/config/load.ts
- worker-threads.test.ts
- Writer
- history.property.test.ts
- vitest
- api.ts
- worker-threads-worker.ts
- Design — Sprint 1: project setup + TemporalKV
- sweepStep
- SubscriptionConnection
- .send
- adapter-fixtures.ts
- Worker
- contract-data-checks.ts
- ledger/plain-data.ts
- TapeAnswers
- sha256
- process-admin.ts
- extrinsics.ts
- ProcessItems
- worker-output.test.ts
- transform-checks.ts
- src/db/postgres.ts
- vendored-ledger-files.test.ts
- NodeBlockSource
- mutation-evidence.d.mts
- AsyncLocalStorage
- startProcess
- core-block-parsed.ts
- devnet-upgrade.test.ts
- column-rules.ts
- spawnChild
- cbor.ts
- FinalizedLoop
- PageState
- adapter.ts
- BYTE_ORDER
- NodeFS
- deterministic-postgresql/index.ts
- paused-harness.ts
- backup/backup.ts
- loop.ts
- LedgerPackage
- 12. Ledger
- client.test.ts
- db/backends.ts
- core-chain.test.ts
- PgTransactionHistoryStorage
- refused-configuration.test.ts
- slow-block-harness.ts
- boundary.test.ts
- interfaces/transaction-history-storage.ts
- chain-process.test.ts
- history.test.ts
- fetch-fixtures.ts
- public-database.ts
- code
- config/history.ts
- core-block-commit.test.ts
- module-api.test.ts
- listening.test.ts
- core-ledger-state.ts
- PointName
- .from
- validate.ts
- startup-stop-harness.ts
- writer-lock-checks.ts
- surface.test.ts
- graph.ts
- retirement.test.ts
- UmbraError
- api-socket.ts
- durability-probe.test.ts
- module-api.ts
- startUmbraDB
- checkShape
- pglite-lock.ts
- runner/process.ts
- networks.ts
- page.ts
- transaction-history-storage.property.test.ts
- zod
- core-ledger-state/sql.ts
- worker-storage.test.ts
- cold-boot-recovery.integration.test.ts
- browser.test.ts
- backup/restore.ts
- declaration.ts
- release-version.ts
- core.ts
- browser/build.ts
- file-modes.ts
- resolver-boundary.ts
- data
- .configHash
- connectChannel
- Design — Sprint 4: Watermarks
- T
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- integer
- core-ledger-state.test.ts
- conformance-gate.mjs
- mutation-per-adapter.mjs
- mapping.test.ts
- twox.ts
- facade-merge-loader.ts
- Design — v1.1.0: Quint model checking
- UmbraDB third-party component inventory (SBOM)
- h
- midnight-env — reproducible PREPROD dev environment
- path.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- crash-worker.ts
- history
- .put
- version
- ADDED Requirements
- .off
- core-private-source.test.ts
- graph.py
- .slowBlockMs
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
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
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- README.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- Boundaries, threats and controls
- Requirement: DT-3 The contents hash
- Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- UmbraDB in a browser
- ROADMAP.md
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- After 0.10.0
- Repository agent policy
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- Midnight Foundation Security Policy
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- UmbraDB node architecture
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 2: Transaction/Lease
- Tasks — Sprint 2: Transaction/Lease
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
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- bug-report.md
- feature-request.md
- Tasks — Sprint 1: project setup + TemporalKV
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Test wallets
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
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 414 edges
2. `UmbraError` - 346 edges
3. `ModuleDeclaration` - 197 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `startUmbraDB()` - 103 edges
9. `Database` - 101 edges
10. `ReadHandle` - 92 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (362 total, 37 thin omitted)

### Community 0 - "process-backends.ts"
Cohesion: 0.02
Nodes (251): CoreLedgerStateOptions, GreyPicker, SourceShared, A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector (+243 more)

### Community 1 - "builds.ts"
Cohesion: 0.02
Nodes (204): PrivateIntakeOptions, startHashDecision, StartHashes, PostgresParts, LockstepCondition, Keeping, A165Options, a165Run (+196 more)

### Community 10 - "process-build.ts"
Cohesion: 0.03
Nodes (158): MountedAdminAnswer, AdminSeams, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, AdminStartOptions, AdminAnswer (+150 more)

### Community 101 - "options.ts"
Cohesion: 0.13
Nodes (30): Finding, readOptions, named(), addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding() (+22 more)

### Community 102 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkId(), checkFunctionsSql() (+14 more)

### Community 103 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 104 - "containers.test.ts"
Cohesion: 0.09
Nodes (22): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+14 more)

### Community 106 - "read-gate.ts"
Cohesion: 0.12
Nodes (25): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+17 more)

### Community 107 - "process-worker.ts"
Cohesion: 0.11
Nodes (21): databaseTarget, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, answer(), backUp() (+13 more)

### Community 108 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 11 - "roles.ts"
Cohesion: 0.02
Nodes (146): Bound, Difference, OwnPart, PlannedSchema, Provision, QualifiedTable, SchemaItem, SchemaModule (+138 more)

### Community 110 - "core-private-source.ts"
Cohesion: 0.12
Nodes (27): PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, PrivateLink, PublicConfiguration, PublicItem, bytesOf() (+19 more)

### Community 111 - "HeightRun"
Cohesion: 0.07
Nodes (14): HeightRun, IgnoresTheStop, PausesInsideTheHeight, StaysPaused, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching (+6 more)

### Community 112 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 113 - "api-server.test.ts"
Cohesion: 0.11
Nodes (22): AppendsVersion, Client, configHashesOf(), duplicateProblems(), exchange(), helperProblems(), hex(), isConfigHash() (+14 more)

### Community 116 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 117 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 118 - "src/ledger/identity.ts"
Cohesion: 0.14
Nodes (24): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages() (+16 more)

### Community 119 - "mapping.ts"
Cohesion: 0.13
Nodes (26): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+18 more)

### Community 12 - "start-umbradb.ts"
Cohesion: 0.02
Nodes (151): PrivateLinkChannel, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork, UmbraDBOptions (+143 more)

### Community 121 - "relays.ts"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 123 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 124 - "example-checks.ts"
Cohesion: 0.15
Nodes (19): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+11 more)

### Community 125 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 126 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 127 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 128 - "recovery.test.ts"
Cohesion: 0.12
Nodes (21): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, Fault, committedProblems() (+13 more)

### Community 129 - ".value"
Cohesion: 0.19
Nodes (11): MetadataField, MetadataType, Primitive, ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), littleEndian() (+3 more)

### Community 13 - "NodeClient"
Cohesion: 0.03
Nodes (115): CoreChainBinding, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription (+107 more)

### Community 132 - "BlockRef"
Cohesion: 0.12
Nodes (9): BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem (+1 more)

### Community 134 - "PgliteDatabase"
Cohesion: 0.18
Nodes (6): JobQueue, PgliteDatabase, handleClosed(), failedEarlier(), nestedCall(), openOn()

### Community 135 - "version-checks.ts"
Cohesion: 0.14
Nodes (19): Boundary, CallRecord, MetadataSelector, Select, UpgradeCase, Walk, copyVendoredLedger(), expectEveryPackageFileChecked() (+11 more)

### Community 139 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 14 - "channel-queue.test.ts"
Cohesion: 0.03
Nodes (97): ChannelEndpoint, EndpointEvents, EndpointOptions, Envelope, LinkTimers, MessagePortLike, CoreChannels, CoreChannelSeams (+89 more)

### Community 140 - "ledger-table-config.test.ts"
Cohesion: 0.18
Nodes (19): CountingNode, Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked() (+11 more)

### Community 143 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 144 - "core-block-fetch/metadata.ts"
Cohesion: 0.27
Nodes (14): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 145 - "browser-harness.ts"
Cohesion: 0.19
Nodes (18): PageApiChannel, PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf() (+10 more)

### Community 146 - "Buffer"
Cohesion: 0.13
Nodes (13): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+5 more)

### Community 149 - "ledger/metadata.ts"
Cohesion: 0.15
Nodes (7): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, contentStateOf(), hexOf()

### Community 15 - "tape/index.ts"
Cohesion: 0.03
Nodes (89): Failure, Variant, Link, TapeBuilder, TapeBuilderOptions, RecordingError, RecordingProblem, TapeProblem (+81 more)

### Community 150 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (12): SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, bigints(), compare(), fixtureBlocks() (+4 more)

### Community 151 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 152 - ".concat"
Cohesion: 0.14
Nodes (11): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+3 more)

### Community 154 - ".#open"
Cohesion: 0.13
Nodes (6): LibraryChecks, Resolved, openedCursorHeight(), namedStartDb(), privateLinkOf(), sourceOf()

### Community 155 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 156 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 157 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 158 - "fixtures/configuration.ts"
Cohesion: 0.15
Nodes (15): BrowserConfiguration, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration(), param(), privateConfiguration() (+7 more)

### Community 16 - "ledger/types.ts"
Cohesion: 0.03
Nodes (109): LoadLedger, LedgerStateItem, LedgerName, ApplyInput, ApplyOutput, ChainOutcome, LedgerPackageOptions, LedgerTask (+101 more)

### Community 165 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 17 - "loop.test.ts"
Cohesion: 0.03
Nodes (115): Transaction, ErrorCode, EntryRange, GraphInput, HeightFailure, LockstepWait, LoopEnd, PastFaultCase (+107 more)

### Community 173 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 175 - ".#log"
Cohesion: 0.22
Nodes (3): PauseHold, retryOf(), messageOf()

### Community 176 - "ws-mutual-tls.test.ts"
Cohesion: 0.19
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 178 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.17
Nodes (9): ReadPool, Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically (+1 more)

### Community 18 - "resolve.ts"
Cohesion: 0.03
Nodes (124): ConfigFacts, SnapshotFacts, RestoreBase, CommandBuildOptions, CheckFinding, CheckState, ConfigCheckOptions, ConfigCheckSeams (+116 more)

### Community 182 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 186 - ".constructor"
Cohesion: 0.14
Nodes (4): LifecycleStatus, ProcessReason, asksForChannels(), signalCause()

### Community 187 - "Session"
Cohesion: 0.21
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 188 - "ApiRoutes"
Cohesion: 0.22
Nodes (8): ModuleApiStart, ApiRoutes, ApiStartup, AcceptsDuplicates, shapeOf(), routesOf(), api(), routesOf()

### Community 19 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (84): ChainCheck, ChainCheckInput, transportReaderFacts, InMemoryBlockSource, InMemoryItems, Wait, CloseHelper, EngineOptions (+76 more)

### Community 190 - "browser/serve.ts"
Cohesion: 0.22
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 191 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 192 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 198 - "Writer"
Cohesion: 0.26
Nodes (4): DurabilityWarning, Writer, WriterStart, rollBack()

### Community 199 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 2 - "vitest"
Cohesion: 0.02
Nodes (181): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, DatabaseParts, BackupBackend, BackupDatabase (+173 more)

### Community 20 - "api.ts"
Cohesion: 0.03
Nodes (81): UmbraConfig, BlockWriteHandle, ReadHandle, ReadOnlyDatabase, ReadOptions, cursorTable, CursorTableOptions, CursorValue (+73 more)

### Community 201 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 203 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 205 - "sweepStep"
Cohesion: 0.26
Nodes (5): SweepTables, hexOf(), merged(), sweepStep(), 3.1 Where it runs

### Community 207 - "SubscriptionConnection"
Cohesion: 0.35
Nodes (4): SubscriptionCarrier, SubscriptionConnection, errorMessage(), socketConnection()

### Community 21 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (103): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState (+95 more)

### Community 22 - "contract-data-checks.ts"
Cohesion: 0.04
Nodes (112): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, UnsureReason, CoreContractLogsFullOptions (+104 more)

### Community 220 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 221 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 222 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 23 - "process-admin.ts"
Cohesion: 0.03
Nodes (95): NetworkShown, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, ToAdmin (+87 more)

### Community 230 - "extrinsics.ts"
Cohesion: 0.29
Nodes (8): ExtrinsicCall, MetadataPallet, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), isCompactU64(), TIMESTAMP

### Community 232 - "worker-output.test.ts"
Cohesion: 0.22
Nodes (8): Seen, noisy(), outputProblems(), ADMIN_ENTRY, LEDGER_ENTRY, LOGGED, PGLITE_MEMORY, WRITTEN

### Community 24 - "transform-checks.ts"
Cohesion: 0.04
Nodes (83): Metadata, Step, FindTapeOptions, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+75 more)

### Community 25 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (89): BrowserRun, PrivateInstance, ConfiguredDatabase, ConfiguredDatabaseOptions, DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions (+81 more)

### Community 251 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 26 - "NodeBlockSource"
Cohesion: 0.04
Nodes (49): HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, QueuedBlock, NodeCallOptions, NodeSubscription, NodeBlock (+41 more)

### Community 262 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "startProcess"
Cohesion: 0.04
Nodes (93): ProcessingEnd, ProcessStatus, Q142Observation, A43Case, A43Observation, CursorElsewhere, Halt, Outcome (+85 more)

### Community 28 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (100): BlockHeaderItem, BlockEventSource, BodyExtrinsic, BlockBody, CoreBlockHeader, MetadataVariant, RuntimeMetadataView, BlockParsed (+92 more)

### Community 29 - "devnet-upgrade.test.ts"
Cohesion: 0.05
Nodes (67): Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch (+59 more)

### Community 3 - "column-rules.ts"
Cohesion: 0.02
Nodes (203): ManifestMigration, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions (+195 more)

### Community 30 - "spawnChild"
Cohesion: 0.03
Nodes (86): Served, ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, GateRun (+78 more)

### Community 31 - "cbor.ts"
Cohesion: 0.04
Nodes (93): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+85 more)

### Community 32 - "FinalizedLoop"
Cohesion: 0.04
Nodes (26): ResolvedRange, EntryBoundary, PointSchedule, Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, Startup (+18 more)

### Community 33 - "adapter.ts"
Cohesion: 0.04
Nodes (71): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+63 more)

### Community 34 - "deterministic-postgresql/index.ts"
Cohesion: 0.04
Nodes (71): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow (+63 more)

### Community 35 - "paused-harness.ts"
Cohesion: 0.05
Nodes (69): backupSignalRelay, BackupSignals, Body, PausedExpectation, Read, Reader, BackupOnSignal, LoopClass (+61 more)

### Community 36 - "backup/backup.ts"
Cohesion: 0.05
Nodes (72): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, ManifestTool, DumpInput, PgliteDump (+64 more)

### Community 37 - "loop.ts"
Cohesion: 0.05
Nodes (79): HeightRange, Callback, ParallelPoint, PointArguments, PointRun, Invoke, Progress, ReadOpener (+71 more)

### Community 38 - "LedgerPackage"
Cohesion: 0.05
Nodes (42): LedgerPackage, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, StagenetBlockJson, StagenetFixtureJson, stagenetReplay (+34 more)

### Community 39 - "12. Ledger"
Cohesion: 0.04
Nodes (52): RetainedState, EvictionRefused, LedgerHost, LedgerWorkerFailure, NodeDatabase, NodeReader, SlowStep, TestLoaderData (+44 more)

### Community 4 - "client.test.ts"
Cohesion: 0.02
Nodes (144): NodeClientOptions, NodeRetry, ConnectSocket, NodeSocketEvents, HandSocket, HandSockets, Answer, Handler (+136 more)

### Community 40 - "db/backends.ts"
Cohesion: 0.04
Nodes (39): MultiStatementRunner, Settings, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer (+31 more)

### Community 41 - "core-chain.test.ts"
Cohesion: 0.04
Nodes (44): ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ChainIdentity, ConfigRow, WaitingCondition, bindCoreBlockFetch() (+36 more)

### Community 42 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (54): TransactionHistoryStorage, PgTransactionHistoryStorage, encodeStoredEntry(), rowToEntry(), reason(), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers (+46 more)

### Community 43 - "refused-configuration.test.ts"
Cohesion: 0.06
Nodes (58): EngineConfig, Answered, Start, Refusal, Start, listenError(), startAdminServer(), startProcess() (+50 more)

### Community 44 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (52): BlockItemSource, HeightActivity, LoopInput, StatusBody, Times, Wait, askedSource, BodyRead (+44 more)

### Community 45 - "boundary.test.ts"
Cohesion: 0.07
Nodes (50): DesignTable, RowCoverage, ModuleReference, Finding, collationsWritten(), componentCode(), componentExports(), componentTexts() (+42 more)

### Community 46 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (40): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+32 more)

### Community 48 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (45): Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+37 more)

### Community 49 - "history.test.ts"
Cohesion: 0.06
Nodes (50): HistoryOptions, Simulation, Start, Case, canonicalJson(), dataHash(), builtWith100(), deletesOnly() (+42 more)

### Community 5 - "fetch-fixtures.ts"
Cohesion: 0.02
Nodes (199): ProcessCondition, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime (+191 more)

### Community 50 - "public-database.ts"
Cohesion: 0.07
Nodes (36): PrivateBlockSource, SourceTransport, PrivateLinkAddress, PrivateLinkConnect, PublicDatabase, PublicSide, PublicSideOptions, PublicWakes (+28 more)

### Community 51 - "code"
Cohesion: 0.04
Nodes (53): RepositoryFile, canPin(), code(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS (+45 more)

### Community 52 - "config/history.ts"
Cohesion: 0.07
Nodes (47): CoreVersion, HistoryCode, HistoryContext, HistoryFinding, ProvidesRow, Span, UpgradeEntry, asNumber() (+39 more)

### Community 53 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (42): BlockRow, StandInOptions, Commit, Committed, blockHeaderOf(), checkParent(), commitBlock(), hex() (+34 more)

### Community 54 - "module-api.test.ts"
Cohesion: 0.06
Nodes (44): StatsRow, Outcome, ChainDataView, insertRow(), lastTotal(), recentRows(), rowAt(), answerChainData() (+36 more)

### Community 55 - "listening.test.ts"
Cohesion: 0.06
Nodes (35): RunOptions, RunSeams, SignalSource, stopSignal, UserModulesSource, NetworkRuleName, IgnoredJob, Parsed (+27 more)

### Community 57 - "core-ledger-state.ts"
Cohesion: 0.07
Nodes (42): BlockLedgerSource, LedgerBinding, retainedStates, CoreRevision, applyBlock(), boundLedger(), chainOutcomesOf(), contractsOf() (+34 more)

### Community 58 - "PointName"
Cohesion: 0.06
Nodes (40): PointName, CallbackFailure, ReasonCode, Unwrapped, Misuse, SlowBlockCondition, CrashCall, CrashEvent (+32 more)

### Community 59 - ".from"
Cohesion: 0.05
Nodes (43): Program, V9Raw, bytesOfHex(), decode(), decoded(), freeGot(), literalAt(), logSitesOf() (+35 more)

### Community 6 - "validate.ts"
Cohesion: 0.02
Nodes (201): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, PostgresPartsInput, TransportReader, coreEntry (+193 more)

### Community 60 - "startup-stop-harness.ts"
Cohesion: 0.07
Nodes (35): SignalTarget, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StartVia, stopBy (+27 more)

### Community 61 - "writer-lock-checks.ts"
Cohesion: 0.10
Nodes (37): WriterProcess, WorkerEvent, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf(), startWriterProcess() (+29 more)

### Community 62 - "surface.test.ts"
Cohesion: 0.07
Nodes (45): Document, EntryInput, Renamed, Surface, SurfaceAmendment, changelogEntryProblems(), entryTerms(), namesWord() (+37 more)

### Community 63 - "graph.ts"
Cohesion: 0.07
Nodes (46): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+38 more)

### Community 64 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 65 - "UmbraError"
Cohesion: 0.07
Nodes (35): PostgresConnection, PostgresOptions, ReadTimeoutSetting, ErrorDetails, UmbraError, Case, BlockOptions, LostCommit (+27 more)

### Community 66 - "api-socket.ts"
Cohesion: 0.10
Nodes (40): coreHeaders, HeadersArgument, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits (+32 more)

### Community 67 - "durability-probe.test.ts"
Cohesion: 0.09
Nodes (35): BenchEnv, DurabilityProbeOptions, DurabilityViolation, ProbeSession, Outcome, Outcome, PostgresOptions, WriterSession (+27 more)

### Community 68 - "module-api.ts"
Cohesion: 0.07
Nodes (31): ChainDataAnswer, ApiError, ApiErrorCode, ApiRequest, ApiResponse, HttpHandler, HttpMethod, HttpRoute (+23 more)

### Community 7 - "startUmbraDB"
Cohesion: 0.01
Nodes (205): demoLink, refused(), backupAtStop(), text(), transportReader(), transportReaderRule(), messagePortChannel(), startUmbraDB() (+197 more)

### Community 70 - "checkShape"
Cohesion: 0.07
Nodes (35): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+27 more)

### Community 71 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (33): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, ChildResult (+25 more)

### Community 73 - "runner/process.ts"
Cohesion: 0.07
Nodes (35): LoadOptions, RetryCode, PauseBy, BoundAddress, CloseStep, LoadedInput, PausedCondition, RetryCondition (+27 more)

### Community 76 - "networks.ts"
Cohesion: 0.06
Nodes (36): CoreBlockItems, Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem (+28 more)

### Community 77 - "page.ts"
Cohesion: 0.06
Nodes (32): ApiChannel, LinkRecord, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog() (+24 more)

### Community 79 - "transaction-history-storage.property.test.ts"
Cohesion: 0.08
Nodes (24): EntryContent, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, Command, ReplayableStorage, abortErrorLike(), capitalize(), applyCommand() (+16 more)

### Community 8 - "zod"
Cohesion: 0.02
Nodes (137): ResultColumn, Connected, CoreTransport, CoreTransportOptions, CoreLink, coreSessions, InstanceView, LinkConnection (+129 more)

### Community 82 - "core-ledger-state/sql.ts"
Cohesion: 0.11
Nodes (35): StateRow, StoredState, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks(), deleteGrey() (+27 more)

### Community 84 - "worker-storage.test.ts"
Cohesion: 0.09
Nodes (24): NodeStore, StoredNode, Thread, BridgeServer, bridgeStore, Growable, Nodes, bridgeMemory() (+16 more)

### Community 86 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (24): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+16 more)

### Community 87 - "browser.test.ts"
Cohesion: 0.08
Nodes (36): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+28 more)

### Community 89 - "backup/restore.ts"
Cohesion: 0.10
Nodes (28): PublicIdentity, Manifest, Checked, PublicSide, Restored, RestoreInput, RestoreTarget, BackupText (+20 more)

### Community 9 - "declaration.ts"
Cohesion: 0.02
Nodes (165): OpenedFacts, CoreChainFacts, HistoryCheck, HistoryInput, HistoryRule, Database, SchemaWriteHandle, AppliedMigration (+157 more)

### Community 93 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 94 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 97 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 98 - "file-modes.ts"
Cohesion: 0.08
Nodes (27): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+19 more)

### Community 99 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 120 - "data"
Cohesion: 0.09
Nodes (27): params(), n(), data(), 7. The module API, 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants, 2.4 Migrations: one per part (O-2) (+19 more)

### Community 195 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 114 - "connectChannel"
Cohesion: 0.10
Nodes (24): discard(), isChannel(), connectChannel(), fault(), 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard, Evidence, Problem, Suggested fix (+16 more)

### Community 138 - "Design — Sprint 4: Watermarks"
Cohesion: 0.08
Nodes (21): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 4. Wiring `PgTemporalKV`'s `opts.tx`, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure (+13 more)

### Community 141 - "T"
Cohesion: 0.09
Nodes (21): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Scenario: Version and timestamp addressing agree, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 0. Schema (+13 more)

### Community 142 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 153 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.10
Nodes (19): sweepReset(), 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents, 7. `core-arch` criteria rewritten by this change (+11 more)

### Community 167 - "integer"
Cohesion: 0.12
Nodes (15): integer(), 4.1 Column types, 4.2 Rules, 4.3 Data that is not a function of the chain: `deterministic: false`, 4. Deterministic PostgreSQL, Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first) (+7 more)

### Community 172 - "core-ledger-state.test.ts"
Cohesion: 0.15
Nodes (9): boundLedgerParser(), bindCoreLedgerState(), itemsOf(), applied(), bound(), query(), refusing(), NODES_PER_STATEMENT (+1 more)

### Community 179 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 180 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 181 - "mapping.test.ts"
Cohesion: 0.16
Nodes (6): mapRows(), mapValue(), oid(), identity(), RESULT_COLUMNS, RFC-3339

### Community 189 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 202 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 206 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 212 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 237 - "h"
Cohesion: 0.22
Nodes (8): h(), 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers, 5. L1 model sketch

### Community 238 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 244 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 246 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 253 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 283 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 334 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 47 - "history"
Cohesion: 0.04
Nodes (56): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+48 more)

### Community 56 - ".put"
Cohesion: 0.04
Nodes (48): coreBlockFetchOnFetch(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored (+40 more)

### Community 69 - "version"
Cohesion: 0.06
Nodes (42): side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+34 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 78 - ".off"
Cohesion: 0.05
Nodes (36): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears (+28 more)

### Community 83 - "core-private-source.test.ts"
Cohesion: 0.06
Nodes (11): privateBackbone(), height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PRIVATE_CORE_DIGEST (+3 more)

### Community 88 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 95 - ".slowBlockMs"
Cohesion: 0.07
Nodes (30): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+22 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 105 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+23 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 131 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 133 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.08
Nodes (25): 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words, 3.2 The rules, for block h (+17 more)

### Community 136 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 148 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 162 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 163 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 166 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 169 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 171 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 183 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 184 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 185 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 193 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 194 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 196 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 197 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 200 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 204 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 209 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 210 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 213 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 214 - "README.md"
Cohesion: 0.29
Nodes (3): Choosing a database, Launching it, stats-module

### Community 215 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 216 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 217 - "Boundaries, threats and controls"
Cohesion: 0.18
Nodes (11): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+3 more)

### Community 218 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 219 - "Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.18
Nodes (10): 0. Baseline, 1. Measurements on the recorded tapes (`design.md` §9, §13 phase 0), 2. The reference model and the reachability oracle (`design.md` §2.3, §3.2, §4; §13 phase 1), 3. Storage, the step, and the switch (`design.md` §2, §3, §10; §13 phase 2), 4. The process on both backends (`design.md` §4–§8; §13 phase 3), 6. Full verification (AGENTS.md stage 3), 7. Local preprod runs (`design.md` §12; manual evidence, never in CI), 8. Review (AGENTS.md stage 4, bounded) (+2 more)

### Community 223 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 224 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 225 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 226 - "Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored"
Cohesion: 0.20
Nodes (9): ADDED Requirements, MODIFIED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: A stale transaction handle is rejected before any query runs, Scenario: Two puts inside one withTransaction both commit together, Scenario: Two puts inside one withTransaction either both commit or neither does, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API (+1 more)

### Community 227 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 228 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 229 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 233 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 234 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 235 - "ROADMAP.md"
Cohesion: 0.22
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 236 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 239 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 240 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 241 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.22
Nodes (8): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution, Design — v1.0.0-perf-baseline

### Community 242 - "After 0.10.0"
Cohesion: 0.22
Nodes (9): 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals, Release gates still to run (+1 more)

### Community 243 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 245 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 247 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 248 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 249 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 250 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 252 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 254 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 255 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 256 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 257 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 258 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 259 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 260 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 261 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 263 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 265 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 266 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 267 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 268 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 269 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 270 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 271 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 272 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 273 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 274 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease, What changes, Why

### Community 275 - "Tasks — Sprint 2: Transaction/Lease"
Cohesion: 0.33
Nodes (5): 0. `PgTransactionLeaseLayer` — transactions, 1. `PgTransactionLeaseLayer` — leases, 2. Wire `PgTemporalKV`'s `opts.tx`, 3. Sprint close-out, Tasks — Sprint 2: Transaction/Lease

### Community 276 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 277 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 278 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 279 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 280 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 281 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 282 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 284 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 285 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 286 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 287 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 288 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 289 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 290 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 291 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 292 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 293 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 294 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 295 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 296 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 297 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 298 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 299 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 300 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 301 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 302 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 303 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 304 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 305 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 306 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 307 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 308 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 309 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 310 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 311 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 312 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 313 - "00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it"
Cohesion: 0.40
Nodes (4): 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it, Evidence, Problem, Suggested fix

### Community 314 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 315 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 316 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 317 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 318 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 319 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 320 - "Tasks — Sprint 1: project setup + TemporalKV"
Cohesion: 0.40
Nodes (4): 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV

### Community 321 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 322 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 324 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 325 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 326 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 327 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 328 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 329 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 330 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 331 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 332 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 72 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 81 - "package.json"
Cohesion: 0.05
Nodes (39): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+31 more)

### Community 85 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune (+29 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-6455` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4198 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `process-backends.ts`, `builds.ts`, `column-rules.ts`, `client.test.ts`, `fetch-fixtures.ts`, `validate.ts`, `zod`, `declaration.ts`, `process-build.ts`, `roles.ts`, `start-umbradb.ts`, `NodeClient`, `channel-queue.test.ts`, `tape/index.ts`, `ledger/types.ts`, `loop.test.ts`, `resolve.ts`, `InMemoryBlockSource`, `api.ts`, `adapter-fixtures.ts`, `contract-data-checks.ts`, `process-admin.ts`, `transform-checks.ts`, `src/db/postgres.ts`, `NodeBlockSource`, `startProcess`, `core-block-parsed.ts`, `devnet-upgrade.test.ts`, `spawnChild`, `cbor.ts`, `adapter.ts`, `deterministic-postgresql/index.ts`, `paused-harness.ts`, `backup/backup.ts`, `loop.ts`, `12. Ledger`, `db/backends.ts`, `core-chain.test.ts`, `refused-configuration.test.ts`, `slow-block-harness.ts`, `boundary.test.ts`, `interfaces/transaction-history-storage.ts`, `chain-process.test.ts`, `history.test.ts`, `code`, `core-block-commit.test.ts`, `module-api.test.ts`, `listening.test.ts`, `core-ledger-state.ts`, `PointName`, `startup-stop-harness.ts`, `writer-lock-checks.ts`, `surface.test.ts`, `retirement.test.ts`, `UmbraError`, `durability-probe.test.ts`, `pglite-lock.ts`, `runner/process.ts`, `networks.ts`, `transaction-history-storage.property.test.ts`, `package.json`, `core-ledger-state/sql.ts`, `core-private-source.test.ts`, `worker-storage.test.ts`, `cold-boot-recovery.integration.test.ts`, `browser.test.ts`, `backup/restore.ts`, `release-version.ts`, `core.ts`, `browser/build.ts`, `resolver-boundary.ts`, `options.ts`, `checks.test.ts`, `code-registry.ts`, `containers.test.ts`, `read-gate.ts`, `process-worker.ts`, `pg-tx-history-adapter.ts`, `documents.ts`, `api-server.test.ts`, `config/plain-data.ts`, `test/postgres/setup.ts`, `src/ledger/identity.ts`, `height-versioned.property.test.ts`, `example-checks.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `recovery.test.ts`, `version-checks.ts`, `ledger-table-config.test.ts`, `block-fetch-decode.test.ts`, `ledger-sweep.test.ts`, `key-handling-checks.ts`, `excluded-not-exported.test.ts`, `LoopPauses`, `core-ledger-state.test.ts`, `statementsOf`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `mapping.test.ts`, `web-lock.ts`, `twox.ts`, `worker-threads.test.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `ledger/plain-data.ts`, `worker-output.test.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.220) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `process-backends.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.019139408099688473 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `process-backends.ts`, `builds.ts`, `vitest`, `column-rules.ts`, `client.test.ts`, `fetch-fixtures.ts`, `validate.ts`, `startUmbraDB`, `zod`, `declaration.ts`, `process-build.ts`, `roles.ts`, `start-umbradb.ts`, `NodeClient`, `channel-queue.test.ts`, `tape/index.ts`, `ledger/types.ts`, `loop.test.ts`, `resolve.ts`, `InMemoryBlockSource`, `api.ts`, `contract-data-checks.ts`, `process-admin.ts`, `transform-checks.ts`, `src/db/postgres.ts`, `NodeBlockSource`, `startProcess`, `cbor.ts`, `FinalizedLoop`, `deterministic-postgresql/index.ts`, `paused-harness.ts`, `backup/backup.ts`, `loop.ts`, `12. Ledger`, `db/backends.ts`, `core-chain.test.ts`, `refused-configuration.test.ts`, `slow-block-harness.ts`, `chain-process.test.ts`, `history.test.ts`, `public-database.ts`, `config/history.ts`, `core-block-commit.test.ts`, `module-api.test.ts`, `core-ledger-state.ts`, `PointName`, `writer-lock-checks.ts`, `graph.ts`, `durability-probe.test.ts`, `module-api.ts`, `checkShape`, `pglite-lock.ts`, `runner/process.ts`, `core-private-source.test.ts`, `backup/restore.ts`, `options.ts`, `checks.test.ts`, `process-worker.ts`, `core-private-source.ts`, `api-server.test.ts`, `config/plain-data.ts`, `src/ledger/identity.ts`, `mapping.ts`, `PgliteDatabase`, `version-checks.ts`, `ledger-table-config.test.ts`, `ledger/metadata.ts`, `version-table.ts`, `.#open`, `core-ledger-state.test.ts`, `statementsOf`, `mapping.test.ts`, `web-lock.ts`, `Session`, `ApiRoutes`, `browser/src/config/load.ts`, `Writer`, `sha256`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `builds.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020088427527873896 - nodes in this community are weakly interconnected._