# Graph Report - UmbraDB

## Corpus Check
- 1001 files · ~1,470,274 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10597 nodes · 30973 edges · 332 communities (303 shown, 29 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2477 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `3f531126155e4017` (1001 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- chain-process.test.ts
- client.test.ts
- BlockRef
- digest.test.ts
- browser.test.ts
- core-block-commit.test.ts
- ledger-state.test.ts
- Process
- version-checks.ts
- chain-events-decode.test.ts
- db/errors.ts
- browser/build.ts
- code-registry.ts
- items.ts
- lockstep-refusals.test.ts
- test/postgres/setup.ts
- interfaces/transaction-history-storage.ts
- adapter-fixtures.ts
- private/lockstep-wait.test.ts
- placement.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- column-rules.ts
- cbor.property.test.ts
- config-hash-checks.ts
- Design — Sprint 1: project setup + TemporalKV
- referenceMergeEntries
- core-block-fetch/metadata.ts
- durability-probe.test.ts
- node-bridge.ts
- shims.test.ts
- pglite-writer.worker.ts
- version-table.ts
- .value
- block-fetch-decode.test.ts
- key-handling-checks.ts
- core-config.test.ts
- transport-intake.test.ts
- intake.test.ts
- package-identity.test.ts
- HeightRun
- fixtures/configuration.ts
- declaration.ts
- checkShape
- validation.test.ts
- .from
- fetch-fixtures.ts
- ws-mutual-tls.test.ts
- ChromeTab
- pglite-timeouts.test.ts
- browser-harness.ts
- chrome.ts
- ref_node_fs
- read-height.property.test.ts
- no-indexer-or-wallet-sdk.test.ts
- web-lock.ts
- Worker
- history.property.test.ts
- height-versioned.test.ts
- worker-threads.test.ts
- midnight-env — reproducible PREPROD dev environment
- worker-threads-worker.ts
- buffer.ts
- admin-harness.ts
- chain-placement.test.ts
- NodeClient
- page-server.ts
- module-api.test.ts
- stats.ts
- HeldHeight
- deterministic-postgresql/index.ts
- ledger/plain-data.ts
- cli/command.ts
- mutation-evidence.d.mts
- runner/process.ts
- NetworkBroker
- AsyncLocalStorage
- api-server.test.ts
- host.ts
- change-capture.ts
- adapter.ts
- validate.ts
- Database
- https.ts
- NodeFS
- binding.test.ts
- node-format.ts
- builder.test.ts
- contract-modules.test.ts
- LedgerPackage
- core-ledger-state.ts
- roles.ts
- FinalizedLoop
- PgTransactionHistoryStorage
- process-admin.ts
- module-tables.ts
- range.ts
- order.property.test.ts
- cbor.ts
- contract-data-checks.ts
- core-block-parsed.ts
- slow-block-harness.ts
- transform-checks.ts
- vitest
- PgliteDatabase
- core-chain-events.ts
- mapping.ts
- process-backends.ts
- boundary.test.ts
- net.test.ts
- version
- transport-faults.test.ts
- private-transport.ts
- UmbraError
- T
- graph.ts
- core-transport.ts
- config/plain-data.test.ts
- ledger/types.ts
- ledger-tasks-checks.ts
- retirement.test.ts
- ledger-storage.test.ts
- tape/index.ts
- core-settings.ts
- ledger-sweep.test.ts
- config-check.ts
- column-refusals.test.ts
- .concat
- private/backends.ts
- .#open
- real-tapes.ts
- loop.test.ts
- pg-tx-history-adapter.ts
- ref_node_crypto
- ingest-harness.ts
- ledger/load.ts
- networks.ts
- process-context.test.ts
- builds.ts
- messages.ts
- transaction-history-storage.property.test.ts
- PointName
- process-worker.ts
- loop.ts
- page.ts
- postgres/transaction-history-storage.ts
- .position
- Problem
- cold-boot-recovery.integration.test.ts
- ledger/ledger-tasks.test.ts
- code
- ADDED Requirements
- refused
- migrations
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- .slowBlockMs
- ADDED Requirements
- mutation-per-adapter.mjs
- twox.ts
- Full-Chain Storage
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- attempt
- path.ts
- .boolean
- orphan-watcher.mjs
- crash-worker.ts
- leanProblems
- history
- fn
- .put
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- graph.py
- table
- ADDED Requirements
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ROADMAP.md
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
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
- Design — v1.0.0 API Surface & Release Contract
- README.md
- ADDED Requirements
- REMOVED Requirements
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- UmbraDB
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — Sprint 4: Watermarks
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
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
- Acceptance — v1.0.0 API Surface & Release Contract
- Tasks — v1.0.0-infosec-signoff
- scoped-review-manifest
- Contributing
- Checkpoint-store composition contract — cursor ordering and replay
- UmbraDB 1.0.0 Release Contracts
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
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
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
- The five primitives
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
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- bug-report.md
- feature-request.md
- GC architecture and query-tracing: research findings
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Requirement: PP-2 A private database is bound to one public database
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- Requirement: RN-5 The block context carries one height's items
- repository
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
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 312 edges
2. `UmbraError` - 296 edges
3. `ModuleDeclaration` - 168 edges
4. `FinalizedLoop` - 118 edges
5. `NodeClient` - 102 edges
6. `InMemoryBlockSource` - 101 edges
7. `Database` - 97 edges
8. `BlockRef` - 93 edges
9. `ReadHandle` - 85 edges
10. `5. Runner` - 75 edges

## Surprising Connections (you probably didn't know these)
- `1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?` --references--> `Buffer`  [INFERRED]
  docs/research/a1-unbounded-bytea-insert.md → browser/src/shims/buffer.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (332 total, 29 thin omitted)

### Community 0 - "chain-process.test.ts"
Cohesion: 0.02
Nodes (162): BlockItemSource, ProcessReason, InMemoryBlockSource, InMemoryItems, Wait, LoopEnd, ProcessHandle, ProcessingEnd (+154 more)

### Community 1 - "client.test.ts"
Cohesion: 0.02
Nodes (110): Connection, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, Answer (+102 more)

### Community 10 - "BlockRef"
Cohesion: 0.04
Nodes (44): BlockEventSource, BlockLedgerSource, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, QueuedBlock, LedgerBinding (+36 more)

### Community 102 - "digest.test.ts"
Cohesion: 0.08
Nodes (31): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+23 more)

### Community 103 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 104 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (26): StandInOptions, Commit, heightPartitionsSql(), blockFetchStandIn(), standInHeader(), standInItems(), a145Stored(), hex() (+18 more)

### Community 105 - "ledger-state.test.ts"
Cohesion: 0.13
Nodes (23): ChildReader, FoundTape, Tape, childRefKeys(), readChildren(), a106Problems(), a107Problems(), a99Problems() (+15 more)

### Community 107 - "Process"
Cohesion: 0.13
Nodes (6): CoreTransport, RetryCode, Process, RetryCondition, messageOf(), pause()

### Community 108 - "version-checks.ts"
Cohesion: 0.18
Nodes (25): CountingNode, Select, Walk, Answers, toHex(), H(), blockWith(), copyVendoredLedger() (+17 more)

### Community 109 - "chain-events-decode.test.ts"
Cohesion: 0.10
Nodes (26): MetadataField, MetadataType, MetadataVariant, Primitive, RecordTypes, ScaleValue, chainEventsOf(), metadataView() (+18 more)

### Community 11 - "db/errors.ts"
Cohesion: 0.03
Nodes (83): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresOptions, ConfiguredDatabaseOptions, CommittedHeight, ReadOptions, ReadTimeoutSetting (+75 more)

### Community 110 - "browser/build.ts"
Cohesion: 0.09
Nodes (24): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+16 more)

### Community 112 - "code-registry.ts"
Cohesion: 0.11
Nodes (27): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+19 more)

### Community 115 - "items.ts"
Cohesion: 0.11
Nodes (13): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata (+5 more)

### Community 116 - "lockstep-refusals.test.ts"
Cohesion: 0.12
Nodes (26): LockstepCondition, PublicCore, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn() (+18 more)

### Community 117 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 118 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 12 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (97): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, Point (+89 more)

### Community 122 - "private/lockstep-wait.test.ts"
Cohesion: 0.12
Nodes (18): Report, ExpectedWait, ReportRelay, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf() (+10 more)

### Community 125 - "placement.ts"
Cohesion: 0.10
Nodes (24): BodyExtrinsic, ExtrinsicCall, BlockBody, MetadataPallet, RuntimeMetadataView, ChainTransaction, EventPhase, callOf() (+16 more)

### Community 126 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 127 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 13 - "column-rules.ts"
Cohesion: 0.02
Nodes (101): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+93 more)

### Community 132 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 133 - "config-hash-checks.ts"
Cohesion: 0.14
Nodes (21): A162Options, a162Run, HeaderSeen, InstancesOptions, instancesRun, adminOrigin(), launchPublicCore(), publicReads() (+13 more)

### Community 136 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.09
Nodes (22): Key, Sql, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap (+14 more)

### Community 137 - "referenceMergeEntries"
Cohesion: 0.11
Nodes (19): MergeEntriesFn, isPlainObject(), mergeSections(), referenceMergeEntries(), 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 3.1 Field mapping (write path) (+11 more)

### Community 139 - "core-block-fetch/metadata.ts"
Cohesion: 0.27
Nodes (15): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, decodeExtrinsic(), field(), pallet(), readRuntimeMetadata() (+7 more)

### Community 14 - "durability-probe.test.ts"
Cohesion: 0.04
Nodes (82): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, PostgresOptions, WriterSession, WriterStart, Row (+74 more)

### Community 140 - "node-bridge.ts"
Cohesion: 0.14
Nodes (17): Thread, BridgeServer, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 141 - "shims.test.ts"
Cohesion: 0.15
Nodes (8): Buffer, Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 142 - "pglite-writer.worker.ts"
Cohesion: 0.17
Nodes (16): Held, PgliteLockUse, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor(), main() (+8 more)

### Community 144 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 146 - ".value"
Cohesion: 0.28
Nodes (6): ScaleReader, ValueReader, blockTimeOf(), decodeChainEvents(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 147 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (16): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), concatBytes(), encodeCompact() (+8 more)

### Community 148 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 15 - "core-config.test.ts"
Cohesion: 0.03
Nodes (80): adminRoutes, AdminServer, AdminStartOptions, AdminEndpoint, AdminPart, AdminSnapshot, ReadinessFacts, CommandBuildOptions (+72 more)

### Community 150 - "transport-intake.test.ts"
Cohesion: 0.14
Nodes (9): SessionSeen, A112Observation, Wiring, TransportProxy, PRIVATE_BACKENDS, PRIVATE_LOGIN, READER_LOGIN, engines (+1 more)

### Community 151 - "intake.test.ts"
Cohesion: 0.19
Nodes (13): PrivateSeen, A114Observation, A116Observation, TestLink, a114Problems(), a114Run(), a116Problems(), follow() (+5 more)

### Community 153 - "package-identity.test.ts"
Cohesion: 0.19
Nodes (16): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+8 more)

### Community 154 - "HeightRun"
Cohesion: 0.12
Nodes (8): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, StartsAtEveryRevision

### Community 155 - "fixtures/configuration.ts"
Cohesion: 0.16
Nodes (14): BrowserConfiguration, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration(), param(), privateConfiguration() (+6 more)

### Community 16 - "declaration.ts"
Cohesion: 0.03
Nodes (107): coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+99 more)

### Community 162 - "checkShape"
Cohesion: 0.31
Nodes (9): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+1 more)

### Community 166 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 167 - ".from"
Cohesion: 0.13
Nodes (14): recordedGenesis, hexOf(), hex(), hex(), unhex(), hex(), hex(), bytesOf() (+6 more)

### Community 17 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (94): ProcessCondition, ArgType, BlockOptions, CallSpec, RUNTIME, Decoded, FetchSeen, CrashEvent (+86 more)

### Community 170 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 174 - "pglite-timeouts.test.ts"
Cohesion: 0.17
Nodes (12): Run, Job, WorkerEvent, expectNeverCutOffNorHung(), settings(), apiRead(), engine(), report() (+4 more)

### Community 178 - "browser-harness.ts"
Cohesion: 0.27
Nodes (13): ProcessName, backupThrough(), call(), eventsOf(), eventWhen(), logOf(), pageWhen(), restoreThrough() (+5 more)

### Community 179 - "chrome.ts"
Cohesion: 0.23
Nodes (11): Cdp, CdpEvent, Download, PageRequest, chrome(), chrome(), chromePath(), chromeVersion() (+3 more)

### Community 18 - "ref_node_fs"
Cohesion: 0.05
Nodes (78): RestoreSeams, RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, TickerConfig, ledgerBackup, RestoreBuild (+70 more)

### Community 180 - "read-height.property.test.ts"
Cohesion: 0.20
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+2 more)

### Community 181 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 182 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 187 - "history.property.test.ts"
Cohesion: 0.20
Nodes (11): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+3 more)

### Community 19 - "height-versioned.test.ts"
Cohesion: 0.03
Nodes (76): BlockWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue, BlockContext (+68 more)

### Community 190 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 193 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 197 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 198 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 2 - "admin-harness.ts"
Cohesion: 0.02
Nodes (151): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminAnswer, AdminView, ReadOnlyDatabase, Heartbeat (+143 more)

### Community 20 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (97): BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime, Field, PalletMetadata (+89 more)

### Community 21 - "NodeClient"
Cohesion: 0.06
Nodes (63): HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter, NodeBlock, NodeRuntimeVersion (+55 more)

### Community 210 - "page-server.ts"
Cohesion: 0.27
Nodes (7): BrowserBuild, pageBench, PageServer, servePage(), listenOnRandomPort(), ISOLATION_HEADERS, TYPES

### Community 22 - "module-api.test.ts"
Cohesion: 0.03
Nodes (75): ModuleApiServer, ModuleApiStart, StartedModuleApi, Connection, HeadersArgument, ModuleApiServerOptions, ModuleApiStart, StartedModuleApi (+67 more)

### Community 220 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 229 - "HeldHeight"
Cohesion: 0.28
Nodes (5): CommitOutcome, HeldHeight, Outcomes, AlwaysLost, DropsHeld

### Community 23 - "deterministic-postgresql/index.ts"
Cohesion: 0.04
Nodes (77): DumpInput, BlockWrites, Point, GuardTableRow, RelationFacts, optOut, TableName, BlockOpener (+69 more)

### Community 239 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 24 - "cli/command.ts"
Cohesion: 0.04
Nodes (73): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, CommandResult, CheckTarget, CliBackend (+65 more)

### Community 249 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 25 - "runner/process.ts"
Cohesion: 0.04
Nodes (71): ConfigFacts, OpenedConfig, OpenedFacts, ProcessAdminOptions, AdminStarter, Bound, ChainIdentity, ChainSource (+63 more)

### Community 26 - "api-server.test.ts"
Cohesion: 0.04
Nodes (69): ReadHandle, OwnPart, ApiRegistry, FieldKind, FieldSchema, ItemDeclaration, ItemSink, Lifetime (+61 more)

### Community 27 - "host.ts"
Cohesion: 0.05
Nodes (64): LoadLedger, LedgerStateItem, RetainedState, LedgerName, LedgerTask, LedgerTaskBlock, NodeBatch, ParsedTransaction (+56 more)

### Community 28 - "change-capture.ts"
Cohesion: 0.03
Nodes (69): CapturedTable, SchemaItem, Op, States, TableName, MigrationRow, PartOptions, TestPart (+61 more)

### Community 29 - "adapter.ts"
Cohesion: 0.04
Nodes (65): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+57 more)

### Community 3 - "validate.ts"
Cohesion: 0.03
Nodes (146): CoreVersion, CoreSettings, ConfigHashRow, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions, HistoryRow (+138 more)

### Community 30 - "Database"
Cohesion: 0.06
Nodes (74): Database, SchemaWriteHandle, AppliedMigration, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+66 more)

### Community 31 - "binding.test.ts"
Cohesion: 0.05
Nodes (69): PrivateBackend, TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, InstanceHashes (+61 more)

### Community 32 - "node-format.ts"
Cohesion: 0.06
Nodes (54): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+46 more)

### Community 33 - "builder.test.ts"
Cohesion: 0.04
Nodes (41): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+33 more)

### Community 34 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (64): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+56 more)

### Community 35 - "LedgerPackage"
Cohesion: 0.06
Nodes (33): LedgerPackage, NodeStore, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, bridgeStore, stagenetReplay (+25 more)

### Community 36 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (63): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, GreyView, SweepPhase, FixtureRunOptions, blockHeaderOf() (+55 more)

### Community 37 - "roles.ts"
Cohesion: 0.05
Nodes (57): Difference, PlannedSchema, Provision, QualifiedTable, SchemaModule, SchemaTable, Settings, TestPart (+49 more)

### Community 38 - "FinalizedLoop"
Cohesion: 0.06
Nodes (15): FinalizedLoop, LoopObserver, Startup, SkipsLockstep, WaitingInRead, ItemsAfterWrite, FailingAfter, NoRedelivery (+7 more)

### Community 39 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (63): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), [0.9.5] - 2026-07-25 — "Penumbra", Added, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), 1. Decisive scope (+55 more)

### Community 4 - "process-admin.ts"
Cohesion: 0.03
Nodes (119): AllowedDetail, PrivateSideFacts, ProcessAdmin, RevisionSettings, DigestRow, ModuleFacts, PartTable, PrivateInstanceFacts (+111 more)

### Community 40 - "module-tables.ts"
Cohesion: 0.06
Nodes (57): CaptureColumn, CaptureState, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions (+49 more)

### Community 41 - "range.ts"
Cohesion: 0.05
Nodes (56): BoundaryBlockReading, BoundaryOptions, BoundaryReading, TapeBuilder, Arguments, Command, TapeCommandIo, CompletenessRange (+48 more)

### Community 43 - "order.property.test.ts"
Cohesion: 0.05
Nodes (58): BlockHeader, PointArguments, PointRun, CallEvent, Recorder, CheckName, GraphSpec, ModuleSpec (+50 more)

### Community 44 - "cbor.ts"
Cohesion: 0.07
Nodes (56): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+48 more)

### Community 45 - "contract-data-checks.ts"
Cohesion: 0.08
Nodes (57): ContractStateRow, CoreContractStatesOptions, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+49 more)

### Community 47 - "core-block-parsed.ts"
Cohesion: 0.06
Nodes (53): BlockParsed, BlockParsedOptions, TransactionParser, ChainEvent, itemsSeen, blockBodyOf(), blockParsedItemOf(), blockParsedOf() (+45 more)

### Community 48 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (47): HeightActivity, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, Observed (+39 more)

### Community 49 - "transform-checks.ts"
Cohesion: 0.09
Nodes (34): TransformError, NotificationRange, turns(), until(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape() (+26 more)

### Community 5 - "vitest"
Cohesion: 0.02
Nodes (106): BenchEnv, ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts (+98 more)

### Community 50 - "PgliteDatabase"
Cohesion: 0.07
Nodes (13): JobQueue, PgliteDatabase, BoundedRead, ReadPool, Session, Writer, commitRolledBack(), handleClosed() (+5 more)

### Community 51 - "core-chain-events.ts"
Cohesion: 0.07
Nodes (43): NodeDatabase, Call, Flaky, boundEventSource(), coreChainEventsOnFetch(), coreLedgerState(), writeSweep(), startLedgerWorker() (+35 more)

### Community 52 - "mapping.ts"
Cohesion: 0.07
Nodes (39): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+31 more)

### Community 53 - "process-backends.ts"
Cohesion: 0.10
Nodes (42): FixtureRun, TableSnapshot, FixtureNode, RefusalData, ProcessDatabase, refusalHalt(), refusalHeight(), runFixture() (+34 more)

### Community 54 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+34 more)

### Community 55 - "net.test.ts"
Cohesion: 0.08
Nodes (23): IncomingMessage, Server, Emitter, Frame, Listener, PortSocket, PortUpgrade, RawData (+15 more)

### Community 57 - "version"
Cohesion: 0.04
Nodes (47): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+39 more)

### Community 58 - "transport-faults.test.ts"
Cohesion: 0.08
Nodes (33): Message, MessageType, TestCertificates, Ended, rawClient, mutualTlsOptions(), hexOf(), makeCertificates() (+25 more)

### Community 59 - "private-transport.ts"
Cohesion: 0.08
Nodes (22): PublicSide, TransportLimits, HelloAck, JsonValue, ReadResult, StatementResult, Pending, PrivateTransport (+14 more)

### Community 6 - "UmbraError"
Cohesion: 0.03
Nodes (115): LoadedConfig, LoadOptions, PublicIdentity, BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts (+107 more)

### Community 60 - "T"
Cohesion: 0.04
Nodes (48): Absent, n(), T(), input(), 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 4. Transaction / Lease — the control algebra the other three run inside, 5. Testable-law deliverable (fast-check + Vitest) (+40 more)

### Community 61 - "graph.ts"
Cohesion: 0.08
Nodes (46): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts, ResolvedRange (+38 more)

### Community 62 - "core-transport.ts"
Cohesion: 0.07
Nodes (28): CoreTransportOptions, InstanceView, Session, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions (+20 more)

### Community 63 - "config/plain-data.test.ts"
Cohesion: 0.06
Nodes (27): LoadOptions, PlainDataRule, Row, Finding, invalid(), isFile(), loadConfig(), modulesOf() (+19 more)

### Community 65 - "ledger/types.ts"
Cohesion: 0.08
Nodes (36): ApplyInput, ApplyOutput, ChainOutcome, LedgerEvent, StateSummary, StoredNode, TransactionResult, CallTx (+28 more)

### Community 66 - "ledger-tasks-checks.ts"
Cohesion: 0.09
Nodes (36): IngestOptions, TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, ProcessBackend, countMainThreadParses() (+28 more)

### Community 67 - "retirement.test.ts"
Cohesion: 0.07
Nodes (39): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), manifestProblems(), mutationProblems() (+31 more)

### Community 69 - "ledger-storage.test.ts"
Cohesion: 0.10
Nodes (32): SeenLoad, retentionSeen, LedgerTx, Reader, TableNode, heightsIn(), a100Problems(), a102Problems() (+24 more)

### Community 7 - "tape/index.ts"
Cohesion: 0.04
Nodes (88): Failure, Variant, Link, TapeBuilderOptions, RecordingError, RecordingProblem, TapeError, TapeProblem (+80 more)

### Community 70 - "core-settings.ts"
Cohesion: 0.06
Nodes (37): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+29 more)

### Community 71 - "ledger-sweep.test.ts"
Cohesion: 0.09
Nodes (20): SweepState, SweepTables, SweepWrites, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel (+12 more)

### Community 72 - "config-check.ts"
Cohesion: 0.07
Nodes (33): CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, RunOptions, RunSeams, SignalSource (+25 more)

### Community 73 - "column-refusals.test.ts"
Cohesion: 0.09
Nodes (23): ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase(), hashOf() (+15 more)

### Community 74 - ".concat"
Cohesion: 0.06
Nodes (29): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+21 more)

### Community 75 - "private/backends.ts"
Cohesion: 0.08
Nodes (32): DatabaseState, ReadDatabaseOptions, TypeCheckFinding, TypeCheckResult, NodeRunResult, cursorHeight(), readPrivateCursor(), commandCommittedHeight() (+24 more)

### Community 76 - ".#open"
Cohesion: 0.08
Nodes (19): MisuseReports, ProcessContexts, ProcessItems, ChainStarted, bindCoreBlockFetch(), bindLedgerParser(), bindCoreChain(), bindCoreChainEvents() (+11 more)

### Community 78 - "real-tapes.ts"
Cohesion: 0.08
Nodes (32): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+24 more)

### Community 8 - "loop.test.ts"
Cohesion: 0.03
Nodes (98): Transaction, EntryRange, GraphInput, LockstepWait, SlowBlockEvent, PastFaultCase, RefusalCase, Contexts (+90 more)

### Community 80 - "pg-tx-history-adapter.ts"
Cohesion: 0.08
Nodes (26): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue() (+18 more)

### Community 82 - "ref_node_crypto"
Cohesion: 0.07
Nodes (24): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql() (+16 more)

### Community 83 - "ingest-harness.ts"
Cohesion: 0.11
Nodes (32): ingest, SourceClass, watched, RestartEvent, RestartJob, WindowBackup, chainDeclarations(), committed() (+24 more)

### Community 84 - "ledger/load.ts"
Cohesion: 0.09
Nodes (27): AdapterSpec, LedgerRelease, LedgerReleasePackage, LedgerPackageOptions, V9Logs, SlowStep, TestLoaderData, Nodes (+19 more)

### Community 85 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 89 - "process-context.test.ts"
Cohesion: 0.07
Nodes (25): MisuseListener, PublishRefusal, AcceptsDuplicates, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, a74Problems() (+17 more)

### Community 9 - "builds.ts"
Cohesion: 0.03
Nodes (67): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, privateIntake, PrivateIntakeOptions, SourceTransport, PublicConfiguration (+59 more)

### Community 90 - "messages.ts"
Cohesion: 0.07
Nodes (32): Committed, MessageFault, Parsed, bytesOf(), decodeParameter(), decodeValue(), describe(), elementType() (+24 more)

### Community 92 - "transaction-history-storage.property.test.ts"
Cohesion: 0.08
Nodes (23): EntryContent, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, Command, ReplayableStorage, abortErrorLike(), capitalize(), applyCommand() (+15 more)

### Community 93 - "PointName"
Cohesion: 0.07
Nodes (25): PointName, CallbackFailure, ReasonCode, Unwrapped, Activity, HeightFailure, Misuse, UnexpectedCursor (+17 more)

### Community 94 - "process-worker.ts"
Cohesion: 0.10
Nodes (26): BrowserRun, PrivateInstance, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, openedProcess (+18 more)

### Community 97 - "loop.ts"
Cohesion: 0.12
Nodes (33): HeightRange, Callback, EntryBoundary, ParallelPoint, PointSchedule, Invoke, Progress, ReadOpener (+25 more)

### Community 98 - "page.ts"
Cohesion: 0.07
Nodes (29): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog(), backUp() (+21 more)

### Community 99 - "postgres/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+13 more)

### Community 237 - ".position"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 255 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 106 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (19): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), registerSuiteLifecycle(), startTestDatabase(), registerSuiteLifecycle(), startTestDatabase() (+11 more)

### Community 121 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.10
Nodes (22): bindLedgerTasks(), boundHost(), frozen(), hasLedgerTasks(), resultsOf(), withItems(), withLedgerTaskPoints(), withLedgerTasks() (+14 more)

### Community 123 - "code"
Cohesion: 0.09
Nodes (27): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21), The catalog, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog (+19 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): `transaction_history`, 1. Schema, ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins (+15 more)

### Community 135 - "refused"
Cohesion: 0.09
Nodes (22): refused(), When a callback fails, 7. Storage helpers, Requirement: AE-3 States and conditions, Requirement: AE-5 `/status` and `/config` contents, Scenario: A fault of the build's declarations ends the process, Scenario: A refused configuration ends the process, Scenario: A refused start stays up (+14 more)

### Community 145 - "migrations"
Cohesion: 0.10
Nodes (19): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Migrations, Requirement: DB-9 Bootstrap, migrations and setup, Scenario: A changed migration refuses startup, Scenario: The second of two migrations fails, 0. Preconditions and schema, Impact (+11 more)

### Community 157 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (16): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface (+8 more)

### Community 169 - ".slowBlockMs"
Cohesion: 0.15
Nodes (13): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+5 more)

### Community 171 - "ADDED Requirements"
Cohesion: 0.12
Nodes (14): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+6 more)

### Community 177 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 189 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 199 - "Full-Chain Storage"
Cohesion: 0.17
Nodes (11): store(), 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 3. Semantic decode: `chain-archive-sync/tx-replay-decoder.ts`, 4. How to run it (+3 more)

### Community 200 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 206 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 224 - "attempt"
Cohesion: 0.28
Nodes (8): attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 230 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 236 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 272 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 304 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 305 - "leanProblems"
Cohesion: 0.50
Nodes (4): leanImports(), leanProblems(), leanTheorems(), retiredLean()

### Community 42 - "history"
Cohesion: 0.04
Nodes (65): integer(), history(), revision(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()` (+57 more)

### Community 46 - "fn"
Cohesion: 0.04
Nodes (60): fn(), 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure (+52 more)

### Community 56 - ".put"
Cohesion: 0.05
Nodes (46): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+38 more)

### Community 87 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (34): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change) (+26 more)

### Community 91 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 95 - "table"
Cohesion: 0.06
Nodes (35): table(), Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Private modules, Reading through `db`, Running a module with the `umbradb` command (+27 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+27 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 111 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (30): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+22 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+23 more)

### Community 114 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, optional, engines, node (+22 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+20 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 129 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 130 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.08
Nodes (18): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Superseded — see `Formal/STORAGE_ALGEBRA.md`, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan (+10 more)

### Community 134 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+14 more)

### Community 143 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 149 - "ROADMAP.md"
Cohesion: 0.10
Nodes (15): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, Captured transcript (+7 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 156 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.11
Nodes (16): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+8 more)

### Community 158 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 159 - "chain_archive lineage"
Cohesion: 0.12
Nodes (17): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, CheckpointStore tables, How the two lineages coexist (+9 more)

### Community 160 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (17): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+9 more)

### Community 161 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
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
Nodes (15): 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.1 Transaction/Lease layer (+7 more)

### Community 172 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 175 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 176 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.13
Nodes (14): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.1 The barrel: `src/index.ts`, 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 3.1 The frozen catalog (the machine-facing API), 3.2 Promote retryability to a machine-readable field (+6 more)

### Community 184 - "README.md"
Cohesion: 0.24
Nodes (6): [1.0.0] - unreleased — "Totality", Changelog, [Unreleased], Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 185 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 186 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 191 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 192 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 194 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 195 - "UmbraDB"
Cohesion: 0.15
Nodes (13): Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security, Status (+5 more)

### Community 196 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 201 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 202 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 203 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 204 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 205 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 207 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 208 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 209 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 211 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 212 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 213 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 214 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 215 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 216 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 217 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 218 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 219 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 221 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 222 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 223 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 225 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 226 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 227 - "Acceptance — v1.0.0 API Surface & Release Contract"
Cohesion: 0.22
Nodes (8): Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in), Precondition (blocks the whole change)

### Community 228 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 231 - "scoped-review-manifest"
Cohesion: 0.25
Nodes (7): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest

### Community 232 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 233 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 234 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.25
Nodes (8): 1. Durability contract, 3. Cancellation semantics, 4. Save-retry caveat, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 235 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 238 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 240 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 241 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 242 - "Backups"
Cohesion: 0.29
Nodes (6): A backup at the core's stop, Backups, Restoring a backup, UmbraDB operator guide, What a backup holds, Writing a backup

### Community 243 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 244 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 245 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 246 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 247 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 248 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 252 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 253 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 254 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 256 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 257 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 258 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 259 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 260 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

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

### Community 265 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, What changes — the 1.0.0 gate items this change addresses, Why

### Community 266 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 267 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 268 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 269 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 270 - "The five primitives"
Cohesion: 0.33
Nodes (6): CheckpointStore: content-addressed snapshots, TemporalKV: versioned KV with history, The five primitives, Transaction/Lease: the control algebra, TransactionHistory + WalletStateEnvelope, Watermarks: sync cursors

### Community 271 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 273 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 274 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 275 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 276 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 277 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 278 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 279 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 280 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 281 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 282 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 283 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 284 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 285 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 286 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 287 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 288 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 289 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 290 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 291 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.40
Nodes (4): 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 292 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 293 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 294 - "GC architecture and query-tracing: research findings"
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

### Community 300 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 301 - "Requirement: PP-2 A private database is bound to one public database"
Cohesion: 0.50
Nodes (4): Requirement: PP-2 A private database is bound to one public database, Scenario: Configured for another network, Scenario: Pointed at another public database, Scenario: The public core never started

### Community 302 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 303 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 310 - "Requirement: RN-5 The block context carries one height's items"
Cohesion: 0.67
Nodes (3): Requirement: RN-5 The block context carries one height's items, Scenario: A second put is an error, Scenario: An item reaches a later callback of the same block

### Community 311 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 64 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 68 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 79 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.05
Nodes (41): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+33 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+32 more)

### Community 86 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-8949`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `@stryker-mutator/core` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3659 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `chain-process.test.ts`, `client.test.ts`, `admin-harness.ts`, `validate.ts`, `process-admin.ts`, `UmbraError`, `tape/index.ts`, `loop.test.ts`, `builds.ts`, `BlockRef`, `db/errors.ts`, `adapter-fixtures.ts`, `column-rules.ts`, `durability-probe.test.ts`, `core-config.test.ts`, `declaration.ts`, `fetch-fixtures.ts`, `ref_node_fs`, `height-versioned.test.ts`, `chain-placement.test.ts`, `NodeClient`, `module-api.test.ts`, `deterministic-postgresql/index.ts`, `cli/command.ts`, `runner/process.ts`, `api-server.test.ts`, `host.ts`, `change-capture.ts`, `adapter.ts`, `Database`, `binding.test.ts`, `node-format.ts`, `builder.test.ts`, `contract-modules.test.ts`, `LedgerPackage`, `core-ledger-state.ts`, `roles.ts`, `module-tables.ts`, `order.property.test.ts`, `cbor.ts`, `contract-data-checks.ts`, `core-block-parsed.ts`, `slow-block-harness.ts`, `transform-checks.ts`, `core-chain-events.ts`, `mapping.ts`, `process-backends.ts`, `boundary.test.ts`, `net.test.ts`, `transport-faults.test.ts`, `private-transport.ts`, `core-transport.ts`, `config/plain-data.test.ts`, `ledger/types.ts`, `ledger-tasks-checks.ts`, `retirement.test.ts`, `ledger-storage.test.ts`, `core-settings.ts`, `ledger-sweep.test.ts`, `config-check.ts`, `column-refusals.test.ts`, `real-tapes.ts`, `pg-tx-history-adapter.ts`, `ref_node_crypto`, `ingest-harness.ts`, `ledger/load.ts`, `networks.ts`, `process-context.test.ts`, `messages.ts`, `transaction-history-storage.property.test.ts`, `PointName`, `postgres/transaction-history-storage.ts`, `digest.test.ts`, `browser.test.ts`, `core-block-commit.test.ts`, `ledger-state.test.ts`, `cold-boot-recovery.integration.test.ts`, `version-checks.ts`, `chain-events-decode.test.ts`, `browser/build.ts`, `code-registry.ts`, `package.json`, `lockstep-refusals.test.ts`, `test/postgres/setup.ts`, `ledger/ledger-tasks.test.ts`, `private/lockstep-wait.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `cbor.property.test.ts`, `config-hash-checks.ts`, `node-bridge.ts`, `shims.test.ts`, `block-fetch-decode.test.ts`, `key-handling-checks.ts`, `transport-intake.test.ts`, `intake.test.ts`, `package-identity.test.ts`, `validation.test.ts`, `ws-mutual-tls.test.ts`, `pglite-timeouts.test.ts`, `mutation-per-adapter.mjs`, `read-height.property.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `history.property.test.ts`, `excluded-not-exported.test.ts`, `twox.ts`, `worker-threads.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `facade-merge-loader.ts`?**
  _High betweenness centrality (0.273) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `chain-process.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02202392253654832 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `chain-process.test.ts`, `client.test.ts`, `admin-harness.ts`, `validate.ts`, `process-admin.ts`, `tape/index.ts`, `loop.test.ts`, `builds.ts`, `BlockRef`, `db/errors.ts`, `shims.test.ts`, `durability-probe.test.ts`, `core-config.test.ts`, `pglite-writer.worker.ts`, `version-table.ts`, `declaration.ts`, `height-versioned.test.ts`, `fetch-fixtures.ts`, `NodeClient`, `module-api.test.ts`, `deterministic-postgresql/index.ts`, `runner/process.ts`, `package-identity.test.ts`, `api-server.test.ts`, `change-capture.ts`, `host.ts`, `Database`, `binding.test.ts`, `contract-modules.test.ts`, `checkShape`, `core-ledger-state.ts`, `roles.ts`, `validation.test.ts`, `FinalizedLoop`, `module-tables.ts`, `range.ts`, `cbor.ts`, `slow-block-harness.ts`, `transform-checks.ts`, `PgliteDatabase`, `core-chain-events.ts`, `mapping.ts`, `web-lock.ts`, `transport-faults.test.ts`, `private-transport.ts`, `graph.ts`, `core-transport.ts`, `config/plain-data.test.ts`, `ledger-tasks-checks.ts`, `core-settings.ts`, `config-check.ts`, `private/backends.ts`, `.#open`, `ref_node_crypto`, `process-context.test.ts`, `PointName`, `table`, `loop.ts`, `core-block-commit.test.ts`, `version-checks.ts`, `items.ts`, `lockstep-refusals.test.ts`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `client.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.019321029847345638 - nodes in this community are weakly interconnected._