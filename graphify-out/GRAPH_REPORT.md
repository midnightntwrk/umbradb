# Graph Report - UmbraDB

## Corpus Check
- 1023 files · ~1,509,915 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10872 nodes · 32144 edges · 335 communities (304 shown, 31 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2623 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `dd623dc9e59aa88d` (1023 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- api-server.test.ts
- loop-stop-harness.ts
- column-rules.ts
- process-worker.ts
- ref_node_fs
- node-source.ts
- page.ts
- vitest
- cbor.property.test.ts
- browser.test.ts
- admin-harness.ts
- run.test.ts
- 12. Exported surface and command (LS-1, LS-6)
- post-block-update-checks.ts
- height-versioned.test.ts
- Process
- config/plain-data.test.ts
- code-registry.ts
- binding.test.ts
- browser/build.ts
- order.property.test.ts
- node-format.ts
- type-check.ts
- readiness.test.ts
- version-table.ts
- Lockstep
- test/postgres/setup.ts
- runner/process.ts
- crash.test.ts
- restore-private.ts
- relays.ts
- Buffer
- pg-tx-history-adapter.ts
- ref_node_child_process
- ledger-tapes.ts
- BlockRef
- check-required-tests.ts
- legacy-excluded.test.ts
- .concat
- ws-mutual-tls.test.ts
- node-bridge.ts
- ledger/metadata.ts
- refused-configuration.test.ts
- height-versioned.property.test.ts
- worker-threads.test.ts
- Design — Sprint 1: project setup + TemporalKV
- config-check-database.test.ts
- block-fetch-decode.test.ts
- core-transport.ts
- fixtures/configuration.ts
- pglite-outside-reads.ts
- checks.test.ts
- FinalizedLoop
- node-store-suite.ts
- describeNodeStoreExports
- checkShape
- declaration.ts
- package-identity.test.ts
- validation.test.ts
- statementsOf
- ChromeTab
- UmbraError
- browser-harness.ts
- chrome.ts
- web-lock.ts
- items.ts
- tape/index.ts
- adapter-fixtures.ts
- node-run.ts
- lockstep-reads.test.ts
- Worker
- InMemoryBlockSource
- blobText
- ledger/plain-data.test.ts
- TapeAnswers
- sha256
- client.test.ts
- config/history.ts
- stats.ts
- page-server.ts
- adapter.ts
- transform-checks.ts
- mutation-evidence.d.mts
- lockstep-refusals.test.ts
- AsyncLocalStorage
- src/db/postgres.ts
- db/backends.ts
- private/backends.ts
- EventsRunner
- node-fields-harness.ts
- validate.ts
- https.ts
- NodeFS
- chain-process.test.ts
- TickerProcess
- contract-modules.test.ts
- spawnChild
- LedgerPackage
- db/errors.ts
- module-tables.ts
- loop.ts
- backup-fixtures.ts
- .from
- history.test.ts
- process-backends.ts
- core-ledger-state.ts
- changes.property.test.ts
- interfaces/transaction-history-storage.ts
- PgTransactionHistoryStorage
- ledger-sweep.test.ts
- chain-events-source.test.ts
- code
- contract-data-checks.ts
- ingest-harness.ts
- backup/restore.ts
- host.ts
- ledger/types.ts
- mapping.ts
- backup/backup.ts
- ref_node_crypto
- db/api.ts
- writer-lock-checks.ts
- api-timeouts.test.ts
- 12. Ledger
- slow-block-harness.ts
- migrate.ts
- cli/command.ts
- range.ts
- cbor.ts
- net.test.ts
- ledger-storage.test.ts
- process-context.test.ts
- transaction-history-storage.property.test.ts
- cold-boot-recovery.integration.test.ts
- builder.test.ts
- graph.ts
- NodeBlockSource
- boundary.test.ts
- opt-out.test.ts
- .value
- transport-faults.test.ts
- retirement.test.ts
- NodeClient
- chain-events-decode.test.ts
- core-settings.ts
- cursor-harness.ts
- ledger/ledger-tasks.test.ts
- ledger-tasks-checks.ts
- version
- admin/configuration.ts
- core-block-commit.test.ts
- version-checks.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- networks.ts
- release-version.test.ts
- 3. Block source and ingest
- Design — Sprint 3: CheckpointStore
- graph.py
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- T
- vendored-ledger-v9.test.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- .boolean
- .read
- .slowBlockMs
- integer
- mutation-per-adapter.mjs
- attempt
- ADDED Requirements
- twox.ts
- scoped-review-manifest
- path.ts
- Performance — design
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- continueTo
- history
- fn
- table
- core-block-parsed.ts
- .put
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- UmbraDB
- stryker.conf.json
- chain_archive lineage
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- Storage Layer Interface Specification
- Roadmap
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- Design — Sprint 4: Watermarks
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- explore.md
- Full-Chain Storage
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Security policy & threat model
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Design — Sprint 2: Transaction/Lease
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Scalability ceilings (v1.0.0)
- Changelog
- Contributing
- Checkpoint-store composition contract — cursor ordering and replay
- Storage Algebra Lean M3a Watermarks Sprint
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- UmbraDB Durability Contract
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
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
- Midnight Foundation Security Policy
- lib.sh
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- bug-report.md
- feature-request.md
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
- README.md
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 326 edges
2. `UmbraError` - 302 edges
3. `ModuleDeclaration` - 172 edges
4. `FinalizedLoop` - 120 edges
5. `NodeClient` - 113 edges
6. `InMemoryBlockSource` - 105 edges
7. `Database` - 97 edges
8. `BlockRef` - 94 edges
9. `ReadHandle` - 85 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (335 total, 31 thin omitted)

### Community 0 - "api-server.test.ts"
Cohesion: 0.02
Nodes (121): ModuleApiServer, ModuleApiStart, StartedModuleApi, ReadHandle, ApiRegistry, PointCallbacks, Connection, HeadersArgument (+113 more)

### Community 1 - "loop-stop-harness.ts"
Cohesion: 0.03
Nodes (124): versionEntry, ProcessReason, ProcessHandle, ProcessStatus, A43Observation, Outcome, A169Observation, LoopStopScenario (+116 more)

### Community 10 - "column-rules.ts"
Cohesion: 0.02
Nodes (101): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+93 more)

### Community 101 - "process-worker.ts"
Cohesion: 0.10
Nodes (25): BrowserRun, PrivateInstance, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, openedProcess (+17 more)

### Community 102 - "ref_node_fs"
Cohesion: 0.08
Nodes (26): ProcessObservation, Upstream, committedIn(), processOn(), processProblems(), rowsIn(), runConfigText(), filesUnder() (+18 more)

### Community 104 - "node-source.ts"
Cohesion: 0.08
Nodes (19): BlockEventSource, BlockLedgerSource, Prefetch, QueuedBlock, LedgerBinding, NodeSubscription, NodeBlock, BlockItems (+11 more)

### Community 105 - "page.ts"
Cohesion: 0.07
Nodes (29): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog(), backUp() (+21 more)

### Community 106 - "vitest"
Cohesion: 0.07
Nodes (19): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), settings, OWN_FILES (+11 more)

### Community 108 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 109 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 11 - "admin-harness.ts"
Cohesion: 0.04
Nodes (88): PrivateSideFacts, ProcessAdminOptions, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer (+80 more)

### Community 110 - "run.test.ts"
Cohesion: 0.10
Nodes (24): RunningCommand, statsConfig, inProcess(), check(), check(), write(), adminPortIn(), chainNode() (+16 more)

### Community 111 - "12. Exported surface and command (LS-1, LS-6)"
Cohesion: 0.09
Nodes (26): UmbraConfig, FieldKind, FieldSchema, ItemDeclaration, ItemSink, Lifetime, ProcessContext, RangeCheck (+18 more)

### Community 112 - "post-block-update-checks.ts"
Cohesion: 0.12
Nodes (30): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+22 more)

### Community 113 - "height-versioned.test.ts"
Cohesion: 0.09
Nodes (20): heightVersionedTable, HeightVersionedTableOptions, BlockContext, Control, BlockFails, Height, checkName(), migrationSql() (+12 more)

### Community 114 - "Process"
Cohesion: 0.13
Nodes (5): CoreTransport, Process, messageOf(), nodeClientClosed(), pause()

### Community 116 - "config/plain-data.test.ts"
Cohesion: 0.08
Nodes (20): LoadOptions, PlainDataRule, Row, invalid(), isFile(), loadConfig(), modulesOf(), failures() (+12 more)

### Community 117 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 118 - "binding.test.ts"
Cohesion: 0.12
Nodes (28): A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), contentsOf(), cursorOf() (+20 more)

### Community 119 - "browser/build.ts"
Cohesion: 0.09
Nodes (24): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+16 more)

### Community 12 - "order.property.test.ts"
Cohesion: 0.03
Nodes (99): GraphInput, PointArguments, PointRun, PastFaultCase, RefusalCase, CallEvent, Recorder, CheckName (+91 more)

### Community 123 - "node-format.ts"
Cohesion: 0.15
Nodes (20): Child, Reader, Readable, TableNode, node(), childKey(), concat(), decodeChild() (+12 more)

### Community 124 - "type-check.ts"
Cohesion: 0.10
Nodes (18): TypeCheckFinding, TypeCheckResult, Finding, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile() (+10 more)

### Community 126 - "readiness.test.ts"
Cohesion: 0.11
Nodes (21): ReadinessFacts, ProcessState, gate, Decision, ReadinessCase, readinessOf(), ae4(), caseText() (+13 more)

### Community 127 - "version-table.ts"
Cohesion: 0.12
Nodes (28): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, BoundaryBlockReading, BoundaryOptions, BoundaryReading (+20 more)

### Community 128 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 129 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 13 - "runner/process.ts"
Cohesion: 0.03
Nodes (81): OpenedFacts, Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, CoreChainFacts, NodeWait, WaitingListener (+73 more)

### Community 133 - "crash.test.ts"
Cohesion: 0.12
Nodes (22): CrashCall, CrashEvent, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule(), hex() (+14 more)

### Community 134 - "restore-private.ts"
Cohesion: 0.15
Nodes (23): FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, privateConfig(), heightsFrom() (+15 more)

### Community 135 - "relays.ts"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 136 - "Buffer"
Cohesion: 0.10
Nodes (18): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+10 more)

### Community 137 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 139 - "ref_node_child_process"
Cohesion: 0.11
Nodes (21): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), end(), removeContainers(), dockerIndependentOracles(), fail() (+13 more)

### Community 14 - "ledger-tapes.ts"
Cohesion: 0.05
Nodes (98): BlockParsed, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime (+90 more)

### Community 140 - "BlockRef"
Cohesion: 0.13
Nodes (7): BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, failingSource(), flakySource()

### Community 141 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 142 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 143 - ".concat"
Cohesion: 0.10
Nodes (15): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+7 more)

### Community 145 - "ws-mutual-tls.test.ts"
Cohesion: 0.10
Nodes (20): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+12 more)

### Community 146 - "node-bridge.ts"
Cohesion: 0.12
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 148 - "ledger/metadata.ts"
Cohesion: 0.12
Nodes (10): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, MetadataSelector, OwnStateMetadata, contentStateOf() (+2 more)

### Community 15 - "refused-configuration.test.ts"
Cohesion: 0.04
Nodes (93): ProcessConfig, AdminRun, Answered, Observation, Start, Child, Refusal, Start (+85 more)

### Community 150 - "height-versioned.property.test.ts"
Cohesion: 0.16
Nodes (17): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+9 more)

### Community 151 - "worker-threads.test.ts"
Cohesion: 0.09
Nodes (13): Listener, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread, parentPort (+5 more)

### Community 154 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.09
Nodes (22): Key, Sql, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap (+14 more)

### Community 155 - "config-check-database.test.ts"
Cohesion: 0.14
Nodes (17): CheckStep, ConfigCheckReport, configCheck(), configText(), coreSettings(), inChild(), lineOf(), treeOf() (+9 more)

### Community 159 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+9 more)

### Community 16 - "core-transport.ts"
Cohesion: 0.04
Nodes (74): PublicSide, Session, TransportLimits, TransportTls, Committed, Hello, HelloAck, JsonValue (+66 more)

### Community 161 - "fixtures/configuration.ts"
Cohesion: 0.14
Nodes (16): BrowserConfiguration, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration(), param(), privateConfiguration() (+8 more)

### Community 162 - "pglite-outside-reads.ts"
Cohesion: 0.17
Nodes (13): LoadOutcome, OutsideRead, Traced, PgliteTestDatabase, PgliteTestServer, pgliteBackend(), expectNoOutsideReads(), outsideReads() (+5 more)

### Community 166 - "checks.test.ts"
Cohesion: 0.13
Nodes (11): Case, checkFunctionsSql(), numericOkPredicate(), refusedNumbersPath(), outcome(), started(), verdicts(), write() (+3 more)

### Community 17 - "FinalizedLoop"
Cohesion: 0.04
Nodes (29): EntryBoundary, Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, Startup, SkipsAfterReconnect (+21 more)

### Community 171 - "node-store-suite.ts"
Cohesion: 0.14
Nodes (14): FreshInstanceRequest, FreshInstanceResult, StoredNode, Disposable, NodeBatch, NodeRoot, runInFreshInstance(), hasEmbeddedChild() (+6 more)

### Community 172 - "describeNodeStoreExports"
Cohesion: 0.20
Nodes (3): NodeStoreExports, NodeStoreSubject, describeNodeStoreExports()

### Community 176 - "checkShape"
Cohesion: 0.31
Nodes (9): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+1 more)

### Community 18 - "declaration.ts"
Cohesion: 0.04
Nodes (73): AdminStartOptions, privateIntake, CommandBuildOptions, RunOptions, SignalSource, stopSignal, coreEntry, DefinedModule (+65 more)

### Community 180 - "package-identity.test.ts"
Cohesion: 0.22
Nodes (14): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+6 more)

### Community 181 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 186 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 19 - "UmbraError"
Cohesion: 0.04
Nodes (63): LoadedConfig, LoadOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresOptions, ReadDatabaseOptions, ConfiguredDatabase (+55 more)

### Community 190 - "browser-harness.ts"
Cohesion: 0.27
Nodes (13): ProcessName, backupThrough(), call(), eventsOf(), eventWhen(), logOf(), pageWhen(), restoreThrough() (+5 more)

### Community 191 - "chrome.ts"
Cohesion: 0.23
Nodes (11): Cdp, CdpEvent, Download, PageRequest, chrome(), chrome(), chromePath(), chromeVersion() (+3 more)

### Community 192 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 197 - "items.ts"
Cohesion: 0.19
Nodes (11): BlockHeaderItem, BodyExtrinsic, ExtrinsicCall, BlockBody, CoreBlockHeader, CoreBlockItems, MetadataPallet, callOf() (+3 more)

### Community 2 - "tape/index.ts"
Cohesion: 0.04
Nodes (104): Recorded, Failure, Variant, Failure, Variant, Link, TapeBuilderOptions, RecordingError (+96 more)

### Community 20 - "adapter-fixtures.ts"
Cohesion: 0.06
Nodes (72): StoredNode, Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerAnswer, AdapterWorkerHost (+64 more)

### Community 200 - "node-run.ts"
Cohesion: 0.24
Nodes (10): NodeRunResult, createReadStream(), nodeSourceOf(), buildDeclarations(), commandBuild(), processOf(), hex(), nodeRun() (+2 more)

### Community 205 - "lockstep-reads.test.ts"
Cohesion: 0.22
Nodes (9): Pause, Q142Observation, SkipsLockstep, PRIVATE_ROWS_SQL(), pauseGate(), pausing(), q142Run(), until() (+1 more)

### Community 21 - "InMemoryBlockSource"
Cohesion: 0.04
Nodes (67): InMemoryBlockSource, CommitOutcome, HeldHeight, LockstepWait, LoopEnd, Failing, Contexts, Faults (+59 more)

### Community 214 - "blobText"
Cohesion: 0.24
Nodes (7): BackupText, blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), 9.2 Browser build (BR), 9. Backups and browser

### Community 217 - "ledger/plain-data.test.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 218 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 219 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 22 - "client.test.ts"
Cohesion: 0.03
Nodes (53): Connection, NodeClientOptions, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure, HandSocket, HandSockets (+45 more)

### Community 23 - "config/history.ts"
Cohesion: 0.04
Nodes (81): CoreLedgerVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettingsBase, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+73 more)

### Community 231 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 232 - "page-server.ts"
Cohesion: 0.28
Nodes (6): BrowserBuild, pageBench, PageServer, servePage(), ISOLATION_HEADERS, TYPES

### Community 24 - "adapter.ts"
Cohesion: 0.04
Nodes (73): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+65 more)

### Community 25 - "transform-checks.ts"
Cohesion: 0.04
Nodes (62): Metadata, Step, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+54 more)

### Community 259 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "lockstep-refusals.test.ts"
Cohesion: 0.05
Nodes (76): LockstepCondition, PrivateProcess, PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals (+68 more)

### Community 27 - "src/db/postgres.ts"
Cohesion: 0.04
Nodes (56): BenchEnv, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, BoundedRead, DriverError, Outcome (+48 more)

### Community 28 - "db/backends.ts"
Cohesion: 0.04
Nodes (66): SchemaPlan, ChainOptions, Settings, TestDatabase, Case, Run, Job, WorkerEvent (+58 more)

### Community 29 - "private/backends.ts"
Cohesion: 0.04
Nodes (60): startHashDecision, A165Options, a165Run, Attempt, PrivateBackend, SessionSeen, TestDatabase, PrivateOptions (+52 more)

### Community 3 - "node-fields-harness.ts"
Cohesion: 0.03
Nodes (113): LateUse, ProcessCondition, A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader (+105 more)

### Community 30 - "validate.ts"
Cohesion: 0.04
Nodes (74): Entry, HistoryFinding, ConfigRule, CursorRule, EntryRef, EntryView, Finding, Issue (+66 more)

### Community 31 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (58): BlockItemSource, InMemoryItems, Wait, StandInOptions, Job, WorkerEvent, ChainBuildOptions, A77Observation (+50 more)

### Community 32 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (60): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+52 more)

### Community 33 - "spawnChild"
Cohesion: 0.04
Nodes (60): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+52 more)

### Community 34 - "LedgerPackage"
Cohesion: 0.06
Nodes (32): LedgerEventKind, LedgerPackage, LedgerTaskBlock, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, stagenetReplay (+24 more)

### Community 35 - "db/errors.ts"
Cohesion: 0.05
Nodes (47): BackupFacts, DumpInput, ConfigFinding, ReadTimeoutSetting, exclusiveJob, GuardTableRow, ErrorCode, ErrorDetails (+39 more)

### Community 36 - "module-tables.ts"
Cohesion: 0.07
Nodes (50): ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, ConsistentRead, ColumnType (+42 more)

### Community 37 - "loop.ts"
Cohesion: 0.06
Nodes (56): PointName, HeightRange, Callback, CallbackFailure, ParallelPoint, PointSchedule, ReasonCode, Unwrapped (+48 more)

### Community 38 - "backup-fixtures.ts"
Cohesion: 0.09
Nodes (45): BackupBackend, BackupDatabase, killedRestore, TickerConfig, cliProject, isEmptyDatabase(), withNodeRoot(), catalogOf() (+37 more)

### Community 39 - ".from"
Cohesion: 0.05
Nodes (59): NodeDatabase, SentParses, recordedGenesis, Side, FoundTape, hexOf(), startLedgerWorker(), hexOf() (+51 more)

### Community 4 - "history.test.ts"
Cohesion: 0.03
Nodes (107): CoreVersion, CoreSettings, HistoryRule, AppliedMigration, ProcessContexts, ProcessItems, UpgradeEntry, Committed (+99 more)

### Community 40 - "process-backends.ts"
Cohesion: 0.08
Nodes (56): FixtureRun, ingest, TableSnapshot, FixtureNode, FakeState, RefusalData, run(), a168Problems() (+48 more)

### Community 41 - "core-ledger-state.ts"
Cohesion: 0.06
Nodes (55): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions, blockHeaderOf(), chainEventsItemOf(), applyBlock() (+47 more)

### Community 42 - "changes.property.test.ts"
Cohesion: 0.06
Nodes (60): Chain, DigestRow, Op, States, TableName, shadowTableName(), hex(), moduleM() (+52 more)

### Community 43 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.04
Nodes (46): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+38 more)

### Community 44 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (58): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order) (+50 more)

### Community 45 - "ledger-sweep.test.ts"
Cohesion: 0.06
Nodes (32): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, ChildReader, Block, MemoryTables (+24 more)

### Community 46 - "chain-events-source.test.ts"
Cohesion: 0.05
Nodes (37): NodeCallOptions, ConnectSocket, RecordingClient, Outage, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault (+29 more)

### Community 47 - "code"
Cohesion: 0.04
Nodes (61): Migration, up(), code(), name, 2. Forward-only / no-downgrade migration contract, `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21) (+53 more)

### Community 48 - "contract-data-checks.ts"
Cohesion: 0.08
Nodes (58): ContractStateRow, CoreContractStatesOptions, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+50 more)

### Community 49 - "ingest-harness.ts"
Cohesion: 0.07
Nodes (51): Manifest, Restored, BlockHeader, IngestOptions, SourceClass, watched, Call, RestartEvent (+43 more)

### Community 5 - "backup/restore.ts"
Cohesion: 0.03
Nodes (79): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport (+71 more)

### Community 50 - "host.ts"
Cohesion: 0.07
Nodes (49): LoadLedger, TransactionParser, LedgerStateItem, LedgerName, ChainOutcome, NodeBatch, ParsedTransaction, AppliedState (+41 more)

### Community 51 - "ledger/types.ts"
Cohesion: 0.07
Nodes (40): LedgerReleasePackage, ApplyInput, ApplyOutput, LedgerPackageOptions, StateSummary, V9Logs, LedgerHeight, LoadAdapter (+32 more)

### Community 52 - "mapping.ts"
Cohesion: 0.06
Nodes (41): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+33 more)

### Community 53 - "backup/backup.ts"
Cohesion: 0.06
Nodes (48): BackupInput, BackupSeams, BackupTarget, BackupWritten, ManifestHistoryRow, ManifestMigration, ManifestTool, PgliteDump (+40 more)

### Community 54 - "ref_node_crypto"
Cohesion: 0.06
Nodes (48): CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow, CheckFunctionsOptions, IntegerCheckRow (+40 more)

### Community 55 - "db/api.ts"
Cohesion: 0.06
Nodes (36): BlockWriteHandle, Database, ReadOnlyDatabase, ReadOptions, SchemaWriteHandle, Transaction, BlockWrites, Point (+28 more)

### Community 56 - "writer-lock-checks.ts"
Cohesion: 0.08
Nodes (43): WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), blocksIn(), cleanUp() (+35 more)

### Community 57 - "api-timeouts.test.ts"
Cohesion: 0.04
Nodes (37): CheckTarget, CliBackend, Snapshot, PostgresTestServer, Report, Job, Seen, cursorHeight() (+29 more)

### Community 58 - "12. Ledger"
Cohesion: 0.07
Nodes (32): RetainedState, EvictionRefused, LedgerHost, LedgerWorkerFailure, NodeReader, workerParser(), isEvictionRefused(), errorOf() (+24 more)

### Community 59 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (46): ReadOpener, SlowWindow, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+38 more)

### Community 6 - "migrate.ts"
Cohesion: 0.03
Nodes (102): AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner, Difference, OwnPart (+94 more)

### Community 60 - "cli/command.ts"
Cohesion: 0.07
Nodes (44): RestoreChain, RestoreSeams, BackupOutcome, CommandHandler, CommandIo, MainProcess, commandTarget, Chain (+36 more)

### Community 61 - "range.ts"
Cohesion: 0.05
Nodes (43): TapeBuilder, Arguments, Command, CompletenessRange, Final, Height, RangeRecording, RangeStats (+35 more)

### Community 62 - "cbor.ts"
Cohesion: 0.08
Nodes (45): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+37 more)

### Community 63 - "net.test.ts"
Cohesion: 0.07
Nodes (24): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortSocket (+16 more)

### Community 66 - "ledger-storage.test.ts"
Cohesion: 0.08
Nodes (41): SeenLoad, retentionSeen, ledgerScenario, LedgerTx, Reader, ProcessDatabase, retainedStatesOf(), heightsIn() (+33 more)

### Community 67 - "process-context.test.ts"
Cohesion: 0.07
Nodes (36): Revision, ResolvedGraph, StartedModuleApi, MisuseListener, MisuseReports, ProcessContextsInput, PublishRefusal, RunnerBackend (+28 more)

### Community 68 - "transaction-history-storage.property.test.ts"
Cohesion: 0.06
Nodes (27): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, ReplayableStorage, capitalize(), abortErrorLike(), capitalize(), applyCommand() (+19 more)

### Community 69 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (32): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+24 more)

### Community 7 - "builder.test.ts"
Cohesion: 0.03
Nodes (55): Answer, FakeNode, Handler, Received, recorded, ConnectionFrames, Failure, Variant (+47 more)

### Community 70 - "graph.ts"
Cohesion: 0.07
Nodes (49): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts (+41 more)

### Community 72 - "NodeBlockSource"
Cohesion: 0.10
Nodes (11): HeadWait, NodeBlockSource, NodeHeader, QueueRunner, NoWindow, Refetches, TrustsNotifications, hexOf() (+3 more)

### Community 73 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 74 - "opt-out.test.ts"
Cohesion: 0.07
Nodes (27): CheckedMigration, PlacedRefusal, Refusal, refuseNonDeterministic(), catalogRelations(), catalogTables(), schemaFilter(), tableId() (+19 more)

### Community 75 - ".value"
Cohesion: 0.14
Nodes (24): MetadataStorage, MetadataStorageEntry, MetadataType, TypeDef, ScaleError, ScaleReader, ValueReader, blockTimeOf() (+16 more)

### Community 77 - "transport-faults.test.ts"
Cohesion: 0.08
Nodes (32): Message, MessageType, Pem, TestCertificates, Ended, rawClient, mutualTlsOptions(), makeCertificates() (+24 more)

### Community 78 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 8 - "NodeClient"
Cohesion: 0.05
Nodes (74): NodeSourceOptions, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription, Waiter (+66 more)

### Community 80 - "chain-events-decode.test.ts"
Cohesion: 0.07
Nodes (40): MetadataField, MetadataVariant, Primitive, RuntimeMetadataView, BlockParsedOptions, ChainTransaction, ChainEvent, EventPhase (+32 more)

### Community 82 - "core-settings.ts"
Cohesion: 0.06
Nodes (40): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+32 more)

### Community 83 - "cursor-harness.ts"
Cohesion: 0.07
Nodes (31): cursorTable, CursorTableOptions, CursorValue, TestBackend, BlockOptions, cursorDatabase, Access, Block (+23 more)

### Community 87 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.06
Nodes (35): LedgerTask, EngineOptions, SlowStep, TestLoaderData, bindLedgerTasks(), boundHost(), frozen(), hasLedgerTasks() (+27 more)

### Community 88 - "ledger-tasks-checks.ts"
Cohesion: 0.10
Nodes (35): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, ProcessBackend, countMainThreadParses(), expectedCallArgs() (+27 more)

### Community 89 - "version"
Cohesion: 0.05
Nodes (40): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+32 more)

### Community 9 - "admin/configuration.ts"
Cohesion: 0.04
Nodes (93): ConfigFacts, OpenedConfig, AllowedDetail, ProcessAdmin, RevisionSettings, DigestRow, ModuleFacts, PartTable (+85 more)

### Community 90 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (32): Commit, AlwaysLanded, checkParent(), commitBlock(), hex(), sameBytes(), writeBlockRow(), writeHashRow() (+24 more)

### Community 93 - "version-checks.ts"
Cohesion: 0.13
Nodes (32): LedgerTable, Boundary, CallRecord, CountingNode, Select, UpgradeCase, Walk, Answers (+24 more)

### Community 96 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.05
Nodes (39): Absent, 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 1. Executive conclusion, 2.1 Historical implementation baseline (+31 more)

### Community 98 - "networks.ts"
Cohesion: 0.07
Nodes (34): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+26 more)

### Community 99 - "release-version.test.ts"
Cohesion: 0.10
Nodes (37): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+29 more)

### Community 120 - "3. Block source and ingest"
Cohesion: 0.09
Nodes (25): refused(), 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix, The node on `/status`, 7. Storage helpers, 3. Block source and ingest (+17 more)

### Community 167 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.12
Nodes (15): 4.3 `transactions` — metadata only, raw bytes via blob reference, 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions, 6. Migration (`002_checkpoint_store.ts`), 7. Error translation — no additions to `src/postgres/errors.ts`, 8. Composing Transaction/Lease (Sprint 2 dependency) (+7 more)

### Community 100 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 115 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (29): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+21 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.06
Nodes (28): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage, ADDED Requirements (+20 more)

### Community 144 - "T"
Cohesion: 0.09
Nodes (24): n(), T(), input(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside (+16 more)

### Community 160 - "vendored-ledger-v9.test.ts"
Cohesion: 0.23
Nodes (19): freeAll(), bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex() (+11 more)

### Community 163 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (16): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface (+8 more)

### Community 164 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 169 - ".read"
Cohesion: 0.14
Nodes (17): identityRow(), captured(), triggerEnabled(), providesRows(), state(), migrationRows(), storedRows(), exists() (+9 more)

### Community 183 - ".slowBlockMs"
Cohesion: 0.16
Nodes (13): 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix, 00043 — slow-block-outside.negative-control.test.ts's 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+5 more)

### Community 184 - "integer"
Cohesion: 0.12
Nodes (14): integer(), Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first), G14 — benchmark harness + recorded baseline, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Scenario: The history aggregate reads size_bytes, not octet_length(data), Scenario: The size_bytes column exists and equals the payload length (+6 more)

### Community 189 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 193 - "attempt"
Cohesion: 0.16
Nodes (13): attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop (+5 more)

### Community 194 - "ADDED Requirements"
Cohesion: 0.14
Nodes (12): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row, Scenario: Backup in the page (+4 more)

### Community 199 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 221 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 240 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 247 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 251 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.29
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 266 - "continueTo"
Cohesion: 0.40
Nodes (5): continueTo(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 64 - "history"
Cohesion: 0.05
Nodes (50): integerCheckName(), history(), revision(), 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 5. `history` — pagination (+42 more)

### Community 65 - "fn"
Cohesion: 0.04
Nodes (51): fn(), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly (+43 more)

### Community 71 - "table"
Cohesion: 0.04
Nodes (47): migrations(), table(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, Contract states and contract logs (+39 more)

### Community 76 - "core-block-parsed.ts"
Cohesion: 0.06
Nodes (44): ledgerVersionOf(), blockBodyOf(), blockParsedItemOf(), blockParsedOf(), boundLedgerParser(), chainHashOf(), coreBlockParsedOnParse(), hexOf() (+36 more)

### Community 79 - ".put"
Cohesion: 0.05
Nodes (43): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+35 more)

### Community 95 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (34): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change) (+26 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+23 more)

### Community 125 - "Full-Chain Storage — Design"
Cohesion: 0.07
Nodes (29): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+21 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+20 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 149 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 152 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 153 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 156 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.09
Nodes (17): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+9 more)

### Community 157 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence), Requirement: the GC reachability anti-join is measured across a declared scale envelope (HP-6) (+13 more)

### Community 165 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 168 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 170 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 173 - "chain_archive lineage"
Cohesion: 0.12
Nodes (17): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, CheckpointStore tables, How the two lineages coexist (+9 more)

### Community 174 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (17): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+9 more)

### Community 175 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 178 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 179 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 182 - "Storage Layer Interface Specification"
Cohesion: 0.12
Nodes (15): 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.1 Transaction/Lease layer (+7 more)

### Community 185 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 196 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 201 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 202 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 203 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 204 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 206 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 208 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 209 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 210 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.17
Nodes (11): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live` (+3 more)

### Community 211 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 212 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 213 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 215 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 216 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Full-sync soak + load-under-prune (G10), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Postgres-kill mid-save + retry contract (G9 / T2) (+2 more)

### Community 220 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 222 - "Full-Chain Storage"
Cohesion: 0.20
Nodes (9): 1. Overview / purpose, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 3. Semantic decode: `chain-archive-sync/tx-replay-decoder.ts`, 4. How to run it, 5. Acceptance criteria status, 6. Known limitations (+1 more)

### Community 223 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 224 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 225 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 226 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 227 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure, Design — Sprint 2: Transaction/Lease (+1 more)

### Community 228 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 229 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 230 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 233 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 234 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 235 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 236 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 237 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 238 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 239 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.22
Nodes (8): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data`, Scalability ceilings (v1.0.0)

### Community 241 - "Changelog"
Cohesion: 0.25
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Added, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 242 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 243 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 244 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 245 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 246 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 248 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 249 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 250 - "UmbraDB Durability Contract"
Cohesion: 0.29
Nodes (6): 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented), Summary, UmbraDB Durability Contract

### Community 252 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 253 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 254 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 255 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 256 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 257 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 258 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 261 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 262 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 263 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 264 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 265 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 267 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 268 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 269 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease, What changes, Why

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

### Community 277 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 278 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 279 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 280 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 281 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 282 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 283 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 284 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 285 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 286 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 287 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 288 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 289 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 290 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 291 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 292 - "00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask"
Cohesion: 0.40
Nodes (4): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix

### Community 293 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 294 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 295 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 296 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 297 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 299 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 300 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 301 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 302 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 303 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 304 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 305 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 306 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 311 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 312 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 81 - "ADDED Requirements"
Cohesion: 0.04
Nodes (45): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: PgCheckpointStore validates walletId and networkId at every entry point (+37 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 91 - "README.md"
Cohesion: 0.06
Nodes (25): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+17 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 94 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-9110`, `RFC-6455`, `RFC-6455`, `RFC-3339`, `RFC-8949` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3729 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `api-server.test.ts`, `loop-stop-harness.ts`, `tape/index.ts`, `node-fields-harness.ts`, `history.test.ts`, `backup/restore.ts`, `migrate.ts`, `builder.test.ts`, `NodeClient`, `admin/configuration.ts`, `column-rules.ts`, `admin-harness.ts`, `order.property.test.ts`, `runner/process.ts`, `ledger-tapes.ts`, `refused-configuration.test.ts`, `core-transport.ts`, `declaration.ts`, `UmbraError`, `adapter-fixtures.ts`, `InMemoryBlockSource`, `client.test.ts`, `config/history.ts`, `adapter.ts`, `transform-checks.ts`, `lockstep-refusals.test.ts`, `src/db/postgres.ts`, `db/backends.ts`, `private/backends.ts`, `validate.ts`, `chain-process.test.ts`, `contract-modules.test.ts`, `spawnChild`, `db/errors.ts`, `module-tables.ts`, `loop.ts`, `backup-fixtures.ts`, `.from`, `process-backends.ts`, `core-ledger-state.ts`, `changes.property.test.ts`, `interfaces/transaction-history-storage.ts`, `ledger-sweep.test.ts`, `chain-events-source.test.ts`, `contract-data-checks.ts`, `ingest-harness.ts`, `host.ts`, `ledger/types.ts`, `mapping.ts`, `backup/backup.ts`, `ref_node_crypto`, `db/api.ts`, `writer-lock-checks.ts`, `api-timeouts.test.ts`, `12. Ledger`, `slow-block-harness.ts`, `cli/command.ts`, `net.test.ts`, `ledger-storage.test.ts`, `process-context.test.ts`, `transaction-history-storage.property.test.ts`, `cold-boot-recovery.integration.test.ts`, `boundary.test.ts`, `opt-out.test.ts`, `transport-faults.test.ts`, `retirement.test.ts`, `chain-events-decode.test.ts`, `core-settings.ts`, `cursor-harness.ts`, `ledger/ledger-tasks.test.ts`, `ledger-tasks-checks.ts`, `core-block-commit.test.ts`, `version-checks.ts`, `networks.ts`, `release-version.test.ts`, `process-worker.ts`, `ref_node_fs`, `cbor.property.test.ts`, `browser.test.ts`, `run.test.ts`, `12. Exported surface and command (LS-1, LS-6)`, `post-block-update-checks.ts`, `height-versioned.test.ts`, `config/plain-data.test.ts`, `code-registry.ts`, `binding.test.ts`, `browser/build.ts`, `node-format.ts`, `type-check.ts`, `readiness.test.ts`, `Lockstep`, `test/postgres/setup.ts`, `crash.test.ts`, `restore-private.ts`, `pg-tx-history-adapter.ts`, `ref_node_child_process`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `ws-mutual-tls.test.ts`, `node-bridge.ts`, `package.json`, `height-versioned.property.test.ts`, `worker-threads.test.ts`, `config-check-database.test.ts`, `block-fetch-decode.test.ts`, `vendored-ledger-v9.test.ts`, `pglite-outside-reads.ts`, `checks.test.ts`, `node-store-suite.ts`, `package-identity.test.ts`, `validation.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `web-lock.ts`, `excluded-not-exported.test.ts`, `twox.ts`, `lockstep-reads.test.ts`, `ledger/plain-data.test.ts`?**
  _High betweenness centrality (0.242) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `UmbraError` (e.g. with `Breaking changes` and `The ledger state`) actually correct?**
  _`UmbraError` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-9110`, `RFC-6455`, `RFC-6455` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api-server.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02156104221185573 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `api-server.test.ts`, `loop-stop-harness.ts`, `tape/index.ts`, `node-fields-harness.ts`, `history.test.ts`, `backup/restore.ts`, `migrate.ts`, `builder.test.ts`, `NodeClient`, `admin/configuration.ts`, `BlockRef`, `runner/process.ts`, `order.property.test.ts`, `refused-configuration.test.ts`, `core-transport.ts`, `FinalizedLoop`, `declaration.ts`, `ledger/metadata.ts`, `InMemoryBlockSource`, `client.test.ts`, `config/history.ts`, `lockstep-refusals.test.ts`, `src/db/postgres.ts`, `db/backends.ts`, `private/backends.ts`, `validate.ts`, `chain-process.test.ts`, `contract-modules.test.ts`, `db/errors.ts`, `module-tables.ts`, `loop.ts`, `checks.test.ts`, `core-ledger-state.ts`, `changes.property.test.ts`, `interfaces/transaction-history-storage.ts`, `checkShape`, `ingest-harness.ts`, `mapping.ts`, `backup/backup.ts`, `package-identity.test.ts`, `db/api.ts`, `writer-lock-checks.ts`, `api-timeouts.test.ts`, `statementsOf`, `validation.test.ts`, `cli/command.ts`, `slow-block-harness.ts`, `cbor.ts`, `range.ts`, `web-lock.ts`, `12. Ledger`, `process-context.test.ts`, `graph.ts`, `table`, `NodeBlockSource`, `node-run.ts`, `opt-out.test.ts`, `transport-faults.test.ts`, `core-settings.ts`, `cursor-harness.ts`, `ledger-tasks-checks.ts`, `core-block-commit.test.ts`, `sha256`, `version-checks.ts`, `process-worker.ts`, `ref_node_fs`, `node-source.ts`, `12. Exported surface and command (LS-1, LS-6)`, `height-versioned.test.ts`, `config/plain-data.test.ts`, `binding.test.ts`, `3. Block source and ingest`, `readiness.test.ts`, `version-table.ts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `loop-stop-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03148374813001496 - nodes in this community are weakly interconnected._