# Graph Report - UmbraDB

## Corpus Check
- 976 files · ~1,442,428 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10373 nodes · 30041 edges · 337 communities (303 shown, 34 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2435 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `124528cc4a58d000` (976 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- migrate.ts
- UmbraError
- backup/restore.ts
- private/lockstep-wait.test.ts
- postgres/transaction-history-storage.ts
- TransactionHistoryEntry
- browser/build.ts
- mapping.ts
- code-registry.ts
- pg-tx-history-adapter.ts
- binding.test.ts
- ingest-harness.ts
- PrivateTransport
- Lockstep
- ProcessContexts
- containers.test.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- opt-out.test.ts
- BlockRef
- validation.ts
- page.ts
- ModuleDeclaration
- T
- intake.test.ts
- Buffer
- sweep.ts
- test/postgres/setup.ts
- net.test.ts
- pglite-writer.worker.ts
- ledger-storage.test.ts
- ledger-sweep.test.ts
- BlockItems
- digest.test.ts
- transaction-history-storage.property.test.ts
- lockstep-refusals.test.ts
- runner/process.ts
- sweep-fixture.ts
- PortSocket
- 10. Node client and ingest
- core-chain-events.ts
- validation.test.ts
- statementsOf
- ws-mutual-tls.test.ts
- tape/index.ts
- package-identity.test.ts
- checkShape
- chrome.ts
- cursor-table.property.test.ts
- web-lock.ts
- Design — Sprint 1: project setup + TemporalKV
- ledger-tapes.ts
- ChromeTab
- read-height.property.test.ts
- no-indexer-or-wallet-sdk.test.ts
- ws.ts
- worker-threads.test.ts
- cli/command.ts
- history.property.test.ts
- component-table.test.ts
- worker-threads-worker.ts
- buffer.ts
- Worker
- loop.ts
- adapter-fixtures.ts
- childRefKeys
- sweep-model.ts
- refused-configuration.test.ts
- postgres-image.ts
- sha256
- Roadmap for the missing formalization
- .from
- type-check.ts
- postgres-image.test.ts
- stats.ts
- validate.test.ts
- api-server.ts
- ledger/types.ts
- mutation-evidence.d.mts
- pageBench
- AsyncLocalStorage
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- chain-data.test.ts
- Heartbeat
- range.test.ts
- CrashWorkerHandle
- core-block-parsed.ts
- FinalizedLoop
- exitWithin
- admin-harness.ts
- range.ts
- CliBackend
- https.ts
- contract-modules.test.ts
- NodeFS
- ref_node_fs
- contract-data-checks.ts
- core-transport.ts
- transform-checks.ts
- checks.test.ts
- spawnChild
- chain-process.test.ts
- column-rules.ts
- config/history.ts
- dispatch.test.ts
- LedgerPackage
- build-modules.ts
- PgTransactionHistoryStorage
- determinism-checks.ts
- node.test.ts
- builds.ts
- vitest
- slow-block-harness.ts
- declaration.ts
- restore-ledger.ts
- column-rules.test.ts
- cbor.ts
- changes.property.test.ts
- networks.ts
- NodeBlockSource
- backup/backup.ts
- core-ledger-state.ts
- InMemoryBlockSource
- version
- worker-storage.test.ts
- graph.ts
- transport-faults.test.ts
- post-block-update-checks.ts
- version-checks.ts
- api-server.test.ts
- snapshot.test.ts
- client.test.ts
- order.property.test.ts
- real-tapes.ts
- node-source.ts
- retirement.test.ts
- lockstep-reads.test.ts
- .concat
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- entries.ts
- NodeClient
- core-settings.ts
- worker-host.test.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- validate.ts
- cold-boot-recovery.integration.test.ts
- browser.test.ts
- private/backends.ts
- boundary.test.ts
- module-api.test.ts
- 5. Runner
- cbor.property.test.ts
- interfaces/transaction-history-storage.ts
- 4. Schema design
- .configHash
- ADDED Requirements
- UmbraDB module guide
- decode
- ADDED Requirements
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- core-ledger-state.test.ts
- .restore
- ADDED Requirements
- mapping.test.ts
- src/config/load.ts
- mutation-per-adapter.mjs
- twox.ts
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- refused
- pack-install.mjs
- scoped-review-manifest
- midnight-env — reproducible PREPROD dev environment
- path.ts
- .boolean
- Performance — design
- orphan-watcher.mjs
- fresh-instance.mjs
- crash-worker.ts
- leanProblems
- history
- fn
- code
- .put
- graph.py
- UmbraDB 1.0.0 Release Contracts
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- package.json
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Design — v1.0.0-durable-checkpoint-cursor
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB
- stryker.conf.json
- Storage Layer Interface Specification
- chain_archive lineage
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- ADDED Requirements
- REMOVED Requirements
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — Sprint 4: Watermarks
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Security policy & threat model
- 3. Proof-blocking findings
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
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
- Storage Algebra Lean M3a Watermarks Sprint
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Proposal — Sprint 1: project setup + TemporalKV
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
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`
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
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Requirement: CF-4 Every field is data, operational or secret
- Requirement: PP-2 A private database is bound to one public database
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
- README.md
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
1. `vitest` - 301 edges
2. `UmbraError` - 294 edges
3. `ModuleDeclaration` - 161 edges
4. `FinalizedLoop` - 118 edges
5. `InMemoryBlockSource` - 101 edges
6. `NodeClient` - 99 edges
7. `Database` - 96 edges
8. `BlockRef` - 93 edges
9. `ReadHandle` - 84 edges
10. `5. Runner` - 75 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Review notes` --references--> `JsonValue`  [INFERRED]
  design/design-interfaces.md → src/private/messages.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (337 total, 34 thin omitted)

### Community 0 - "migrate.ts"
Cohesion: 0.02
Nodes (156): CaptureColumn, CapturedTable, CaptureState, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+148 more)

### Community 1 - "UmbraError"
Cohesion: 0.02
Nodes (115): LoadedConfig, LoadOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresOptions, ReadDatabaseOptions, ConfiguredDatabase (+107 more)

### Community 10 - "backup/restore.ts"
Cohesion: 0.03
Nodes (73): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, SourceTransport, PublicConfiguration, PublicDatabase, PublicIdentity (+65 more)

### Community 100 - "private/lockstep-wait.test.ts"
Cohesion: 0.10
Nodes (20): Report, ExpectedWait, SkipsUnseen, WaitsInTransaction, ReportRelay, RetargetProxy, a117Problems(), firstWait() (+12 more)

### Community 101 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (22): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+14 more)

### Community 102 - "TransactionHistoryEntry"
Cohesion: 0.11
Nodes (12): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), 4. Wiring `PgTemporalKV`'s `opts.tx`, 2. `set`, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+4 more)

### Community 103 - "browser/build.ts"
Cohesion: 0.09
Nodes (23): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+15 more)

### Community 104 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 105 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 106 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 109 - "binding.test.ts"
Cohesion: 0.11
Nodes (23): TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, a113Problems(), a113Run() (+15 more)

### Community 11 - "ingest-harness.ts"
Cohesion: 0.04
Nodes (96): NodeCallOptions, ProcessCondition, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME (+88 more)

### Community 110 - "PrivateTransport"
Cohesion: 0.12
Nodes (9): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), rowsOf() (+1 more)

### Community 111 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 113 - "ProcessContexts"
Cohesion: 0.10
Nodes (7): ProcessContexts, ProcessItems, PublishRefusal, AllowsOutside, AllowsTwice, providesProcessItem(), sealed()

### Community 115 - "containers.test.ts"
Cohesion: 0.11
Nodes (19): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+11 more)

### Community 117 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 118 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 119 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 12 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (80): CheckedMigration, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, CatalogTable (+72 more)

### Community 122 - "BlockRef"
Cohesion: 0.14
Nodes (7): BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, failingSource(), flakySource()

### Community 123 - "validation.ts"
Cohesion: 0.09
Nodes (25): PlacedDeclaration, Plain, body(), configWhen(), moded(), FIELD_KINDS, LIFETIMES, POINTS (+17 more)

### Community 126 - "page.ts"
Cohesion: 0.11
Nodes (18): NetworkBroker, PageState, ProcessView, CallMethod, StartRun, appendLog(), element(), onEvent() (+10 more)

### Community 13 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (94): ConfigFacts, OpenedConfig, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter (+86 more)

### Community 130 - "T"
Cohesion: 0.10
Nodes (24): Absent, n(), T(), input(), 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside (+16 more)

### Community 132 - "intake.test.ts"
Cohesion: 0.14
Nodes (12): PrivateSeen, A114Observation, A116Observation, SkipsAfterReconnect, TestLink, a114Problems(), a114Run(), a116Problems() (+4 more)

### Community 134 - "Buffer"
Cohesion: 0.10
Nodes (11): WebSocket, Buffer, Hash, createHash(), 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted) (+3 more)

### Community 135 - "sweep.ts"
Cohesion: 0.12
Nodes (13): GreyView, SweepPhase, SweepTables, byBytes(), BYTE_ORDER(), hexOf(), merged(), sweepStep() (+5 more)

### Community 136 - "test/postgres/setup.ts"
Cohesion: 0.14
Nodes (21): Cancellable, CrashHook, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker(), backendPid() (+13 more)

### Community 137 - "net.test.ts"
Cohesion: 0.16
Nodes (14): IncomingMessage, Server, NetworkMessage, createServer(), connect(), listen(), pagePort(), unlisten() (+6 more)

### Community 139 - "pglite-writer.worker.ts"
Cohesion: 0.16
Nodes (17): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+9 more)

### Community 14 - "ledger-storage.test.ts"
Cohesion: 0.05
Nodes (95): NodeDatabase, ingest, SeenLoad, retentionSeen, LedgerTx, recordedGenesis, Flaky, TableSnapshot (+87 more)

### Community 140 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (13): SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints() (+5 more)

### Community 142 - "BlockItems"
Cohesion: 0.11
Nodes (8): QueuedBlock, BlockItems, EventsRunner, EagerItems, EagerLoop, KeptItems, KeptLoop, reporting()

### Community 143 - "digest.test.ts"
Cohesion: 0.13
Nodes (20): ChangeKind, tableChanges, TouchedRow, changeOf(), concat(), sameBytes(), hex(), hex() (+12 more)

### Community 145 - "transaction-history-storage.property.test.ts"
Cohesion: 0.10
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 148 - "lockstep-refusals.test.ts"
Cohesion: 0.22
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+10 more)

### Community 15 - "runner/process.ts"
Cohesion: 0.03
Nodes (54): Bound, ChainIdentity, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, BackupInput (+46 more)

### Community 150 - "sweep-fixture.ts"
Cohesion: 0.18
Nodes (16): FixtureNode, FakeState, node(), rootOf(), stateNodes(), subtree(), utf8(), versionOf() (+8 more)

### Community 151 - "PortSocket"
Cohesion: 0.18
Nodes (7): PortSocket, 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix, Requirement: RN-15 Module APIs are registered once, at startup, Scenario: Two modules claim one path

### Community 153 - "10. Node client and ingest"
Cohesion: 0.18
Nodes (7): RuntimeMetadata, bindCoreBlockFetch(), bindCoreChain(), items(), 2. Points, 3. Block source and ingest, 10. Node client and ingest

### Community 16 - "core-chain-events.ts"
Cohesion: 0.05
Nodes (77): BlockEventSource, ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant (+69 more)

### Community 164 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 167 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 169 - "ws-mutual-tls.test.ts"
Cohesion: 0.19
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 17 - "tape/index.ts"
Cohesion: 0.05
Nodes (67): Recorded, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError (+59 more)

### Community 172 - "package-identity.test.ts"
Cohesion: 0.27
Nodes (12): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+4 more)

### Community 173 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 174 - "chrome.ts"
Cohesion: 0.23
Nodes (10): Cdp, CdpEvent, PageRequest, chrome(), chrome(), chromePath(), chromeVersion(), launchChrome() (+2 more)

### Community 175 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 176 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 177 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.15
Nodes (13): Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4a. Error translation (`src/postgres/errors.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV (+5 more)

### Community 18 - "ledger-tapes.ts"
Cohesion: 0.05
Nodes (68): ledgerScenario, RawPackageClass, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable (+60 more)

### Community 182 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 184 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 185 - "ws.ts"
Cohesion: 0.19
Nodes (6): Emitter, Frame, Listener, PortUpgrade, RawData, WebSocketServer

### Community 186 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 19 - "cli/command.ts"
Cohesion: 0.04
Nodes (78): BackupSeams, RestoreSeams, Environment, BackupCommandOptions, BackupOutcome, CommandHandler, CommandIo, MainProcess (+70 more)

### Community 190 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 191 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 193 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 194 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 2 - "loop.ts"
Cohesion: 0.02
Nodes (129): Database, Transaction, SchemaPlan, Revision, ResolvedGraph, LateUse, ReasonCode, CommitOutcome (+121 more)

### Community 20 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (82): Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerAnswer, AdapterWorkerHost, LoadedState (+74 more)

### Community 208 - "childRefKeys"
Cohesion: 0.40
Nodes (3): ChildReader, childRefKeys(), readChildren()

### Community 209 - "sweep-model.ts"
Cohesion: 0.25
Nodes (5): ModelBatch, SweepModel, hexOf(), hex(), modelOfFixture()

### Community 21 - "refused-configuration.test.ts"
Cohesion: 0.04
Nodes (79): ProcessConfig, SignalTarget, Start, Child, Refusal, Start, startProcess(), terminationSignal() (+71 more)

### Community 211 - "postgres-image.ts"
Cohesion: 0.27
Nodes (6): BenchEnv, PG_SETTINGS, container, { guarded, fixture }, POSTGRES_IMAGE, @testcontainers/postgresql

### Community 212 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 218 - "Roadmap for the missing formalization"
Cohesion: 0.20
Nodes (9): Key, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec (+1 more)

### Community 22 - ".from"
Cohesion: 0.04
Nodes (73): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+65 more)

### Community 225 - "type-check.ts"
Cohesion: 0.36
Nodes (8): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), isRegularFile(), packageType(), typeCheckFile(), typescript

### Community 226 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 227 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 23 - "validate.test.ts"
Cohesion: 0.03
Nodes (77): Entry, UmbraConfig, PlainArray, plainData, PlainDataNode, PlainDataRule, Walk, EntryRef (+69 more)

### Community 24 - "api-server.ts"
Cohesion: 0.04
Nodes (66): ModuleApiServer, ModuleApiStart, StartedModuleApi, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart (+58 more)

### Community 25 - "ledger/types.ts"
Cohesion: 0.05
Nodes (65): LoadLedger, LedgerStateItem, RetainedState, LedgerName, ApplyOutput, ChainOutcome, LedgerEvent, LedgerPackageOptions (+57 more)

### Community 250 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 251 - "pageBench"
Cohesion: 0.40
Nodes (4): BrowserBuild, pageBench, PageServer, servePage()

### Community 257 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 26 - "chain-data.test.ts"
Cohesion: 0.06
Nodes (75): BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase (+67 more)

### Community 27 - "range.test.ts"
Cohesion: 0.04
Nodes (47): ScriptedNode, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, CompletenessRange, RangeOptions (+39 more)

### Community 28 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (74): BodyExtrinsic, BlockBody, BlockParsed, BlockParsedOptions, TransactionParser, ChainTransaction, ChainEvent, EventPhase (+66 more)

### Community 29 - "FinalizedLoop"
Cohesion: 0.05
Nodes (22): Activity, FinalizedLoop, LoopObserver, Startup, WaitingInRead, ItemsAfterWrite, CommitsDespiteLastWrite, SilentHalt (+14 more)

### Community 3 - "admin-harness.ts"
Cohesion: 0.03
Nodes (129): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+121 more)

### Community 30 - "range.ts"
Cohesion: 0.04
Nodes (61): Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments (+53 more)

### Community 31 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (64): ContractLog, BlockTransaction, CoreContractLogsFastOptions, UnsureLog, FastLogReader, LoadAdapter, LogSite, Program (+56 more)

### Community 32 - "ref_node_fs"
Cohesion: 0.08
Nodes (47): BackupBackend, BackupDatabase, killedRestore, TickerConfig, Finding, Pem, isEmptyDatabase(), catalogOf() (+39 more)

### Community 33 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (67): ContractStateRow, CoreContractStatesOptions, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+59 more)

### Community 34 - "core-transport.ts"
Cohesion: 0.05
Nodes (62): Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, MessageFault, Parsed (+54 more)

### Community 35 - "transform-checks.ts"
Cohesion: 0.07
Nodes (50): Failure, Variant, TapeError, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange (+42 more)

### Community 36 - "checks.test.ts"
Cohesion: 0.05
Nodes (50): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Settings, Case, Outcome (+42 more)

### Community 37 - "spawnChild"
Cohesion: 0.04
Nodes (57): ParentJob, Kill, Orphaned, SourceFile, Run, WorkerEvent, LockResult, Report (+49 more)

### Community 38 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (52): BackupWritten, Job, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+44 more)

### Community 39 - "column-rules.ts"
Cohesion: 0.04
Nodes (68): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+60 more)

### Community 4 - "config/history.ts"
Cohesion: 0.03
Nodes (139): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreSettings, versionEntry, ConfigHashRow, HistoryCheck, HistoryCode (+131 more)

### Community 40 - "dispatch.test.ts"
Cohesion: 0.05
Nodes (60): GraphInput, HeightRange, PointArguments, PointRun, PastFaultCase, RefusalCase, CallEvent, Pipeline (+52 more)

### Community 41 - "LedgerPackage"
Cohesion: 0.07
Nodes (24): LedgerEventKind, LedgerPackage, LedgerEngine, stagenetReplay, hexOf(), idOf(), same(), sameBytes() (+16 more)

### Community 42 - "build-modules.ts"
Cohesion: 0.06
Nodes (43): BrowserConfiguration, BrowserRun, PrivateInstance, Scope, crossedError, FromProcessWorker, ToProcessWorker, openedProcess (+35 more)

### Community 43 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (56): TransactionHistoryStorage, PgTransactionHistoryStorage, Added, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation) (+48 more)

### Community 45 - "determinism-checks.ts"
Cohesion: 0.06
Nodes (53): PrivateIntakeOptions, PublicWakes, PrivateBackend, SessionSeen, PrivateOptions, InstanceHashes, OptedOutObservation, Refusal (+45 more)

### Community 46 - "node.test.ts"
Cohesion: 0.05
Nodes (26): Metadata, Step, Frame, RawClient, Failure, Variant, TapeClock, expectAnswersByOccurrence() (+18 more)

### Community 47 - "builds.ts"
Cohesion: 0.06
Nodes (40): ProcessHandle, TickerProcess, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions (+32 more)

### Community 48 - "vitest"
Cohesion: 0.04
Nodes (40): Lockfile, Manifest, Upstream, Leftover, RemovedName, ReportedTest, filesUnder(), patchesOf() (+32 more)

### Community 49 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (48): HeightActivity, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+40 more)

### Community 5 - "declaration.ts"
Cohesion: 0.03
Nodes (105): BlockWriteHandle, ReadHandle, SchemaWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+97 more)

### Community 50 - "restore-ledger.ts"
Cohesion: 0.06
Nodes (49): RestoreInput, BlockHeader, ChainBuildOptions, PalletSpec, CrashEvent, CrashJob, IngestOptions, watched (+41 more)

### Community 51 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (33): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TreeNode, TypeRule, DesignTable (+25 more)

### Community 52 - "cbor.ts"
Cohesion: 0.07
Nodes (47): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+39 more)

### Community 54 - "changes.property.test.ts"
Cohesion: 0.07
Nodes (50): ChainOptions, DigestRow, Op, States, TableName, captured(), captureFunction(), moduleM() (+42 more)

### Community 55 - "networks.ts"
Cohesion: 0.06
Nodes (52): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+44 more)

### Community 57 - "NodeBlockSource"
Cohesion: 0.09
Nodes (14): HeadWait, NodeBlockSource, NodeHeader, PreparedBlock, QueueRunner, NoWindow, Refetches, TrustsNotifications (+6 more)

### Community 58 - "backup/backup.ts"
Cohesion: 0.08
Nodes (46): BackupTarget, BackupFacts, Manifest, ManifestMigration, ManifestTool, Restored, PgDumpTool, PgliteDump (+38 more)

### Community 59 - "core-ledger-state.ts"
Cohesion: 0.08
Nodes (44): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, blockHeaderOf(), ledgerVersionOf(), chainEventsItemOf(), applyBlock() (+36 more)

### Community 6 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (121): InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, CrashCall, CrashEvent, CrashOptions (+113 more)

### Community 60 - "version"
Cohesion: 0.04
Nodes (47): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+39 more)

### Community 61 - "worker-storage.test.ts"
Cohesion: 0.07
Nodes (33): NodeStore, StoredNode, EngineOptions, BridgeServer, bridgeStore, Growable, StagenetBlockJson, StagenetFixtureJson (+25 more)

### Community 62 - "graph.ts"
Cohesion: 0.07
Nodes (46): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+38 more)

### Community 64 - "transport-faults.test.ts"
Cohesion: 0.08
Nodes (32): Message, MessageType, TestCertificates, Ended, rawClient, mutualTlsOptions(), hexOf(), messageText() (+24 more)

### Community 65 - "post-block-update-checks.ts"
Cohesion: 0.09
Nodes (39): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+31 more)

### Community 66 - "version-checks.ts"
Cohesion: 0.11
Nodes (36): MetadataNode, LedgerSelection, VersionedBlock, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata (+28 more)

### Community 67 - "api-server.test.ts"
Cohesion: 0.07
Nodes (32): ApiRegistry, HttpHandler, HttpRoute, AcceptsDuplicates, AddsExtensions, AddsHeaders, AppendsVersion, Client (+24 more)

### Community 69 - "snapshot.test.ts"
Cohesion: 0.07
Nodes (34): AllowedDetail, SanitizedError, RedactionForms, SecretForm, TextPattern, Needs, errorMessage(), failureOf() (+26 more)

### Community 7 - "client.test.ts"
Cohesion: 0.03
Nodes (72): NodeRetry, Answer, FakeNode, Handler, Received, recorded, ManualTimers, ConnectionFrames (+64 more)

### Community 70 - "order.property.test.ts"
Cohesion: 0.07
Nodes (38): PointName, Unwrapped, Misuse, SlowBlockCondition, Recorder, A43Case, Given, CheckName (+30 more)

### Community 71 - "real-tapes.ts"
Cohesion: 0.07
Nodes (35): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+27 more)

### Community 73 - "node-source.ts"
Cohesion: 0.06
Nodes (24): BlockHeaderItem, BlockItemSource, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, NodeSourceOptions, Prefetch, LedgerBinding (+16 more)

### Community 74 - "retirement.test.ts"
Cohesion: 0.07
Nodes (39): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), manifestProblems(), mutationProblems() (+31 more)

### Community 75 - "lockstep-reads.test.ts"
Cohesion: 0.08
Nodes (35): A162Options, a162Run, HeaderSeen, Pause, Q142Observation, SkipsLockstep, InstancesOptions, instancesRun (+27 more)

### Community 76 - ".concat"
Cohesion: 0.05
Nodes (30): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+22 more)

### Community 77 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 79 - "entries.ts"
Cohesion: 0.07
Nodes (39): ProcessConfiguration, coreEntry, CoreEntryInput, CoreSettingsBase, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+31 more)

### Community 8 - "NodeClient"
Cohesion: 0.05
Nodes (75): Connection, HeadSubscriber, NodeClient, NodeClientOptions, Pending, State, Subscription, Waiter (+67 more)

### Community 80 - "core-settings.ts"
Cohesion: 0.06
Nodes (37): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys (+29 more)

### Community 82 - "worker-host.test.ts"
Cohesion: 0.08
Nodes (31): LedgerReleasePackage, ApplyInput, V9Logs, AdapterWorkerRequest, SlowStep, TestLoaderData, loadLedgerPackage(), createV8Adapter() (+23 more)

### Community 83 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.05
Nodes (40): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+32 more)

### Community 85 - "validate.ts"
Cohesion: 0.10
Nodes (37): HistoryFinding, ConfigRule, CursorRule, Finding, Issue, Plain, SettingsSchema, coreSettingsSchema() (+29 more)

### Community 87 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (24): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+16 more)

### Community 89 - "browser.test.ts"
Cohesion: 0.10
Nodes (35): Reachable, PageEvent, ProcessName, StatusBody, midChainProblems(), networkProblems(), plain(), resumeProblems() (+27 more)

### Community 9 - "private/backends.ts"
Cohesion: 0.04
Nodes (87): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, PostgresOptions, Writer, WriterSession (+79 more)

### Community 92 - "boundary.test.ts"
Cohesion: 0.14
Nodes (32): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+24 more)

### Community 93 - "module-api.test.ts"
Cohesion: 0.09
Nodes (28): ChainDataView, ApiRequest, ApiResponse, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView() (+20 more)

### Community 94 - "5. Runner"
Cohesion: 0.12
Nodes (29): ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointSchedule, SlowWindow, SkipsStartAtRestart (+21 more)

### Community 96 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 98 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.07
Nodes (22): EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, capitalize() (+14 more)

### Community 128 - "4. Schema design"
Cohesion: 0.09
Nodes (22): 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design, v4 rewrite — the rollover runbook, rebuilt from four reproduced failures, run end-to-end for real (+14 more)

### Community 259 - ".configHash"
Cohesion: 0.33
Nodes (5): Private modules, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration

### Community 107 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): 2. Database API, ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+20 more)

### Community 114 - "UmbraDB module guide"
Cohesion: 0.07
Nodes (26): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Blocks from the node, Contract states and contract logs, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations (+18 more)

### Community 120 - "decode"
Cohesion: 0.09
Nodes (25): decode(), 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding), 7. Testing strategy (post-implementation), Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored (+17 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): `transaction_history`, 1. Schema, ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins (+15 more)

### Community 138 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (20): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data (+12 more)

### Community 155 - "core-ledger-state.test.ts"
Cohesion: 0.12
Nodes (10): bindLedgerParser(), boundLedgerParser(), workerParser(), bindCoreLedgerState(), itemsOf(), writeBlock(), bound(), CORE_LEDGER_STATE_MIGRATIONS (+2 more)

### Community 160 - ".restore"
Cohesion: 0.12
Nodes (15): 1. Library surface, ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command (+7 more)

### Community 165 - "ADDED Requirements"
Cohesion: 0.12
Nodes (14): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+6 more)

### Community 168 - "mapping.test.ts"
Cohesion: 0.16
Nodes (6): mapValue(), oid(), identity(), RESULT_COLUMNS, RESULT_TYPES, RFC-3339

### Community 170 - "src/config/load.ts"
Cohesion: 0.19
Nodes (10): invalid(), isFile(), loadConfig(), modulesOf(), DEFAULT_CONFIG_FILE, TYPESCRIPT_SYNTAX, CONFIG, EXPECTED (+2 more)

### Community 171 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 183 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 196 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 202 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 204 - "refused"
Cohesion: 0.22
Nodes (10): refused(), When a callback fails, 7. Storage helpers, Requirement: AE-3 States and conditions, Requirement: AE-5 `/status` and `/config` contents, Scenario: A fault of the build's declarations ends the process, Scenario: A refused configuration ends the process, Scenario: A refused start stays up (+2 more)

### Community 210 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 214 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 232 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 235 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 239 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 241 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 270 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 294 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 307 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 308 - "leanProblems"
Cohesion: 0.50
Nodes (4): leanImports(), leanProblems(), leanTheorems(), retiredLean()

### Community 44 - "history"
Cohesion: 0.04
Nodes (61): history(), revision(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+53 more)

### Community 53 - "fn"
Cohesion: 0.04
Nodes (54): fn(), 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure (+46 more)

### Community 56 - "code"
Cohesion: 0.04
Nodes (52): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21), The catalog, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog (+44 more)

### Community 68 - ".put"
Cohesion: 0.05
Nodes (43): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+35 more)

### Community 90 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 97 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.06
Nodes (33): up(), name, 8. Migration, 1. Durability contract, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 4. Save-retry caveat, 5. Lease limitation (+25 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 121 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 125 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 127 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.08
Nodes (18): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Superseded — see `Formal/STORAGE_ALGEBRA.md`, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan (+10 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence (+17 more)

### Community 133 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 141 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 144 - "Full-Chain Storage — Design"
Cohesion: 0.10
Nodes (20): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs, 3.5 Dust generation + ledger events (generic) (+12 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need, Requirement: PP-6 Lockstep instances process each height at that height (+12 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 152 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.11
Nodes (16): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+8 more)

### Community 154 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 156 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 157 - "Storage Layer Interface Specification"
Cohesion: 0.12
Nodes (16): 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.1 Transaction/Lease layer (+8 more)

### Community 158 - "chain_archive lineage"
Cohesion: 0.12
Nodes (17): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, CheckpointStore tables, How the two lineages coexist (+9 more)

### Community 159 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 162 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 163 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 166 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 179 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 187 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 188 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 189 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 192 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 198 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 199 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 200 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 201 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 203 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 205 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 206 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 207 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.18
Nodes (10): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds, 8. CI (+2 more)

### Community 213 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 215 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 216 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 217 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 219 - "3. Proof-blocking findings"
Cohesion: 0.20
Nodes (10): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption, 3.8 C2 safety and liveness are different theorem classes (+2 more)

### Community 220 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 221 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 222 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 223 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 224 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 228 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 229 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 230 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 231 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 233 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 234 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 236 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 237 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 238 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 240 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 242 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 243 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 244 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 245 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 246 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 247 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 248 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 249 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 253 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 254 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 255 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 256 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 258 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 260 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 261 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 262 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 263 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 264 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 265 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 266 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 267 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 268 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 272 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 273 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 274 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 275 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 276 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 277 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 278 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 279 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 280 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 281 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 282 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 283 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 284 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 285 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 286 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 287 - "00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`"
Cohesion: 0.40
Nodes (4): 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 288 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 289 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 290 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 291 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 292 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 295 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 296 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 297 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 298 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 299 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 300 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 301 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 302 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.50
Nodes (4): Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases

### Community 303 - "Requirement: PP-2 A private database is bound to one public database"
Cohesion: 0.50
Nodes (4): Requirement: PP-2 A private database is bound to one public database, Scenario: Configured for another network, Scenario: Pointed at another public database, Scenario: The public core never started

### Community 304 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 305 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 313 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 314 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 63 - "README.md"
Cohesion: 0.05
Nodes (33): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, [0.9.5] - 2026-07-25 — "Penumbra" (+25 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+32 more)

### Community 86 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-16 Chain-data reads name their view and height, Requirement: RN-1 The main program is a fixed sequence of points (+28 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides, Requirement: LG-17 Ledger tasks give modules the native objects (+25 more)

## Knowledge Gaps
- **53 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-6455`, `RFC-8259` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3594 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `migrate.ts`, `UmbraError`, `loop.ts`, `admin-harness.ts`, `config/history.ts`, `declaration.ts`, `InMemoryBlockSource`, `client.test.ts`, `NodeClient`, `private/backends.ts`, `backup/restore.ts`, `ingest-harness.ts`, `opt-out.test.ts`, `ModuleDeclaration`, `ledger-storage.test.ts`, `runner/process.ts`, `core-chain-events.ts`, `tape/index.ts`, `ledger-tapes.ts`, `cli/command.ts`, `adapter-fixtures.ts`, `refused-configuration.test.ts`, `.from`, `validate.test.ts`, `chain-data.test.ts`, `range.test.ts`, `core-block-parsed.ts`, `contract-modules.test.ts`, `ref_node_fs`, `contract-data-checks.ts`, `core-transport.ts`, `transform-checks.ts`, `checks.test.ts`, `spawnChild`, `chain-process.test.ts`, `dispatch.test.ts`, `build-modules.ts`, `determinism-checks.ts`, `node.test.ts`, `builds.ts`, `slow-block-harness.ts`, `restore-ledger.ts`, `column-rules.test.ts`, `changes.property.test.ts`, `networks.ts`, `backup/backup.ts`, `core-ledger-state.ts`, `worker-storage.test.ts`, `transport-faults.test.ts`, `post-block-update-checks.ts`, `version-checks.ts`, `api-server.test.ts`, `snapshot.test.ts`, `order.property.test.ts`, `real-tapes.ts`, `node-source.ts`, `retirement.test.ts`, `lockstep-reads.test.ts`, `core-settings.ts`, `worker-host.test.ts`, `cold-boot-recovery.integration.test.ts`, `browser.test.ts`, `boundary.test.ts`, `module-api.test.ts`, `cbor.property.test.ts`, `private/lockstep-wait.test.ts`, `postgres/transaction-history-storage.ts`, `browser/build.ts`, `code-registry.ts`, `pg-tx-history-adapter.ts`, `binding.test.ts`, `Lockstep`, `containers.test.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `validation.ts`, `package.json`, `intake.test.ts`, `test/postgres/setup.ts`, `net.test.ts`, `ledger-sweep.test.ts`, `digest.test.ts`, `transaction-history-storage.property.test.ts`, `lockstep-refusals.test.ts`, `core-ledger-state.test.ts`, `validation.test.ts`, `statementsOf`, `mapping.test.ts`, `ws-mutual-tls.test.ts`, `src/config/load.ts`, `mutation-per-adapter.mjs`, `package-identity.test.ts`, `cursor-table.property.test.ts`, `web-lock.ts`, `excluded-not-exported.test.ts`, `read-height.property.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `history.property.test.ts`, `component-table.test.ts`, `facade-merge-loader.ts`, `postgres-image.test.ts`?**
  _High betweenness centrality (0.251) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.022113992365407398 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `migrate.ts`, `loop.ts`, `admin-harness.ts`, `config/history.ts`, `declaration.ts`, `InMemoryBlockSource`, `client.test.ts`, `NodeClient`, `private/backends.ts`, `backup/restore.ts`, `pglite-writer.worker.ts`, `opt-out.test.ts`, `ModuleDeclaration`, `ledger-storage.test.ts`, `runner/process.ts`, `ingest-harness.ts`, `tape/index.ts`, `cli/command.ts`, `adapter-fixtures.ts`, `refused-configuration.test.ts`, `lockstep-refusals.test.ts`, `validate.test.ts`, `api-server.ts`, `10. Node client and ingest`, `ledger/types.ts`, `core-ledger-state.test.ts`, `FinalizedLoop`, `range.ts`, `contract-modules.test.ts`, `core-transport.ts`, `transform-checks.ts`, `checks.test.ts`, `validation.test.ts`, `chain-process.test.ts`, `statementsOf`, `mapping.test.ts`, `dispatch.test.ts`, `build-modules.ts`, `src/config/load.ts`, `package-identity.test.ts`, `checkShape`, `determinism-checks.ts`, `web-lock.ts`, `slow-block-harness.ts`, `cbor.ts`, `changes.property.test.ts`, `networks.ts`, `NodeBlockSource`, `backup/backup.ts`, `core-ledger-state.ts`, `graph.ts`, `transport-faults.test.ts`, `version-checks.ts`, `api-server.test.ts`, `snapshot.test.ts`, `node-source.ts`, `entries.ts`, `sha256`, `validate.ts`, `module-api.test.ts`, `mapping.ts`, `binding.test.ts`, `PrivateTransport`, `ProcessContexts`, `UmbraDB module guide`, `BlockRef`, `validation.ts`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.02419894787183166 - nodes in this community are weakly interconnected._