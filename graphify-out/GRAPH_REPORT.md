# Graph Report - UmbraDB

## Corpus Check
- 1288 files · ~1,823,225 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13314 nodes · 41655 edges · 378 communities (343 shown, 35 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3470 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `6736161bab7de6b2` (1288 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- ledger/types.ts
- .from
- ref_node_url
- Worker
- .cwd
- cold-boot-recovery.integration.test.ts
- refcount-tables.test.ts
- release-version.ts
- code-registry.ts
- contract-data-checks.ts
- UmbraDBHandle
- redact.ts
- browser.test.ts
- node-set.test.ts
- process-worker.ts
- CheckedEntry
- postgres/transaction-history-storage.ts
- admin-harness.ts
- pglite-lock.ts
- block-fetch-decode.test.ts
- test/postgres/setup.ts
- documents.ts
- crash.test.ts
- fixtures/configuration.ts
- interfaces/transaction-history-storage.ts
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- roles.ts
- read-gate.ts
- start-umbradb.test.ts
- core.ts
- Buffer
- TransactionHistoryEntry
- pg-tx-history-adapter.ts
- restore-private.ts
- api-server.test.ts
- connectChannel
- declaration.ts
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- height-versioned.property.test.ts
- browser-harness.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- recovery.test.ts
- .value
- tape/index.ts
- cli/command.ts
- surface.test.ts
- node-bridge.ts
- HeightRun
- ledger/metadata.ts
- pack-install.mjs
- .concat
- NodeClient
- core-block-fetch.test.ts
- backbone/part-migrations.test.ts
- writer-lock-checks.ts
- demo-handlers.test.ts
- sigterm.test.ts
- core-block-fetch/metadata.ts
- library-documents.test.ts
- builder.test.ts
- src/ledger/identity.ts
- node-refs.ts
- version-table.ts
- refcount-tapes.ts
- GraphWorld
- chrome.ts
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- chain-events-decode.test.ts
- network.test.ts
- ref_node_fs
- restore-content-defined.test.ts
- LoopPauses
- adapter-fixtures.ts
- upgrade-boundary.test.ts
- statementsOf
- validation.test.ts
- ApiRoutes
- process-backends.ts
- database-parts.ts
- quiet-host.child.ts
- web-lock.ts
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- range.ts
- history.property.test.ts
- stats-module.ts
- validate.ts
- Design — Sprint 1: project setup + TemporalKV
- ws-mutual-tls.test.ts
- .send
- runtime-metadata.test.ts
- a114Run
- ProcessItems
- runner/process.ts
- ledger/plain-data.ts
- compare.ts
- sha256
- refused-configuration.test.ts
- pglite-writer.worker.ts
- taggedRootKey
- worker-output.test.ts
- BlockRef
- signal-backup.worker.ts
- process-admin.ts
- process-build.ts
- mutation-evidence.d.mts
- TransportProxy
- AsyncLocalStorage
- core-transport.ts
- channel-queue.test.ts
- HeldRead
- db/errors.ts
- adapter.ts
- client.test.ts
- messages.ts
- config/history.ts
- FinalizedLoop
- WriterProcess
- hex
- NodeFS
- Keeping
- core-block-parsed.ts
- core-ledger-state/sql.ts
- loop.ts
- backup/backup.ts
- mounted-admin.test.ts
- resolve.ts
- core-ledger-state.ts
- entries.ts
- refcount-model.ts
- validation.ts
- config/plain-data.test.ts
- opt-out.test.ts
- column-rules.ts
- refcount-restart.ts
- transport-faults.test.ts
- slow-block-harness.ts
- PgTransactionHistoryStorage
- cursor-table.test.ts
- InMemoryBlockSource
- chain-process.test.ts
- api-socket.ts
- ModuleDeclaration
- binding.test.ts
- listening.test.ts
- column-rules.test.ts
- loop-stop-harness.ts
- boundary.test.ts
- signal-ignored-fixtures.ts
- mapping.ts
- graph.ts
- checkShape
- UmbraError
- transform-checks.ts
- vitest
- retirement.test.ts
- guarantees.test.ts
- ledger-sweep.test.ts
- cbor.ts
- version-checks.ts
- config-hash-checks.ts
- start-umbradb.ts
- builds.ts
- configured.ts
- page.ts
- resolver-boundary.ts
- pause-fixtures.ts
- file-mode.test.ts
- events-fixtures.ts
- ChannelEndpoint
- node-fields-harness.ts
- networks.ts
- cbor.property.test.ts
- real-tapes.ts
- browser/build.ts
- module-api.ts
- ADDED Requirements
- refused
- version
- .slowBlockMs
- pglite-writer-processes.test.ts
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- text.test.ts
- api-session.test.ts
- twox.ts
- Design — v1.1.0: Quint model checking
- openssl
- Boundaries, threats and controls
- facade-merge-loader.ts
- Design — START-UMBRADB: UmbraDB as a library
- The laws of UmbraDB's storage helpers
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- fresh-instance.mjs
- package-keys-walk.mjs
- .open
- crash-worker.ts
- .put
- history
- startUmbraDB
- data
- code
- ADDED Requirements
- .off
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Requirement: BK-1 Backup
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- Requirement: DT-3 The contents hash
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- [0.10.0] - 2026-10-27
- scoped-review-manifest
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
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
- Vendored ledger builds
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00023 — The blocks table's height partitions end at 5,000,000
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
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream)
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- bug-report.md
- feature-request.md
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
- post-block-update/oracle/main.rs

## God Nodes (most connected - your core abstractions)
1. `vitest` - 465 edges
2. `UmbraError` - 357 edges
3. `ModuleDeclaration` - 211 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 139 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `Database` - 105 edges
9. `startUmbraDB()` - 103 edges
10. `PROCESS_BACKENDS` - 102 edges

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

## Communities (378 total, 35 thin omitted)

### Community 0 - "ledger/types.ts"
Cohesion: 0.02
Nodes (186): LoadLedger, TransactionParser, RetainedState, LedgerName, LedgerSource, ApplyInput, ApplyOutput, ChainOutcome (+178 more)

### Community 1 - ".from"
Cohesion: 0.02
Nodes (252): CoreLedgerStateOptions, RefcountFault, NodeBatch, contentsHash, FixtureRun, FixtureRunOptions, SourceClass, FileEntries (+244 more)

### Community 10 - "ref_node_url"
Cohesion: 0.02
Nodes (138): SslMode, PostgresConnection, ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted (+130 more)

### Community 101 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 102 - ".cwd"
Cohesion: 0.07
Nodes (30): Job, Run, join(), normalize(), resolve(), log(), delimiter, sep (+22 more)

### Community 103 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (22): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+14 more)

### Community 106 - "refcount-tables.test.ts"
Cohesion: 0.07
Nodes (27): NodeSetFault, NodeSetOptions, NodeTableCheck, Tables, first(), hexOf(), inconsistent(), keyOrdered() (+19 more)

### Community 107 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 109 - "code-registry.ts"
Cohesion: 0.10
Nodes (32): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+24 more)

### Community 11 - "contract-data-checks.ts"
Cohesion: 0.03
Nodes (149): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+141 more)

### Community 111 - "UmbraDBHandle"
Cohesion: 0.07
Nodes (27): MessagePortLike, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork, UmbraDBOptions (+19 more)

### Community 112 - "redact.ts"
Cohesion: 0.10
Nodes (27): RedactionForms, SecretForm, TextPattern, Needs, findings(), configRedactor(), credentialsIn(), decoded() (+19 more)

### Community 115 - "browser.test.ts"
Cohesion: 0.10
Nodes (31): Reachable, RestoreAttempt, PageRestore, continuedProblems(), midChainProblems(), networkProblems(), plain(), restoreProblems() (+23 more)

### Community 116 - "node-set.test.ts"
Cohesion: 0.08
Nodes (28): StoredRow, Tables, changedRow(), database(), databaseSql(), hexOf(), keyOf(), literal() (+20 more)

### Community 117 - "process-worker.ts"
Cohesion: 0.12
Nodes (22): Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, withDevelopmentOptIn(), answer(), backUp() (+14 more)

### Community 118 - "CheckedEntry"
Cohesion: 0.11
Nodes (27): ConfigFacts, SnapshotFacts, RestoreBase, BackupText, CommandBuildOptions, CheckState, ConfigCheckOptions, CommandConfig (+19 more)

### Community 119 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+11 more)

### Community 12 - "admin-harness.ts"
Cohesion: 0.03
Nodes (126): MountedAdminAnswer, adminRoutes, AdminEndpoint, AdminPart, ReadinessFacts, LifecycleStatus, ProcessState, AdminRun (+118 more)

### Community 120 - "pglite-lock.ts"
Cohesion: 0.10
Nodes (23): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, ChildResult, acquirePgliteLock() (+15 more)

### Community 122 - "block-fetch-decode.test.ts"
Cohesion: 0.10
Nodes (25): ExtrinsicCall, MetadataPallet, PalletSpec, blake2b256(), compress(), rotateRight(), words(), blockTimeOf() (+17 more)

### Community 123 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 124 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 125 - "crash.test.ts"
Cohesion: 0.11
Nodes (24): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+16 more)

### Community 126 - "fixtures/configuration.ts"
Cohesion: 0.09
Nodes (20): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+12 more)

### Community 127 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (22): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus, TransactionHistoryWriter (+14 more)

### Community 129 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.07
Nodes (27): GreyPicker, sweepReset(), 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents (+19 more)

### Community 13 - "roles.ts"
Cohesion: 0.02
Nodes (118): MultiStatementRunner, Difference, OwnPart, PlannedSchema, Provision, QualifiedTable, SchemaItem, SchemaModule (+110 more)

### Community 130 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 131 - "start-umbradb.test.ts"
Cohesion: 0.11
Nodes (19): ModuleListRule, GoneCwdResult, moduleListProblems(), closedByItself(), hostile(), optionProblems(), throwing(), problemsOf() (+11 more)

### Community 132 - "core.ts"
Cohesion: 0.13
Nodes (21): CommitOptions, PostgresRun, BenchEnv, ManualOpts, TinybenchOpts, Backend, Baseline, LatencyStats (+13 more)

### Community 133 - "Buffer"
Cohesion: 0.09
Nodes (21): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+13 more)

### Community 134 - "TransactionHistoryEntry"
Cohesion: 0.12
Nodes (9): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+1 more)

### Community 135 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (21): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+13 more)

### Community 136 - "restore-private.ts"
Cohesion: 0.16
Nodes (21): RestoreOutcome, FileProcess, privateBackup, PublicSetting, PublicSide, PublicSideOptions, runRestore(), heightsFrom() (+13 more)

### Community 137 - "api-server.test.ts"
Cohesion: 0.11
Nodes (20): AppendsVersion, Client, configHashesOf(), exchange(), helperProblems(), hex(), isConfigHash(), isVersion() (+12 more)

### Community 138 - "connectChannel"
Cohesion: 0.13
Nodes (15): SubscriptionCarrier, SubscriptionConnection, connectChannel(), errorMessage(), socketConnection(), fault(), 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once, Evidence (+7 more)

### Community 14 - "declaration.ts"
Cohesion: 0.03
Nodes (97): UmbraConfig, BlockWriteHandle, ReadHandle, SchemaWriteHandle, ErrorCode, cursorTable, CursorTableOptions, heightVersionedTable (+89 more)

### Community 140 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.08
Nodes (21): ReadPool, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider) (+13 more)

### Community 141 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 142 - "browser-harness.ts"
Cohesion: 0.14
Nodes (23): PageApiChannel, PageBackup, PageEvent, PageLink, ProcessName, StatusBody, apiChannel(), backupThrough() (+15 more)

### Community 143 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 144 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 145 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 146 - "recovery.test.ts"
Cohesion: 0.11
Nodes (24): ProcessStatus, Q142Observation, A43Observation, AlwaysLanded, AlwaysLost, DropsHeld, Fault, Recorded (+16 more)

### Community 147 - ".value"
Cohesion: 0.19
Nodes (10): MetadataType, ScaleReader, ValueReader, bytesArgument(), callVariant(), carried(), decodeChainEvents(), read() (+2 more)

### Community 15 - "tape/index.ts"
Cohesion: 0.04
Nodes (92): Failure, Variant, Link, TapeBuilder, TapeBuilderOptions, RecordingError, RecordingProblem, TapeError (+84 more)

### Community 150 - "cli/command.ts"
Cohesion: 0.14
Nodes (20): CommandHandler, CommandIo, MainProcess, CommandResult, backupArguments(), backupCommand(), checkArguments(), configCommand() (+12 more)

### Community 151 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 153 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 154 - "HeightRun"
Cohesion: 0.09
Nodes (10): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, LateRedelivery, SkipsStartAtRestart, CommitsDespiteLastWrite (+2 more)

### Community 156 - "ledger/metadata.ts"
Cohesion: 0.13
Nodes (10): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, MetadataSelector, OwnStateMetadata, contentStateOf() (+2 more)

### Community 157 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 158 - ".concat"
Cohesion: 0.12
Nodes (12): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+4 more)

### Community 16 - "NodeClient"
Cohesion: 0.04
Nodes (81): CoreChainBinding, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription (+73 more)

### Community 161 - "core-block-fetch.test.ts"
Cohesion: 0.12
Nodes (11): BlockHeaderItem, CoreBlockHeader, LedgerTable, coreBlockFetchOnFetch(), isBlockItemSource(), chainBackbone(), blockContext(), BOUND (+3 more)

### Community 162 - "backbone/part-migrations.test.ts"
Cohesion: 0.17
Nodes (17): ManifestMigration, PglitePathParts, FoldedPart, RecordedMigration, earlierBootstrapSql(), earlierRefusalProblems(), earlierRows(), earlierRowsSql() (+9 more)

### Community 163 - "writer-lock-checks.ts"
Cohesion: 0.24
Nodes (17): PauseReport, startWriter(), expectLockLostWhenTakenMeanwhile(), expectLockRetakenAfterTermination(), expectSecondPostgresWriterRefused(), lockReleased(), nextTransaction(), pidOf() (+9 more)

### Community 164 - "demo-handlers.test.ts"
Cohesion: 0.15
Nodes (17): Compared, ConnectSeen, PortPeer, comparedOfExchange(), comparedOfResponse(), connected(), engineOf(), fetchProblems() (+9 more)

### Community 165 - "sigterm.test.ts"
Cohesion: 0.15
Nodes (18): WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent, pairs(), workModule() (+10 more)

### Community 168 - "core-block-fetch/metadata.ts"
Cohesion: 0.29
Nodes (14): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 169 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 17 - "builder.test.ts"
Cohesion: 0.03
Nodes (69): Answer, Handler, Received, recorded, ConnectionFrames, Recorded, Failure, Variant (+61 more)

### Community 170 - "src/ledger/identity.ts"
Cohesion: 0.18
Nodes (19): ManifestLine, VerifyLedgerPackagesOptions, LedgerSourceSettings, checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+11 more)

### Community 171 - "node-refs.ts"
Cohesion: 0.19
Nodes (7): nodeKeys, ChildReader, ChildVisitor, Written, hashNode(), readChildList(), readChildren()

### Community 172 - "version-table.ts"
Cohesion: 0.18
Nodes (20): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+12 more)

### Community 173 - "refcount-tapes.ts"
Cohesion: 0.17
Nodes (12): StoredCheck, Reader, RefcountTape, Sampler, TapeReplay, outsideReport(), refcountTapeTests(), replayRefcountTape() (+4 more)

### Community 174 - "GraphWorld"
Cohesion: 0.27
Nodes (3): Dice, GraphWorld, driveHistory()

### Community 175 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 176 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 177 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 178 - "chain-events-decode.test.ts"
Cohesion: 0.14
Nodes (17): MetadataField, Primitive, canonicalJson(), hexOf(), littleEndian(), fill(), hexOf(), le() (+9 more)

### Community 179 - "network.test.ts"
Cohesion: 0.22
Nodes (16): NetworkRuleName, Parsed, Expected, runProcess(), commandRun(), schemaCase(), commandRefusalProblems(), listeningSockets() (+8 more)

### Community 18 - "ref_node_fs"
Cohesion: 0.05
Nodes (86): BackupBackend, BackupDatabase, killedRestore, TickerHandle, TickerProcess, WORKER, SignalEvent, cliProject (+78 more)

### Community 184 - "restore-content-defined.test.ts"
Cohesion: 0.14
Nodes (16): FileRow, node(), list(), bytesOf(), change(), fileRows(), nodeLine(), respelled() (+8 more)

### Community 187 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 19 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (106): StateSummary, CallTx, DeployTx, LedgerHeight, Upstream, contractFixture, Ledger, RawPackage (+98 more)

### Community 191 - "upgrade-boundary.test.ts"
Cohesion: 0.18
Nodes (15): versionEntry, HistoryOptions, TestBuildOptions, A47Observation, CommitsTheBoundary, Controls, Version, a47Problems() (+7 more)

### Community 194 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 195 - "validation.test.ts"
Cohesion: 0.17
Nodes (13): DeclarationRule, ShapeCase, Stats, validateWith(), declared(), contentDeclared(), failures(), firstItem() (+5 more)

### Community 196 - "ApiRoutes"
Cohesion: 0.19
Nodes (9): ApiRoutes, ModuleRegistration, AcceptsDuplicates, parsePath(), registerModuleApis(), shapeOf(), routesOf(), api() (+1 more)

### Community 2 - "process-backends.ts"
Cohesion: 0.02
Nodes (232): BlockParsed, Manifest, Restored, RestoreInput, NodeDatabase, itemsSeen, BlockSpec, Json (+224 more)

### Community 20 - "database-parts.ts"
Cohesion: 0.03
Nodes (89): CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState (+81 more)

### Community 202 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 203 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 208 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 209 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 21 - "range.ts"
Cohesion: 0.03
Nodes (94): NodeClientOptions, ConnectSocket, Outage, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+86 more)

### Community 214 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 218 - "stats-module.ts"
Cohesion: 0.32
Nodes (10): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+2 more)

### Community 22 - "validate.ts"
Cohesion: 0.03
Nodes (108): coreEntry, ImportedConfig, PlainArray, plainData, PlainDataNode, PlainDataRule, Walk, ConfigRule (+100 more)

### Community 220 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 222 - "ws-mutual-tls.test.ts"
Cohesion: 0.23
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 224 - "runtime-metadata.test.ts"
Cohesion: 0.33
Nodes (7): Boundary, TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), devnetUpgradeOf(), isCall()

### Community 225 - "a114Run"
Cohesion: 0.26
Nodes (3): TestLink, CountingLink, a114Run()

### Community 23 - "runner/process.ts"
Cohesion: 0.03
Nodes (53): NodeWait, ProcessReason, ReasonCode, RetryCode, Unwrapped, PauseBy, PauseHold, BoundAddress (+45 more)

### Community 233 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 234 - "compare.ts"
Cohesion: 0.27
Nodes (7): BaselineLoad, Comparison, compareToBaseline(), loadBaseline(), BASELINE_PATH, REGRESSION_FACTOR, dir

### Community 235 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 24 - "refused-configuration.test.ts"
Cohesion: 0.04
Nodes (90): EngineConfig, ProcessHandle, Answered, Start, Child, Refusal, Start, statsConfig (+82 more)

### Community 240 - "pglite-writer.worker.ts"
Cohesion: 0.31
Nodes (8): Job, cursor(), main(), open(), report(), statementScopedLock(), held, WORKER_SCHEMA

### Community 246 - "taggedRootKey"
Cohesion: 0.40
Nodes (3): Reader, readChild(), taggedRootKey()

### Community 247 - "worker-output.test.ts"
Cohesion: 0.22
Nodes (8): Seen, noisy(), outputProblems(), ADMIN_ENTRY, LEDGER_ENTRY, LOGGED, PGLITE_MEMORY, WRITTEN

### Community 25 - "BlockRef"
Cohesion: 0.04
Nodes (43): BlockEventSource, CoreBlockItems, BlockLedgerSource, RuntimeMetadataView, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch (+35 more)

### Community 254 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 26 - "process-admin.ts"
Cohesion: 0.04
Nodes (79): NetworkShown, AdminSeams, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, AdminChannel, AdminServeOptions, FromAdmin (+71 more)

### Community 27 - "process-build.ts"
Cohesion: 0.04
Nodes (76): ProcessingEnd, ProcessObservation, StartVia, A43Case, CursorElsewhere, Halt, Outcome, CoreSeen (+68 more)

### Community 272 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 28 - "core-transport.ts"
Cohesion: 0.03
Nodes (59): PrivateLinkAddress, PrivateLinkConnect, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransport (+51 more)

### Community 29 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (77): demoLink, EndpointOptions, Envelope, PrivateLinkChannel, controlledTimers, PeerEnd, PeerMessage, rawPeer (+69 more)

### Community 292 - "HeldRead"
Cohesion: 0.60
Nodes (3): HeldRead, concurrent(), queued()

### Community 3 - "db/errors.ts"
Cohesion: 0.02
Nodes (162): ReadOptions, Transaction, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadTimeoutSetting, Job (+154 more)

### Community 30 - "adapter.ts"
Cohesion: 0.04
Nodes (75): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+67 more)

### Community 31 - "client.test.ts"
Cohesion: 0.03
Nodes (42): NodeRetry, NodeSocketEvents, HandSocket, HandSockets, FakeNode, ManualTimers, connectWebSocket(), bytes() (+34 more)

### Community 32 - "messages.ts"
Cohesion: 0.04
Nodes (55): PublicSide, Committed, HelloAck, JsonValue, MessageFault, ReadResult, StatementResult, CarrierConnection (+47 more)

### Community 33 - "config/history.ts"
Cohesion: 0.05
Nodes (78): CoreVersion, HistoryCode, HistoryContext, HistoryFinding, ProvidesRow, Span, PlacedEntry, UpgradeEntry (+70 more)

### Community 34 - "FinalizedLoop"
Cohesion: 0.05
Nodes (20): PointRun, Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, SkipsLockstep, WaitingInRead, SilentHalt (+12 more)

### Community 35 - "hex"
Cohesion: 0.06
Nodes (60): FreshInstanceRequest, FreshInstanceResult, StoredNode, GenesisNodes, Disposable, NodeBatch, NodeStoreExports, NodeStoreSubject (+52 more)

### Community 37 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (72): BodyExtrinsic, BlockBody, MetadataVariant, BlockParsedOptions, BlockTransaction, ChainTransaction, ChainEvent, EventPhase (+64 more)

### Community 39 - "core-ledger-state/sql.ts"
Cohesion: 0.05
Nodes (65): KeyCounts, RefcountCheck, RefcountStatement, refcountStep, RefcountTables, StateRow, StoredState, GreyView (+57 more)

### Community 4 - "loop.ts"
Cohesion: 0.02
Nodes (217): GraphInput, HeightRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointSchedule, CommitOutcome (+209 more)

### Community 40 - "backup/backup.ts"
Cohesion: 0.05
Nodes (66): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, ManifestTool, PgliteDump, SnapshotSeams (+58 more)

### Community 41 - "mounted-admin.test.ts"
Cohesion: 0.06
Nodes (59): gate, SecretHashes, SecretVariant, Expected, SubscriptionSeen, Client, Exchanged, MapiHooks (+51 more)

### Community 42 - "resolve.ts"
Cohesion: 0.04
Nodes (66): AddressRequest, Asked, LinkPlan, NetworkInput, NetworkPlan, NetworkProblem, NetworkRequest, NetworkRule (+58 more)

### Community 44 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (56): ComputedBlock, LedgerBinding, LedgerStateItem, retainedStates, CoreRevision, ContractKeys, blockHeaderOf(), boundLedgerParser() (+48 more)

### Community 45 - "entries.ts"
Cohesion: 0.03
Nodes (63): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase (+55 more)

### Community 47 - "refcount-model.ts"
Cohesion: 0.05
Nodes (56): Node, BlockKind, BlockScript, BoundaryRewrite, DrivenBlock, GeneratedBlock, GeneratedState, GraphNode (+48 more)

### Community 48 - "validation.ts"
Cohesion: 0.05
Nodes (60): AllowedDetail, RevisionSettings, EntryView, RecordedView, SanitizedError, ManifestHistoryRow, PlainObject, RedactableConfig (+52 more)

### Community 49 - "config/plain-data.test.ts"
Cohesion: 0.05
Nodes (40): Served, Row, Finding, BlockImport, ChildResult, CodeBlock, installedProject, plainDataWith() (+32 more)

### Community 5 - "opt-out.test.ts"
Cohesion: 0.02
Nodes (198): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, CheckedMigration, CanonicalEncodingError, ContentOptions (+190 more)

### Community 50 - "column-rules.ts"
Cohesion: 0.04
Nodes (67): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+59 more)

### Community 51 - "refcount-restart.ts"
Cohesion: 0.06
Nodes (50): BatchJson, databaseNow, Hold, Light, Line, NodeSetKeeper, Observed, observedRun (+42 more)

### Community 52 - "transport-faults.test.ts"
Cohesion: 0.06
Nodes (45): Message, MessageType, Ended, rawClient, Escape, publicState, Refused, hexOf() (+37 more)

### Community 53 - "slow-block-harness.ts"
Cohesion: 0.08
Nodes (51): BlockItemSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+43 more)

### Community 54 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (53): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema (+45 more)

### Community 55 - "cursor-table.test.ts"
Cohesion: 0.05
Nodes (45): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, CursorValue, Case, cursorDatabase (+37 more)

### Community 56 - "InMemoryBlockSource"
Cohesion: 0.05
Nodes (36): ChainCheck, ChainCheckInput, InMemoryBlockSource, InMemoryItems, Wait, EngineOptions, Flaky, RestoreJob (+28 more)

### Community 57 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (45): Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+37 more)

### Community 58 - "api-socket.ts"
Cohesion: 0.08
Nodes (50): coreHeaders, HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions (+42 more)

### Community 6 - "ModuleDeclaration"
Cohesion: 0.02
Nodes (177): OpenedConfig, OpenedFacts, BlockRow, CoreChainFacts, DumpInput, HistoryCheck, HistoryRow, HistoryRule (+169 more)

### Community 60 - "binding.test.ts"
Cohesion: 0.07
Nodes (45): PrivateIntakeOptions, startHashDecision, A165Options, a165Run, Attempt, TestDatabase, A113Observation, A156Observation (+37 more)

### Community 61 - "listening.test.ts"
Cohesion: 0.06
Nodes (40): Validator, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, Pem (+32 more)

### Community 62 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TreeNode, TypeRule, DesignTable (+24 more)

### Community 64 - "loop-stop-harness.ts"
Cohesion: 0.09
Nodes (42): A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore (+34 more)

### Community 65 - "boundary.test.ts"
Cohesion: 0.08
Nodes (45): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+37 more)

### Community 66 - "signal-ignored-fixtures.ts"
Cohesion: 0.05
Nodes (38): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, EngineInput, UserModulesSource (+30 more)

### Community 67 - "mapping.ts"
Cohesion: 0.07
Nodes (38): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+30 more)

### Community 68 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+40 more)

### Community 69 - "checkShape"
Cohesion: 0.07
Nodes (41): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+33 more)

### Community 7 - "UmbraError"
Cohesion: 0.02
Nodes (149): PostgresConnection, PostgresOptions, Bound, ChainSource, ConfiguredGenesis, WaitingListener, ChainIdentity, ConfigRow (+141 more)

### Community 70 - "transform-checks.ts"
Cohesion: 0.10
Nodes (32): TransformError, NotificationRange, baseRecords(), expectedText(), expectVariantOutput(), forkRecords(), changedLines(), checkTape() (+24 more)

### Community 72 - "vitest"
Cohesion: 0.06
Nodes (23): Lockfile, Manifest, Upstream, gateAdapters(), tallyMutants(), sweepTapeCase(), filesUnder(), patchesOf() (+15 more)

### Community 73 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 74 - "guarantees.test.ts"
Cohesion: 0.07
Nodes (26): CloseHelper, Hold, Signal, FaultedClose, QuietResult, Job, closeSteps(), HOLDS (+18 more)

### Community 75 - "ledger-sweep.test.ts"
Cohesion: 0.08
Nodes (23): SweepState, SweepTables, SweepWrites, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel (+15 more)

### Community 76 - "cbor.ts"
Cohesion: 0.09
Nodes (37): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+29 more)

### Community 77 - "version-checks.ts"
Cohesion: 0.10
Nodes (36): CallRecord, CountingNode, Select, UpgradeCase, Walk, Answers, toHex(), H() (+28 more)

### Community 78 - "config-hash-checks.ts"
Cohesion: 0.07
Nodes (24): Report, A162Options, a162Run, HeaderSeen, HeldLink, HoldingRelay, ReportRelay, RetargetProxy (+16 more)

### Community 79 - "start-umbradb.ts"
Cohesion: 0.10
Nodes (41): Finding, readOptions, named(), addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding() (+33 more)

### Community 8 - "builds.ts"
Cohesion: 0.03
Nodes (143): AdminStarter, PostgresParts, LockstepCondition, LockstepInstance, A176Options, OpenTransaction, PrivateBackend, SessionSeen (+135 more)

### Community 80 - "configured.ts"
Cohesion: 0.09
Nodes (38): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, commandTarget, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget (+30 more)

### Community 81 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 82 - "resolver-boundary.ts"
Cohesion: 0.08
Nodes (38): TypeCheckFinding, TypeCheckResult, Access, AllowedRead, Boundary, Crossing, Guard, configCompilerOptions() (+30 more)

### Community 83 - "pause-fixtures.ts"
Cohesion: 0.08
Nodes (31): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, PausesInsideTheHeight (+23 more)

### Community 84 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (31): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+23 more)

### Community 86 - "events-fixtures.ts"
Cohesion: 0.12
Nodes (32): Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, metadataWith(), dispatchInfo() (+24 more)

### Community 89 - "ChannelEndpoint"
Cohesion: 0.11
Nodes (13): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), discard(), isChannel(), queuedSlowProblems() (+5 more)

### Community 9 - "node-fields-harness.ts"
Cohesion: 0.03
Nodes (146): NodeCallOptions, ProcessCondition, EventSpec, RecordingClient, A168Observation, A168Phase, A168RunOptions, Expected (+138 more)

### Community 90 - "networks.ts"
Cohesion: 0.06
Nodes (36): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+28 more)

### Community 91 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (37): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+29 more)

### Community 92 - "real-tapes.ts"
Cohesion: 0.08
Nodes (32): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+24 more)

### Community 93 - "browser/build.ts"
Cohesion: 0.07
Nodes (29): BrowserBuild, BrowserBuildOptions, BrowserControl, checkedLedgers, pageBench, PageServer, browserLedgerEntry(), browserPlugin() (+21 more)

### Community 97 - "module-api.ts"
Cohesion: 0.09
Nodes (27): ChainDataAnswer, ApiError, ApiErrorCode, ApiRequest, ApiResponse, HttpHandler, HttpMethod, HttpRoute (+19 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+27 more)

### Community 46 - "refused"
Cohesion: 0.04
Nodes (64): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+56 more)

### Community 63 - "version"
Cohesion: 0.04
Nodes (51): side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+43 more)

### Community 108 - ".slowBlockMs"
Cohesion: 0.07
Nodes (30): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+22 more)

### Community 159 - "pglite-writer-processes.test.ts"
Cohesion: 0.13
Nodes (19): blocksIn(), cleanUp(), firstOf(), startWriterProcess(), workDirectory(), dataDirectory(), expectPausedWriterKeepsLock(), expectRestartAfterKillContinues() (+11 more)

### Community 160 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 197 - "text.test.ts"
Cohesion: 0.21
Nodes (8): createReadStream(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir, 16. Browser

### Community 201 - "api-session.test.ts"
Cohesion: 0.17
Nodes (13): answerNotServing(), byteLength(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing(), refuseNotServing(), throwing() (+5 more)

### Community 207 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 213 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 216 - "openssl"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 217 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 219 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 252 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.22
Nodes (7): 0. Baseline, 1. Source layout, 2. Architecture, 6. User modules and the ledger worker, 7.2 Refusal classes, 7. Guarantees and refusals, Design — START-UMBRADB: UmbraDB as a library

### Community 260 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.29
Nodes (6): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers

### Community 264 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 293 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 337 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 338 - "package-keys-walk.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 349 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 36 - ".put"
Cohesion: 0.03
Nodes (76): T(), input(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed (+68 more)

### Community 38 - "history"
Cohesion: 0.03
Nodes (75): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+67 more)

### Community 43 - "startUmbraDB"
Cohesion: 0.04
Nodes (63): text(), transportReader(), transportReaderRule(), startUmbraDB(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix (+55 more)

### Community 59 - "data"
Cohesion: 0.04
Nodes (58): params(), n(), data(), 7. The module API, 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants, 2.4 Migrations: one per part (O-2) (+50 more)

### Community 71 - "code"
Cohesion: 0.05
Nodes (45): code(), Added, 15. Relation to the existing design documents, Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog (+37 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 94 - ".off"
Cohesion: 0.05
Nodes (36): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears (+28 more)

### Community 98 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.06
Nodes (37): 5. WalletState envelope, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll (+29 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 114 - "package.json"
Cohesion: 0.06
Nodes (33): bin, umbradb, bugs, url, description, optional, engines, node (+25 more)

### Community 121 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 149 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 155 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 166 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.09
Nodes (21): 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words, 4.1 Reachability does not depend on the form (+13 more)

### Community 167 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 180 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 181 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 182 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 185 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 186 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 188 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 189 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 190 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 192 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.12
Nodes (11): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+3 more)

### Community 193 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 198 - "README.md"
Cohesion: 0.19
Nodes (6): Choosing a database, Launching it, stats-module, Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 199 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 200 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+6 more)

### Community 204 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 205 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 206 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 210 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 211 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 212 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 215 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 221 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 226 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 227 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 228 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 230 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 231 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 232 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 236 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 237 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 238 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 239 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 241 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 242 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 243 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 244 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 245 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 248 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 249 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 250 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 251 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 253 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 255 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 256 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 257 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 258 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 259 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 261 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 262 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 263 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 265 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 266 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 267 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 268 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 269 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 270 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 271 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 273 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 276 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 277 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 278 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 279 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 280 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 281 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 282 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 283 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 284 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 285 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 286 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 287 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 288 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 289 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 290 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 291 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 294 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 295 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 296 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 297 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 298 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 299 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 300 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 301 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 302 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 303 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 304 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 305 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 306 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 307 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 308 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 309 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 310 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 311 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 312 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 313 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 314 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 315 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 316 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 317 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 318 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 319 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 320 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 321 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 322 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 323 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 324 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 325 - "00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered"
Cohesion: 0.40
Nodes (4): 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered, Evidence, Problem, Suggested fix

### Community 326 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 327 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 328 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 329 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 330 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 331 - "00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream)"
Cohesion: 0.40
Nodes (4): 00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream), Evidence, Problem, Suggested fix (upstream; the ledger team's choice)

### Community 332 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 333 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 334 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 335 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 336 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 339 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 340 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 341 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 342 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 343 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 344 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 345 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 346 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 96 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-8949`, `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4359 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ledger/types.ts`, `.from`, `process-backends.ts`, `db/errors.ts`, `loop.ts`, `opt-out.test.ts`, `ModuleDeclaration`, `UmbraError`, `builds.ts`, `node-fields-harness.ts`, `ref_node_url`, `contract-data-checks.ts`, `admin-harness.ts`, `roles.ts`, `declaration.ts`, `tape/index.ts`, `NodeClient`, `builder.test.ts`, `ref_node_fs`, `adapter-fixtures.ts`, `database-parts.ts`, `range.ts`, `validate.ts`, `runner/process.ts`, `refused-configuration.test.ts`, `BlockRef`, `process-admin.ts`, `process-build.ts`, `core-transport.ts`, `channel-queue.test.ts`, `adapter.ts`, `client.test.ts`, `messages.ts`, `config/history.ts`, `hex`, `core-block-parsed.ts`, `core-ledger-state/sql.ts`, `backup/backup.ts`, `mounted-admin.test.ts`, `resolve.ts`, `core-ledger-state.ts`, `entries.ts`, `refcount-model.ts`, `validation.ts`, `config/plain-data.test.ts`, `refcount-restart.ts`, `transport-faults.test.ts`, `slow-block-harness.ts`, `cursor-table.test.ts`, `InMemoryBlockSource`, `chain-process.test.ts`, `binding.test.ts`, `listening.test.ts`, `column-rules.test.ts`, `loop-stop-harness.ts`, `boundary.test.ts`, `signal-ignored-fixtures.ts`, `mapping.ts`, `transform-checks.ts`, `retirement.test.ts`, `guarantees.test.ts`, `ledger-sweep.test.ts`, `version-checks.ts`, `config-hash-checks.ts`, `start-umbradb.ts`, `configured.ts`, `resolver-boundary.ts`, `pause-fixtures.ts`, `file-mode.test.ts`, `networks.ts`, `cbor.property.test.ts`, `real-tapes.ts`, `browser/build.ts`, `Worker`, `cold-boot-recovery.integration.test.ts`, `refcount-tables.test.ts`, `release-version.ts`, `code-registry.ts`, `redact.ts`, `package.json`, `browser.test.ts`, `node-set.test.ts`, `process-worker.ts`, `postgres/transaction-history-storage.ts`, `pglite-lock.ts`, `block-fetch-decode.test.ts`, `test/postgres/setup.ts`, `documents.ts`, `crash.test.ts`, `read-gate.ts`, `start-umbradb.test.ts`, `pg-tx-history-adapter.ts`, `restore-private.ts`, `api-server.test.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `recovery.test.ts`, `cli/command.ts`, `surface.test.ts`, `node-bridge.ts`, `pglite-writer-processes.test.ts`, `core-block-fetch.test.ts`, `backbone/part-migrations.test.ts`, `writer-lock-checks.ts`, `demo-handlers.test.ts`, `sigterm.test.ts`, `library-documents.test.ts`, `src/ledger/identity.ts`, `refcount-tapes.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `chain-events-decode.test.ts`, `network.test.ts`, `excluded-not-exported.test.ts`, `restore-content-defined.test.ts`, `LoopPauses`, `upgrade-boundary.test.ts`, `statementsOf`, `validation.test.ts`, `text.test.ts`, `api-session.test.ts`, `web-lock.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `ws-mutual-tls.test.ts`, `runtime-metadata.test.ts`, `ledger/plain-data.ts`, `compare.ts`, `worker-output.test.ts`?**
  _High betweenness centrality (0.202) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-3339`, `@stryker-mutator/core` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ledger/types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01890443296375844 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `ledger/types.ts`, `.from`, `process-backends.ts`, `db/errors.ts`, `loop.ts`, `opt-out.test.ts`, `ModuleDeclaration`, `builds.ts`, `node-fields-harness.ts`, `contract-data-checks.ts`, `admin-harness.ts`, `roles.ts`, `declaration.ts`, `tape/index.ts`, `NodeClient`, `builder.test.ts`, `ref_node_fs`, `database-parts.ts`, `range.ts`, `validate.ts`, `runner/process.ts`, `refused-configuration.test.ts`, `BlockRef`, `process-admin.ts`, `process-build.ts`, `core-transport.ts`, `channel-queue.test.ts`, `client.test.ts`, `messages.ts`, `config/history.ts`, `FinalizedLoop`, `core-ledger-state/sql.ts`, `backup/backup.ts`, `mounted-admin.test.ts`, `resolve.ts`, `startUmbraDB`, `core-ledger-state.ts`, `entries.ts`, `refcount-model.ts`, `validation.ts`, `config/plain-data.test.ts`, `transport-faults.test.ts`, `slow-block-harness.ts`, `cursor-table.test.ts`, `InMemoryBlockSource`, `chain-process.test.ts`, `binding.test.ts`, `loop-stop-harness.ts`, `mapping.ts`, `graph.ts`, `checkShape`, `transform-checks.ts`, `guarantees.test.ts`, `cbor.ts`, `version-checks.ts`, `start-umbradb.ts`, `configured.ts`, `pause-fixtures.ts`, `module-api.ts`, `.cwd`, `refcount-tables.test.ts`, `UmbraDBHandle`, `process-worker.ts`, `CheckedEntry`, `pglite-lock.ts`, `api-server.test.ts`, `ledger/metadata.ts`, `backbone/part-migrations.test.ts`, `writer-lock-checks.ts`, `src/ledger/identity.ts`, `version-table.ts`, `upgrade-boundary.test.ts`, `statementsOf`, `validation.test.ts`, `ApiRoutes`, `web-lock.ts`, `browser/src/config/load.ts`, `runtime-metadata.test.ts`, `sha256`, `pglite-writer.worker.ts`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `.from` be split into smaller, more focused modules?**
  _Cohesion score 0.02158242140003474 - nodes in this community are weakly interconnected._