# Graph Report - UmbraDB

## Corpus Check
- 1021 files · ~1,504,995 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10831 nodes · 32024 edges · 344 communities (310 shown, 34 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2597 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `1fbe8089b0c212e9` (1021 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- migrate.ts
- declaration.ts
- tape/index.ts
- ledger-storage.test.ts
- cli/command.ts
- postgres/transaction-history-storage.ts
- .concat
- code-registry.ts
- vitest
- digest.test.ts
- PrivateTransport
- admin-harness.ts
- order.property.test.ts
- Lockstep
- browser/build.ts
- core-block-fetch/metadata.ts
- Process
- snapshot.test.ts
- restore-private.ts
- column-rules.ts
- ws-mutual-tls.test.ts
- containers.test.ts
- redact.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- core-private-source.test.ts
- crash.test.ts
- interfaces/transaction-history-storage.ts
- accepted-hash-checks.ts
- referenceMergeEntries
- node-bridge.ts
- cbor.property.test.ts
- NodeClient
- net.test.ts
- sweep.ts
- dispatch.ts
- test/postgres/setup.ts
- worker-storage.test.ts
- EntryBoundary
- core-transport.ts
- TransactionHistoryEntry
- ledger-sweep.test.ts
- extrinsics.ts
- version-table.ts
- transaction-history-storage.property.test.ts
- .from
- checkShape
- .value
- childRefKeys
- lockstep-refusals.test.ts
- key-handling-checks.ts
- contents-hash.ts
- client.test.ts
- package-identity.test.ts
- ws.ts
- JsonValue
- config-check.ts
- readRuntimeMetadata
- retention.ts
- PortSocket
- .write
- ChromeTab
- ref_node_crypto
- browser-harness.ts
- chrome.ts
- no-indexer-or-wallet-sdk.test.ts
- web-lock.ts
- Buffer
- Design — Sprint 1: project setup + TemporalKV
- TapeAnswers
- db/api.ts
- module-tables.ts
- intake.test.ts
- worker-threads-worker.ts
- buffer.ts
- Worker
- transform-checks.ts
- range.ts
- postgres-image.ts
- sha256
- Roadmap for the missing formalization
- record-and-replay.test.ts
- ProcessItems
- postgres-image.test.ts
- stats.ts
- page-server.ts
- validate.ts
- node.ts
- ledger/plain-data.ts
- worker-threads.test.ts
- CliBackend
- process-admin.ts
- mutation-evidence.d.mts
- EventsRunner
- AsyncLocalStorage
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- contract-modules.test.ts
- LedgerPackage
- CrashWorkerHandle
- worker-threads-host.ts
- ref_node_fs
- api-server.test.ts
- writer-lock-checks.ts
- SkipsAfterReconnect
- refused-configuration.test.ts
- https.ts
- NodeFS
- builder.test.ts
- private/backends.ts
- backup/restore.ts
- binding.test.ts
- .read
- core-block-parsed.ts
- ingest-harness.ts
- cli-fixtures.ts
- UmbraError
- ingest
- process-worker.ts
- cbor.ts
- ref_node_url
- chain-events-decode.test.ts
- runner/process.ts
- BlockRef
- FinalizedLoop
- contract-data-checks.ts
- mapping.ts
- InMemoryBlockSource
- ledger/load.ts
- ledger-tapes.ts
- validation.ts
- process-build.ts
- slow-block-harness.ts
- backup/backup.ts
- PgTransactionHistoryStorage
- NodeBlockSource
- loop.ts
- entries.ts
- version
- graph.ts
- boundary.test.ts
- status-schema.test.ts
- chain-process.test.ts
- zero-timeouts-checks.ts
- version-checks.ts
- ledger/types.ts
- retirement.test.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- pg-tx-history-adapter.ts
- config/plain-data.ts
- real-tapes.ts
- T
- networks.ts
- adapter-fixtures.ts
- private/lockstep-wait.test.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- startup-stop-harness.ts
- core-ledger-state.ts
- ledger-state.test.ts
- config/history.ts
- core-block-commit.test.ts
- node-source.ts
- process-backends.ts
- ledger-tasks-checks.ts
- page.ts
- browser.test.ts
- table
- refused
- Design — Sprint 3: CheckpointStore
- cold-boot-recovery.integration.test.ts
- UmbraDB 1.0.0 Release Contracts
- ADDED Requirements
- migrations
- .slowBlockMs
- block-fetch-decode.test.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- core-ledger-state.test.ts
- mutation-per-adapter.mjs
- twox.ts
- v9
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- pack-install.mjs
- path.ts
- Performance — design
- continueTo
- orphan-watcher.mjs
- read-only-checks.ts
- leanProblems
- history
- fn
- .put
- code
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- Requirements
- ROADMAP.md
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Full-Chain Storage — Design
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- UmbraDB V1.0.0 Implementation Guideline
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
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- compilerOptions
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
- conformance-gate.mjs
- Contributing
- Checkpoint-store composition contract — cursor ordering and replay
- Storage Algebra Lean M3a Watermarks Sprint
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
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
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- bug-report.md
- feature-request.md
- GC architecture and query-tracing: research findings
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
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
- post-block-update/oracle/main.rs
- ADDED Requirements
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 325 edges
2. `UmbraError` - 301 edges
3. `ModuleDeclaration` - 172 edges
4. `FinalizedLoop` - 120 edges
5. `NodeClient` - 113 edges
6. `InMemoryBlockSource` - 105 edges
7. `Database` - 97 edges
8. `BlockRef` - 94 edges
9. `ReadHandle` - 85 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (344 total, 34 thin omitted)

### Community 0 - "migrate.ts"
Cohesion: 0.02
Nodes (166): SchemaWriteHandle, Transaction, CapturedTable, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+158 more)

### Community 1 - "declaration.ts"
Cohesion: 0.02
Nodes (173): AppliedMigration, ErrorCode, ApiRegistry, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemDeclaration (+165 more)

### Community 10 - "tape/index.ts"
Cohesion: 0.04
Nodes (102): ProcessCondition, ArgType, BlockOptions, CallSpec, chainBlock, PalletSpec, RUNTIME, Decoded (+94 more)

### Community 101 - "ledger-storage.test.ts"
Cohesion: 0.13
Nodes (30): SeenLoad, retentionSeen, LedgerTx, coreLedgerState(), retainedStatesOf(), a100Problems(), a102Problems(), a104KeyProblems() (+22 more)

### Community 102 - "cli/command.ts"
Cohesion: 0.11
Nodes (27): RestoreSeams, CommandHandler, CommandIo, MainProcess, RestoreCommandSeams, CommandResult, backupArguments(), backupCommand() (+19 more)

### Community 103 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (22): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+14 more)

### Community 104 - ".concat"
Cohesion: 0.08
Nodes (20): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+12 more)

### Community 106 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 107 - "vitest"
Cohesion: 0.07
Nodes (16): Upstream, ReportedTest, filesUnder(), patchesOf(), patchText(), ANSWER_WASM, settings, ledgerDir (+8 more)

### Community 108 - "digest.test.ts"
Cohesion: 0.09
Nodes (29): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+21 more)

### Community 109 - "PrivateTransport"
Cohesion: 0.12
Nodes (9): PublicSide, HelloAck, PrivateTransport, Waiter, messageText(), lost(), reject(), resolve() (+1 more)

### Community 11 - "admin-harness.ts"
Cohesion: 0.04
Nodes (95): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+87 more)

### Community 110 - "order.property.test.ts"
Cohesion: 0.10
Nodes (29): CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce(), checkParallelWaits() (+21 more)

### Community 111 - "Lockstep"
Cohesion: 0.09
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 112 - "browser/build.ts"
Cohesion: 0.09
Nodes (24): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+16 more)

### Community 115 - "core-block-fetch/metadata.ts"
Cohesion: 0.11
Nodes (24): MetadataField, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive, RuntimeMetadataView, ChainTransaction (+16 more)

### Community 116 - "Process"
Cohesion: 0.15
Nodes (6): BackupWritten, CoreTransport, Process, messageOf(), nodeClientClosed(), pause()

### Community 118 - "snapshot.test.ts"
Cohesion: 0.11
Nodes (21): AllowedDetail, ProcessReason, ReasonCode, Unwrapped, StatusFacts, errorMessage(), failureOf(), sanitizedError() (+13 more)

### Community 119 - "restore-private.ts"
Cohesion: 0.14
Nodes (23): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+15 more)

### Community 12 - "column-rules.ts"
Cohesion: 0.02
Nodes (103): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+95 more)

### Community 121 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (21): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+13 more)

### Community 124 - "containers.test.ts"
Cohesion: 0.11
Nodes (19): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+11 more)

### Community 126 - "redact.ts"
Cohesion: 0.13
Nodes (20): RedactionForms, SecretForm, TextPattern, Needs, findings(), configRedactor(), credentialsIn(), decoded() (+12 more)

### Community 127 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 128 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 129 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 13 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (61): PrivateBlockSource, PrivateChecks, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes, PublicConfiguration, PublicDatabase (+53 more)

### Community 130 - "crash.test.ts"
Cohesion: 0.12
Nodes (22): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+14 more)

### Community 131 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (19): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, EntryContentSchema, EntryLifecycleSchema (+11 more)

### Community 135 - "accepted-hash-checks.ts"
Cohesion: 0.15
Nodes (24): PrivateIntakeOptions, A165Options, a165Run, Attempt, PrivateOptions, privateCursorHeight(), a165Problems(), contentsOf() (+16 more)

### Community 136 - "referenceMergeEntries"
Cohesion: 0.10
Nodes (20): MergeEntriesFn, isPlainObject(), mergeSections(), referenceMergeEntries(), 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 3.1 Field mapping (write path) (+12 more)

### Community 138 - "node-bridge.ts"
Cohesion: 0.13
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 139 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 14 - "NodeClient"
Cohesion: 0.05
Nodes (69): NodeSourceOptions, CoreChainBinding, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+61 more)

### Community 142 - "net.test.ts"
Cohesion: 0.14
Nodes (12): NetworkBroker, IncomingMessage, Server, NetworkMessage, createServer(), listen(), pagePort(), unlisten() (+4 more)

### Community 145 - "sweep.ts"
Cohesion: 0.12
Nodes (12): GreyView, SweepPhase, SweepTables, SweepWrites, byBytes(), BYTE_ORDER(), hexOf(), merged() (+4 more)

### Community 146 - "dispatch.ts"
Cohesion: 0.19
Nodes (22): Callback, ParallelPoint, boundaryModules(), call(), dispatch(), isBackbonePart(), isParallelPoint(), moduleWaves() (+14 more)

### Community 147 - "test/postgres/setup.ts"
Cohesion: 0.14
Nodes (21): Cancellable, CrashHook, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker(), backendPid() (+13 more)

### Community 148 - "worker-storage.test.ts"
Cohesion: 0.15
Nodes (15): ChainOutcome, StoredNode, CallTx, StagenetBlockJson, StagenetFixtureJson, Nodes, bytes(), at() (+7 more)

### Community 149 - "EntryBoundary"
Cohesion: 0.11
Nodes (8): EntryBoundary, PointSchedule, Activity, SkipsStartAtRestart, StartsAtEveryRevision, CoreStopsFirst, entryIdOf(), tracked()

### Community 15 - "core-transport.ts"
Cohesion: 0.03
Nodes (92): Session, TransportLimits, TransportTls, Committed, Hello, Message, MessageFault, MessageType (+84 more)

### Community 152 - "TransactionHistoryEntry"
Cohesion: 0.16
Nodes (9): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, 4. Wiring `PgTemporalKV`'s `opts.tx`, 2. `set`, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+1 more)

### Community 154 - "ledger-sweep.test.ts"
Cohesion: 0.18
Nodes (12): SweepState, Block, MemoryTables, writeSweep(), bigints(), compare(), fixtureBlocks(), hex() (+4 more)

### Community 155 - "extrinsics.ts"
Cohesion: 0.12
Nodes (20): BodyExtrinsic, ExtrinsicCall, BlockBody, MetadataPallet, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic() (+12 more)

### Community 156 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 159 - "transaction-history-storage.property.test.ts"
Cohesion: 0.10
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 16 - ".from"
Cohesion: 0.03
Nodes (89): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+81 more)

### Community 160 - "checkShape"
Cohesion: 0.23
Nodes (12): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+4 more)

### Community 162 - ".value"
Cohesion: 0.28
Nodes (7): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 164 - "childRefKeys"
Cohesion: 0.17
Nodes (7): ChildReader, ModelBatch, ModelSnapshot, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 165 - "lockstep-refusals.test.ts"
Cohesion: 0.20
Nodes (19): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+11 more)

### Community 166 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 167 - "contents-hash.ts"
Cohesion: 0.13
Nodes (16): CaptureColumn, ModuleColumn, PageOptions, ColumnType, encodeTableRow(), renderKeyValue(), explain(), valueFailureBecause() (+8 more)

### Community 17 - "client.test.ts"
Cohesion: 0.03
Nodes (59): Connection, NodeRetry, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets, Answer (+51 more)

### Community 170 - "package-identity.test.ts"
Cohesion: 0.19
Nodes (16): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+8 more)

### Community 171 - "ws.ts"
Cohesion: 0.14
Nodes (8): Emitter, Frame, Listener, PortUpgrade, RawData, WebSocket, WebSocketServer, connect()

### Community 172 - "JsonValue"
Cohesion: 0.12
Nodes (17): JsonValue, 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file) (+9 more)

### Community 18 - "config-check.ts"
Cohesion: 0.04
Nodes (87): BackupOutcome, CheckFinding, CheckState, ConfigCheckSeams, StepName, StepReport, StepStatus, CommandConfig (+79 more)

### Community 181 - "readRuntimeMetadata"
Cohesion: 0.40
Nodes (9): TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry(), storageEntry(), strings() (+1 more)

### Community 183 - "retention.ts"
Cohesion: 0.17
Nodes (12): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions, releasesOf(), revisionsOf(), coreRevisionsOf() (+4 more)

### Community 184 - "PortSocket"
Cohesion: 0.22
Nodes (6): PortSocket, pair(), Evidence, Contract states and contract logs, Requirement: RN-15 Module APIs are registered once, at startup, Scenario: Two modules claim one path

### Community 186 - ".write"
Cohesion: 0.16
Nodes (3): UnexpectedCursor, isBlock(), sameBytes()

### Community 19 - "ref_node_crypto"
Cohesion: 0.05
Nodes (58): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+50 more)

### Community 190 - "browser-harness.ts"
Cohesion: 0.27
Nodes (13): ProcessName, backupThrough(), call(), eventsOf(), eventWhen(), logOf(), pageWhen(), restoreThrough() (+5 more)

### Community 191 - "chrome.ts"
Cohesion: 0.23
Nodes (11): Cdp, CdpEvent, Download, PageRequest, chrome(), chrome(), chromePath(), chromeVersion() (+3 more)

### Community 192 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 193 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 194 - "Buffer"
Cohesion: 0.16
Nodes (8): Buffer, Hash, createHash(), 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 195 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.15
Nodes (13): Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4a. Error translation (`src/postgres/errors.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV (+5 more)

### Community 199 - "TapeAnswers"
Cohesion: 0.25
Nodes (9): TapeAnswers, FoundTape, Tape, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf() (+1 more)

### Community 2 - "db/api.ts"
Cohesion: 0.02
Nodes (114): BlockWriteHandle, CommittedHeight, Database, ReadHandle, ReadOptions, cursorTable, CursorTableOptions, CursorValue (+106 more)

### Community 20 - "module-tables.ts"
Cohesion: 0.05
Nodes (64): CaptureState, ModuleTable, ConsistentRead, RefusalPlace, DeterminismBackend, TestDatabase, TestServer, Backend (+56 more)

### Community 200 - "intake.test.ts"
Cohesion: 0.26
Nodes (12): PrivateProcess, PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), follow(), heights() (+4 more)

### Community 207 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 208 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 21 - "transform-checks.ts"
Cohesion: 0.06
Nodes (66): Failure, Variant, TapeError, TapeProblem, TransformError, TransformProblem, CallRecord, DisconnectRecord (+58 more)

### Community 22 - "range.ts"
Cohesion: 0.04
Nodes (72): NodeSubscription, Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions (+64 more)

### Community 222 - "postgres-image.ts"
Cohesion: 0.27
Nodes (6): BenchEnv, PG_SETTINGS, container, { guarded, fixture }, POSTGRES_IMAGE, @testcontainers/postgresql

### Community 223 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 228 - "Roadmap for the missing formalization"
Cohesion: 0.20
Nodes (9): Key, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec (+1 more)

### Community 23 - "record-and-replay.test.ts"
Cohesion: 0.04
Nodes (45): ConnectSocket, Outage, Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions (+37 more)

### Community 235 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 236 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 237 - "page-server.ts"
Cohesion: 0.28
Nodes (6): BrowserBuild, pageBench, PageServer, servePage(), ISOLATION_HEADERS, TYPES

### Community 24 - "validate.ts"
Cohesion: 0.04
Nodes (79): plainData, ConfigInput, ConfigRule, CursorRule, EntryRef, Finding, Issue, Plain (+71 more)

### Community 25 - "node.ts"
Cohesion: 0.06
Nodes (46): RecordingProblem, readRequest, RequestId, Json, NotJsonError, Connection, TapeCall, TapeClock (+38 more)

### Community 251 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 253 - "CliBackend"
Cohesion: 0.29
Nodes (4): CliBackend, main(), pauseUntilKilled(), requireEnv()

### Community 26 - "process-admin.ts"
Cohesion: 0.05
Nodes (66): OpenedConfig, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, DigestRow, ModuleFacts, NodeFacts (+58 more)

### Community 262 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 269 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 27 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (68): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+60 more)

### Community 28 - "LedgerPackage"
Cohesion: 0.06
Nodes (38): LedgerEventKind, LedgerPackage, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, stagenetReplay, hexOf() (+30 more)

### Community 285 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 29 - "ref_node_fs"
Cohesion: 0.07
Nodes (52): BackupBackend, BackupDatabase, killedRestore, TickerConfig, Pem, catalogOf(), dockerExec(), hashOf() (+44 more)

### Community 3 - "api-server.test.ts"
Cohesion: 0.02
Nodes (132): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ModuleTableOptions, HeadersArgument, ModuleApiServer, ModuleApiServerOptions (+124 more)

### Community 30 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (61): Held, PgliteLockUse, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, acquirePgliteLock() (+53 more)

### Community 31 - "refused-configuration.test.ts"
Cohesion: 0.06
Nodes (67): AdminStarter, versionEntry, ProcessConfig, AdminRun, Observation, Start, Refusal, Start (+59 more)

### Community 32 - "builder.test.ts"
Cohesion: 0.04
Nodes (37): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Metadata, Step, Frame (+29 more)

### Community 33 - "private/backends.ts"
Cohesion: 0.05
Nodes (48): startHashDecision, PrivateBackend, SessionSeen, TestDatabase, A162Options, a162Run, HeaderSeen, Pause (+40 more)

### Community 34 - "backup/restore.ts"
Cohesion: 0.05
Nodes (58): RestoreChain, RestoreInput, RestoreTarget, MetaCommands, Piece, State, StatementSplitter, BackupText (+50 more)

### Community 35 - "binding.test.ts"
Cohesion: 0.06
Nodes (59): A113Observation, A156Observation, Binding, Created, Outcome, PublicCore, InstanceHashes, OptedOutObservation (+51 more)

### Community 36 - ".read"
Cohesion: 0.05
Nodes (64): Chain, ChainOptions, DigestRow, Op, States, TableName, captured(), captureFunction() (+56 more)

### Community 37 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (65): BlockParsed, BlockParsedOptions, ChainEvent, itemsSeen, ledgerVersionOf(), blockBodyOf(), blockParsedOf(), coreBlockParsedOnParse() (+57 more)

### Community 38 - "ingest-harness.ts"
Cohesion: 0.07
Nodes (60): Manifest, Restored, NodeClientOptions, IngestOptions, SourceClass, watched, Call, RestartEvent (+52 more)

### Community 39 - "cli-fixtures.ts"
Cohesion: 0.05
Nodes (49): CheckStep, ConfigCheckReport, cliProject, CheckTarget, RunningCommand, statsConfig, configCheck(), configText() (+41 more)

### Community 4 - "UmbraError"
Cohesion: 0.03
Nodes (89): LoadedConfig, LoadOptions, PostgresOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadTimeoutSetting (+81 more)

### Community 40 - "ingest"
Cohesion: 0.07
Nodes (62): FixtureRun, ingest, TableSnapshot, Side, FixtureNode, FakeState, RefusalData, ProcessBackend (+54 more)

### Community 41 - "process-worker.ts"
Cohesion: 0.06
Nodes (51): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, Scope (+43 more)

### Community 42 - "cbor.ts"
Cohesion: 0.07
Nodes (57): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+49 more)

### Community 43 - "ref_node_url"
Cohesion: 0.04
Nodes (52): Child, ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, heldPort() (+44 more)

### Community 44 - "chain-events-decode.test.ts"
Cohesion: 0.07
Nodes (47): NodeCallOptions, RecordingClient, Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec (+39 more)

### Community 45 - "runner/process.ts"
Cohesion: 0.05
Nodes (42): ConfigFacts, Bound, ChainCheck, ChainCheckInput, ChainSource, CoreChainFacts, NodeWait, WaitingListener (+34 more)

### Community 46 - "BlockRef"
Cohesion: 0.05
Nodes (27): BlockItemSource, QueuedBlock, BlockRef, BlockSource, FinalityStallCondition, InMemoryItems, InMemorySourceOptions, Wait (+19 more)

### Community 47 - "FinalizedLoop"
Cohesion: 0.06
Nodes (20): FinalizedLoop, LoopObserver, Startup, SkipsLockstep, SkipsUnseen, WaitsInTransaction, WaitingInRead, ItemsAfterWrite (+12 more)

### Community 48 - "contract-data-checks.ts"
Cohesion: 0.08
Nodes (55): ContractStateRow, CoreContractStatesOptions, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+47 more)

### Community 49 - "mapping.ts"
Cohesion: 0.06
Nodes (40): ResultColumn, ResultType, Connection, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject() (+32 more)

### Community 5 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (105): InMemoryBlockSource, ProcessingEnd, ProcessStatus, Job, Flaky, ProcessObservation, A43Case, A43Observation (+97 more)

### Community 50 - "ledger/load.ts"
Cohesion: 0.05
Nodes (44): LedgerReleasePackage, V9Logs, AdapterWorkerRequest, SlowStep, TestLoaderData, OracleState, OracleVersion, loadLedgerPackage() (+36 more)

### Community 51 - "ledger-tapes.ts"
Cohesion: 0.07
Nodes (57): BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime, ledgerScenario, LedgerScenarioOptions (+49 more)

### Community 52 - "validation.ts"
Cohesion: 0.04
Nodes (55): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, PlacedDeclaration, Plain, DeepReadonly, PrivateKeys, PrivateOnly (+47 more)

### Community 54 - "process-build.ts"
Cohesion: 0.07
Nodes (34): coreEntry, ProcessHandle, TickerProcess, PrivateRefusal, CoreSeen, privateBackbone(), adminCoreSettings(), body() (+26 more)

### Community 55 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (46): BlockEventSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+38 more)

### Community 56 - "backup/backup.ts"
Cohesion: 0.08
Nodes (48): BackupInput, BackupSeams, BackupTarget, BackupFacts, ManifestHistoryRow, ManifestMigration, ManifestTool, DumpInput (+40 more)

### Community 57 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (51): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order) (+43 more)

### Community 58 - "NodeBlockSource"
Cohesion: 0.09
Nodes (12): HeadWait, NodeBlockSource, ConfiguredGenesis, PreparedBlock, QueueRunner, NoWindow, Refetches, TrustsNotifications (+4 more)

### Community 6 - "loop.ts"
Cohesion: 0.03
Nodes (93): ReadOnlyDatabase, PointName, HeightRange, BlockItems, LateUse, CallbackFailure, CommitOutcome, HeightActivity (+85 more)

### Community 60 - "entries.ts"
Cohesion: 0.05
Nodes (42): CoreLedgerVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+34 more)

### Community 61 - "version"
Cohesion: 0.04
Nodes (47): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+39 more)

### Community 62 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+40 more)

### Community 63 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 64 - "status-schema.test.ts"
Cohesion: 0.07
Nodes (32): ReadinessFacts, ProcessState, gate, Validator, Decision, ReadinessCase, readinessOf(), statusOf() (+24 more)

### Community 66 - "chain-process.test.ts"
Cohesion: 0.07
Nodes (32): WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing, Flaky (+24 more)

### Community 67 - "zero-timeouts-checks.ts"
Cohesion: 0.08
Nodes (34): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+26 more)

### Community 68 - "version-checks.ts"
Cohesion: 0.11
Nodes (36): Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk, Answers (+28 more)

### Community 7 - "ledger/types.ts"
Cohesion: 0.04
Nodes (94): LoadLedger, TransactionParser, LedgerStateItem, RetainedState, LedgerName, ApplyOutput, LedgerPackageOptions, LedgerTask (+86 more)

### Community 70 - "retirement.test.ts"
Cohesion: 0.07
Nodes (39): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), manifestProblems(), mutationProblems() (+31 more)

### Community 71 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 74 - "pg-tx-history-adapter.ts"
Cohesion: 0.07
Nodes (26): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, capitalize(), phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys() (+18 more)

### Community 75 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (31): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, copyArray(), copyObject() (+23 more)

### Community 76 - "real-tapes.ts"
Cohesion: 0.08
Nodes (33): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+25 more)

### Community 77 - "T"
Cohesion: 0.05
Nodes (39): Absent, n(), T(), input(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced) (+31 more)

### Community 79 - "networks.ts"
Cohesion: 0.07
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 8 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (107): ApplyInput, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+99 more)

### Community 80 - "private/lockstep-wait.test.ts"
Cohesion: 0.08
Nodes (21): Report, ExpectedWait, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, a117Problems(), firstWait() (+13 more)

### Community 81 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.05
Nodes (40): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+32 more)

### Community 82 - "startup-stop-harness.ts"
Cohesion: 0.10
Nodes (28): SignalTarget, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StopBy, WatchedClient (+20 more)

### Community 83 - "core-ledger-state.ts"
Cohesion: 0.08
Nodes (35): BlockLedgerSource, LedgerBinding, applyBlock(), boundLedger(), bytesOf(), contractsOf(), deployedBelow(), hex() (+27 more)

### Community 86 - "ledger-state.test.ts"
Cohesion: 0.13
Nodes (30): ProcessDatabase, a91Problems(), a92Problems(), a93Problems(), parsedRows(), resultRows(), text(), in8Problems() (+22 more)

### Community 9 - "config/history.ts"
Cohesion: 0.04
Nodes (111): OpenedFacts, CoreVersion, CoreSettings, ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding (+103 more)

### Community 91 - "core-block-commit.test.ts"
Cohesion: 0.09
Nodes (28): StandInOptions, Commit, Committed, blockHeaderOf(), checkParent(), commitBlock(), hex(), sameBytes() (+20 more)

### Community 92 - "node-source.ts"
Cohesion: 0.09
Nodes (17): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, Prefetch, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry (+9 more)

### Community 93 - "process-backends.ts"
Cohesion: 0.09
Nodes (26): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+18 more)

### Community 94 - "ledger-tasks-checks.ts"
Cohesion: 0.11
Nodes (30): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses(), plainWatchModule(), transactionsOf() (+22 more)

### Community 95 - "page.ts"
Cohesion: 0.07
Nodes (29): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog(), backUp() (+21 more)

### Community 98 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 105 - "table"
Cohesion: 0.07
Nodes (29): table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, Blocks from the node, Cursor tables, Data that is not a function of the chain (+21 more)

### Community 113 - "refused"
Cohesion: 0.07
Nodes (27): refused(), When a callback fails, A private process and a changed public configuration, The database, The node on `/status`, UmbraDB operator guide, 7. Storage helpers, ADDED Requirements (+19 more)

### Community 96 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.06
Nodes (32): 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design, v4 rewrite — the rollover runbook, rebuilt from four reproduced failures, run end-to-end for real (+24 more)

### Community 114 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.13
Nodes (18): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), registerSuiteLifecycle(), startTestDatabase(), registerSuiteLifecycle(), startTestDatabase() (+10 more)

### Community 117 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.07
Nodes (28): up(), name, 8. Migration, 1. Durability contract, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 4. Save-retry caveat, 5. Lease limitation (+20 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage (+18 more)

### Community 157 - "migrations"
Cohesion: 0.10
Nodes (19): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Migrations, Requirement: DB-9 Bootstrap, migrations and setup, Scenario: A changed migration refuses startup, Scenario: The second of two migrations fails, 6. Storage helpers, Impact (+11 more)

### Community 158 - ".slowBlockMs"
Cohesion: 0.11
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 163 - "block-fetch-decode.test.ts"
Cohesion: 0.18
Nodes (16): blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes(), encodeCompact() (+8 more)

### Community 168 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (16): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+8 more)

### Community 182 - "core-ledger-state.test.ts"
Cohesion: 0.13
Nodes (10): boundLedgerParser(), itemsOf(), writeBlock(), applied(), bound(), query(), refusing(), CORE_LEDGER_STATE_MIGRATIONS (+2 more)

### Community 189 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 201 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 210 - "v9"
Cohesion: 0.18
Nodes (10): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix, Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it (+2 more)

### Community 211 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 216 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 221 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 245 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 250 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 271 - "continueTo"
Cohesion: 0.40
Nodes (5): continueTo(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 282 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 304 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 316 - "leanProblems"
Cohesion: 0.50
Nodes (4): leanImports(), leanProblems(), leanTheorems(), retiredLean()

### Community 53 - "history"
Cohesion: 0.04
Nodes (56): integer(), history(), 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips (+48 more)

### Community 59 - "fn"
Cohesion: 0.04
Nodes (51): fn(), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly (+43 more)

### Community 65 - ".put"
Cohesion: 0.05
Nodes (43): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+35 more)

### Community 73 - "code"
Cohesion: 0.06
Nodes (40): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21), The catalog, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog (+32 more)

### Community 87 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-17 Ledger tasks give modules the native objects (+26 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+20 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 134 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 137 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 140 - "ROADMAP.md"
Cohesion: 0.08
Nodes (18): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+10 more)

### Community 141 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 144 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+15 more)

### Community 150 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.09
Nodes (17): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+9 more)

### Community 151 - "Full-Chain Storage — Design"
Cohesion: 0.09
Nodes (21): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+13 more)

### Community 153 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 169 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 173 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.11
Nodes (18): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.4 — Public surface, contracts, and DX (G1–G4, G20), §2.5 — Security (G15–G19), §2 — Engineering rules (+10 more)

### Community 174 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 175 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 176 - "chain_archive lineage"
Cohesion: 0.12
Nodes (17): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, CheckpointStore tables, How the two lineages coexist (+9 more)

### Community 177 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 179 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 180 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 185 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 196 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 197 - "REMOVED Requirements"
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

### Community 206 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 212 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 213 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 214 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 215 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 217 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 218 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 219 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 220 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.18
Nodes (10): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds, 8. CI (+2 more)

### Community 224 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 225 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 226 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 227 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 229 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 230 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure, Design — Sprint 2: Transaction/Lease (+1 more)

### Community 231 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 232 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 233 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 238 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 239 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 240 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 241 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 242 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 243 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 244 - "conformance-gate.mjs"
Cohesion: 0.22
Nodes (8): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli

### Community 246 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 247 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 248 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 249 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 254 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 255 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 256 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 257 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 258 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 259 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 260 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 261 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 265 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 266 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 267 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 268 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 270 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 272 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 273 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 274 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 275 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 276 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 277 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 278 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 279 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 280 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 281 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 284 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 286 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

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

### Community 293 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 294 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 295 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 296 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 297 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 298 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 299 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 300 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 301 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 302 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 303 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 306 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 307 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 308 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.50
Nodes (3): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Problem, Suggested fix

### Community 309 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 310 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 311 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 312 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 313 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 314 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 315 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 321 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 322 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 69 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 84 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 88 - "README.md"
Cohesion: 0.07
Nodes (26): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased], 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable) (+18 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-16 Chain-data reads name their view and height, Requirement: RN-1 The main program is a fixed sequence of points (+29 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+26 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-8949`, `RFC-3339`, `RFC-3339`, `RFC-8949`, `@stryker-mutator/core` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3721 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `migrate.ts`, `declaration.ts`, `db/api.ts`, `api-server.test.ts`, `UmbraError`, `InMemoryBlockSource`, `loop.ts`, `ledger/types.ts`, `adapter-fixtures.ts`, `config/history.ts`, `tape/index.ts`, `admin-harness.ts`, `column-rules.ts`, `core-private-source.test.ts`, `NodeClient`, `core-transport.ts`, `.from`, `client.test.ts`, `config-check.ts`, `ref_node_crypto`, `module-tables.ts`, `transform-checks.ts`, `record-and-replay.test.ts`, `validate.ts`, `node.ts`, `contract-modules.test.ts`, `ref_node_fs`, `writer-lock-checks.ts`, `refused-configuration.test.ts`, `builder.test.ts`, `private/backends.ts`, `backup/restore.ts`, `binding.test.ts`, `.read`, `core-block-parsed.ts`, `ingest-harness.ts`, `cli-fixtures.ts`, `ingest`, `process-worker.ts`, `cbor.ts`, `ref_node_url`, `chain-events-decode.test.ts`, `runner/process.ts`, `BlockRef`, `contract-data-checks.ts`, `mapping.ts`, `ledger/load.ts`, `ledger-tapes.ts`, `validation.ts`, `process-build.ts`, `slow-block-harness.ts`, `backup/backup.ts`, `entries.ts`, `boundary.test.ts`, `status-schema.test.ts`, `chain-process.test.ts`, `zero-timeouts-checks.ts`, `version-checks.ts`, `retirement.test.ts`, `pg-tx-history-adapter.ts`, `config/plain-data.ts`, `real-tapes.ts`, `networks.ts`, `private/lockstep-wait.test.ts`, `startup-stop-harness.ts`, `core-ledger-state.ts`, `ledger-state.test.ts`, `core-block-commit.test.ts`, `process-backends.ts`, `ledger-tasks-checks.ts`, `browser.test.ts`, `ledger-storage.test.ts`, `cli/command.ts`, `postgres/transaction-history-storage.ts`, `code-registry.ts`, `digest.test.ts`, `order.property.test.ts`, `Lockstep`, `browser/build.ts`, `cold-boot-recovery.integration.test.ts`, `snapshot.test.ts`, `restore-private.ts`, `ws-mutual-tls.test.ts`, `containers.test.ts`, `redact.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `crash.test.ts`, `package.json`, `node-bridge.ts`, `cbor.property.test.ts`, `net.test.ts`, `test/postgres/setup.ts`, `worker-storage.test.ts`, `ledger-sweep.test.ts`, `transaction-history-storage.property.test.ts`, `block-fetch-decode.test.ts`, `lockstep-refusals.test.ts`, `key-handling-checks.ts`, `package-identity.test.ts`, `core-ledger-state.test.ts`, `retention.ts`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `excluded-not-exported.test.ts`, `intake.test.ts`, `twox.ts`, `facade-merge-loader.ts`, `postgres-image.test.ts`, `worker-threads.test.ts`?**
  _High betweenness centrality (0.257) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02014165559982293 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `migrate.ts`, `declaration.ts`, `db/api.ts`, `api-server.test.ts`, `InMemoryBlockSource`, `loop.ts`, `ledger/types.ts`, `config/history.ts`, `tape/index.ts`, `core-private-source.test.ts`, `NodeClient`, `core-transport.ts`, `client.test.ts`, `config-check.ts`, `module-tables.ts`, `transform-checks.ts`, `range.ts`, `validate.ts`, `node.ts`, `process-admin.ts`, `contract-modules.test.ts`, `version-table.ts`, `ref_node_fs`, `writer-lock-checks.ts`, `refused-configuration.test.ts`, `checkShape`, `private/backends.ts`, `backup/restore.ts`, `binding.test.ts`, `.read`, `core-block-parsed.ts`, `ingest-harness.ts`, `lockstep-refusals.test.ts`, `process-worker.ts`, `package-identity.test.ts`, `cbor.ts`, `runner/process.ts`, `BlockRef`, `FinalizedLoop`, `mapping.ts`, `validation.ts`, `core-ledger-state.test.ts`, `slow-block-harness.ts`, `backup/backup.ts`, `NodeBlockSource`, `entries.ts`, `graph.ts`, `status-schema.test.ts`, `web-lock.ts`, `chain-process.test.ts`, `zero-timeouts-checks.ts`, `version-checks.ts`, `config/plain-data.ts`, `core-ledger-state.ts`, `core-block-commit.test.ts`, `node-source.ts`, `sha256`, `table`, `PrivateTransport`, `snapshot.test.ts`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020954015590359722 - nodes in this community are weakly interconnected._