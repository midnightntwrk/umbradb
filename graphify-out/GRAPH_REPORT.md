# Graph Report - UmbraDB

## Corpus Check
- 1048 files · ~1,555,277 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 74 file(s) not represented in the graph (top: .lean 25, .patch 15, (none) 14)

## Summary
- 11037 nodes · 33554 edges · 300 communities (267 shown, 33 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 3481 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `18893d811d0bdb6e` (1048 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionLeaseLayer
- ValidationError
- postgres/transaction-lease.ts
- plain-data.ts
- Lockstep
- crash.test.ts
- change-capture.ts
- browser.test.ts
- Buffer
- BlockRef
- check-required-tests.ts
- src/index.ts
- legacy-excluded.test.ts
- fixtures/configuration.ts
- node-bridge.ts
- process-worker.ts
- page.ts
- ChainArchiveStore
- worker-storage.test.ts
- roles.test.ts
- fetch-fixtures.ts
- code-registry.ts
- tx-replay-decoder.ts
- run.test.ts
- private/lockstep-wait.test.ts
- record-and-replay.test.ts
- recovery.test.ts
- commit-proxy.ts
- .from
- PortSocket
- ws-mutual-tls.test.ts
- statementsOf
- holds
- attempt
- UmbraError
- checkShape
- chrome.ts
- cursor-table.property.test.ts
- web-lock.ts
- configuration-refusal.test.ts
- BlockItems
- loop.test.ts
- ChromeTab
- 3. Proof-blocking findings
- no-indexer-or-wallet-sdk.test.ts
- midnight-env — reproducible PREPROD dev environment
- tape/index.ts
- history.property.test.ts
- height-versioned.property.test.ts
- worker-threads-worker.ts
- Worker
- column-rules.ts
- browser-harness.ts
- page-server.ts
- sha256
- postgres/transaction-history-storage.ts
- ProcessItems
- postgres-image.test.ts
- translatePostgresError
- config/history.ts
- contract-data-checks.ts
- worker-threads.test.ts
- vendored-ledger-files.test.ts
- opt-out.test.ts
- mutation-evidence.d.mts
- no-chain-sync-import-guard.test.ts
- AsyncLocalStorage
- ref_node_crypto
- db/errors.ts
- worker-threads-host.ts
- refused-configuration.test.ts
- ModuleDeclaration
- admin-harness.ts
- https.ts
- NodeFS
- db/migrate.ts
- core-block-parsed.ts
- runMigrations
- validate.ts
- adapter-fixtures.ts
- core-private-source.test.ts
- declaration.ts
- adapter.ts
- ledger/types.ts
- node-format.ts
- config-check.ts
- validate.test.ts
- range.ts
- PgTransactionHistoryStorage
- .value
- ref_node_fs
- cbor.ts
- runner/process.ts
- vitest
- NodeBlockSource
- binding.test.ts
- core-ledger-state.ts
- roles.ts
- node.test.ts
- chain-process.test.ts
- db/backends.ts
- writer-lock-checks.ts
- node/client.test.ts
- mapping.ts
- LedgerPackage
- ledger-sweep.test.ts
- src/db/postgres.ts
- lifecycle.test.ts
- process-admin.ts
- backup/backup.ts
- networks.ts
- core-config.test.ts
- transform-checks.ts
- restore-ledger.ts
- harness.ts
- core-block-commit.test.ts
- zero-timeouts-checks.ts
- configured.ts
- changes.property.test.ts
- worker-host.test.ts
- config-schema.test.ts
- FinalizedLoop
- graph.ts
- order.property.test.ts
- slow-block-harness.ts
- boundary.test.ts
- database-fixtures.ts
- process-context.test.ts
- core-key-registry.test.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- post-block-update-checks.ts
- core-transport.ts
- chain-events-decode.test.ts
- .read
- builds.ts
- pglite.ts
- net.test.ts
- key-checks.ts
- api-server.test.ts
- deterministic-postgresql/index.ts
- cli/command.ts
- browser/build.ts
- transcripts.ts
- lockstep-refusals.test.ts
- version
- Tasks — v1.0.0-infosec-signoff
- .boolean
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- .concat
- ADDED Requirements
- pglite-writer.worker.ts
- mutation-per-adapter.mjs
- twox.ts
- .slowBlockMs
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- pack-install.mjs
- scoped-review-manifest
- path.ts
- orphan-watcher.mjs
- fresh-instance.mjs
- halted
- graph.py
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Design — Postgres+JSONB storage rebuild
- package.json
- ROADMAP.md
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- scripts
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB
- ADDED Requirements
- REMOVED Requirements
- UmbraDB dev environment — master runbook
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- README.md
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB V1.0.0 Implementation Guideline
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Design — v1.0.0-perf-baseline
- Tasks — v1.1.0: Quint model checking
- conformance-gate.mjs
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- UmbraDB — project instructions
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 5. Recommended candidate model
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — v1.0.0-perf-baseline
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
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- bug-report.md
- feature-request.md
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
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
- bugs
- engines
- peerDependencies
- oracle/run.sh
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- main.rs
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 339 edges
2. `UmbraError` - 295 edges
3. `ModuleDeclaration` - 166 edges
4. `FinalizedLoop` - 116 edges
5. `InMemoryBlockSource` - 102 edges
6. `NodeClient` - 99 edges
7. `Database` - 95 edges
8. `PgTransactionLeaseLayer` - 93 edges
9. `runMigrations()` - 90 edges
10. `PgCheckpointStore` - 87 edges

## Surprising Connections (you probably didn't know these)
- `2.1 Historical implementation baseline` --references--> `PgTemporalKV`  [INFERRED]
  Formal/STORAGE_ALGEBRA_LEAN_RESEARCH.md → src/postgres/temporal-kv.ts
- `LL-002 — A7 watermark-participation negative control did not fire; survived fix-round-1, caught by round-2 cold cross-vendor Codex` --references--> `ValidationError`  [INFERRED]
  docs/v1-lessons-learned.md → src/interfaces/storage-errors.ts
- `SC-1 — `kv_history` unbounded growth` --references--> `TemporalKV`  [INFERRED]
  Performance/CEILINGS.md → src/interfaces/temporal-kv.ts
- `Scenario: An unknown top-level field is rejected as a typed envelope error (F7)` --references--> `EnvelopeCorruptError`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/specs/wallet-state-envelope/spec.md → src/interfaces/wallet-state-envelope.ts
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts

## Import Cycles
- None detected.

## Communities (300 total, 33 thin omitted)

### Community 0 - "PgTransactionLeaseLayer"
Cohesion: 0.01
Nodes (245): BenchEnv, JsonValue, PgCheckpointStore, UmbraDBSql, KvRow, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks (+237 more)

### Community 1 - "ValidationError"
Cohesion: 0.02
Nodes (178): ValidationError, AsOf, AssertExact, Key, Namespace, Scope, TemporalKV, Version (+170 more)

### Community 10 - "postgres/transaction-lease.ts"
Cohesion: 0.02
Nodes (134): TransactionHistoryReader, TransactionHistoryWriter, Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionHandle (+126 more)

### Community 100 - "plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 101 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 102 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+15 more)

### Community 103 - "change-capture.ts"
Cohesion: 0.14
Nodes (23): CaptureColumn, CapturedTable, CaptureState, optOut, captureDefinitions(), capturedTables(), captureFunctionName(), captureTables() (+15 more)

### Community 106 - "browser.test.ts"
Cohesion: 0.11
Nodes (26): Reachable, PageEvent, StatusBody, midChainProblems(), networkProblems(), plain(), resumeProblems(), sameHashProblems() (+18 more)

### Community 107 - "Buffer"
Cohesion: 0.10
Nodes (18): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+10 more)

### Community 108 - "BlockRef"
Cohesion: 0.13
Nodes (8): QueuedBlock, BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, failingSource(), flakySource()

### Community 109 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 11 - "src/index.ts"
Cohesion: 0.03
Nodes (120): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreErrorCode, CheckpointSummary, ContentHash, HistoryOptions, PruneResult (+112 more)

### Community 110 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 111 - "fixtures/configuration.ts"
Cohesion: 0.12
Nodes (19): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration() (+11 more)

### Community 113 - "node-bridge.ts"
Cohesion: 0.12
Nodes (19): NodeStore, EngineOptions, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 114 - "process-worker.ts"
Cohesion: 0.14
Nodes (16): Scope, crossedError, FromProcessWorker, ToProcessWorker, adminAnswer(), messageAdmin(), withDevelopmentOptIn(), useNetwork() (+8 more)

### Community 115 - "page.ts"
Cohesion: 0.11
Nodes (18): NetworkBroker, PageState, ProcessView, CallMethod, StartRun, appendLog(), element(), onEvent() (+10 more)

### Community 116 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (11): ChainArchiveStore, 6. Known limitations, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents (+3 more)

### Community 118 - "worker-storage.test.ts"
Cohesion: 0.12
Nodes (16): StoredNode, AdapterWorkerRequest, StagenetBlockJson, StagenetFixtureJson, Nodes, hex(), storeOf(), bytes() (+8 more)

### Community 119 - "roles.test.ts"
Cohesion: 0.12
Nodes (18): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+10 more)

### Community 12 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (127): BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, ArgType, BlockOptions, CallSpec (+119 more)

### Community 120 - "code-registry.ts"
Cohesion: 0.14
Nodes (22): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+14 more)

### Community 125 - "tx-replay-decoder.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+12 more)

### Community 128 - "run.test.ts"
Cohesion: 0.12
Nodes (13): RunningCommand, statsConfig, write(), adminPortIn(), exitWithin(), statsModule(), reachHead(), statsRows() (+5 more)

### Community 129 - "private/lockstep-wait.test.ts"
Cohesion: 0.17
Nodes (14): ExpectedWait, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf(), rowsIn(), sampleWait() (+6 more)

### Community 13 - "record-and-replay.test.ts"
Cohesion: 0.03
Nodes (94): ConnectSocket, ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Frame, FindTapeOptions (+86 more)

### Community 134 - "recovery.test.ts"
Cohesion: 0.19
Nodes (17): ProcessStatus, Q142Observation, A43Observation, Fault, Recorded, RecoveryObservation, StatusRead, committedProblems() (+9 more)

### Community 136 - "commit-proxy.ts"
Cohesion: 0.16
Nodes (8): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), COMMIT_COMPLETE, COMMIT_QUERY

### Community 14 - ".from"
Cohesion: 0.04
Nodes (127): Call, SeenLoad, RestartEvent, RestartJob, retentionSeen, ledgerScenario, LedgerTx, recordedGenesis (+119 more)

### Community 141 - "PortSocket"
Cohesion: 0.21
Nodes (6): PortSocket, pair(), 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 143 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 145 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 146 - "holds"
Cohesion: 0.28
Nodes (9): VersionedValue, StoredVersion, BlockFails, Model, canonicalText(), holds(), readBack(), same() (+1 more)

### Community 148 - "attempt"
Cohesion: 0.15
Nodes (14): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+6 more)

### Community 15 - "UmbraError"
Cohesion: 0.04
Nodes (80): LoadedConfig, LoadOptions, CoreChainBinding, UmbraError, Connection, HeadSubscriber, NodeCallOptions, NodeClient (+72 more)

### Community 152 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 153 - "chrome.ts"
Cohesion: 0.23
Nodes (10): Cdp, CdpEvent, PageRequest, chrome(), chrome(), chromePath(), chromeVersion(), launchChrome() (+2 more)

### Community 154 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 155 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 158 - "configuration-refusal.test.ts"
Cohesion: 0.26
Nodes (9): ConfigFinding, configurationRefused(), findingText(), refusalFindings(), configurationFindings(), configurationRefusalLines(), isConfigurationRefusal(), messageOf() (+1 more)

### Community 159 - "BlockItems"
Cohesion: 0.20
Nodes (5): BlockItems, EagerItems, EagerLoop, KeptItems, KeptLoop

### Community 16 - "loop.test.ts"
Cohesion: 0.03
Nodes (105): ErrorCode, GraphInput, LockstepWait, PastFaultCase, RefusalCase, WaitingInRead, Contexts, Faults (+97 more)

### Community 164 - "3. Proof-blocking findings"
Cohesion: 0.15
Nodes (13): Absent, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces (+5 more)

### Community 165 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 166 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 17 - "tape/index.ts"
Cohesion: 0.04
Nodes (83): Failure, Variant, TapeBuilderOptions, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest (+75 more)

### Community 171 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 172 - "height-versioned.property.test.ts"
Cohesion: 0.15
Nodes (11): Block, Counts, Effect, Key, Op, GAPS, OVERLAPS, KEYS (+3 more)

### Community 174 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 18 - "column-rules.ts"
Cohesion: 0.02
Nodes (103): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+95 more)

### Community 186 - "browser-harness.ts"
Cohesion: 0.33
Nodes (10): ProcessName, call(), eventsOf(), eventWhen(), logOf(), statusOf(), statusWhen(), tabReport() (+2 more)

### Community 188 - "page-server.ts"
Cohesion: 0.27
Nodes (7): BrowserBuild, pageBench, PageServer, servePage(), listenOnRandomPort(), ISOLATION_HEADERS, TYPES

### Community 189 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 19 - "postgres/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (102): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryStatus, JsonEncoded (+94 more)

### Community 199 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 2 - "translatePostgresError"
Cohesion: 0.03
Nodes (149): BlobIntegrityError, BlobMissingError, BlobRole, BlockBundle, BlockMeta, BlockNotFoundError, BlockRecord, BlockStatus (+141 more)

### Community 20 - "config/history.ts"
Cohesion: 0.04
Nodes (105): CoreVersion, CoreSettings, versionEntry, HistoryCode, HistoryContext, HistoryOptions, ProvidesRow, Span (+97 more)

### Community 21 - "contract-data-checks.ts"
Cohesion: 0.04
Nodes (100): ContractLog, CoreContractLogsFastOptions, UnsureLog, FastLogReader, UnsureReason, CoreContractLogsFullOptions, ContractStateRow, CoreContractStatesOptions (+92 more)

### Community 214 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 22 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (76): ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, ConsistentRead, ColumnType (+68 more)

### Community 222 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 223 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.53
Nodes (5): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles()

### Community 23 - "ref_node_crypto"
Cohesion: 0.04
Nodes (74): AnySql, RolloverBucket, RolloverTable, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, Started (+66 more)

### Community 24 - "db/errors.ts"
Cohesion: 0.03
Nodes (60): PostgresOptions, BlockWriteHandle, ReadHandle, ReadOnlyDatabase, ReadOptions, ReadTimeoutSetting, BlockWrites, Point (+52 more)

### Community 243 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 25 - "refused-configuration.test.ts"
Cohesion: 0.04
Nodes (82): BlockItemSource, BlockSource, FinalityStallCondition, ProcessConfig, Answered, gate, Start, Refusal (+74 more)

### Community 26 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (79): OpenedConfig, OpenedFacts, ChainIdentity, ChainSource, ConfiguredGenesis, CoreChainFacts, WaitingListener, Checked (+71 more)

### Community 27 - "admin-harness.ts"
Cohesion: 0.04
Nodes (82): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+74 more)

### Community 28 - "db/migrate.ts"
Cohesion: 0.04
Nodes (79): Transaction, AppliedRow, Runnable, Settling, StartupInput, WriteHandleOptions, GuardTableRow, BlockOpener (+71 more)

### Community 29 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (92): BodyExtrinsic, ExtrinsicCall, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions, BlockTransaction (+84 more)

### Community 3 - "runMigrations"
Cohesion: 0.02
Nodes (181): Rollback, UmbraDBConnectionOptions, RunMigrationsOptions, PgWalletStateEnvelopeStore, assertValidSchemaName(), createClient(), runMigrations(), saveAndAdvance() (+173 more)

### Community 30 - "validate.ts"
Cohesion: 0.04
Nodes (90): AllowedDetail, RevisionSettings, EntryView, RecordedView, SanitizedError, ManifestHistoryRow, HistoryFinding, plainData (+82 more)

### Community 31 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (78): Freeable, Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerAnswer, AdapterWorkerHost (+70 more)

### Community 32 - "core-private-source.test.ts"
Cohesion: 0.04
Nodes (54): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, privateIntake, PrivateIntakeOptions, SourceTransport, PublicDatabase (+46 more)

### Community 33 - "declaration.ts"
Cohesion: 0.04
Nodes (80): SchemaWriteHandle, MigrationPart, ApiRegistry, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemDeclaration (+72 more)

### Community 34 - "adapter.ts"
Cohesion: 0.04
Nodes (70): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+62 more)

### Community 35 - "ledger/types.ts"
Cohesion: 0.05
Nodes (65): LoadLedger, RetainedState, LedgerName, ApplyInput, ApplyOutput, ChainOutcome, LedgerEvent, LedgerTask (+57 more)

### Community 36 - "node-format.ts"
Cohesion: 0.05
Nodes (59): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+51 more)

### Community 37 - "config-check.ts"
Cohesion: 0.04
Nodes (71): CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, RunOptions (+63 more)

### Community 38 - "validate.test.ts"
Cohesion: 0.03
Nodes (74): CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+66 more)

### Community 39 - "range.ts"
Cohesion: 0.04
Nodes (71): NodeClientOptions, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, Arguments, Command (+63 more)

### Community 4 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (150): MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStorage, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, CheckpointStore, capitalize(), abortErrorLike() (+142 more)

### Community 40 - ".value"
Cohesion: 0.06
Nodes (57): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef, ScaleError (+49 more)

### Community 41 - "ref_node_fs"
Cohesion: 0.07
Nodes (54): BackupBackend, BackupDatabase, killedRestore, TickerConfig, cliProject, Pem, ReportedTest, isEmptyDatabase() (+46 more)

### Community 42 - "cbor.ts"
Cohesion: 0.05
Nodes (72): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ChangeKind (+64 more)

### Community 43 - "runner/process.ts"
Cohesion: 0.05
Nodes (40): NodeWait, BackupInput, CoreTransport, StartedModuleApi, ProcessReason, ReasonCode, RetryCode, Unwrapped (+32 more)

### Community 44 - "vitest"
Cohesion: 0.05
Nodes (49): AdminStarter, PrivateBackend, SessionSeen, TestKeyConfig, PrivacyOptions, privacyRun, A155Observation, Outcome (+41 more)

### Community 45 - "NodeBlockSource"
Cohesion: 0.06
Nodes (26): CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeHeader, PreparedBlock, QueueRunner (+18 more)

### Community 46 - "binding.test.ts"
Cohesion: 0.07
Nodes (61): A113Observation, A156Observation, Binding, Created, Outcome, InstanceHashes, OptedOutObservation, Refusal (+53 more)

### Community 47 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (55): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, LedgerStateItem, retainedStates, CoreRevision, GreyPicker, ContractKeys (+47 more)

### Community 48 - "roles.ts"
Cohesion: 0.04
Nodes (52): Difference, OwnPart, PlannedSchema, Provision, QualifiedTable, SchemaItem, SchemaMigration, SchemaModule (+44 more)

### Community 49 - "node.test.ts"
Cohesion: 0.04
Nodes (28): Refusal, Metadata, Step, RawClient, Failure, Variant, TapeClock, quietConnect() (+20 more)

### Community 5 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (129): InMemoryBlockSource, InMemoryItems, Wait, ProcessHandle, ProcessingEnd, Job, WorkerEvent, A77Observation (+121 more)

### Community 50 - "db/backends.ts"
Cohesion: 0.05
Nodes (35): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, ConfiguredDatabaseOptions, CommittedHeight, PgliteOptions, LoadOutcome, OutsideRead (+27 more)

### Community 51 - "writer-lock-checks.ts"
Cohesion: 0.07
Nodes (48): PostgresOptions, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), expectRefusedBeforeAnyWrite() (+40 more)

### Community 52 - "node/client.test.ts"
Cohesion: 0.04
Nodes (36): Answer, FakeNode, Handler, Received, recorded, ManualTimers, bytes(), caught() (+28 more)

### Community 53 - "mapping.ts"
Cohesion: 0.05
Nodes (47): ResultColumn, ResultType, Case, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject() (+39 more)

### Community 54 - "LedgerPackage"
Cohesion: 0.07
Nodes (28): LedgerPackage, LedgerEngine, hexOf(), idOf(), same(), sameBytes(), run(), released() (+20 more)

### Community 55 - "ledger-sweep.test.ts"
Cohesion: 0.06
Nodes (30): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, ChildReader, NodeBatch, Block (+22 more)

### Community 56 - "src/db/postgres.ts"
Cohesion: 0.06
Nodes (36): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, BoundedRead, DriverError, Outcome, Role (+28 more)

### Community 57 - "lifecycle.test.ts"
Cohesion: 0.05
Nodes (46): Child, ParentJob, Kill, Orphaned, SourceFile, LockResult, heldPort(), startChild() (+38 more)

### Community 58 - "process-admin.ts"
Cohesion: 0.07
Nodes (44): ConfigFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, DigestRow, ModuleFacts, PartTable, PrivateInstanceFacts (+36 more)

### Community 59 - "backup/backup.ts"
Cohesion: 0.07
Nodes (51): BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestMigration, ManifestTool, Restored (+43 more)

### Community 6 - "networks.ts"
Cohesion: 0.02
Nodes (146): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, MetadataBlock, MetadataNode (+138 more)

### Community 60 - "core-config.test.ts"
Cohesion: 0.06
Nodes (30): ReadinessFacts, ProcessState, ChainBuildOptions, readinessOf(), statusOf(), chainBackbone(), hex(), module() (+22 more)

### Community 61 - "transform-checks.ts"
Cohesion: 0.09
Nodes (39): TransformError, NotificationRange, turns(), until(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape() (+31 more)

### Community 62 - "restore-ledger.ts"
Cohesion: 0.06
Nodes (45): ProcessCondition, CrashEvent, CrashJob, A84Observation, LoggedRetry, OutageObservation, RetrySample, ingest (+37 more)

### Community 63 - "harness.ts"
Cohesion: 0.10
Nodes (45): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+37 more)

### Community 64 - "core-block-commit.test.ts"
Cohesion: 0.06
Nodes (43): BlockHeaderItem, CoreBlockHeader, StandInOptions, Commit, AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock() (+35 more)

### Community 65 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (36): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+28 more)

### Community 66 - "configured.ts"
Cohesion: 0.08
Nodes (40): RestoreSeams, BackupOutcome, CommandConfig, commandTarget, DatabaseState, ReadDatabaseOptions, RestoreCommandOptions, RestoreCommandSeams (+32 more)

### Community 67 - "changes.property.test.ts"
Cohesion: 0.06
Nodes (48): CanonicalEncodingFailure, CanonicalValue, Op, States, TableName, Abort, CheckResult, Decoded (+40 more)

### Community 68 - "worker-host.test.ts"
Cohesion: 0.07
Nodes (32): AdapterSpec, LedgerRelease, LedgerReleasePackage, LedgerPackageOptions, V9Logs, SlowStep, TestLoaderData, loadLedgerPackage() (+24 more)

### Community 69 - "config-schema.test.ts"
Cohesion: 0.07
Nodes (40): coreEntry, AdminRun, Validator, adminCore(), adminCoreSettings(), dbKeeper(), listenOf(), startWithAdmin() (+32 more)

### Community 7 - "FinalizedLoop"
Cohesion: 0.03
Nodes (81): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+73 more)

### Community 70 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 71 - "order.property.test.ts"
Cohesion: 0.06
Nodes (43): CallEvent, Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, registering(), recording() (+35 more)

### Community 72 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (39): BlockEventSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+31 more)

### Community 73 - "boundary.test.ts"
Cohesion: 0.10
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 75 - "database-fixtures.ts"
Cohesion: 0.05
Nodes (32): CheckTarget, CliBackend, Snapshot, Report, Job, openPgliteOn(), blocksSql(), pgliteCliBackend() (+24 more)

### Community 76 - "process-context.test.ts"
Cohesion: 0.07
Nodes (33): Bound, EntryRange, MisuseListener, PublishRefusal, Seen, RunnerBackend, AllowsOutside, AllowsTwice (+25 more)

### Community 77 - "core-key-registry.test.ts"
Cohesion: 0.07
Nodes (29): AdmittedKey, KeyRegistryOptions, Run, RunKey, TestKey, admittedOf(), bytesOfHex(), coreKeyRegistry() (+21 more)

### Community 78 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 79 - "post-block-update-checks.ts"
Cohesion: 0.09
Nodes (36): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+28 more)

### Community 8 - "core-transport.ts"
Cohesion: 0.03
Nodes (108): PublicSide, Session, TransportLimits, TransportTls, Committed, Hello, HelloAck, JsonValue (+100 more)

### Community 82 - "chain-events-decode.test.ts"
Cohesion: 0.12
Nodes (31): Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, fill(), le() (+23 more)

### Community 83 - ".read"
Cohesion: 0.09
Nodes (37): DigestRow, identityRow(), captured(), captureFunction(), hex(), moduleM(), restart(), shadowRows() (+29 more)

### Community 85 - "builds.ts"
Cohesion: 0.08
Nodes (29): PrivateProcess, PrivateRefusal, PrivateSeen, PublicCoreOptions, A114Observation, A116Observation, Pause, SkipsLockstep (+21 more)

### Community 86 - "pglite.ts"
Cohesion: 0.10
Nodes (19): MultiStatementRunner, Job, JobQueue, Outcome, PgliteDatabase, ServerErrorFields, handleClosed(), statementRefused() (+11 more)

### Community 88 - "net.test.ts"
Cohesion: 0.09
Nodes (19): IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade, RawData (+11 more)

### Community 89 - "key-checks.ts"
Cohesion: 0.08
Nodes (33): TestDatabase, Admission, AdmittedSeen, Blocking, KeyCall, KeyRefusal, KeyRow, Restarts (+25 more)

### Community 9 - "api-server.test.ts"
Cohesion: 0.02
Nodes (112): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions (+104 more)

### Community 93 - "deterministic-postgresql/index.ts"
Cohesion: 0.08
Nodes (22): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql() (+14 more)

### Community 94 - "cli/command.ts"
Cohesion: 0.11
Nodes (27): CommandHandler, CommandIo, MainProcess, CommandResult, backupArguments(), backupCommand(), checkArguments(), configCommand() (+19 more)

### Community 97 - "browser/build.ts"
Cohesion: 0.09
Nodes (23): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+15 more)

### Community 98 - "transcripts.ts"
Cohesion: 0.10
Nodes (23): LoadAdapter, LogSite, Program, V9Raw, inThreadLogReader(), bytesOfHex(), decode(), decoded() (+15 more)

### Community 99 - "lockstep-refusals.test.ts"
Cohesion: 0.12
Nodes (26): LockstepCondition, PublicCore, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn() (+18 more)

### Community 74 - "version"
Cohesion: 0.05
Nodes (43): version(), 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore (+35 more)

### Community 122 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.09
Nodes (22): repository(), 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA (+14 more)

### Community 131 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 138 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 2. Database API, 3. Modules (+7 more)

### Community 142 - ".concat"
Cohesion: 0.12
Nodes (14): payload(), tailOf(), 6. G14 — documented scalability ceilings (SC-1..SC-6), Requirement: scalability ceilings are documented for 1.0.0, Scenario: Each ceiling is stated with its 1.0.0 disposition, Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth (+6 more)

### Community 144 - "ADDED Requirements"
Cohesion: 0.12
Nodes (14): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+6 more)

### Community 149 - "pglite-writer.worker.ts"
Cohesion: 0.18
Nodes (8): cursor(), main(), open(), report(), statementScopedLock(), held, WORKER_SCHEMA, @electric-sql/pglite

### Community 151 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 161 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 177 - ".slowBlockMs"
Cohesion: 0.20
Nodes (10): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 16. Whole system, 5. Runner, Requirement: RN-17 A slow block is reported, never cut off, Scenario: A slow callback (+2 more)

### Community 178 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 183 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 187 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 191 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 207 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 241 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 262 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 84 - "halted"
Cohesion: 0.06
Nodes (40): refused(), run(), halted(), Blocks from the node, Contract states and contract logs, Cursor tables, Data that is not a function of the chain, Height-versioned tables (+32 more)

### Community 87 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 90 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the baseline reflects the batched (shipped) save shape (+18 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 121 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.09
Nodes (18): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`) (+10 more)

### Community 123 - "package.json"
Cohesion: 0.09
Nodes (22): bin, umbradb, description, exports, files, homepage, license, main (+14 more)

### Community 124 - "ROADMAP.md"
Cohesion: 0.09
Nodes (16): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+8 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 127 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.10
Nodes (20): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+12 more)

### Community 130 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 133 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 135 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 137 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 140 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 147 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 150 - "UmbraDB"
Cohesion: 0.13
Nodes (15): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+7 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 157 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 162 - "UmbraDB dev environment — master runbook"
Cohesion: 0.14
Nodes (11): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT) (+3 more)

### Community 163 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 169 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 173 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 176 - "README.md"
Cohesion: 0.30
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 179 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 180 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 181 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 182 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 184 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 185 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.18
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 190 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 192 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 193 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 194 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 196 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 197 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 200 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 201 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 202 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 203 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 204 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.22
Nodes (8): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution, Design — v1.0.0-perf-baseline

### Community 205 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 206 - "conformance-gate.mjs"
Cohesion: 0.22
Nodes (8): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli

### Community 208 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 209 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 210 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 211 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 212 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 215 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 216 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 217 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 218 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 219 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 220 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 221 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 225 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 226 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 227 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 228 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 229 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 230 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 231 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 232 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 233 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 234 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 235 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 236 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 237 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 238 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 239 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 240 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 242 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 244 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 245 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 246 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 247 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 248 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 249 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 250 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 251 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 252 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 253 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 254 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 255 - "00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 256 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.40
Nodes (4): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Suggested fix

### Community 257 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 258 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 259 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 260 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 261 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 263 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 264 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 265 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 266 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 267 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 268 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 269 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 270 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 275 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 276 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 80 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-16 Chain-data reads name their view and height, Requirement: RN-1 The main program is a fixed sequence of points (+27 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 95 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides, Requirement: LG-17 Ledger tasks give modules the native objects (+25 more)

## Knowledge Gaps
- **54 isolated node(s):** `RFC-8259`, `@electric-sql/pglite-tools`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3632 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionLeaseLayer`, `ValidationError`, `translatePostgresError`, `runMigrations`, `chain-process.test.ts`, `networks.ts`, `FinalizedLoop`, `core-transport.ts`, `api-server.test.ts`, `postgres/transaction-lease.ts`, `src/index.ts`, `fetch-fixtures.ts`, `record-and-replay.test.ts`, `.from`, `UmbraError`, `loop.test.ts`, `tape/index.ts`, `column-rules.ts`, `postgres/transaction-history-storage.ts`, `config/history.ts`, `contract-data-checks.ts`, `opt-out.test.ts`, `ref_node_crypto`, `db/errors.ts`, `refused-configuration.test.ts`, `ModuleDeclaration`, `admin-harness.ts`, `db/migrate.ts`, `core-block-parsed.ts`, `validate.ts`, `adapter-fixtures.ts`, `core-private-source.test.ts`, `declaration.ts`, `adapter.ts`, `node-format.ts`, `config-check.ts`, `validate.test.ts`, `.value`, `ref_node_fs`, `cbor.ts`, `runner/process.ts`, `binding.test.ts`, `core-ledger-state.ts`, `roles.ts`, `node.test.ts`, `db/backends.ts`, `writer-lock-checks.ts`, `node/client.test.ts`, `mapping.ts`, `ledger-sweep.test.ts`, `src/db/postgres.ts`, `lifecycle.test.ts`, `backup/backup.ts`, `core-config.test.ts`, `transform-checks.ts`, `restore-ledger.ts`, `core-block-commit.test.ts`, `zero-timeouts-checks.ts`, `changes.property.test.ts`, `worker-host.test.ts`, `config-schema.test.ts`, `order.property.test.ts`, `slow-block-harness.ts`, `boundary.test.ts`, `database-fixtures.ts`, `process-context.test.ts`, `core-key-registry.test.ts`, `post-block-update-checks.ts`, `chain-events-decode.test.ts`, `.read`, `builds.ts`, `net.test.ts`, `key-checks.ts`, `deterministic-postgresql/index.ts`, `cli/command.ts`, `browser/build.ts`, `lockstep-refusals.test.ts`, `plain-data.ts`, `Lockstep`, `crash.test.ts`, `browser.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `node-bridge.ts`, `process-worker.ts`, `worker-storage.test.ts`, `roles.test.ts`, `code-registry.ts`, `package.json`, `run.test.ts`, `private/lockstep-wait.test.ts`, `recovery.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `pglite-writer.worker.ts`, `mutation-per-adapter.mjs`, `cursor-table.property.test.ts`, `web-lock.ts`, `configuration-refusal.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `excluded-not-exported.test.ts`, `history.property.test.ts`, `height-versioned.property.test.ts`, `facade-merge-loader.ts`, `postgres-image.test.ts`, `worker-threads.test.ts`, `vendored-ledger-files.test.ts`, `no-chain-sync-import-guard.test.ts`?**
  _High betweenness centrality (0.293) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8259`, `@electric-sql/pglite-tools`, `@stryker-mutator/core` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionLeaseLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.013138290667750237 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `chain-process.test.ts`, `networks.ts`, `FinalizedLoop`, `core-transport.ts`, `api-server.test.ts`, `fetch-fixtures.ts`, `.from`, `loop.test.ts`, `statementsOf`, `tape/index.ts`, `config/history.ts`, `contract-data-checks.ts`, `opt-out.test.ts`, `pglite-writer.worker.ts`, `checkShape`, `refused-configuration.test.ts`, `ModuleDeclaration`, `web-lock.ts`, `db/migrate.ts`, `db/errors.ts`, `validate.ts`, `configuration-refusal.test.ts`, `core-private-source.test.ts`, `declaration.ts`, `ledger/types.ts`, `config-check.ts`, `validate.test.ts`, `range.ts`, `cbor.ts`, `runner/process.ts`, `vitest`, `NodeBlockSource`, `binding.test.ts`, `core-ledger-state.ts`, `roles.ts`, `db/backends.ts`, `writer-lock-checks.ts`, `node/client.test.ts`, `mapping.ts`, `src/db/postgres.ts`, `process-admin.ts`, `backup/backup.ts`, `sha256`, `restore-ledger.ts`, `transform-checks.ts`, `core-block-commit.test.ts`, `zero-timeouts-checks.ts`, `configured.ts`, `changes.property.test.ts`, `graph.ts`, `slow-block-harness.ts`, `process-context.test.ts`, `core-key-registry.test.ts`, `halted`, `pglite.ts`, `deterministic-postgresql/index.ts`, `lockstep-refusals.test.ts`, `plain-data.ts`, `BlockRef`, `process-worker.ts`, `roles.test.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `ValidationError` be split into smaller, more focused modules?**
  _Cohesion score 0.015196285352469396 - nodes in this community are weakly interconnected._