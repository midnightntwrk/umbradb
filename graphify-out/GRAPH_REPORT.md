# Graph Report - UmbraDB

## Corpus Check
- 1005 files · ~1,475,114 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10636 nodes · 31133 edges · 352 communities (316 shown, 36 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2490 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `97420075a2f9e74a` (1005 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- admin-harness.ts
- validate.ts
- column-rules.ts
- code-registry.ts
- cursor-table.property.test.ts
- node-source.ts
- type-check.ts
- browser/build.ts
- Lockstep
- adapter-fixtures.ts
- interfaces/transaction-history-storage.ts
- restore-private.ts
- PrivateTransport
- failures.ts
- private/lockstep-wait.test.ts
- chain-events-decode.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- host.ts
- pg-tx-history-adapter.ts
- HeightRun
- Migration
- postgres/transaction-history-storage.ts
- ws-mutual-tls.test.ts
- chain-placement.test.ts
- lockstep-refusals.test.ts
- 5.1 Layer A: per-key temporal history
- core-block-fetch/metadata.ts
- sweep.ts
- block-fetch-decode.test.ts
- node-bridge.ts
- api-server.ts
- Database
- change-capture.ts
- ledger-sweep.test.ts
- read-height.property.test.ts
- .value
- pglite.ts
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- config/plain-data.test.ts
- childRefKeys
- worker-storage.test.ts
- net.test.ts
- module-api.ts
- module-api.test.ts
- text.test.ts
- networks.ts
- JsonValue
- runner/process.ts
- statementsOf
- Buffer
- checkShape
- ModuleApi
- ChromeTab
- PortSocket
- .from
- browser-harness.ts
- chrome.ts
- ws.ts
- ApiRoutes
- graph.ts
- runner/api.ts
- history.property.test.ts
- worker-threads-worker.ts
- buffer.ts
- Worker
- chain-process.test.ts
- node-format.ts
- public-items.test.ts
- roles.ts
- ref_node_http
- .name
- Heartbeat
- ledger/plain-data.test.ts
- ProcessItems
- module-tables.ts
- sha256
- http.ts
- client.test.ts
- Connection
- stats.ts
- spawnChild
- LedgerPackage
- worker-threads.test.ts
- builder.test.ts
- mutation-evidence.d.mts
- HeightActivity
- AsyncLocalStorage
- client.ts
- writer-lock-checks.ts
- TapeClock
- worker-threads-host.ts
- core-transport.ts
- ModuleDeclaration
- opt-out.test.ts
- range.ts
- BlockLedgerSource
- FinalizedLoop
- SignalSource
- gate
- https.ts
- NodeFS
- backup/backup.ts
- TickerProcess
- transform-checks.ts
- range.test.ts
- db/errors.ts
- contract-modules.test.ts
- ref_node_fs
- config/history.ts
- cli-fixtures.ts
- ledger/types.ts
- loop.ts
- process-worker.ts
- UmbraError
- PgTransactionHistoryStorage
- ingest-harness.ts
- NodeBlockSource
- NodeClient
- declaration.ts
- ledger-storage.test.ts
- private/backends.ts
- slow-block-harness.ts
- core-settings.ts
- intake.test.ts
- vitest
- contract-data-checks.ts
- cbor.ts
- cli/command.ts
- height-versioned.test.ts
- fetch-fixtures.ts
- core-ledger-state.ts
- zero-timeouts-checks.ts
- process-backends.ts
- cursor-table.test.ts
- sweep-tapes.ts
- recovery.test.ts
- boundary.test.ts
- cold-boot-recovery.integration.test.ts
- transport-faults.test.ts
- backup/restore.ts
- held-height.test.ts
- retirement.test.ts
- test/postgres/setup.ts
- real-tapes.ts
- tape/index.ts
- order.property.test.ts
- changes.property.test.ts
- ledger-state.test.ts
- placement.ts
- binding.test.ts
- migrate.ts
- page.ts
- cbor.property.test.ts
- browser.test.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- TransactionHistoryEntry
- Process
- ADDED Requirements
- .position
- Problem
- ADDED Requirements
- .concat
- ledger/ledger-tasks.test.ts
- UmbraDB module guide
- 1. Determinism primitives
- refused
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- core-ledger-state.test.ts
- .slowBlockMs
- mutation-per-adapter.mjs
- ADDED Requirements
- twox.ts
- Full-Chain Storage
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- pack-install.mjs
- scoped-review-manifest
- Design — CORE-ARCH: the standalone indexer's core architecture
- path.ts
- .boolean
- Performance — design
- parseJsonLossless
- continueTo
- Requirement: CF-4 Every field is data, operational or secret
- fresh-instance.mjs
- txResultsItemOf
- crash-worker.ts
- leanProblems
- history
- fn
- .put
- version
- T
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- graph.py
- code
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- Algebraic Specification of the midnight-pg-store Storage Layer
- package.json
- ADDED Requirements
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Design — v1.0.0-durable-checkpoint-cursor
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- ADDED Requirements
- UmbraDB
- stryker.conf.json
- chain_archive lineage
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Design — v1.0.0 API Surface & Release Contract
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- compilerOptions
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- ADDED Requirements
- Design — Sprint 4: Watermarks
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- Design — v1.1.0: Quint model checking
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Security policy & threat model
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0 API Surface & Release Contract
- Tasks — v1.0.0-infosec-signoff
- conformance-gate.mjs
- Contributing
- Checkpoint-store composition contract — cursor ordering and replay
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Storage Algebra Lean M3a Watermarks Sprint
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Repository agent policy
- Our Pledge
- Midnight infra verification checklist
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
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Proposal — Sprint 1: project setup + TemporalKV
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
- Vendored ledger builds
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00023 — The blocks table's height partitions end at 5,000,000
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- 00042 — A stop while the loop waits on an unreachable node does not end the process
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
- README.md

## God Nodes (most connected - your core abstractions)
1. `vitest` - 314 edges
2. `UmbraError` - 296 edges
3. `ModuleDeclaration` - 168 edges
4. `FinalizedLoop` - 118 edges
5. `NodeClient` - 105 edges
6. `InMemoryBlockSource` - 101 edges
7. `Database` - 97 edges
8. `BlockRef` - 93 edges
9. `ReadHandle` - 85 edges
10. `5. Runner` - 76 edges

## Surprising Connections (you probably didn't know these)
- `Problem` --references--> `InMemoryBlockSource`  [INFERRED]
  docs/issues/00036-in-memory-blocks-runtime-2-0-ledger-v9.md → src/runner/in-memory-source.ts
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (352 total, 36 thin omitted)

### Community 0 - "admin-harness.ts"
Cohesion: 0.02
Nodes (246): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStarter, AdminStartOptions (+238 more)

### Community 1 - "validate.ts"
Cohesion: 0.02
Nodes (217): ConfigFacts, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, DigestRow (+209 more)

### Community 10 - "column-rules.ts"
Cohesion: 0.03
Nodes (101): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+93 more)

### Community 100 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 101 - "cursor-table.property.test.ts"
Cohesion: 0.08
Nodes (30): CursorValue, Access, Block, BlockFails, Counts, Write, canonicalText(), expectValue() (+22 more)

### Community 102 - "node-source.ts"
Cohesion: 0.10
Nodes (15): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, NodeSourceOptions, Prefetch, MetadataBlock, RuntimeMetadata, RuntimeMetadataEntry (+7 more)

### Community 103 - "type-check.ts"
Cohesion: 0.10
Nodes (19): TypeCheckFinding, TypeCheckResult, Finding, Finding, configCompilerOptions(), detectedAsModule(), isRegularFile(), packageType() (+11 more)

### Community 104 - "browser/build.ts"
Cohesion: 0.09
Nodes (24): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+16 more)

### Community 109 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 11 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (93): ApplyInput, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+85 more)

### Community 110 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (20): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus, TransactionHistoryWriter, EntryContentSchema (+12 more)

### Community 112 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSideOptions, privateConfig(), heightsFrom(), pmModule() (+14 more)

### Community 113 - "PrivateTransport"
Cohesion: 0.13
Nodes (9): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), readFailure(), reject(), resolve() (+1 more)

### Community 114 - "failures.ts"
Cohesion: 0.12
Nodes (20): ConfigFinding, ReasonCode, RetryCode, Unwrapped, UnexpectedCursor, RetryCondition, configurationRefused(), findingText() (+12 more)

### Community 115 - "private/lockstep-wait.test.ts"
Cohesion: 0.12
Nodes (18): Report, ExpectedWait, ReportRelay, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf() (+10 more)

### Community 117 - "chain-events-decode.test.ts"
Cohesion: 0.10
Nodes (24): MetadataField, MetadataType, Primitive, boundEventSource(), chainEventsOf(), coreChainEventsOnFetch(), metadataView(), writeEventRows() (+16 more)

### Community 118 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 119 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 12 - "host.ts"
Cohesion: 0.04
Nodes (74): LoadLedger, TransactionParser, LedgerStateItem, RetainedState, LedgerName, ApplyOutput, ChainOutcome, LedgerTask (+66 more)

### Community 121 - "pg-tx-history-adapter.ts"
Cohesion: 0.12
Nodes (21): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+13 more)

### Community 123 - "HeightRun"
Cohesion: 0.08
Nodes (11): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, LateRedelivery, SkipsStartAtRestart, CommitsDespiteLastWrite (+3 more)

### Community 125 - "Migration"
Cohesion: 0.09
Nodes (23): Migration, up(), name, 8. Migration, 1. Durability contract, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 4. Save-retry caveat (+15 more)

### Community 126 - "postgres/transaction-history-storage.ts"
Cohesion: 0.11
Nodes (18): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+10 more)

### Community 128 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 13 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (98): BlockParsed, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime (+90 more)

### Community 132 - "lockstep-refusals.test.ts"
Cohesion: 0.17
Nodes (23): LockstepCondition, A118Observation, MismatchObservation, WaitSample, directPublic(), launchPrivate(), poll(), privateModule() (+15 more)

### Community 134 - "5.1 Layer A: per-key temporal history"
Cohesion: 0.08
Nodes (23): Key, Version, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap (+15 more)

### Community 135 - "core-block-fetch/metadata.ts"
Cohesion: 0.25
Nodes (15): MetadataPallet, MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata() (+7 more)

### Community 136 - "sweep.ts"
Cohesion: 0.12
Nodes (13): GreyView, SweepPhase, SweepTables, byBytes(), BYTE_ORDER(), hexOf(), merged(), sweepStep() (+5 more)

### Community 137 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 138 - "node-bridge.ts"
Cohesion: 0.14
Nodes (17): Thread, BridgeServer, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 139 - "api-server.ts"
Cohesion: 0.13
Nodes (21): HeadersArgument, ModuleApiServer, ModuleApiServerOptions, answerHead(), coreHeaders(), coreHeadersResponse(), isCoreHeader(), listenModuleApi() (+13 more)

### Community 14 - "Database"
Cohesion: 0.03
Nodes (66): Database, exclusiveJob, CheckTarget, CliBackend, Snapshot, Settings, LoadOutcome, OutsideRead (+58 more)

### Community 141 - "change-capture.ts"
Cohesion: 0.14
Nodes (13): CapturedTable, CaptureState, captureDefinitions(), capturedTables(), captureFunctionName(), captureTables(), describeTables(), shadowDigits() (+5 more)

### Community 143 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (12): SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints(), compare() (+4 more)

### Community 144 - "read-height.property.test.ts"
Cohesion: 0.13
Nodes (13): Committed, TestBackend, TestDatabase, HeldRead, Job, Outcome, Reads, Step (+5 more)

### Community 149 - ".value"
Cohesion: 0.28
Nodes (7): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 15 - "pglite.ts"
Cohesion: 0.04
Nodes (72): BenchEnv, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions (+64 more)

### Community 150 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 151 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 152 - "config/plain-data.test.ts"
Cohesion: 0.12
Nodes (12): PlainDataRule, Row, instanceOf(), isPlain(), failures(), refusal(), thrown(), valueOf() (+4 more)

### Community 153 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 154 - "worker-storage.test.ts"
Cohesion: 0.16
Nodes (12): StoredNode, StagenetBlockJson, StagenetFixtureJson, Nodes, bytes(), at(), input(), rows() (+4 more)

### Community 155 - "net.test.ts"
Cohesion: 0.17
Nodes (10): NetworkBroker, NetworkMessage, WebSocket, connect(), listen(), pagePort(), useNetwork(), connecting (+2 more)

### Community 156 - "module-api.ts"
Cohesion: 0.13
Nodes (16): ApiErrorCode, HttpMethod, ModuleRegistration, PathSegment, Registration, SubscriptionHandler, SubscriptionRoute, readBody() (+8 more)

### Community 158 - "module-api.test.ts"
Cohesion: 0.12
Nodes (13): ApiError, ApiRequest, ApiResponse, bodyOf(), errorOf(), ok(), "on-start-api"(), API_ERROR_STATUS (+5 more)

### Community 159 - "text.test.ts"
Cohesion: 0.16
Nodes (9): BackupText, createReadStream(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir (+1 more)

### Community 16 - "networks.ts"
Cohesion: 0.04
Nodes (88): MetadataNode, Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem (+80 more)

### Community 160 - "JsonValue"
Cohesion: 0.12
Nodes (17): JsonValue, 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file) (+9 more)

### Community 17 - "runner/process.ts"
Cohesion: 0.04
Nodes (66): Bound, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait, WaitingListener, LoadOptions, SignalTarget (+58 more)

### Community 170 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 171 - "Buffer"
Cohesion: 0.15
Nodes (8): Buffer, Hash, createHash(), 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 174 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 175 - "ModuleApi"
Cohesion: 0.20
Nodes (8): ChainDataAnswer, HttpHandler, HttpRoute, ModuleApi, AddsExtensions, AddsHeaders, VersionsAnswersOnly, graphQLShaped()

### Community 177 - "PortSocket"
Cohesion: 0.24
Nodes (5): PortSocket, pair(), Contract states and contract logs, Requirement: RN-15 Module APIs are registered once, at startup, Scenario: Two modules claim one path

### Community 18 - ".from"
Cohesion: 0.04
Nodes (76): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+68 more)

### Community 180 - "browser-harness.ts"
Cohesion: 0.27
Nodes (13): ProcessName, backupThrough(), call(), eventsOf(), eventWhen(), logOf(), pageWhen(), restoreThrough() (+5 more)

### Community 181 - "chrome.ts"
Cohesion: 0.23
Nodes (11): Cdp, CdpEvent, Download, PageRequest, chrome(), chrome(), chromePath(), chromeVersion() (+3 more)

### Community 182 - "ws.ts"
Cohesion: 0.18
Nodes (6): Emitter, Frame, Listener, PortUpgrade, RawData, WebSocketServer

### Community 183 - "ApiRoutes"
Cohesion: 0.20
Nodes (7): StartedModuleApi, ApiRoutes, AcceptsDuplicates, parsePath(), shapeOf(), routesOf(), routesOf()

### Community 19 - "graph.ts"
Cohesion: 0.03
Nodes (83): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts, Spanned (+75 more)

### Community 190 - "runner/api.ts"
Cohesion: 0.26
Nodes (9): ModuleApiServer, ModuleApiStart, openedProcess, ModuleTableOptions, ModuleApiStart, ApiStartup, ModuleApiOptions, startModuleApi() (+1 more)

### Community 195 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 197 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 198 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 2 - "chain-process.test.ts"
Cohesion: 0.02
Nodes (158): PointName, BlockSource, ChainDataView, ProcessReason, InMemoryBlockSource, InMemoryItems, Wait, HeightFailure (+150 more)

### Community 20 - "node-format.ts"
Cohesion: 0.06
Nodes (57): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+49 more)

### Community 207 - "public-items.test.ts"
Cohesion: 0.23
Nodes (11): A155Observation, Outcome, a155Problems(), a155Run(), against(), jsonSafe(), outcomeOf(), umbraIn() (+3 more)

### Community 21 - "roles.ts"
Cohesion: 0.04
Nodes (63): SchemaWriteHandle, MigrationPart, Difference, OwnPart, PlannedSchema, Provision, QualifiedTable, SchemaItem (+55 more)

### Community 210 - "ref_node_http"
Cohesion: 0.24
Nodes (7): BrowserBuild, pageBench, PageServer, servePage(), listenOnRandomPort(), ISOLATION_HEADERS, TYPES

### Community 213 - ".name"
Cohesion: 0.31
Nodes (4): Fetching, Recorder, params(), Process items and APIs

### Community 216 - "Heartbeat"
Cohesion: 0.31
Nodes (5): Heartbeat, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 217 - "ledger/plain-data.test.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 22 - "module-tables.ts"
Cohesion: 0.05
Nodes (54): CaptureColumn, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead, ColumnType (+46 more)

### Community 220 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 221 - "http.ts"
Cohesion: 0.24
Nodes (5): IncomingMessage, Server, createServer(), unlisten(), UPGRADE_REQUEST

### Community 23 - "client.test.ts"
Cohesion: 0.03
Nodes (43): Answer, FakeNode, Handler, Received, recorded, ManualTimers, bytes(), caught() (+35 more)

### Community 230 - "Connection"
Cohesion: 0.40
Nodes (3): Connection, errorMessage(), encodeJson()

### Community 231 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 24 - "spawnChild"
Cohesion: 0.03
Nodes (65): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+57 more)

### Community 25 - "LedgerPackage"
Cohesion: 0.05
Nodes (38): LedgerEventKind, LedgerPackage, LedgerTaskBlock, NodeStore, StateHandle, LedgerEngine, LedgerTaskFailed, Settled (+30 more)

### Community 26 - "builder.test.ts"
Cohesion: 0.04
Nodes (42): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+34 more)

### Community 261 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 262 - "HeightActivity"
Cohesion: 0.38
Nodes (5): HeightActivity, SlowBlockEvent, NeverClears, NeverClears, Watched

### Community 27 - "client.ts"
Cohesion: 0.07
Nodes (55): Connection, NodeRetry, State, Subscription, Waiter, NodeBlock, NodeRuntimeVersion, NodeCallMethod (+47 more)

### Community 28 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (60): Held, PgliteLockUse, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, acquirePgliteLock() (+52 more)

### Community 286 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 29 - "core-transport.ts"
Cohesion: 0.04
Nodes (66): PublicSideOptions, Session, TransportLimits, TransportTls, Committed, Hello, MessageFault, Parsed (+58 more)

### Community 3 - "ModuleDeclaration"
Cohesion: 0.02
Nodes (134): QueuedBlock, ReadOnlyDatabase, ModuleDeclaration, Revision, GraphInput, ResolvedGraph, StartedModuleApi, BlockItems (+126 more)

### Community 30 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (62): PlacedRefusal, Refusal, Chain, ChainOptions, DigestRow, shadowTableName(), identityRow(), captured() (+54 more)

### Community 31 - "range.ts"
Cohesion: 0.04
Nodes (54): ConnectSocket, NodeWatch, BoundaryBlockReading, BoundaryOptions, TapeBuilder, Arguments, Command, RecordingError (+46 more)

### Community 32 - "FinalizedLoop"
Cohesion: 0.06
Nodes (16): Activity, FinalizedLoop, LoopObserver, Startup, SkipsLockstep, ItemsAfterWrite, FailingAfter, WritingLoop (+8 more)

### Community 33 - "backup/backup.ts"
Cohesion: 0.06
Nodes (66): BackupInput, BackupSeams, BackupTarget, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool (+58 more)

### Community 34 - "transform-checks.ts"
Cohesion: 0.07
Nodes (52): Failure, Variant, TapeError, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange (+44 more)

### Community 35 - "range.test.ts"
Cohesion: 0.04
Nodes (41): ScriptedNode, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, TapeCommandIo, RecordAndReplayResult (+33 more)

### Community 36 - "db/errors.ts"
Cohesion: 0.05
Nodes (49): PostgresOptions, ReadOptions, ReadTimeoutSetting, ErrorCode, ErrorDetails, ResultType, Case, openPostgres() (+41 more)

### Community 37 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (54): ContractLog, LogSite, Program, V9Raw, CoreContractLogsFullOptions, LogEventType, LogItem, Freeable (+46 more)

### Community 39 - "ref_node_fs"
Cohesion: 0.09
Nodes (42): BackupBackend, BackupDatabase, killedRestore, TickerConfig, cliProject, Pem, catalogOf(), hashOf() (+34 more)

### Community 4 - "config/history.ts"
Cohesion: 0.03
Nodes (168): OpenedFacts, CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry (+160 more)

### Community 40 - "cli-fixtures.ts"
Cohesion: 0.05
Nodes (49): CheckStep, ConfigCheckReport, RunningCommand, statsConfig, StopBy, configCheck(), configText(), coreSettings() (+41 more)

### Community 41 - "ledger/types.ts"
Cohesion: 0.05
Nodes (48): AdapterSpec, LedgerRelease, LedgerReleasePackage, LedgerEvent, LedgerPackageOptions, TransactionResult, VmLog, V9Logs (+40 more)

### Community 42 - "loop.ts"
Cohesion: 0.07
Nodes (55): HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments, PointRun (+47 more)

### Community 43 - "process-worker.ts"
Cohesion: 0.06
Nodes (46): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, Scope, crossedError, FromProcessWorker, StartRun (+38 more)

### Community 44 - "UmbraError"
Cohesion: 0.06
Nodes (34): LoadedConfig, LoadOptions, PgliteLockUse, JobQueue, PgliteDatabase, BoundedRead, UmbraError, BlockOptions (+26 more)

### Community 46 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (55): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order) (+47 more)

### Community 47 - "ingest-harness.ts"
Cohesion: 0.07
Nodes (51): RestoreInput, NodeClientOptions, CrashEvent, CrashJob, ingest, IngestOptions, SourceClass, watched (+43 more)

### Community 48 - "NodeBlockSource"
Cohesion: 0.08
Nodes (14): HeadWait, NodeBlockSource, NodeHeader, PreparedBlock, QueueRunner, EventsRunner, NoWindow, Refetches (+6 more)

### Community 49 - "NodeClient"
Cohesion: 0.08
Nodes (30): CoreChainBinding, HeadSubscriber, NodeClient, Pending, connectionFailure, Opened, WatchedClient, finalizedHeight() (+22 more)

### Community 5 - "declaration.ts"
Cohesion: 0.03
Nodes (115): BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, UnsureReason, CoreContractStatesOptions, BlockWriteHandle, ReadHandle (+107 more)

### Community 50 - "ledger-storage.test.ts"
Cohesion: 0.07
Nodes (49): RestartEvent, RestartJob, retentionSeen, LedgerTx, Reader, retainedStatesOf(), a76Problems(), heightsIn() (+41 more)

### Community 51 - "private/backends.ts"
Cohesion: 0.07
Nodes (43): PrivateBackend, SessionSeen, A162Options, a162Run, HeaderSeen, Pause, Q142Observation, InstancesOptions (+35 more)

### Community 52 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (46): BlockEventSource, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+38 more)

### Community 53 - "core-settings.ts"
Cohesion: 0.05
Nodes (49): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, ConfiguredLedgerTable, DeepReadonly (+41 more)

### Community 54 - "intake.test.ts"
Cohesion: 0.08
Nodes (43): PublicSide, PrivateProcess, PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals (+35 more)

### Community 55 - "vitest"
Cohesion: 0.04
Nodes (31): Lockfile, Manifest, RepositoryFile, Upstream, ReportedTest, canPin(), pinViolations(), repositoryFiles() (+23 more)

### Community 56 - "contract-data-checks.ts"
Cohesion: 0.10
Nodes (50): ContractStateRow, CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+42 more)

### Community 57 - "cbor.ts"
Cohesion: 0.08
Nodes (45): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+37 more)

### Community 58 - "cli/command.ts"
Cohesion: 0.07
Nodes (40): RestoreChain, RestoreSeams, BackupOutcome, CommandHandler, CommandIo, MainProcess, commandTarget, Chain (+32 more)

### Community 59 - "height-versioned.test.ts"
Cohesion: 0.08
Nodes (36): heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Control, StoredVersion, Block, BlockFails, Counts (+28 more)

### Community 6 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (100): NodeCallOptions, ProcessCondition, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME (+92 more)

### Community 61 - "core-ledger-state.ts"
Cohesion: 0.07
Nodes (44): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions, applyBlock(), boundLedger(), bytesOf() (+36 more)

### Community 62 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (35): Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings(), apiRead() (+27 more)

### Community 63 - "process-backends.ts"
Cohesion: 0.08
Nodes (40): TasksRun, Flaky, CallArgsItem, CallArguments, taskSeen, V9Raw, ProcessBackend, countMainThreadParses() (+32 more)

### Community 64 - "cursor-table.test.ts"
Cohesion: 0.06
Nodes (31): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, optOut, Case (+23 more)

### Community 65 - "sweep-tapes.ts"
Cohesion: 0.11
Nodes (43): FixtureRun, TableSnapshot, FixtureNode, FakeState, RefusalData, startLedgerWorker(), refusalHalt(), refusalHeight() (+35 more)

### Community 66 - "recovery.test.ts"
Cohesion: 0.06
Nodes (35): CommitOutcome, HeldHeight, Armed, CommitArm, CommitFault, CommitProxy, Pair, Outcomes (+27 more)

### Community 67 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 68 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.08
Nodes (28): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+20 more)

### Community 69 - "transport-faults.test.ts"
Cohesion: 0.08
Nodes (33): ResultColumn, Message, MessageType, TestCertificates, Ended, rawClient, mutualTlsOptions(), hexOf() (+25 more)

### Community 7 - "backup/restore.ts"
Cohesion: 0.03
Nodes (63): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, SourceTransport, PublicConfiguration, PublicDatabase (+55 more)

### Community 71 - "held-height.test.ts"
Cohesion: 0.09
Nodes (38): WaitingInRead, Faults, LostCommit, Seen, AtGate, LoopClass, RunnerDatabase, settlesWithin() (+30 more)

### Community 73 - "retirement.test.ts"
Cohesion: 0.07
Nodes (39): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), manifestProblems(), mutationProblems() (+31 more)

### Community 74 - "test/postgres/setup.ts"
Cohesion: 0.06
Nodes (35): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, Sql, SuiteWatchdogTimeoutError, pool() (+27 more)

### Community 77 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 8 - "tape/index.ts"
Cohesion: 0.04
Nodes (77): BoundaryReading, Link, TapeBuilderOptions, CompletenessRange, RecordingProblem, TapeProblem, TransformProblem, readRequest (+69 more)

### Community 80 - "order.property.test.ts"
Cohesion: 0.08
Nodes (35): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, recording(), runOf(), yields() (+27 more)

### Community 81 - "changes.property.test.ts"
Cohesion: 0.08
Nodes (36): ChangeKind, tableChanges, TouchedRow, Op, States, TableName, digestBlock(), encodeCanonical() (+28 more)

### Community 85 - "ledger-state.test.ts"
Cohesion: 0.12
Nodes (32): Call, SeenLoad, recordedGenesis, FoundTape, Tape, coreLedgerState(), until(), timed() (+24 more)

### Community 88 - "placement.ts"
Cohesion: 0.09
Nodes (32): BodyExtrinsic, ExtrinsicCall, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsedOptions, ChainTransaction, ChainEvent (+24 more)

### Community 89 - "binding.test.ts"
Cohesion: 0.09
Nodes (22): TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, TransportProxy, privateCursorHeight() (+14 more)

### Community 9 - "migrate.ts"
Cohesion: 0.04
Nodes (92): Transaction, AppliedRow, Runnable, Settling, StartupInput, SchemaPlan, BlockWrites, Point (+84 more)

### Community 91 - "page.ts"
Cohesion: 0.07
Nodes (29): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog(), backUp() (+21 more)

### Community 93 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 94 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 95 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.06
Nodes (35): Absent, n(), 1. TemporalKV — event-sourced right action with a CAS guard, 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status (+27 more)

### Community 96 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 97 - "Process"
Cohesion: 0.13
Nodes (6): CoreTransport, Process, messageOf(), pause(), losingCommits(), landingCommits()

### Community 105 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): Private modules, ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database (+21 more)

### Community 247 - ".position"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 269 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 106 - "ADDED Requirements"
Cohesion: 0.06
Nodes (28): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage, ADDED Requirements (+20 more)

### Community 120 - ".concat"
Cohesion: 0.07
Nodes (23): probe(), records, 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline (+15 more)

### Community 122 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.10
Nodes (20): boundHost(), frozen(), resultsOf(), withItems(), withLedgerTaskPoints(), withLedgerTasks(), applyBlock(), at() (+12 more)

### Community 140 - "UmbraDB module guide"
Cohesion: 0.09
Nodes (21): hexBytes(), migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Cursor tables, Data that is not a function of the chain, Height-versioned tables, Ledger tasks, Migrations (+13 more)

### Community 145 - "1. Determinism primitives"
Cohesion: 0.13
Nodes (19): refuseNonDeterministic(), catalogRelations(), schemaFilter(), databaseRefusals(), explainRefusal(), refusalMessage(), relationRefusals(), tableRefusals() (+11 more)

### Community 146 - "refused"
Cohesion: 0.11
Nodes (19): refused(), When a callback fails, 7. Storage helpers, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-5 `/status` and `/config` contents (+11 more)

### Community 161 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (16): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface (+8 more)

### Community 169 - "core-ledger-state.test.ts"
Cohesion: 0.13
Nodes (10): boundLedgerParser(), itemsOf(), writeBlock(), applied(), bound(), query(), refusing(), CORE_LEDGER_STATE_MIGRATIONS (+2 more)

### Community 172 - ".slowBlockMs"
Cohesion: 0.15
Nodes (13): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+5 more)

### Community 179 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 184 - "ADDED Requirements"
Cohesion: 0.14
Nodes (12): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row, Scenario: Backup in the page (+4 more)

### Community 189 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 200 - "Full-Chain Storage"
Cohesion: 0.17
Nodes (11): store(), 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 3. Semantic decode: `chain-archive-sync/tx-replay-decoder.ts`, 4. How to run it (+3 more)

### Community 202 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 211 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 219 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 223 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 232 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.22
Nodes (7): 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 9.2 Browser build (BR), 9. Backups and browser, Design — CORE-ARCH: the standalone indexer's core architecture

### Community 241 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 246 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 250 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 267 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 272 - "continueTo"
Cohesion: 0.40
Nodes (5): continueTo(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 306 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.40
Nodes (5): released(), Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases

### Community 308 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 319 - "txResultsItemOf"
Cohesion: 0.50
Nodes (4): chainOutcomesOf(), txResultsItemOf(), writeResultRows(), everyLiteral()

### Community 322 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 323 - "leanProblems"
Cohesion: 0.50
Nodes (4): leanImports(), leanProblems(), leanTheorems(), retiredLean()

### Community 38 - "history"
Cohesion: 0.04
Nodes (65): integer(), history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+57 more)

### Community 45 - "fn"
Cohesion: 0.04
Nodes (60): fn(), 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure (+52 more)

### Community 60 - ".put"
Cohesion: 0.04
Nodes (48): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+40 more)

### Community 70 - "version"
Cohesion: 0.05
Nodes (44): version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5) (+36 more)

### Community 78 - "T"
Cohesion: 0.05
Nodes (40): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+32 more)

### Community 83 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (34): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change) (+26 more)

### Community 86 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 99 - "code"
Cohesion: 0.08
Nodes (30): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21), The catalog, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog (+22 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+23 more)

### Community 108 - "Full-Chain Storage — Design"
Cohesion: 0.07
Nodes (29): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+21 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 124 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.08
Nodes (19): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Superseded — see `Formal/STORAGE_ALGEBRA.md`, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan (+11 more)

### Community 127 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 131 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 133 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 142 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 147 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric` (+12 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 162 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 163 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 164 - "chain_archive lineage"
Cohesion: 0.12
Nodes (17): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, CheckpointStore tables, How the two lineages coexist (+9 more)

### Community 165 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 167 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 168 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 173 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 186 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 187 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.14
Nodes (13): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 3.1 The frozen catalog (the machine-facing API), 3.2 Promote retryability to a machine-readable field, 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+5 more)

### Community 191 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 192 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 193 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 194 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 196 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 201 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.17
Nodes (12): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4.2 — The 1.0.0 tag gate, §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did (+4 more)

### Community 203 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 204 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 205 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 206 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.17
Nodes (11): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live` (+3 more)

### Community 208 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 209 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 212 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 214 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 215 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.18
Nodes (10): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds, 8. CI (+2 more)

### Community 222 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 224 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 225 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 226 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 227 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 228 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 229 - "Tasks — v1.1.0: Quint model checking"
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

### Community 238 - "Tasks — v1.0.0 API Surface & Release Contract"
Cohesion: 0.22
Nodes (8): 1. Pre-freeze: retryability field (G3), 2. Pre-freeze: strip / mark-experimental the chain-archive error classes (G3), 3. The freeze: build + package.json (G1), 5. Release contract docs (G2, G4), 6. Freeze the Lean cut-line (G20), 7. Packed-tarball install smoke test (G1), 8. Change close-out, Tasks — v1.0.0 API Surface & Release Contract

### Community 239 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 240 - "conformance-gate.mjs"
Cohesion: 0.22
Nodes (8): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli

### Community 242 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 243 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 244 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 245 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 248 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 249 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 252 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 253 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 254 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 255 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 256 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 257 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 258 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 259 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 260 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 264 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 265 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 266 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 268 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 270 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 271 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 273 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 274 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 275 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 276 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 277 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 278 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 279 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 280 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 281 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 282 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 284 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 285 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 287 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 288 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 289 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 290 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 291 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 292 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

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

### Community 297 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 298 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 299 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 300 - "00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`"
Cohesion: 0.40
Nodes (4): 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 301 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 302 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 303 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.40
Nodes (4): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Suggested fix

### Community 304 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 305 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 307 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 309 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 310 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 311 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 312 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 313 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 314 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 315 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 316 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 317 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 328 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 329 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 72 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 82 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-16 Chain-data reads name their view and height, Requirement: RN-1 The main program is a fixed sequence of points (+29 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 98 - "README.md"
Cohesion: 0.08
Nodes (16): For historical reference only, Phase → current status map, Tasks — superseded by per-sprint openspec changes, 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented), Summary (+8 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3669 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `admin-harness.ts`, `validate.ts`, `chain-process.test.ts`, `ModuleDeclaration`, `config/history.ts`, `declaration.ts`, `fetch-fixtures.ts`, `backup/restore.ts`, `tape/index.ts`, `migrate.ts`, `column-rules.ts`, `adapter-fixtures.ts`, `host.ts`, `chain-placement.test.ts`, `Database`, `pglite.ts`, `networks.ts`, `runner/process.ts`, `.from`, `graph.ts`, `node-format.ts`, `roles.ts`, `module-tables.ts`, `client.test.ts`, `spawnChild`, `builder.test.ts`, `client.ts`, `writer-lock-checks.ts`, `core-transport.ts`, `opt-out.test.ts`, `backup/backup.ts`, `transform-checks.ts`, `range.test.ts`, `db/errors.ts`, `contract-modules.test.ts`, `ref_node_fs`, `cli-fixtures.ts`, `ledger/types.ts`, `loop.ts`, `process-worker.ts`, `UmbraError`, `ingest-harness.ts`, `ledger-storage.test.ts`, `private/backends.ts`, `slow-block-harness.ts`, `core-settings.ts`, `intake.test.ts`, `contract-data-checks.ts`, `cli/command.ts`, `height-versioned.test.ts`, `core-ledger-state.ts`, `zero-timeouts-checks.ts`, `process-backends.ts`, `cursor-table.test.ts`, `sweep-tapes.ts`, `recovery.test.ts`, `boundary.test.ts`, `cold-boot-recovery.integration.test.ts`, `transport-faults.test.ts`, `held-height.test.ts`, `retirement.test.ts`, `test/postgres/setup.ts`, `real-tapes.ts`, `order.property.test.ts`, `changes.property.test.ts`, `ledger-state.test.ts`, `binding.test.ts`, `cbor.property.test.ts`, `browser.test.ts`, `code-registry.ts`, `cursor-table.property.test.ts`, `type-check.ts`, `browser/build.ts`, `Lockstep`, `restore-private.ts`, `failures.ts`, `private/lockstep-wait.test.ts`, `chain-events-decode.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `pg-tx-history-adapter.ts`, `ledger/ledger-tasks.test.ts`, `package.json`, `ws-mutual-tls.test.ts`, `lockstep-refusals.test.ts`, `block-fetch-decode.test.ts`, `node-bridge.ts`, `ledger-sweep.test.ts`, `read-height.property.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `config/plain-data.test.ts`, `worker-storage.test.ts`, `net.test.ts`, `module-api.test.ts`, `text.test.ts`, `core-ledger-state.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `excluded-not-exported.test.ts`, `twox.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `public-items.test.ts`, `Heartbeat`, `ledger/plain-data.test.ts`, `worker-threads.test.ts`?**
  _High betweenness centrality (0.243) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017821074269371705 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `admin-harness.ts`, `validate.ts`, `chain-process.test.ts`, `ModuleDeclaration`, `config/history.ts`, `declaration.ts`, `fetch-fixtures.ts`, `backup/restore.ts`, `lockstep-refusals.test.ts`, `migrate.ts`, `tape/index.ts`, `UmbraDB module guide`, `host.ts`, `Database`, `pglite.ts`, `networks.ts`, `runner/process.ts`, `1. Determinism primitives`, `graph.ts`, `roles.ts`, `module-tables.ts`, `client.test.ts`, `config/plain-data.test.ts`, `client.ts`, `writer-lock-checks.ts`, `core-transport.ts`, `module-api.ts`, `opt-out.test.ts`, `module-api.test.ts`, `backup/backup.ts`, `range.ts`, `FinalizedLoop`, `db/errors.ts`, `transform-checks.ts`, `core-ledger-state.test.ts`, `statementsOf`, `process-worker.ts`, `loop.ts`, `checkShape`, `NodeBlockSource`, `NodeClient`, `slow-block-harness.ts`, `core-settings.ts`, `ApiRoutes`, `vitest`, `cbor.ts`, `cli/command.ts`, `height-versioned.test.ts`, `core-ledger-state.ts`, `zero-timeouts-checks.ts`, `process-backends.ts`, `cursor-table.test.ts`, `recovery.test.ts`, `transport-faults.test.ts`, `held-height.test.ts`, `public-items.test.ts`, `changes.property.test.ts`, `binding.test.ts`, `sha256`, `node-source.ts`, `Design — CORE-ARCH: the standalone indexer's core architecture`, `PrivateTransport`, `failures.ts`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `validate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01990049751243781 - nodes in this community are weakly interconnected._