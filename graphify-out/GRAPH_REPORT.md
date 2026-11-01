# Graph Report - UmbraDB

## Corpus Check
- 1167 files · ~1,630,867 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12197 nodes · 37445 edges · 358 communities (311 shown, 47 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2977 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `813591a3270a78aa` (1167 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- ModuleDeclaration
- loop.ts
- loop-stop-harness.ts
- boundary.test.ts
- release-version.ts
- shims.test.ts
- file-modes.ts
- paused-harness.ts
- code-registry.ts
- ledger/types.ts
- documents.ts
- process-worker.ts
- mapping.ts
- pg-tx-history-adapter.ts
- LoopPauses
- node-fields-harness.ts
- read-gate.ts
- .from
- fixtures/configuration.ts
- core-chain-events.ts
- relays.ts
- containers.test.ts
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- backup-fixtures.ts
- node-bridge.ts
- surface.test.ts
- worker-threads.test.ts
- changes.property.test.ts
- pack-install.mjs
- ingest-harness.ts
- ledger/metadata.ts
- example-checks.ts
- childRefKeys
- ledger-sweep.test.ts
- digest.test.ts
- BlockRef
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- commit-proxy.ts
- UmbraError
- options.ts
- resolver-boundary.ts
- text.test.ts
- process-access.ts
- private/backends.ts
- Design — Sprint 1: project setup + TemporalKV
- statementsOf
- Worker
- stats-module.ts
- adapter-fixtures.ts
- read-height.property.test.ts
- no-indexer-or-wallet-sdk.test.ts
- web-lock.ts
- ws-mutual-tls.test.ts
- core-block-fetch.test.ts
- config/plain-data.ts
- component-table.test.ts
- entries.ts
- history.property.test.ts
- admin-harness.ts
- db/api.ts
- TapeAnswers
- sweepStep
- postgres-tls-server.ts
- browser/src/config/load.ts
- config/history.ts
- database-parts.ts
- Connection
- typescript
- ProcessItems
- NodeClient
- EntryBoundary
- chain-process.test.ts
- mutation-evidence.d.mts
- core-private-source.test.ts
- AsyncLocalStorage
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- devnet-upgrade.test.ts
- never
- browser.test.ts
- builder.test.ts
- start-umbradb.ts
- src/db/postgres.ts
- declaration.ts
- aborted
- SkipsAfterReconnect
- coreEntry
- BYTE_ORDER
- CliBackend
- https.ts
- range.ts
- NodeFS
- LateRedelivery
- pause-fixtures.ts
- PausesInsideTheHeight
- SkipsLockstep
- SkipsUnseen
- LedgerPackage
- WaitsInTransaction
- WaitingInRead
- ItemsAfterWrite
- DropsHeld
- NeverClears
- NeverClears
- NoRedelivery
- CommitsTheBoundary
- adapter.ts
- 5. Runner
- Process
- spawnChild
- transport-faults.test.ts
- tape/index.ts
- messages.ts
- contract-modules.test.ts
- backup/backup.ts
- validate.ts
- public-database.ts
- channel-checks.test.ts
- ledger/ledger-tasks.test.ts
- PgTransactionHistoryStorage
- builds.ts
- FinalizedLoop
- client.test.ts
- runner/process.ts
- mounted-admin.test.ts
- process-admin.ts
- column-rules.ts
- contract-data-checks.ts
- core-block-parsed.ts
- resolve.ts
- ref_node_crypto
- module-tables.ts
- interfaces/transaction-history-storage.ts
- slow-block-harness.ts
- column-rules.test.ts
- net.test.ts
- code
- core-block-commit.test.ts
- .value
- core-channels.ts
- core-ledger-state.ts
- cbor.ts
- InMemoryBlockSource
- graph.ts
- binding.test.ts
- checkShape
- retirement.test.ts
- networks.ts
- process-context.test.ts
- vitest
- browser/build.ts
- version-checks.ts
- pglite-lock.ts
- cold-boot-recovery.integration.test.ts
- cbor.property.test.ts
- test/postgres/setup.ts
- validation.ts
- api-server.test.ts
- core.ts
- core-ledger-state/sql.ts
- state-trees.test.ts
- page.ts
- TransactionHistoryEntry
- Proposal — Sprint 3: CheckpointStore
- refused
- table
- transportReader
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- .slowBlockMs
- mapping.test.ts
- log
- core-ledger-state.test.ts
- Design — START-UMBRADB: UmbraDB as a library
- Requirement: BK-1 Backup
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- twox.ts
- core-tx-results/sql.ts
- openssl
- UmbraDB third-party component inventory (SBOM)
- scoped-review-manifest
- path.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- selectLedgerVersion
- orphan-watcher.mjs
- fresh-instance.mjs
- crash-worker.ts
- history
- .put
- ADDED Requirements
- version
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- README.md
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Design — v1.0.0-durable-checkpoint-cursor
- Boundaries, threats and controls
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- UmbraDB
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- Design — Sprint 4: Watermarks
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- UmbraDB in a browser
- stats-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Requirement: PP-4 The process transport
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- Midnight Foundation Security Policy
- Changelog
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Backups
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 4: Watermarks
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
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
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
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
- 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered
- bug-report.md
- feature-request.md
- Tasks — Sprint 5: Lean M3a Watermarks W1
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- start-stack.sh
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
- ADDED Requirements
- post-block-update/oracle/main.rs

## God Nodes (most connected - your core abstractions)
1. `vitest` - 399 edges
2. `UmbraError` - 341 edges
3. `ModuleDeclaration` - 193 edges
4. `InMemoryBlockSource` - 156 edges
5. `FinalizedLoop` - 133 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 102 edges
8. `Database` - 101 edges
9. `ReadHandle` - 91 edges
10. `startProcess()` - 85 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
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

## Communities (358 total, 47 thin omitted)

### Community 0 - "ModuleDeclaration"
Cohesion: 0.02
Nodes (205): Database, AppliedMigration, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, driverConnectionOptions (+197 more)

### Community 1 - "loop.ts"
Cohesion: 0.02
Nodes (172): QueuedBlock, Transaction, PointName, EntryRange, HeightRange, BlockItems, LateUse, FinalityStallCondition (+164 more)

### Community 10 - "loop-stop-harness.ts"
Cohesion: 0.03
Nodes (124): ProcessCondition, ArgType, BlockOptions, CallSpec, PalletSpec, RUNTIME, Decoded, FetchSeen (+116 more)

### Community 101 - "boundary.test.ts"
Cohesion: 0.14
Nodes (32): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+24 more)

### Community 102 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 106 - "shims.test.ts"
Cohesion: 0.10
Nodes (18): Buffer, BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText(), charCodes() (+10 more)

### Community 107 - "file-modes.ts"
Cohesion: 0.09
Nodes (25): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+17 more)

### Community 108 - "paused-harness.ts"
Cohesion: 0.14
Nodes (27): Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, a176Project(), keeperModule() (+19 more)

### Community 109 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 11 - "ledger/types.ts"
Cohesion: 0.03
Nodes (105): LoadLedger, LedgerStateItem, RetainedState, LedgerName, Path, ApplyOutput, ChainOutcome, LedgerPackageOptions (+97 more)

### Community 111 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 112 - "process-worker.ts"
Cohesion: 0.12
Nodes (22): Scope, crossedError, StartRun, ToProcessWorker, openedProcess, messageAdmin(), withDevelopmentOptIn(), databaseOptions() (+14 more)

### Community 113 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 114 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 117 - "LoopPauses"
Cohesion: 0.09
Nodes (17): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 118 - "node-fields-harness.ts"
Cohesion: 0.11
Nodes (23): A168Observation, A168Phase, Expected, GatedConnector, StatusReader, a(), a168Run(), a168Tape() (+15 more)

### Community 119 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 12 - ".from"
Cohesion: 0.04
Nodes (131): BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime, Field, PalletMetadata (+123 more)

### Community 120 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (21): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, PglitePathParts, core(), databaseOf() (+13 more)

### Community 122 - "core-chain-events.ts"
Cohesion: 0.10
Nodes (25): MetadataField, Primitive, bindCoreChainEvents(), boundEventSource(), chainEventsItemOf(), chainEventsOf(), coreChainEventsOnFetch(), metadataView() (+17 more)

### Community 123 - "relays.ts"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 124 - "containers.test.ts"
Cohesion: 0.11
Nodes (19): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+11 more)

### Community 125 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.08
Nodes (21): ReadPool, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider) (+13 more)

### Community 126 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 127 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 128 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 129 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 13 - "backup-fixtures.ts"
Cohesion: 0.04
Nodes (106): RestoreChain, RestoreInput, RestoreSeams, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome, BackupBackend (+98 more)

### Community 132 - "node-bridge.ts"
Cohesion: 0.12
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 133 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 136 - "worker-threads.test.ts"
Cohesion: 0.09
Nodes (13): Listener, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread, parentPort (+5 more)

### Community 137 - "changes.property.test.ts"
Cohesion: 0.11
Nodes (23): Op, States, TableName, encodeCanonical(), sha256(), text(), blockAgrees(), compareKeys() (+15 more)

### Community 139 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 14 - "ingest-harness.ts"
Cohesion: 0.04
Nodes (133): BlockParsed, itemsSeen, FixtureRun, CrashEvent, CrashJob, ingest, SourceClass, watched (+125 more)

### Community 140 - "ledger/metadata.ts"
Cohesion: 0.14
Nodes (9): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, MetadataSelector, OwnStateMetadata, contentStateOf() (+1 more)

### Community 141 - "example-checks.ts"
Cohesion: 0.16
Nodes (17): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+9 more)

### Community 145 - "childRefKeys"
Cohesion: 0.17
Nodes (8): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf(), hex(), modelOfFixture()

### Community 148 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (12): SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints(), compare() (+4 more)

### Community 149 - "digest.test.ts"
Cohesion: 0.13
Nodes (20): ChangeKind, tableChanges, TouchedRow, changeOf(), concat(), sameBytes(), hex(), hex() (+12 more)

### Community 15 - "BlockRef"
Cohesion: 0.03
Nodes (68): BlockEventSource, BlockLedgerSource, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, LedgerBinding, NodeCallOptions (+60 more)

### Community 151 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 152 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 153 - "commit-proxy.ts"
Cohesion: 0.14
Nodes (10): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+2 more)

### Community 16 - "UmbraError"
Cohesion: 0.02
Nodes (93): PostgresConnection, PostgresOptions, Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, WaitingListener, ConfigRow (+85 more)

### Community 160 - "options.ts"
Cohesion: 0.23
Nodes (17): HistoryFinding, Finding, readOptions, named(), addressFindings(), configFindings(), finding(), isHost() (+9 more)

### Community 162 - "resolver-boundary.ts"
Cohesion: 0.18
Nodes (16): Boundary, Crossing, Guard, boundaryOf(), boundarySources(), guardedSymbols(), hostWith(), inRepository() (+8 more)

### Community 163 - "text.test.ts"
Cohesion: 0.16
Nodes (8): BackupText, createReadStream(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir, 16. Browser

### Community 168 - "process-access.ts"
Cohesion: 0.20
Nodes (15): Access, AllowedRead, bare(), callsPathResolve(), checked(), declares(), inRepository(), inType() (+7 more)

### Community 17 - "private/backends.ts"
Cohesion: 0.03
Nodes (88): PostgresParts, PrivateBackend, SessionSeen, TestDatabase, PublicCore, PublicCoreOptions, A162Options, a162Run (+80 more)

### Community 170 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 171 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 172 - "Worker"
Cohesion: 0.21
Nodes (3): Worker, 9.2 Browser build (BR), 9. Backups and browser

### Community 174 - "stats-module.ts"
Cohesion: 0.23
Nodes (12): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+4 more)

### Community 18 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (103): StoredNode, Upstream, contractFixture, RawPackage, AdapterSubject, AdapterWorkerHost, Point, Decimal (+95 more)

### Community 180 - "read-height.property.test.ts"
Cohesion: 0.20
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+2 more)

### Community 181 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 182 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 186 - "ws-mutual-tls.test.ts"
Cohesion: 0.19
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 187 - "core-block-fetch.test.ts"
Cohesion: 0.15
Nodes (5): LedgerTable, coreBlockFetchOnFetch(), blockContext(), KNOWN_NETWORKS, IN_MEMORY_START_MS

### Community 188 - "config/plain-data.ts"
Cohesion: 0.24
Nodes (12): PlainArray, PlainDataNode, PlainDataRule, Walk, copyArray(), copyObject(), instanceOf(), isElementKey() (+4 more)

### Community 189 - "component-table.test.ts"
Cohesion: 0.15
Nodes (10): DesignTable, RowCoverage, rule(), opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS (+2 more)

### Community 19 - "entries.ts"
Cohesion: 0.02
Nodes (112): CoreLedgerVersion, LedgerPackageIdentity, LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader (+104 more)

### Community 194 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 2 - "admin-harness.ts"
Cohesion: 0.02
Nodes (177): MountedAdminAnswer, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions (+169 more)

### Community 20 - "db/api.ts"
Cohesion: 0.03
Nodes (86): ReadOnlyDatabase, ReadOptions, Settings, TestBackend, Case, LoadOutcome, OutsideRead, Traced (+78 more)

### Community 200 - "TapeAnswers"
Cohesion: 0.32
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 207 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 208 - "postgres-tls-server.ts"
Cohesion: 0.25
Nodes (7): TlsPostgres, makeCertificates(), startTlsPostgres(), container, { guarded, fixture }, HBA, POSTGRES_IMAGE

### Community 209 - "browser/src/config/load.ts"
Cohesion: 0.29
Nodes (9): LoadedConfig, LoadOptions, configModuleUrl(), configPath(), loadConfig(), loadModuleList(), noFile(), DEFAULT_CONFIG_FILE (+1 more)

### Community 21 - "config/history.ts"
Cohesion: 0.03
Nodes (107): CoreVersion, CoreSettings, versionEntry, ConfigHashRow, HistoryCode, HistoryContext, HistoryOptions, HistoryRule (+99 more)

### Community 22 - "database-parts.ts"
Cohesion: 0.03
Nodes (91): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName (+83 more)

### Community 226 - "typescript"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 23 - "NodeClient"
Cohesion: 0.05
Nodes (70): FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription (+62 more)

### Community 235 - "EntryBoundary"
Cohesion: 0.29
Nodes (3): EntryBoundary, SkipsStartAtRestart, StartsAtEveryRevision

### Community 24 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (95): EngineConfig, ProcessHandle, Start, Refusal, Start, Job, WorkerEvent, ChainBuildOptions (+87 more)

### Community 247 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 25 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (65): PrivateBlockSource, PrivateChecks, privateIntake, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes (+57 more)

### Community 256 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 26 - "devnet-upgrade.test.ts"
Cohesion: 0.05
Nodes (69): Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch (+61 more)

### Community 268 - "never"
Cohesion: 0.33
Nodes (4): IgnoresTheStop, StaysPaused, abortOf(), never()

### Community 27 - "browser.test.ts"
Cohesion: 0.04
Nodes (77): Reachable, RestoreAttempt, PageBackup, pageBench, PageEvent, PageRestore, ProcessName, StatusBody (+69 more)

### Community 28 - "builder.test.ts"
Cohesion: 0.03
Nodes (48): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+40 more)

### Community 29 - "start-umbradb.ts"
Cohesion: 0.04
Nodes (78): Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork, UmbraDBOptions, UmbraDBReason (+70 more)

### Community 3 - "src/db/postgres.ts"
Cohesion: 0.02
Nodes (145): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, commandTarget, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget (+137 more)

### Community 30 - "declaration.ts"
Cohesion: 0.04
Nodes (71): TableDigest, TableDigestRow, UmbraConfig, BlockWriteHandle, ReadHandle, SchemaWriteHandle, cursorTable, CursorTableOptions (+63 more)

### Community 304 - "aborted"
Cohesion: 0.40
Nodes (3): DoesNotHold, EndsTheRun, aborted()

### Community 31 - "coreEntry"
Cohesion: 0.03
Nodes (82): coreEntry, LoadOptions, plainData, SignalJob, Row, commandBuild(), readCommandConfig(), buildCoreVersion() (+74 more)

### Community 32 - "range.ts"
Cohesion: 0.03
Nodes (86): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+78 more)

### Community 33 - "pause-fixtures.ts"
Cohesion: 0.04
Nodes (69): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+61 more)

### Community 34 - "LedgerPackage"
Cohesion: 0.05
Nodes (44): LedgerPackage, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, StagenetBlockJson, StagenetFixtureJson, stagenetReplay (+36 more)

### Community 35 - "adapter.ts"
Cohesion: 0.04
Nodes (67): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+59 more)

### Community 36 - "5. Runner"
Cohesion: 0.05
Nodes (78): Callback, CallbackFailure, ParallelPoint, PointArguments, PointRun, PointSchedule, SlowBlockCondition, CallEvent (+70 more)

### Community 37 - "Process"
Cohesion: 0.05
Nodes (26): ProcessAdmin, RetryCode, Heartbeat, HeartbeatOptions, TimerHandle, PauseHold, LibraryChecks, Process (+18 more)

### Community 38 - "spawnChild"
Cohesion: 0.03
Nodes (68): Child, ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, GateRun (+60 more)

### Community 39 - "transport-faults.test.ts"
Cohesion: 0.05
Nodes (55): Connected, CoreTransport, CoreTransportOptions, CoreLink, CoreSessionOptions, coreSessions, LinkConnection, LinkSession (+47 more)

### Community 4 - "tape/index.ts"
Cohesion: 0.03
Nodes (128): Failure, Variant, Failure, Variant, Link, TapeBuilderOptions, CompletenessRange, RecordingError (+120 more)

### Community 40 - "messages.ts"
Cohesion: 0.04
Nodes (54): InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal, Committed (+46 more)

### Community 41 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (62): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+54 more)

### Community 42 - "backup/backup.ts"
Cohesion: 0.06
Nodes (68): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+60 more)

### Community 43 - "validate.ts"
Cohesion: 0.05
Nodes (67): RevisionSettings, PlainObject, RedactableConfig, RedactionForms, redactor, SecretForm, TextPattern, CursorRule (+59 more)

### Community 44 - "public-database.ts"
Cohesion: 0.05
Nodes (43): PrivateLinkAddress, PrivateLinkConnect, PublicSide, PublicSideOptions, EndpointOptions, Received, TransportTls, HelloAck (+35 more)

### Community 45 - "channel-checks.test.ts"
Cohesion: 0.05
Nodes (53): Envelope, LinkTimers, MessagePortLike, controlledTimers, PeerEnd, PeerMessage, rawPeer, TestEnd (+45 more)

### Community 46 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (60): TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses() (+52 more)

### Community 47 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (66): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), [0.9.5] - 2026-07-25 — "Penumbra", Added, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94` (+58 more)

### Community 48 - "builds.ts"
Cohesion: 0.06
Nodes (61): LockstepCondition, PrivateProcess, PrivateRefusal, PrivateSeen, A114Observation, A116Observation, Pause, Q142Observation (+53 more)

### Community 49 - "FinalizedLoop"
Cohesion: 0.06
Nodes (16): Activity, FinalizedLoop, LoopObserver, Startup, FailingAfter, Controls, call(), cursorText() (+8 more)

### Community 5 - "client.test.ts"
Cohesion: 0.02
Nodes (98): NodeClientOptions, ConnectSocket, IngestOptions, HandSocket, HandSockets, Answer, FakeNode, Handler (+90 more)

### Community 52 - "runner/process.ts"
Cohesion: 0.04
Nodes (58): AdminSeams, AdminStarter, NodeWait, ConfigFinding, VerifyLedgerPackagesOptions, transportReaderFacts, HeadersArgument, SourceCondition (+50 more)

### Community 53 - "mounted-admin.test.ts"
Cohesion: 0.06
Nodes (54): Answered, gate, Expected, SubscriptionSeen, Client, Exchanged, MapiHooks, Mounted (+46 more)

### Community 54 - "process-admin.ts"
Cohesion: 0.06
Nodes (61): NetworkShown, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdminOptions, DigestRow, ModuleFacts (+53 more)

### Community 55 - "column-rules.ts"
Cohesion: 0.04
Nodes (69): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultPart (+61 more)

### Community 56 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (59): CoreContractStatesOptions, ContractStateRow, DefinedModule, CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine (+51 more)

### Community 57 - "core-block-parsed.ts"
Cohesion: 0.06
Nodes (58): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, MetadataVariant, RuntimeMetadataView, BlockParsedOptions, TransactionParser (+50 more)

### Community 58 - "resolve.ts"
Cohesion: 0.06
Nodes (59): ConfigFacts, CoreChainFacts, RestoreBase, CheckState, ConfigCheckOptions, CommandConfig, ProcessSide, HistoryInput (+51 more)

### Community 59 - "ref_node_crypto"
Cohesion: 0.07
Nodes (45): ManifestLine, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, V9Logs, LedgerPin, LedgerSelection, checkLedgerPackage() (+37 more)

### Community 6 - "module-tables.ts"
Cohesion: 0.02
Nodes (133): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+125 more)

### Community 60 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (40): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, JsonEncoded (+32 more)

### Community 61 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (48): ReadOpener, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec, Observed (+40 more)

### Community 62 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, keyOrder, Refusal, TableRule, TreeNode, DesignTable, becauseOf() (+24 more)

### Community 63 - "net.test.ts"
Cohesion: 0.07
Nodes (26): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortSocket (+18 more)

### Community 64 - "code"
Cohesion: 0.04
Nodes (52): RepositoryFile, canPin(), code(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS (+44 more)

### Community 65 - "core-block-commit.test.ts"
Cohesion: 0.06
Nodes (41): BlockRow, StandInOptions, Commit, Snapshot, checkParent(), commitBlock(), hex(), sameBytes() (+33 more)

### Community 66 - ".value"
Cohesion: 0.13
Nodes (28): ExtrinsicCall, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, TypeDef, ScaleError, ScaleReader (+20 more)

### Community 67 - "core-channels.ts"
Cohesion: 0.08
Nodes (20): ChannelEndpoint, EndpointEvents, PrivateLinkChannel, CoreChannels, CoreChannelSeams, CoreChannelsOptions, Queued, Session (+12 more)

### Community 68 - "core-ledger-state.ts"
Cohesion: 0.08
Nodes (44): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions, blockHeaderOf(), ledgerVersionOf(), applyBlock() (+36 more)

### Community 69 - "cbor.ts"
Cohesion: 0.09
Nodes (40): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+32 more)

### Community 7 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (143): CoreBlockItems, InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessObservation, StartVia, FaultedClose (+135 more)

### Community 70 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+40 more)

### Community 71 - "binding.test.ts"
Cohesion: 0.07
Nodes (40): startHashDecision, A165Options, a165Run, Attempt, A113Observation, A156Observation, Binding, Created (+32 more)

### Community 72 - "checkShape"
Cohesion: 0.07
Nodes (39): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+31 more)

### Community 73 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 76 - "networks.ts"
Cohesion: 0.06
Nodes (40): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+32 more)

### Community 79 - "process-context.test.ts"
Cohesion: 0.07
Nodes (29): MisuseListener, PublishRefusal, AcceptsDuplicates, Seen, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass (+21 more)

### Community 8 - "vitest"
Cohesion: 0.02
Nodes (95): ChainCheck, ChainCheckInput, Flaky, Served, Renamed, Finding, Lockfile, Manifest (+87 more)

### Community 80 - "browser/build.ts"
Cohesion: 0.07
Nodes (30): BrowserBuild, BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common() (+22 more)

### Community 83 - "version-checks.ts"
Cohesion: 0.12
Nodes (33): VersionedBlock, Boundary, CallRecord, CountingNode, Select, UpgradeCase, Walk, Answers (+25 more)

### Community 84 - "pglite-lock.ts"
Cohesion: 0.09
Nodes (30): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, acquirePgliteLock() (+22 more)

### Community 85 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 86 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (37): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+29 more)

### Community 87 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 89 - "validation.ts"
Cohesion: 0.06
Nodes (34): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+26 more)

### Community 9 - "api-server.test.ts"
Cohesion: 0.02
Nodes (116): ModuleApiServer, ModuleApiStart, StartedModuleApi, coreHeaders, ConnectionRules, ModuleApiHandlerOptions, moduleApiHandlers, ModuleApiLimits (+108 more)

### Community 90 - "core.ts"
Cohesion: 0.11
Nodes (28): BaselineLoad, Comparison, CommitOptions, PostgresRun, BenchEnv, ManualOpts, TinybenchOpts, Backend (+20 more)

### Community 94 - "core-ledger-state/sql.ts"
Cohesion: 0.11
Nodes (34): StateRow, StoredState, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks(), deleteGrey() (+26 more)

### Community 96 - "state-trees.test.ts"
Cohesion: 0.08
Nodes (30): ApplyInput, StateSummary, LedgerHeight, Ledger, NodeRoot, AdapterWorkerAnswer, AdapterWorkerRequest, LoadedState (+22 more)

### Community 97 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 98 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (12): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+4 more)

### Community 232 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 74 - "refused"
Cohesion: 0.07
Nodes (43): refused(), halted(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix (+35 more)

### Community 92 - "table"
Cohesion: 0.06
Nodes (35): table(), fakePackage(), regular(), system(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix (+27 more)

### Community 143 - "transportReader"
Cohesion: 0.10
Nodes (21): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, A paused loop on `/status`, A PGlite directory that does not exist (+13 more)

### Community 144 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 146 - ".slowBlockMs"
Cohesion: 0.11
Nodes (18): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+10 more)

### Community 150 - "mapping.test.ts"
Cohesion: 0.12
Nodes (11): mapValue(), parseJsonLossless(), oid(), identity(), RESULT_COLUMNS, RESULT_TYPES, RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug (+3 more)

### Community 164 - "log"
Cohesion: 0.15
Nodes (15): log(), 13. Contract data, 1. Library-mode guarantees, 3.1 Engine, 3.3 Entry points, 3. Engine, resolver, entry points, 7.1 Library-mode guarantees, 7. Guarantees and refusals (+7 more)

### Community 167 - "core-ledger-state.test.ts"
Cohesion: 0.14
Nodes (10): bindLedgerParser(), boundLedgerParser(), bindCoreLedgerState(), itemsOf(), applied(), bound(), query(), refusing() (+2 more)

### Community 169 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.14
Nodes (14): transportReaderRule(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout, 2. Architecture (+6 more)

### Community 173 - "Requirement: BK-1 Backup"
Cohesion: 0.13
Nodes (11): 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented, Evidence, Problem, Suggested fix, MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing (+3 more)

### Community 175 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (13): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+5 more)

### Community 179 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 190 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 191 - "core-tx-results/sql.ts"
Cohesion: 0.17
Nodes (9): heightPartitionsSql(), CORE_TX_RESULTS_MIGRATIONS, RESULTS_TABLE, HEIGHT_PARTITION_SIZE, PRECREATED_HEIGHT_PARTITIONS, 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem (+1 more)

### Community 197 - "openssl"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 203 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 211 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 229 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 237 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.29
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 249 - "selectLedgerVersion"
Cohesion: 0.52
Nodes (7): blockNamed(), checkPins(), hexOf(), isMnsvItem(), ledgerOfSpecVersion(), mnsvSpecVersion(), selectLedgerVersion()

### Community 269 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 305 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 318 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 50 - "history"
Cohesion: 0.04
Nodes (67): integer(), history(), revision(), n(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator (+59 more)

### Community 51 - ".put"
Cohesion: 0.03
Nodes (64): T(), input(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed (+56 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 93 - "version"
Cohesion: 0.06
Nodes (35): side(), migrations(), version(), 1. Overview, 2.4 Serving it, Appendix A. Reference, Requirement: MD-1 A module is a declaration the host imports, Scenario: A declaration with an unknown point name (+27 more)

### Community 95 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 105 - "package.json"
Cohesion: 0.06
Nodes (33): bin, umbradb, bugs, url, description, optional, engines, node (+25 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+21 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 131 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 134 - "README.md"
Cohesion: 0.10
Nodes (17): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:, Choosing a database (+9 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 138 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 142 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.09
Nodes (17): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+9 more)

### Community 147 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 154 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (19): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+11 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 159 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 161 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 165 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 166 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+6 more)

### Community 178 - "UmbraDB"
Cohesion: 0.13
Nodes (15): Backup and restore, Check and run, Create a project, Example: loading `stats-module`, Install UmbraDB, Private processes, briefly, Project status, development and links, Quick start (browser) (+7 more)

### Community 183 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 184 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 185 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 192 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 193 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 195 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 196 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 198 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 199 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 2. `set`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 201 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 202 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 204 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 205 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 206 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 210 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 212 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 213 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 214 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 215 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 216 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-4 Every field is data, operational or secret, Scenario: A function in the configuration, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: A user module from the configuration file, Scenario: Two `core` revisions with different databases (+1 more)

### Community 217 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 218 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 219 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 220 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 221 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 223 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 224 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 225 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 228 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 230 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 231 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 233 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 234 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 236 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 238 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 239 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 240 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 241 - "Requirement: PP-4 The process transport"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, Spec delta — `private-processes` capability

### Community 242 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 243 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 244 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 245 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 246 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 248 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 251 - "Changelog"
Cohesion: 0.33
Nodes (5): [0.10.0] - 2026-10-27, Added, Breaking changes, Changelog, [Unreleased]

### Community 252 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 253 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 254 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 255 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 257 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 258 - "Backups"
Cohesion: 0.33
Nodes (6): A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds, Writing a backup

### Community 259 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 260 - "Proposal — Sprint 4: Watermarks"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes, Why

### Community 261 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 262 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 263 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 264 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 265 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 266 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 267 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 270 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 271 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 272 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 273 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 274 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 275 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 276 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 277 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 278 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 279 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 280 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 281 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 282 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 283 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 284 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 285 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 286 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 287 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 288 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 289 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 290 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 291 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 292 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 293 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 294 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 295 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 296 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 297 - "00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail"
Cohesion: 0.40
Nodes (4): 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix

### Community 298 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 299 - "00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered"
Cohesion: 0.40
Nodes (4): 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered, Evidence, Problem, Suggested fix

### Community 300 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 301 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 302 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.40
Nodes (4): 0. Specification freeze, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 303 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 307 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 308 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 309 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 310 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 311 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 312 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 313 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 314 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 75 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 91 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-8949`, `RFC-8949`, `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4031 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ModuleDeclaration`, `loop.ts`, `admin-harness.ts`, `src/db/postgres.ts`, `tape/index.ts`, `client.test.ts`, `module-tables.ts`, `InMemoryBlockSource`, `api-server.test.ts`, `loop-stop-harness.ts`, `ledger/types.ts`, `.from`, `backup-fixtures.ts`, `ingest-harness.ts`, `BlockRef`, `UmbraError`, `private/backends.ts`, `adapter-fixtures.ts`, `entries.ts`, `db/api.ts`, `config/history.ts`, `database-parts.ts`, `NodeClient`, `chain-process.test.ts`, `core-private-source.test.ts`, `devnet-upgrade.test.ts`, `browser.test.ts`, `builder.test.ts`, `start-umbradb.ts`, `declaration.ts`, `coreEntry`, `range.ts`, `pause-fixtures.ts`, `LedgerPackage`, `adapter.ts`, `5. Runner`, `Process`, `spawnChild`, `transport-faults.test.ts`, `messages.ts`, `contract-modules.test.ts`, `backup/backup.ts`, `validate.ts`, `public-database.ts`, `channel-checks.test.ts`, `ledger/ledger-tasks.test.ts`, `builds.ts`, `runner/process.ts`, `mounted-admin.test.ts`, `process-admin.ts`, `contract-data-checks.ts`, `core-block-parsed.ts`, `resolve.ts`, `ref_node_crypto`, `interfaces/transaction-history-storage.ts`, `slow-block-harness.ts`, `column-rules.test.ts`, `net.test.ts`, `code`, `core-block-commit.test.ts`, `core-ledger-state.ts`, `binding.test.ts`, `retirement.test.ts`, `networks.ts`, `process-context.test.ts`, `browser/build.ts`, `version-checks.ts`, `pglite-lock.ts`, `cold-boot-recovery.integration.test.ts`, `cbor.property.test.ts`, `test/postgres/setup.ts`, `validation.ts`, `core.ts`, `core-ledger-state/sql.ts`, `state-trees.test.ts`, `boundary.test.ts`, `release-version.ts`, `package.json`, `shims.test.ts`, `code-registry.ts`, `documents.ts`, `pg-tx-history-adapter.ts`, `LoopPauses`, `read-gate.ts`, `containers.test.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `node-bridge.ts`, `surface.test.ts`, `worker-threads.test.ts`, `changes.property.test.ts`, `example-checks.ts`, `ledger-sweep.test.ts`, `digest.test.ts`, `mapping.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `excluded-not-exported.test.ts`, `resolver-boundary.ts`, `text.test.ts`, `core-ledger-state.test.ts`, `process-access.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `read-height.property.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `ws-mutual-tls.test.ts`, `core-block-fetch.test.ts`, `component-table.test.ts`, `twox.ts`, `history.property.test.ts`, `pglite.test.ts`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 19 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ModuleDeclaration` be split into smaller, more focused modules?**
  _Cohesion score 0.019472626116227968 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `ModuleDeclaration`, `loop.ts`, `admin-harness.ts`, `src/db/postgres.ts`, `tape/index.ts`, `client.test.ts`, `module-tables.ts`, `InMemoryBlockSource`, `vitest`, `api-server.test.ts`, `changes.property.test.ts`, `loop-stop-harness.ts`, `ledger/metadata.ts`, `backup-fixtures.ts`, `ingest-harness.ts`, `BlockRef`, `ledger/types.ts`, `private/backends.ts`, `adapter-fixtures.ts`, `entries.ts`, `db/api.ts`, `config/history.ts`, `database-parts.ts`, `NodeClient`, `chain-process.test.ts`, `core-private-source.test.ts`, `mapping.test.ts`, `start-umbradb.ts`, `declaration.ts`, `coreEntry`, `options.ts`, `pause-fixtures.ts`, `range.ts`, `Process`, `transport-faults.test.ts`, `messages.ts`, `contract-modules.test.ts`, `backup/backup.ts`, `statementsOf`, `public-database.ts`, `validate.ts`, `core-ledger-state.test.ts`, `channel-checks.test.ts`, `aborted`, `builds.ts`, `FinalizedLoop`, `runner/process.ts`, `mounted-admin.test.ts`, `web-lock.ts`, `process-admin.ts`, `resolve.ts`, `ref_node_crypto`, `config/plain-data.ts`, `slow-block-harness.ts`, `core-block-commit.test.ts`, `core-ledger-state.ts`, `cbor.ts`, `graph.ts`, `binding.test.ts`, `checkShape`, `process-context.test.ts`, `browser/src/config/load.ts`, `version-checks.ts`, `pglite-lock.ts`, `validation.ts`, `shims.test.ts`, `mapping.ts`, `selectLedgerVersion`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `loop.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.019346275095404014 - nodes in this community are weakly interconnected._