# Graph Report - UmbraDB

## Corpus Check
- 1111 files · ~1,550,642 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11580 nodes · 35117 edges · 357 communities (322 shown, 35 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2801 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `051e3197dbdb03f9` (1111 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- admin-harness.ts
- Database
- column-rules.ts
- redact.ts
- transaction-history-storage.property.test.ts
- core-ledger-state/sql.ts
- Design — Sprint 1: project setup + TemporalKV
- release-version.ts
- adapter-fixtures.ts
- validation.ts
- browser.test.ts
- core.ts
- browser/build.ts
- graph.test.ts
- checks.test.ts
- core-block-commit.test.ts
- postgres/transaction-history-storage.ts
- code-registry.ts
- declaration.ts
- test/postgres/setup.ts
- pg-tx-history-adapter.ts
- node-fields-harness.ts
- documents.ts
- mapping.ts
- runner/process.ts
- Lockstep
- read-gate.ts
- crash.test.ts
- interfaces/transaction-history-storage.ts
- typescript
- ref_node_events
- cbor.ts
- sigterm.test.ts
- restore-private.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- node-bridge.ts
- Buffer
- core-contract-states.ts
- process.test.ts
- package-startup-checks.ts
- worker-host.test.ts
- lockstep-refusals.test.ts
- HeightRun
- example-checks.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- checkParent
- tape/index.ts
- block-fetch-decode.test.ts
- ledger-sweep.test.ts
- childRefKeys
- chrome.ts
- key-handling-checks.ts
- PortSocket
- db/backends.ts
- run.test.ts
- text.test.ts
- FakeNode
- resolver-boundary.ts
- ref_node_fs
- LoopPauses
- browser-harness.ts
- statementsOf
- ws-mutual-tls.test.ts
- web-lock.ts
- ModuleDeclaration
- source-scan.ts
- worker-threads.test.ts
- midnight-env — reproducible PREPROD dev environment
- UmbraError
- loop.test.ts
- history.property.test.ts
- component-table.test.ts
- worker-threads-worker.ts
- Worker
- stats-module.ts
- ledger-tapes.ts
- .send
- host.ts
- Heartbeat
- sweepStep
- ledger/plain-data.ts
- sha256
- client.test.ts
- browser/src/config/load.ts
- adapter.ts
- HeldHeight
- ProcessItems
- range.test.ts
- vendored-ledger-files.test.ts
- TapeNode
- mutation-evidence.d.mts
- AsyncLocalStorage
- node-format.ts
- pageBench
- order.property.test.ts
- api-server.test.ts
- core-chain-events.ts
- range.ts
- HeightActivity
- listenerProblems
- certificates.ts
- ledger/types.ts
- BYTE_ORDER
- https.ts
- NodeFS
- config/history.ts
- LedgerPackage
- ref_node_url
- contract-data-checks.ts
- writer-lock-checks.ts
- version-checks.ts
- fetch-fixtures.ts
- NodeBlockSource
- .read
- PgTransactionHistoryStorage
- halts.test.ts
- FinalizedLoop
- private/backends.ts
- BlockRef
- ledger/ledger-tasks.test.ts
- opt-out.test.ts
- .value
- ingest-harness.ts
- .from
- slow-block-harness.ts
- NodeClient
- intake.test.ts
- config-check.ts
- core-block-parsed.ts
- networks.ts
- Process
- validate.ts
- process-backends.ts
- backup/backup.ts
- process-worker.ts
- process-build.ts
- containers.test.ts
- cli/command.ts
- src/ledger/identity.ts
- chain-process.test.ts
- client.ts
- post-block-update-checks.ts
- db/errors.ts
- builds.ts
- ref_node_timers
- zero-timeouts-checks.ts
- file-mode.test.ts
- cold-boot-recovery.integration.test.ts
- graph.ts
- checkShape
- retirement.test.ts
- core-ledger-state.ts
- transform-checks.ts
- ReadHandle
- binding.test.ts
- loop.ts
- InMemoryBlockSource
- database-parts.ts
- pause-fixtures.ts
- real-tapes.ts
- process-context.test.ts
- core-transport.ts
- page.ts
- private/lockstep-wait.test.ts
- net.test.ts
- recovery.test.ts
- pack-install.mjs
- ledger-storage.test.ts
- paused-harness.ts
- Proposal — Sprint 3: CheckpointStore
- ADDED Requirements
- graph.py
- T
- .slowBlockMs
- conformance-gate.mjs
- transportReader
- boundary.test.ts
- Design — START-UMBRADB: UmbraDB as a library
- Design — v1.0.0 API Surface & Release Contract
- mapping.test.ts
- core-ledger-state.test.ts
- vitest
- twox.ts
- Design — v1.1.0: Quint model checking
- Boundaries, threats and controls
- UmbraDB third-party component inventory (SBOM)
- path.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- .put
- orphan-watcher.mjs
- read-only-checks.ts
- fresh-instance.mjs
- crash-worker.ts
- history
- version
- code
- refused
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- package.json
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- ADDED Requirements
- devDependencies
- Backups
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-16 Chain-data reads name their view and height
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- README.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
- ROADMAP.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- ADDED Requirements
- Requirement: AE-5 `/status` and `/config` contents
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- Repository agent policy
- scoped-review-manifest
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- UmbraDB in a browser
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- Requirement: BK-1 Backup
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Requirement: PP-4 The process transport
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
- UmbraDB node architecture
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
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
- 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time
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
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Test wallets
- Spec — capability `formal-completion`
- renovate.json
- start-stack.sh
- peerDependenciesMeta
- repository
- graphify/run.sh
- build-in-container.sh
- stats-module/run.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bugs
- engines
- peerDependencies
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
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 376 edges
2. `UmbraError` - 319 edges
3. `ModuleDeclaration` - 182 edges
4. `FinalizedLoop` - 133 edges
5. `InMemoryBlockSource` - 124 edges
6. `NodeClient` - 113 edges
7. `Database` - 101 edges
8. `BlockRef` - 98 edges
9. `ReadHandle` - 91 edges
10. `NodeBlockSource` - 81 edges

## Surprising Connections (you probably didn't know these)
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Evidence` --references--> `ManualTimers`  [INFERRED]
  docs/issues/00016-heartbeat-above-timer-limit.md → test/node/manual-timers.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (357 total, 35 thin omitted)

### Community 0 - "admin-harness.ts"
Cohesion: 0.02
Nodes (216): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+208 more)

### Community 1 - "Database"
Cohesion: 0.02
Nodes (167): Bound, BlockWriteHandle, Database, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable (+159 more)

### Community 10 - "column-rules.ts"
Cohesion: 0.02
Nodes (104): DumpInput, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+96 more)

### Community 101 - "redact.ts"
Cohesion: 0.09
Nodes (31): RedactionForms, SecretForm, TextPattern, transportReaderFacts, Needs, findings(), databaseText(), isMemoryDatabase() (+23 more)

### Community 103 - "transaction-history-storage.property.test.ts"
Cohesion: 0.08
Nodes (23): EntryContent, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, Command, ReplayableStorage, abortErrorLike(), capitalize(), applyCommand() (+15 more)

### Community 104 - "core-ledger-state/sql.ts"
Cohesion: 0.11
Nodes (34): StateRow, StoredState, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks(), deleteGrey() (+26 more)

### Community 106 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.05
Nodes (36): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+28 more)

### Community 109 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 11 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (97): ApplyInput, ApplyOutput, StateSummary, StoredNode, DeployTx, LedgerHeight, Upstream, contractFixture (+89 more)

### Community 110 - "validation.ts"
Cohesion: 0.07
Nodes (30): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, validateWith(), failures() (+22 more)

### Community 111 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 112 - "core.ts"
Cohesion: 0.12
Nodes (25): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+17 more)

### Community 113 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 114 - "graph.test.ts"
Cohesion: 0.10
Nodes (30): GraphInput, PastFaultCase, RefusalCase, reader(), backboneWithout(), consumer(), graphInput(), range() (+22 more)

### Community 115 - "checks.test.ts"
Cohesion: 0.08
Nodes (24): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, integer(), checkFunctionsSql() (+16 more)

### Community 117 - "core-block-commit.test.ts"
Cohesion: 0.08
Nodes (25): BlockRow, StandInOptions, Commit, blockFetchStandIn(), standInHeader(), standInItems(), a145Stored(), blockAt() (+17 more)

### Community 118 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (20): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+12 more)

### Community 119 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 12 - "declaration.ts"
Cohesion: 0.03
Nodes (108): CoreVersion, DatabasePartsInput, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+100 more)

### Community 122 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 123 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 124 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (24): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Run() (+16 more)

### Community 125 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 126 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 13 - "runner/process.ts"
Cohesion: 0.03
Nodes (78): ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ChainIdentity, ConfigRow, TransportReader, ConfigHashRow (+70 more)

### Community 131 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 132 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 133 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 134 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 136 - "typescript"
Cohesion: 0.11
Nodes (17): TypeCheckFinding, TypeCheckResult, Finding, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile() (+9 more)

### Community 139 - "ref_node_events"
Cohesion: 0.11
Nodes (18): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+10 more)

### Community 14 - "cbor.ts"
Cohesion: 0.03
Nodes (107): TableDigest, TableDigestRow, CapturedTable, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode (+99 more)

### Community 140 - "sigterm.test.ts"
Cohesion: 0.11
Nodes (21): Job, WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent, report() (+13 more)

### Community 141 - "restore-private.ts"
Cohesion: 0.16
Nodes (20): RestoreOutcome, FileProcess, privateBackup, PublicSetting, PublicSideOptions, heightsFrom(), pmModule(), privateHashOf() (+12 more)

### Community 142 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 143 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 144 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 147 - "node-bridge.ts"
Cohesion: 0.12
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 148 - "Buffer"
Cohesion: 0.11
Nodes (17): WebSocket, Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64() (+9 more)

### Community 149 - "core-contract-states.ts"
Cohesion: 0.11
Nodes (19): CoreContractStatesOptions, ContractStateRow, contractStatesOf(), coreContractStates(), hex(), writeStateRows(), insertStateRows(), heightPartitionsSql() (+11 more)

### Community 15 - "process.test.ts"
Cohesion: 0.03
Nodes (96): CheckStep, ConfigCheckReport, ConfiguredDatabase, coreEntry, HistoryRule, plainData, AppliedMigration, SourceKind (+88 more)

### Community 150 - "package-startup-checks.ts"
Cohesion: 0.13
Nodes (17): ChangedFile, GenesisFixture, installationCopy, StartPackageProcess, endsOnEveryRefusal(), expectProcessChecks(), expectWorkerChecks(), genesisOf() (+9 more)

### Community 152 - "worker-host.test.ts"
Cohesion: 0.12
Nodes (20): SlowStep, TestLoaderData, errorOf(), beat(), countDeserializations(), hexOf(), loadLedger(), probe() (+12 more)

### Community 153 - "lockstep-refusals.test.ts"
Cohesion: 0.17
Nodes (21): LockstepCondition, PublicSide, PublicCore, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run() (+13 more)

### Community 154 - "HeightRun"
Cohesion: 0.09
Nodes (10): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, WaitsInTransaction (+2 more)

### Community 155 - "example-checks.ts"
Cohesion: 0.16
Nodes (17): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+9 more)

### Community 157 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.09
Nodes (20): BackupWritten, 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system (+12 more)

### Community 159 - "checkParent"
Cohesion: 0.11
Nodes (20): AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock(), ledgerVersionOf(), sameBytes(), writeBlockRow(), writeHashRow() (+12 more)

### Community 16 - "tape/index.ts"
Cohesion: 0.04
Nodes (86): Recorded, Failure, Variant, Link, RecordingProblem, TapeError, TapeProblem, TransformProblem (+78 more)

### Community 161 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), concatBytes(), encodeCompact() (+9 more)

### Community 162 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (12): SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints(), compare() (+4 more)

### Community 164 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 165 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 166 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 167 - "PortSocket"
Cohesion: 0.17
Nodes (8): PortSocket, pair(), 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix, Requirement: RN-15 Module APIs are registered once, at startup, Scenario: Two modules claim one path

### Community 17 - "db/backends.ts"
Cohesion: 0.03
Nodes (76): PostgresOptions, CheckTarget, CliBackend, Snapshot, Settings, LoadOutcome, OutsideRead, Traced (+68 more)

### Community 172 - "run.test.ts"
Cohesion: 0.13
Nodes (12): RunningCommand, statsConfig, write(), exitWithin(), headAt(), reachHead(), statsRows(), until() (+4 more)

### Community 173 - "text.test.ts"
Cohesion: 0.16
Nodes (9): BackupText, createReadStream(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir (+1 more)

### Community 178 - "resolver-boundary.ts"
Cohesion: 0.18
Nodes (16): Boundary, Crossing, Guard, boundaryOf(), boundarySources(), guardedSymbols(), hostWith(), inRepository() (+8 more)

### Community 18 - "ref_node_fs"
Cohesion: 0.05
Nodes (78): BackupBackend, BackupDatabase, killedRestore, TickerConfig, WORKER, SignalEvent, WorkerSignals, cliProject (+70 more)

### Community 182 - "LoopPauses"
Cohesion: 0.18
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 183 - "browser-harness.ts"
Cohesion: 0.29
Nodes (15): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+7 more)

### Community 184 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 186 - "ws-mutual-tls.test.ts"
Cohesion: 0.19
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 189 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 19 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (98): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+90 more)

### Community 194 - "source-scan.ts"
Cohesion: 0.29
Nodes (13): ModuleReference, boundaryViolations(), codeFingerprints(), declaredNames(), eachNode(), lineOf(), literalText(), moduleReferences() (+5 more)

### Community 196 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 198 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 2 - "UmbraError"
Cohesion: 0.03
Nodes (94): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport (+86 more)

### Community 20 - "loop.test.ts"
Cohesion: 0.04
Nodes (85): LockstepWait, LoopEnd, SlowBlockEvent, Contexts, Faults, LostCommit, Seen, AtGate (+77 more)

### Community 202 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 203 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 205 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 209 - "stats-module.ts"
Cohesion: 0.32
Nodes (10): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+2 more)

### Community 21 - "ledger-tapes.ts"
Cohesion: 0.05
Nodes (94): itemsSeen, BlockSpec, Json, Scenario, transactionSpec, eventsRuntime, Field, PalletMetadata (+86 more)

### Community 22 - "host.ts"
Cohesion: 0.04
Nodes (70): LoadLedger, LedgerStateItem, RetainedState, LedgerName, ChainOutcome, LedgerPackageOptions, NodeBatch, ParsedTransaction (+62 more)

### Community 221 - "Heartbeat"
Cohesion: 0.31
Nodes (5): Heartbeat, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 222 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 223 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 224 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 23 - "client.test.ts"
Cohesion: 0.04
Nodes (60): NodeClientOptions, NodeRetry, ConnectSocket, NodeSocketEvents, HandSocket, HandSockets, Answer, Handler (+52 more)

### Community 236 - "browser/src/config/load.ts"
Cohesion: 0.31
Nodes (8): LoadedConfig, LoadOptions, configModuleUrl(), configPath(), loadConfig(), noFile(), DEFAULT_CONFIG_FILE, MODULES_EXPORT

### Community 24 - "adapter.ts"
Cohesion: 0.03
Nodes (72): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+64 more)

### Community 242 - "HeldHeight"
Cohesion: 0.28
Nodes (5): CommitOutcome, HeldHeight, Outcomes, AlwaysLost, DropsHeld

### Community 25 - "range.test.ts"
Cohesion: 0.04
Nodes (52): ConnectionFrames, Failure, Variant, WrongRecording, Frame, Script, ScriptedNode, ScriptedRequest (+44 more)

### Community 251 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 26 - "TapeNode"
Cohesion: 0.04
Nodes (35): Outage, Metadata, Step, RawClient, Failure, Variant, TapeClock, TapeNode (+27 more)

### Community 262 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 28 - "node-format.ts"
Cohesion: 0.06
Nodes (56): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+48 more)

### Community 283 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 29 - "order.property.test.ts"
Cohesion: 0.04
Nodes (68): PointName, PointRun, HeightFailure, Misuse, SlowBlockCondition, CrashOptions, CallEvent, Recorder (+60 more)

### Community 3 - "api-server.test.ts"
Cohesion: 0.02
Nodes (110): ModuleApiServer, ModuleApiStart, StartedModuleApi, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart (+102 more)

### Community 30 - "core-chain-events.ts"
Cohesion: 0.04
Nodes (67): BrowserConfiguration, ingest, TasksRun, ProcessBackend, databaseOf(), blockParsedItemOf(), boundEventSource(), chainEventsItemOf() (+59 more)

### Community 31 - "range.ts"
Cohesion: 0.05
Nodes (64): Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, TapeBuilder, TapeBuilderOptions, Arguments, Command (+56 more)

### Community 311 - "HeightActivity"
Cohesion: 0.60
Nodes (3): HeightActivity, NeverClears, NeverClears

### Community 315 - "certificates.ts"
Cohesion: 0.40
Nodes (3): Pem, TestCertificates, makeCertificates()

### Community 32 - "ledger/types.ts"
Cohesion: 0.05
Nodes (65): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+57 more)

### Community 33 - "config/history.ts"
Cohesion: 0.04
Nodes (65): HistoryCode, HistoryContext, ProvidesRow, Span, PlainArray, PlainDataNode, PlainDataRule, Walk (+57 more)

### Community 35 - "LedgerPackage"
Cohesion: 0.06
Nodes (35): LedgerPackage, LedgerTask, LedgerTaskBlock, StateHandle, EngineOptions, LedgerEngine, LedgerTaskFailed, Settled (+27 more)

### Community 36 - "ref_node_url"
Cohesion: 0.04
Nodes (58): Served, ParentJob, Kill, Orphaned, SourceFile, LockResult, GateRun, Pids (+50 more)

### Community 37 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (65): contractScenario, ContractScenarioOptions, LogLine, Program, Ran, ScenarioTx, handoff, HandoffAt (+57 more)

### Community 38 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (58): CreatedDirectory, Held, PgliteLockUse, WriterProcess, Job, WorkerEvent, PauseReport, acquirePgliteLock() (+50 more)

### Community 39 - "version-checks.ts"
Cohesion: 0.07
Nodes (48): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, Boundary, CallRecord, CountingNode, MetadataSelector (+40 more)

### Community 4 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (122): ProcessCondition, EventSpec, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded (+114 more)

### Community 40 - "NodeBlockSource"
Cohesion: 0.06
Nodes (27): HeadWait, NodeBlockSource, HeadSubscriber, NodeCallOptions, NodeHeader, QueueRunner, RecordingClient, NoWindow (+19 more)

### Community 41 - ".read"
Cohesion: 0.05
Nodes (64): Op, States, TableName, identityRow(), captured(), captureFunction(), hex(), moduleM() (+56 more)

### Community 42 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (57): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), [0.9.5] - 2026-07-25 — "Penumbra", Added, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface) (+49 more)

### Community 43 - "halts.test.ts"
Cohesion: 0.05
Nodes (54): ChainDataView, ProcessingEnd, Observation, Outcome, NoRedelivery, RunObservation, A47Observation, CommitsTheBoundary (+46 more)

### Community 44 - "FinalizedLoop"
Cohesion: 0.07
Nodes (14): Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, WaitingInRead, SilentHalt, FailingAfter (+6 more)

### Community 46 - "private/backends.ts"
Cohesion: 0.07
Nodes (41): Message, PrivateBackend, Ended, rawClient, Escape, Refused, mutualTlsOptions(), canWriteFindings() (+33 more)

### Community 47 - "BlockRef"
Cohesion: 0.04
Nodes (31): BlockEventSource, CoreBlockItems, BlockLedgerSource, RuntimeMetadataView, NodeSourceOptions, Prefetch, QueuedBlock, LedgerBinding (+23 more)

### Community 49 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (48): CallArgsItem, CallArguments, V9Raw, bindLedgerTasks(), boundHost(), frozen(), hasLedgerTasks(), resultsOf() (+40 more)

### Community 5 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (99): CaptureColumn, CaptureState, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+91 more)

### Community 50 - ".value"
Cohesion: 0.09
Nodes (38): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef (+30 more)

### Community 51 - "ingest-harness.ts"
Cohesion: 0.07
Nodes (52): Manifest, Restored, RestoreInput, BlockHeader, CrashEvent, CrashJob, IngestOptions, SourceClass (+44 more)

### Community 52 - ".from"
Cohesion: 0.06
Nodes (57): recordedGenesis, Side, FoundTape, bytesOfHex(), hexOf(), hex(), hex(), hex() (+49 more)

### Community 53 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (52): BlockItemSource, LoopInput, ReadOpener, SlowWindow, ProbeRecord, StatusBody, Times, Wait (+44 more)

### Community 54 - "NodeClient"
Cohesion: 0.07
Nodes (29): CoreChainBinding, Connection, NodeClient, Pending, Waiter, connectionFailure, NodeMethod, NodeSocket (+21 more)

### Community 55 - "intake.test.ts"
Cohesion: 0.07
Nodes (45): PrivateSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation, A116Observation, TestLink (+37 more)

### Community 56 - "config-check.ts"
Cohesion: 0.05
Nodes (46): CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, ReadDatabaseOptions, ConfigFinding (+38 more)

### Community 57 - "core-block-parsed.ts"
Cohesion: 0.07
Nodes (54): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, MetadataVariant, BlockParsed, BlockParsedOptions, BlockTransaction (+46 more)

### Community 58 - "networks.ts"
Cohesion: 0.05
Nodes (54): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, ConfiguredLedgerTable (+46 more)

### Community 59 - "Process"
Cohesion: 0.08
Nodes (6): CoreTransport, BlockSource, PauseHold, Process, openedCursorHeight(), messageOf()

### Community 6 - "validate.ts"
Cohesion: 0.02
Nodes (122): LedgerTableSettings, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, HistoryFinding, LoadOptions, ConfigRule, CursorRule (+114 more)

### Community 60 - "process-backends.ts"
Cohesion: 0.10
Nodes (46): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, startLedgerWorker(), a168Problems(), refusalHalt() (+38 more)

### Community 61 - "backup/backup.ts"
Cohesion: 0.08
Nodes (48): BackupInput, BackupTarget, BackupFacts, ManifestMigration, ManifestTool, PgliteDump, SnapshotSeams, Environment (+40 more)

### Community 62 - "process-worker.ts"
Cohesion: 0.06
Nodes (41): BrowserRun, PrivateInstance, ProcessConfiguration, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, crossedError, openedProcess (+33 more)

### Community 63 - "process-build.ts"
Cohesion: 0.10
Nodes (42): EngineBuild, ProcessObservation, CoreSeen, testBuild, TestProcessInput, A42Observation, Seen, Phase (+34 more)

### Community 64 - "containers.test.ts"
Cohesion: 0.06
Nodes (38): BenchEnv, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, TlsPostgres, RepositoryFile, guardContainers() (+30 more)

### Community 65 - "cli/command.ts"
Cohesion: 0.07
Nodes (41): BackupSeams, RestoreChain, RestoreSeams, BackupOutcome, CommandHandler, CommandIo, MainProcess, commandTarget (+33 more)

### Community 66 - "src/ledger/identity.ts"
Cohesion: 0.08
Nodes (38): AdapterSpec, ManifestLine, VerifyLedgerPackagesOptions, LedgerRelease, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, V9Logs (+30 more)

### Community 67 - "chain-process.test.ts"
Cohesion: 0.06
Nodes (36): ProcessHandle, Refusal, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Flaky (+28 more)

### Community 68 - "client.ts"
Cohesion: 0.11
Nodes (38): State, Subscription, NodeBlock, NodeRuntimeVersion, NodeCallMethod, SubscribeMethod, Final, finalizedHeight() (+30 more)

### Community 69 - "post-block-update-checks.ts"
Cohesion: 0.08
Nodes (41): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+33 more)

### Community 7 - "db/errors.ts"
Cohesion: 0.03
Nodes (77): PostgresConnection, PostgresOptions, SslMode, ReadOnlyDatabase, ReadOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning (+69 more)

### Community 70 - "builds.ts"
Cohesion: 0.07
Nodes (41): EngineInput, PrivateProcess, PrivateRefusal, PublicCoreOptions, A162Options, a162Run, HeaderSeen, Pause (+33 more)

### Community 71 - "ref_node_timers"
Cohesion: 0.07
Nodes (32): SignalTarget, LoopStopScenario, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StopBy (+24 more)

### Community 72 - "zero-timeouts-checks.ts"
Cohesion: 0.08
Nodes (33): Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead(), engine() (+25 more)

### Community 73 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (35): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+27 more)

### Community 74 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (31): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+23 more)

### Community 75 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 76 - "checkShape"
Cohesion: 0.07
Nodes (39): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+31 more)

### Community 77 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 78 - "core-ledger-state.ts"
Cohesion: 0.09
Nodes (40): retainedStates, CoreRevision, applyBlock(), boundLedger(), chainOutcomesOf(), computeBlock(), contractsOf(), hex() (+32 more)

### Community 79 - "transform-checks.ts"
Cohesion: 0.11
Nodes (28): TransformError, baseRecords(), expectedText(), expectVariantOutput(), forkRecords(), changedLines(), checkTape(), notificationRange() (+20 more)

### Community 8 - "ReadHandle"
Cohesion: 0.03
Nodes (89): ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration (+81 more)

### Community 80 - "binding.test.ts"
Cohesion: 0.08
Nodes (40): PrivateIntakeOptions, startHashDecision, A165Options, a165Run, Attempt, A113Observation, A156Observation, Binding (+32 more)

### Community 81 - "loop.ts"
Cohesion: 0.11
Nodes (35): HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments, PointSchedule (+27 more)

### Community 82 - "InMemoryBlockSource"
Cohesion: 0.06
Nodes (27): InMemoryBlockSource, InMemoryItems, Wait, Failing, Flaky, RestoreJob, SignalJob, Broken (+19 more)

### Community 83 - "database-parts.ts"
Cohesion: 0.06
Nodes (27): DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, PrivateConfig, SessionSeen, TestDatabase, A155Observation (+19 more)

### Community 84 - "pause-fixtures.ts"
Cohesion: 0.08
Nodes (32): BackupOnSignal, LoopClass, Pausable, PausableConfig, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop (+24 more)

### Community 85 - "real-tapes.ts"
Cohesion: 0.08
Nodes (35): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+27 more)

### Community 87 - "process-context.test.ts"
Cohesion: 0.08
Nodes (31): EntryRange, ResolvedGraph, StartedModuleApi, MisuseListener, PublishRefusal, RunnerBackend, AllowsOutside, AllowsTwice (+23 more)

### Community 9 - "core-transport.ts"
Cohesion: 0.03
Nodes (91): PublicSide, Session, TransportLimits, Committed, Hello, HelloAck, JsonValue, MessageFault (+83 more)

### Community 90 - "page.ts"
Cohesion: 0.06
Nodes (33): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, Scope, CallMethod, FromProcessWorker (+25 more)

### Community 92 - "private/lockstep-wait.test.ts"
Cohesion: 0.08
Nodes (21): Report, ExpectedWait, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, a117Problems(), firstWait() (+13 more)

### Community 93 - "net.test.ts"
Cohesion: 0.08
Nodes (20): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade (+12 more)

### Community 94 - "recovery.test.ts"
Cohesion: 0.08
Nodes (29): ProcessStatus, Q142Observation, Armed, CommitArm, CommitFault, CommitProxy, Pair, A43Observation (+21 more)

### Community 97 - "pack-install.mjs"
Cohesion: 0.09
Nodes (35): Surface, SmokeFailure, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12() (+27 more)

### Community 98 - "ledger-storage.test.ts"
Cohesion: 0.10
Nodes (32): SeenLoad, RestartEvent, RestartJob, retentionSeen, LedgerTx, Reader, retainedStatesOf(), a100Problems() (+24 more)

### Community 99 - "paused-harness.ts"
Cohesion: 0.11
Nodes (32): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, a176Project() (+24 more)

### Community 248 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 100 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): 5. WalletState envelope, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll (+30 more)

### Community 105 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 120 - "T"
Cohesion: 0.07
Nodes (29): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Scenario: Version and timestamp addressing agree, 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get` (+21 more)

### Community 127 - ".slowBlockMs"
Cohesion: 0.08
Nodes (25): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+17 more)

### Community 130 - "conformance-gate.mjs"
Cohesion: 0.07
Nodes (22): gateAdapters(), tallyMutants(), check, checker, deadlineMs, env, forwarded, killGraceMs (+14 more)

### Community 137 - "transportReader"
Cohesion: 0.08
Nodes (25): text(), transportReader(), transportReaderRule(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 10. Requirement coverage (+17 more)

### Community 146 - "boundary.test.ts"
Cohesion: 0.14
Nodes (21): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+13 more)

### Community 156 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.10
Nodes (18): 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout, 2. Architecture, 3.1 Engine (+10 more)

### Community 163 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.10
Nodes (19): up(), name, 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.1 The barrel: `src/index.ts`, 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG (+11 more)

### Community 175 - "mapping.test.ts"
Cohesion: 0.14
Nodes (6): mapRows(), mapValue(), oid(), identity(), RESULT_COLUMNS, RFC-3339

### Community 188 - "core-ledger-state.test.ts"
Cohesion: 0.15
Nodes (8): boundLedgerParser(), itemsOf(), applied(), bound(), query(), refusing(), NODES_PER_STATEMENT, STORED_ROOT

### Community 193 - "vitest"
Cohesion: 0.16
Nodes (4): [A, B, C], settings, CORE_ARCH, vitest

### Community 195 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 201 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 208 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 216 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 237 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 253 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 27 - ".put"
Cohesion: 0.03
Nodes (81): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed (+73 more)

### Community 281 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 313 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 314 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 327 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 34 - "history"
Cohesion: 0.03
Nodes (75): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+67 more)

### Community 45 - "version"
Cohesion: 0.03
Nodes (65): side(), params(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules (+57 more)

### Community 48 - "code"
Cohesion: 0.03
Nodes (64): code(), Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in) (+56 more)

### Community 95 - "refused"
Cohesion: 0.07
Nodes (38): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 17. Trying a module against another node (+30 more)

### Community 102 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-16 Chain-data reads name their view and height, Requirement: RN-1 The main program is a fixed sequence of points (+29 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 145 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 151 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 158 - "package.json"
Cohesion: 0.09
Nodes (22): bin, umbradb, description, exports, files, homepage, license, main (+14 more)

### Community 160 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 169 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 170 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 174 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 176 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 179 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 180 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker (+8 more)

### Community 181 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 185 - "Backups"
Cohesion: 0.13
Nodes (15): A backup at the core's stop, A backup of a running process (SIGUSR2), A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Backups, Checking a configuration against its database, Restoring a backup (+7 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 190 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 191 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 192 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 197 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 199 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 200 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 204 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 207 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 210 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 211 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 212 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 5. Full-sync soak + load-under-concurrent-prune (G10), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring (+3 more)

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

### Community 219 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 220 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 225 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 226 - "ROADMAP.md"
Cohesion: 0.20
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 227 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 228 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 229 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 230 - "Requirement: AE-5 `/status` and `/config` contents"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A long awaiting callback does not fail liveness, Scenario: Before the first block, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 231 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 232 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 233 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 234 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 235 - "Repository agent policy"
Cohesion: 0.22
Nodes (8): Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 238 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 239 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 240 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 241 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 244 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 245 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 246 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 247 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 249 - "Requirement: BK-1 Backup"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 250 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 252 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 254 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 255 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 256 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 257 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 258 - "Requirement: PP-4 The process transport"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, Spec delta — `private-processes` capability

### Community 259 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 260 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 261 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 263 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 265 - "Changelog"
Cohesion: 0.33
Nodes (5): [0.10.0] - 2026-10-27, Added, Breaking changes, Changelog, [Unreleased]

### Community 266 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 267 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 268 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 269 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 270 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 271 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

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

### Community 282 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 284 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 285 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 286 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 287 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 288 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 289 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 290 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 291 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 292 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 293 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 294 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 295 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 296 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 297 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 298 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 299 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 300 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 301 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 302 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 303 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 304 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 305 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 306 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 307 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 308 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 309 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 310 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 316 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 317 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 318 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 319 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 320 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 321 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 322 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 323 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 324 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 325 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 331 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 332 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 86 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped (+32 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3855 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `admin-harness.ts`, `Database`, `UmbraError`, `api-server.test.ts`, `fetch-fixtures.ts`, `opt-out.test.ts`, `validate.ts`, `db/errors.ts`, `ReadHandle`, `core-transport.ts`, `column-rules.ts`, `adapter-fixtures.ts`, `declaration.ts`, `runner/process.ts`, `cbor.ts`, `process.test.ts`, `tape/index.ts`, `db/backends.ts`, `ref_node_fs`, `ModuleDeclaration`, `loop.test.ts`, `ledger-tapes.ts`, `host.ts`, `client.test.ts`, `adapter.ts`, `range.test.ts`, `TapeNode`, `node-format.ts`, `order.property.test.ts`, `core-chain-events.ts`, `ledger/types.ts`, `config/history.ts`, `ref_node_url`, `contract-data-checks.ts`, `writer-lock-checks.ts`, `version-checks.ts`, `.read`, `halts.test.ts`, `private/backends.ts`, `ledger/ledger-tasks.test.ts`, `ingest-harness.ts`, `.from`, `slow-block-harness.ts`, `NodeClient`, `intake.test.ts`, `config-check.ts`, `core-block-parsed.ts`, `networks.ts`, `process-backends.ts`, `backup/backup.ts`, `process-worker.ts`, `process-build.ts`, `containers.test.ts`, `cli/command.ts`, `src/ledger/identity.ts`, `chain-process.test.ts`, `post-block-update-checks.ts`, `builds.ts`, `ref_node_timers`, `zero-timeouts-checks.ts`, `file-mode.test.ts`, `cold-boot-recovery.integration.test.ts`, `retirement.test.ts`, `core-ledger-state.ts`, `transform-checks.ts`, `binding.test.ts`, `InMemoryBlockSource`, `database-parts.ts`, `pause-fixtures.ts`, `real-tapes.ts`, `process-context.test.ts`, `private/lockstep-wait.test.ts`, `net.test.ts`, `recovery.test.ts`, `pack-install.mjs`, `ledger-storage.test.ts`, `paused-harness.ts`, `redact.ts`, `transaction-history-storage.property.test.ts`, `core-ledger-state/sql.ts`, `release-version.ts`, `validation.ts`, `browser.test.ts`, `core.ts`, `browser/build.ts`, `graph.test.ts`, `checks.test.ts`, `core-block-commit.test.ts`, `postgres/transaction-history-storage.ts`, `code-registry.ts`, `test/postgres/setup.ts`, `pg-tx-history-adapter.ts`, `documents.ts`, `conformance-gate.mjs`, `Lockstep`, `read-gate.ts`, `crash.test.ts`, `typescript`, `ref_node_events`, `sigterm.test.ts`, `restore-private.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `boundary.test.ts`, `node-bridge.ts`, `package-startup-checks.ts`, `worker-host.test.ts`, `lockstep-refusals.test.ts`, `example-checks.ts`, `package.json`, `block-fetch-decode.test.ts`, `ledger-sweep.test.ts`, `key-handling-checks.ts`, `excluded-not-exported.test.ts`, `run.test.ts`, `text.test.ts`, `mapping.test.ts`, `resolver-boundary.ts`, `LoopPauses`, `statementsOf`, `ws-mutual-tls.test.ts`, `core-ledger-state.test.ts`, `web-lock.ts`, `twox.ts`, `worker-threads.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `history.property.test.ts`, `component-table.test.ts`, `Heartbeat`, `ledger/plain-data.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.263) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 19 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01878057511036869 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `admin-harness.ts`, `Database`, `api-server.test.ts`, `fetch-fixtures.ts`, `opt-out.test.ts`, `validate.ts`, `db/errors.ts`, `ReadHandle`, `core-transport.ts`, `declaration.ts`, `runner/process.ts`, `cbor.ts`, `process.test.ts`, `tape/index.ts`, `db/backends.ts`, `ref_node_fs`, `ModuleDeclaration`, `loop.test.ts`, `client.test.ts`, `lockstep-refusals.test.ts`, `checkParent`, `ledger/types.ts`, `config/history.ts`, `range.ts`, `LedgerPackage`, `writer-lock-checks.ts`, `version-checks.ts`, `NodeBlockSource`, `.read`, `halts.test.ts`, `FinalizedLoop`, `private/backends.ts`, `BlockRef`, `mapping.test.ts`, `ledger/ledger-tasks.test.ts`, `ingest-harness.ts`, `slow-block-harness.ts`, `NodeClient`, `statementsOf`, `config-check.ts`, `networks.ts`, `core-ledger-state.test.ts`, `backup/backup.ts`, `web-lock.ts`, `process-worker.ts`, `process-build.ts`, `cli/command.ts`, `src/ledger/identity.ts`, `chain-process.test.ts`, `client.ts`, `zero-timeouts-checks.ts`, `graph.ts`, `checkShape`, `core-ledger-state.ts`, `transform-checks.ts`, `binding.test.ts`, `loop.ts`, `InMemoryBlockSource`, `database-parts.ts`, `pause-fixtures.ts`, `process-context.test.ts`, `sha256`, `redact.ts`, `Repository agent policy`, `browser/src/config/load.ts`, `validation.ts`, `graph.test.ts`, `checks.test.ts`, `core-block-commit.test.ts`, `mapping.ts`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.023259936886146863 - nodes in this community are weakly interconnected._