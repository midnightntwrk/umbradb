# Graph Report - UmbraDB

## Corpus Check
- 969 files · ~1,429,613 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10307 nodes · 29692 edges · 329 communities (298 shown, 31 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2397 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `1934dda3b97a6e91` (969 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- Database
- range.test.ts
- db/api.ts
- refused-configuration.test.ts
- postgres/transaction-history-storage.ts
- readiness.test.ts
- binding.test.ts
- browser/build.ts
- config/history.ts
- Lockstep
- test/postgres/setup.ts
- node-format.ts
- .value
- core-block-commit.test.ts
- version-checks.ts
- config-hash-checks.ts
- vendored-ledger-v9.test.ts
- client.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- fixtures/configuration.ts
- height-versioned.property.test.ts
- browser.test.ts
- describeNodeStoreExports
- process-worker.ts
- Buffer
- code-registry.ts
- .from
- ledger-table-config.test.ts
- plain-data.ts
- type-check.ts
- loop.ts
- page.ts
- ws-mutual-tls.test.ts
- node-bridge.ts
- block-fetch-decode.test.ts
- browser-harness.ts
- core-block-fetch/metadata.ts
- childRefKeys
- migrate.ts
- version-table.ts
- redact.ts
- key-handling-checks.ts
- lockstep-refusals.test.ts
- contract-modules.test.ts
- JsonValue
- roles.ts
- core-chain-events/events.ts
- statementsOf
- PortSocket
- InMemoryTransactionHistoryStorage
- Worker
- checkShape
- adapter-fixtures.ts
- private/lockstep-wait.test.ts
- chrome.ts
- web-lock.ts
- worker-threads.test.ts
- FinalizedLoop
- ChromeTab
- worker-threads-worker.ts
- api-server.test.ts
- host.ts
- run.ts
- identity.ts
- Reader
- LedgerPackage
- sha256
- RuntimeMetadata
- process-admin.ts
- stats.ts
- ledger-tapes.ts
- vitest
- mutation-evidence.d.mts
- extrinsics.ts
- AsyncLocalStorage
- validate.ts
- transform-checks.ts
- .once
- spawnChild
- declaration.ts
- exitWithin
- changes.property.test.ts
- CliBackend
- chain-process.test.ts
- BlockRef
- https.ts
- NodeFS
- backup/restore.ts
- ref_node_fs
- config-check.ts
- backup-fixtures.ts
- cli/command.ts
- write-handles.test.ts
- PgTransactionHistoryStorage
- database-fixtures.ts
- core-ledger-state.ts
- opt-out.test.ts
- runner/process.ts
- NodeBlockSource
- column-rules.ts
- core-transport.ts
- slow-block-harness.ts
- validation.ts
- core-private-source.ts
- admin-harness.ts
- UmbraError
- worker-storage.test.ts
- intake.test.ts
- cbor.ts
- column-rules.test.ts
- boundary.test.ts
- contract-data-checks.ts
- core-config.test.ts
- version
- core-block-parsed.ts
- tape/index.ts
- graph.ts
- interfaces/transaction-history-storage.ts
- ledger-sweep.test.ts
- lifecycle.test.ts
- private/backends.ts
- Design — Sprint 1: project setup + TemporalKV
- serve.test.ts
- builds.ts
- retirement.test.ts
- ledger-storage.test.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Process
- core-settings.ts
- messages.ts
- .concat
- held-height.test.ts
- NodeClient
- net.test.ts
- admin/types.ts
- tape/command.ts
- transport-faults.test.ts
- networks.ts
- ModuleDeclaration
- mapping.ts
- fetch-fixtures.ts
- T
- pg-tx-history-adapter.ts
- cbor.property.test.ts
- sweep-tapes.ts
- referenceMergeEntries
- crash.test.ts
- UmbraDB module guide
- .position
- cold-boot-recovery.integration.test.ts
- refused
- UmbraDB third-party component inventory (SBOM)
- decode
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- migrations
- mutation-per-adapter.mjs
- fault
- Full-Chain Storage
- facade-merge-loader.ts
- .slowBlockMs
- pack-install.mjs
- scoped-review-manifest
- test-processes.test.ts
- path.ts
- .boolean
- Performance — design
- orphan-watcher.mjs
- crash-worker.ts
- leanProblems
- .put
- history
- fn
- core-private-source.test.ts
- graph.py
- code
- Full-Chain Storage — Design
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ROADMAP.md
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- README.md
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB
- stryker.conf.json
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Design — v1.0.0 API Surface & Release Contract
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- compilerOptions
- chain_archive lineage
- ADDED Requirements
- Design — Sprint 4: Watermarks
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Security policy & threat model
- Tasks — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- Checkpoint-store composition contract — cursor ordering and replay
- UmbraDB 1.0.0 Release Contracts
- Storage Algebra Lean M3a Watermarks Sprint
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- Backups
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- Vendored ledger builds
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- bug-report.md
- feature-request.md
- Requirement: RN-16 Chain-data reads name their view and height
- GC architecture and query-tracing: research findings
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
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
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 296 edges
2. `UmbraError` - 293 edges
3. `ModuleDeclaration` - 160 edges
4. `FinalizedLoop` - 112 edges
5. `InMemoryBlockSource` - 100 edges
6. `NodeClient` - 99 edges
7. `Database` - 95 edges
8. `BlockRef` - 87 edges
9. `ReadHandle` - 84 edges
10. `NodeBlockSource` - 72 edges

## Surprising Connections (you probably didn't know these)
- `Problem` --references--> `InMemoryBlockSource`  [INFERRED]
  docs/issues/00036-in-memory-blocks-runtime-2-0-ledger-v9.md → src/runner/in-memory-source.ts
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (329 total, 31 thin omitted)

### Community 0 - "Database"
Cohesion: 0.02
Nodes (166): Database, ReadOnlyDatabase, SchemaPlan, ErrorCode, EntryRange, GraphInput, ResolvedGraph, DeclarationRule (+158 more)

### Community 1 - "range.test.ts"
Cohesion: 0.02
Nodes (103): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+95 more)

### Community 10 - "db/api.ts"
Cohesion: 0.03
Nodes (89): BlockWriteHandle, ReadHandle, SchemaWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+81 more)

### Community 100 - "refused-configuration.test.ts"
Cohesion: 0.11
Nodes (26): ProcessConfig, Refusal, Start, adminSnapshot(), adminSource(), codeOnly(), commandProblems(), declarationsOf() (+18 more)

### Community 103 - "postgres/transaction-history-storage.ts"
Cohesion: 0.10
Nodes (20): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow() (+12 more)

### Community 105 - "readiness.test.ts"
Cohesion: 0.11
Nodes (21): ReadinessFacts, ProcessState, gate, Decision, ReadinessCase, readinessOf(), ae4(), caseText() (+13 more)

### Community 106 - "binding.test.ts"
Cohesion: 0.11
Nodes (22): TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), a113Problems() (+14 more)

### Community 107 - "browser/build.ts"
Cohesion: 0.09
Nodes (23): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+15 more)

### Community 11 - "config/history.ts"
Cohesion: 0.04
Nodes (113): CoreSettings, HistoryCheck, HistoryCode, HistoryContext, HistoryInput, HistoryOptions, HistoryRow, HistoryRule (+105 more)

### Community 110 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 111 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 112 - "node-format.ts"
Cohesion: 0.15
Nodes (19): Child, Readable, Reader, TableNode, node(), childKey(), concat(), decodeChildren() (+11 more)

### Community 114 - ".value"
Cohesion: 0.19
Nodes (11): ScaleReader, ValueReader, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), bytesArgument(), decodeChainEvents() (+3 more)

### Community 115 - "core-block-commit.test.ts"
Cohesion: 0.12
Nodes (21): Commit, blockHeaderOf(), checkParent(), commitBlock(), hex(), ledgerVersionOf(), sameBytes(), writeBlockRow() (+13 more)

### Community 116 - "version-checks.ts"
Cohesion: 0.14
Nodes (18): MetadataNode, MetadataSelector, Select, Walk, OwnStateMetadata, quietConnect(), withNode(), copyVendoredLedger() (+10 more)

### Community 117 - "config-hash-checks.ts"
Cohesion: 0.11
Nodes (18): Report, A162Options, a162Run, HeaderSeen, ReportRelay, RetargetProxy, a162Problems(), asLogin() (+10 more)

### Community 118 - "vendored-ledger-v9.test.ts"
Cohesion: 0.16
Nodes (25): NodeRoot, freeAll(), bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free() (+17 more)

### Community 12 - "client.test.ts"
Cohesion: 0.03
Nodes (72): NodeCallOptions, NodeClientOptions, NodeRetry, ConnectSocket, RecordingClient, Answer, FakeNode, Handler (+64 more)

### Community 120 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 121 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 122 - "fixtures/configuration.ts"
Cohesion: 0.12
Nodes (19): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration() (+11 more)

### Community 123 - "height-versioned.property.test.ts"
Cohesion: 0.15
Nodes (18): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+10 more)

### Community 124 - "browser.test.ts"
Cohesion: 0.13
Nodes (24): Reachable, midChainProblems(), networkProblems(), plain(), resumeProblems(), sameHashProblems(), secondTabProblems(), startProblems() (+16 more)

### Community 125 - "describeNodeStoreExports"
Cohesion: 0.13
Nodes (11): FreshInstanceRequest, FreshInstanceResult, StoredNode, Disposable, NodeBatch, NodeStoreExports, NodeStoreSubject, runInFreshInstance() (+3 more)

### Community 126 - "process-worker.ts"
Cohesion: 0.14
Nodes (16): Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, openedProcess, messageAdmin(), withDevelopmentOptIn() (+8 more)

### Community 127 - "Buffer"
Cohesion: 0.10
Nodes (18): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+10 more)

### Community 128 - "code-registry.ts"
Cohesion: 0.12
Nodes (23): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+15 more)

### Community 13 - ".from"
Cohesion: 0.03
Nodes (97): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+89 more)

### Community 131 - "ledger-table-config.test.ts"
Cohesion: 0.16
Nodes (21): CountingNode, Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked() (+13 more)

### Community 132 - "plain-data.ts"
Cohesion: 0.12
Nodes (22): PlainArray, PlainDataNode, Walk, Hash, copyArray(), copyObject(), instanceOf(), isElementKey() (+14 more)

### Community 138 - "type-check.ts"
Cohesion: 0.14
Nodes (15): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), moduleSpecifier() (+7 more)

### Community 14 - "loop.ts"
Cohesion: 0.04
Nodes (101): PointName, HeightRange, Callback, CallbackFailure, ParallelPoint, PointArguments, PointRun, ProcessReason (+93 more)

### Community 141 - "page.ts"
Cohesion: 0.12
Nodes (17): NetworkBroker, PageState, ProcessView, CallMethod, appendLog(), element(), onEvent(), render() (+9 more)

### Community 142 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (18): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+10 more)

### Community 143 - "node-bridge.ts"
Cohesion: 0.14
Nodes (17): BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 144 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 145 - "browser-harness.ts"
Cohesion: 0.14
Nodes (17): BrowserBuild, pageBench, PageEvent, ProcessName, StatusBody, PageServer, call(), eventsOf() (+9 more)

### Community 148 - "core-block-fetch/metadata.ts"
Cohesion: 0.26
Nodes (15): MetadataStorage, MetadataStorageEntry, Primitive, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata() (+7 more)

### Community 149 - "childRefKeys"
Cohesion: 0.17
Nodes (8): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf(), hex(), modelOfFixture()

### Community 15 - "migrate.ts"
Cohesion: 0.04
Nodes (83): BenchEnv, AppliedRow, Runnable, Settling, PostgresOptions, WriterProcess, Job, WorkerEvent (+75 more)

### Community 150 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 154 - "redact.ts"
Cohesion: 0.17
Nodes (17): RedactionForms, SecretForm, TextPattern, findings(), configRedactor(), credentialsIn(), decoded(), kindOf() (+9 more)

### Community 155 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 157 - "lockstep-refusals.test.ts"
Cohesion: 0.22
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, WaitSample, hexOf(), a118Problems(), a118Run(), coreOn() (+10 more)

### Community 16 - "contract-modules.test.ts"
Cohesion: 0.04
Nodes (90): ContractLog, CoreContractLogsFastOptions, UnsureLog, FastLogReader, LoadAdapter, LogSite, Program, UnsureReason (+82 more)

### Community 161 - "JsonValue"
Cohesion: 0.12
Nodes (17): JsonValue, 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file) (+9 more)

### Community 17 - "roles.ts"
Cohesion: 0.03
Nodes (80): MigrationPart, Difference, PlannedSchema, Provision, QualifiedTable, SchemaItem, SchemaMigration, SchemaModule (+72 more)

### Community 171 - "core-chain-events/events.ts"
Cohesion: 0.15
Nodes (13): MetadataField, MetadataType, MetadataVariant, RecordTypes, namedField(), canonicalJson(), hexOf(), littleEndian() (+5 more)

### Community 172 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 173 - "PortSocket"
Cohesion: 0.21
Nodes (5): PortSocket, 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 174 - "InMemoryTransactionHistoryStorage"
Cohesion: 0.21
Nodes (6): InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 176 - "Worker"
Cohesion: 0.21
Nodes (3): Worker, 9.2 Browser build (BR), 9. Backups and browser

### Community 179 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 18 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (90): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, Decimal (+82 more)

### Community 180 - "private/lockstep-wait.test.ts"
Cohesion: 0.25
Nodes (13): LockstepWait, ExpectedWait, a117Problems(), firstWait(), lockstepCore(), loginOf(), rowsIn(), sampleWait() (+5 more)

### Community 181 - "chrome.ts"
Cohesion: 0.23
Nodes (10): Cdp, CdpEvent, PageRequest, chrome(), chrome(), chromePath(), chromeVersion(), launchChrome() (+2 more)

### Community 182 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 188 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 19 - "FinalizedLoop"
Cohesion: 0.04
Nodes (28): ResolvedRange, EntryBoundary, PointSchedule, Activity, FinalizedLoop, HeightRun, LoopObserver, SkipsAfterReconnect (+20 more)

### Community 194 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 2 - "api-server.test.ts"
Cohesion: 0.02
Nodes (130): ModuleApiServer, ModuleApiStart, StartedModuleApi, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart (+122 more)

### Community 20 - "host.ts"
Cohesion: 0.05
Nodes (66): LoadLedger, CoreLedgerStateOptions, LedgerName, ChainOutcome, LedgerPackageOptions, NodeBatch, AppliedState, ApplyBlock (+58 more)

### Community 200 - "run.ts"
Cohesion: 0.26
Nodes (9): privateIntake, CommandBuildOptions, RunOptions, SignalSource, stopSignal, commandBuild(), processOf(), runProcess() (+1 more)

### Community 201 - "identity.ts"
Cohesion: 0.30
Nodes (11): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+3 more)

### Community 208 - "Reader"
Cohesion: 0.35
Nodes (4): Reader, decodeChild(), readChild(), readChildList()

### Community 21 - "LedgerPackage"
Cohesion: 0.05
Nodes (44): LedgerPackage, LedgerTask, StateHandle, LedgerEngine, Settled, stagenetReplay, hexOf(), idOf() (+36 more)

### Community 210 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 219 - "RuntimeMetadata"
Cohesion: 0.27
Nodes (3): RuntimeMetadata, contentStateOf(), hexOf()

### Community 22 - "process-admin.ts"
Cohesion: 0.05
Nodes (74): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+66 more)

### Community 220 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 23 - "ledger-tapes.ts"
Cohesion: 0.05
Nodes (76): BlockSpec, Json, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+68 more)

### Community 24 - "vitest"
Cohesion: 0.04
Nodes (51): Settings, Run, Job, WorkerEvent, Phase, Outcome, openBlockWrites(), mapValue() (+43 more)

### Community 246 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 247 - "extrinsics.ts"
Cohesion: 0.29
Nodes (5): ExtrinsicCall, MetadataPallet, RuntimeMetadataView, isCompactU64(), TIMESTAMP

### Community 25 - "validate.ts"
Cohesion: 0.04
Nodes (76): HistoryFinding, plainData, ConfigRule, CursorRule, EntryRef, Finding, Issue, Plain (+68 more)

### Community 26 - "transform-checks.ts"
Cohesion: 0.06
Nodes (57): ManualTimers, Failure, Variant, TapeError, TransformError, scriptedSockets(), turns(), until() (+49 more)

### Community 264 - ".once"
Cohesion: 0.33
Nodes (4): SignalTarget, heldPort(), startChild(), startWorker()

### Community 27 - "spawnChild"
Cohesion: 0.03
Nodes (64): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+56 more)

### Community 28 - "declaration.ts"
Cohesion: 0.04
Nodes (61): BlockHeaderItem, BlockItemSource, CoreBlockHeader, CoreBlockItems, OwnPart, ApiRegistry, BlockContext, DefinedModule (+53 more)

### Community 29 - "changes.property.test.ts"
Cohesion: 0.05
Nodes (73): ChangeKind, tableChanges, TouchedRow, Chain, ChainOptions, DigestRow, Op, States (+65 more)

### Community 3 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (106): InMemoryBlockSource, ProcessHandle, ProcessingEnd, Job, WorkerEvent, A77Observation, A78Observation, A78Refusal (+98 more)

### Community 30 - "BlockRef"
Cohesion: 0.04
Nodes (33): BlockEventSource, BlockLedgerSource, Prefetch, QueuedBlock, ChainCheck, ChainCheckInput, LedgerBinding, RunSeams (+25 more)

### Community 31 - "backup/restore.ts"
Cohesion: 0.06
Nodes (71): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+63 more)

### Community 32 - "ref_node_fs"
Cohesion: 0.04
Nodes (49): PlainDataRule, Row, Finding, Lockfile, Manifest, RepositoryFile, Upstream, ReportedTest (+41 more)

### Community 33 - "config-check.ts"
Cohesion: 0.05
Nodes (61): BackupOutcome, CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, CommandConfig, commandTarget (+53 more)

### Community 34 - "backup-fixtures.ts"
Cohesion: 0.08
Nodes (49): RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, TickerConfig, cliProject, catalogOf(), hashOf() (+41 more)

### Community 35 - "cli/command.ts"
Cohesion: 0.05
Nodes (52): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, CommandResult, CheckTarget, statsConfig (+44 more)

### Community 36 - "write-handles.test.ts"
Cohesion: 0.05
Nodes (50): StartupInput, BlockWrites, Point, WriteHandleOptions, GuardTableRow, BlockOpener, writeHandleClosed(), restoreGrants() (+42 more)

### Community 37 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (53): TransactionHistoryEntry, TransactionHistoryStorage, PgTransactionHistoryStorage, rowToEntry(), reason(), Added, 1. Decisive scope, 2. Live-sync conformance test plan (+45 more)

### Community 38 - "database-fixtures.ts"
Cohesion: 0.05
Nodes (47): Held, PgliteLockUse, Snapshot, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase (+39 more)

### Community 39 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (53): LedgerStateItem, RetainedState, retainedStates, CoreRevision, ContractKeys, workerParser(), applyBlock(), bindCoreLedgerState() (+45 more)

### Community 4 - "opt-out.test.ts"
Cohesion: 0.03
Nodes (104): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure (+96 more)

### Community 40 - "runner/process.ts"
Cohesion: 0.04
Nodes (40): Bound, ChainSource, NodeWait, WaitingListener, CoreVersion, RetryCode, SlowBlockEvent, RetryCondition (+32 more)

### Community 41 - "NodeBlockSource"
Cohesion: 0.06
Nodes (19): HeadWait, NodeBlockSource, QueueRunner, EventsRunner, NoWindow, Refetches, TrustsNotifications, hexOf() (+11 more)

### Community 42 - "column-rules.ts"
Cohesion: 0.04
Nodes (67): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+59 more)

### Community 43 - "core-transport.ts"
Cohesion: 0.06
Nodes (40): PublicSide, Session, TransportLimits, TransportTls, Hello, HelloAck, Read, ReadResult (+32 more)

### Community 44 - "slow-block-harness.ts"
Cohesion: 0.07
Nodes (53): HeightActivity, StatusBody, Validator, Times, Wait, askedSource, BodyRead, HoldMode (+45 more)

### Community 45 - "validation.ts"
Cohesion: 0.04
Nodes (57): CoreLedgerVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+49 more)

### Community 46 - "core-private-source.ts"
Cohesion: 0.07
Nodes (41): ConfiguredGenesis, PrivateBlockSource, PrivateChecks, SourceTransport, PublicConfiguration, PublicDatabase, PublicIdentity, PublicSideOptions (+33 more)

### Community 49 - "admin-harness.ts"
Cohesion: 0.06
Nodes (47): AdminServer, AdminRun, Answered, Answerer, Expected, Hold, Observation, Prober (+39 more)

### Community 5 - "UmbraError"
Cohesion: 0.03
Nodes (89): LoadedConfig, LoadOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresOptions, ReadDatabaseOptions, ConfiguredDatabase (+81 more)

### Community 50 - "worker-storage.test.ts"
Cohesion: 0.07
Nodes (34): StoredNode, OracleState, OracleVersion, StagenetBlockJson, StagenetFixtureJson, Nodes, loadLedgerPackage(), createV8Adapter() (+26 more)

### Community 51 - "intake.test.ts"
Cohesion: 0.08
Nodes (46): PrivateProcess, PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation (+38 more)

### Community 52 - "cbor.ts"
Cohesion: 0.08
Nodes (46): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+38 more)

### Community 53 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+24 more)

### Community 54 - "boundary.test.ts"
Cohesion: 0.08
Nodes (44): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+36 more)

### Community 56 - "contract-data-checks.ts"
Cohesion: 0.09
Nodes (48): CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx (+40 more)

### Community 57 - "core-config.test.ts"
Cohesion: 0.09
Nodes (33): AdminStartOptions, AdminSnapshot, StatusFacts, buildDeclarations(), statusSnapshot(), snapshot(), snapshot(), checked() (+25 more)

### Community 58 - "version"
Cohesion: 0.04
Nodes (47): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+39 more)

### Community 59 - "core-block-parsed.ts"
Cohesion: 0.07
Nodes (46): BodyExtrinsic, BlockBody, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent, EventPhase (+38 more)

### Community 6 - "tape/index.ts"
Cohesion: 0.04
Nodes (93): Link, TapeBuilder, TapeBuilderOptions, CompletenessRange, RecordingError, RecordingProblem, TapeProblem, TransformProblem (+85 more)

### Community 60 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 61 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (35): EntryContent, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, Command (+27 more)

### Community 62 - "ledger-sweep.test.ts"
Cohesion: 0.09
Nodes (26): GreyPicker, GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, Block, MemoryTables (+18 more)

### Community 63 - "lifecycle.test.ts"
Cohesion: 0.09
Nodes (39): coreEntry, versionEntry, Start, Child, startProcess(), adminCore(), adminCoreSettings(), ask() (+31 more)

### Community 64 - "private/backends.ts"
Cohesion: 0.09
Nodes (22): PrivateBackend, SessionSeen, TestCertificates, instancesRun, A112Observation, Wiring, TransportProxy, pgliteBackend() (+14 more)

### Community 65 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.04
Nodes (43): Key, Sql, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap (+35 more)

### Community 67 - "serve.test.ts"
Cohesion: 0.08
Nodes (30): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminView, isMessage(), serveAdmin(), listenError() (+22 more)

### Community 68 - "builds.ts"
Cohesion: 0.08
Nodes (33): AdminStarter, PrivateIntakeOptions, PublicWakes, PrivateOptions, PrivateRefusal, Pause, Q142Observation, SkipsLockstep (+25 more)

### Community 69 - "retirement.test.ts"
Cohesion: 0.07
Nodes (39): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), manifestProblems(), mutationProblems() (+31 more)

### Community 7 - "ledger-storage.test.ts"
Cohesion: 0.04
Nodes (127): MetadataBlock, RuntimeMetadataEntry, BlockHeader, CrashEvent, CrashJob, ingest, IngestOptions, SourceClass (+119 more)

### Community 70 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 73 - "Process"
Cohesion: 0.10
Nodes (8): CoreTransport, StartedModuleApi, Heartbeat, Process, publicLockstepOf(), startModuleApi(), messageOf(), beat()

### Community 74 - "core-settings.ts"
Cohesion: 0.06
Nodes (37): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+29 more)

### Community 76 - "messages.ts"
Cohesion: 0.07
Nodes (33): Committed, MessageFault, Parsed, bytesOf(), decodeParameter(), decodeValue(), describe(), elementType() (+25 more)

### Community 77 - ".concat"
Cohesion: 0.06
Nodes (28): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+20 more)

### Community 78 - "held-height.test.ts"
Cohesion: 0.08
Nodes (33): CommitOutcome, HeldHeight, ProcessStatus, A43Observation, Faults, LostCommit, Outcomes, Seen (+25 more)

### Community 8 - "NodeClient"
Cohesion: 0.04
Nodes (90): NodeSourceOptions, CoreChainBinding, Connection, HeadSubscriber, NodeClient, NodeSubscription, Pending, State (+82 more)

### Community 80 - "net.test.ts"
Cohesion: 0.09
Nodes (21): IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade, RawData (+13 more)

### Community 81 - "admin/types.ts"
Cohesion: 0.08
Nodes (30): adminRoutes, AdminAnswer, AdminEndpoint, AdminPart, ChainView, DeclarationView, InstanceStatus, ItemView (+22 more)

### Community 83 - "tape/command.ts"
Cohesion: 0.09
Nodes (34): Write, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, TapeCommandIo, isPositive() (+26 more)

### Community 84 - "transport-faults.test.ts"
Cohesion: 0.10
Nodes (27): Message, MessageType, Ended, rawClient, endedWithin(), hello(), tlsProblems(), blockHash() (+19 more)

### Community 86 - "networks.ts"
Cohesion: 0.07
Nodes (34): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+26 more)

### Community 88 - "ModuleDeclaration"
Cohesion: 0.09
Nodes (14): ModuleDeclaration, MisuseReports, ProcessContexts, ProcessContextsInput, ProcessItems, PublishRefusal, AdminRunOptions, TestBuildOptions (+6 more)

### Community 89 - "mapping.ts"
Cohesion: 0.09
Nodes (33): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+25 more)

### Community 9 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (118): BlockParsed, ProcessCondition, itemsSeen, EventSpec, Scenario, ArgType, BlockOptions, CallSpec (+110 more)

### Community 90 - "T"
Cohesion: 0.06
Nodes (36): Absent, n(), T(), input(), 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 4. Transaction / Lease — the control algebra the other three run inside, 5. Testable-law deliverable (fast-check + Vitest) (+28 more)

### Community 92 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (25): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue() (+17 more)

### Community 94 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 95 - "sweep-tapes.ts"
Cohesion: 0.13
Nodes (31): TableSnapshot, FixtureNode, coreLedgerState(), coreWith(), hex(), insertionOrder(), firstVersion(), hex() (+23 more)

### Community 96 - "referenceMergeEntries"
Cohesion: 0.07
Nodes (28): MergeEntriesFn, isPlainObject(), mergeSections(), referenceMergeEntries(), CheckpointStore tables, `kv_current` / `kv_history` — TemporalKV, tier1_wallet lineage, `transaction_history` (+20 more)

### Community 99 - "crash.test.ts"
Cohesion: 0.10
Nodes (24): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+16 more)

### Community 151 - "UmbraDB module guide"
Cohesion: 0.10
Nodes (19): Blocks from the node, Contract states and contract logs, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Private modules, Reading through `db`, Running a module with the `umbradb` command (+11 more)

### Community 234 - ".position"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 104 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.13
Nodes (18): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), registerSuiteLifecycle(), startTestDatabase(), registerSuiteLifecycle(), startTestDatabase() (+10 more)

### Community 108 - "refused"
Cohesion: 0.07
Nodes (28): refused(), When a callback fails, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked (+20 more)

### Community 146 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.09
Nodes (18): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+10 more)

### Community 147 - "decode"
Cohesion: 0.11
Nodes (20): decode(), Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Scenario: A future-versioned envelope is rejected cleanly, Scenario: An unknown top-level field is rejected as a typed envelope error (F7), Scenario: Non-JSON bytes are rejected as a typed envelope error, Scenario: Structurally invalid JSON is rejected as a typed envelope error, 0. Specification freeze (+12 more)

### Community 158 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (17): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface (+9 more)

### Community 162 - "migrations"
Cohesion: 0.11
Nodes (16): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Migrations, 6. Storage helpers, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes (+8 more)

### Community 178 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 183 - "fault"
Cohesion: 0.14
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 195 - "Full-Chain Storage"
Cohesion: 0.17
Nodes (11): store(), 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 3. Semantic decode: `chain-archive-sync/tx-replay-decoder.ts`, 4. How to run it (+3 more)

### Community 197 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 205 - ".slowBlockMs"
Cohesion: 0.22
Nodes (9): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 16. Whole system, 5. Runner, Requirement: RN-17 A slow block is reported, never cut off, Scenario: A slow callback (+1 more)

### Community 209 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 212 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 227 - "test-processes.test.ts"
Cohesion: 0.28
Nodes (7): namesRunner(), runnerStarts(), sources(), valueNames(), REPOSITORY, RUNNER, TESTS

### Community 228 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 233 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 236 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 265 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 299 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 300 - "leanProblems"
Cohesion: 0.50
Nodes (4): leanImports(), leanProblems(), leanTheorems(), retiredLean()

### Community 47 - ".put"
Cohesion: 0.04
Nodes (58): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+50 more)

### Community 48 - "history"
Cohesion: 0.05
Nodes (54): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+46 more)

### Community 55 - "fn"
Cohesion: 0.04
Nodes (51): fn(), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly (+43 more)

### Community 79 - "core-private-source.test.ts"
Cohesion: 0.06
Nodes (13): privateBackbone(), height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), identity() (+5 more)

### Community 87 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 98 - "code"
Cohesion: 0.08
Nodes (30): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21), The catalog, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog (+22 more)

### Community 101 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (30): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+22 more)

### Community 102 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.06
Nodes (31): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+23 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 130 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 133 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.08
Nodes (18): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Superseded — see `Formal/STORAGE_ALGEBRA.md`, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan (+10 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence (+17 more)

### Community 137 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 139 - "ROADMAP.md"
Cohesion: 0.08
Nodes (18): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+10 more)

### Community 140 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 152 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric` (+12 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: one storage instance is bound to exactly one wallet at construction, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+11 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 160 - "README.md"
Cohesion: 0.17
Nodes (9): 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented), Summary, UmbraDB Durability Contract, Generate your local wallet, Test wallets (+1 more)

### Community 163 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.11
Nodes (16): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+8 more)

### Community 164 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 165 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 166 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (17): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+9 more)

### Community 167 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 169 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 170 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 175 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 184 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 185 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 186 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.14
Nodes (13): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 3.1 The frozen catalog (the machine-facing API), 3.2 Promote retryability to a machine-readable field, 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+5 more)

### Community 189 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 190 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 191 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 193 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 196 - "chain_archive lineage"
Cohesion: 0.17
Nodes (12): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, How the two lineages coexist, Partition rollover design (+4 more)

### Community 198 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 199 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 2. `set`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 202 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 203 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 204 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 206 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 207 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 211 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 213 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 214 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 215 - "Tasks — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 1. Pre-freeze: retryability field (G3), 2. Pre-freeze: strip / mark-experimental the chain-archive error classes (G3), 3. The freeze: build + package.json (G1), 4. The freeze: the public barrel (G1), 5. Release contract docs (G2, G4), 6. Freeze the Lean cut-line (G20), 7. Packed-tarball install smoke test (G1), 8. Change close-out (+1 more)

### Community 216 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 217 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 218 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 221 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 222 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 223 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 224 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 225 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 226 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 229 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 230 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 231 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.25
Nodes (8): 1. Durability contract, 3. Cancellation semantics, 4. Save-retry caveat, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 232 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 235 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 237 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 238 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 239 - "Backups"
Cohesion: 0.29
Nodes (6): A backup at the core's stop, Backups, Restoring a backup, UmbraDB operator guide, What a backup holds, Writing a backup

### Community 240 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 241 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 242 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 243 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 244 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 245 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 249 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 250 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 251 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 252 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 253 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 254 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 255 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 256 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 257 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 258 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 259 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 260 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 261 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 262 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 263 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 266 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 267 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 268 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 269 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 270 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 271 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 272 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 273 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 274 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 275 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 276 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 277 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 278 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 279 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 280 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 281 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.40
Nodes (4): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Suggested fix

### Community 282 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 283 - "00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`"
Cohesion: 0.40
Nodes (4): 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 284 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 285 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 286 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 287 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 288 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 290 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 291 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 292 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 293 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 294 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 295 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 296 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 297 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 305 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 306 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 66 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 82 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points (+24 more)

## Knowledge Gaps
- **53 isolated node(s):** `RFC-3339`, `RFC-8785`, `RFC-8785`, `RFC-3339`, `RFC-3339` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3583 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `Database`, `range.test.ts`, `api-server.test.ts`, `chain-process.test.ts`, `opt-out.test.ts`, `UmbraError`, `tape/index.ts`, `ledger-storage.test.ts`, `NodeClient`, `fetch-fixtures.ts`, `db/api.ts`, `config/history.ts`, `client.test.ts`, `.from`, `loop.ts`, `migrate.ts`, `contract-modules.test.ts`, `roles.ts`, `adapter-fixtures.ts`, `host.ts`, `process-admin.ts`, `ledger-tapes.ts`, `validate.ts`, `transform-checks.ts`, `spawnChild`, `declaration.ts`, `changes.property.test.ts`, `BlockRef`, `backup/restore.ts`, `ref_node_fs`, `config-check.ts`, `backup-fixtures.ts`, `cli/command.ts`, `write-handles.test.ts`, `database-fixtures.ts`, `core-ledger-state.ts`, `runner/process.ts`, `NodeBlockSource`, `core-transport.ts`, `slow-block-harness.ts`, `validation.ts`, `admin-harness.ts`, `worker-storage.test.ts`, `intake.test.ts`, `column-rules.test.ts`, `boundary.test.ts`, `contract-data-checks.ts`, `core-config.test.ts`, `core-block-parsed.ts`, `interfaces/transaction-history-storage.ts`, `ledger-sweep.test.ts`, `lifecycle.test.ts`, `private/backends.ts`, `serve.test.ts`, `builds.ts`, `retirement.test.ts`, `core-settings.ts`, `messages.ts`, `held-height.test.ts`, `core-private-source.test.ts`, `net.test.ts`, `admin/types.ts`, `transport-faults.test.ts`, `networks.ts`, `pg-tx-history-adapter.ts`, `cbor.property.test.ts`, `sweep-tapes.ts`, `crash.test.ts`, `refused-configuration.test.ts`, `postgres/transaction-history-storage.ts`, `cold-boot-recovery.integration.test.ts`, `readiness.test.ts`, `binding.test.ts`, `browser/build.ts`, `Lockstep`, `test/postgres/setup.ts`, `node-format.ts`, `core-block-commit.test.ts`, `version-checks.ts`, `vendored-ledger-v9.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `height-versioned.property.test.ts`, `browser.test.ts`, `describeNodeStoreExports`, `process-worker.ts`, `code-registry.ts`, `package.json`, `ledger-table-config.test.ts`, `plain-data.ts`, `type-check.ts`, `ws-mutual-tls.test.ts`, `node-bridge.ts`, `block-fetch-decode.test.ts`, `key-handling-checks.ts`, `lockstep-refusals.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `private/lockstep-wait.test.ts`, `web-lock.ts`, `excluded-not-exported.test.ts`, `worker-threads.test.ts`, `facade-merge-loader.ts`, `test-processes.test.ts`?**
  _High betweenness centrality (0.240) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8785`, `RFC-8785` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.02274672862908157 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `Database`, `api-server.test.ts`, `chain-process.test.ts`, `plain-data.ts`, `opt-out.test.ts`, `ledger-table-config.test.ts`, `ledger-storage.test.ts`, `NodeClient`, `fetch-fixtures.ts`, `db/api.ts`, `config/history.ts`, `client.test.ts`, `tape/index.ts`, `loop.ts`, `migrate.ts`, `contract-modules.test.ts`, `roles.ts`, `FinalizedLoop`, `LedgerPackage`, `version-table.ts`, `process-admin.ts`, `vitest`, `validate.ts`, `UmbraDB module guide`, `transform-checks.ts`, `declaration.ts`, `changes.property.test.ts`, `BlockRef`, `backup/restore.ts`, `ref_node_fs`, `config-check.ts`, `lockstep-refusals.test.ts`, `write-handles.test.ts`, `database-fixtures.ts`, `core-ledger-state.ts`, `runner/process.ts`, `NodeBlockSource`, `core-transport.ts`, `statementsOf`, `slow-block-harness.ts`, `core-private-source.ts`, `validation.ts`, `checkShape`, `cbor.ts`, `web-lock.ts`, `graph.ts`, `builds.ts`, `identity.ts`, `held-height.test.ts`, `core-private-source.test.ts`, `sha256`, `transport-faults.test.ts`, `ModuleDeclaration`, `mapping.ts`, `RuntimeMetadata`, `refused-configuration.test.ts`, `readiness.test.ts`, `binding.test.ts`, `core-block-commit.test.ts`, `version-checks.ts`, `process-worker.ts`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `range.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020161514898357005 - nodes in this community are weakly interconnected._