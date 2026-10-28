# Graph Report - UmbraDB

## Corpus Check
- 1014 files · ~1,492,932 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10733 nodes · 31620 edges · 355 communities (320 shown, 35 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2556 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `6aafc07b0e878d38` (1014 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- host.ts
- process-backends.ts
- chain-placement.test.ts
- page.ts
- configured.ts
- cbor.property.test.ts
- node-format.ts
- browser.test.ts
- BlockRef
- core-block-fetch/metadata.ts
- vendored-ledger-v9.test.ts
- FinalizedLoop
- restore-private.ts
- run.test.ts
- type-check.ts
- browser/build.ts
- code-registry.ts
- ws-mutual-tls.test.ts
- runner/process.ts
- vitest
- chain-process.test.ts
- crash.test.ts
- net.test.ts
- pg-tx-history-adapter.ts
- Lockstep
- core-transport.ts
- sigterm.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- InMemoryBlockSource
- height-versioned.property.test.ts
- tape/index.ts
- readiness.test.ts
- node-bridge.ts
- TransactionHistoryEntry
- postgres/transaction-history-storage.ts
- adapter.ts
- relays.ts
- adapter-core.test.ts
- status-schema.test.ts
- ReadHandle
- block-fetch-decode.test.ts
- transaction-history-storage.property.test.ts
- .value
- lockstep-refusals.test.ts
- key-handling-checks.ts
- TestDatabase
- UmbraError
- package-identity.test.ts
- childRefKeys
- admin/configuration.ts
- recovery.test.ts
- ledger-checks.ts
- declaration.ts
- describeNodeStoreExports
- private/lockstep-wait.test.ts
- deterministic-postgresql/checks.ts
- validate.ts
- version-table.ts
- Buffer
- readRuntimeMetadata
- statementsOf
- checkShape
- ChromeTab
- node/socket.ts
- record-and-replay.test.ts
- browser-harness.ts
- chrome.ts
- web-lock.ts
- Design — Sprint 1: project setup + TemporalKV
- api-server.test.ts
- validate.test.ts
- createLedgerAdapter
- worker-threads-worker.ts
- ref_node_url
- buffer.ts
- Worker
- RuntimeMetadata
- extrinsics.ts
- apply
- ledger-test-loader.ts
- module-tables.ts
- PortSocket
- sha256
- Emitter
- client.test.ts
- Roadmap for the missing formalization
- postgres-image.test.ts
- refused-configuration.test.ts
- stats.ts
- 9.2 Browser build (BR)
- builds.ts
- ledgerEventOf
- ledger/plain-data.ts
- worker-threads.test.ts
- process-build.ts
- mutation-evidence.d.mts
- db/errors.ts
- .toString
- AsyncLocalStorage
- ledger-storage.test.ts
- TapeNode
- pageBench
- worker-threads-host.ts
- migrate.ts
- opt-out.test.ts
- ref_node_fs
- PgTransactionHistoryStorage
- https.ts
- NodeFS
- history.test.ts
- RawEvent
- RecordingClient
- Waiter
- core-block-commit.test.ts
- src/db/postgres.ts
- core-ledger-state.ts
- config/history.ts
- transform-checks.ts
- NodeBlockSource
- adapter-fixtures.ts
- backup/restore.ts
- builder.test.ts
- ledger/ledger-tasks.test.ts
- range.ts
- writer-lock-checks.ts
- .from
- change-capture.ts
- backup/backup.ts
- config-check.ts
- core-block-parsed.ts
- ref_node_timers
- client.ts
- loop-stop-harness.ts
- contract-data-checks.ts
- cli/command.ts
- process-admin.ts
- process-worker.ts
- cbor.ts
- intake.test.ts
- loop.ts
- mapping.ts
- slow-block-harness.ts
- admin-harness.ts
- zero-timeouts-checks.ts
- boundary.test.ts
- NodeClient
- version
- column-rules.ts
- validation.ts
- pglite-server.ts
- graph.ts
- spawnChild
- Process
- core-config.test.ts
- ledger-sweep.test.ts
- private/backends.ts
- .concat
- core-settings.ts
- loop.test.ts
- serve.test.ts
- version-checks.ts
- admin/types.ts
- retirement.test.ts
- test/postgres/setup.ts
- config/plain-data.ts
- networks.ts
- core-private-source.test.ts
- real-tapes.ts
- in-memory-source.ts
- cold-boot-recovery.integration.test.ts
- interfaces/transaction-history-storage.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- Design — Sprint 3: CheckpointStore
- .read
- T
- .boolean
- refused
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- .slowBlockMs
- UmbraDB module guide
- transaction-history-storage.test.ts
- mutation-per-adapter.mjs
- attempt
- twox.ts
- UmbraDB third-party component inventory (SBOM)
- scoped-review-manifest
- path.ts
- Performance — design
- continueTo
- orphan-watcher.mjs
- leanProblems
- fn
- history
- code
- .put
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- graph.py
- ADDED Requirements
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- package.json
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- UmbraDB
- stryker.conf.json
- Storage Layer Interface Specification
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- chain_archive lineage
- ADDED Requirements
- Design — Sprint 4: Watermarks
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Security policy & threat model
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- conformance-gate.mjs
- Contributing
- Checkpoint-store composition contract — cursor ordering and replay
- Storage Algebra Lean M3a Watermarks Sprint
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Repository agent policy
- Our Pledge
- Midnight infra verification checklist
- UmbraDB Durability Contract
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
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
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
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- Problem
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- bug-report.md
- feature-request.md
- Requirement: RN-16 Chain-data reads name their view and height
- GC architecture and query-tracing: research findings
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Requirement: RN-13 SIGTERM stops cleanly
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
- engines
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
- post-block-update/oracle/main.rs
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 320 edges
2. `UmbraError` - 301 edges
3. `ModuleDeclaration` - 171 edges
4. `FinalizedLoop` - 120 edges
5. `InMemoryBlockSource` - 105 edges
6. `NodeClient` - 105 edges
7. `Database` - 97 edges
8. `BlockRef` - 93 edges
9. `ReadHandle` - 85 edges
10. `5. Runner` - 78 edges

## Surprising Connections (you probably didn't know these)
- `Review notes` --references--> `JsonValue`  [INFERRED]
  design/design-interfaces.md → src/private/messages.ts
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (355 total, 35 thin omitted)

### Community 0 - "host.ts"
Cohesion: 0.03
Nodes (116): LoadLedger, TransactionParser, LedgerStateItem, RetainedState, LedgerName, LedgerEventKind, LedgerPackage, LedgerTask (+108 more)

### Community 1 - "process-backends.ts"
Cohesion: 0.03
Nodes (151): BodyExtrinsic, BlockBody, BlockParsed, MetadataBlock, RuntimeMetadataEntry, ProcessCondition, itemsSeen, Scenario (+143 more)

### Community 10 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (100): BlockParsedOptions, ChainEvent, BlockSpec, EventSpec, Json, transactionSpec, eventsRuntime, Field (+92 more)

### Community 100 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 103 - "configured.ts"
Cohesion: 0.13
Nodes (28): RestoreSeams, BackupOutcome, CommandConfig, commandTarget, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome (+20 more)

### Community 104 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 105 - "node-format.ts"
Cohesion: 0.14
Nodes (24): StoredNode, Child, Reader, NodeBatch, Readable, TableNode, node(), childKey() (+16 more)

### Community 106 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 107 - "BlockRef"
Cohesion: 0.09
Nodes (11): BlockEventSource, BlockLedgerSource, LedgerBinding, BlockRef, InMemorySourceOptions, EventsRunner, Fetching, Recorder (+3 more)

### Community 108 - "core-block-fetch/metadata.ts"
Cohesion: 0.09
Nodes (28): MetadataField, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive, ChainTransaction, EventPhase (+20 more)

### Community 109 - "vendored-ledger-v9.test.ts"
Cohesion: 0.13
Nodes (28): FreshInstanceRequest, FreshInstanceResult, NodeRoot, freeAll(), runInFreshInstance(), bigCell(), cell(), contractAddress() (+20 more)

### Community 11 - "FinalizedLoop"
Cohesion: 0.04
Nodes (33): Activity, CommitOutcome, FinalizedLoop, HeightRun, HeldHeight, LoopObserver, SkipsAfterReconnect, SkipsUnseen (+25 more)

### Community 111 - "restore-private.ts"
Cohesion: 0.13
Nodes (24): BackupDatabase, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, pgliteBackend() (+16 more)

### Community 112 - "run.test.ts"
Cohesion: 0.11
Nodes (20): RunningCommand, statsConfig, write(), adminPortIn(), chainNode(), chainTape(), exitWithin(), runCoreSettings() (+12 more)

### Community 113 - "type-check.ts"
Cohesion: 0.10
Nodes (19): TypeCheckFinding, TypeCheckResult, Finding, Finding, configCompilerOptions(), detectedAsModule(), isRegularFile(), packageType() (+11 more)

### Community 114 - "browser/build.ts"
Cohesion: 0.09
Nodes (24): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+16 more)

### Community 118 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 119 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (21): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+13 more)

### Community 12 - "runner/process.ts"
Cohesion: 0.04
Nodes (64): OpenedFacts, ChainIdentity, ChainSource, CoreChainBinding, CoreChainFacts, NodeWait, WaitingListener, RestoreBase (+56 more)

### Community 120 - "vitest"
Cohesion: 0.07
Nodes (16): Upstream, ReportedTest, filesUnder(), patchesOf(), patchText(), ANSWER_WASM, settings, ledgerDir (+8 more)

### Community 121 - "chain-process.test.ts"
Cohesion: 0.11
Nodes (23): WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Flaky, Seen (+15 more)

### Community 122 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+15 more)

### Community 123 - "net.test.ts"
Cohesion: 0.13
Nodes (18): NetworkBroker, IncomingMessage, NetworkMessage, Frame, Listener, PortUpgrade, RawData, WebSocketServer (+10 more)

### Community 125 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 129 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 13 - "core-transport.ts"
Cohesion: 0.04
Nodes (71): PublicSide, Session, TransportLimits, TransportTls, Committed, Hello, HelloAck, JsonValue (+63 more)

### Community 133 - "sigterm.test.ts"
Cohesion: 0.12
Nodes (22): Job, WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent, report() (+14 more)

### Community 134 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 135 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 136 - "InMemoryBlockSource"
Cohesion: 0.11
Nodes (14): InMemoryBlockSource, Failing, TickerProcess, Broken, Lost, failingSource(), v9(), flakySource() (+6 more)

### Community 137 - "height-versioned.property.test.ts"
Cohesion: 0.16
Nodes (17): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+9 more)

### Community 14 - "tape/index.ts"
Cohesion: 0.05
Nodes (70): Recorded, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId, Json (+62 more)

### Community 140 - "readiness.test.ts"
Cohesion: 0.14
Nodes (18): ReadinessFacts, ProcessState, Decision, ReadinessCase, readinessOf(), ae4(), caseText(), readinessProblems() (+10 more)

### Community 141 - "node-bridge.ts"
Cohesion: 0.13
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 143 - "TransactionHistoryEntry"
Cohesion: 0.14
Nodes (9): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, 4. Wiring `PgTemporalKV`'s `opts.tx`, 2. `set`, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+1 more)

### Community 144 - "postgres/transaction-history-storage.ts"
Cohesion: 0.13
Nodes (14): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+6 more)

### Community 146 - "adapter.ts"
Cohesion: 0.09
Nodes (21): Binding, EventKind, Native, Proof, RawBlockContext, RawIntent, RawLoggedItem, RawParameters (+13 more)

### Community 147 - "relays.ts"
Cohesion: 0.13
Nodes (8): Report, HeldLink, HoldingRelay, ReportRelay, hostPort(), sendable(), typeOf(), RFC-6455

### Community 148 - "adapter-core.test.ts"
Cohesion: 0.11
Nodes (21): RawTransactionResult, SyntheticCost, FakeTransaction, Recorded, bytesOf(), deserialize(), fakePackage(), regular() (+13 more)

### Community 149 - "status-schema.test.ts"
Cohesion: 0.11
Nodes (13): gate, Validator, statusOf(), schemaFile(), text(), validatorOf(), status(), status() (+5 more)

### Community 15 - "ReadHandle"
Cohesion: 0.04
Nodes (63): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, BlockContext (+55 more)

### Community 153 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), decodeExtrinsics(), encodeHeader(), headerHash() (+10 more)

### Community 154 - "transaction-history-storage.property.test.ts"
Cohesion: 0.10
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 156 - ".value"
Cohesion: 0.27
Nodes (6): ScaleReader, ValueReader, decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 157 - "lockstep-refusals.test.ts"
Cohesion: 0.20
Nodes (19): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+11 more)

### Community 158 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 159 - "TestDatabase"
Cohesion: 0.11
Nodes (13): TestDatabase, 7. Storage helpers, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+5 more)

### Community 16 - "UmbraError"
Cohesion: 0.04
Nodes (68): LoadedConfig, LoadOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresOptions, DatabaseState, ReadDatabaseOptions (+60 more)

### Community 160 - "package-identity.test.ts"
Cohesion: 0.17
Nodes (17): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+9 more)

### Community 161 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 164 - "admin/configuration.ts"
Cohesion: 0.20
Nodes (17): DeclarationView, configOf(), declarationView(), entryView(), hex(), originOf(), recordedView(), shownSettings() (+9 more)

### Community 165 - "recovery.test.ts"
Cohesion: 0.18
Nodes (18): ProcessStatus, Q142Observation, A43Observation, Fault, Recorded, RecoveryObservation, StatusRead, RunObservation (+10 more)

### Community 169 - "ledger-checks.ts"
Cohesion: 0.25
Nodes (17): LedgerEvent, TransactionResult, ledgerItemsSeen, a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows() (+9 more)

### Community 17 - "declaration.ts"
Cohesion: 0.04
Nodes (67): Bound, ReadOnlyDatabase, SchemaWriteHandle, ApiRegistry, BlockHeader, DefinedModule, FieldKind, FieldSchema (+59 more)

### Community 171 - "describeNodeStoreExports"
Cohesion: 0.18
Nodes (4): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports()

### Community 172 - "private/lockstep-wait.test.ts"
Cohesion: 0.20
Nodes (13): ExpectedWait, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf(), rowsIn(), sampleWait() (+5 more)

### Community 179 - "deterministic-postgresql/checks.ts"
Cohesion: 0.15
Nodes (16): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, checkFunctionsSql(), integerCheckName(), integerCheckStatements() (+8 more)

### Community 18 - "validate.ts"
Cohesion: 0.05
Nodes (77): RevisionSettings, EntryView, RecordedView, HistoryFinding, plainData, PlainObject, RedactableConfig, RedactionForms (+69 more)

### Community 180 - "version-table.ts"
Cohesion: 0.25
Nodes (16): LedgerPin, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin(), freezeRow(), hexOf() (+8 more)

### Community 181 - "Buffer"
Cohesion: 0.15
Nodes (8): Buffer, Hash, createHash(), 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 185 - "readRuntimeMetadata"
Cohesion: 0.43
Nodes (9): TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry(), storageEntry(), strings() (+1 more)

### Community 186 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 187 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 189 - "node/socket.ts"
Cohesion: 0.21
Nodes (8): Connection, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure, connectWebSocket(), "on-compute"(), DEFAULT_HEARTBEAT_MS

### Community 19 - "record-and-replay.test.ts"
Cohesion: 0.04
Nodes (43): ConnectSocket, Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault (+35 more)

### Community 193 - "browser-harness.ts"
Cohesion: 0.27
Nodes (13): ProcessName, backupThrough(), call(), eventsOf(), eventWhen(), logOf(), pageWhen(), restoreThrough() (+5 more)

### Community 194 - "chrome.ts"
Cohesion: 0.23
Nodes (11): Cdp, CdpEvent, Download, PageRequest, chrome(), chrome(), chromePath(), chromeVersion() (+3 more)

### Community 195 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 197 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.15
Nodes (13): Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4a. Error translation (`src/postgres/errors.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV (+5 more)

### Community 2 - "api-server.test.ts"
Cohesion: 0.02
Nodes (136): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ModuleTableOptions, Connection, HeadersArgument, ModuleApiServer (+128 more)

### Community 20 - "validate.test.ts"
Cohesion: 0.03
Nodes (77): coreEntry, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+69 more)

### Community 207 - "createLedgerAdapter"
Cohesion: 0.27
Nodes (3): RawLedgerPackage, blank(), createLedgerAdapter()

### Community 209 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 21 - "ref_node_url"
Cohesion: 0.04
Nodes (54): BenchEnv, CliBackend, Snapshot, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, PostgresTestServer (+46 more)

### Community 210 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 213 - "RuntimeMetadata"
Cohesion: 0.21
Nodes (5): RuntimeMetadata, contentStateOf(), hexOf(), walkOver(), 5.6 Version selection, the built-in tables and the metadata at upgrades (LG-1 to LG-4)

### Community 216 - "extrinsics.ts"
Cohesion: 0.23
Nodes (9): ExtrinsicCall, MetadataPallet, RuntimeMetadataView, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), isCompactU64() (+1 more)

### Community 217 - "apply"
Cohesion: 0.20
Nodes (8): RawTransaction, addCosts(), asHandle(), asRaw(), apply(), fallibleSegments(), free(), freeGot()

### Community 218 - "ledger-test-loader.ts"
Cohesion: 0.21
Nodes (11): SlowStep, beat(), countDeserializations(), hexOf(), loadLedger(), probe(), deserialized, evictions (+3 more)

### Community 22 - "module-tables.ts"
Cohesion: 0.06
Nodes (53): ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead, RefusalPlace, DeterminismBackend (+45 more)

### Community 225 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 23 - "client.test.ts"
Cohesion: 0.04
Nodes (44): Answer, FakeNode, Handler, Received, recorded, TapeCall, bytes(), caught() (+36 more)

### Community 233 - "Roadmap for the missing formalization"
Cohesion: 0.20
Nodes (9): Key, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec (+1 more)

### Community 239 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 24 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (67): ProcessConfig, Answered, Observation, Start, Child, Refusal, Start, startProcess() (+59 more)

### Community 240 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 248 - "9.2 Browser build (BR)"
Cohesion: 0.25
Nodes (3): WebSocket, 9.2 Browser build (BR), 9. Backups and browser

### Community 25 - "builds.ts"
Cohesion: 0.05
Nodes (69): PrivateIntakeOptions, PublicWakes, A165Options, a165Run, Attempt, A113Observation, A156Observation, Binding (+61 more)

### Community 256 - "ledgerEventOf"
Cohesion: 0.29
Nodes (7): RawSystemTransaction, bytesOf(), segmentsOf(), fieldBytes(), ledgerEventOf(), nameBytes(), vmLogOf()

### Community 257 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 26 - "process-build.ts"
Cohesion: 0.06
Nodes (60): ProcessingEnd, ProcessObservation, A43Case, Outcome, CoreSeen, testBuild, A149Observation, A149Startup (+52 more)

### Community 269 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "db/errors.ts"
Cohesion: 0.05
Nodes (46): ReadTimeoutSetting, BlockWrites, ErrorDetails, Settings, Case, Phase, HeldRead, Job (+38 more)

### Community 270 - ".toString"
Cohesion: 0.29
Nodes (4): RawState, eventKindOf(), hexText(), networkIdOf()

### Community 28 - "ledger-storage.test.ts"
Cohesion: 0.07
Nodes (68): Manifest, Restored, watched, Call, SeenLoad, RestartEvent, RestartJob, retentionSeen (+60 more)

### Community 29 - "TapeNode"
Cohesion: 0.04
Nodes (33): ManualTimers, Outage, Metadata, Step, Failure, Variant, TapeClock, TapeNode (+25 more)

### Community 293 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 294 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 3 - "migrate.ts"
Cohesion: 0.03
Nodes (120): Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner, Difference (+112 more)

### Community 30 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (60): PlacedRefusal, Refusal, Chain, ChainOptions, DigestRow, Op, States, TableName (+52 more)

### Community 31 - "ref_node_fs"
Cohesion: 0.08
Nodes (45): BackupBackend, killedRestore, TickerConfig, cliProject, Pem, catalogOf(), hashOf(), heightsAt() (+37 more)

### Community 32 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (66): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order) (+58 more)

### Community 33 - "history.test.ts"
Cohesion: 0.05
Nodes (61): versionEntry, HistoryOptions, HistoryRow, AppliedMigration, Simulation, Start, Started, Case (+53 more)

### Community 34 - "core-block-commit.test.ts"
Cohesion: 0.04
Nodes (50): BlockHeaderItem, CoreBlockHeader, StandInOptions, Commit, Committed, blockHeaderOf(), checkParent(), commitBlock() (+42 more)

### Community 35 - "src/db/postgres.ts"
Cohesion: 0.05
Nodes (39): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, BoundedRead, DriverError, Outcome, ReadPool (+31 more)

### Community 36 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (55): retainedStates, CoreRevision, boundLedgerParser(), applyBlock(), bindCoreLedgerState(), boundLedger(), bytesOf(), chainOutcomesOf() (+47 more)

### Community 37 - "config/history.ts"
Cohesion: 0.07
Nodes (57): CoreVersion, ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext, HistoryRule, ProvidesRow, Span (+49 more)

### Community 38 - "transform-checks.ts"
Cohesion: 0.08
Nodes (46): Failure, Variant, TransformError, CallRecord, NotifyRecord, recordKind, SubscriptionId, CallSelection (+38 more)

### Community 39 - "NodeBlockSource"
Cohesion: 0.07
Nodes (22): BlockItemSource, CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, QueuedBlock, NodeSubscription (+14 more)

### Community 4 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (129): AdapterSpec, LedgerRelease, LedgerReleasePackage, ApplyInput, ApplyOutput, LedgerPackageOptions, StateSummary, V9Logs (+121 more)

### Community 41 - "backup/restore.ts"
Cohesion: 0.06
Nodes (51): PublicIdentity, Checked, PublicSide, RestoreChain, RestoreInput, RestoreTarget, BackupText, createReadStream() (+43 more)

### Community 42 - "builder.test.ts"
Cohesion: 0.05
Nodes (30): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Frame, RawClient, Link (+22 more)

### Community 43 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.06
Nodes (48): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, withLedgerTaskPoints(), countMainThreadParses(), expectedCallArgs() (+40 more)

### Community 44 - "range.ts"
Cohesion: 0.06
Nodes (55): BoundaryBlockReading, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange, Height, RangeStats (+47 more)

### Community 45 - "writer-lock-checks.ts"
Cohesion: 0.08
Nodes (46): WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), expectRefusedBeforeAnyWrite(), noHeight() (+38 more)

### Community 46 - ".from"
Cohesion: 0.08
Nodes (52): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData (+44 more)

### Community 47 - "change-capture.ts"
Cohesion: 0.06
Nodes (48): CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow, GuardTableRow, ColumnType (+40 more)

### Community 48 - "backup/backup.ts"
Cohesion: 0.08
Nodes (50): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, ManifestHistoryRow, ManifestMigration, ManifestTool (+42 more)

### Community 49 - "config-check.ts"
Cohesion: 0.05
Nodes (47): privateIntake, CommandBuildOptions, CheckFinding, CheckStep, ConfigCheckSeams, StepName, StepReport, StepStatus (+39 more)

### Community 5 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (124): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+116 more)

### Community 50 - "ref_node_timers"
Cohesion: 0.06
Nodes (34): Message, MessageType, TestCertificates, Ended, rawClient, TransportProxy, mutualTlsOptions(), makeCertificates() (+26 more)

### Community 51 - "client.ts"
Cohesion: 0.09
Nodes (44): State, Subscription, NodeBlock, NodeRuntimeVersion, NodeCallMethod, SubscribeMethod, Final, positive() (+36 more)

### Community 52 - "loop-stop-harness.ts"
Cohesion: 0.08
Nodes (42): NodeClientOptions, ProcessHandle, A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch (+34 more)

### Community 53 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (51): CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx (+43 more)

### Community 54 - "cli/command.ts"
Cohesion: 0.06
Nodes (44): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, CommandResult, CheckTarget, backupArguments(), backupCommand() (+36 more)

### Community 55 - "process-admin.ts"
Cohesion: 0.07
Nodes (41): ConfigFacts, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, AdminServer, DigestRow (+33 more)

### Community 56 - "process-worker.ts"
Cohesion: 0.07
Nodes (39): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, Scope, crossedError, StartRun, ToProcessWorker (+31 more)

### Community 58 - "cbor.ts"
Cohesion: 0.08
Nodes (45): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+37 more)

### Community 59 - "intake.test.ts"
Cohesion: 0.08
Nodes (43): PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation, A116Observation (+35 more)

### Community 6 - "loop.ts"
Cohesion: 0.03
Nodes (113): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+105 more)

### Community 60 - "mapping.ts"
Cohesion: 0.06
Nodes (39): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+31 more)

### Community 62 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (44): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+36 more)

### Community 63 - "admin-harness.ts"
Cohesion: 0.07
Nodes (48): AdminRun, AdminRunOptions, Answerer, Expected, Hold, Prober, ProbeRecord, TestBuildOptions (+40 more)

### Community 64 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (36): Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings(), apiRead() (+28 more)

### Community 65 - "boundary.test.ts"
Cohesion: 0.08
Nodes (43): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+35 more)

### Community 67 - "NodeClient"
Cohesion: 0.10
Nodes (22): HeadSubscriber, NodeClient, NodeRetry, Pending, connectionFailure, NodeMethod, Opened, finalizedHeight() (+14 more)

### Community 68 - "version"
Cohesion: 0.04
Nodes (46): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+38 more)

### Community 7 - "column-rules.ts"
Cohesion: 0.02
Nodes (114): CheckedMigration, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+106 more)

### Community 70 - "validation.ts"
Cohesion: 0.05
Nodes (41): DeclarationRule, PlacedDeclaration, Plain, Accepts, Rest, WithKnownPoints, WithUnknownPoint, Case (+33 more)

### Community 71 - "pglite-server.ts"
Cohesion: 0.06
Nodes (35): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, Report, Job (+27 more)

### Community 72 - "graph.ts"
Cohesion: 0.07
Nodes (46): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+38 more)

### Community 73 - "spawnChild"
Cohesion: 0.06
Nodes (37): SignalTarget, ParentJob, Kill, Orphaned, SourceFile, LockResult, heldPort(), startChild() (+29 more)

### Community 74 - "Process"
Cohesion: 0.09
Nodes (18): CoreTransport, Process, isBlockEventSource(), bindLedgerTasks(), boundHost(), frozen(), hasLedgerTasks(), resultsOf() (+10 more)

### Community 75 - "core-config.test.ts"
Cohesion: 0.10
Nodes (29): AdminStartOptions, CoreLedgerVersion, LedgerPackageIdentity, privateBackbone(), adminSnapshot(), statusSnapshot(), snapshot(), snapshot() (+21 more)

### Community 76 - "ledger-sweep.test.ts"
Cohesion: 0.09
Nodes (26): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, NodeBatch, Block, MemoryTables (+18 more)

### Community 77 - "private/backends.ts"
Cohesion: 0.09
Nodes (31): startHashDecision, ProcessInput, PrivateBackend, SessionSeen, PublicCoreOptions, A162Options, a162Run, HeaderSeen (+23 more)

### Community 78 - ".concat"
Cohesion: 0.05
Nodes (32): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+24 more)

### Community 79 - "core-settings.ts"
Cohesion: 0.06
Nodes (40): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys (+32 more)

### Community 8 - "loop.test.ts"
Cohesion: 0.04
Nodes (95): ErrorCode, EntryRange, GraphInput, LockstepWait, LoopEnd, PastFaultCase, RefusalCase, Contexts (+87 more)

### Community 80 - "serve.test.ts"
Cohesion: 0.07
Nodes (32): FromAdmin, ToAdmin, AdminStarter, Heartbeat, InstancesOptions, instancesRun, listenError(), startAdminServer() (+24 more)

### Community 81 - "version-checks.ts"
Cohesion: 0.11
Nodes (33): MetadataNode, LedgerSelection, VersionedBlock, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata (+25 more)

### Community 82 - "admin/types.ts"
Cohesion: 0.09
Nodes (31): adminRoutes, AdminChannel, AdminServeOptions, AdminAnswer, AdminEndpoint, AdminPart, AdminSnapshot, AdminView (+23 more)

### Community 83 - "retirement.test.ts"
Cohesion: 0.07
Nodes (39): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), manifestProblems(), mutationProblems() (+31 more)

### Community 84 - "test/postgres/setup.ts"
Cohesion: 0.07
Nodes (29): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+21 more)

### Community 87 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (32): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, copyArray(), copyObject() (+24 more)

### Community 88 - "networks.ts"
Cohesion: 0.06
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 9 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (63): ConfiguredGenesis, PrivateBlockSource, PrivateChecks, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes, PublicConfiguration (+55 more)

### Community 90 - "real-tapes.ts"
Cohesion: 0.09
Nodes (32): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+24 more)

### Community 92 - "in-memory-source.ts"
Cohesion: 0.06
Nodes (22): ChainCheck, ChainCheckInput, BlockSource, FinalityStallCondition, InMemoryItems, Wait, RestoreJob, Shifted (+14 more)

### Community 93 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (26): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+18 more)

### Community 95 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.06
Nodes (28): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+20 more)

### Community 97 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.05
Nodes (39): Absent, 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 1. Executive conclusion, 2.1 Historical implementation baseline (+31 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): Private modules, ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database (+21 more)

### Community 130 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.08
Nodes (24): 1. Overview / purpose, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 3. Semantic decode: `chain-archive-sync/tx-replay-decoder.ts`, 4. How to run it, 5. Acceptance criteria status, 6. Known limitations (+16 more)

### Community 110 - ".read"
Cohesion: 0.06
Nodes (31): identityRow(), captured(), triggerEnabled(), providesRows(), state(), migrationRows(), storedRows(), owner() (+23 more)

### Community 124 - "T"
Cohesion: 0.08
Nodes (26): n(), T(), input(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside (+18 more)

### Community 162 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 166 - "refused"
Cohesion: 0.12
Nodes (17): refused(), When a callback fails, Requirement: AE-3 States and conditions, Scenario: A fault of the build's declarations ends the process, Scenario: A refused configuration ends the process, Scenario: A refused start stays up, 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 167 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (16): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+8 more)

### Community 182 - ".slowBlockMs"
Cohesion: 0.15
Nodes (13): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+5 more)

### Community 183 - "UmbraDB module guide"
Cohesion: 0.12
Nodes (15): params(), Contract states and contract logs, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Process items and APIs, Reading through `db`, Running a module with the `umbradb` command (+7 more)

### Community 190 - "transaction-history-storage.test.ts"
Cohesion: 0.14
Nodes (7): decodeSerializedContent(), decodeSerializedEntry(), store(), THS_RESERVED_KEY_PREFIX, FAKE_TX, { sql: getSql }, 2.1 The boundary rule (the feature's key design decision)

### Community 192 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 196 - "attempt"
Cohesion: 0.16
Nodes (13): attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop (+5 more)

### Community 201 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 222 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 228 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 249 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 255 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 278 - "continueTo"
Cohesion: 0.40
Nodes (5): continueTo(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 290 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 324 - "leanProblems"
Cohesion: 0.50
Nodes (4): leanImports(), leanProblems(), leanTheorems(), retiredLean()

### Community 40 - "fn"
Cohesion: 0.04
Nodes (60): fn(), 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure (+52 more)

### Community 57 - "history"
Cohesion: 0.05
Nodes (52): history(), 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate (+44 more)

### Community 61 - "code"
Cohesion: 0.04
Nodes (52): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21), The catalog, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog (+44 more)

### Community 66 - ".put"
Cohesion: 0.04
Nodes (48): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+40 more)

### Community 96 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (34): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change) (+26 more)

### Community 99 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 115 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (30): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+22 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points, Requirement: RN-2 The runner does only its five duties (+22 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+20 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter (+21 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+19 more)

### Community 138 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 139 - "package.json"
Cohesion: 0.08
Nodes (24): bin, umbradb, bugs, url, description, exports, files, homepage (+16 more)

### Community 142 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 145 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 150 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.09
Nodes (17): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+9 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 152 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 168 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 170 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 173 - "Storage Layer Interface Specification"
Cohesion: 0.12
Nodes (16): 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.1 Transaction/Lease layer (+8 more)

### Community 174 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (17): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+9 more)

### Community 175 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 177 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 178 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 184 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 191 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 198 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 199 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 202 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 203 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 204 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 206 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 208 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 212 - "chain_archive lineage"
Cohesion: 0.17
Nodes (12): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, How the two lineages coexist, Partition rollover design (+4 more)

### Community 214 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 215 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 219 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 220 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 223 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 224 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 227 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 229 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.18
Nodes (8): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix, 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 230 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 231 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 232 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 234 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 235 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 236 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 237 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 238 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 241 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 242 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 243 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 244 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 245 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 246 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 247 - "conformance-gate.mjs"
Cohesion: 0.22
Nodes (8): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli

### Community 250 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 251 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 252 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 253 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 254 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 259 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 260 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 261 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 262 - "UmbraDB Durability Contract"
Cohesion: 0.29
Nodes (6): 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented), Summary, UmbraDB Durability Contract

### Community 263 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 264 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 265 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 266 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 267 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 268 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 272 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 273 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 274 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 275 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 276 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 277 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 279 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 280 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 281 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 282 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 283 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 284 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 285 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 286 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 287 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 288 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 289 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 291 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 292 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 295 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 296 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 297 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 298 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 299 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 300 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 301 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 302 - "Problem"
Cohesion: 0.40
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 303 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 304 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 305 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 306 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 307 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 308 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 309 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 310 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 311 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 312 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 313 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 314 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 315 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 316 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 317 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 318 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 319 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 320 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 321 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.50
Nodes (4): Requirement: RN-13 SIGTERM stops cleanly, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable, Scenario: SIGTERM while the loop waits on an unreachable node

### Community 322 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 323 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 329 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 330 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 69 - "ADDED Requirements"
Cohesion: 0.04
Nodes (49): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+41 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 91 - "README.md"
Cohesion: 0.06
Nodes (25): For historical reference only, Phase → current status map, Tasks — superseded by per-sprint openspec changes, 1. Durability contract, 3. Cancellation semantics, 4. Save-retry caveat, 5. Lease limitation, 6. Backup/restore guidance (+17 more)

### Community 94 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-8949`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `RFC-6455` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3693 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `host.ts`, `process-backends.ts`, `api-server.test.ts`, `migrate.ts`, `adapter-fixtures.ts`, `core-block-parsed.ts`, `loop.ts`, `column-rules.ts`, `loop.test.ts`, `core-private-source.test.ts`, `chain-placement.test.ts`, `runner/process.ts`, `core-transport.ts`, `tape/index.ts`, `ReadHandle`, `declaration.ts`, `validate.ts`, `record-and-replay.test.ts`, `validate.test.ts`, `ref_node_url`, `module-tables.ts`, `client.test.ts`, `refused-configuration.test.ts`, `builds.ts`, `process-build.ts`, `db/errors.ts`, `ledger-storage.test.ts`, `TapeNode`, `opt-out.test.ts`, `ref_node_fs`, `history.test.ts`, `core-block-commit.test.ts`, `src/db/postgres.ts`, `core-ledger-state.ts`, `transform-checks.ts`, `backup/restore.ts`, `builder.test.ts`, `ledger/ledger-tasks.test.ts`, `writer-lock-checks.ts`, `.from`, `change-capture.ts`, `backup/backup.ts`, `config-check.ts`, `ref_node_timers`, `loop-stop-harness.ts`, `contract-data-checks.ts`, `cli/command.ts`, `process-worker.ts`, `intake.test.ts`, `mapping.ts`, `slow-block-harness.ts`, `admin-harness.ts`, `zero-timeouts-checks.ts`, `boundary.test.ts`, `NodeClient`, `validation.ts`, `pglite-server.ts`, `spawnChild`, `core-config.test.ts`, `ledger-sweep.test.ts`, `private/backends.ts`, `core-settings.ts`, `serve.test.ts`, `version-checks.ts`, `admin/types.ts`, `retirement.test.ts`, `test/postgres/setup.ts`, `config/plain-data.ts`, `networks.ts`, `real-tapes.ts`, `in-memory-source.ts`, `cold-boot-recovery.integration.test.ts`, `configured.ts`, `cbor.property.test.ts`, `node-format.ts`, `browser.test.ts`, `vendored-ledger-v9.test.ts`, `restore-private.ts`, `run.test.ts`, `type-check.ts`, `browser/build.ts`, `code-registry.ts`, `ws-mutual-tls.test.ts`, `chain-process.test.ts`, `crash.test.ts`, `net.test.ts`, `pg-tx-history-adapter.ts`, `Lockstep`, `sigterm.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `height-versioned.property.test.ts`, `package.json`, `readiness.test.ts`, `node-bridge.ts`, `adapter-core.test.ts`, `status-schema.test.ts`, `block-fetch-decode.test.ts`, `transaction-history-storage.property.test.ts`, `lockstep-refusals.test.ts`, `key-handling-checks.ts`, `package-identity.test.ts`, `admin/configuration.ts`, `recovery.test.ts`, `private/lockstep-wait.test.ts`, `statementsOf`, `transaction-history-storage.test.ts`, `mutation-per-adapter.mjs`, `web-lock.ts`, `excluded-not-exported.test.ts`, `twox.ts`, `postgres-image.test.ts`, `worker-threads.test.ts`?**
  _High betweenness centrality (0.230) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `host.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0262242888860961 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `host.ts`, `process-backends.ts`, `api-server.test.ts`, `migrate.ts`, `core-block-parsed.ts`, `loop.ts`, `column-rules.ts`, `InMemoryBlockSource`, `core-private-source.test.ts`, `loop.test.ts`, `FinalizedLoop`, `runner/process.ts`, `core-transport.ts`, `readiness.test.ts`, `ReadHandle`, `tape/index.ts`, `declaration.ts`, `validate.ts`, `validate.test.ts`, `status-schema.test.ts`, `module-tables.ts`, `client.test.ts`, `refused-configuration.test.ts`, `builds.ts`, `process-build.ts`, `db/errors.ts`, `ledger-storage.test.ts`, `lockstep-refusals.test.ts`, `opt-out.test.ts`, `ref_node_fs`, `package-identity.test.ts`, `history.test.ts`, `core-block-commit.test.ts`, `src/db/postgres.ts`, `core-ledger-state.ts`, `config/history.ts`, `transform-checks.ts`, `NodeBlockSource`, `backup/restore.ts`, `builder.test.ts`, `range.ts`, `writer-lock-checks.ts`, `backup/backup.ts`, `config-check.ts`, `ref_node_timers`, `client.ts`, `version-table.ts`, `process-admin.ts`, `process-worker.ts`, `UmbraDB module guide`, `statementsOf`, `checkShape`, `mapping.ts`, `cbor.ts`, `slow-block-harness.ts`, `zero-timeouts-checks.ts`, `web-lock.ts`, `NodeClient`, `validation.ts`, `graph.ts`, `private/backends.ts`, `core-settings.ts`, `version-checks.ts`, `RuntimeMetadata`, `config/plain-data.ts`, `sha256`, `configured.ts`, `chain-process.test.ts`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `process-backends.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.028938167096061833 - nodes in this community are weakly interconnected._