# Graph Report - UmbraDB

## Corpus Check
- 1017 files · ~1,459,755 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10859 nodes · 32812 edges · 333 communities (301 shown, 32 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2549 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `a8256db9c8319cdb` (1017 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- api-server.test.ts
- migrate.ts
- contract-data-checks.ts
- browser/build.ts
- TransactionHistoryEntry
- release-version.test.ts
- order.property.test.ts
- page.ts
- config/plain-data.ts
- paused-harness.ts
- postgres/transaction-history-storage.ts
- loop.test.ts
- LoopPauses
- code-registry.ts
- items.ts
- node-fields-harness.ts
- mapping.ts
- pg-tx-history-adapter.ts
- BlockRef
- public-items.test.ts
- tape/index.ts
- Lockstep
- documents.ts
- crash.test.ts
- restore-private.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- read-gate.ts
- node-bridge.ts
- client.test.ts
- ws-mutual-tls.test.ts
- relays.ts
- src/ledger/identity.ts
- cbor.property.test.ts
- .concat
- failures.ts
- NodeClient
- Registry
- block-fetch-decode.test.ts
- placement.ts
- readiness.test.ts
- key-handling-checks.ts
- core-private-source.test.ts
- version-table.ts
- lockstep-refusals.test.ts
- browser-harness.ts
- net.test.ts
- ws.ts
- InMemoryBlockSource
- source-scan.ts
- private/lockstep-wait.test.ts
- statementsOf
- Design — Sprint 1: project setup + TemporalKV
- transform-checks.ts
- BlockItems
- checkShape
- read-height.property.test.ts
- HeldHeight
- no-indexer-or-wallet-sdk.test.ts
- web-lock.ts
- PortSocket
- validation.ts
- .send
- extrinsics.ts
- launchChrome
- history.property.test.ts
- core-ledger-state.ts
- component-table.test.ts
- worker-threads-worker.ts
- src/protocol.ts
- Worker
- fetch-fixtures.ts
- process-build.ts
- TapeAnswers
- column-rules.ts
- type-check.ts
- ProcessItems
- ingest-crash.worker.ts
- stats.ts
- page-server.ts
- durability-probe.test.ts
- signal-backup.worker.ts
- spawnChild
- ledger/plain-data.ts
- block-context.ts
- worker-threads.test.ts
- UmbraError
- mutation-evidence.d.mts
- HeightActivity
- NetworkBroker
- AsyncLocalStorage
- refused-configuration.test.ts
- ref_node_path
- worker-threads-host.ts
- validate.ts
- ledger/ledger-tasks.test.ts
- core-transport.ts
- db/errors.ts
- adapter.ts
- CliBackend
- https.ts
- node-format.ts
- PageState
- NodeFS
- builds.ts
- cbor.ts
- module-tables.ts
- config-check.ts
- loop-stop-harness.ts
- builder.test.ts
- ModuleDeclaration
- FinalizedLoop
- ledger/types.ts
- backup/backup.ts
- startLedgerWorker
- NodeBlockSource
- ledger-sweep.test.ts
- range.test.ts
- range.ts
- runner/process.ts
- vitest
- opt-out.test.ts
- declaration.ts
- PgTransactionHistoryStorage
- slow-block-harness.ts
- Process
- change-capture.ts
- ref_node_crypto
- sweep-tapes.ts
- intake.test.ts
- cli/command.ts
- loop.ts
- .from
- pause-fixtures.ts
- process-worker.ts
- graph.ts
- interfaces/transaction-history-storage.ts
- binding.test.ts
- core-settings.ts
- backup/restore.ts
- zero-timeouts-checks.ts
- process-backends.ts
- retirement.test.ts
- adapter-fixtures.ts
- .value
- file-mode.test.ts
- networks.ts
- config/history.ts
- transport.test.ts
- messages.ts
- shims.test.ts
- cold-boot-recovery.integration.test.ts
- version-checks.ts
- test/postgres/setup.ts
- PointName
- browser.test.ts
- height-versioned.test.ts
- signal-backup.test.ts
- core-chain-events.ts
- core-block-commit.test.ts
- Design — Sprint 3: CheckpointStore
- 8. Admin endpoints
- version
- boundary.test.ts
- mapping.test.ts
- T
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- .slowBlockMs
- mutation-per-adapter.mjs
- twox.ts
- UmbraDB third-party component inventory (SBOM)
- pack-install.mjs
- scoped-review-manifest
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- .boolean
- v9
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- fresh-instance.mjs
- crash-worker.ts
- table
- history
- code
- ADDED Requirements
- graph.py
- .put
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- ADDED Requirements
- stryker.conf.json
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- ADDED Requirements
- Requirement: BK-1 Backup
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- Design — Sprint 4: Watermarks
- explore.md
- UmbraDB software supply-chain directory
- Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.9.5] - 2026-07-25 — "Penumbra"
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- ADDED Requirements
- Tasks — v1.0.0 API Surface & Release Contract
- Tasks — v1.0.0-infosec-signoff
- Contributing
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Tasks — Sprint 2: Transaction/Lease
- Proposal — Sprint 4: Watermarks
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-infosec-signoff
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- lib.sh
- Vendored ledger builds
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask
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
- bug-report.md
- feature-request.md
- Tasks — Sprint 1: project setup + TemporalKV
- Requirement: RN-16 Chain-data reads name their view and height
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- start-stack.sh
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
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
- UmbraDB
- ADDED Requirements
- package.json
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 344 edges
2. `UmbraError` - 306 edges
3. `ModuleDeclaration` - 174 edges
4. `FinalizedLoop` - 131 edges
5. `InMemoryBlockSource` - 116 edges
6. `NodeClient` - 113 edges
7. `Database` - 97 edges
8. `BlockRef` - 94 edges
9. `ReadHandle` - 85 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
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

## Communities (333 total, 32 thin omitted)

### Community 0 - "api-server.test.ts"
Cohesion: 0.02
Nodes (168): ModuleApiServer, ModuleApiStart, StartedModuleApi, ReadHandle, OwnPart, ApiRegistry, FieldKind, FieldSchema (+160 more)

### Community 1 - "migrate.ts"
Cohesion: 0.02
Nodes (139): BlockWriteHandle, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+131 more)

### Community 10 - "contract-data-checks.ts"
Cohesion: 0.03
Nodes (126): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+118 more)

### Community 100 - "browser/build.ts"
Cohesion: 0.08
Nodes (25): BrowserBuildOptions, BrowserControl, CheckedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+17 more)

### Community 101 - "TransactionHistoryEntry"
Cohesion: 0.09
Nodes (12): MergeEntriesFn, TransactionHistoryEntry, ReplayableStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema (+4 more)

### Community 103 - "release-version.test.ts"
Cohesion: 0.12
Nodes (32): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+24 more)

### Community 104 - "order.property.test.ts"
Cohesion: 0.10
Nodes (30): CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce(), checkParallelWaits() (+22 more)

### Community 105 - "page.ts"
Cohesion: 0.08
Nodes (27): RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog(), backUp(), beginCore(), element() (+19 more)

### Community 106 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (23): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+15 more)

### Community 107 - "paused-harness.ts"
Cohesion: 0.14
Nodes (26): Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, keeperModule(), keepingPause() (+18 more)

### Community 108 - "postgres/transaction-history-storage.ts"
Cohesion: 0.10
Nodes (18): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+10 more)

### Community 11 - "loop.test.ts"
Cohesion: 0.03
Nodes (109): EntryRange, GraphInput, LockstepWait, PastFaultCase, RefusalCase, Contexts, Faults, LostCommit (+101 more)

### Community 110 - "LoopPauses"
Cohesion: 0.08
Nodes (17): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 111 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 113 - "items.ts"
Cohesion: 0.11
Nodes (13): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata (+5 more)

### Community 114 - "node-fields-harness.ts"
Cohesion: 0.11
Nodes (23): A168Observation, A168Phase, Expected, GatedConnector, StatusReader, a(), a168Run(), a168Tape() (+15 more)

### Community 115 - "mapping.ts"
Cohesion: 0.13
Nodes (26): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+18 more)

### Community 116 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (21): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+13 more)

### Community 118 - "BlockRef"
Cohesion: 0.11
Nodes (7): BlockRef, InMemorySourceOptions, EventsRunner, Fetching, Recorder, LateRedelivery, systemEventsKey()

### Community 119 - "public-items.test.ts"
Cohesion: 0.09
Nodes (13): TestDatabase, A155Observation, Outcome, TransportProxy, a155Problems(), a155Run(), against(), jsonSafe() (+5 more)

### Community 12 - "tape/index.ts"
Cohesion: 0.04
Nodes (86): Failure, Variant, BoundaryBlockReading, BoundaryReading, CompletenessRange, RecordingProblem, TapeProblem, TransformProblem (+78 more)

### Community 120 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 121 - "documents.ts"
Cohesion: 0.12
Nodes (26): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+18 more)

### Community 122 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule(), hex() (+15 more)

### Community 124 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+14 more)

### Community 125 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 126 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 128 - "read-gate.ts"
Cohesion: 0.15
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 129 - "node-bridge.ts"
Cohesion: 0.13
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 13 - "client.test.ts"
Cohesion: 0.03
Nodes (72): NodeClientOptions, NodeRetry, ConnectSocket, HandSocket, HandSockets, Answer, FakeNode, Handler (+64 more)

### Community 130 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 133 - "relays.ts"
Cohesion: 0.12
Nodes (8): Report, HeldLink, HoldingRelay, ReportRelay, hostPort(), sendable(), typeOf(), RFC-6455

### Community 134 - "src/ledger/identity.ts"
Cohesion: 0.15
Nodes (22): ManifestLine, text(), checkLedgerPackage(), checkLedgerPackages(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+14 more)

### Community 135 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 137 - ".concat"
Cohesion: 0.12
Nodes (12): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+4 more)

### Community 139 - "failures.ts"
Cohesion: 0.12
Nodes (17): ProcessReason, ReasonCode, RetryCode, Unwrapped, HeightFailure, UnexpectedCursor, RetryCondition, StatusFacts (+9 more)

### Community 14 - "NodeClient"
Cohesion: 0.05
Nodes (78): CoreChainBinding, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+70 more)

### Community 140 - "Registry"
Cohesion: 0.21
Nodes (13): Field, Registry, metadataWith(), metadataV14(), midnightMetadata(), some(), text(), vec() (+5 more)

### Community 141 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 142 - "placement.ts"
Cohesion: 0.15
Nodes (20): MetadataVariant, RuntimeMetadataView, BlockParsedOptions, ChainTransaction, ChainEvent, EventPhase, RecordTypes, ScaleValue (+12 more)

### Community 148 - "readiness.test.ts"
Cohesion: 0.14
Nodes (15): ProcessState, gate, Decision, ReadinessCase, ae4(), caseText(), readinessProblems(), holding() (+7 more)

### Community 149 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 15 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (70): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes (+62 more)

### Community 150 - "version-table.ts"
Cohesion: 0.19
Nodes (19): LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable() (+11 more)

### Community 151 - "lockstep-refusals.test.ts"
Cohesion: 0.22
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+10 more)

### Community 152 - "browser-harness.ts"
Cohesion: 0.22
Nodes (18): PageEvent, ProcessName, backupThrough(), byDeadline(), call(), contentsHashOf(), eventsOf(), eventWhen() (+10 more)

### Community 153 - "net.test.ts"
Cohesion: 0.17
Nodes (11): IncomingMessage, Server, createServer(), listen(), pagePort(), unlisten(), useNetwork(), UPGRADE_REQUEST (+3 more)

### Community 157 - "ws.ts"
Cohesion: 0.14
Nodes (8): Emitter, Frame, Listener, PortUpgrade, RawData, WebSocket, WebSocketServer, connect()

### Community 16 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (75): BlockSource, FinalityStallCondition, InMemoryBlockSource, ProcessingEnd, ProcessStatus, ProcessObservation, A43Observation, Outcome (+67 more)

### Community 160 - "source-scan.ts"
Cohesion: 0.20
Nodes (17): ModuleReference, boundaryViolations(), codeFingerprints(), declaredNames(), eachNode(), isInside(), lineOf(), literalText() (+9 more)

### Community 161 - "private/lockstep-wait.test.ts"
Cohesion: 0.20
Nodes (13): ExpectedWait, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf(), rowsIn(), sampleWait() (+5 more)

### Community 167 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 168 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 17 - "transform-checks.ts"
Cohesion: 0.04
Nodes (79): Metadata, Step, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+71 more)

### Community 170 - "BlockItems"
Cohesion: 0.17
Nodes (6): QueuedBlock, BlockItems, EagerItems, EagerLoop, KeptItems, KeptLoop

### Community 171 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 172 - "read-height.property.test.ts"
Cohesion: 0.18
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+2 more)

### Community 173 - "HeldHeight"
Cohesion: 0.16
Nodes (10): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence (+2 more)

### Community 176 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 177 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 178 - "PortSocket"
Cohesion: 0.26
Nodes (4): PortSocket, params(), pair(), Process items and APIs

### Community 18 - "validation.ts"
Cohesion: 0.03
Nodes (94): CoreLedgerVersion, LedgerPackageIdentity, coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+86 more)

### Community 187 - "extrinsics.ts"
Cohesion: 0.22
Nodes (11): BodyExtrinsic, ExtrinsicCall, BlockBody, MetadataPallet, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic() (+3 more)

### Community 188 - "launchChrome"
Cohesion: 0.24
Nodes (8): Cdp, chrome(), chrome(), chromePath(), exitsWithin(), launchChrome(), reject(), resolve()

### Community 189 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 19 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (93): RetainedState, retainedStates, CoreRevision, ledgerVersionOf(), blockBodyOf(), blockParsedOf(), boundLedgerParser(), chainHashOf() (+85 more)

### Community 190 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 192 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 193 - "src/protocol.ts"
Cohesion: 0.21
Nodes (9): ProcessView, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, hexOf(), jsonSafe() (+1 more)

### Community 2 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (167): NodeCallOptions, ProcessCondition, BlockSpec, EventSpec, Scenario, transactionSpec, RecordingClient, eventsRuntime (+159 more)

### Community 20 - "process-build.ts"
Cohesion: 0.03
Nodes (74): BlockItemSource, InMemoryItems, Wait, Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation (+66 more)

### Community 205 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 21 - "column-rules.ts"
Cohesion: 0.03
Nodes (84): ModuleTableOptions, AllowedRule, Because, columnVerdict, DefaultPart, DesignRow, keyOrder, RefusalOptions (+76 more)

### Community 215 - "type-check.ts"
Cohesion: 0.33
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 217 - "ingest-crash.worker.ts"
Cohesion: 0.24
Nodes (9): CrashEvent, CrashJob, report(), tipWriter(), fenceAt(), handle, job, orphanGuard (+1 more)

### Community 218 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 219 - "page-server.ts"
Cohesion: 0.28
Nodes (6): BrowserBuild, pageBench, PageServer, servePage(), ISOLATION_HEADERS, TYPES

### Community 22 - "durability-probe.test.ts"
Cohesion: 0.05
Nodes (74): BenchEnv, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, WriterSession, WriterStart (+66 more)

### Community 225 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 23 - "spawnChild"
Cohesion: 0.03
Nodes (74): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+66 more)

### Community 231 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 232 - "block-context.ts"
Cohesion: 0.29
Nodes (5): LateUse, revisionAt(), reporting(), P, Q

### Community 24 - "UmbraError"
Cohesion: 0.04
Nodes (45): LoadedConfig, LoadOptions, PostgresOptions, JobQueue, Held, PgliteLockUse, PgliteDatabase, BoundedRead (+37 more)

### Community 245 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 246 - "HeightActivity"
Cohesion: 0.38
Nodes (5): HeightActivity, SlowBlockEvent, NeverClears, NeverClears, Watched

### Community 25 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (77): ProcessConfig, Start, Child, Refusal, Start, listenError(), startAdminServer(), databaseOptions() (+69 more)

### Community 26 - "ref_node_path"
Cohesion: 0.07
Nodes (56): RestoreInput, BackupBackend, BackupDatabase, killedRestore, TickerConfig, ledgerBackup, RestoreBuild, cliProject (+48 more)

### Community 267 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 27 - "validate.ts"
Cohesion: 0.05
Nodes (75): AllowedDetail, RevisionSettings, EntryView, RecordedView, SanitizedError, ManifestHistoryRow, HistoryFinding, PlainObject (+67 more)

### Community 28 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.04
Nodes (72): ItemSink, IngestOptions, TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen (+64 more)

### Community 29 - "core-transport.ts"
Cohesion: 0.05
Nodes (54): PublicSide, ResultColumn, Session, TransportLimits, TransportTls, Hello, HelloAck, JsonValue (+46 more)

### Community 3 - "db/errors.ts"
Cohesion: 0.03
Nodes (114): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, CommittedHeight, Database (+106 more)

### Community 30 - "adapter.ts"
Cohesion: 0.04
Nodes (63): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+55 more)

### Community 31 - "node-format.ts"
Cohesion: 0.06
Nodes (53): StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports, NodeStoreSubject, Readable (+45 more)

### Community 32 - "builds.ts"
Cohesion: 0.05
Nodes (60): AdminStarter, A168RunOptions, A176Options, PrivateBackend, SessionSeen, PrivateProcess, PrivateRefusal, PublicCoreOptions (+52 more)

### Community 33 - "cbor.ts"
Cohesion: 0.05
Nodes (71): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+63 more)

### Community 34 - "module-tables.ts"
Cohesion: 0.06
Nodes (50): ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead, RefusalCode, RefusalPlace, DeterminismBackend (+42 more)

### Community 35 - "config-check.ts"
Cohesion: 0.05
Nodes (66): RestoreChain, RestoreSeams, CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, commandTarget (+58 more)

### Community 36 - "loop-stop-harness.ts"
Cohesion: 0.07
Nodes (57): ProcessHandle, A169Observation, LoopStopScenario, SourceOf, ProcessBackend, A167Observation, CheckOf, NodeWatch (+49 more)

### Community 37 - "builder.test.ts"
Cohesion: 0.05
Nodes (35): ManualTimers, ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Frame, RawClient (+27 more)

### Community 38 - "ModuleDeclaration"
Cohesion: 0.06
Nodes (61): ConfigFacts, OpenedConfig, OpenedFacts, PrivateSideFacts, ProcessAdminOptions, DigestRow, ModuleFacts, NodeFacts (+53 more)

### Community 39 - "FinalizedLoop"
Cohesion: 0.06
Nodes (16): FinalizedLoop, LoopObserver, Startup, SkipsLockstep, SkipsUnseen, WaitsInTransaction, WaitingInRead, ItemsAfterWrite (+8 more)

### Community 4 - "ledger/types.ts"
Cohesion: 0.03
Nodes (105): BlockTransaction, LoadLedger, TransactionParser, LedgerStateItem, LedgerName, LedgerReleasePackage, LedgerSource, LedgerSourceSettings (+97 more)

### Community 40 - "backup/backup.ts"
Cohesion: 0.06
Nodes (60): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestMigration, ManifestTool (+52 more)

### Community 41 - "startLedgerWorker"
Cohesion: 0.05
Nodes (38): LedgerHost, LedgerWorkerFailure, NodeDatabase, SentParses, NodeReader, ChangedFile, GenesisFixture, installationCopy (+30 more)

### Community 43 - "NodeBlockSource"
Cohesion: 0.07
Nodes (22): BlockLedgerSource, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, LedgerBinding, NodeSubscription, NodeHeader (+14 more)

### Community 44 - "ledger-sweep.test.ts"
Cohesion: 0.06
Nodes (33): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, ChildReader, NodeBatch, Block (+25 more)

### Community 45 - "range.test.ts"
Cohesion: 0.05
Nodes (31): Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+23 more)

### Community 46 - "range.ts"
Cohesion: 0.05
Nodes (46): Refusal, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command, RecordingError, Final (+38 more)

### Community 47 - "runner/process.ts"
Cohesion: 0.05
Nodes (40): Bound, ChainIdentity, ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, PauseBy, PausedCondition (+32 more)

### Community 48 - "vitest"
Cohesion: 0.04
Nodes (39): CommandResult, Finding, Lockfile, Manifest, RepositoryFile, Upstream, USAGE, printsUsage() (+31 more)

### Community 49 - "opt-out.test.ts"
Cohesion: 0.06
Nodes (49): PlacedRefusal, Refusal, Chain, ChainOptions, DigestRow, shadowTableName(), hex(), moduleM() (+41 more)

### Community 5 - "declaration.ts"
Cohesion: 0.03
Nodes (118): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+110 more)

### Community 50 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (55): TransactionHistoryStorage, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, reason(), Added, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers (+47 more)

### Community 51 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (52): LoopInput, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+44 more)

### Community 52 - "Process"
Cohesion: 0.08
Nodes (11): ProcessAdmin, CoreTransport, PauseHold, Process, SignalTarget, writerLockHeld(), isBlockItemSource(), isBlockEventSource() (+3 more)

### Community 54 - "change-capture.ts"
Cohesion: 0.06
Nodes (45): CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow, ModuleColumn, GuardTableRow (+37 more)

### Community 55 - "ref_node_crypto"
Cohesion: 0.06
Nodes (49): CheckedMigration, CatalogColumn, CatalogOptions, CatalogTable, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules (+41 more)

### Community 56 - "sweep-tapes.ts"
Cohesion: 0.09
Nodes (47): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData (+39 more)

### Community 57 - "intake.test.ts"
Cohesion: 0.08
Nodes (40): PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation, A116Observation (+32 more)

### Community 58 - "cli/command.ts"
Cohesion: 0.07
Nodes (42): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, backupArguments(), backupCommand(), checkArguments() (+34 more)

### Community 59 - "loop.ts"
Cohesion: 0.08
Nodes (40): HeightRange, Callback, EntryBoundary, ParallelPoint, PointArguments, PointSchedule, Invoke, LoopEnd (+32 more)

### Community 6 - ".from"
Cohesion: 0.03
Nodes (150): BlockParsed, Restored, LedgerEvent, TransactionResult, VmLog, BlockHeader, itemsSeen, Json (+142 more)

### Community 60 - "pause-fixtures.ts"
Cohesion: 0.06
Nodes (38): BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable, PausableConfig, PausableOptions, RecorderGlobals (+30 more)

### Community 61 - "process-worker.ts"
Cohesion: 0.06
Nodes (40): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, openedProcess, privateIntake, CommandBuildOptions, messageAdmin() (+32 more)

### Community 62 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 63 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (37): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus (+29 more)

### Community 64 - "binding.test.ts"
Cohesion: 0.08
Nodes (44): PrivateIntakeOptions, startHashDecision, A165Options, a165Run, Attempt, A113Observation, A156Observation, Binding (+36 more)

### Community 65 - "core-settings.ts"
Cohesion: 0.06
Nodes (43): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, Absent, DeepReadonly, PrivateKeys, PrivateOnly (+35 more)

### Community 66 - "backup/restore.ts"
Cohesion: 0.08
Nodes (34): PublicIdentity, Checked, PublicSide, RestoreTarget, BackupText, createReadStream(), isBlockLedgerSource(), hex() (+26 more)

### Community 67 - "zero-timeouts-checks.ts"
Cohesion: 0.08
Nodes (35): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+27 more)

### Community 68 - "process-backends.ts"
Cohesion: 0.07
Nodes (38): AdminRun, Hold, ProbeRecord, newHold(), routeProblems(), timingProblems(), busy(), holder() (+30 more)

### Community 69 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 7 - "adapter-fixtures.ts"
Cohesion: 0.03
Nodes (128): StoredNode, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost (+120 more)

### Community 70 - ".value"
Cohesion: 0.15
Nodes (22): MetadataStorage, MetadataStorageEntry, MetadataType, TypeDef, ScaleError, ScaleReader, ValueReader, field() (+14 more)

### Community 71 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (30): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+22 more)

### Community 79 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 8 - "config/history.ts"
Cohesion: 0.03
Nodes (134): CoreVersion, CoreSettings, versionEntry, HistoryCheck, HistoryCode, HistoryContext, HistoryOptions, HistoryRule (+126 more)

### Community 80 - "transport.test.ts"
Cohesion: 0.09
Nodes (27): Message, TestCertificates, Ended, rawClient, Escape, Refused, mutualTlsOptions(), makeCertificates() (+19 more)

### Community 81 - "messages.ts"
Cohesion: 0.07
Nodes (35): Committed, MessageFault, MessageType, Parsed, Read, bytesOf(), decodeParameter(), decodeValue() (+27 more)

### Community 82 - "shims.test.ts"
Cohesion: 0.08
Nodes (23): Buffer, BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText(), charCodes() (+15 more)

### Community 84 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 85 - "version-checks.ts"
Cohesion: 0.13
Nodes (33): Boundary, CallRecord, CountingNode, Select, UpgradeCase, Walk, Answers, toHex() (+25 more)

### Community 86 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 88 - "PointName"
Cohesion: 0.08
Nodes (26): PointName, CallbackFailure, PointRun, Activity, Misuse, CrashOptions, CallEvent, Recorder (+18 more)

### Community 89 - "browser.test.ts"
Cohesion: 0.08
Nodes (36): Reachable, RestoreAttempt, PageBackup, PageRestore, StatusBody, CdpEvent, Download, PageRequest (+28 more)

### Community 9 - "height-versioned.test.ts"
Cohesion: 0.03
Nodes (108): SchemaModule, SchemaPlan, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue (+100 more)

### Community 96 - "signal-backup.test.ts"
Cohesion: 0.09
Nodes (22): WORKER, SignalEvent, RunningCommand, statsConfig, write(), adminPortIn(), chainNode(), exitWithin() (+14 more)

### Community 97 - "core-chain-events.ts"
Cohesion: 0.09
Nodes (30): BlockEventSource, MetadataField, Primitive, boundEventSource(), chainEventsOf(), coreChainEventsOnFetch(), metadataView(), writeEventRows() (+22 more)

### Community 98 - "core-block-commit.test.ts"
Cohesion: 0.09
Nodes (27): StandInOptions, Commit, blockHeaderOf(), checkParent(), commitBlock(), hex(), sameBytes(), writeBlockRow() (+19 more)

### Community 163 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.13
Nodes (14): 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions, 6. Migration (`002_checkpoint_store.ts`), 7. Error translation — no additions to `src/postgres/errors.ts`, 8. Composing Transaction/Lease (Sprint 2 dependency), 9. Test infrastructure (+6 more)

### Community 83 - "8. Admin endpoints"
Cohesion: 0.07
Nodes (31): recordedHistory(), refused(), 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix, A paused loop on `/status`, A private process and a changed public configuration (+23 more)

### Community 109 - "version"
Cohesion: 0.07
Nodes (29): version(), Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Full-sync soak + load-under-prune (G10), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC) (+21 more)

### Community 143 - "boundary.test.ts"
Cohesion: 0.18
Nodes (17): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+9 more)

### Community 144 - "mapping.test.ts"
Cohesion: 0.12
Nodes (10): mapValue(), parseJsonLossless(), oid(), identity(), RESULT_COLUMNS, RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence (+2 more)

### Community 154 - "T"
Cohesion: 0.12
Nodes (18): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Scenario: Version and timestamp addressing agree, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape (+10 more)

### Community 155 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (16): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+8 more)

### Community 162 - ".slowBlockMs"
Cohesion: 0.15
Nodes (14): 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix, 00043 — slow-block-outside.negative-control.test.ts's 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+6 more)

### Community 175 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 183 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 201 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 206 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 208 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 227 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 228 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 235 - "v9"
Cohesion: 0.38
Nodes (6): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix, Blocks from the node

### Community 236 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 297 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 308 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 42 - "table"
Cohesion: 0.03
Nodes (66): migrations(), table(), fakePackage(), regular(), system(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem (+58 more)

### Community 53 - "history"
Cohesion: 0.05
Nodes (54): history(), n(), 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 5. `history` — pagination, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect (+46 more)

### Community 73 - "code"
Cohesion: 0.05
Nodes (41): code(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log, The five stages (+33 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 92 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 93 - ".put"
Cohesion: 0.06
Nodes (33): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+25 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 132 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 136 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 145 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 146 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 147 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric` (+12 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+9 more)

### Community 159 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 164 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 165 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 166 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 169 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 174 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 179 - "Requirement: BK-1 Backup"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 180 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 184 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 185 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 186 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 191 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 196 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 197 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.17
Nodes (11): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live` (+3 more)

### Community 198 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 5. Full-sync soak + load-under-concurrent-prune (G10), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring (+3 more)

### Community 199 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 200 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 202 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 203 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 204 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 207 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 209 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 210 - "Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored"
Cohesion: 0.20
Nodes (9): ADDED Requirements, MODIFIED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: A stale transaction handle is rejected before any query runs, Scenario: Two puts inside one withTransaction both commit together, Scenario: Two puts inside one withTransaction either both commit or neither does, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API (+1 more)

### Community 211 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 212 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 213 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 214 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 220 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 221 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.22
Nodes (8): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Problem, Suggested fix, Suggested fix

### Community 222 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 223 - "Tasks — v1.0.0 API Surface & Release Contract"
Cohesion: 0.22
Nodes (8): 1. Pre-freeze: retryability field (G3), 2. Pre-freeze: strip / mark-experimental the chain-archive error classes (G3), 3. The freeze: build + package.json (G1), 5. Release contract docs (G2, G4), 6. Freeze the Lean cut-line (G20), 7. Packed-tarball install smoke test (G1), 8. Change close-out, Tasks — v1.0.0 API Surface & Release Contract

### Community 224 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 226 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 229 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 230 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 234 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 237 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 238 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 239 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 240 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 241 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 242 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 243 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 244 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

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

### Community 254 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 255 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 256 - "Tasks — Sprint 2: Transaction/Lease"
Cohesion: 0.33
Nodes (5): 0. `PgTransactionLeaseLayer` — transactions, 1. `PgTransactionLeaseLayer` — leases, 2. Wire `PgTemporalKV`'s `opts.tx`, 3. Sprint close-out, Tasks — Sprint 2: Transaction/Lease

### Community 257 - "Proposal — Sprint 4: Watermarks"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes, Why

### Community 258 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 259 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 260 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 261 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 262 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 263 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 264 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 265 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 266 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 268 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 269 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 270 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 271 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 272 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 273 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 274 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 275 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 276 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 277 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 278 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 279 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 280 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 281 - "00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask"
Cohesion: 0.40
Nodes (4): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix

### Community 282 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 283 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 284 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 285 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 286 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 287 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 288 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 289 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 290 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 291 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 292 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 293 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 294 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 295 - "Tasks — Sprint 1: project setup + TemporalKV"
Cohesion: 0.40
Nodes (4): 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV

### Community 296 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 298 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 299 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 300 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 301 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 302 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 303 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 304 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 305 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 306 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 72 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 76 - "UmbraDB"
Cohesion: 0.05
Nodes (34): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict, Generate your local wallet (+26 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 87 - "package.json"
Cohesion: 0.05
Nodes (39): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+31 more)

### Community 90 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points (+26 more)

## Knowledge Gaps
- **55 isolated node(s):** `RFC-9110`, `RFC-6455`, `RFC-6455`, `RFC-3339`, `RFC-8259` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3614 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `api-server.test.ts`, `migrate.ts`, `fetch-fixtures.ts`, `db/errors.ts`, `ledger/types.ts`, `declaration.ts`, `.from`, `adapter-fixtures.ts`, `config/history.ts`, `height-versioned.test.ts`, `contract-data-checks.ts`, `loop.test.ts`, `tape/index.ts`, `client.test.ts`, `NodeClient`, `core-private-source.test.ts`, `InMemoryBlockSource`, `transform-checks.ts`, `validation.ts`, `core-ledger-state.ts`, `process-build.ts`, `column-rules.ts`, `durability-probe.test.ts`, `spawnChild`, `refused-configuration.test.ts`, `ref_node_path`, `validate.ts`, `ledger/ledger-tasks.test.ts`, `core-transport.ts`, `adapter.ts`, `node-format.ts`, `builds.ts`, `cbor.ts`, `module-tables.ts`, `config-check.ts`, `loop-stop-harness.ts`, `builder.test.ts`, `backup/backup.ts`, `startLedgerWorker`, `ledger-sweep.test.ts`, `range.test.ts`, `runner/process.ts`, `opt-out.test.ts`, `slow-block-harness.ts`, `change-capture.ts`, `sweep-tapes.ts`, `intake.test.ts`, `cli/command.ts`, `pause-fixtures.ts`, `interfaces/transaction-history-storage.ts`, `binding.test.ts`, `core-settings.ts`, `backup/restore.ts`, `zero-timeouts-checks.ts`, `process-backends.ts`, `retirement.test.ts`, `file-mode.test.ts`, `networks.ts`, `transport.test.ts`, `messages.ts`, `shims.test.ts`, `cold-boot-recovery.integration.test.ts`, `version-checks.ts`, `test/postgres/setup.ts`, `package.json`, `PointName`, `browser.test.ts`, `signal-backup.test.ts`, `core-chain-events.ts`, `core-block-commit.test.ts`, `browser/build.ts`, `release-version.test.ts`, `order.property.test.ts`, `config/plain-data.ts`, `postgres/transaction-history-storage.ts`, `LoopPauses`, `code-registry.ts`, `pg-tx-history-adapter.ts`, `public-items.test.ts`, `Lockstep`, `documents.ts`, `crash.test.ts`, `restore-private.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `read-gate.ts`, `node-bridge.ts`, `ws-mutual-tls.test.ts`, `src/ledger/identity.ts`, `cbor.property.test.ts`, `failures.ts`, `block-fetch-decode.test.ts`, `boundary.test.ts`, `mapping.test.ts`, `readiness.test.ts`, `key-handling-checks.ts`, `lockstep-refusals.test.ts`, `net.test.ts`, `private/lockstep-wait.test.ts`, `statementsOf`, `read-height.property.test.ts`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `excluded-not-exported.test.ts`, `twox.ts`, `history.property.test.ts`, `component-table.test.ts`, `block-context.ts`, `worker-threads.test.ts`?**
  _High betweenness centrality (0.245) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `The ledger state`) actually correct?**
  _`UmbraError` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-9110`, `RFC-6455`, `RFC-6455` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api-server.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017413654618473894 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `api-server.test.ts`, `migrate.ts`, `fetch-fixtures.ts`, `db/errors.ts`, `ledger/types.ts`, `declaration.ts`, `src/ledger/identity.ts`, `config/history.ts`, `height-versioned.test.ts`, `contract-data-checks.ts`, `loop.test.ts`, `failures.ts`, `client.test.ts`, `NodeClient`, `core-private-source.test.ts`, `InMemoryBlockSource`, `mapping.test.ts`, `validation.ts`, `core-ledger-state.ts`, `process-build.ts`, `readiness.test.ts`, `durability-probe.test.ts`, `version-table.ts`, `lockstep-refusals.test.ts`, `refused-configuration.test.ts`, `ref_node_path`, `validate.ts`, `ledger/ledger-tasks.test.ts`, `core-transport.ts`, `cbor.ts`, `module-tables.ts`, `config-check.ts`, `ModuleDeclaration`, `statementsOf`, `backup/backup.ts`, `FinalizedLoop`, `table`, `NodeBlockSource`, `checkShape`, `range.ts`, `runner/process.ts`, `web-lock.ts`, `opt-out.test.ts`, `slow-block-harness.ts`, `ref_node_crypto`, `loop.ts`, `pause-fixtures.ts`, `tape/index.ts`, `graph.ts`, `process-worker.ts`, `binding.test.ts`, `core-settings.ts`, `backup/restore.ts`, `zero-timeouts-checks.ts`, `code`, `shims.test.ts`, `8. Admin endpoints`, `version-checks.ts`, `transform-checks.ts`, `core-block-commit.test.ts`, `config/plain-data.ts`, `items.ts`, `mapping.ts`, `BlockRef`, `public-items.test.ts`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.021690741179256453 - nodes in this community are weakly interconnected._