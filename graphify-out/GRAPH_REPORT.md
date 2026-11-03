# Graph Report - UmbraDB

## Corpus Check
- 1216 files · ~1,734,851 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12717 nodes · 38996 edges · 395 communities (343 shown, 52 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3314 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `a22b68d6aa2de88e` (1216 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- Database
- tape/index.ts
- ModuleDeclaration
- release-version.ts
- browser/build.ts
- crash.test.ts
- NodeClient
- node-fields-harness.ts
- process-worker.ts
- containers.test.ts
- TransactionHistoryStorage
- pglite-lock.ts
- postgres/transaction-history-storage.ts
- api-server.test.ts
- config/history.ts
- Lockstep
- test/postgres/setup.ts
- ledger-sweep.test.ts
- documents.ts
- code-registry.ts
- read-gate.ts
- fixtures/configuration.ts
- dispatch.ts
- core-config.test.ts
- restore-private.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- redact.ts
- ledger/types.ts
- failures.ts
- surface.test.ts
- version-table.ts
- node-bridge.ts
- core-block-commit/sql.ts
- pack-install.mjs
- BlockRef
- block-fetch-decode.test.ts
- options.ts
- .concat
- envelope.ts
- runner/process.ts
- library-documents.test.ts
- childRefKeys
- GraphWorld
- postgres-tls-server.ts
- shims.test.ts
- chrome.ts
- key-handling-checks.ts
- adapter-fixtures.ts
- pglite-processes.ts
- PgliteDatabase
- core-block-fetch.test.ts
- browser-harness.ts
- text.test.ts
- builds.ts
- typescript
- ApiRoutes
- LoopPauses
- resolver-boundary.ts
- browser/serve.ts
- .publish
- admin-harness.ts
- writer-lock-checks.ts
- ws-mutual-tls.test.ts
- statementsOf
- cursor-table.property.test.ts
- stats-module.ts
- .#close
- no-indexer-or-wallet-sdk.test.ts
- loop.ts
- process-backends.ts
- web-lock.ts
- checkParent
- api-answers.ts
- read-height.property.test.ts
- quiet-host.child.ts
- core-transport.ts
- browser/src/config/load.ts
- worker-threads.test.ts
- backupSignalRelay
- Writer
- Session
- module-tables.ts
- call
- history.property.test.ts
- worker-threads-worker.ts
- buffer.ts
- sweepStep
- .#schedule
- .send
- .from
- Worker
- Design — Sprint 1: project setup + TemporalKV
- declaration.ts
- TapeAnswers
- ProcessItems
- postgres-image.test.ts
- ref_node_crypto
- vendored-ledger-files.test.ts
- ref_node_path
- core-block-parsed.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- LedgerPackage
- UmbraError
- spawnChild
- ReadPool
- WaitsInTransaction
- validation.ts
- chain-process.test.ts
- contract-modules.test.ts
- contract-data-checks.ts
- JobQueue
- exitWithin
- SkipsAfterReconnect
- backup/backup.ts
- PageApiChannel
- NodeFS
- private/backends.ts
- LateRedelivery
- cli/command.ts
- PausesInsideTheHeight
- SkipsLockstep
- WaitingInRead
- ItemsAfterWrite
- SilentHalt
- FailingAfter
- config-check.ts
- NeverClears
- NeverClears
- NoRedelivery
- CommitsTheBoundary
- ledger/ledger-tasks.test.ts
- client.test.ts
- pause-fixtures.ts
- channels.ts
- column-rules.ts
- run.test.ts
- validate.test.ts
- core-ledger-state.ts
- runtime-metadata.test.ts
- PgTransactionHistoryStorage
- fetch-fixtures.ts
- .value
- ledger-units.test.ts
- slow-block-harness.ts
- vitest
- column-rules.test.ts
- entries.ts
- sweep-tapes.ts
- binding.test.ts
- module-api.ts
- boundary.test.ts
- startUmbraDB
- mapping.ts
- core-settings.ts
- FinalizedLoop
- api-session.test.ts
- transport.test.ts
- src/config/load.ts
- Process
- checkShape
- interfaces/transaction-history-storage.ts
- InMemoryBlockSource
- cbor.ts
- version-checks.ts
- retirement.test.ts
- example-checks.ts
- refcount-model.ts
- resolve.ts
- ChannelEndpoint
- private/lockstep-wait.test.ts
- transport-faults.test.ts
- state-trees.test.ts
- backup/restore.ts
- paused-harness.ts
- core-ledger-state/sql.ts
- networks.ts
- startup-stop-harness.ts
- page.ts
- core-digest.ts
- cbor.property.test.ts
- ingest-harness.ts
- browser.test.ts
- order.property.test.ts
- messages.ts
- connectChannel
- pg-tx-history-adapter.ts
- The database
- .configHash
- history
- Problem
- .off
- refused
- cold-boot-recovery.integration.test.ts
- T
- resolve.test.ts
- Design — START-UMBRADB: UmbraDB as a library
- .slowBlockMs
- transportReader
- following
- Boundaries, threats and controls
- db/writer-lock.test.ts
- conformance-gate.mjs
- mutation-per-adapter.mjs
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- twox.ts
- Design — v1.1.0: Quint model checking
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- path.ts
- midnight-env — reproducible PREPROD dev environment
- cleanUp
- v9
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- host-signal.ts
- 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it
- crash-worker.ts
- version
- .put
- code
- ADDED Requirements
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- README.md
- ADDED Requirements
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
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
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Requirement: DT-3 The contents hash
- Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Requirement: CF-4 Every field is data, operational or secret
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- scoped-review-manifest
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — START-UMBRADB: UmbraDB as a library
- Tasks — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Repository agent policy
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance map — START-UMBRADB: UmbraDB as a library
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
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
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-infosec-signoff
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
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
- 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Requirement: PP-2 A private database is bound to one public database
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
- post-block-update/oracle/main.rs
- package.json
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 416 edges
2. `UmbraError` - 346 edges
3. `ModuleDeclaration` - 197 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `startUmbraDB()` - 103 edges
9. `Database` - 101 edges
10. `ReadHandle` - 92 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (395 total, 52 thin omitted)

### Community 0 - "Database"
Cohesion: 0.01
Nodes (272): Database, SchemaWriteHandle, CapturedTable, CaptureState, AppliedRow, MigrationPart, Runnable, Settling (+264 more)

### Community 1 - "tape/index.ts"
Cohesion: 0.02
Nodes (166): heldClock, LoopStopScenario, Recorded, Metadata, Step, Failure, Variant, Link (+158 more)

### Community 10 - "ModuleDeclaration"
Cohesion: 0.03
Nodes (148): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions (+140 more)

### Community 102 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 104 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 109 - "crash.test.ts"
Cohesion: 0.09
Nodes (26): LockResult, CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent (+18 more)

### Community 11 - "NodeClient"
Cohesion: 0.04
Nodes (106): CoreChainBinding, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State (+98 more)

### Community 110 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (25): A168Observation, A168Phase, Expected, GatedConnector, StatusReader, a(), a168Problems(), a168Run() (+17 more)

### Community 111 - "process-worker.ts"
Cohesion: 0.10
Nodes (23): ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker, answer() (+15 more)

### Community 112 - "containers.test.ts"
Cohesion: 0.09
Nodes (23): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+15 more)

### Community 113 - "TransactionHistoryStorage"
Cohesion: 0.07
Nodes (29): TransactionHistoryStorage, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage (+21 more)

### Community 114 - "pglite-lock.ts"
Cohesion: 0.10
Nodes (24): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, ChildResult, acquirePgliteLock() (+16 more)

### Community 117 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (21): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow() (+13 more)

### Community 119 - "api-server.test.ts"
Cohesion: 0.11
Nodes (22): AppendsVersion, Client, configHashesOf(), duplicateProblems(), exchange(), helperProblems(), hex(), isConfigHash() (+14 more)

### Community 12 - "config/history.ts"
Cohesion: 0.03
Nodes (127): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreSettings, ConfigHashRow, HistoryCode, HistoryContext, HistoryFinding (+119 more)

### Community 120 - "Lockstep"
Cohesion: 0.10
Nodes (11): InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal, byId() (+3 more)

### Community 121 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 122 - "ledger-sweep.test.ts"
Cohesion: 0.12
Nodes (20): GreyPicker, SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelSnapshot, sweepReset() (+12 more)

### Community 123 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 124 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 126 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 127 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (21): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+13 more)

### Community 129 - "dispatch.ts"
Cohesion: 0.15
Nodes (24): Callback, EntryBoundary, ParallelPoint, PointSchedule, SkipsStartAtRestart, StartsAtEveryRevision, CoreStopsFirst, boundaryModules() (+16 more)

### Community 13 - "core-config.test.ts"
Cohesion: 0.03
Nodes (107): MountedAdminAnswer, AdminSeams, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer (+99 more)

### Community 132 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+14 more)

### Community 133 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 134 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 135 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 136 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 139 - "redact.ts"
Cohesion: 0.13
Nodes (23): RedactionForms, SecretForm, TextPattern, findings(), databaseText(), isMemoryDatabase(), configRedactor(), credentialsIn() (+15 more)

### Community 14 - "ledger/types.ts"
Cohesion: 0.03
Nodes (99): LoadLedger, TransactionParser, LedgerStateItem, RetainedState, LedgerName, ApplyOutput, ChainOutcome, LedgerPackageOptions (+91 more)

### Community 140 - "failures.ts"
Cohesion: 0.13
Nodes (21): ReasonCode, Unwrapped, configurationFindings(), configurationRefusalLines(), isConfigurationRefusal(), messageOf(), redactedFindings(), redactedFindingText() (+13 more)

### Community 141 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 145 - "version-table.ts"
Cohesion: 0.14
Nodes (24): LedgerPin, LedgerSelection, VersionedBlock, withLedgerTable(), ledgerTableOf(), blockNamed(), checkPins(), covers() (+16 more)

### Community 146 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 148 - "core-block-commit/sql.ts"
Cohesion: 0.14
Nodes (21): BlockRow, blockHeaderOf(), commitBlock(), hex(), ledgerVersionOf(), startOf(), writeBlockRow(), writeHashRow() (+13 more)

### Community 149 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 15 - "BlockRef"
Cohesion: 0.03
Nodes (63): BlockHeaderItem, BodyExtrinsic, ExtrinsicCall, BlockBody, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, HeadWait (+55 more)

### Community 150 - "block-fetch-decode.test.ts"
Cohesion: 0.14
Nodes (19): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+11 more)

### Community 151 - "options.ts"
Cohesion: 0.21
Nodes (23): readOptions, addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding(), guarded(), isHost() (+15 more)

### Community 152 - ".concat"
Cohesion: 0.12
Nodes (12): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+4 more)

### Community 157 - "envelope.ts"
Cohesion: 0.17
Nodes (16): ChainDataView, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions(), chainApi() (+8 more)

### Community 16 - "runner/process.ts"
Cohesion: 0.03
Nodes (89): Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ConfigRow (+81 more)

### Community 160 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 161 - "childRefKeys"
Cohesion: 0.17
Nodes (7): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), compare(), hexOf()

### Community 162 - "GraphWorld"
Cohesion: 0.25
Nodes (3): Dice, GraphWorld, driveHistory()

### Community 163 - "postgres-tls-server.ts"
Cohesion: 0.13
Nodes (14): BenchEnv, TlsPostgres, makeCertificates(), startTlsPostgres(), PG_SETTINGS, container, { guarded, fixture }, HBA (+6 more)

### Community 164 - "shims.test.ts"
Cohesion: 0.16
Nodes (8): Buffer, Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 167 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 168 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 17 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (99): StoredNode, Upstream, contractFixture, RawPackage, AdapterSubject, AdapterWorkerHost, Point, Decimal (+91 more)

### Community 170 - "pglite-processes.ts"
Cohesion: 0.15
Nodes (15): WriterProcess, Job, WorkerEvent, blocksIn(), cursor(), main(), open(), report() (+7 more)

### Community 171 - "PgliteDatabase"
Cohesion: 0.25
Nodes (4): PgliteDatabase, handleClosed(), failedEarlier(), openOn()

### Community 175 - "core-block-fetch.test.ts"
Cohesion: 0.13
Nodes (9): LedgerTable, coreBlockFetchOnFetch(), isBlockItemSource(), chainBackbone(), blockContext(), BOUND, CORE_BLOCK_FETCH_ID, CORE_BLOCK_ITEMS (+1 more)

### Community 177 - "browser-harness.ts"
Cohesion: 0.25
Nodes (17): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+9 more)

### Community 178 - "text.test.ts"
Cohesion: 0.16
Nodes (9): BackupText, createReadStream(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir (+1 more)

### Community 18 - "builds.ts"
Cohesion: 0.03
Nodes (97): AdminStarter, LockstepCondition, A168RunOptions, A176Options, PrivateProcess, PrivateRefusal, PrivateSeen, PublicCore (+89 more)

### Community 181 - "typescript"
Cohesion: 0.19
Nodes (16): Access, AllowedRead, bare(), callsPathResolve(), checked(), declares(), inRepository(), inType() (+8 more)

### Community 182 - "ApiRoutes"
Cohesion: 0.17
Nodes (11): ModuleApiStart, MountedApiSeams, ApiRoutes, ApiStartup, ModuleApiOptions, ModuleRegistration, AcceptsDuplicates, registerModuleApis() (+3 more)

### Community 183 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 185 - "resolver-boundary.ts"
Cohesion: 0.18
Nodes (16): Boundary, Crossing, Guard, boundaryOf(), boundarySources(), guardedSymbols(), hostWith(), inRepository() (+8 more)

### Community 186 - "browser/serve.ts"
Cohesion: 0.17
Nodes (12): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), randomPort() (+4 more)

### Community 189 - ".publish"
Cohesion: 0.17
Nodes (7): Heartbeat, HeartbeatOptions, TimerHandle, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 19 - "admin-harness.ts"
Cohesion: 0.04
Nodes (111): WorkerWithStreams, AdminRun, Answerer, Expected, Hold, Prober, ProbeRecord, Start (+103 more)

### Community 190 - "writer-lock-checks.ts"
Cohesion: 0.26
Nodes (14): PauseReport, firstOf(), startWriterProcess(), workDirectory(), dataDirectory(), expectPausedWriterKeepsLock(), expectRestartAfterKillContinues(), expectSecondPgliteProcessRefused() (+6 more)

### Community 191 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 192 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 193 - "cursor-table.property.test.ts"
Cohesion: 0.17
Nodes (15): Access, Block, BlockFails, Counts, Write, canonicalText(), expectValue(), holds() (+7 more)

### Community 194 - "stats-module.ts"
Cohesion: 0.23
Nodes (12): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+4 more)

### Community 199 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 2 - "loop.ts"
Cohesion: 0.02
Nodes (186): Transaction, PointName, EntryRange, GraphInput, HeightRange, ResolvedGraph, BlockItems, LateUse (+178 more)

### Community 20 - "process-backends.ts"
Cohesion: 0.04
Nodes (94): DatabaseParts, PostgresPartsInput, NodeHttpHandler, NodeUpgradeHandler, Answered, gate, Observation, Renamed (+86 more)

### Community 200 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 201 - "checkParent"
Cohesion: 0.18
Nodes (12): AlwaysLanded, checkParent(), sameBytes(), hashAt(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix (+4 more)

### Community 206 - "api-answers.ts"
Cohesion: 0.23
Nodes (12): HeadersArgument, answerNotServing(), byteLength(), isCoreHeader(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing() (+4 more)

### Community 207 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 208 - "quiet-host.child.ts"
Cohesion: 0.16
Nodes (10): Job, Outcome, Stated, until(), added, before, db, during (+2 more)

### Community 21 - "core-transport.ts"
Cohesion: 0.03
Nodes (68): PrivateLinkConnect, PublicSide, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, CoreLink, coreSessions (+60 more)

### Community 210 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 211 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 217 - "backupSignalRelay"
Cohesion: 0.19
Nodes (7): backupSignalRelay, SignalSource, stopSignal, BackupSignals, TickerOptions, PausableOptions, relayOf()

### Community 218 - "Writer"
Cohesion: 0.26
Nodes (4): DurabilityWarning, Writer, WriterStart, rollBack()

### Community 22 - "module-tables.ts"
Cohesion: 0.04
Nodes (85): BackupInput, DumpInput, CaptureColumn, ModuleColumn, ModuleTable, ModuleTableOptions, PageOptions, ConsistentRead (+77 more)

### Community 220 - "call"
Cohesion: 0.24
Nodes (4): PointRun, call(), isBlock(), sameBytes()

### Community 221 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 223 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 224 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 227 - "sweepStep"
Cohesion: 0.26
Nodes (5): SweepTables, hexOf(), merged(), sweepStep(), 3.1 Where it runs

### Community 23 - ".from"
Cohesion: 0.03
Nodes (89): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+81 more)

### Community 237 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.20
Nodes (10): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+2 more)

### Community 24 - "declaration.ts"
Cohesion: 0.04
Nodes (64): UmbraConfig, BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+56 more)

### Community 242 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 251 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 26 - "ref_node_crypto"
Cohesion: 0.05
Nodes (60): FreshInstanceRequest, FreshInstanceResult, StoredNode, Reader, Disposable, NodeBatch, NodeStoreExports, NodeStoreSubject (+52 more)

### Community 269 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 27 - "ref_node_path"
Cohesion: 0.06
Nodes (66): BackupBackend, BackupDatabase, killedRestore, TickerConfig, TickerHandle, WORKER, SignalEvent, cliProject (+58 more)

### Community 28 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (78): BlockEventSource, MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions, ChainTransaction, ChainEvent, EventPhase (+70 more)

### Community 282 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 29 - "LedgerPackage"
Cohesion: 0.05
Nodes (46): LedgerPackage, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, StagenetBlockJson, StagenetFixtureJson, stagenetReplay (+38 more)

### Community 3 - "UmbraError"
Cohesion: 0.02
Nodes (177): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, commandTarget, ReadDatabaseOptions, ConfiguredDatabase (+169 more)

### Community 30 - "spawnChild"
Cohesion: 0.03
Nodes (74): ParentJob, Kill, Orphaned, SourceFile, Run, Job, WorkerEvent, Report (+66 more)

### Community 303 - "WaitsInTransaction"
Cohesion: 0.20
Nodes (3): SkipsUnseen, WaitsInTransaction, DropsHeld

### Community 31 - "validation.ts"
Cohesion: 0.03
Nodes (83): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+75 more)

### Community 32 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (64): EngineConfig, ProcessHandle, Refusal, Start, Job, WorkerEvent, ChainBuildOptions, A77Observation (+56 more)

### Community 33 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (67): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+59 more)

### Community 34 - "contract-data-checks.ts"
Cohesion: 0.06
Nodes (69): CoreContractStatesOptions, ContractStateRow, CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+61 more)

### Community 35 - "backup/backup.ts"
Cohesion: 0.05
Nodes (67): BackupSeams, BackupTarget, BackupWritten, BackupFacts, ManifestMigration, ManifestTool, PgliteDump, SnapshotSeams (+59 more)

### Community 36 - "private/backends.ts"
Cohesion: 0.06
Nodes (46): PglitePathParts, PostgresParts, Keeping, PrivateBackend, SessionSeen, A162Options, a162Run, HeaderSeen (+38 more)

### Community 37 - "cli/command.ts"
Cohesion: 0.04
Nodes (55): CommandHandler, CommandIo, TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch (+47 more)

### Community 38 - "config-check.ts"
Cohesion: 0.04
Nodes (53): CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState (+45 more)

### Community 39 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (58): TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses() (+50 more)

### Community 4 - "client.test.ts"
Cohesion: 0.02
Nodes (126): NodeSocketEvents, HandSocket, HandSockets, Answer, FakeNode, Handler, Received, recorded (+118 more)

### Community 40 - "pause-fixtures.ts"
Cohesion: 0.06
Nodes (52): BackupOnSignal, LoopClass, Pausable, PausableConfig, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop (+44 more)

### Community 41 - "channels.ts"
Cohesion: 0.05
Nodes (50): EndpointOptions, Envelope, MessagePortLike, PeerEnd, PeerMessage, rawPeer, TestEnd, TestEndOptions (+42 more)

### Community 42 - "column-rules.ts"
Cohesion: 0.04
Nodes (67): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+59 more)

### Community 45 - "run.test.ts"
Cohesion: 0.06
Nodes (47): RunOptions, RunSeams, UserModulesSource, NetworkRuleName, IgnoredJob, statsConfig, Parsed, Expected (+39 more)

### Community 46 - "validate.test.ts"
Cohesion: 0.05
Nodes (49): DatabasePartsInput, Entry, ConfigRule, EntryRef, Accepts, ConfigOf, CoreSettingsGiven, Minimal (+41 more)

### Community 47 - "core-ledger-state.ts"
Cohesion: 0.06
Nodes (47): retainedStates, CoreRevision, boundLedgerParser(), applyBlock(), boundLedger(), contractsOf(), hex(), itemsOf() (+39 more)

### Community 48 - "runtime-metadata.test.ts"
Cohesion: 0.06
Nodes (41): Boundary, FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+33 more)

### Community 49 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (37): MergeEntriesFn, TransactionHistoryEntry, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, encodeStoredEntry(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema (+29 more)

### Community 5 - "fetch-fixtures.ts"
Cohesion: 0.02
Nodes (190): NodeCallOptions, ProcessCondition, BlockSpec, EventSpec, Scenario, transactionSpec, RecordingClient, eventsRuntime (+182 more)

### Community 50 - ".value"
Cohesion: 0.10
Nodes (36): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef, ScaleError (+28 more)

### Community 51 - "ledger-units.test.ts"
Cohesion: 0.06
Nodes (46): ManifestLine, Path, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerTask, checkLedgerPackage(), checkLedgerPackages() (+38 more)

### Community 52 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (49): BlockItemSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+41 more)

### Community 53 - "vitest"
Cohesion: 0.06
Nodes (32): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+24 more)

### Community 54 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+24 more)

### Community 55 - "entries.ts"
Cohesion: 0.05
Nodes (45): TransportReader, coreEntry, CoreEntryInput, CoreSettingsBase, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+37 more)

### Community 56 - "sweep-tapes.ts"
Cohesion: 0.10
Nodes (47): CoreLedgerStateOptions, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData, hex() (+39 more)

### Community 57 - "binding.test.ts"
Cohesion: 0.07
Nodes (45): PrivateIntakeOptions, startHashDecision, A165Options, a165Run, Attempt, TestDatabase, A113Observation, A156Observation (+37 more)

### Community 58 - "module-api.ts"
Cohesion: 0.06
Nodes (37): ChainDataAnswer, ApiError, ApiErrorCode, ApiRequest, ApiResponse, HttpHandler, HttpMethod, HttpRoute (+29 more)

### Community 59 - "boundary.test.ts"
Cohesion: 0.08
Nodes (44): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+36 more)

### Community 6 - "startUmbraDB"
Cohesion: 0.02
Nodes (157): demoLink, MainProcess, PrivateLinkChannel, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle (+149 more)

### Community 60 - "mapping.ts"
Cohesion: 0.06
Nodes (39): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+31 more)

### Community 61 - "core-settings.ts"
Cohesion: 0.05
Nodes (45): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, Absent (+37 more)

### Community 62 - "FinalizedLoop"
Cohesion: 0.08
Nodes (11): FinalizedLoop, LoopObserver, Startup, CommitsDespiteLastWrite, AlwaysLost, cursorText(), isRetryable(), runFinalized() (+3 more)

### Community 63 - "api-session.test.ts"
Cohesion: 0.10
Nodes (44): coreHeaders, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits, ServedConnection, ModuleApiHandlerOptions (+36 more)

### Community 64 - "transport.test.ts"
Cohesion: 0.07
Nodes (32): ReadOnlyDatabase, Message, KeeperGlobals, Ended, rawClient, Escape, publicState, Refused (+24 more)

### Community 65 - "src/config/load.ts"
Cohesion: 0.06
Nodes (36): ImportedConfig, LoadOptions, PlainDataRule, SignalJob, Row, configModules(), configModuleUrl(), configPath() (+28 more)

### Community 66 - "Process"
Cohesion: 0.09
Nodes (8): PauseHold, Process, asksForChannels(), closeSteps(), messageOf(), privateLinkOf(), signalCause(), sourceOf()

### Community 67 - "checkShape"
Cohesion: 0.06
Nodes (40): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+32 more)

### Community 69 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (36): EntryContent, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, Command (+28 more)

### Community 7 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (146): InMemoryBlockSource, InMemoryItems, Wait, EngineBuild, EngineNetwork, ProcessingEnd, ProcessStatus, Flaky (+138 more)

### Community 70 - "cbor.ts"
Cohesion: 0.09
Nodes (38): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+30 more)

### Community 71 - "version-checks.ts"
Cohesion: 0.10
Nodes (35): MetadataNode, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk, OwnStateMetadata (+27 more)

### Community 72 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 73 - "example-checks.ts"
Cohesion: 0.08
Nodes (28): Served, Finding, BlockImport, ChildResult, CodeBlock, installedProject, isolationProblems(), serveCommand() (+20 more)

### Community 74 - "refcount-model.ts"
Cohesion: 0.08
Nodes (36): BlockKind, BlockScript, BoundaryRewrite, DrivenBlock, GeneratedBlock, GeneratedState, GraphNode, HistoryScript (+28 more)

### Community 75 - "resolve.ts"
Cohesion: 0.06
Nodes (40): AddressRequest, Asked, LinkPlan, NetworkContext, NetworkInput, NetworkPlan, NetworkProblem, NetworkRule (+32 more)

### Community 76 - "ChannelEndpoint"
Cohesion: 0.10
Nodes (14): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), messageEnvelope(), refuseChannel(), discard(), isChannel() (+6 more)

### Community 77 - "private/lockstep-wait.test.ts"
Cohesion: 0.07
Nodes (24): Report, OpenTransaction, ExpectedWait, WaitSample, HeldLink, HoldingRelay, ReportRelay, RetargetProxy (+16 more)

### Community 78 - "transport-faults.test.ts"
Cohesion: 0.08
Nodes (32): PrivateLinkAddress, Connected, CoreTransportOptions, CoreSessionOptions, LinkSession, TransportTls, PrivateSocketTransportOptions, SocketLimits (+24 more)

### Community 79 - "state-trees.test.ts"
Cohesion: 0.07
Nodes (34): ApplyInput, StateSummary, LedgerHeight, Ledger, NodeRoot, AdapterWorkerAnswer, AdapterWorkerRequest, LoadedState (+26 more)

### Community 8 - "backup/restore.ts"
Cohesion: 0.02
Nodes (118): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes, PrivateLink (+110 more)

### Community 81 - "paused-harness.ts"
Cohesion: 0.10
Nodes (33): Validator, Body, PausedExpectation, Read, Reader, Running, schemaFile(), text() (+25 more)

### Community 82 - "core-ledger-state/sql.ts"
Cohesion: 0.10
Nodes (36): StateRow, StoredState, GreyView, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks() (+28 more)

### Community 85 - "networks.ts"
Cohesion: 0.06
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 86 - "startup-stop-harness.ts"
Cohesion: 0.10
Nodes (30): A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StartVia, stopBy, StopHandle (+22 more)

### Community 87 - "page.ts"
Cohesion: 0.06
Nodes (31): ApiChannel, LinkRecord, PageState, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp() (+23 more)

### Community 88 - "core-digest.ts"
Cohesion: 0.08
Nodes (35): TableDigest, TableDigestRow, ChangeKind, tableChanges, TouchedRow, capturedOf(), digestBlock(), checkpointDigests() (+27 more)

### Community 89 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (37): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+29 more)

### Community 9 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (149): Manifest, Restored, RestoreInput, BlockHeader, NodeClientOptions, ingest, IngestOptions, SourceClass (+141 more)

### Community 93 - "browser.test.ts"
Cohesion: 0.08
Nodes (36): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+28 more)

### Community 96 - "order.property.test.ts"
Cohesion: 0.09
Nodes (32): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, checkDigestLast(), checkEachOnce(), checkParallelWaits() (+24 more)

### Community 97 - "messages.ts"
Cohesion: 0.07
Nodes (31): Committed, MessageFault, MessageType, bytesOf(), decodeParameter(), decodeValue(), describe(), elementType() (+23 more)

### Community 98 - "connectChannel"
Cohesion: 0.09
Nodes (24): SubscriptionCarrier, SubscriptionConnection, exceedsUtf8(), connectChannel(), errorMessage(), socketConnection(), fault(), 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once (+16 more)

### Community 99 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (25): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+17 more)

### Community 156 - "The database"
Cohesion: 0.09
Nodes (19): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The node on `/status`, The transport reader, TLS to PostgreSQL: `ssl` (+11 more)

### Community 214 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 25 - "history"
Cohesion: 0.03
Nodes (95): history(), params(), data(), 7. The module API, 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants, 2.4 Migrations: one per part (O-2) (+87 more)

### Community 289 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 105 - ".off"
Cohesion: 0.06
Nodes (32): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, 6. `sweep: off` (O-1), 2.1 Where the probe runs (the one real design decision), 2.2 The three durability settings, 2.3 Transaction-pooler detection (+24 more)

### Community 106 - "refused"
Cohesion: 0.08
Nodes (32): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work (+24 more)

### Community 107 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (21): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), isPlainObject(), mergeSections(), referenceMergeEntries() (+13 more)

### Community 118 - "T"
Cohesion: 0.07
Nodes (29): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get` (+21 more)

### Community 128 - "resolve.test.ts"
Cohesion: 0.13
Nodes (25): commandBuild(), readCommandConfig(), pause(), inferSide(), isObject(), knownSecrets(), refusalSecrets(), resolve() (+17 more)

### Community 153 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.09
Nodes (19): originOf(), moduleFacts(), transportReaderRule(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline (+11 more)

### Community 154 - ".slowBlockMs"
Cohesion: 0.11
Nodes (19): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+11 more)

### Community 155 - "transportReader"
Cohesion: 0.10
Nodes (20): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 10. Requirement coverage, 2. Network (+12 more)

### Community 165 - "following"
Cohesion: 0.11
Nodes (20): cursorRead(), following(), 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began, Evidence, Problem, Suggested fix, Backup and restore, Check and run (+12 more)

### Community 169 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 172 - "db/writer-lock.test.ts"
Cohesion: 0.23
Nodes (15): startWriter(), expectLockLostWhenTakenMeanwhile(), expectLockRetakenAfterTermination(), expectSecondPostgresWriterRefused(), lockReleased(), nextTransaction(), pidOf(), rejection() (+7 more)

### Community 196 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 197 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 202 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (12): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+4 more)

### Community 209 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 216 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 225 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 233 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 252 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 257 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 271 - "cleanUp"
Cohesion: 0.29
Nodes (5): cleanUp(), 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone, Problem, Resolution, Suggested fix

### Community 272 - "v9"
Cohesion: 0.38
Nodes (6): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix, 14. External claims and their evidence

### Community 273 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 274 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.29
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 284 - "host-signal.ts"
Cohesion: 0.29
Nodes (5): isAbortSignal(), followSignal(), isSignal(), ABORTED, REASON

### Community 293 - "00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it"
Cohesion: 0.33
Nodes (4): 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it, Evidence, Problem, Suggested fix

### Community 356 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 43 - "version"
Cohesion: 0.04
Nodes (63): side(), migrations(), deferred(), version(), Engineering rules, 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails (+55 more)

### Community 44 - ".put"
Cohesion: 0.03
Nodes (57): coreTxResultsOnParse(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+49 more)

### Community 68 - "code"
Cohesion: 0.05
Nodes (45): code(), Added, 15. Relation to the existing design documents, Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog (+37 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 94 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: load always fully verifies chunk integrity before returning, Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune (+27 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 116 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.06
Nodes (26): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+18 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 138 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 142 - "README.md"
Cohesion: 0.10
Nodes (17): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:, Choosing a database (+9 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 144 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.08
Nodes (25): 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words, 3.2 The rules, for block h (+17 more)

### Community 147 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 159 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need, Requirement: PP-6 Lockstep instances process each height at that height (+12 more)

### Community 173 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 174 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 179 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 180 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 184 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 188 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 203 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 204 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 205 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 212 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 213 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 215 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 222 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 226 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 230 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 231 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 234 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 235 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 236 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 238 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 239 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.18
Nodes (10): 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents, 7. `core-arch` criteria rewritten by this change, 8. Required test ids, 9. Requirement coverage (+2 more)

### Community 240 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 241 - "Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.18
Nodes (10): 0. Baseline, 1. Measurements on the recorded tapes (`design.md` §9, §13 phase 0), 3. Storage, the step, and the switch (`design.md` §2, §3, §10; §13 phase 2), 4. The process on both backends (`design.md` §4–§8; §13 phase 3), 5. The sweep removed, the documents (`design.md` §11; §13 phase 4), 6. Full verification (AGENTS.md stage 3), 7. Local preprod runs (`design.md` §12; manual evidence, never in CI), 8. Review (AGENTS.md stage 4, bounded) (+2 more)

### Community 243 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 244 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 245 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 246 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-4 Every field is data, operational or secret, Scenario: A function in the configuration, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: A user module from the configuration file, Scenario: Two `core` revisions with different databases (+1 more)

### Community 247 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 248 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 249 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 253 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 254 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 255 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 256 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 258 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 259 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 2. Envelope module (Pg-only — required gate), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 260 - "Tasks — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.22
Nodes (8): 0. Baseline, 11. Close-out, 2. The private link's settings renamed (D-6; CF-4), 4. The network request and plan (LM-3; design §5.1, §5.2), 7. The browser demo on the engine (LM-11; design §8), 8. The test sweep, the documents and the pack smoke (design §9; LS-1), 9. Full verification (AGENTS.md stage 3, as far as it runs locally), Tasks — START-UMBRADB: UmbraDB as a library

### Community 261 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 262 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.22
Nodes (8): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution, Design — v1.0.0-perf-baseline

### Community 263 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 264 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 265 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 266 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 267 - "Acceptance map — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.25
Nodes (7): 10. Definition of done, item by item, 1. Library-mode guarantees, 3. Lifecycle, 5. Modules and the ledger worker, 6. Options, refusals and the handle, 7. The command and shared resolution, Acceptance map — START-UMBRADB: UmbraDB as a library

### Community 268 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 270 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 275 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 276 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 277 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 278 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 279 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 280 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 281 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 283 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 286 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 287 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 288 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 290 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 291 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 292 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 294 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 295 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 296 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 297 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 298 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 299 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 300 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 301 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 304 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 305 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 306 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 307 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 308 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 309 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 310 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 311 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 312 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 313 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 314 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 315 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 316 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 317 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 318 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 319 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 320 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 321 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 322 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 323 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 324 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 325 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 326 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 327 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 328 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 329 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 330 - "00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail"
Cohesion: 0.40
Nodes (4): 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix

### Community 331 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 332 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 333 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 334 - "00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why"
Cohesion: 0.40
Nodes (4): 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why, Evidence, Problem, Suggested fix

### Community 335 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 336 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 337 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 338 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 339 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 340 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 344 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 345 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 346 - "00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes"
Cohesion: 0.50
Nodes (3): 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes, Evidence, Suggested fix

### Community 347 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 348 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 349 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 350 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 351 - "Requirement: PP-2 A private database is bound to one public database"
Cohesion: 0.50
Nodes (4): Requirement: PP-2 A private database is bound to one public database, Scenario: Configured for another network, Scenario: Pointed at another public database, Scenario: The public core never started

### Community 352 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 353 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 80 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 91 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 92 - "package.json"
Cohesion: 0.05
Nodes (38): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+30 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+29 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-8949`, `RFC-8949`, `RFC-8949` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4215 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `Database`, `tape/index.ts`, `loop.ts`, `UmbraError`, `client.test.ts`, `fetch-fixtures.ts`, `startUmbraDB`, `InMemoryBlockSource`, `backup/restore.ts`, `ingest-harness.ts`, `ModuleDeclaration`, `NodeClient`, `config/history.ts`, `core-config.test.ts`, `ledger/types.ts`, `BlockRef`, `runner/process.ts`, `adapter-fixtures.ts`, `builds.ts`, `admin-harness.ts`, `process-backends.ts`, `core-transport.ts`, `module-tables.ts`, `.from`, `declaration.ts`, `ref_node_crypto`, `ref_node_path`, `core-block-parsed.ts`, `spawnChild`, `validation.ts`, `chain-process.test.ts`, `contract-modules.test.ts`, `contract-data-checks.ts`, `backup/backup.ts`, `private/backends.ts`, `cli/command.ts`, `config-check.ts`, `ledger/ledger-tasks.test.ts`, `pause-fixtures.ts`, `channels.ts`, `run.test.ts`, `validate.test.ts`, `core-ledger-state.ts`, `runtime-metadata.test.ts`, `ledger-units.test.ts`, `slow-block-harness.ts`, `column-rules.test.ts`, `entries.ts`, `sweep-tapes.ts`, `binding.test.ts`, `module-api.ts`, `boundary.test.ts`, `mapping.ts`, `core-settings.ts`, `api-session.test.ts`, `transport.test.ts`, `src/config/load.ts`, `interfaces/transaction-history-storage.ts`, `version-checks.ts`, `retirement.test.ts`, `example-checks.ts`, `refcount-model.ts`, `resolve.ts`, `private/lockstep-wait.test.ts`, `transport-faults.test.ts`, `state-trees.test.ts`, `paused-harness.ts`, `core-ledger-state/sql.ts`, `networks.ts`, `startup-stop-harness.ts`, `core-digest.ts`, `cbor.property.test.ts`, `package.json`, `browser.test.ts`, `order.property.test.ts`, `messages.ts`, `pg-tx-history-adapter.ts`, `release-version.ts`, `browser/build.ts`, `cold-boot-recovery.integration.test.ts`, `crash.test.ts`, `node-fields-harness.ts`, `containers.test.ts`, `pglite-lock.ts`, `postgres/transaction-history-storage.ts`, `api-server.test.ts`, `Lockstep`, `test/postgres/setup.ts`, `ledger-sweep.test.ts`, `documents.ts`, `code-registry.ts`, `read-gate.ts`, `resolve.test.ts`, `restore-private.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `redact.ts`, `failures.ts`, `surface.test.ts`, `version-table.ts`, `node-bridge.ts`, `block-fetch-decode.test.ts`, `envelope.ts`, `library-documents.test.ts`, `shims.test.ts`, `key-handling-checks.ts`, `db/writer-lock.test.ts`, `core-block-fetch.test.ts`, `excluded-not-exported.test.ts`, `text.test.ts`, `typescript`, `LoopPauses`, `resolver-boundary.ts`, `.publish`, `writer-lock-checks.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `cursor-table.property.test.ts`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `read-height.property.test.ts`, `twox.ts`, `worker-threads.test.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `postgres-image.test.ts`, `vendored-ledger-files.test.ts`, `pglite.test.ts`?**
  _High betweenness centrality (0.211) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-8949` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.014074738903394255 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `Database`, `resolve.test.ts`, `loop.ts`, `tape/index.ts`, `client.test.ts`, `fetch-fixtures.ts`, `startUmbraDB`, `InMemoryBlockSource`, `backup/restore.ts`, `ingest-harness.ts`, `ModuleDeclaration`, `NodeClient`, `config/history.ts`, `failures.ts`, `core-config.test.ts`, `BlockRef`, `runner/process.ts`, `version-table.ts`, `builds.ts`, `admin-harness.ts`, `core-block-commit/sql.ts`, `core-transport.ts`, `module-tables.ts`, `options.ts`, `process-backends.ts`, `declaration.ts`, `ref_node_path`, `envelope.ts`, `validation.ts`, `chain-process.test.ts`, `contract-modules.test.ts`, `backup/backup.ts`, `shims.test.ts`, `config-check.ts`, `pause-fixtures.ts`, `channels.ts`, `pglite-processes.ts`, `PgliteDatabase`, `db/writer-lock.test.ts`, `version`, `validate.test.ts`, `core-ledger-state.ts`, `runtime-metadata.test.ts`, `ledger-units.test.ts`, `slow-block-harness.ts`, `ApiRoutes`, `binding.test.ts`, `module-api.ts`, `mapping.ts`, `core-settings.ts`, `writer-lock-checks.ts`, `FinalizedLoop`, `statementsOf`, `src/config/load.ts`, `Process`, `checkShape`, `transport.test.ts`, `cbor.ts`, `version-checks.ts`, `web-lock.ts`, `checkParent`, `ledger/types.ts`, `resolve.ts`, `transport-faults.test.ts`, `browser/src/config/load.ts`, `JobQueue`, `Writer`, `Session`, `pglite-lock.ts`, `api-server.test.ts`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `tape/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02145813973135085 - nodes in this community are weakly interconnected._