# Graph Report - UmbraDB

## Corpus Check
- 1019 files · ~1,487,981 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10843 nodes · 32105 edges · 357 communities (313 shown, 44 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2585 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `5e5de9c55ab12678` (1019 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- UmbraError
- migrate.ts
- ledger/types.ts
- TransactionHistoryEntry
- ledger-sweep.test.ts
- dispatch.ts
- browser/build.ts
- PrivateTransport
- restore-private.ts
- Lockstep
- process-admin.ts
- test/postgres/setup.ts
- pg-tx-history-adapter.ts
- config/plain-data.ts
- Buffer
- height-versioned.property.test.ts
- client.test.ts
- cbor.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- node-bridge.ts
- .send
- code-registry.ts
- Process
- digest.test.ts
- browser.test.ts
- tape/index.ts
- process-worker.ts
- .head
- Design — Sprint 1: project setup + TemporalKV
- compact
- runner/process.ts
- ledger/metadata.ts
- sweep.ts
- cbor.ts
- relays.ts
- browser.negative-control.test.ts
- type-check.ts
- core-transport.ts
- block-fetch-decode.test.ts
- version-table.ts
- sweep-fixture.ts
- catalog.ts
- key-handling-checks.ts
- node-fields-harness.ts
- JsonValue
- transaction-history-storage.property.test.ts
- PointName
- failures.ts
- inMemoryBlock
- browser-harness.ts
- NodeClient
- private/lockstep-wait.test.ts
- commit-proxy.ts
- PortSocket
- encodeCanonical
- builder.test.ts
- cursor-table.property.test.ts
- web-lock.ts
- attempt
- ws-mutual-tls.test.ts
- .from
- public-items.test.ts
- Worker
- identity.ts
- Database
- contract-modules.test.ts
- component-table.test.ts
- worker-threads-worker.ts
- spawnChild
- childRefKeys
- ledger/plain-data.test.ts
- TapeAnswers
- sha256
- ref_node_crypto
- ProcessItems
- stats.ts
- page-server.ts
- node-source.test.ts
- core-block-commit.test.ts
- worker-threads.test.ts
- ledger/ledger-tasks.test.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- declaration
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- range.ts
- worker-threads-host.ts
- core-block-parsed.ts
- ref_node_fs
- api-server.test.ts
- LedgerPackage
- CoreTransport
- SkipsAfterReconnect
- chain-placement.test.ts
- CliBackend
- core-private-source.ts
- https.ts
- NodeFS
- history.test.ts
- SkipsLockstep
- SkipsUnseen
- db/backends.ts
- WaitsInTransaction
- WaitingInRead
- ItemsAfterWrite
- SilentHalt
- FailingAfter
- DropsHeld
- NoRedelivery
- CommitsTheBoundary
- PgTransactionHistoryStorage
- ledger-storage-checks.ts
- backup/backup.ts
- contract-data-checks.ts
- config/history.ts
- declaration.ts
- interfaces/transaction-history-storage.ts
- transform-checks.ts
- backup/restore.ts
- config-check.ts
- NodeBlockSource
- configured.ts
- loop.ts
- FinalizedLoop
- slow-block-harness.ts
- process-backends.ts
- binding.test.ts
- vitest
- .value
- intake.test.ts
- cold-boot-recovery.integration.test.ts
- ledger-tapes.ts
- core-settings.ts
- column-rules.test.ts
- mapping.ts
- InMemoryBlockSource
- column-rules.ts
- graph.ts
- version
- BlockRef
- core-ledger-state.ts
- retirement.test.ts
- changes.property.test.ts
- private/backends.ts
- opt-out.test.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- config/plain-data.test.ts
- net.test.ts
- real-tapes.ts
- boundary.test.ts
- networks.ts
- process-build.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- ref_node_path
- validation.ts
- page.ts
- run.test.ts
- version-checks.ts
- adapter-fixtures.ts
- lockstep-refusals.test.ts
- validate.ts
- validate.test.ts
- order.property.test.ts
- checks.test.ts
- entries.ts
- release-version.test.ts
- fixtures/configuration.ts
- ADDED Requirements
- refused
- Design — Sprint 3: CheckpointStore
- T
- .concat
- .slowBlockMs
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- core-ledger-state.test.ts
- migrations
- ADDED Requirements
- twox.ts
- midnight-env — reproducible PREPROD dev environment
- UmbraDB third-party component inventory (SBOM)
- path.ts
- Performance — design
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- v9
- orphan-watcher.mjs
- firstRegularAtParentTime
- crash-worker.ts
- code
- .put
- fn
- history
- core-private-source.test.ts
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ROADMAP.md
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Full-Chain Storage — Design
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- UmbraDB
- ADDED Requirements
- ADDED Requirements
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- UmbraDB module guide
- Security policy & threat model
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- Design — Sprint 4: Watermarks
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- Design — v1.1.0: Quint model checking
- explore.md
- UmbraDB software supply-chain directory
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- 4. Schema design
- Storage Algebra Lean M3a Watermarks Sprint
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 4: Watermarks
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
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
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
- bug-report.md
- feature-request.md
- Requirement: RN-16 Chain-data reads name their view and height
- GC architecture and query-tracing: research findings
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00038 — The A87 registry cannot name a test written with `it.runIf` or `it.skipIf`
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Requirement: RN-13 SIGTERM stops cleanly
- Acceptance criteria — v1.0.0-perf-baseline
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 327 edges
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
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
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

## Communities (357 total, 44 thin omitted)

### Community 0 - "UmbraError"
Cohesion: 0.02
Nodes (190): BenchEnv, LoadedConfig, LoadOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresOptions, ReadDatabaseOptions (+182 more)

### Community 1 - "migrate.ts"
Cohesion: 0.02
Nodes (153): SchemaWriteHandle, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner, Difference (+145 more)

### Community 10 - "ledger/types.ts"
Cohesion: 0.04
Nodes (91): LoadLedger, LedgerStateItem, RetainedState, LedgerName, AdapterSpec, LedgerRelease, LedgerReleasePackage, ChainOutcome (+83 more)

### Community 100 - "TransactionHistoryEntry"
Cohesion: 0.11
Nodes (10): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), 4. Wiring `PgTemporalKV`'s `opts.tx`, 2. `set` (+2 more)

### Community 101 - "ledger-sweep.test.ts"
Cohesion: 0.13
Nodes (16): GreyPicker, SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelBatch, ModelSnapshot (+8 more)

### Community 102 - "dispatch.ts"
Cohesion: 0.14
Nodes (24): Callback, EntryBoundary, ParallelPoint, PointSchedule, SkipsStartAtRestart, StartsAtEveryRevision, CoreStopsFirst, boundaryModules() (+16 more)

### Community 103 - "browser/build.ts"
Cohesion: 0.09
Nodes (24): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+16 more)

### Community 107 - "PrivateTransport"
Cohesion: 0.12
Nodes (10): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), publicConfigChanged(), reject(), resolve() (+2 more)

### Community 108 - "restore-private.ts"
Cohesion: 0.14
Nodes (24): FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, commandBuild(), privateConfig() (+16 more)

### Community 109 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 11 - "process-admin.ts"
Cohesion: 0.04
Nodes (101): AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminServer, DigestRow, ModuleFacts (+93 more)

### Community 110 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 112 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 115 - "config/plain-data.ts"
Cohesion: 0.11
Nodes (24): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, sameRow(), copyArray(), copyObject() (+16 more)

### Community 116 - "Buffer"
Cohesion: 0.10
Nodes (18): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+10 more)

### Community 119 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 12 - "client.test.ts"
Cohesion: 0.02
Nodes (64): Connection, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets, Answer, FakeNode (+56 more)

### Community 120 - "cbor.property.test.ts"
Cohesion: 0.11
Nodes (26): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, hex(), hex() (+18 more)

### Community 121 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 122 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 123 - "node-bridge.ts"
Cohesion: 0.12
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 124 - ".send"
Cohesion: 0.14
Nodes (10): Cdp, ChromeBrowser, ChromeTab, chrome(), chrome(), chromePath(), exitsWithin(), launchChrome() (+2 more)

### Community 125 - "code-registry.ts"
Cohesion: 0.14
Nodes (23): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+15 more)

### Community 127 - "Process"
Cohesion: 0.18
Nodes (7): Process, isBlockEventSource(), retryOf(), messageOf(), namedStartDb(), nodeClientClosed(), pause()

### Community 128 - "digest.test.ts"
Cohesion: 0.13
Nodes (22): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+14 more)

### Community 129 - "browser.test.ts"
Cohesion: 0.11
Nodes (24): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, PageRequest, continuedProblems() (+16 more)

### Community 13 - "tape/index.ts"
Cohesion: 0.04
Nodes (80): Recorded, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId, Json (+72 more)

### Community 131 - "process-worker.ts"
Cohesion: 0.14
Nodes (18): Scope, crossedError, ToProcessWorker, openedProcess, messageAdmin(), withDevelopmentOptIn(), databaseOptions(), openConfiguredDatabase() (+10 more)

### Community 134 - ".head"
Cohesion: 0.19
Nodes (19): Writer, checkSafeInteger(), compareBytes(), encodeArrayHead(), encodeColumnScalar(), encodeGeneric(), encodeOne(), enter() (+11 more)

### Community 136 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.09
Nodes (22): Key, Sql, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap (+14 more)

### Community 139 - "compact"
Cohesion: 0.24
Nodes (14): Field, Registry, metadataWith(), metadataV14(), midnightMetadata(), some(), text(), vec() (+6 more)

### Community 14 - "runner/process.ts"
Cohesion: 0.03
Nodes (76): ConfigFacts, OpenedConfig, OpenedFacts, BodyExtrinsic, BlockBody, BlockItemSource, ChainCheck, ChainCheckInput (+68 more)

### Community 140 - "ledger/metadata.ts"
Cohesion: 0.14
Nodes (8): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, MetadataSelector, OwnStateMetadata, contentStateOf(), hexOf()

### Community 141 - "sweep.ts"
Cohesion: 0.12
Nodes (13): GreyView, SweepPhase, SweepTables, byBytes(), BYTE_ORDER(), hexOf(), merged(), sweepStep() (+5 more)

### Community 142 - "cbor.ts"
Cohesion: 0.10
Nodes (19): ColumnMode, DateTimeFields, Mode, PathNode, Task, ScalarColumnType, daysInMonth(), daysSince1970() (+11 more)

### Community 143 - "relays.ts"
Cohesion: 0.13
Nodes (8): Report, HeldLink, HoldingRelay, ReportRelay, hostPort(), sendable(), typeOf(), RFC-6455

### Community 144 - "browser.negative-control.test.ts"
Cohesion: 0.13
Nodes (21): Broken, contentsHashOf(), pageUrl(), tamperedBackup(), tapeNode(), at(), continueSession(), headSession() (+13 more)

### Community 145 - "type-check.ts"
Cohesion: 0.15
Nodes (14): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), moduleSpecifier() (+6 more)

### Community 15 - "core-transport.ts"
Cohesion: 0.03
Nodes (94): Session, TransportLimits, TransportTls, Committed, Hello, Message, MessageFault, MessageType (+86 more)

### Community 151 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+9 more)

### Community 152 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 153 - "sweep-fixture.ts"
Cohesion: 0.15
Nodes (19): FixtureNode, FakeState, RefusalData, firstVersion(), hex(), node(), rootOf(), stateNodes() (+11 more)

### Community 156 - "catalog.ts"
Cohesion: 0.11
Nodes (20): CatalogColumn, CatalogOptions, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference, defaultCatalog() (+12 more)

### Community 157 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 16 - "node-fields-harness.ts"
Cohesion: 0.04
Nodes (97): AdminStarter, ProcessCondition, A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader (+89 more)

### Community 162 - "JsonValue"
Cohesion: 0.12
Nodes (17): JsonValue, 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file) (+9 more)

### Community 163 - "transaction-history-storage.property.test.ts"
Cohesion: 0.12
Nodes (14): ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS, goodLeaf, goodNestedObject (+6 more)

### Community 165 - "PointName"
Cohesion: 0.13
Nodes (10): PointName, PointRun, Activity, Misuse, SlowBlockCondition, A43Case, Given, Pipeline (+2 more)

### Community 166 - "failures.ts"
Cohesion: 0.14
Nodes (12): ReasonCode, RetryCode, Unwrapped, RetryCondition, isListenFailure(), reasonOf(), unwrap(), HALT_CODES (+4 more)

### Community 167 - "inMemoryBlock"
Cohesion: 0.16
Nodes (9): TransportProxy, hashAt(), inMemoryBlock(), a77Problems(), a78Problems(), hex(), blockAt(), blockContext() (+1 more)

### Community 169 - "browser-harness.ts"
Cohesion: 0.27
Nodes (16): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+8 more)

### Community 17 - "NodeClient"
Cohesion: 0.06
Nodes (65): NodeSourceOptions, CoreChainBinding, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription (+57 more)

### Community 170 - "private/lockstep-wait.test.ts"
Cohesion: 0.20
Nodes (13): ExpectedWait, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf(), rowsIn(), sampleWait() (+5 more)

### Community 171 - "commit-proxy.ts"
Cohesion: 0.16
Nodes (8): Armed, CommitArm, CommitFault, CommitProxy, Pair, tailOf(), COMMIT_COMPLETE, COMMIT_QUERY

### Community 172 - "PortSocket"
Cohesion: 0.20
Nodes (6): PortSocket, pair(), 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 177 - "encodeCanonical"
Cohesion: 0.15
Nodes (15): CanonicalEncodingFailure, CanonicalValue, encodeCanonical(), run(), refusal(), toHex(), failureReason(), expectFailure() (+7 more)

### Community 18 - "builder.test.ts"
Cohesion: 0.03
Nodes (51): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step, Frame (+43 more)

### Community 184 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 185 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 186 - "attempt"
Cohesion: 0.16
Nodes (13): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+5 more)

### Community 189 - "ws-mutual-tls.test.ts"
Cohesion: 0.19
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 19 - ".from"
Cohesion: 0.03
Nodes (81): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+73 more)

### Community 190 - "public-items.test.ts"
Cohesion: 0.19
Nodes (11): A155Observation, Outcome, a155Problems(), a155Run(), against(), jsonSafe(), outcomeOf(), umbraIn() (+3 more)

### Community 199 - "identity.ts"
Cohesion: 0.27
Nodes (12): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+4 more)

### Community 2 - "Database"
Cohesion: 0.03
Nodes (148): Bound, Database, ReadOnlyDatabase, SchemaPlan, ProcessContext, Revision, EntryRange, ResolvedGraph (+140 more)

### Community 20 - "contract-modules.test.ts"
Cohesion: 0.04
Nodes (85): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+77 more)

### Community 200 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 202 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 21 - "spawnChild"
Cohesion: 0.03
Nodes (79): CdpEvent, Download, ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted (+71 more)

### Community 213 - "childRefKeys"
Cohesion: 0.40
Nodes (3): ChildReader, childRefKeys(), readChildren()

### Community 214 - "ledger/plain-data.test.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 215 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 216 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 22 - "ref_node_crypto"
Cohesion: 0.05
Nodes (59): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+51 more)

### Community 225 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 226 - "page-server.ts"
Cohesion: 0.28
Nodes (6): BrowserBuild, pageBench, PageServer, servePage(), ISOLATION_HEADERS, TYPES

### Community 23 - "node-source.test.ts"
Cohesion: 0.03
Nodes (59): NodeCallOptions, ConnectSocket, RecordingClient, Opened, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault (+51 more)

### Community 24 - "core-block-commit.test.ts"
Cohesion: 0.04
Nodes (60): BlockHeaderItem, CoreBlockHeader, BlockWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+52 more)

### Community 25 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.04
Nodes (70): TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, bindLedgerTasks() (+62 more)

### Community 255 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "declaration"
Cohesion: 0.04
Nodes (73): ErrorCode, GraphInput, DeclarationRule, PointArguments, PastFaultCase, RefusalCase, Case, ShapeCase (+65 more)

### Community 261 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 27 - "range.ts"
Cohesion: 0.04
Nodes (67): BoundaryBlockReading, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command, CompletenessRange (+59 more)

### Community 278 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 28 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (71): MetadataField, MetadataVariant, Primitive, BlockParsed, BlockParsedOptions, TransactionParser, ChainTransaction, ChainEvent (+63 more)

### Community 29 - "ref_node_fs"
Cohesion: 0.08
Nodes (50): BackupBackend, BackupDatabase, killedRestore, TickerConfig, cliProject, withNodeRoot(), catalogOf(), hashOf() (+42 more)

### Community 3 - "api-server.test.ts"
Cohesion: 0.02
Nodes (142): ModuleApiServer, ModuleApiStart, StartedModuleApi, ReadHandle, OwnPart, ApiRegistry, FieldKind, FieldSchema (+134 more)

### Community 30 - "LedgerPackage"
Cohesion: 0.06
Nodes (34): LedgerPackage, LedgerEngine, LedgerTaskFailed, stagenetReplay, hexOf(), idOf(), same(), sameBytes() (+26 more)

### Community 31 - "chain-placement.test.ts"
Cohesion: 0.06
Nodes (71): BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, PalletMetadata, Phase, RuntimeShape (+63 more)

### Community 32 - "core-private-source.ts"
Cohesion: 0.06
Nodes (50): ConfiguredGenesis, PrivateBlockSource, PrivateChecks, PrivateShared, PrivateSourceOptions, SourceTransport, PublicConfiguration, PublicDatabase (+42 more)

### Community 33 - "history.test.ts"
Cohesion: 0.05
Nodes (62): HistoryInput, HistoryRow, HistoryRule, AppliedMigration, Simulation, Start, Holder, Started (+54 more)

### Community 34 - "db/backends.ts"
Cohesion: 0.04
Nodes (45): exclusiveJob, Settings, TestBackend, Case, LoadOutcome, OutsideRead, Traced, Opened (+37 more)

### Community 35 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (61): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), [0.9.5] - 2026-07-25 — "Penumbra", Added, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), 1. Decisive scope (+53 more)

### Community 36 - "ledger-storage-checks.ts"
Cohesion: 0.08
Nodes (62): CoreLedgerStateOptions, FixtureRun, FixtureRunOptions, TableSnapshot, coreLedgerState(), retainedStatesOf(), refusalHalt(), refusalHeight() (+54 more)

### Community 37 - "backup/backup.ts"
Cohesion: 0.07
Nodes (59): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+51 more)

### Community 38 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (59): ContractStateRow, CoreContractStatesOptions, CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+51 more)

### Community 39 - "config/history.ts"
Cohesion: 0.06
Nodes (55): CoreVersion, CoreSettings, HistoryCode, HistoryContext, ProvidesRow, Span, SettingsSchema, UpgradeEntry (+47 more)

### Community 4 - "declaration.ts"
Cohesion: 0.02
Nodes (157): DefinedModule, KnownPointsOnly, TableDeclaration, ProcessConfig, AdminRun, Answered, Answerer, Expected (+149 more)

### Community 40 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.04
Nodes (43): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader (+35 more)

### Community 41 - "transform-checks.ts"
Cohesion: 0.08
Nodes (42): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, turns() (+34 more)

### Community 42 - "backup/restore.ts"
Cohesion: 0.06
Nodes (48): PublicIdentity, Checked, PublicSide, RestoreChain, Restored, RestoreInput, RestoreTarget, MetaCommands (+40 more)

### Community 43 - "config-check.ts"
Cohesion: 0.05
Nodes (48): CheckFinding, CheckStep, StepName, StepReport, StepStatus, DatabaseState, ConfigFinding, CheckTarget (+40 more)

### Community 44 - "NodeBlockSource"
Cohesion: 0.08
Nodes (19): BlockEventSource, CoreBlockItems, RuntimeMetadataView, HeadWait, NodeBlockSource, Prefetch, NodeSubscription, NodeHeader (+11 more)

### Community 45 - "configured.ts"
Cohesion: 0.06
Nodes (48): RestoreSeams, BackupOutcome, CommandHandler, CommandIo, MainProcess, commandTarget, Chain, RestoreCommandOptions (+40 more)

### Community 46 - "loop.ts"
Cohesion: 0.05
Nodes (41): Transaction, HeightRange, LateUse, CallbackFailure, CommitOutcome, HeightActivity, HeightRun, HeldHeight (+33 more)

### Community 47 - "FinalizedLoop"
Cohesion: 0.08
Nodes (11): FinalizedLoop, LoopObserver, Startup, CommitsDespiteLastWrite, AlwaysLost, call(), cursorText(), isRetryable() (+3 more)

### Community 49 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (48): LoopInput, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, Observed (+40 more)

### Community 5 - "process-backends.ts"
Cohesion: 0.03
Nodes (141): BlockHeader, NodeClientOptions, ProcessHandle, SourceShared, ingest, IngestOptions, SourceClass, watched (+133 more)

### Community 50 - "binding.test.ts"
Cohesion: 0.06
Nodes (47): PrivateIntakeOptions, startHashDecision, StartHashes, PublicWakes, A165Options, a165Run, Attempt, TestDatabase (+39 more)

### Community 51 - "vitest"
Cohesion: 0.04
Nodes (35): Lockfile, Manifest, RepositoryFile, Upstream, ReportedTest, gateAdapters(), tallyMutants(), canPin() (+27 more)

### Community 52 - ".value"
Cohesion: 0.11
Nodes (31): ExtrinsicCall, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, TypeDef, ScaleError, ScaleReader (+23 more)

### Community 53 - "intake.test.ts"
Cohesion: 0.08
Nodes (41): PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation, A116Observation (+33 more)

### Community 54 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.08
Nodes (36): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+28 more)

### Community 55 - "ledger-tapes.ts"
Cohesion: 0.05
Nodes (45): ApplyInput, ApplyOutput, StateSummary, LedgerHeight, RawPackageClass, AdapterWorkerAnswer, AdapterWorkerRequest, LoadedState (+37 more)

### Community 56 - "core-settings.ts"
Cohesion: 0.05
Nodes (46): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+38 more)

### Community 58 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (28): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+20 more)

### Community 59 - "mapping.ts"
Cohesion: 0.07
Nodes (38): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+30 more)

### Community 6 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (140): versionEntry, ProcessReason, InMemoryBlockSource, ProcessStatus, Job, WorkerEvent, ChainBuildOptions, A77Observation (+132 more)

### Community 60 - "column-rules.ts"
Cohesion: 0.05
Nodes (51): AllowedRule, DesignRow, PlacedRefusal, RefusalCode, RefusalOptions, RefusedRule, RuleBase, Token (+43 more)

### Community 61 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+40 more)

### Community 62 - "version"
Cohesion: 0.04
Nodes (47): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+39 more)

### Community 64 - "BlockRef"
Cohesion: 0.06
Nodes (15): QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, EventsRunner, Fetching, Recorder, LateRedelivery (+7 more)

### Community 65 - "core-ledger-state.ts"
Cohesion: 0.07
Nodes (40): BlockLedgerSource, LedgerBinding, retainedStates, CoreRevision, applyBlock(), boundLedger(), bytesOf(), contractsOf() (+32 more)

### Community 66 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 67 - "changes.property.test.ts"
Cohesion: 0.06
Nodes (41): Op, States, TableName, captured(), captureFunction(), moduleM(), restart(), sha256() (+33 more)

### Community 68 - "private/backends.ts"
Cohesion: 0.09
Nodes (33): PrivateBackend, SessionSeen, PrivateProcess, A162Options, a162Run, HeaderSeen, InstancesOptions, instancesRun (+25 more)

### Community 7 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (107): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure (+99 more)

### Community 71 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 73 - "config/plain-data.test.ts"
Cohesion: 0.06
Nodes (27): LoadOptions, Row, Finding, invalid(), isFile(), loadConfig(), modulesOf(), plainDataWith() (+19 more)

### Community 74 - "net.test.ts"
Cohesion: 0.08
Nodes (20): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade (+12 more)

### Community 75 - "real-tapes.ts"
Cohesion: 0.09
Nodes (32): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+24 more)

### Community 78 - "boundary.test.ts"
Cohesion: 0.12
Nodes (34): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+26 more)

### Community 79 - "networks.ts"
Cohesion: 0.06
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 8 - "process-build.ts"
Cohesion: 0.03
Nodes (100): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminStartOptions, AdminAnswer, AdminEndpoint (+92 more)

### Community 80 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.05
Nodes (40): Absent, 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion (+32 more)

### Community 81 - "ref_node_path"
Cohesion: 0.08
Nodes (32): MarkdownLink, TextFile, changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems(), markdownLinks(), notAPath() (+24 more)

### Community 83 - "validation.ts"
Cohesion: 0.10
Nodes (29): PlacedDeclaration, Plain, Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject() (+21 more)

### Community 87 - "page.ts"
Cohesion: 0.07
Nodes (31): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, StartRun (+23 more)

### Community 88 - "run.test.ts"
Cohesion: 0.09
Nodes (26): ConfigCheckReport, RunningCommand, statsConfig, inProcess(), check(), check(), write(), adminPortIn() (+18 more)

### Community 89 - "version-checks.ts"
Cohesion: 0.14
Nodes (30): Boundary, CallRecord, CountingNode, Select, UpgradeCase, Walk, Answers, toHex() (+22 more)

### Community 9 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (101): StoredNode, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost (+93 more)

### Community 91 - "lockstep-refusals.test.ts"
Cohesion: 0.11
Nodes (31): LockstepCondition, Pause, Q142Observation, A118Observation, MismatchObservation, WaitSample, directPublic(), launchPrivate() (+23 more)

### Community 92 - "validate.ts"
Cohesion: 0.11
Nodes (35): HistoryFinding, CursorRule, Finding, Issue, Plain, coreSettingsSchema(), pathOf(), closest() (+27 more)

### Community 94 - "validate.test.ts"
Cohesion: 0.08
Nodes (28): ConfigRule, EntryRef, CursorRow, Expected, declarations(), input(), refusal(), rowInput() (+20 more)

### Community 95 - "order.property.test.ts"
Cohesion: 0.09
Nodes (31): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce() (+23 more)

### Community 96 - "checks.test.ts"
Cohesion: 0.08
Nodes (25): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, integer(), checkFunctionsSql() (+17 more)

### Community 97 - "entries.ts"
Cohesion: 0.07
Nodes (30): CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+22 more)

### Community 98 - "release-version.test.ts"
Cohesion: 0.11
Nodes (33): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+25 more)

### Community 99 - "fixtures/configuration.ts"
Cohesion: 0.10
Nodes (21): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, core(), databaseOf(), hexOf(), defineConfig() (+13 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): Private modules, ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database (+21 more)

### Community 148 - "refused"
Cohesion: 0.12
Nodes (18): refused(), cursorRead(), following(), When a callback fails, A private process and a changed public configuration, The database, The node on `/status`, UmbraDB operator guide (+10 more)

### Community 164 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.12
Nodes (15): 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions, 5. `history` — pagination, 6. Migration (`002_checkpoint_store.ts`), 7. Error translation — no additions to `src/postgres/errors.ts`, 8. Composing Transaction/Lease (Sprint 2 dependency) (+7 more)

### Community 111 - "T"
Cohesion: 0.08
Nodes (26): n(), T(), input(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside (+18 more)

### Community 132 - ".concat"
Cohesion: 0.08
Nodes (23): probe(), holds(), 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline (+15 more)

### Community 158 - ".slowBlockMs"
Cohesion: 0.13
Nodes (16): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+8 more)

### Community 159 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (17): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+9 more)

### Community 161 - "core-ledger-state.test.ts"
Cohesion: 0.12
Nodes (12): bindLedgerParser(), boundLedgerParser(), bindCoreLedgerState(), itemsOf(), writeBlock(), applied(), bound(), query() (+4 more)

### Community 178 - "migrations"
Cohesion: 0.12
Nodes (15): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Migrations, Requirement: DB-9 Bootstrap, migrations and setup, Scenario: A changed migration refuses startup, Scenario: The second of two migrations fails, 0. Specification freeze, 1. Vendor/pin manifest (+7 more)

### Community 179 - "ADDED Requirements"
Cohesion: 0.12
Nodes (14): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+6 more)

### Community 192 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 203 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 209 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 234 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 240 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 245 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 246 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.29
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 263 - "v9"
Cohesion: 0.47
Nodes (5): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 275 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 304 - "firstRegularAtParentTime"
Cohesion: 0.60
Nodes (3): parentTimeOf(), firstRegularAtParentTime(), parentTimestampMs()

### Community 319 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 48 - "code"
Cohesion: 0.04
Nodes (55): up(), code(), name, 8. Migration, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.4 — Public surface, contracts, and DX (G1–G4, G20) (+47 more)

### Community 57 - ".put"
Cohesion: 0.04
Nodes (48): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+40 more)

### Community 63 - "fn"
Cohesion: 0.05
Nodes (48): fn(), 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure (+40 more)

### Community 69 - "history"
Cohesion: 0.06
Nodes (42): history(), 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate (+34 more)

### Community 85 - "core-private-source.test.ts"
Cohesion: 0.06
Nodes (11): height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PUBLIC_POLL_MS, PRIVATE_CORE_DIGEST (+3 more)

### Community 86 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points, Requirement: RN-2 The runner does only its five duties (+22 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+23 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+20 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+19 more)

### Community 126 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 130 - "ROADMAP.md"
Cohesion: 0.08
Nodes (18): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+10 more)

### Community 133 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 135 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 138 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+15 more)

### Community 146 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.09
Nodes (17): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+9 more)

### Community 147 - "Full-Chain Storage — Design"
Cohesion: 0.09
Nodes (21): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+13 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 150 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 154 - "UmbraDB"
Cohesion: 0.10
Nodes (18): [0.10.0] - 2026-10-27, Added, Breaking changes, Changelog, [Unreleased], Contents, Durability and crash semantics, Errors and retryability (+10 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 168 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 173 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 174 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 175 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 176 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 180 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 181 - "UmbraDB module guide"
Cohesion: 0.13
Nodes (14): Blocks from the node, Contract states and contract logs, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Reading through `db`, Running a module with the `umbradb` command, Start and stop heights (+6 more)

### Community 182 - "Security policy & threat model"
Cohesion: 0.13
Nodes (13): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+5 more)

### Community 183 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 188 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 194 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 195 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 196 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 198 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 201 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 204 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.17
Nodes (12): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4.2 — The 1.0.0 tag gate, §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did (+4 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 206 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 207 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 208 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 210 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 211 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 212 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.18
Nodes (10): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds, 8. CI (+2 more)

### Community 217 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 218 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 219 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 220 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 221 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 222 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 223 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 227 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

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

### Community 232 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 233 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 235 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 236 - "4. Schema design"
Cohesion: 0.25
Nodes (8): 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design, v4 rewrite — the rollover runbook, rebuilt from four reproduced failures, run end-to-end for real

### Community 237 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 238 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 239 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 243 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 244 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 247 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 248 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 249 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 250 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 251 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 252 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 253 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 254 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 257 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 258 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 259 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 260 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 262 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 264 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 265 - "Proposal — Sprint 4: Watermarks"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes, Why

### Community 266 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 267 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 268 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 269 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 270 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 271 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 272 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 273 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 274 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 276 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 277 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 279 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 280 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 281 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 282 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 283 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 284 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 285 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 286 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 287 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 288 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 289 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 290 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 291 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 292 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 293 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 294 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 295 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 296 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 297 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 298 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 299 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 300 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 301 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 302 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 303 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 307 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 308 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 309 - "00038 — The A87 registry cannot name a test written with `it.runIf` or `it.skipIf`"
Cohesion: 0.50
Nodes (3): 00038 — The A87 registry cannot name a test written with `it.runIf` or `it.skipIf`, Evidence, Suggested fix

### Community 310 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 311 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 312 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 313 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 314 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.50
Nodes (4): Requirement: RN-13 SIGTERM stops cleanly, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable, Scenario: SIGTERM while the loop waits on an unreachable node

### Community 315 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 316 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 317 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 324 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 325 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 70 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+32 more)

### Community 82 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8949`, `RFC-8949` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3714 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UmbraError`, `migrate.ts`, `Database`, `api-server.test.ts`, `declaration.ts`, `process-backends.ts`, `InMemoryBlockSource`, `opt-out.test.ts`, `process-build.ts`, `adapter-fixtures.ts`, `ledger/types.ts`, `process-admin.ts`, `client.test.ts`, `tape/index.ts`, `runner/process.ts`, `core-transport.ts`, `node-fields-harness.ts`, `NodeClient`, `builder.test.ts`, `.from`, `contract-modules.test.ts`, `spawnChild`, `ref_node_crypto`, `node-source.test.ts`, `core-block-commit.test.ts`, `ledger/ledger-tasks.test.ts`, `declaration`, `core-block-parsed.ts`, `ref_node_fs`, `chain-placement.test.ts`, `history.test.ts`, `db/backends.ts`, `ledger-storage-checks.ts`, `backup/backup.ts`, `contract-data-checks.ts`, `config/history.ts`, `interfaces/transaction-history-storage.ts`, `transform-checks.ts`, `backup/restore.ts`, `config-check.ts`, `configured.ts`, `loop.ts`, `slow-block-harness.ts`, `binding.test.ts`, `intake.test.ts`, `cold-boot-recovery.integration.test.ts`, `ledger-tapes.ts`, `core-settings.ts`, `column-rules.test.ts`, `mapping.ts`, `core-ledger-state.ts`, `retirement.test.ts`, `changes.property.test.ts`, `private/backends.ts`, `config/plain-data.test.ts`, `net.test.ts`, `real-tapes.ts`, `boundary.test.ts`, `networks.ts`, `ref_node_path`, `core-private-source.test.ts`, `run.test.ts`, `version-checks.ts`, `lockstep-refusals.test.ts`, `validate.test.ts`, `order.property.test.ts`, `checks.test.ts`, `entries.ts`, `release-version.test.ts`, `fixtures/configuration.ts`, `ledger-sweep.test.ts`, `browser/build.ts`, `restore-private.ts`, `Lockstep`, `test/postgres/setup.ts`, `pg-tx-history-adapter.ts`, `config/plain-data.ts`, `height-versioned.property.test.ts`, `cbor.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `node-bridge.ts`, `code-registry.ts`, `package.json`, `digest.test.ts`, `browser.test.ts`, `browser.negative-control.test.ts`, `type-check.ts`, `block-fetch-decode.test.ts`, `key-handling-checks.ts`, `core-ledger-state.test.ts`, `transaction-history-storage.property.test.ts`, `failures.ts`, `inMemoryBlock`, `private/lockstep-wait.test.ts`, `encodeCanonical`, `cursor-table.property.test.ts`, `web-lock.ts`, `ws-mutual-tls.test.ts`, `public-items.test.ts`, `excluded-not-exported.test.ts`, `twox.ts`, `component-table.test.ts`, `ledger/plain-data.test.ts`, `worker-threads.test.ts`, `firstRegularAtParentTime`?**
  _High betweenness centrality (0.223) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.017422050787528127 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `migrate.ts`, `Database`, `api-server.test.ts`, `declaration.ts`, `process-backends.ts`, `InMemoryBlockSource`, `opt-out.test.ts`, `ledger/types.ts`, `process-admin.ts`, `ledger/metadata.ts`, `client.test.ts`, `runner/process.ts`, `core-transport.ts`, `cbor.ts`, `NodeClient`, `node-fields-harness.ts`, `tape/index.ts`, `contract-modules.test.ts`, `node-source.test.ts`, `core-block-commit.test.ts`, `version-table.ts`, `declaration`, `ledger/ledger-tasks.test.ts`, `range.ts`, `ref_node_fs`, `core-private-source.ts`, `core-ledger-state.test.ts`, `history.test.ts`, `db/backends.ts`, `backup/backup.ts`, `failures.ts`, `config/history.ts`, `transform-checks.ts`, `backup/restore.ts`, `config-check.ts`, `NodeBlockSource`, `configured.ts`, `loop.ts`, `FinalizedLoop`, `slow-block-harness.ts`, `binding.test.ts`, `UmbraDB module guide`, `core-settings.ts`, `web-lock.ts`, `mapping.ts`, `graph.ts`, `public-items.test.ts`, `BlockRef`, `core-ledger-state.ts`, `changes.property.test.ts`, `identity.ts`, `config/plain-data.test.ts`, `validation.ts`, `core-private-source.test.ts`, `sha256`, `version-checks.ts`, `lockstep-refusals.test.ts`, `validate.ts`, `validate.test.ts`, `checks.test.ts`, `entries.ts`, `fixtures/configuration.ts`, `PrivateTransport`, `config/plain-data.ts`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020197449609214314 - nodes in this community are weakly interconnected._