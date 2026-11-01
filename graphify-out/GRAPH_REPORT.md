# Graph Report - UmbraDB

## Corpus Check
- 1147 files · ~1,596,665 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11924 nodes · 36342 edges · 364 communities (327 shown, 37 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2924 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `a568daf68aba2799` (1147 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- admin-harness.ts
- declaration.ts
- version-checks.ts
- postgres/transaction-history-storage.ts
- documents.ts
- src/ledger/identity.ts
- pg-tx-history-adapter.ts
- ref_node_http
- PrivateTransport
- src/db/postgres.ts
- Lockstep
- read-gate.ts
- test/postgres/setup.ts
- mapping.ts
- binding.test.ts
- restore-private.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- db/errors.ts
- threat-model.test.ts
- node-format.ts
- surface.test.ts
- containers.test.ts
- placement.ts
- BlockItems
- node-bridge.ts
- range.test.ts
- ProcessContexts
- net.test.ts
- options.ts
- ref_node_url
- pack-install.mjs
- example-checks.ts
- .concat
- block-fetch-decode.test.ts
- host.ts
- harness.ts
- .name
- core-block-fetch/metadata.ts
- ledger-sweep.test.ts
- fixtures/configuration.ts
- adapter-fixtures.ts
- chain-events-decode.test.ts
- childRefKeys
- chrome.ts
- read-height.property.test.ts
- .query
- ws.ts
- describeNodeStoreExports
- core-transport.ts
- LoopPauses
- browser-harness.ts
- node-store-suite.ts
- contract-data-checks.ts
- validation.test.ts
- PortSocket
- ws-mutual-tls.test.ts
- Design — Sprint 1: project setup + TemporalKV
- statementsOf
- checkShape
- Worker
- ref_node_crypto
- .#close
- core.ts
- web-lock.ts
- src/protocol.ts
- api-server.test.ts
- no-indexer-or-wallet-sdk.test.ts
- browser/serve.ts
- worker-threads.test.ts
- midnight-env — reproducible PREPROD dev environment
- InMemoryBlockSource
- ModuleDeclaration
- reasonOf
- conformance-gate.test.ts
- history.property.test.ts
- worker-threads-worker.ts
- buffer.ts
- client.test.ts
- Heartbeat
- .send
- Reader
- ReadHandle
- sweepStep
- ledger/plain-data.ts
- browser/src/config/load.ts
- src/index.ts
- postgres-image.test.ts
- BlockRef
- serve-checks.ts
- runner/process.ts
- ledger/types.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- loop.ts
- loop.test.ts
- timeouts.test.ts
- vitest
- ref_node_fs
- NodeClient
- NodeBlockSource
- HeightActivity
- listenerProblems
- core-private-source.test.ts
- LedgerPackage
- BYTE_ORDER
- CliBackend
- https.ts
- NodeFS
- FinalizedLoop
- RetryCode
- cbor.ts
- UmbraError
- ledger/ledger-tasks.test.ts
- config-check.ts
- intake.test.ts
- column-rules.ts
- core-block-commit.test.ts
- PgTransactionHistoryStorage
- range.ts
- slow-block-harness.ts
- builds.ts
- core-ledger-state.ts
- .from
- core-settings.ts
- interfaces/transaction-history-storage.ts
- Database
- boundary.test.ts
- graph.ts
- retirement.test.ts
- core-block-parsed.ts
- loop-stop-harness.ts
- backup/backup.ts
- ingest-harness.ts
- Process
- events-fixtures.ts
- spawnChild
- real-tapes.ts
- cold-boot-recovery.integration.test.ts
- validate.ts
- core-ledger-state/sql.ts
- graph.test.ts
- page.ts
- release-version.ts
- pglite-lock.ts
- tape/index.ts
- resolver-boundary.ts
- HeightRun
- browser.test.ts
- checks.test.ts
- TransactionHistoryEntry
- .value
- browser/build.ts
- file-modes.ts
- fetch-fixtures.ts
- process-context.test.ts
- node-fields-harness.ts
- module-api.test.ts
- code-registry.ts
- code
- startup-stop-harness.ts
- paused-harness.ts
- 7. Storage helpers
- Design — Sprint 3: CheckpointStore
- transportReader
- Acceptance — START-UMBRADB: UmbraDB as a library
- T
- mapping.test.ts
- Design — v1.0.0 API Surface & Release Contract
- vendored-ledger-v9.test.ts
- core-tx-results.ts
- conformance-gate.mjs
- mutation-per-adapter.mjs
- core-ledger-state.test.ts
- twox.ts
- Design — v1.1.0: Quint model checking
- Boundaries, threats and controls
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- .boolean
- Requirement: BK-1 Backup
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- read-only-checks.ts
- crash-worker.ts
- fs.ts
- .put
- version
- history
- graph.py
- UmbraDB module guide
- ADDED Requirements
- backupAtStop
- .slowBlockMs
- refused
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- Requirement: BK-1 Backup
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- README.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Requirement: DT-6 Stored data avoids non-deterministic values
- Requirement: CF-4 Every field is data, operational or secret
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- [0.9.5] - 2026-07-25 — "Penumbra"
- scoped-review-manifest
- ROADMAP.md
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- UmbraDB in a browser
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- The laws of UmbraDB's storage helpers
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0-durable-checkpoint-cursor
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
- UmbraDB node architecture
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
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
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time
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
- 00054 — A slow-block test hung inside PGlite for over an hour
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- bug-report.md
- feature-request.md
- Tasks — Sprint 1: project setup + TemporalKV
- Requirement: RN-16 Chain-data reads name their view and height
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Test wallets
- Spec — capability `formal-completion`
- renovate.json
- start-stack.sh
- peerDependenciesMeta
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
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 390 edges
2. `UmbraError` - 336 edges
3. `ModuleDeclaration` - 187 edges
4. `InMemoryBlockSource` - 145 edges
5. `FinalizedLoop` - 133 edges
6. `NodeClient` - 116 edges
7. `Database` - 101 edges
8. `BlockRef` - 99 edges
9. `ReadHandle` - 91 edges
10. `NodeBlockSource` - 81 edges

## Surprising Connections (you probably didn't know these)
- `Evidence` --references--> `ManualTimers`  [INFERRED]
  docs/issues/00016-heartbeat-above-timer-limit.md → test/node/manual-timers.ts
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

## Communities (364 total, 37 thin omitted)

### Community 0 - "admin-harness.ts"
Cohesion: 0.02
Nodes (228): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStarter, AdminStartOptions (+220 more)

### Community 1 - "declaration.ts"
Cohesion: 0.02
Nodes (245): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput, CoreSettings (+237 more)

### Community 10 - "version-checks.ts"
Cohesion: 0.03
Nodes (141): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry (+133 more)

### Community 100 - "postgres/transaction-history-storage.ts"
Cohesion: 0.10
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+11 more)

### Community 102 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 103 - "src/ledger/identity.ts"
Cohesion: 0.13
Nodes (25): ManifestLine, VerifyLedgerPackagesOptions, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages(), checkPackageFiles() (+17 more)

### Community 105 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 108 - "ref_node_http"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 109 - "PrivateTransport"
Cohesion: 0.12
Nodes (9): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), rowsOf() (+1 more)

### Community 11 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (123): BenchEnv, SslMode, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, driverConnectionOptions, DriverError (+115 more)

### Community 110 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 111 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 112 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 113 - "mapping.ts"
Cohesion: 0.13
Nodes (26): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+18 more)

### Community 114 - "binding.test.ts"
Cohesion: 0.13
Nodes (25): A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), cursorOf(), a113Problems() (+17 more)

### Community 117 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSideOptions, privateConfig(), heightsFrom() (+14 more)

### Community 118 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 119 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 12 - "db/errors.ts"
Cohesion: 0.03
Nodes (111): ConfiguredDatabaseOptions, ConfiguredDatabaseOptions, CommittedHeight, ReadOptions, ReadTimeoutSetting, Job, Outcome, PgliteOptions (+103 more)

### Community 120 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 123 - "node-format.ts"
Cohesion: 0.16
Nodes (18): Child, Readable, Reader, TableNode, node(), childKey(), concat(), decodeChildren() (+10 more)

### Community 124 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 126 - "containers.test.ts"
Cohesion: 0.10
Nodes (17): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), watcherInput(), removeAttempt(), parentWithContainer() (+9 more)

### Community 127 - "placement.ts"
Cohesion: 0.13
Nodes (23): MetadataVariant, BlockParsedOptions, ChainTransaction, ChainEvent, EventPhase, RecordTypes, ScaleValue, callVariant() (+15 more)

### Community 128 - "BlockItems"
Cohesion: 0.11
Nodes (13): QueuedBlock, ItemSink, BlockItems, LateUse, EagerItems, EagerLoop, KeptItems, KeptLoop (+5 more)

### Community 129 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 13 - "range.test.ts"
Cohesion: 0.02
Nodes (74): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+66 more)

### Community 130 - "ProcessContexts"
Cohesion: 0.11
Nodes (5): MisuseReports, ProcessContexts, ProcessItems, providesProcessItem(), sealed()

### Community 131 - "net.test.ts"
Cohesion: 0.13
Nodes (13): NetworkBroker, IncomingMessage, Server, NetworkMessage, createServer(), listen(), pagePort(), unlisten() (+5 more)

### Community 132 - "options.ts"
Cohesion: 0.16
Nodes (24): readOptions, addressFindings(), configFindings(), finding(), isHost(), isObject(), keysOf(), librarySettingsRefusal() (+16 more)

### Community 134 - "ref_node_url"
Cohesion: 0.12
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 136 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 137 - "example-checks.ts"
Cohesion: 0.16
Nodes (17): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+9 more)

### Community 138 - ".concat"
Cohesion: 0.12
Nodes (12): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+4 more)

### Community 139 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 14 - "host.ts"
Cohesion: 0.03
Nodes (102): LoadLedger, TransactionParser, LedgerStateItem, RetainedState, LedgerName, LedgerSource, ChainOutcome, LedgerTask (+94 more)

### Community 140 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 142 - ".name"
Cohesion: 0.13
Nodes (12): Fetching, Recorder, Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS (+4 more)

### Community 147 - "core-block-fetch/metadata.ts"
Cohesion: 0.24
Nodes (15): MetadataField, MetadataStorage, MetadataStorageEntry, Primitive, TypeDef, ScaleError, field(), pallet() (+7 more)

### Community 148 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (12): SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints(), compare() (+4 more)

### Community 149 - "fixtures/configuration.ts"
Cohesion: 0.14
Nodes (16): BrowserConfiguration, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration(), param(), privateConfiguration() (+8 more)

### Community 15 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (121): ApplyInput, ApplyOutput, StoredNode, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject (+113 more)

### Community 150 - "chain-events-decode.test.ts"
Cohesion: 0.13
Nodes (17): MetadataType, canonicalJson(), hexOf(), littleEndian(), fill(), hexOf(), le(), merge() (+9 more)

### Community 151 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 152 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 153 - "read-height.property.test.ts"
Cohesion: 0.13
Nodes (12): TestBackend, HeldRead, Job, Outcome, Reads, Step, concurrent(), queued() (+4 more)

### Community 154 - ".query"
Cohesion: 0.17
Nodes (16): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), snapshot(), "on-after-db-write"() (+8 more)

### Community 157 - "ws.ts"
Cohesion: 0.13
Nodes (9): Emitter, Frame, Listener, PortUpgrade, RawData, WebSocket, WebSocketServer, connect() (+1 more)

### Community 158 - "describeNodeStoreExports"
Cohesion: 0.17
Nodes (4): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports()

### Community 16 - "core-transport.ts"
Cohesion: 0.03
Nodes (112): ResultColumn, Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, Message (+104 more)

### Community 163 - "LoopPauses"
Cohesion: 0.16
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 166 - "browser-harness.ts"
Cohesion: 0.27
Nodes (16): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+8 more)

### Community 167 - "node-store-suite.ts"
Cohesion: 0.16
Nodes (15): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, runInFreshInstance(), hasEmbeddedChild(), hex() (+7 more)

### Community 17 - "contract-data-checks.ts"
Cohesion: 0.03
Nodes (123): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+115 more)

### Community 171 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 172 - "PortSocket"
Cohesion: 0.22
Nodes (6): PortSocket, params(), pair(), 7. The module API, Requirement: RN-15 Module APIs are registered once, at startup, Scenario: Two modules claim one path

### Community 173 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 174 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 176 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 177 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 178 - "Worker"
Cohesion: 0.21
Nodes (3): Worker, 9.2 Browser build (BR), 9. Backups and browser

### Community 18 - "ref_node_crypto"
Cohesion: 0.03
Nodes (119): TableDigest, TableDigestRow, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow, GuardTableRow (+111 more)

### Community 185 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 186 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 187 - "src/protocol.ts"
Cohesion: 0.20
Nodes (11): Scope, crossedError, StartRun, ToProcessWorker, answer(), backUp(), post(), startWorkerProcess() (+3 more)

### Community 19 - "api-server.test.ts"
Cohesion: 0.03
Nodes (103): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ApiRegistry, Connection, HeadersArgument, ModuleApiServer (+95 more)

### Community 192 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 193 - "browser/serve.ts"
Cohesion: 0.22
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 194 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 196 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 2 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (194): ProcessReason, InMemoryBlockSource, InMemoryItems, Wait, LoopInput, EngineOptions, ProcessHandle, ProcessingEnd (+186 more)

### Community 20 - "ModuleDeclaration"
Cohesion: 0.03
Nodes (116): BrowserRun, PrivateInstance, OpenedFacts, CoreChainFacts, RestoreBase, RestoreChain, BackupOutcome, CommandBuildOptions (+108 more)

### Community 200 - "reasonOf"
Cohesion: 0.31
Nodes (10): ConfigFinding, configurationRefused(), findingText(), refusalFindings(), configurationFindings(), configurationRefusalLines(), isConfigurationRefusal(), messageOf() (+2 more)

### Community 201 - "conformance-gate.test.ts"
Cohesion: 0.19
Nodes (10): GateRun, Pids, guardPid(), alive(), kill(), readPids(), survivors(), GATE (+2 more)

### Community 202 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 204 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 205 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 21 - "client.test.ts"
Cohesion: 0.03
Nodes (66): NodeCallOptions, NodeClientOptions, ConnectSocket, RecordingClient, HandSockets, Answer, FakeNode, Handler (+58 more)

### Community 211 - "Heartbeat"
Cohesion: 0.27
Nodes (5): Heartbeat, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 213 - "Reader"
Cohesion: 0.33
Nodes (5): Reader, decodeChild(), readChild(), readChildList(), taggedRootKey()

### Community 22 - "ReadHandle"
Cohesion: 0.03
Nodes (82): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue (+74 more)

### Community 222 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 223 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 224 - "browser/src/config/load.ts"
Cohesion: 0.29
Nodes (9): LoadedConfig, LoadOptions, configModuleUrl(), configPath(), loadConfig(), loadModuleList(), noFile(), DEFAULT_CONFIG_FILE (+1 more)

### Community 23 - "src/index.ts"
Cohesion: 0.03
Nodes (82): BackupWritten, PrivateLinkChannel, Address, NodeHttpHandler, NodeUpgradeHandler, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd (+74 more)

### Community 235 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 24 - "BlockRef"
Cohesion: 0.04
Nodes (85): ChainCheck, ChainCheckInput, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, PrivateLinkAddress, PublicConfiguration (+77 more)

### Community 243 - "serve-checks.ts"
Cohesion: 0.33
Nodes (4): Served, isolationProblems(), serveCommand(), ISOLATION

### Community 25 - "runner/process.ts"
Cohesion: 0.03
Nodes (80): ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ConfigRow, ConfigHashRow, LoadOptions, transportReaderFacts (+72 more)

### Community 26 - "ledger/types.ts"
Cohesion: 0.03
Nodes (84): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+76 more)

### Community 263 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "loop.ts"
Cohesion: 0.04
Nodes (97): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+89 more)

### Community 28 - "loop.test.ts"
Cohesion: 0.04
Nodes (88): EntryRange, LockstepWait, LoopEnd, SlowBlockEvent, Contexts, Faults, LostCommit, Seen (+80 more)

### Community 285 - "timeouts.test.ts"
Cohesion: 0.33
Nodes (5): ReportedTest, CONFIG, FIXTURE_CONFIG, REPOSITORY, VITEST_CLI

### Community 29 - "vitest"
Cohesion: 0.04
Nodes (71): startHashDecision, PostgresParts, a165Run, Attempt, PrivateBackend, SessionSeen, TestDatabase, A162Options (+63 more)

### Community 3 - "ref_node_fs"
Cohesion: 0.02
Nodes (185): BackupSeams, RestoreSeams, CommandHandler, CommandIo, MainProcess, ConfigCheckReport, RestoreCommandSeams, backupSignalRelay (+177 more)

### Community 30 - "NodeClient"
Cohesion: 0.05
Nodes (58): CoreChainBinding, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State (+50 more)

### Community 31 - "NodeBlockSource"
Cohesion: 0.04
Nodes (48): CoreBlockItems, RuntimeMetadataView, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeSubscription, NodeBlock (+40 more)

### Community 318 - "HeightActivity"
Cohesion: 0.60
Nodes (3): HeightActivity, NeverClears, NeverClears

### Community 32 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (43): PrivateBlockSource, SourceTransport, StartHashes, PublicDatabase, PublicWakes, readConfigHash(), readConfigRows(), bytesOfHex() (+35 more)

### Community 33 - "LedgerPackage"
Cohesion: 0.05
Nodes (47): LedgerPackage, StateHandle, LedgerEngine, Settled, StagenetBlockJson, StagenetFixtureJson, stagenetReplay, Nodes (+39 more)

### Community 34 - "FinalizedLoop"
Cohesion: 0.05
Nodes (23): Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, DoesNotHold, EndsTheRun, SkipsLockstep (+15 more)

### Community 35 - "cbor.ts"
Cohesion: 0.04
Nodes (74): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+66 more)

### Community 36 - "UmbraError"
Cohesion: 0.04
Nodes (34): PostgresConnection, PostgresOptions, JobQueue, PgliteDatabase, BoundedRead, ReadPool, Session, Writer (+26 more)

### Community 37 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (58): TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses() (+50 more)

### Community 38 - "config-check.ts"
Cohesion: 0.05
Nodes (52): CheckFinding, CheckStep, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, ReadDatabaseOptions (+44 more)

### Community 39 - "intake.test.ts"
Cohesion: 0.06
Nodes (51): PrivateIntakeOptions, PublicSide, A165Options, PrivateOptions, PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation (+43 more)

### Community 4 - "column-rules.ts"
Cohesion: 0.02
Nodes (190): DumpInput, CaptureColumn, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+182 more)

### Community 40 - "core-block-commit.test.ts"
Cohesion: 0.06
Nodes (50): BlockRow, StandInOptions, Commit, Seen, AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock() (+42 more)

### Community 42 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (52): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema (+44 more)

### Community 43 - "range.ts"
Cohesion: 0.06
Nodes (54): BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange, Final (+46 more)

### Community 44 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (50): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+42 more)

### Community 45 - "builds.ts"
Cohesion: 0.07
Nodes (48): LockstepCondition, PrivateProcess, PrivateRefusal, Pause, A118Observation, MismatchObservation, WaitSample, InstancesOptions (+40 more)

### Community 46 - "core-ledger-state.ts"
Cohesion: 0.07
Nodes (44): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions, applyBlock() (+36 more)

### Community 47 - ".from"
Cohesion: 0.05
Nodes (37): databaseTarget, Buffer, Hash, sha256, hex(), instantiateLedger(), createHash(), hex() (+29 more)

### Community 48 - "core-settings.ts"
Cohesion: 0.05
Nodes (45): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, Absent, DeepReadonly (+37 more)

### Community 49 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (37): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+29 more)

### Community 5 - "Database"
Cohesion: 0.02
Nodes (166): Bound, Database, ReadOnlyDatabase, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable (+158 more)

### Community 50 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 51 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 52 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 53 - "core-block-parsed.ts"
Cohesion: 0.07
Nodes (38): BlockEventSource, ledgerVersionOf(), blockBodyOf(), blockParsedOf(), chainHashOf(), coreBlockParsedOnParse(), hexOf(), sameBytes() (+30 more)

### Community 55 - "loop-stop-harness.ts"
Cohesion: 0.08
Nodes (37): BlockHeader, SourceShared, CrashEvent, CrashJob, watched, A169Observation, LoopStopScenario, Outage (+29 more)

### Community 57 - "backup/backup.ts"
Cohesion: 0.09
Nodes (40): BackupInput, BackupTarget, BackupFacts, ManifestTool, PgliteDump, SnapshotSeams, Environment, PgDumpTool (+32 more)

### Community 6 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (185): BlockParsed, itemsSeen, Json, FixtureRun, ingest, SourceClass, Call, SeenLoad (+177 more)

### Community 61 - "Process"
Cohesion: 0.11
Nodes (4): PauseHold, Process, messageOf(), sourceOf()

### Community 62 - "events-fixtures.ts"
Cohesion: 0.12
Nodes (31): eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, LedgerScenarioOptions (+23 more)

### Community 64 - "spawnChild"
Cohesion: 0.06
Nodes (34): ParentJob, Kill, Orphaned, SourceFile, LockResult, dockerExec(), startWorker(), alive() (+26 more)

### Community 65 - "real-tapes.ts"
Cohesion: 0.08
Nodes (33): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+25 more)

### Community 67 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (24): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+16 more)

### Community 7 - "validate.ts"
Cohesion: 0.02
Nodes (170): ConfiguredDatabase, ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions (+162 more)

### Community 70 - "core-ledger-state/sql.ts"
Cohesion: 0.12
Nodes (33): StateRow, StoredState, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks(), deleteGrey() (+25 more)

### Community 71 - "graph.test.ts"
Cohesion: 0.08
Nodes (34): GraphInput, PastFaultCase, RefusalCase, resolveGraph(), reader(), backboneWithout(), consumer(), graphInput() (+26 more)

### Community 72 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 75 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 77 - "pglite-lock.ts"
Cohesion: 0.09
Nodes (26): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, QuietRun, acquirePgliteLock() (+18 more)

### Community 8 - "tape/index.ts"
Cohesion: 0.03
Nodes (127): Failure, Variant, Failure, Variant, Link, TapeBuilderOptions, RecordingError, RecordingProblem (+119 more)

### Community 80 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (32): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+24 more)

### Community 81 - "HeightRun"
Cohesion: 0.06
Nodes (16): HeightRun, IgnoresTheStop, PausesInsideTheHeight, StaysPaused, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching (+8 more)

### Community 82 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 83 - "checks.test.ts"
Cohesion: 0.08
Nodes (25): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, integer(), checkId() (+17 more)

### Community 85 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 86 - ".value"
Cohesion: 0.16
Nodes (16): ExtrinsicCall, MetadataPallet, ScaleReader, ValueReader, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic() (+8 more)

### Community 87 - "browser/build.ts"
Cohesion: 0.08
Nodes (25): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+17 more)

### Community 88 - "file-modes.ts"
Cohesion: 0.09
Nodes (25): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+17 more)

### Community 9 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (151): ProcessCondition, BlockSpec, EventSpec, Scenario, transactionSpec, ArgType, BlockOptions, CallSpec (+143 more)

### Community 90 - "process-context.test.ts"
Cohesion: 0.08
Nodes (21): MisuseListener, PublishRefusal, AcceptsDuplicates, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, a74Problems() (+13 more)

### Community 91 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (25): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+17 more)

### Community 93 - "module-api.test.ts"
Cohesion: 0.11
Nodes (25): ChainDataView, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions(), chainApi() (+17 more)

### Community 95 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 97 - "code"
Cohesion: 0.07
Nodes (27): Finding, code(), CONFIG, FIXTURES, Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG (+19 more)

### Community 98 - "startup-stop-harness.ts"
Cohesion: 0.11
Nodes (23): A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StartVia, stopBy, terminationSignal() (+15 more)

### Community 99 - "paused-harness.ts"
Cohesion: 0.14
Nodes (26): A176Options, Body, PausedExpectation, Read, Reader, Running, keeperModule(), keepingPause() (+18 more)

### Community 143 - "7. Storage helpers"
Cohesion: 0.09
Nodes (19): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The node on `/status`, The transport reader, TLS to PostgreSQL: `ssl` (+11 more)

### Community 144 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.10
Nodes (19): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions (+11 more)

### Community 104 - "transportReader"
Cohesion: 0.07
Nodes (27): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 4. Configuration, Impact (+19 more)

### Community 115 - "Acceptance — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.08
Nodes (22): transportReaderRule(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 10. Requirement coverage, 2. Network, 4. Channels (+14 more)

### Community 135 - "T"
Cohesion: 0.09
Nodes (22): T(), input(), 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible) (+14 more)

### Community 141 - "mapping.test.ts"
Cohesion: 0.12
Nodes (11): mapRows(), mapValue(), parseJsonLossless(), oid(), identity(), RESULT_COLUMNS, RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug (+3 more)

### Community 155 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.10
Nodes (18): up(), name, 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 3.1 The frozen catalog (the machine-facing API) (+10 more)

### Community 156 - "vendored-ledger-v9.test.ts"
Cohesion: 0.24
Nodes (17): freeAll(), bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), contractStateSerialized() (+9 more)

### Community 170 - "core-tx-results.ts"
Cohesion: 0.18
Nodes (14): blockParsedItemOf(), chainOutcomesOf(), coreTxResultsOnParse(), outcomeOf(), txResultsItemOf(), txResultsOf(), writeResultRows(), insertResultRows() (+6 more)

### Community 181 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 182 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 183 - "core-ledger-state.test.ts"
Cohesion: 0.15
Nodes (8): boundLedgerParser(), itemsOf(), applied(), bound(), query(), refusing(), NODES_PER_STATEMENT, STORED_ROOT

### Community 191 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 199 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 207 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 208 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 216 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 219 - ".boolean"
Cohesion: 0.20
Nodes (10): 4.1 Column types, 4.2 Rules, 4.3 Data that is not a function of the chain: `deterministic: false`, 4. Deterministic PostgreSQL, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors (+2 more)

### Community 241 - "Requirement: BK-1 Backup"
Cohesion: 0.22
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 246 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 252 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 284 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 320 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 333 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 41 - ".put"
Cohesion: 0.04
Nodes (54): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+46 more)

### Community 54 - "version"
Cohesion: 0.05
Nodes (44): deferred(), version(), Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Full-sync soak + load-under-prune (G10), Lease non-wedge cold start (G9 / T3) (+36 more)

### Community 56 - "history"
Cohesion: 0.06
Nodes (42): history(), n(), Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Scenario: A call with an already-aborted signal is rejected before any database work, Scenario: A label given at save time is returned by history and load, Scenario: A signal aborting after the call has begun does not interrupt it (+34 more)

### Community 68 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 69 - "UmbraDB module guide"
Cohesion: 0.06
Nodes (35): side(), migrations(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations (+27 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 76 - "backupAtStop"
Cohesion: 0.08
Nodes (29): join(), normalize(), resolve(), backupAtStop(), placeFor(), watchingPgDump(), log(), delimiter (+21 more)

### Community 84 - ".slowBlockMs"
Cohesion: 0.07
Nodes (30): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+22 more)

### Community 92 - "refused"
Cohesion: 0.08
Nodes (30): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work (+22 more)

### Community 101 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 122 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 133 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 145 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 146 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 164 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 165 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 169 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 175 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 179 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 180 - "ADDED Requirements"
Cohesion: 0.13
Nodes (15): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker (+7 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 189 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 190 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 195 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 198 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 203 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 206 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 209 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 210 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 214 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 215 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 217 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 218 - "README.md"
Cohesion: 0.29
Nodes (3): Choosing a database, Launching it, stats-module

### Community 220 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 221 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 225 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 226 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 227 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 228 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 229 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-4 Every field is data, operational or secret, Scenario: A function in the configuration, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: A user module from the configuration file, Scenario: Two `core` revisions with different databases (+1 more)

### Community 230 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 231 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 232 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 233 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 234 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 236 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 237 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 238 - "ROADMAP.md"
Cohesion: 0.22
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 239 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 240 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 242 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 244 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 245 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 247 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 248 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 249 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 250 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 251 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 253 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 254 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 255 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.29
Nodes (6): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers

### Community 256 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 257 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 258 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 259 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 260 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 261 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 262 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 264 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 266 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 267 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 268 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 269 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.33
Nodes (5): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Problem, Resolution, Suggested fix

### Community 270 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 271 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 272 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 273 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 274 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 275 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 276 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 277 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 278 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 279 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, What changes — the 1.0.0 gate items this change addresses, Why

### Community 280 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 281 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 282 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 283 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 286 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 287 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 288 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 289 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 290 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 291 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 292 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 293 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 294 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

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

### Community 311 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 312 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 313 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 314 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 315 - "Tasks — Sprint 1: project setup + TemporalKV"
Cohesion: 0.40
Nodes (4): 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV

### Community 316 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 317 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 321 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 322 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 323 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 324 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 325 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 326 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 327 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 328 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 329 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 338 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 58 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 59 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 60 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 66 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-1 The main program is a fixed sequence of points, Requirement: RN-2 The runner does only its five duties (+24 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8785`, `RFC-8785` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3963 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `admin-harness.ts`, `declaration.ts`, `InMemoryBlockSource`, `ref_node_fs`, `column-rules.ts`, `Database`, `ingest-harness.ts`, `validate.ts`, `tape/index.ts`, `fetch-fixtures.ts`, `version-checks.ts`, `src/db/postgres.ts`, `db/errors.ts`, `range.test.ts`, `host.ts`, `adapter-fixtures.ts`, `core-transport.ts`, `contract-data-checks.ts`, `ref_node_crypto`, `api-server.test.ts`, `ModuleDeclaration`, `client.test.ts`, `ReadHandle`, `src/index.ts`, `BlockRef`, `runner/process.ts`, `ledger/types.ts`, `loop.ts`, `loop.test.ts`, `NodeClient`, `NodeBlockSource`, `core-private-source.test.ts`, `LedgerPackage`, `cbor.ts`, `UmbraError`, `ledger/ledger-tasks.test.ts`, `config-check.ts`, `intake.test.ts`, `core-block-commit.test.ts`, `slow-block-harness.ts`, `builds.ts`, `core-ledger-state.ts`, `.from`, `core-settings.ts`, `interfaces/transaction-history-storage.ts`, `boundary.test.ts`, `retirement.test.ts`, `loop-stop-harness.ts`, `backup/backup.ts`, `spawnChild`, `real-tapes.ts`, `cold-boot-recovery.integration.test.ts`, `core-ledger-state/sql.ts`, `graph.test.ts`, `release-version.ts`, `pglite-lock.ts`, `resolver-boundary.ts`, `browser.test.ts`, `checks.test.ts`, `browser/build.ts`, `process-context.test.ts`, `node-fields-harness.ts`, `module-api.test.ts`, `code-registry.ts`, `code`, `startup-stop-harness.ts`, `postgres/transaction-history-storage.ts`, `package.json`, `documents.ts`, `src/ledger/identity.ts`, `pg-tx-history-adapter.ts`, `Lockstep`, `read-gate.ts`, `test/postgres/setup.ts`, `binding.test.ts`, `restore-private.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `node-format.ts`, `surface.test.ts`, `containers.test.ts`, `BlockItems`, `node-bridge.ts`, `net.test.ts`, `ref_node_url`, `example-checks.ts`, `block-fetch-decode.test.ts`, `harness.ts`, `mapping.test.ts`, `.name`, `ledger-sweep.test.ts`, `chain-events-decode.test.ts`, `read-height.property.test.ts`, `vendored-ledger-v9.test.ts`, `excluded-not-exported.test.ts`, `LoopPauses`, `node-store-suite.ts`, `validation.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `core-ledger-state.test.ts`, `web-lock.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `reasonOf`, `conformance-gate.test.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `Heartbeat`, `ledger/plain-data.ts`, `postgres-image.test.ts`, `serve-checks.ts`, `timeouts.test.ts`, `pglite.test.ts`?**
  _High betweenness centrality (0.232) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 19 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0191462854894761 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `admin-harness.ts`, `declaration.ts`, `ProcessContexts`, `ref_node_fs`, `column-rules.ts`, `Database`, `options.ts`, `validate.ts`, `InMemoryBlockSource`, `ingest-harness.ts`, `version-checks.ts`, `src/db/postgres.ts`, `db/errors.ts`, `fetch-fixtures.ts`, `host.ts`, `mapping.test.ts`, `core-transport.ts`, `contract-data-checks.ts`, `ref_node_crypto`, `api-server.test.ts`, `ModuleDeclaration`, `client.test.ts`, `ReadHandle`, `src/index.ts`, `BlockRef`, `runner/process.ts`, `loop.ts`, `loop.test.ts`, `vitest`, `NodeClient`, `NodeBlockSource`, `core-private-source.test.ts`, `FinalizedLoop`, `cbor.ts`, `ledger/ledger-tasks.test.ts`, `config-check.ts`, `intake.test.ts`, `core-block-commit.test.ts`, `tape/index.ts`, `validation.test.ts`, `slow-block-harness.ts`, `builds.ts`, `core-ledger-state.ts`, `.from`, `statementsOf`, `checkShape`, `range.ts`, `graph.ts`, `core-ledger-state.test.ts`, `backup/backup.ts`, `web-lock.ts`, `Process`, `graph.test.ts`, `reasonOf`, `backupAtStop`, `pglite-lock.ts`, `checks.test.ts`, `process-context.test.ts`, `module-api.test.ts`, `browser/src/config/load.ts`, `src/ledger/identity.ts`, `PrivateTransport`, `mapping.ts`, `binding.test.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.016972056802565277 - nodes in this community are weakly interconnected._