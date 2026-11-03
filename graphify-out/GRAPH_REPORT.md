# Graph Report - UmbraDB

## Corpus Check
- 1222 files · ~1,748,551 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12799 nodes · 39326 edges · 389 communities (354 shown, 35 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3340 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `822ed8ea411153cc` (1222 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- process-backends.ts
- column-rules.ts
- module-api.ts
- paused-harness.ts
- transport-faults.test.ts
- chain-process.test.ts
- zero-timeouts-checks.ts
- boundary.test.ts
- page.ts
- pg-tx-history-adapter.ts
- node-fields-harness.ts
- cli/command.ts
- validation.ts
- release-version.ts
- redact.ts
- code-registry.ts
- 14. Private processes
- config-check-database.test.ts
- UmbraError
- resolver-boundary.ts
- browser/build.ts
- node-format.ts
- LoopPauses
- checks.test.ts
- crash.test.ts
- process-worker.ts
- BlockWriteHandle
- version-checks.ts
- documents.ts
- relays.ts
- read-gate.ts
- ledger-sweep.test.ts
- core-block-fetch/metadata.ts
- core-private-source.ts
- process-admin.ts
- Lockstep
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- sweepStep
- config/plain-data.ts
- private/lockstep-wait.test.ts
- sigterm.test.ts
- NodeClient
- .send
- surface.test.ts
- fixtures/configuration.ts
- backup/restore.ts
- node-bridge.ts
- ledger/metadata.ts
- demo-handlers.test.ts
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- tape/index.ts
- pack-install.mjs
- ledger/fixtures/task-modules.ts
- adapter.ts
- .concat
- adapter-core.test.ts
- childRefKeys
- GraphWorld
- harness.ts
- validate.ts
- .value
- library-documents.test.ts
- version-table.ts
- in-memory-source.ts
- NodeBlockSource
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- ledger-table-config.test.ts
- browser-harness.ts
- channel-queue.test.ts
- lockstep-refusals.test.ts
- listening.test.ts
- shims.test.ts
- readRuntimeMetadata
- ledger/types.ts
- client.test.ts
- ws-mutual-tls.test.ts
- core-block-fetch.test.ts
- statementsOf
- checkShape
- quiet-host.child.ts
- core.ts
- web-lock.ts
- cbor.ts
- checkParent
- component-table.test.ts
- read-height.property.test.ts
- no-indexer-or-wallet-sdk.test.ts
- loop.test.ts
- browser/serve.ts
- browser/src/config/load.ts
- worker-threads.test.ts
- createLedgerAdapter
- worker-threads-worker.ts
- buffer.ts
- startUmbraDB
- stats-module.ts
- apply
- Worker
- builds.ts
- TapeAnswers
- FinalizedLoop
- typescript
- ref_node_fs
- extrinsics.ts
- postgres-image.test.ts
- range.ts
- ledgerEventOf
- core-transport.ts
- v9-rc3-checks.ts
- vendored-ledger-files.test.ts
- resolve.ts
- mutation-evidence.d.mts
- SourceTransport
- .toString
- AsyncLocalStorage
- migrate.ts
- order.property.test.ts
- chain-placement.test.ts
- core-block-parsed.ts
- refused-configuration.test.ts
- configured.ts
- PageState
- ProcessView
- database-parts.ts
- PageApiChannel
- core-ledger-state.ts
- NodeFS
- RawEvent
- mounted-admin.test.ts
- library/modules.test.ts
- core-block-commit.test.ts
- admin-harness.ts
- ModuleDeclaration
- loop.ts
- declaration.ts
- runner/process.ts
- Process
- tools_tape_index_taperecord
- start-umbradb.ts
- graph.ts
- src/index.ts
- startProcess
- real-tapes.ts
- backupAtStop
- loop-stop-harness.ts
- vitest
- api-server.test.ts
- PgTransactionHistoryStorage
- replay-check.ts
- config/history.ts
- transport.test.ts
- slow-block-harness.ts
- interfaces/transaction-history-storage.ts
- ledger-units.test.ts
- InMemoryBlockSource
- height-versioned.test.ts
- describeNodeStoreExports
- public-database.ts
- .from
- Database
- mapping.ts
- backup/backup.ts
- writer-lock-checks.ts
- server.ts
- pause-fixtures.ts
- refcount-model.ts
- binding.test.ts
- signal-ignored-fixtures.ts
- transform-checks.ts
- ledger-storage-checks.ts
- ref_node_url
- retirement.test.ts
- messages.ts
- process-build.ts
- restore-private.ts
- file-mode.test.ts
- core-ledger-state/sql.ts
- src/config/load.ts
- networks.ts
- LedgerPackage
- halts.test.ts
- config-check.ts
- browser.test.ts
- test/postgres/setup.ts
- reason
- refused
- version
- graph.py
- cold-boot-recovery.integration.test.ts
- UmbraDB module guide
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- .slowBlockMs
- block-fetch-decode.test.ts
- sweep-fixture.test.ts
- Design — START-UMBRADB: UmbraDB as a library
- .boolean
- node-source-status.test.ts
- .disconnect
- mutation-per-adapter.mjs
- .start
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- twox.ts
- Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Boundaries, threats and controls
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- fresh-instance.mjs
- v9
- midnight-env — reproducible PREPROD dev environment
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- The laws of UmbraDB's storage helpers
- orphan-watcher.mjs
- crash-worker.ts
- .put
- history
- data
- code
- core-private-source.test.ts
- ADDED Requirements
- .off
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- README.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Requirement: DT-3 The contents hash
- Design — Sprint 4: Watermarks
- explore.md
- ROADMAP.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — Sprint 2: Transaction/Lease
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- [0.10.0] - 2026-10-27
- scoped-review-manifest
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Requirement: BK-1 Backup
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- Midnight Foundation Security Policy
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- UmbraDB node architecture
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
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
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
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
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- bug-report.md
- feature-request.md
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 421 edges
2. `UmbraError` - 347 edges
3. `ModuleDeclaration` - 197 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `startUmbraDB()` - 103 edges
9. `Database` - 102 edges
10. `ReadHandle` - 92 edges

## Surprising Connections (you probably didn't know these)
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `4. WalletState envelope` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/tasks.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `6. Live-sync tier (nightly/labeled — blocked on design.md §7's open question)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/tasks.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (389 total, 35 thin omitted)

### Community 0 - "process-backends.ts"
Cohesion: 0.03
Nodes (182): CoreLedgerStateOptions, GreyPicker, Manifest, Restored, LedgerActivity, NodeDatabase, ParseRequest, Pending (+174 more)

### Community 1 - "column-rules.ts"
Cohesion: 0.02
Nodes (175): DumpInput, CheckedMigration, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions (+167 more)

### Community 10 - "module-api.ts"
Cohesion: 0.03
Nodes (103): coreHeaders, HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions (+95 more)

### Community 100 - "paused-harness.ts"
Cohesion: 0.12
Nodes (31): Body, PausedExpectation, Read, Reader, Running, a176Project(), keeperModule(), keepingPause() (+23 more)

### Community 102 - "transport-faults.test.ts"
Cohesion: 0.10
Nodes (29): PrivateLinkAddress, CoreTransport, CoreTransportOptions, TransportTls, PrivateSocketTransportOptions, SocketLimits, PrivateTransportOptions, mutualTlsOptions() (+21 more)

### Community 103 - "chain-process.test.ts"
Cohesion: 0.08
Nodes (28): WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing, Flaky (+20 more)

### Community 106 - "zero-timeouts-checks.ts"
Cohesion: 0.11
Nodes (24): Settings, Outcome, openBlockWrites(), setUp(), idleBlock(), migrated(), part(), seenAt() (+16 more)

### Community 107 - "boundary.test.ts"
Cohesion: 0.13
Nodes (32): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+24 more)

### Community 108 - "page.ts"
Cohesion: 0.07
Nodes (30): ApiChannel, LinkRecord, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp(), beginCore() (+22 more)

### Community 109 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (25): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+17 more)

### Community 11 - "node-fields-harness.ts"
Cohesion: 0.04
Nodes (118): ProcessCondition, Scenario, A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader (+110 more)

### Community 113 - "cli/command.ts"
Cohesion: 0.10
Nodes (27): RestoreSeams, CommandHandler, CommandIo, MainProcess, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome (+19 more)

### Community 114 - "validation.ts"
Cohesion: 0.07
Nodes (32): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+24 more)

### Community 115 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 116 - "redact.ts"
Cohesion: 0.10
Nodes (28): RedactionForms, SecretForm, TextPattern, Needs, findings(), databaseText(), isMemoryDatabase(), configRedactor() (+20 more)

### Community 117 - "code-registry.ts"
Cohesion: 0.10
Nodes (31): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+23 more)

### Community 118 - "14. Private processes"
Cohesion: 0.10
Nodes (18): PrivateBlockSource, StartHashes, PublicDatabase, ConfigHashRow, bytesOfHex(), lockstepBehind(), publicNotStarted(), readPublicIdentity() (+10 more)

### Community 119 - "config-check-database.test.ts"
Cohesion: 0.08
Nodes (22): CheckStep, ConfigCheckReport, CheckTarget, CliBackend, configCheck(), configText(), coreSettings(), inChild() (+14 more)

### Community 12 - "UmbraError"
Cohesion: 0.04
Nodes (80): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, ConfiguredDatabaseOptions, CommittedHeight, ReadOptions (+72 more)

### Community 120 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 121 - "browser/build.ts"
Cohesion: 0.08
Nodes (25): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+17 more)

### Community 124 - "node-format.ts"
Cohesion: 0.13
Nodes (17): Reader, Reader, TableNode, node(), childKeys(), node(), concat(), decodeChild() (+9 more)

### Community 126 - "LoopPauses"
Cohesion: 0.08
Nodes (18): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, h(), clock(), watched(), 1. Module layout (+10 more)

### Community 127 - "checks.test.ts"
Cohesion: 0.09
Nodes (23): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+15 more)

### Community 128 - "crash.test.ts"
Cohesion: 0.10
Nodes (25): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, SkipsStartAtRestart, WORKER, CrashJob (+17 more)

### Community 129 - "process-worker.ts"
Cohesion: 0.12
Nodes (23): Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, withDevelopmentOptIn(), answer(), backUp() (+15 more)

### Community 13 - "BlockWriteHandle"
Cohesion: 0.03
Nodes (99): TableDigest, TableDigestRow, BlockWriteHandle, CaptureColumn, CapturedTable, CaptureState, SchemaPlan, GuardTableRow (+91 more)

### Community 131 - "version-checks.ts"
Cohesion: 0.12
Nodes (21): Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk, copyVendoredLedger() (+13 more)

### Community 132 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 134 - "relays.ts"
Cohesion: 0.10
Nodes (10): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, messageText(), hostPort(), sendable() (+2 more)

### Community 135 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 136 - "ledger-sweep.test.ts"
Cohesion: 0.13
Nodes (18): SweepState, NodeBatch, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints(), compare() (+10 more)

### Community 138 - "core-block-fetch/metadata.ts"
Cohesion: 0.11
Nodes (22): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive, RuntimeMetadataView (+14 more)

### Community 139 - "core-private-source.ts"
Cohesion: 0.13
Nodes (24): PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, PrivateLink, PublicConfiguration, CommandBuildOptions, PublicItem (+16 more)

### Community 14 - "process-admin.ts"
Cohesion: 0.04
Nodes (100): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+92 more)

### Community 140 - "Lockstep"
Cohesion: 0.11
Nodes (10): PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal, byId(), privateInstancesOf() (+2 more)

### Community 141 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 142 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 143 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 145 - "sweepStep"
Cohesion: 0.09
Nodes (19): SweepTables, hexOf(), merged(), sweepStep(), 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion (+11 more)

### Community 147 - "config/plain-data.ts"
Cohesion: 0.12
Nodes (23): PlainArray, PlainDataNode, Walk, Hash, copyArray(), copyObject(), instanceOf(), isElementKey() (+15 more)

### Community 148 - "private/lockstep-wait.test.ts"
Cohesion: 0.15
Nodes (25): OpenTransaction, PrivateSeen, A114Observation, A116Observation, ExpectedWait, WaitSample, inMemoryBlock(), a114Problems() (+17 more)

### Community 149 - "sigterm.test.ts"
Cohesion: 0.11
Nodes (21): Job, WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent, report() (+13 more)

### Community 15 - "NodeClient"
Cohesion: 0.05
Nodes (75): NodeSourceOptions, FinalizedHeightOptions, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+67 more)

### Community 150 - ".send"
Cohesion: 0.14
Nodes (10): Cdp, ChromeBrowser, ChromeTab, chrome(), chrome(), chromePath(), exitsWithin(), launchChrome() (+2 more)

### Community 151 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 152 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (19): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+11 more)

### Community 154 - "backup/restore.ts"
Cohesion: 0.15
Nodes (21): PublicIdentity, Checked, PublicSide, RestoreChain, RestoreInput, RestoreTarget, isBlockLedgerSource(), readPrivateBinding() (+13 more)

### Community 155 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 157 - "ledger/metadata.ts"
Cohesion: 0.13
Nodes (9): CoreBlockItems, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, contentStateOf(), hexOf() (+1 more)

### Community 158 - "demo-handlers.test.ts"
Cohesion: 0.14
Nodes (19): Compared, ConnectSeen, PortPeer, Exchanged, until(), comparedOfExchange(), comparedOfResponse(), connected() (+11 more)

### Community 159 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (14): BackupText, createReadStream(), firstLine(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst() (+6 more)

### Community 16 - "tape/index.ts"
Cohesion: 0.04
Nodes (78): Recorded, Failure, Variant, TapeBuilderOptions, RecordingProblem, TapeProblem, TransformProblem, readRequest (+70 more)

### Community 161 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 162 - "ledger/fixtures/task-modules.ts"
Cohesion: 0.12
Nodes (20): CallArgsItem, CallArguments, V9Raw, base(), blank(), callArgsModule(), decode(), free() (+12 more)

### Community 163 - "adapter.ts"
Cohesion: 0.09
Nodes (21): Binding, EventKind, Native, Proof, RawBlockContext, RawIntent, RawLoggedItem, RawParameters (+13 more)

### Community 164 - ".concat"
Cohesion: 0.12
Nodes (12): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+4 more)

### Community 165 - "adapter-core.test.ts"
Cohesion: 0.11
Nodes (21): RawTransactionResult, SyntheticCost, FakeTransaction, Recorded, bytesOf(), deserialize(), fakePackage(), regular() (+13 more)

### Community 167 - "childRefKeys"
Cohesion: 0.16
Nodes (7): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf(), key

### Community 168 - "GraphWorld"
Cohesion: 0.23
Nodes (4): Dice, GraphWorld, driveHistory(), utf8()

### Community 169 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 17 - "validate.ts"
Cohesion: 0.03
Nodes (107): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, ConfigRule, CursorRule (+99 more)

### Community 170 - ".value"
Cohesion: 0.26
Nodes (7): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 174 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 178 - "version-table.ts"
Cohesion: 0.18
Nodes (20): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+12 more)

### Community 179 - "in-memory-source.ts"
Cohesion: 0.10
Nodes (16): InMemoryItems, InMemorySourceOptions, Wait, RestoreJob, SignalJob, checkHeight(), hashAt(), report() (+8 more)

### Community 18 - "NodeBlockSource"
Cohesion: 0.04
Nodes (49): BlockEventSource, BlockLedgerSource, HeadWait, NodeBlockSource, Prefetch, QueuedBlock, NodeCallOptions, NodeSubscription (+41 more)

### Community 180 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 181 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 188 - "ledger-table-config.test.ts"
Cohesion: 0.25
Nodes (17): Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts() (+9 more)

### Community 189 - "browser-harness.ts"
Cohesion: 0.25
Nodes (17): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+9 more)

### Community 19 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (85): demoLink, EndpointOptions, Envelope, PrivateLinkChannel, EngineInput, controlledTimers, PeerEnd, PeerMessage (+77 more)

### Community 192 - "lockstep-refusals.test.ts"
Cohesion: 0.25
Nodes (16): LockstepCondition, A118Observation, MismatchObservation, a118Problems(), a118Run(), coreOn(), haltOf(), json() (+8 more)

### Community 195 - "listening.test.ts"
Cohesion: 0.12
Nodes (9): TestCertificates, adminOrigin(), configWhen(), privateData(), readerOf(), until(), waitsForLockstep(), makeCertificates() (+1 more)

### Community 196 - "shims.test.ts"
Cohesion: 0.19
Nodes (7): Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 199 - "readRuntimeMetadata"
Cohesion: 0.40
Nodes (9): TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry(), storageEntry(), strings() (+1 more)

### Community 2 - "ledger/types.ts"
Cohesion: 0.02
Nodes (176): LedgerReleasePackage, ApplyInput, ApplyOutput, LedgerPackageOptions, StateSummary, StoredNode, V9Logs, AppliedState (+168 more)

### Community 20 - "client.test.ts"
Cohesion: 0.03
Nodes (54): NodeRetry, NodeSocketEvents, HandSocket, HandSockets, Answer, FakeNode, Handler, Received (+46 more)

### Community 201 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 202 - "core-block-fetch.test.ts"
Cohesion: 0.13
Nodes (6): LedgerTable, coreBlockFetchOnFetch(), isBlockItemSource(), blockContext(), CORE_BLOCK_FETCH_ID, IN_MEMORY_START_MS

### Community 203 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 204 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 207 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 208 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 209 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 21 - "cbor.ts"
Cohesion: 0.04
Nodes (100): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+92 more)

### Community 210 - "checkParent"
Cohesion: 0.18
Nodes (12): AlwaysLanded, checkParent(), sameBytes(), hashAt(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix (+4 more)

### Community 216 - "component-table.test.ts"
Cohesion: 0.15
Nodes (10): DesignTable, RowCoverage, rule(), opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS (+2 more)

### Community 217 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 219 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 22 - "loop.test.ts"
Cohesion: 0.04
Nodes (83): CommitOutcome, HeldHeight, LockstepWait, LoopEnd, Contexts, Faults, LostCommit, Outcomes (+75 more)

### Community 220 - "browser/serve.ts"
Cohesion: 0.22
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 221 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 223 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 226 - "createLedgerAdapter"
Cohesion: 0.27
Nodes (3): RawLedgerPackage, blank(), createLedgerAdapter()

### Community 228 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 229 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 23 - "startUmbraDB"
Cohesion: 0.03
Nodes (98): NetworkRuleName, Parsed, Expected, runProcess(), text(), transportReader(), startUmbraDB(), commandRun() (+90 more)

### Community 232 - "stats-module.ts"
Cohesion: 0.32
Nodes (10): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+2 more)

### Community 236 - "apply"
Cohesion: 0.20
Nodes (8): RawTransaction, addCosts(), asHandle(), asRaw(), apply(), fallibleSegments(), free(), freeGot()

### Community 24 - "builds.ts"
Cohesion: 0.04
Nodes (77): AdminStarter, PrivateIntakeOptions, PublicWakes, AdminRunOptions, A176Options, A165Options, PrivateOptions, PrivateProcess (+69 more)

### Community 247 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 25 - "FinalizedLoop"
Cohesion: 0.04
Nodes (26): PointRun, Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, Startup, SkipsAfterReconnect (+18 more)

### Community 258 - "typescript"
Cohesion: 0.33
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 26 - "ref_node_fs"
Cohesion: 0.06
Nodes (63): BackupBackend, BackupDatabase, killedRestore, TickerHandle, TickerProcess, WORKER, SignalEvent, Pem (+55 more)

### Community 260 - "extrinsics.ts"
Cohesion: 0.31
Nodes (8): ExtrinsicCall, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), decodeExtrinsics(), isCompactU64(), TIMESTAMP

### Community 261 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 27 - "range.ts"
Cohesion: 0.03
Nodes (62): ConnectSocket, Outage, ScriptedNode, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+54 more)

### Community 279 - "ledgerEventOf"
Cohesion: 0.29
Nodes (7): RawSystemTransaction, bytesOf(), segmentsOf(), fieldBytes(), ledgerEventOf(), nameBytes(), vmLogOf()

### Community 28 - "core-transport.ts"
Cohesion: 0.04
Nodes (47): ChannelEndpoint, EndpointEvents, LinkTimers, CoreChannels, CoreChannelSeams, CoreChannelsOptions, Queued, Connected (+39 more)

### Community 280 - "v9-rc3-checks.ts"
Cohesion: 0.29
Nodes (7): StagenetBlockJson, StagenetFixtureJson, bytes(), FIXTURE, FIXTURES, flushed, STAGENET

### Community 281 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 29 - "resolve.ts"
Cohesion: 0.04
Nodes (88): coreEntry, AddressRequest, Asked, LinkPlan, NetworkInput, NetworkPlan, NetworkProblem, NetworkRequest (+80 more)

### Community 293 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 296 - ".toString"
Cohesion: 0.29
Nodes (4): RawState, eventKindOf(), hexText(), networkIdOf()

### Community 3 - "migrate.ts"
Cohesion: 0.02
Nodes (162): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner (+154 more)

### Community 30 - "order.property.test.ts"
Cohesion: 0.04
Nodes (83): ErrorCode, GraphInput, PastFaultCase, RefusalCase, Recorder, CheckName, GraphSpec, ModuleSpec (+75 more)

### Community 31 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (84): BlockSpec, EventSpec, Json, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase (+76 more)

### Community 32 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (81): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, BlockParsed, BlockParsedOptions, BlockTransaction, LoadLedger (+73 more)

### Community 33 - "refused-configuration.test.ts"
Cohesion: 0.04
Nodes (64): BackupWritten, EngineConfig, ProcessHandle, Refusal, Start, cliProject, Renamed, RunningCommand (+56 more)

### Community 34 - "configured.ts"
Cohesion: 0.04
Nodes (75): BackupFacts, ManifestHistoryRow, BackupOutcome, commandTarget, ReadDatabaseOptions, ConfiguredDatabase, databaseTarget, CreatedDirectory (+67 more)

### Community 35 - "database-parts.ts"
Cohesion: 0.05
Nodes (48): DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, TickerConfig, PausableConfig, PrivateConfig, SecretVariant (+40 more)

### Community 36 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (70): LedgerBinding, LedgerStateItem, retainedStates, CoreRevision, ContractKeys, blockHeaderOf(), commitBlock(), ledgerVersionOf() (+62 more)

### Community 37 - "mounted-admin.test.ts"
Cohesion: 0.05
Nodes (64): UmbraDBHandle, gate, SecretHashes, Expected, FactsRunOptions, SubscriptionSeen, Client, MapiHooks (+56 more)

### Community 38 - "library/modules.test.ts"
Cohesion: 0.04
Nodes (50): CloseHelper, Hold, Signal, QuietResult, Job, ModuleListRule, OwnWords, Shown (+42 more)

### Community 39 - "core-block-commit.test.ts"
Cohesion: 0.04
Nodes (58): BlockRow, cursorTable, CursorTableOptions, CursorValue, StandInOptions, Commit, Committed, TestBackend (+50 more)

### Community 4 - "admin-harness.ts"
Cohesion: 0.02
Nodes (165): adminRoutes, AdminEndpoint, AdminPart, ReadinessFacts, LifecycleStatus, ProcessReason, ProcessState, StatusFacts (+157 more)

### Community 40 - "ModuleDeclaration"
Cohesion: 0.05
Nodes (44): ModuleDeclaration, GraphFacts, ResolvedGraph, MisuseListener, ProcessContexts, ProcessContextsInput, ProcessItems, PublishRefusal (+36 more)

### Community 41 - "loop.ts"
Cohesion: 0.06
Nodes (61): PointName, ProcessContext, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint (+53 more)

### Community 43 - "declaration.ts"
Cohesion: 0.04
Nodes (46): EntryBuilder, ReadHandle, OwnPart, ApiRegistry, BlockHeader, FieldKind, FieldSchema, ItemDeclaration (+38 more)

### Community 44 - "runner/process.ts"
Cohesion: 0.04
Nodes (50): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, ConfigRow, RetryCode (+42 more)

### Community 45 - "Process"
Cohesion: 0.06
Nodes (16): LedgerWorkerOptions, transportReaderFacts, BlockSource, PauseHold, Opened, Process, WorkerOutput, openedCursorHeight() (+8 more)

### Community 47 - "tools_tape_index_taperecord"
Cohesion: 0.05
Nodes (34): ConnectionFrames, Failure, Variant, WrongRecording, Frame, RawClient, Script, Step (+26 more)

### Community 48 - "start-umbradb.ts"
Cohesion: 0.06
Nodes (60): HistoryFinding, Finding, MessagePortLike, readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd (+52 more)

### Community 49 - "graph.ts"
Cohesion: 0.05
Nodes (65): OpenedFacts, HistoryCheck, HistoryInput, HistoryRule, AppliedMigration, Edge, EntryRange, GraphPart (+57 more)

### Community 5 - "src/index.ts"
Cohesion: 0.03
Nodes (136): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+128 more)

### Community 50 - "startProcess"
Cohesion: 0.07
Nodes (47): ProcessObservation, StartVia, testBuild, A149Observation, A149Startup, A42Observation, Seen, Hold (+39 more)

### Community 51 - "real-tapes.ts"
Cohesion: 0.05
Nodes (51): Metadata, Step, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+43 more)

### Community 52 - "backupAtStop"
Cohesion: 0.04
Nodes (59): UmbraDBStarted, Job, Run, join(), normalize(), resolve(), backupAtStop(), found() (+51 more)

### Community 54 - "loop-stop-harness.ts"
Cohesion: 0.07
Nodes (48): Connection, NodeClientOptions, NodeSocket, NodeTimers, EngineOptions, A169Observation, LoopStopScenario, SourceOf (+40 more)

### Community 55 - "vitest"
Cohesion: 0.05
Nodes (32): Served, Finding, Lockfile, Manifest, BlockImport, ChildResult, CodeBlock, installedProject (+24 more)

### Community 56 - "api-server.test.ts"
Cohesion: 0.06
Nodes (46): ChainDataView, HttpHandler, HttpRoute, AcceptsDuplicates, AddsExtensions, AddsHeaders, AppendsVersion, Client (+38 more)

### Community 57 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (36): MergeEntriesFn, TransactionHistoryEntry, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, encodeStoredEntry(), rowToEntry(), abortErrorLike(), capitalize() (+28 more)

### Community 58 - "replay-check.ts"
Cohesion: 0.06
Nodes (44): Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, Arguments, Command (+36 more)

### Community 6 - "config/history.ts"
Cohesion: 0.03
Nodes (140): CoreVersion, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryConfig (+132 more)

### Community 60 - "transport.test.ts"
Cohesion: 0.06
Nodes (39): ReadOnlyDatabase, Message, MessageType, ReadResult, Pending, KeeperGlobals, PublicCore, Ended (+31 more)

### Community 62 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (49): BlockItemSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+41 more)

### Community 63 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (39): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, JsonEncoded (+31 more)

### Community 64 - "ledger-units.test.ts"
Cohesion: 0.07
Nodes (45): ManifestLine, VerifyLedgerPackagesOptions, Path, LedgerSource, LedgerSourceSettings, checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages() (+37 more)

### Community 65 - "InMemoryBlockSource"
Cohesion: 0.07
Nodes (25): ChainCheck, ChainCheckInput, BlockRef, InMemoryBlockSource, Flaky, Fetching, Recorder, FaultedClose (+17 more)

### Community 66 - "height-versioned.test.ts"
Cohesion: 0.07
Nodes (37): heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration, Control, StoredVersion, Block, BlockFails (+29 more)

### Community 67 - "describeNodeStoreExports"
Cohesion: 0.08
Nodes (36): FreshInstanceRequest, FreshInstanceResult, StoredNode, Disposable, NodeBatch, NodeStoreExports, NodeStoreSubject, NodeRoot (+28 more)

### Community 68 - "public-database.ts"
Cohesion: 0.07
Nodes (27): PrivateLinkConnect, PublicSide, PublicSideOptions, HelloAck, JsonValue, StatementResult, ConnectChannel, CarrierConnection (+19 more)

### Community 69 - ".from"
Cohesion: 0.06
Nodes (52): Child, extendedCases, FixtureDag, FixtureNode, NodeContent, ExtendedState, FakeState, FixtureData (+44 more)

### Community 7 - "Database"
Cohesion: 0.03
Nodes (92): BenchEnv, SslMode, Database, driverConnectionOptions, PostgresConnection, ReadPool, Snapshot, TestDatabase (+84 more)

### Community 70 - "mapping.ts"
Cohesion: 0.06
Nodes (40): ResultColumn, ResultType, Case, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject() (+32 more)

### Community 71 - "backup/backup.ts"
Cohesion: 0.08
Nodes (44): BackupInput, BackupSeams, BackupTarget, ManifestMigration, ManifestTool, PgliteDump, SnapshotSeams, Environment (+36 more)

### Community 72 - "writer-lock-checks.ts"
Cohesion: 0.09
Nodes (38): WriterProcess, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), cleanUp(), firstOf(), startWriterProcess() (+30 more)

### Community 73 - "server.ts"
Cohesion: 0.07
Nodes (33): MountedAdminAnswer, AdminSeams, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions (+25 more)

### Community 74 - "pause-fixtures.ts"
Cohesion: 0.08
Nodes (36): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, PausesInsideTheHeight (+28 more)

### Community 75 - "refcount-model.ts"
Cohesion: 0.07
Nodes (40): Buffer, BlockKind, BlockScript, BoundaryRewrite, DrivenBlock, GeneratedBlock, GeneratedState, GraphNode (+32 more)

### Community 76 - "binding.test.ts"
Cohesion: 0.07
Nodes (44): startHashDecision, a165Run, Attempt, A113Observation, A156Observation, Binding, Created, Outcome (+36 more)

### Community 77 - "signal-ignored-fixtures.ts"
Cohesion: 0.06
Nodes (38): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+30 more)

### Community 78 - "transform-checks.ts"
Cohesion: 0.11
Nodes (29): TransformError, SubscriptionId, NotificationRange, baseRecords(), expectedText(), expectVariantOutput(), forkRecords(), changedLines() (+21 more)

### Community 79 - "ledger-storage-checks.ts"
Cohesion: 0.09
Nodes (46): LedgerEvent, TransactionResult, VmLog, ledgerItemsSeen, a76Problems(), heightsIn(), a106Problems(), a107Problems() (+38 more)

### Community 8 - "ref_node_url"
Cohesion: 0.02
Nodes (109): CdpEvent, Download, ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted (+101 more)

### Community 80 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 82 - "messages.ts"
Cohesion: 0.06
Nodes (40): Committed, MessageFault, Parsed, Read, resultColumns(), columnTypes(), statementResult(), instanceIdSchema() (+32 more)

### Community 83 - "process-build.ts"
Cohesion: 0.06
Nodes (37): EngineBuild, EngineNetwork, Observation, CoreSeen, TestProcessInput, A47Observation, CommitsTheBoundary, Version (+29 more)

### Community 84 - "restore-private.ts"
Cohesion: 0.09
Nodes (38): FoldedPart, RecordedMigration, FileProcess, privateBackup, PublicSetting, PublicSide, PublicSideOptions, isObject() (+30 more)

### Community 85 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (31): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+23 more)

### Community 86 - "core-ledger-state/sql.ts"
Cohesion: 0.09
Nodes (37): StateRow, StoredState, GreyView, SweepPhase, SweepWrites, allGreyKeys(), bytesOf(), clearGrey() (+29 more)

### Community 87 - "src/config/load.ts"
Cohesion: 0.06
Nodes (30): ImportedConfig, LoadOptions, PlainDataRule, Row, configModules(), configModuleUrl(), configPath(), importConfig() (+22 more)

### Community 89 - "networks.ts"
Cohesion: 0.06
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 9 - "LedgerPackage"
Cohesion: 0.04
Nodes (68): RetainedState, LedgerName, ChainOutcome, LedgerEventKind, LedgerPackage, LedgerTask, LedgerTaskBlock, NodeStore (+60 more)

### Community 90 - "halts.test.ts"
Cohesion: 0.07
Nodes (39): ProcessingEnd, ProcessStatus, Q142Observation, A43Case, A43Observation, CursorElsewhere, Halt, Outcome (+31 more)

### Community 92 - "config-check.ts"
Cohesion: 0.08
Nodes (34): CheckFinding, StepName, StepReport, StepStatus, DatabaseState, ConfigFinding, ConfigInput, databaseFinding() (+26 more)

### Community 93 - "browser.test.ts"
Cohesion: 0.07
Nodes (39): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, PageRequest, heldClock (+31 more)

### Community 96 - "test/postgres/setup.ts"
Cohesion: 0.07
Nodes (32): Key, Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, Sql, SuiteWatchdogTimeoutError (+24 more)

### Community 98 - "reason"
Cohesion: 0.06
Nodes (35): TransactionHistoryStorage, reason(), 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it, Evidence, Problem, Suggested fix, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import (+27 more)

### Community 53 - "refused"
Cohesion: 0.04
Nodes (59): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+51 more)

### Community 81 - "version"
Cohesion: 0.05
Nodes (40): side(), migrations(), version(), 1. Overview, Appendix A. Reference, 0. Project setup, 1. TemporalKV, 2. Sprint close-out (+32 more)

### Community 104 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 110 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (23): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), isPlainObject(), mergeSections(), referenceMergeEntries() (+15 more)

### Community 160 - "UmbraDB module guide"
Cohesion: 0.08
Nodes (24): params(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations, 16. Upgrades (+16 more)

### Community 173 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.10
Nodes (21): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4, 2. G9 — the four crash tests (+13 more)

### Community 176 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 177 - "block-fetch-decode.test.ts"
Cohesion: 0.18
Nodes (16): blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes(), encodeCompact() (+8 more)

### Community 182 - "sweep-fixture.test.ts"
Cohesion: 0.20
Nodes (17): childKey(), decodeChildren(), storedNodeKey(), rebuildTagged(), applyInput(), at(), batchText(), blockHash() (+9 more)

### Community 183 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.12
Nodes (16): transportReaderRule(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout, 2. Architecture (+8 more)

### Community 184 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 194 - "node-source-status.test.ts"
Cohesion: 0.12
Nodes (12): a, fence(), open(), pass(), quiet(), close(), chain, head (+4 more)

### Community 200 - ".disconnect"
Cohesion: 0.15
Nodes (14): fault(), Suggested fix, 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants (+6 more)

### Community 206 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 211 - ".start"
Cohesion: 0.15
Nodes (9): declarationsOf(), endsOnEveryRefusal(), started(), withoutNodeFields(), 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution (+1 more)

### Community 212 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (12): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+4 more)

### Community 218 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 222 - "Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.15
Nodes (11): contentOf(), 0. Baseline, 1. Measurements on the recorded tapes (`design.md` §9, §13 phase 0), 3. Storage, the step, and the switch (`design.md` §2, §3, §10; §13 phase 2), 4. The process on both backends (`design.md` §4–§8; §13 phase 3), 5. The sweep removed, the documents (`design.md` §11; §13 phase 4), 6. Full verification (AGENTS.md stage 3), 7. Local preprod runs (`design.md` §12; manual evidence, never in CI) (+3 more)

### Community 231 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 233 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 240 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 251 - "fresh-instance.mjs"
Cohesion: 0.20
Nodes (8): hex(), requested, store, stored, 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered, Evidence, Problem, Suggested fix

### Community 265 - "v9"
Cohesion: 0.28
Nodes (7): "on-db-write"(), v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix, 14. External claims and their evidence

### Community 267 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 283 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 286 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.33
Nodes (6): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers

### Community 314 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 359 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 42 - ".put"
Cohesion: 0.03
Nodes (71): T(), input(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed (+63 more)

### Community 46 - "history"
Cohesion: 0.03
Nodes (68): history(), revision(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+60 more)

### Community 59 - "data"
Cohesion: 0.04
Nodes (61): n(), data(), 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants, 2.4 Migrations: one per part (O-2), 2.5 Content-based determinism (O-8; DT-3, DT-4), 2. Storage (+53 more)

### Community 61 - "code"
Cohesion: 0.04
Nodes (57): code(), Added, 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit (+49 more)

### Community 91 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (12): publicLockstepOf(), height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PUBLIC_POLL_MS (+4 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 97 - ".off"
Cohesion: 0.05
Nodes (36): Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases (+28 more)

### Community 101 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+29 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 125 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 130 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 144 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 156 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 166 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.09
Nodes (22): 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words, 4.1 Reachability does not depend on the form (+14 more)

### Community 171 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 172 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 175 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.08
Nodes (17): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix, 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix (+9 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 186 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 190 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 191 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 193 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 198 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 213 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 214 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 215 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 224 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 225 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 227 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 230 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 234 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 235 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.17
Nodes (11): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live` (+3 more)

### Community 237 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 238 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 241 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 242 - "README.md"
Cohesion: 0.29
Nodes (3): Choosing a database, Launching it, stats-module

### Community 243 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 244 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 245 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 246 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 248 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 249 - "ROADMAP.md"
Cohesion: 0.20
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 250 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 252 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 253 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 254 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure, Design — Sprint 2: Transaction/Lease (+1 more)

### Community 255 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 256 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 257 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 259 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 262 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 263 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 264 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 266 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 268 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 269 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 270 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.22
Nodes (8): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution, Design — v1.0.0-perf-baseline

### Community 271 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 272 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 273 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 274 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 275 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 276 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 277 - "Requirement: BK-1 Backup"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 278 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 282 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 284 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 285 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 287 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 288 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 289 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 290 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 291 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 292 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 294 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 298 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 299 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 300 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 301 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 302 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 303 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 304 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 305 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 306 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 307 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 308 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 309 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 310 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 311 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 312 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 313 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 315 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 316 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 317 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 318 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 319 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 320 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 321 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 322 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 323 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 324 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 325 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 326 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 327 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 328 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 329 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 330 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 331 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 332 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 333 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 334 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 335 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 336 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 337 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 338 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 339 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 340 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 341 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 342 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 343 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 344 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 345 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 346 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 347 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 350 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 351 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 352 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 353 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 354 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 355 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 356 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 357 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 362 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `RFC-3339` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4232 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `process-backends.ts`, `column-rules.ts`, `ledger/types.ts`, `migrate.ts`, `admin-harness.ts`, `src/index.ts`, `config/history.ts`, `Database`, `ref_node_url`, `module-api.ts`, `node-fields-harness.ts`, `UmbraError`, `BlockWriteHandle`, `process-admin.ts`, `NodeClient`, `tape/index.ts`, `validate.ts`, `NodeBlockSource`, `channel-queue.test.ts`, `client.test.ts`, `cbor.ts`, `loop.test.ts`, `startUmbraDB`, `builds.ts`, `ref_node_fs`, `range.ts`, `resolve.ts`, `order.property.test.ts`, `chain-placement.test.ts`, `core-block-parsed.ts`, `refused-configuration.test.ts`, `configured.ts`, `database-parts.ts`, `core-ledger-state.ts`, `mounted-admin.test.ts`, `library/modules.test.ts`, `core-block-commit.test.ts`, `ModuleDeclaration`, `loop.ts`, `declaration.ts`, `runner/process.ts`, `tools_tape_index_taperecord`, `start-umbradb.ts`, `startProcess`, `real-tapes.ts`, `loop-stop-harness.ts`, `api-server.test.ts`, `transport.test.ts`, `slow-block-harness.ts`, `interfaces/transaction-history-storage.ts`, `ledger-units.test.ts`, `InMemoryBlockSource`, `height-versioned.test.ts`, `describeNodeStoreExports`, `public-database.ts`, `mapping.ts`, `backup/backup.ts`, `writer-lock-checks.ts`, `server.ts`, `pause-fixtures.ts`, `refcount-model.ts`, `binding.test.ts`, `signal-ignored-fixtures.ts`, `transform-checks.ts`, `retirement.test.ts`, `messages.ts`, `process-build.ts`, `restore-private.ts`, `file-mode.test.ts`, `core-ledger-state/sql.ts`, `src/config/load.ts`, `networks.ts`, `halts.test.ts`, `core-private-source.test.ts`, `config-check.ts`, `browser.test.ts`, `test/postgres/setup.ts`, `paused-harness.ts`, `transport-faults.test.ts`, `chain-process.test.ts`, `zero-timeouts-checks.ts`, `boundary.test.ts`, `pg-tx-history-adapter.ts`, `cold-boot-recovery.integration.test.ts`, `cli/command.ts`, `validation.ts`, `release-version.ts`, `redact.ts`, `code-registry.ts`, `config-check-database.test.ts`, `resolver-boundary.ts`, `browser/build.ts`, `LoopPauses`, `checks.test.ts`, `crash.test.ts`, `package.json`, `version-checks.ts`, `documents.ts`, `read-gate.ts`, `ledger-sweep.test.ts`, `Lockstep`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `config/plain-data.ts`, `private/lockstep-wait.test.ts`, `sigterm.test.ts`, `surface.test.ts`, `backup/restore.ts`, `node-bridge.ts`, `demo-handlers.test.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `adapter-core.test.ts`, `childRefKeys`, `harness.ts`, `library-documents.test.ts`, `block-fetch-decode.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `sweep-fixture.test.ts`, `excluded-not-exported.test.ts`, `ledger-table-config.test.ts`, `lockstep-refusals.test.ts`, `node-source-status.test.ts`, `listening.test.ts`, `shims.test.ts`, `ws-mutual-tls.test.ts`, `core-block-fetch.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `web-lock.ts`, `component-table.test.ts`, `read-height.property.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `facade-merge-loader.ts`, `postgres-image.test.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.244) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `process-backends.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.026865172298427567 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `process-backends.ts`, `column-rules.ts`, `migrate.ts`, `admin-harness.ts`, `src/index.ts`, `config/history.ts`, `Database`, `LedgerPackage`, `module-api.ts`, `node-fields-harness.ts`, `BlockWriteHandle`, `process-admin.ts`, `NodeClient`, `tape/index.ts`, `validate.ts`, `NodeBlockSource`, `channel-queue.test.ts`, `client.test.ts`, `cbor.ts`, `loop.test.ts`, `startUmbraDB`, `builds.ts`, `FinalizedLoop`, `ref_node_fs`, `range.ts`, `core-transport.ts`, `resolve.ts`, `order.property.test.ts`, `refused-configuration.test.ts`, `configured.ts`, `core-ledger-state.ts`, `mounted-admin.test.ts`, `library/modules.test.ts`, `core-block-commit.test.ts`, `ModuleDeclaration`, `loop.ts`, `declaration.ts`, `runner/process.ts`, `Process`, `start-umbradb.ts`, `graph.ts`, `startProcess`, `backupAtStop`, `api-server.test.ts`, `replay-check.ts`, `transport.test.ts`, `slow-block-harness.ts`, `ledger-units.test.ts`, `InMemoryBlockSource`, `height-versioned.test.ts`, `public-database.ts`, `mapping.ts`, `backup/backup.ts`, `writer-lock-checks.ts`, `pause-fixtures.ts`, `binding.test.ts`, `transform-checks.ts`, `process-build.ts`, `restore-private.ts`, `src/config/load.ts`, `halts.test.ts`, `core-private-source.test.ts`, `config-check.ts`, `transport-faults.test.ts`, `chain-process.test.ts`, `zero-timeouts-checks.ts`, `cli/command.ts`, `validation.ts`, `14. Private processes`, `checks.test.ts`, `version-checks.ts`, `core-private-source.ts`, `config/plain-data.ts`, `backup/restore.ts`, `ledger/metadata.ts`, `version-table.ts`, `ledger-table-config.test.ts`, `lockstep-refusals.test.ts`, `shims.test.ts`, `statementsOf`, `checkShape`, `web-lock.ts`, `checkParent`, `browser/src/config/load.ts`, `SourceTransport`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `column-rules.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.018869187019069922 - nodes in this community are weakly interconnected._