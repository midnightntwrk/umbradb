# Graph Report - UmbraDB

## Corpus Check
- 969 files · ~1,429,411 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10307 nodes · 29686 edges · 318 communities (285 shown, 33 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2391 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `3dad81f97050749c` (969 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- opt-out.test.ts
- ingest-harness.ts
- config/history.ts
- cbor.property.test.ts
- api-server.test.ts
- vendored-ledger-v9.test.ts
- net.test.ts
- checks.test.ts
- order.property.test.ts
- mapping.ts
- NodeClient
- private/lockstep-wait.test.ts
- browser/build.ts
- Lockstep
- pg-tx-history-adapter.ts
- PrivateTransport
- UmbraError
- migrate.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- pglite-writer.worker.ts
- height-versioned.property.test.ts
- browser.test.ts
- ModuleApi
- Buffer
- declaration.ts
- worker-threads.test.ts
- type-check.ts
- version.negative-control.test.ts
- node-bridge.ts
- ProcessContexts
- PortSocket
- builder.test.ts
- ws-mutual-tls.test.ts
- block-fetch-decode.test.ts
- version-checks.ts
- api-server.ts
- browser-harness.ts
- page.ts
- childRefKeys
- module-api.ts
- adapter-fixtures.ts
- lockstep-refusals.test.ts
- intake.test.ts
- Worker
- version-table.ts
- describeNodeStoreExports
- range.test.ts
- statementsOf
- sweep-fixture.ts
- ReadHandle
- checkShape
- chrome.ts
- web-lock.ts
- run.test.ts
- Database
- exit.worker.ts
- ChromeTab
- history.property.test.ts
- config-hash-checks.ts
- ledger-storage.test.ts
- identity.ts
- resolveWith
- tape/index.ts
- host.ts
- ChainDataAnswer
- sha256
- process-admin.ts
- stats.ts
- Connection
- .name
- .from
- LedgerPackage
- mutation-evidence.d.mts
- AsyncLocalStorage
- pglite.ts
- .subscribe
- vitest
- core-transport.ts
- validate.ts
- EventsRunner
- interfaces/transaction-history-storage.ts
- CliBackend
- spawnChild
- https.ts
- NodeFS
- loop.test.ts
- ref_node_fs
- ledger/types.ts
- backup/restore.ts
- core-ledger-state.ts
- contract-modules.test.ts
- .put
- runner/process.ts
- backup-fixtures.ts
- core-block-parsed.ts
- column-rules.ts
- FinalizedLoop
- contract-data-checks.ts
- code
- builds.ts
- PgTransactionHistoryStorage
- validation.ts
- core-private-source.ts
- entries.ts
- cbor.ts
- admin-harness.ts
- column-rules.test.ts
- boundary.test.ts
- slow-block-harness.ts
- zero-timeouts-checks.ts
- process-worker.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- version
- NodeBlockSource
- chain-process.test.ts
- InMemoryBlockSource
- configured.ts
- private/backends.ts
- restore-ledger.ts
- ledger-sweep.test.ts
- Design — Sprint 1: project setup + TemporalKV
- core-chain-events.ts
- Process
- src/db/postgres.ts
- core-private-source.test.ts
- retirement.test.ts
- config-check.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- cli/command.ts
- .concat
- TransactionHistoryEntry
- core-block-fetch.test.ts
- client.test.ts
- test/postgres/setup.ts
- transport-faults.test.ts
- ref_node_child_process
- networks.ts
- config-check-database.test.ts
- binding.test.ts
- node-format.ts
- failures.ts
- cold-boot-recovery.integration.test.ts
- refused-configuration.test.ts
- core-block-fetch/metadata.ts
- graph.ts
- db/errors.ts
- .value
- held-height.test.ts
- history
- UmbraDB module guide
- UmbraDB third-party component inventory (SBOM)
- migrations
- refused
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- fault
- twox.ts
- Full-Chain Storage
- .slowBlockMs
- scoped-review-manifest
- package-identity.test.ts
- path.ts
- .boolean
- Performance — design
- parseJsonLossless
- fresh-instance.mjs
- crash-worker.ts
- leanProblems
- fn
- ADDED Requirements
- graph.py
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- package.json
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- UmbraDB
- stryker.conf.json
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
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- Design — Sprint 4: Watermarks
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- ADDED Requirements
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Security policy & threat model
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
- Backups
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
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
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
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
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
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Review notes` --references--> `JsonValue`  [INFERRED]
  design/design-interfaces.md → src/private/messages.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (318 total, 33 thin omitted)

### Community 0 - "opt-out.test.ts"
Cohesion: 0.02
Nodes (169): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, ChangeKind, tableChanges, TouchedRow, ModuleColumn (+161 more)

### Community 1 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (181): BlockHeader, ProcessCondition, BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime (+173 more)

### Community 10 - "config/history.ts"
Cohesion: 0.03
Nodes (117): CoreVersion, CoreSettings, HistoryCheck, HistoryCode, HistoryContext, HistoryInput, HistoryOptions, HistoryRow (+109 more)

### Community 100 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 101 - "api-server.test.ts"
Cohesion: 0.09
Nodes (24): AppendsVersion, Client, configHashesOf(), duplicateProblems(), exchange(), helperProblems(), hex(), isConfigHash() (+16 more)

### Community 102 - "vendored-ledger-v9.test.ts"
Cohesion: 0.13
Nodes (30): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, freeAll(), runInFreshInstance(), bigCell() (+22 more)

### Community 103 - "net.test.ts"
Cohesion: 0.11
Nodes (19): NetworkBroker, IncomingMessage, Server, NetworkMessage, Frame, Listener, PortUpgrade, RawData (+11 more)

### Community 104 - "checks.test.ts"
Cohesion: 0.09
Nodes (24): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, integer(), checkFunctionsSql() (+16 more)

### Community 107 - "order.property.test.ts"
Cohesion: 0.10
Nodes (30): CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce(), checkParallelWaits() (+22 more)

### Community 109 - "mapping.ts"
Cohesion: 0.11
Nodes (28): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+20 more)

### Community 11 - "NodeClient"
Cohesion: 0.04
Nodes (85): NodeSourceOptions, CoreChainBinding, HeadSubscriber, NodeClient, NodeSubscription, Pending, State, Subscription (+77 more)

### Community 110 - "private/lockstep-wait.test.ts"
Cohesion: 0.11
Nodes (19): Report, LockstepWait, ExpectedWait, ReportRelay, RetargetProxy, a117Problems(), firstWait(), lockstepCore() (+11 more)

### Community 111 - "browser/build.ts"
Cohesion: 0.09
Nodes (23): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+15 more)

### Community 115 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 117 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+14 more)

### Community 119 - "PrivateTransport"
Cohesion: 0.13
Nodes (9): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), publicConfigChanged(), reject(), resolve() (+1 more)

### Community 12 - "UmbraError"
Cohesion: 0.03
Nodes (96): LoadedConfig, LoadOptions, SchemaWriteHandle, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+88 more)

### Community 120 - "migrate.test.ts"
Cohesion: 0.10
Nodes (21): SchemaItem, MigrationRow, PartOptions, TestPart, identityRow(), captured(), triggerEnabled(), undigested() (+13 more)

### Community 121 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 122 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 123 - "pglite-writer.worker.ts"
Cohesion: 0.12
Nodes (17): Held, PgliteLockUse, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor(), main() (+9 more)

### Community 125 - "height-versioned.property.test.ts"
Cohesion: 0.15
Nodes (18): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+10 more)

### Community 126 - "browser.test.ts"
Cohesion: 0.13
Nodes (24): Reachable, midChainProblems(), networkProblems(), plain(), resumeProblems(), sameHashProblems(), secondTabProblems(), startProblems() (+16 more)

### Community 127 - "ModuleApi"
Cohesion: 0.12
Nodes (14): ModuleApiServer, ModuleApiStart, StartedModuleApi, ModuleApiStart, ApiRoutes, ApiStartup, ModuleApi, ModuleApiOptions (+6 more)

### Community 128 - "Buffer"
Cohesion: 0.10
Nodes (18): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+10 more)

### Community 13 - "declaration.ts"
Cohesion: 0.03
Nodes (78): BlockEventSource, BlockLedgerSource, Prefetch, QueuedBlock, ChainCheckInput, LedgerBinding, OwnPart, ApiRegistry (+70 more)

### Community 131 - "worker-threads.test.ts"
Cohesion: 0.09
Nodes (13): Listener, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread, parentPort (+5 more)

### Community 134 - "type-check.ts"
Cohesion: 0.14
Nodes (15): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), moduleSpecifier() (+7 more)

### Community 136 - "version.negative-control.test.ts"
Cohesion: 0.13
Nodes (12): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, quietConnect(), withNode() (+4 more)

### Community 137 - "node-bridge.ts"
Cohesion: 0.14
Nodes (17): BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 138 - "ProcessContexts"
Cohesion: 0.12
Nodes (5): ProcessContexts, ProcessItems, names(), providesProcessItem(), sealed()

### Community 139 - "PortSocket"
Cohesion: 0.14
Nodes (7): Emitter, PortSocket, WebSocketServer, 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 14 - "builder.test.ts"
Cohesion: 0.03
Nodes (67): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+59 more)

### Community 140 - "ws-mutual-tls.test.ts"
Cohesion: 0.12
Nodes (18): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+10 more)

### Community 141 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 142 - "version-checks.ts"
Cohesion: 0.24
Nodes (20): Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts() (+12 more)

### Community 143 - "api-server.ts"
Cohesion: 0.13
Nodes (21): HeadersArgument, ModuleApiServer, ModuleApiServerOptions, answerHead(), coreHeaders(), coreHeadersResponse(), isCoreHeader(), listenModuleApi() (+13 more)

### Community 144 - "browser-harness.ts"
Cohesion: 0.14
Nodes (17): BrowserBuild, pageBench, PageEvent, ProcessName, StatusBody, PageServer, call(), eventsOf() (+9 more)

### Community 145 - "page.ts"
Cohesion: 0.13
Nodes (18): PageState, ProcessView, CallMethod, FromProcessWorker, StartRun, appendLog(), element(), onEvent() (+10 more)

### Community 146 - "childRefKeys"
Cohesion: 0.17
Nodes (8): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf(), hex(), modelOfFixture()

### Community 147 - "module-api.ts"
Cohesion: 0.13
Nodes (18): ApiErrorCode, ApiResponse, HttpMethod, PathSegment, Registration, SubscriptionHandler, SubscriptionRoute, readBody() (+10 more)

### Community 15 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (93): LedgerReleasePackage, ApplyOutput, DeployTx, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject (+85 more)

### Community 150 - "lockstep-refusals.test.ts"
Cohesion: 0.20
Nodes (19): LockstepCondition, A118Observation, MismatchObservation, WaitSample, hexOf(), a118Problems(), a118Run(), coreOn() (+11 more)

### Community 151 - "intake.test.ts"
Cohesion: 0.19
Nodes (13): PrivateSeen, A114Observation, A116Observation, TestLink, a114Problems(), a114Run(), a116Problems(), follow() (+5 more)

### Community 152 - "Worker"
Cohesion: 0.15
Nodes (4): WebSocket, Worker, 9.2 Browser build (BR), 9. Backups and browser

### Community 155 - "version-table.ts"
Cohesion: 0.21
Nodes (18): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+10 more)

### Community 156 - "describeNodeStoreExports"
Cohesion: 0.17
Nodes (5): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), sortedHex()

### Community 16 - "range.test.ts"
Cohesion: 0.03
Nodes (69): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+61 more)

### Community 166 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 167 - "sweep-fixture.ts"
Cohesion: 0.19
Nodes (14): FixtureNode, node(), rootOf(), stateNodes(), subtree(), utf8(), versionOf(), hex() (+6 more)

### Community 17 - "ReadHandle"
Cohesion: 0.03
Nodes (64): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, PointCallbacks (+56 more)

### Community 172 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 173 - "chrome.ts"
Cohesion: 0.23
Nodes (10): Cdp, CdpEvent, PageRequest, chrome(), chrome(), chromePath(), chromeVersion(), launchChrome() (+2 more)

### Community 174 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 179 - "run.test.ts"
Cohesion: 0.18
Nodes (7): RunningCommand, exitWithin(), headAt(), reachHead(), until(), untilRefused(), PATIENCE_MS

### Community 18 - "Database"
Cohesion: 0.03
Nodes (76): Database, ReadOnlyDatabase, SchemaPlan, ResolvedGraph, MisuseListener, ProcessContextsInput, PublishRefusal, Commit (+68 more)

### Community 185 - "exit.worker.ts"
Cohesion: 0.17
Nodes (10): SignalTarget, terminationSignal(), heldPort(), startChild(), startWorker(), build, [database, mode, address], extra (+2 more)

### Community 187 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 188 - "config-hash-checks.ts"
Cohesion: 0.24
Nodes (12): A162Options, a162Run, HeaderSeen, a162Problems(), asLogin(), formsOf(), headersOf(), originOf() (+4 more)

### Community 19 - "ledger-storage.test.ts"
Cohesion: 0.05
Nodes (94): BlockParsed, itemsSeen, ingest, Call, SeenLoad, retentionSeen, LedgerTx, TableSnapshot (+86 more)

### Community 193 - "identity.ts"
Cohesion: 0.30
Nodes (11): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+3 more)

### Community 194 - "resolveWith"
Cohesion: 0.21
Nodes (11): GraphRule, byHeight(), checkOf(), contains(), factsOf(), frozenRange(), publicItemsOf(), resolveWith() (+3 more)

### Community 2 - "tape/index.ts"
Cohesion: 0.03
Nodes (134): Failure, Variant, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilderOptions, CompletenessRange (+126 more)

### Community 20 - "host.ts"
Cohesion: 0.05
Nodes (61): LoadLedger, TransactionParser, LedgerName, NodeBatch, NodeStore, ParsedTransaction, StoredNode, AppliedState (+53 more)

### Community 200 - "ChainDataAnswer"
Cohesion: 0.25
Nodes (7): ChainDataAnswer, HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, VersionsAnswersOnly, graphQLShaped()

### Community 201 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 21 - "process-admin.ts"
Cohesion: 0.05
Nodes (79): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+71 more)

### Community 210 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 22 - ".from"
Cohesion: 0.04
Nodes (71): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+63 more)

### Community 23 - "LedgerPackage"
Cohesion: 0.05
Nodes (46): LedgerPackage, StateHandle, LedgerEngine, Settled, stagenetReplay, hexOf(), idOf(), same() (+38 more)

### Community 235 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 24 - "pglite.ts"
Cohesion: 0.04
Nodes (43): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, CommittedHeight, ReadOptions (+35 more)

### Community 242 - ".subscribe"
Cohesion: 0.33
Nodes (3): ApiError, params(), Process items and APIs

### Community 25 - "vitest"
Cohesion: 0.04
Nodes (47): Snapshot, Settings, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer (+39 more)

### Community 26 - "core-transport.ts"
Cohesion: 0.04
Nodes (66): Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, MessageFault, Parsed (+58 more)

### Community 27 - "validate.ts"
Cohesion: 0.04
Nodes (71): HistoryFinding, TextPattern, ConfigRule, CursorRule, EntryRef, Finding, Issue, Plain (+63 more)

### Community 28 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.04
Nodes (56): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus (+48 more)

### Community 29 - "spawnChild"
Cohesion: 0.03
Nodes (62): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+54 more)

### Community 3 - "loop.test.ts"
Cohesion: 0.03
Nodes (132): ErrorCode, ProcessContext, EntryRange, GraphInput, DeclarationRule, ApiRequest, Accepts, Rest (+124 more)

### Community 30 - "ref_node_fs"
Cohesion: 0.04
Nodes (48): PlainDataRule, Row, Finding, Lockfile, Manifest, Upstream, Leftover, RemovedName (+40 more)

### Community 31 - "ledger/types.ts"
Cohesion: 0.05
Nodes (54): ApplyInput, LedgerPackageOptions, LedgerTask, StateSummary, V9Logs, LedgerHeight, AdapterWorkerRequest, LoadedState (+46 more)

### Community 32 - "backup/restore.ts"
Cohesion: 0.06
Nodes (71): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+63 more)

### Community 33 - "core-ledger-state.ts"
Cohesion: 0.04
Nodes (63): CoreLedgerStateOptions, LedgerStateItem, RetainedState, retainedStates, CoreRevision, ChainOutcome, LedgerEvent, TransactionResult (+55 more)

### Community 34 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (63): ContractLog, CoreContractLogsFastOptions, UnsureLog, FastLogReader, LoadAdapter, LogSite, Program, UnsureReason (+55 more)

### Community 35 - ".put"
Cohesion: 0.03
Nodes (72): Absent, n(), T(), input(), "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+64 more)

### Community 36 - "runner/process.ts"
Cohesion: 0.05
Nodes (45): Bound, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait, WaitingListener, ConfigHashRow, RetryCode (+37 more)

### Community 37 - "backup-fixtures.ts"
Cohesion: 0.08
Nodes (49): RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, TickerConfig, cliProject, catalogOf(), hashOf() (+41 more)

### Community 38 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (62): BodyExtrinsic, BlockBody, BlockParsedOptions, BlockTransaction, ChainTransaction, ChainEvent, EventPhase, ScaleValue (+54 more)

### Community 39 - "column-rules.ts"
Cohesion: 0.04
Nodes (67): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+59 more)

### Community 4 - "FinalizedLoop"
Cohesion: 0.03
Nodes (76): HeightRange, ResolvedRange, BlockRef, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointRun (+68 more)

### Community 41 - "contract-data-checks.ts"
Cohesion: 0.08
Nodes (58): ContractStateRow, CoreContractStatesOptions, contractScenario, ContractScenarioOptions, LogLine, Program, Ran, ScenarioTx (+50 more)

### Community 43 - "code"
Cohesion: 0.04
Nodes (61): Migration, up(), code(), Added, 2. Forward-only / no-downgrade migration contract, `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21) (+53 more)

### Community 44 - "builds.ts"
Cohesion: 0.07
Nodes (50): PrivateProcess, PrivateRefusal, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, Pause (+42 more)

### Community 45 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (53): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation) (+45 more)

### Community 46 - "validation.ts"
Cohesion: 0.04
Nodes (56): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, PlacedDeclaration, Plain, DeepReadonly, PrivateKeys, PrivateOnly (+48 more)

### Community 47 - "core-private-source.ts"
Cohesion: 0.08
Nodes (39): ChainCheck, PrivateBlockSource, PrivateChecks, PublicConfiguration, PublicDatabase, PublicIdentity, PublicSideOptions, PublicItem (+31 more)

### Community 48 - "entries.ts"
Cohesion: 0.05
Nodes (48): CoreLedgerVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+40 more)

### Community 49 - "cbor.ts"
Cohesion: 0.08
Nodes (46): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+38 more)

### Community 5 - "admin-harness.ts"
Cohesion: 0.03
Nodes (118): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+110 more)

### Community 50 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+24 more)

### Community 52 - "boundary.test.ts"
Cohesion: 0.08
Nodes (44): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+36 more)

### Community 53 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (43): HeightActivity, LoopInput, MisuseReports, StatusBody, PublicCoreOptions, Times, Wait, askedSource (+35 more)

### Community 54 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (35): Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings(), apiRead() (+27 more)

### Community 55 - "process-worker.ts"
Cohesion: 0.07
Nodes (33): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, Scope, crossedError, ToProcessWorker, openedProcess (+25 more)

### Community 56 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.04
Nodes (50): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+42 more)

### Community 57 - "version"
Cohesion: 0.04
Nodes (47): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+39 more)

### Community 58 - "NodeBlockSource"
Cohesion: 0.10
Nodes (9): HeadWait, NodeBlockSource, QueueRunner, NoWindow, Refetches, TrustsNotifications, hexOf(), refOf() (+1 more)

### Community 59 - "chain-process.test.ts"
Cohesion: 0.07
Nodes (36): ProcessHandle, Job, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+28 more)

### Community 6 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (118): ChainDataView, InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Flaky, A43Observation (+110 more)

### Community 60 - "configured.ts"
Cohesion: 0.09
Nodes (37): BackupOutcome, CommandConfig, commandTarget, RestoreCommandOptions, RestoreOutcome, RedactionForms, redactor, SecretForm (+29 more)

### Community 61 - "private/backends.ts"
Cohesion: 0.08
Nodes (34): AdminStarter, PrivateIntakeOptions, PublicWakes, PrivateBackend, SessionSeen, PrivateOptions, InstancesOptions, instancesRun (+26 more)

### Community 62 - "restore-ledger.ts"
Cohesion: 0.07
Nodes (33): MetadataBlock, RuntimeMetadata, RuntimeMetadataEntry, CrashEvent, CrashJob, IngestOptions, OwnStateMetadata, RestartEvent (+25 more)

### Community 64 - "ledger-sweep.test.ts"
Cohesion: 0.09
Nodes (26): GreyPicker, GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, Block, MemoryTables (+18 more)

### Community 66 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.04
Nodes (43): Key, Sql, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap (+35 more)

### Community 67 - "core-chain-events.ts"
Cohesion: 0.09
Nodes (33): Field, Registry, bindCoreChainEvents(), boundEventSource(), chainEventsOf(), coreChainEventsOnFetch(), metadataView(), runtimeMetadataOf() (+25 more)

### Community 68 - "Process"
Cohesion: 0.09
Nodes (11): CoreTransport, StartedModuleApi, Heartbeat, SlowBlockEvent, Process, isBlockEventSource(), startModuleApi(), messageOf() (+3 more)

### Community 7 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (118): BenchEnv, Transaction, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, DriverError (+110 more)

### Community 70 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (13): SourceTransport, height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), identity() (+5 more)

### Community 71 - "retirement.test.ts"
Cohesion: 0.07
Nodes (39): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), manifestProblems(), mutationProblems() (+31 more)

### Community 72 - "config-check.ts"
Cohesion: 0.08
Nodes (36): CheckFinding, StepName, StepReport, StepStatus, DatabaseState, ConfigFinding, LoadOptions, databaseFinding() (+28 more)

### Community 73 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 76 - "cli/command.ts"
Cohesion: 0.08
Nodes (33): privateIntake, CommandBuildOptions, CommandHandler, CommandIo, MainProcess, RunOptions, SignalSource, stopSignal (+25 more)

### Community 77 - ".concat"
Cohesion: 0.06
Nodes (30): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+22 more)

### Community 78 - "TransactionHistoryEntry"
Cohesion: 0.08
Nodes (18): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), CheckpointStore tables (+10 more)

### Community 79 - "core-block-fetch.test.ts"
Cohesion: 0.07
Nodes (24): BlockHeaderItem, BlockItemSource, CoreBlockHeader, CoreBlockItems, StandInOptions, ChainBuildOptions, bindCoreBlockFetch(), coreBlockFetchOnFetch() (+16 more)

### Community 8 - "client.test.ts"
Cohesion: 0.03
Nodes (80): Connection, NodeCallOptions, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers (+72 more)

### Community 80 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (28): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+20 more)

### Community 81 - "transport-faults.test.ts"
Cohesion: 0.09
Nodes (27): Message, MessageType, Ended, rawClient, mutualTlsOptions(), endedWithin(), hello(), tlsProblems() (+19 more)

### Community 83 - "ref_node_child_process"
Cohesion: 0.06
Nodes (32): RepositoryFile, Pem, TestCertificates, canPin(), pinViolations(), repositoryFiles(), end(), removeContainers() (+24 more)

### Community 84 - "networks.ts"
Cohesion: 0.06
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 85 - "config-check-database.test.ts"
Cohesion: 0.08
Nodes (28): CheckStep, ConfigCheckReport, CheckTarget, statsConfig, configCheck(), configText(), coreSettings(), inProcess() (+20 more)

### Community 86 - "binding.test.ts"
Cohesion: 0.08
Nodes (25): TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, TransportProxy, privateCursorHeight() (+17 more)

### Community 87 - "node-format.ts"
Cohesion: 0.12
Nodes (24): Child, Reader, Readable, Reader, TableNode, node(), childKey(), concat() (+16 more)

### Community 88 - "failures.ts"
Cohesion: 0.08
Nodes (35): ReasonCode, Unwrapped, CodeList, CodeTest, RegistryInput, Section11, TestLiterals, isListenFailure() (+27 more)

### Community 89 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 9 - "refused-configuration.test.ts"
Cohesion: 0.03
Nodes (117): coreEntry, versionEntry, ProcessConfig, AdminRun, Answered, gate, Observation, Start (+109 more)

### Community 92 - "core-block-fetch/metadata.ts"
Cohesion: 0.08
Nodes (32): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+24 more)

### Community 93 - "graph.ts"
Cohesion: 0.09
Nodes (36): Edge, GraphFacts, GraphPart, MidChain, Missing, RangeCheck, RangeFacts, Spanned (+28 more)

### Community 95 - "db/errors.ts"
Cohesion: 0.10
Nodes (18): PostgresOptions, ReadTimeoutSetting, ErrorDetails, Case, openPostgres(), outcome(), shape(), TRUNCATE_NOT_ALLOWED_SQLSTATE (+10 more)

### Community 97 - ".value"
Cohesion: 0.20
Nodes (14): TypeDef, ScaleError, ScaleReader, ValueReader, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 98 - "held-height.test.ts"
Cohesion: 0.09
Nodes (28): CommitOutcome, HeldHeight, Faults, LostCommit, Outcomes, Seen, AlwaysLanded, AlwaysLost (+20 more)

### Community 40 - "history"
Cohesion: 0.04
Nodes (60): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+52 more)

### Community 65 - "UmbraDB module guide"
Cohesion: 0.04
Nodes (43): Blocks from the node, Contract states and contract logs, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Private modules, Reading through `db`, Running a module with the `umbradb` command (+35 more)

### Community 105 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (29): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+21 more)

### Community 112 - "migrations"
Cohesion: 0.07
Nodes (28): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Migrations, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks` (+20 more)

### Community 113 - "refused"
Cohesion: 0.07
Nodes (28): refused(), When a callback fails, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked (+20 more)

### Community 153 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (17): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface (+9 more)

### Community 171 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 175 - "fault"
Cohesion: 0.14
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 180 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 190 - "Full-Chain Storage"
Cohesion: 0.17
Nodes (11): store(), 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 3. Semantic decode: `chain-archive-sync/tx-replay-decoder.ts`, 4. How to run it (+3 more)

### Community 198 - ".slowBlockMs"
Cohesion: 0.22
Nodes (9): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 16. Whole system, 5. Runner, Requirement: RN-17 A slow block is reported, never cut off, Scenario: A slow callback (+1 more)

### Community 203 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 209 - "package-identity.test.ts"
Cohesion: 0.20
Nodes (8): text(), copyVendoredLedger(), expectEveryPackageFileChecked(), packageFiles(), CORE_VERSION_SCHEMA, VENDORED_LEDGER_ROOT, VENDORED_LEDGERS, VENDORED_ROOT

### Community 219 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 223 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 225 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 239 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 278 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 288 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 289 - "leanProblems"
Cohesion: 0.50
Nodes (4): leanImports(), leanProblems(), leanTheorems(), retiredLean()

### Community 42 - "fn"
Cohesion: 0.04
Nodes (61): fn(), 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 4. Wiring `PgTemporalKV`'s `opts.tx`, 5. Error translation additions (`src/postgres/errors.ts`) (+53 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.05
Nodes (45): decode(), ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only (+37 more)

### Community 94 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points (+24 more)

### Community 108 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (30): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+22 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+21 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+19 more)

### Community 124 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 130 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 132 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.08
Nodes (18): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Superseded — see `Formal/STORAGE_ALGEBRA.md`, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan (+10 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 135 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 148 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric` (+12 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 157 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.11
Nodes (16): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+8 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+9 more)

### Community 159 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 160 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 161 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (17): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+9 more)

### Community 162 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 164 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 165 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 168 - "Storage Layer Interface Specification"
Cohesion: 0.12
Nodes (15): 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.1 Transaction/Lease layer, 3.2 TemporalKV (+7 more)

### Community 169 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 170 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 177 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 181 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 182 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 183 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 184 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 189 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 191 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 192 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 2. `set`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 195 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 196 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 197 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 199 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 202 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 204 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 205 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 206 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 207 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 208 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 211 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 212 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 213 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 214 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 215 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 216 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 220 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 221 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 222 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 224 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 226 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 227 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 228 - "Backups"
Cohesion: 0.29
Nodes (6): A backup at the core's stop, Backups, Restoring a backup, UmbraDB operator guide, What a backup holds, Writing a backup

### Community 229 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 230 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 231 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 232 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 233 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 234 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 237 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 238 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 240 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 241 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 243 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 244 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 245 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 246 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 247 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 248 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 249 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 250 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 251 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 252 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 253 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 254 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 255 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 256 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 257 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 258 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 259 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 260 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 261 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 262 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 263 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 264 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 265 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 266 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 267 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 268 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 269 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 270 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.40
Nodes (4): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Suggested fix

### Community 271 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 272 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 273 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 274 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 275 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 276 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 279 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 280 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 281 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 282 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 283 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 284 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 285 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 286 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 294 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 295 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 51 - "README.md"
Cohesion: 0.04
Nodes (41): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, [0.9.5] - 2026-07-25 — "Penumbra" (+33 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 90 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

## Knowledge Gaps
- **53 isolated node(s):** `RFC-8949`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `RFC-8949` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3583 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `opt-out.test.ts`, `ingest-harness.ts`, `tape/index.ts`, `loop.test.ts`, `FinalizedLoop`, `admin-harness.ts`, `InMemoryBlockSource`, `src/db/postgres.ts`, `client.test.ts`, `refused-configuration.test.ts`, `config/history.ts`, `NodeClient`, `UmbraError`, `declaration.ts`, `builder.test.ts`, `adapter-fixtures.ts`, `range.test.ts`, `ReadHandle`, `Database`, `ledger-storage.test.ts`, `host.ts`, `process-admin.ts`, `.from`, `core-transport.ts`, `validate.ts`, `interfaces/transaction-history-storage.ts`, `spawnChild`, `ref_node_fs`, `ledger/types.ts`, `backup/restore.ts`, `core-ledger-state.ts`, `contract-modules.test.ts`, `runner/process.ts`, `backup-fixtures.ts`, `core-block-parsed.ts`, `contract-data-checks.ts`, `builds.ts`, `validation.ts`, `entries.ts`, `column-rules.test.ts`, `boundary.test.ts`, `slow-block-harness.ts`, `zero-timeouts-checks.ts`, `process-worker.ts`, `chain-process.test.ts`, `configured.ts`, `private/backends.ts`, `restore-ledger.ts`, `ledger-sweep.test.ts`, `core-chain-events.ts`, `core-private-source.test.ts`, `retirement.test.ts`, `config-check.ts`, `cli/command.ts`, `core-block-fetch.test.ts`, `test/postgres/setup.ts`, `transport-faults.test.ts`, `ref_node_child_process`, `networks.ts`, `config-check-database.test.ts`, `binding.test.ts`, `node-format.ts`, `failures.ts`, `cold-boot-recovery.integration.test.ts`, `db/errors.ts`, `held-height.test.ts`, `cbor.property.test.ts`, `api-server.test.ts`, `vendored-ledger-v9.test.ts`, `net.test.ts`, `checks.test.ts`, `order.property.test.ts`, `private/lockstep-wait.test.ts`, `browser/build.ts`, `Lockstep`, `pg-tx-history-adapter.ts`, `migrate.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `pglite-writer.worker.ts`, `height-versioned.property.test.ts`, `browser.test.ts`, `package.json`, `worker-threads.test.ts`, `type-check.ts`, `version.negative-control.test.ts`, `node-bridge.ts`, `ws-mutual-tls.test.ts`, `block-fetch-decode.test.ts`, `version-checks.ts`, `lockstep-refusals.test.ts`, `intake.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `web-lock.ts`, `excluded-not-exported.test.ts`, `run.test.ts`, `twox.ts`, `history.property.test.ts`, `package-identity.test.ts`?**
  _High betweenness centrality (0.263) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `opt-out.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.022010477831299884 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `opt-out.test.ts`, `ingest-harness.ts`, `tape/index.ts`, `loop.test.ts`, `FinalizedLoop`, `InMemoryBlockSource`, `src/db/postgres.ts`, `client.test.ts`, `refused-configuration.test.ts`, `config/history.ts`, `NodeClient`, `ProcessContexts`, `declaration.ts`, `version-checks.ts`, `version.negative-control.test.ts`, `ReadHandle`, `Database`, `module-api.ts`, `process-admin.ts`, `lockstep-refusals.test.ts`, `LedgerPackage`, `pglite.ts`, `vitest`, `core-transport.ts`, `validate.ts`, `version-table.ts`, `ref_node_fs`, `backup/restore.ts`, `core-ledger-state.ts`, `contract-modules.test.ts`, `runner/process.ts`, `statementsOf`, `checkShape`, `web-lock.ts`, `core-private-source.ts`, `entries.ts`, `cbor.ts`, `validation.ts`, `slow-block-harness.ts`, `zero-timeouts-checks.ts`, `process-worker.ts`, `NodeBlockSource`, `chain-process.test.ts`, `configured.ts`, `private/backends.ts`, `restore-ledger.ts`, `identity.ts`, `resolveWith`, `UmbraDB module guide`, `core-private-source.test.ts`, `config-check.ts`, `sha256`, `core-block-fetch.test.ts`, `transport-faults.test.ts`, `package-identity.test.ts`, `binding.test.ts`, `failures.ts`, `graph.ts`, `db/errors.ts`, `held-height.test.ts`, `api-server.test.ts`, `checks.test.ts`, `mapping.ts`, `PrivateTransport`, `migrate.test.ts`, `pglite-writer.worker.ts`, `ModuleApi`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `ingest-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.027692438982761563 - nodes in this community are weakly interconnected._