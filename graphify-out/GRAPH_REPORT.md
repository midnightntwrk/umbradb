# Graph Report - UmbraDB

## Corpus Check
- 1271 files · ~1,811,377 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13247 nodes · 41272 edges · 377 communities (344 shown, 33 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3456 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `f7626e4dbd059ee6` (1271 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- InMemoryBlockSource
- startUmbraDB
- ingest-harness.ts
- networks.ts
- .read
- config/database.ts
- real-tapes.ts
- boundary.test.ts
- loop.test.ts
- Worker
- release-version.ts
- core.ts
- browser/build.ts
- code-registry.ts
- db/errors.ts
- cbor.property.test.ts
- connectChannel
- resolver-boundary.ts
- api-timeouts.test.ts
- LedgerHost
- core-block-commit.ts
- containers.test.ts
- config/plain-data.ts
- src/db/postgres.ts
- .concat
- redact.ts
- api-server.test.ts
- documents.ts
- mapping.ts
- read-gate.ts
- TransactionHistoryEntry
- crash.test.ts
- resolve.ts
- pg-tx-history-adapter.ts
- node-bridge.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- validation.test.ts
- childRefKeys
- hex
- version-table.ts
- surface.test.ts
- cli/run.ts
- height-versioned.property.test.ts
- pack-install.mjs
- private/lockstep-wait.test.ts
- validate.ts
- ReadHandle
- digest.test.ts
- options.ts
- library-documents.test.ts
- worker-restart.test.ts
- config/history.ts
- chrome.ts
- key-handling-checks.ts
- shims.test.ts
- transaction-history-storage.property.test.ts
- node-set.ts
- .from
- earlier-build.ts
- pauseRun
- browser-harness.ts
- postgres-image.test.ts
- node-source.ts
- core-chain.ts
- cursor-table.property.test.ts
- builds.ts
- ledger/metadata.ts
- api-answers.ts
- LoopPauses
- statementsOf
- ApiRoutes
- ref_node_fs
- column-rules.ts
- no-indexer-or-wallet-sdk.test.ts
- web-lock.ts
- ref_node_url
- component-table.test.ts
- browser/serve.ts
- browser/src/config/load.ts
- Driver
- NodeClient
- history.property.test.ts
- buffer.ts
- stats-module.ts
- .send
- core-block-parsed.ts
- Design — Sprint 1: project setup + TemporalKV
- ws-mutual-tls.test.ts
- typescript
- core-transport.ts
- TapeAnswers
- startTlsPostgres
- ProcessItems
- core-private-source.test.ts
- signal-backup.worker.ts
- adapter-fixtures.ts
- mounted-admin.test.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- Process
- channel-queue.test.ts
- client.test.ts
- core-ledger-state/sql.ts
- private/backends.ts
- pglite.ts
- node.test.ts
- listenerProblems
- LedgerPackage
- PageApiChannel
- vitest
- NodeFS
- deterministic-postgresql/index.ts
- ledger/types.ts
- NodeBlockSource
- adapter.ts
- FinalizedLoop
- messages.ts
- process-admin.ts
- chain-data.test.ts
- refused-configuration.test.ts
- chain-events-decode.test.ts
- ledger/ledger-tasks.test.ts
- refcount-restart.ts
- BlockRef
- declaration.ts
- range.ts
- ModuleDeclaration
- transport-faults.test.ts
- refcount-model.ts
- contract-modules.test.ts
- runner/process.ts
- host.ts
- contract-data-checks.ts
- backup/backup.ts
- binding.test.ts
- node-fields-harness.ts
- PgTransactionHistoryStorage
- interfaces/transaction-history-storage.ts
- sweep-tapes.ts
- core-ledger-state.ts
- validation.ts
- database-parts.ts
- ledger-units.test.ts
- slow-block-harness.ts
- tape/index.ts
- api-session.test.ts
- ref_node_timers
- refcount-conversion.ts
- cbor.ts
- restore-content-defined.test.ts
- ledger-sweep.test.ts
- graph.ts
- checkShape
- UmbraError
- retirement.test.ts
- startup-stop-harness.ts
- determinism/contents-hash.ts
- content-defined.test.ts
- pglite-lock.ts
- page.ts
- module-api.ts
- version-checks.ts
- admin-harness.ts
- column-refusals.test.ts
- process-worker.ts
- ChannelEndpoint
- cold-boot-recovery.integration.test.ts
- file-mode.test.ts
- browser.test.ts
- configuration-refusal.test.ts
- test/postgres/setup.ts
- .configHash
- Proposal — Sprint 3: CheckpointStore
- Problem
- graph.py
- ADDED Requirements
- ledger-liveness.test.ts
- refused
- T
- following
- transportReader
- .slowBlockMs
- Boundaries, threats and controls
- Design — START-UMBRADB: UmbraDB as a library
- text.test.ts
- Tasks — START-UMBRADB: UmbraDB as a library
- v9
- mutation-per-adapter.mjs
- backupAtStop
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- twox.ts
- Design — v1.1.0: Quint model checking
- openssl
- Requirement: CF-4 Every field is data, operational or secret
- core-block-fetch.test.ts
- path.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- host-signal.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- parseJsonLossless
- ledger-node-write.test.ts
- orphan-watcher.mjs
- fresh-instance.mjs
- package-keys-walk.mjs
- crash-worker.ts
- table
- history
- data
- code
- .put
- .off
- version
- ADDED Requirements
- ADDED Requirements
- package.json
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- README.md
- ADDED Requirements
- ADDED Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Requirements
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Requirement: DT-3 The contents hash
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- scoped-review-manifest
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Tasks — v1.0.0-infosec-signoff
- Contributing
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
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
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
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
- 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- 00082 — Two processes making their first start at once on one PostgreSQL server race on the module roles
- bug-report.md
- feature-request.md
- MODIFIED Requirements
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 450 edges
2. `UmbraError` - 357 edges
3. `ModuleDeclaration` - 210 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 139 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `Database` - 105 edges
9. `startUmbraDB()` - 103 edges
10. `ReadHandle` - 98 edges

## Surprising Connections (you probably didn't know these)
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
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

## Communities (377 total, 33 thin omitted)

### Community 0 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (194): InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job, WorkerEvent, ChainBuildOptions (+186 more)

### Community 1 - "startUmbraDB"
Cohesion: 0.02
Nodes (178): Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork, UmbraDBOptions, UmbraDBReason (+170 more)

### Community 10 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (152): RestoreInput, SourceShared, CrashEvent, CrashJob, ingest, IngestOptions, SourceClass, watched (+144 more)

### Community 102 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 103 - ".read"
Cohesion: 0.07
Nodes (31): SchemaItem, MigrationRow, PartOptions, TestPart, identityRow(), captured(), triggerEnabled(), undigested() (+23 more)

### Community 105 - "config/database.ts"
Cohesion: 0.09
Nodes (26): ConfiguredDatabase, ConfiguredDatabaseOptions, CommittedHeight, PgliteOptions, LoadOutcome, OutsideRead, Traced, PgliteTestDatabase (+18 more)

### Community 106 - "real-tapes.ts"
Cohesion: 0.09
Nodes (32): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+24 more)

### Community 109 - "boundary.test.ts"
Cohesion: 0.13
Nodes (32): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+24 more)

### Community 11 - "loop.test.ts"
Cohesion: 0.03
Nodes (129): QueuedBlock, ErrorCode, GraphInput, BlockItems, LockstepWait, LoopEnd, SlowBlockEvent, SlowWindow (+121 more)

### Community 110 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 114 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 115 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 116 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 118 - "code-registry.ts"
Cohesion: 0.10
Nodes (32): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+24 more)

### Community 12 - "db/errors.ts"
Cohesion: 0.02
Nodes (108): PostgresConnection, PostgresOptions, SslMode, ReadOnlyDatabase, ReadOptions, ReadTimeoutSetting, ErrorDetails, KeeperGlobals (+100 more)

### Community 120 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 121 - "connectChannel"
Cohesion: 0.10
Nodes (22): SubscriptionCarrier, SubscriptionConnection, connectChannel(), errorMessage(), socketConnection(), fault(), 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once, Evidence (+14 more)

### Community 122 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 123 - "api-timeouts.test.ts"
Cohesion: 0.11
Nodes (28): ChainDataView, Seen, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions() (+20 more)

### Community 125 - "LedgerHost"
Cohesion: 0.17
Nodes (15): RetainedState, LedgerHost, LedgerWorkerFailure, NodeReader, PackageStartup, inThreadLedger(), recordingLoads(), pointWorker() (+7 more)

### Community 126 - "core-block-commit.ts"
Cohesion: 0.09
Nodes (27): AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock(), hex(), sameBytes(), writeBlockRow(), writeHashRow() (+19 more)

### Community 127 - "containers.test.ts"
Cohesion: 0.09
Nodes (22): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+14 more)

### Community 129 - "config/plain-data.ts"
Cohesion: 0.09
Nodes (22): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+14 more)

### Community 13 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (107): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, driverConnectionOptions, DriverError, Outcome (+99 more)

### Community 130 - ".concat"
Cohesion: 0.08
Nodes (20): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+12 more)

### Community 131 - "redact.ts"
Cohesion: 0.12
Nodes (24): RedactionForms, SecretForm, TextPattern, Needs, findings(), configRedactor(), credentialsIn(), decoded() (+16 more)

### Community 132 - "api-server.test.ts"
Cohesion: 0.11
Nodes (21): Client, configHashesOf(), duplicateProblems(), exchange(), helperProblems(), hex(), isConfigHash(), isVersion() (+13 more)

### Community 133 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 134 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+19 more)

### Community 136 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 137 - "TransactionHistoryEntry"
Cohesion: 0.12
Nodes (8): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 138 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 14 - "resolve.ts"
Cohesion: 0.03
Nodes (124): ConfigFacts, BackupCommandOptions, BackupOutcome, CheckFinding, CheckState, ConfigCheckOptions, ConfigCheckSeams, StepName (+116 more)

### Community 140 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 143 - "node-bridge.ts"
Cohesion: 0.11
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 144 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 145 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 146 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 147 - "validation.test.ts"
Cohesion: 0.09
Nodes (18): DeclarationRule, Case, ShapeCase, Stats, schemaName(), first(), validateWith(), module() (+10 more)

### Community 149 - "childRefKeys"
Cohesion: 0.12
Nodes (15): ChildReader, ChildVisitor, childRefKeys(), readChildList(), readChildren(), 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 4. The recorded tapes and the conversion (+7 more)

### Community 15 - "hex"
Cohesion: 0.04
Nodes (102): nodeKeys, Node, GeneratedBlock, GeneratedState, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child (+94 more)

### Community 151 - "version-table.ts"
Cohesion: 0.13
Nodes (25): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+17 more)

### Community 152 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 154 - "cli/run.ts"
Cohesion: 0.11
Nodes (17): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+9 more)

### Community 155 - "height-versioned.property.test.ts"
Cohesion: 0.16
Nodes (17): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+9 more)

### Community 157 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 158 - "private/lockstep-wait.test.ts"
Cohesion: 0.14
Nodes (19): LockstepCondition, OpenTransaction, A118Observation, MismatchObservation, ExpectedWait, WaitSample, RetargetProxy, a117Problems() (+11 more)

### Community 16 - "validate.ts"
Cohesion: 0.03
Nodes (121): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, HistoryFinding, ConfigRule (+113 more)

### Community 160 - "ReadHandle"
Cohesion: 0.12
Nodes (8): ReadHandle, PointCallbacks, HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, VersionsAnswersOnly, graphQLShaped()

### Community 161 - "digest.test.ts"
Cohesion: 0.12
Nodes (20): ChangeKind, tableChanges, TouchedRow, changeOf(), concat(), sameBytes(), hex(), hex() (+12 more)

### Community 162 - "options.ts"
Cohesion: 0.21
Nodes (22): readOptions, addressFindings(), configFindings(), elementsOf(), finding(), guarded(), isHost(), isObject() (+14 more)

### Community 166 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 169 - "worker-restart.test.ts"
Cohesion: 0.12
Nodes (17): SlowStep, isEvictionRefused(), beat(), countDeserializations(), hexOf(), loadLedger(), applyBlock(), at() (+9 more)

### Community 17 - "config/history.ts"
Cohesion: 0.03
Nodes (110): ConfigRow, CoreSettings, versionEntry, ConfigHashRow, HistoryCode, HistoryContext, HistoryOptions, ProvidesRow (+102 more)

### Community 170 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 171 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 172 - "shims.test.ts"
Cohesion: 0.16
Nodes (11): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, sha256, databaseOptions(), openConfiguredDatabase(), hex(), instantiateLedger() (+3 more)

### Community 174 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 175 - "node-set.ts"
Cohesion: 0.16
Nodes (18): NodeSetFault, NodeSetOptions, NodeTableCheck, SchemaTable, ContentFunction, ContentDefinition, ContentDefinedBuildOptions, first() (+10 more)

### Community 18 - ".from"
Cohesion: 0.04
Nodes (106): Buffer, Hash, FixtureRun, Touches, Fault, FaultRun, DagRun, DagRunOptions (+98 more)

### Community 180 - "earlier-build.ts"
Cohesion: 0.15
Nodes (18): FoldedPart, RecordedMigration, isObject(), readManifestLine(), earlierBackup(), earlierBootstrapSql(), earlierRefusalProblems(), earlierRows() (+10 more)

### Community 182 - "pauseRun"
Cohesion: 0.22
Nodes (14): Reader, Running, pausedOf(), pausedProblems(), pauseRun(), reach(), readinessProblems(), runningProblems() (+6 more)

### Community 183 - "browser-harness.ts"
Cohesion: 0.25
Nodes (17): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+9 more)

### Community 184 - "postgres-image.test.ts"
Cohesion: 0.14
Nodes (14): BenchEnv, RepositoryFile, canPin(), pinViolations(), repositoryFiles(), PG_SETTINGS, container, { guarded, fixture } (+6 more)

### Community 187 - "node-source.ts"
Cohesion: 0.20
Nodes (11): BlockHeaderItem, BlockItemSource, CoreBlockHeader, CoreBlockItems, MetadataBlock, RuntimeMetadataEntry, LedgerTable, systemEventsKey() (+3 more)

### Community 188 - "core-chain.ts"
Cohesion: 0.16
Nodes (17): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, WaitingListener, boundTo(), bytesOf(), checkChain() (+9 more)

### Community 189 - "cursor-table.property.test.ts"
Cohesion: 0.15
Nodes (17): CursorValue, Access, Block, BlockFails, Counts, Write, canonicalText(), expectValue() (+9 more)

### Community 19 - "builds.ts"
Cohesion: 0.04
Nodes (92): AdminStarter, A176Options, PrivateProcess, PrivateRefusal, PrivateSeen, PublicCore, PublicCoreOptions, InstanceHashes (+84 more)

### Community 190 - "ledger/metadata.ts"
Cohesion: 0.17
Nodes (6): MetadataNode, RuntimeMetadata, OwnStateMetadata, contentStateOf(), hexOf(), walkOver()

### Community 194 - "api-answers.ts"
Cohesion: 0.19
Nodes (15): HeadersArgument, LifecycleStatus, ProcessReason, answerNotServing(), byteLength(), isCoreHeader(), lifecycleBody(), lifecycleHeaders() (+7 more)

### Community 195 - "LoopPauses"
Cohesion: 0.18
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 197 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 198 - "ApiRoutes"
Cohesion: 0.19
Nodes (9): ApiRoutes, ModuleRegistration, AcceptsDuplicates, parsePath(), registerModuleApis(), shapeOf(), routesOf(), api() (+1 more)

### Community 2 - "ref_node_fs"
Cohesion: 0.03
Nodes (165): CommandHandler, CommandIo, MainProcess, RestoreCommandSeams, PostgresConnection, Body, PausedExpectation, Read (+157 more)

### Community 20 - "column-rules.ts"
Cohesion: 0.02
Nodes (101): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+93 more)

### Community 204 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 205 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 21 - "ref_node_url"
Cohesion: 0.02
Nodes (85): Child, ParentJob, Kill, Orphaned, SourceFile, Run, WorkerEvent, LockResult (+77 more)

### Community 211 - "component-table.test.ts"
Cohesion: 0.15
Nodes (10): DesignTable, RowCoverage, rule(), opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS (+2 more)

### Community 213 - "browser/serve.ts"
Cohesion: 0.22
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 214 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 215 - "Driver"
Cohesion: 0.17
Nodes (10): Driver, rootKey(), storeOf(), 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests (+2 more)

### Community 22 - "NodeClient"
Cohesion: 0.05
Nodes (70): NodeSourceOptions, FinalizedHeightOptions, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+62 more)

### Community 220 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 222 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 224 - "stats-module.ts"
Cohesion: 0.32
Nodes (10): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+2 more)

### Community 23 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (96): BlockEventSource, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser (+88 more)

### Community 235 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.20
Nodes (10): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+2 more)

### Community 238 - "ws-mutual-tls.test.ts"
Cohesion: 0.25
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 239 - "typescript"
Cohesion: 0.31
Nodes (8): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), isRegularFile(), packageType(), typeCheckFile(), typescript

### Community 24 - "core-transport.ts"
Cohesion: 0.03
Nodes (63): PrivateLinkAddress, EndpointOptions, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransportOptions (+55 more)

### Community 240 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 243 - "startTlsPostgres"
Cohesion: 0.20
Nodes (7): TlsPostgres, makeCertificates(), startTlsPostgres(), 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …), Evidence, Problem, Suggested fix

### Community 25 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (57): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision, StartHashes (+49 more)

### Community 258 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 26 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (89): CallTx, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost (+81 more)

### Community 27 - "mounted-admin.test.ts"
Cohesion: 0.04
Nodes (77): Answered, gate, SecretHashes, Compared, ConnectSeen, PortPeer, Expected, SubscriptionSeen (+69 more)

### Community 275 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 28 - "Process"
Cohesion: 0.05
Nodes (27): NetworkShown, ProcessAdmin, ProcessAdminOptions, NodeFacts, LedgerWorkerOptions, Heartbeat, HeartbeatOptions, TimerHandle (+19 more)

### Community 29 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (69): demoLink, Envelope, MessagePortLike, PrivateLinkChannel, controlledTimers, PeerEnd, PeerMessage, rawPeer (+61 more)

### Community 3 - "client.test.ts"
Cohesion: 0.02
Nodes (113): Connection, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets, Answer, FakeNode (+105 more)

### Community 30 - "core-ledger-state/sql.ts"
Cohesion: 0.04
Nodes (75): ComputedBlock, KeyCounts, RefcountCheck, RefcountStatement, refcountStep, RefcountTables, StateRow, StoredState (+67 more)

### Community 31 - "private/backends.ts"
Cohesion: 0.04
Nodes (52): PglitePathParts, PostgresParts, Keeping, PrivateBackend, SessionSeen, TestDatabase, A162Options, a162Run (+44 more)

### Community 32 - "pglite.ts"
Cohesion: 0.04
Nodes (38): ReadDatabaseOptions, Transaction, MultiStatementRunner, Job, JobQueue, PgliteDatabase, ServerErrorFields, BoundedRead (+30 more)

### Community 33 - "node.test.ts"
Cohesion: 0.04
Nodes (36): NodeRetry, ManualTimers, Outage, Metadata, Step, Frame, RawClient, Failure (+28 more)

### Community 34 - "LedgerPackage"
Cohesion: 0.05
Nodes (42): LedgerPackage, LedgerTaskBlock, StateHandle, EvictionRefused, LedgerEngine, LedgerTaskFailed, Settled, stagenetReplay (+34 more)

### Community 35 - "vitest"
Cohesion: 0.04
Nodes (54): RunPlan, Served, Finding, Lockfile, Manifest, BlockImport, ChildResult, CodeBlock (+46 more)

### Community 36 - "deterministic-postgresql/index.ts"
Cohesion: 0.04
Nodes (62): TableDigest, TableDigestRow, CapturedTable, GuardTableRow, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules (+54 more)

### Community 37 - "ledger/types.ts"
Cohesion: 0.05
Nodes (53): ApplyInput, ApplyOutput, LedgerPackageOptions, StateSummary, StoredNode, V9Logs, LedgerHeight, LoadAdapter (+45 more)

### Community 38 - "NodeBlockSource"
Cohesion: 0.05
Nodes (31): HeadWait, NodeBlockSource, Prefetch, NodeSubscription, FinalityStallCondition, PreparedBlock, QueueRunner, SourceCondition (+23 more)

### Community 39 - "adapter.ts"
Cohesion: 0.04
Nodes (65): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+57 more)

### Community 4 - "FinalizedLoop"
Cohesion: 0.02
Nodes (120): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+112 more)

### Community 40 - "messages.ts"
Cohesion: 0.04
Nodes (53): PublicSide, Committed, HelloAck, JsonValue, MessageFault, MessageType, PrivateTransport, Waiter (+45 more)

### Community 41 - "process-admin.ts"
Cohesion: 0.05
Nodes (68): AllowedDetail, PrivateSideFacts, RevisionSettings, DigestRow, ModuleFacts, PartTable, PrivateInstanceFacts, SnapshotFacts (+60 more)

### Community 42 - "chain-data.test.ts"
Cohesion: 0.06
Nodes (69): BlockSpec, Scenario, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+61 more)

### Community 43 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (67): EngineConfig, Observation, Start, Refusal, Start, startAdminServer(), startProcess(), adminSource() (+59 more)

### Community 44 - "chain-events-decode.test.ts"
Cohesion: 0.08
Nodes (48): BodyExtrinsic, ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive (+40 more)

### Community 45 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (56): TasksRun, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, prototype(), countMainThreadParses() (+48 more)

### Community 46 - "refcount-restart.ts"
Cohesion: 0.06
Nodes (62): contentsHash, FixtureConfig, Reach, storedKeep, BatchJson, databaseNow, Light, Line (+54 more)

### Community 47 - "BlockRef"
Cohesion: 0.05
Nodes (40): BlockRow, BlockRef, InMemorySourceOptions, CommitOutcome, HeldHeight, StandInOptions, Commit, Fetching (+32 more)

### Community 48 - "declaration.ts"
Cohesion: 0.06
Nodes (47): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, UmbraConfig, BlockWriteHandle, OwnPart, cursorTable, CursorTableOptions (+39 more)

### Community 49 - "range.ts"
Cohesion: 0.05
Nodes (57): NodeClientOptions, ConnectSocket, BoundaryBlockReading, BoundaryOptions, TapeBuilder, Arguments, Command, TapeCommandIo (+49 more)

### Community 5 - "ModuleDeclaration"
Cohesion: 0.02
Nodes (148): OpenedConfig, OpenedFacts, CoreChainFacts, RestoreBase, BackupText, HistoryCheck, HistoryInput, HistoryRow (+140 more)

### Community 50 - "transport-faults.test.ts"
Cohesion: 0.05
Nodes (45): ResultColumn, CoreTransport, Message, Report, Ended, rawClient, HeldLink, HoldingRelay (+37 more)

### Community 51 - "refcount-model.ts"
Cohesion: 0.06
Nodes (45): BlockKind, BlockScript, BoundaryRewrite, Dice, DrivenBlock, GraphNode, GraphWorld, HistoryScript (+37 more)

### Community 52 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (57): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+49 more)

### Community 53 - "runner/process.ts"
Cohesion: 0.04
Nodes (48): ChainCheck, ChainCheckInput, NodeWait, ChainIdentity, LoadOptions, transportReaderFacts, BlockSource, RetryCode (+40 more)

### Community 55 - "host.ts"
Cohesion: 0.06
Nodes (52): LoadLedger, LedgerName, ChainOutcome, LedgerTask, ParsedTransaction, AppliedState, ApplyBlock, BlockId (+44 more)

### Community 56 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (60): CoreContractStatesOptions, ContractStateRow, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+52 more)

### Community 58 - "backup/backup.ts"
Cohesion: 0.07
Nodes (53): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+45 more)

### Community 59 - "binding.test.ts"
Cohesion: 0.05
Nodes (56): PrivateIntakeOptions, PublicWakes, A165Options, a165Run, Attempt, A113Observation, A156Observation, Binding (+48 more)

### Community 6 - "node-fields-harness.ts"
Cohesion: 0.02
Nodes (163): NodeCallOptions, LateUse, ProcessCondition, EventSpec, RecordingClient, A168Observation, A168Phase, A168RunOptions (+155 more)

### Community 60 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (56): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema (+48 more)

### Community 61 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.04
Nodes (41): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+33 more)

### Community 62 - "sweep-tapes.ts"
Cohesion: 0.06
Nodes (46): CoreLedgerStateOptions, RefcountFault, NodeBatch, FixtureRunOptions, Block, StoredCheck, RefcountModel, Reader (+38 more)

### Community 63 - "core-ledger-state.ts"
Cohesion: 0.06
Nodes (49): BlockLedgerSource, LedgerBinding, LedgerStateItem, retainedStates, CoreRevision, ContractKeys, bindLedgerParser(), boundLedgerParser() (+41 more)

### Community 64 - "validation.ts"
Cohesion: 0.04
Nodes (59): DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+51 more)

### Community 65 - "database-parts.ts"
Cohesion: 0.05
Nodes (44): CheckStep, DatabaseParts, PostgresPartsInput, TickerConfig, PausableConfig, PrivateConfig, CheckTarget, CliBackend (+36 more)

### Community 67 - "ledger-units.test.ts"
Cohesion: 0.06
Nodes (47): ManifestLine, VerifyLedgerPackagesOptions, Path, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages() (+39 more)

### Community 68 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, Observed (+41 more)

### Community 7 - "tape/index.ts"
Cohesion: 0.03
Nodes (129): Failure, Variant, BoundaryReading, Link, TapeBuilderOptions, CompletenessRange, RecordingError, RecordingProblem (+121 more)

### Community 70 - "api-session.test.ts"
Cohesion: 0.08
Nodes (47): coreHeaders, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits (+39 more)

### Community 72 - "ref_node_timers"
Cohesion: 0.07
Nodes (34): ConfigCheckReport, Renamed, RunningCommand, statsConfig, runArguments(), runProcessCommand(), inProcess(), check() (+26 more)

### Community 73 - "refcount-conversion.ts"
Cohesion: 0.07
Nodes (45): FileEntries, Cbor, DigestRow, DigestRows, Reader, ReadableDatabase, ContractRow, conversionRun (+37 more)

### Community 75 - "cbor.ts"
Cohesion: 0.08
Nodes (42): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+34 more)

### Community 76 - "restore-content-defined.test.ts"
Cohesion: 0.05
Nodes (46): StoredRow, Tables, FileRow, RestoreBuild, contentsHashOf(), declaredContentDefined(), contentDefinedLedgerState(), countsAndQueue() (+38 more)

### Community 77 - "ledger-sweep.test.ts"
Cohesion: 0.07
Nodes (27): GreyPicker, SweepState, SweepTables, SweepWrites, MemoryTables, ModelBatch, ModelSnapshot, SweepModel (+19 more)

### Community 78 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 79 - "checkShape"
Cohesion: 0.07
Nodes (40): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+32 more)

### Community 8 - "UmbraError"
Cohesion: 0.03
Nodes (149): Checked, RestoreChain, RestoreTarget, SchemaWriteHandle, AppliedRow, MigrationPart, Runnable, Settling (+141 more)

### Community 81 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 82 - "startup-stop-harness.ts"
Cohesion: 0.08
Nodes (35): coreEntry, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StartVia, stopBy (+27 more)

### Community 83 - "determinism/contents-hash.ts"
Cohesion: 0.10
Nodes (36): CaptureColumn, CanonicalEncodingError, ContentOptions, TableContent, ModuleColumn, ModuleContentsError, ModuleTable, ModuleTableOptions (+28 more)

### Community 84 - "content-defined.test.ts"
Cohesion: 0.08
Nodes (31): ModuleContentsFailure, DeterminismBackend, TestDatabase, TestServer, Backend, database(), hex(), freshDatabase() (+23 more)

### Community 85 - "pglite-lock.ts"
Cohesion: 0.07
Nodes (34): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Segment, Job (+26 more)

### Community 86 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 87 - "module-api.ts"
Cohesion: 0.07
Nodes (30): ChainDataAnswer, ApiError, ApiErrorCode, ApiRequest, ApiResponse, HttpMethod, ModuleApi, PathSegment (+22 more)

### Community 89 - "version-checks.ts"
Cohesion: 0.12
Nodes (33): Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk, Answers (+25 more)

### Community 9 - "admin-harness.ts"
Cohesion: 0.03
Nodes (138): MountedAdminAnswer, AdminSeams, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer (+130 more)

### Community 90 - "column-refusals.test.ts"
Cohesion: 0.09
Nodes (22): CaptureState, CheckedMigration, Case, refuseNonDeterministic(), moduleTables(), catalogRelations(), catalogTables(), compareUtf8() (+14 more)

### Community 91 - "process-worker.ts"
Cohesion: 0.08
Nodes (29): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, Scope, crossedError, FromProcessWorker, StartRun (+21 more)

### Community 92 - "ChannelEndpoint"
Cohesion: 0.11
Nodes (13): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), discard(), isChannel(), queuedSlowProblems() (+5 more)

### Community 95 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 96 - "file-mode.test.ts"
Cohesion: 0.08
Nodes (30): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+22 more)

### Community 97 - "browser.test.ts"
Cohesion: 0.07
Nodes (37): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, heldClock, continuedProblems() (+29 more)

### Community 98 - "configuration-refusal.test.ts"
Cohesion: 0.08
Nodes (29): ConfigFinding, ConfigInput, ReasonCode, Unwrapped, configurationRefused(), findingText(), refusalFindings(), configurationFindings() (+21 more)

### Community 99 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 217 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 263 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 281 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 107 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 117 - "ledger-liveness.test.ts"
Cohesion: 0.09
Nodes (29): core(), databaseOf(), coreLedgerState(), defineConfig(), core(), run(), coreWith(), coreConfiguration() (+21 more)

### Community 119 - "refused"
Cohesion: 0.07
Nodes (32): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, A paused loop on `/status`, A private process and a changed public configuration, The node on `/status` (+24 more)

### Community 128 - "T"
Cohesion: 0.07
Nodes (29): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get` (+21 more)

### Community 159 - "following"
Cohesion: 0.10
Nodes (22): cursorRead(), following(), 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began, Evidence, Problem, Suggested fix, Admin endpoints and process states, Backup and restore (+14 more)

### Community 163 - "transportReader"
Cohesion: 0.10
Nodes (19): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Problem, Suggested fix, 10. Requirement coverage, 2. Network, 3. Lifecycle (+11 more)

### Community 167 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 173 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 177 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.12
Nodes (16): transportReaderRule(), Evidence, 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout (+8 more)

### Community 196 - "text.test.ts"
Cohesion: 0.19
Nodes (9): createReadStream(), firstLine(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir (+1 more)

### Community 199 - "Tasks — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.14
Nodes (12): found(), ownKeys(), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Rework (class 4), 0. Baseline, 10. Review (AGENTS.md stage 4, bounded), 11. Close-out, 2. The private link's settings renamed (D-6; CF-4) (+4 more)

### Community 200 - "v9"
Cohesion: 0.17
Nodes (14): fakePackage(), regular(), system(), v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix (+6 more)

### Community 203 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 206 - "backupAtStop"
Cohesion: 0.18
Nodes (13): backupAtStop(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds, Writing a backup, 15. Backups and browser (+5 more)

### Community 207 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (12): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+4 more)

### Community 212 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 219 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 223 - "openssl"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 227 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.17
Nodes (11): vendored(), Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing (+3 more)

### Community 228 - "core-block-fetch.test.ts"
Cohesion: 0.17
Nodes (3): isBlockItemSource(), CORE_BLOCK_FETCH_ID, KNOWN_NETWORKS

### Community 250 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 260 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 265 - "host-signal.ts"
Cohesion: 0.32
Nodes (5): isAbortSignal(), followSignal(), isSignal(), ABORTED, REASON

### Community 267 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 279 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 295 - "ledger-node-write.test.ts"
Cohesion: 0.53
Nodes (5): applied(), hex(), key(), node(), rowsOf()

### Community 296 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 337 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 338 - "package-keys-walk.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 349 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 54 - "table"
Cohesion: 0.03
Nodes (68): side(), params(), migrations(), table(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules (+60 more)

### Community 57 - "history"
Cohesion: 0.04
Nodes (61): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+53 more)

### Community 66 - "data"
Cohesion: 0.04
Nodes (61): n(), data(), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not), Rework (class 3 continued — cross-vendor cold audit, rounds 2-4), Rework (class 3 — cross-vendor audit caught real correctness defects post-self-verify), 2.1 The tables of `core-ledger-state` (+53 more)

### Community 69 - "code"
Cohesion: 0.04
Nodes (55): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+47 more)

### Community 71 - ".put"
Cohesion: 0.04
Nodes (48): coreBlockFetchOnFetch(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+40 more)

### Community 74 - ".off"
Cohesion: 0.04
Nodes (50): Durability, 0. Baseline and decisions, 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate) (+42 more)

### Community 80 - "version"
Cohesion: 0.05
Nodes (45): deferred(), version(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log (+37 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 101 - "package.json"
Cohesion: 0.05
Nodes (39): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+31 more)

### Community 104 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+29 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+28 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 139 - "README.md"
Cohesion: 0.09
Nodes (19): Choosing a database, At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails, Launching it (+11 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 148 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.07
Nodes (21): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+13 more)

### Community 150 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 164 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 165 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need, Requirement: PP-6 Lockstep instances process each height at that height (+12 more)

### Community 176 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.11
Nodes (18): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7), Rework (class 1 — infra) (+10 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 179 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 185 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 186 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 191 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 192 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 193 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 201 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 202 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+6 more)

### Community 208 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 209 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 210 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 216 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 218 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 221 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 225 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 226 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 230 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 231 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 232 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 233 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 234 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 236 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 237 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 241 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 242 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 244 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 245 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 246 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 247 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 248 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 251 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 252 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 253 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 254 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 255 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 256 - "Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.22
Nodes (8): 0. Baseline, 1. Measurements on the recorded tapes (`design.md` §9, §13 phase 0), 5. The sweep removed, the documents (`design.md` §11; §13 phase 4), 6. Full verification (AGENTS.md stage 3), 7. Local preprod runs (`design.md` §12; manual evidence, never in CI), 8. Review (AGENTS.md stage 4, bounded), 9. Close-out, Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting

### Community 257 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 259 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 261 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 262 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 264 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 266 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 268 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 269 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 270 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 271 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 272 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 273 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 274 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 277 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 278 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 280 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 282 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.33
Nodes (5): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Problem, Resolution, Suggested fix

### Community 283 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 284 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 285 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 286 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 287 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 288 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 289 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 290 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 291 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 292 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 293 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 294 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 297 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 298 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 299 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 300 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 301 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 302 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 303 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 304 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 305 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 306 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 307 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 308 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 309 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 310 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 311 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 312 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 313 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 314 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 315 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 316 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 317 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 318 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 319 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 320 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 321 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 322 - "00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered"
Cohesion: 0.40
Nodes (4): 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered, Evidence, Problem, Suggested fix

### Community 323 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 324 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 325 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 326 - "00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why"
Cohesion: 0.40
Nodes (4): 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why, Evidence, Problem, Suggested fix

### Community 327 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 328 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 329 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 330 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 331 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 332 - "00082 — Two processes making their first start at once on one PostgreSQL server race on the module roles"
Cohesion: 0.40
Nodes (4): 00082 — Two processes making their first start at once on one PostgreSQL server race on the module roles, Evidence, Problem, Suggested fix

### Community 333 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 334 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 335 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 339 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 340 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 341 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 342 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 343 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 344 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 345 - "Requirement: PP-2 A private database is bound to one public database"
Cohesion: 0.50
Nodes (4): Requirement: PP-2 A private database is bound to one public database, Scenario: Configured for another network, Scenario: Pointed at another public database, Scenario: The public core never started

### Community 346 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 347 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

## Knowledge Gaps
- **59 isolated node(s):** `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx`, `typedoc`, `@types/node` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4349 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `InMemoryBlockSource`, `startUmbraDB`, `ref_node_fs`, `client.test.ts`, `FinalizedLoop`, `ModuleDeclaration`, `node-fields-harness.ts`, `tape/index.ts`, `UmbraError`, `admin-harness.ts`, `ingest-harness.ts`, `loop.test.ts`, `db/errors.ts`, `src/db/postgres.ts`, `resolve.ts`, `hex`, `validate.ts`, `config/history.ts`, `.from`, `builds.ts`, `column-rules.ts`, `ref_node_url`, `NodeClient`, `core-block-parsed.ts`, `core-transport.ts`, `core-private-source.test.ts`, `adapter-fixtures.ts`, `mounted-admin.test.ts`, `Process`, `channel-queue.test.ts`, `core-ledger-state/sql.ts`, `private/backends.ts`, `pglite.ts`, `node.test.ts`, `deterministic-postgresql/index.ts`, `ledger/types.ts`, `NodeBlockSource`, `adapter.ts`, `messages.ts`, `process-admin.ts`, `chain-data.test.ts`, `refused-configuration.test.ts`, `chain-events-decode.test.ts`, `ledger/ledger-tasks.test.ts`, `refcount-restart.ts`, `BlockRef`, `declaration.ts`, `transport-faults.test.ts`, `refcount-model.ts`, `contract-modules.test.ts`, `runner/process.ts`, `host.ts`, `contract-data-checks.ts`, `backup/backup.ts`, `binding.test.ts`, `interfaces/transaction-history-storage.ts`, `sweep-tapes.ts`, `core-ledger-state.ts`, `validation.ts`, `database-parts.ts`, `ledger-units.test.ts`, `slow-block-harness.ts`, `api-session.test.ts`, `ref_node_timers`, `refcount-conversion.ts`, `restore-content-defined.test.ts`, `ledger-sweep.test.ts`, `retirement.test.ts`, `startup-stop-harness.ts`, `content-defined.test.ts`, `pglite-lock.ts`, `module-api.ts`, `version-checks.ts`, `column-refusals.test.ts`, `cold-boot-recovery.integration.test.ts`, `file-mode.test.ts`, `browser.test.ts`, `configuration-refusal.test.ts`, `test/postgres/setup.ts`, `package.json`, `networks.ts`, `.read`, `config/database.ts`, `real-tapes.ts`, `boundary.test.ts`, `Worker`, `release-version.ts`, `core.ts`, `browser/build.ts`, `ledger-liveness.test.ts`, `code-registry.ts`, `cbor.property.test.ts`, `resolver-boundary.ts`, `api-timeouts.test.ts`, `containers.test.ts`, `config/plain-data.ts`, `redact.ts`, `api-server.test.ts`, `documents.ts`, `read-gate.ts`, `crash.test.ts`, `pg-tx-history-adapter.ts`, `node-bridge.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `validation.test.ts`, `version-table.ts`, `surface.test.ts`, `cli/run.ts`, `height-versioned.property.test.ts`, `private/lockstep-wait.test.ts`, `digest.test.ts`, `library-documents.test.ts`, `worker-restart.test.ts`, `key-handling-checks.ts`, `shims.test.ts`, `transaction-history-storage.property.test.ts`, `excluded-not-exported.test.ts`, `postgres-image.test.ts`, `cursor-table.property.test.ts`, `LoopPauses`, `text.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `component-table.test.ts`, `twox.ts`, `history.property.test.ts`, `core-block-fetch.test.ts`, `ws-mutual-tls.test.ts`, `host-signal.ts`, `ledger-node-write.test.ts`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InMemoryBlockSource` be split into smaller, more focused modules?**
  _Cohesion score 0.0206818113794858 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `InMemoryBlockSource`, `startUmbraDB`, `ref_node_fs`, `client.test.ts`, `FinalizedLoop`, `ModuleDeclaration`, `node-fields-harness.ts`, `tape/index.ts`, `admin-harness.ts`, `ingest-harness.ts`, `loop.test.ts`, `db/errors.ts`, `src/db/postgres.ts`, `resolve.ts`, `validate.ts`, `config/history.ts`, `.from`, `builds.ts`, `NodeClient`, `core-transport.ts`, `core-private-source.test.ts`, `mounted-admin.test.ts`, `Process`, `channel-queue.test.ts`, `core-ledger-state/sql.ts`, `private/backends.ts`, `pglite.ts`, `node.test.ts`, `LedgerPackage`, `vitest`, `deterministic-postgresql/index.ts`, `NodeBlockSource`, `messages.ts`, `process-admin.ts`, `refused-configuration.test.ts`, `ledger/ledger-tasks.test.ts`, `refcount-restart.ts`, `BlockRef`, `declaration.ts`, `range.ts`, `transport-faults.test.ts`, `refcount-model.ts`, `contract-modules.test.ts`, `runner/process.ts`, `backup/backup.ts`, `binding.test.ts`, `core-ledger-state.ts`, `validation.ts`, `ledger-units.test.ts`, `slow-block-harness.ts`, `ref_node_timers`, `cbor.ts`, `graph.ts`, `checkShape`, `version`, `determinism/contents-hash.ts`, `content-defined.test.ts`, `pglite-lock.ts`, `module-api.ts`, `version-checks.ts`, `column-refusals.test.ts`, `configuration-refusal.test.ts`, `.read`, `config/database.ts`, `ledger-liveness.test.ts`, `api-timeouts.test.ts`, `core-block-commit.ts`, `config/plain-data.ts`, `api-server.test.ts`, `mapping.ts`, `validation.test.ts`, `version-table.ts`, `following`, `options.ts`, `shims.test.ts`, `node-set.ts`, `earlier-build.ts`, `node-source.ts`, `core-chain.ts`, `ledger/metadata.ts`, `statementsOf`, `ApiRoutes`, `web-lock.ts`, `backupAtStop`, `browser/src/config/load.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `startUmbraDB` be split into smaller, more focused modules?**
  _Cohesion score 0.017366406274314523 - nodes in this community are weakly interconnected._