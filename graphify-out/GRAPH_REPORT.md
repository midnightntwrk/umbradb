# Graph Report - UmbraDB

## Corpus Check
- 1279 files · ~1,815,949 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13268 nodes · 41382 edges · 382 communities (345 shown, 37 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3460 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `4356b8461fbcd8d4` (1279 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- declaration.ts
- UmbraError
- module-api.ts
- BlockItems
- determinism-checks.ts
- core-ledger-state/sql.ts
- cold-boot-recovery.integration.test.ts
- PrivateTransport
- networks.ts
- browser.test.ts
- startUmbraDB
- paused-harness.ts
- Worker
- release-version.ts
- cbor.property.test.ts
- version-checks.ts
- browser/build.ts
- messages.ts
- ref_node_events
- page.ts
- .concat
- code-registry.ts
- reason
- items.ts
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- process-backends.ts
- height-versioned.property.test.ts
- pg-tx-history-adapter.ts
- accepted-hash-checks.ts
- node-fields-harness.ts
- documents.ts
- crash.test.ts
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- read-gate.ts
- tape/index.ts
- restore-private.ts
- node-bridge.ts
- readiness.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- .send
- validation.test.ts
- host.ts
- ledger-sweep.test.ts
- lockstep-refusals.test.ts
- binding.test.ts
- block-fetch-decode.test.ts
- sqlite-warning.test.ts
- pack-install.mjs
- hex
- pglite-outside-reads.ts
- refcount.ts
- browser-harness.ts
- .#log
- digest.test.ts
- ProcessHandle
- signal-ignored-fixtures.ts
- NodeClient
- sweepStep
- version-table.ts
- ingest-faults.test.ts
- transaction-history-storage.property.test.ts
- package-startup-checks.ts
- config-hash-checks.ts
- ProcessAdmin
- record-and-replay.test.ts
- Process
- chain-events-source.test.ts
- checkShape
- Lockstep
- HoldingRelay
- backbone/part-migrations.test.ts
- InMemoryBlockSource
- cursor-table.property.test.ts
- listening.test.ts
- statementsOf
- pglite-timeouts.test.ts
- private/lockstep-wait.test.ts
- in8.ts
- migrate.ts
- restore-content-defined.test.ts
- shims.test.ts
- intake.test.ts
- read-height.property.test.ts
- quiet-host.child.ts
- web-lock.ts
- stats-module.ts
- client.test.ts
- admin/lifecycle.test.ts
- browser/src/config/load.ts
- answerAdmin
- loop.ts
- history.property.test.ts
- sha256
- startWorkerProcess
- buffer.ts
- Design — Sprint 1: project setup + TemporalKV
- channel-queue.test.ts
- ws-mutual-tls.test.ts
- .#close
- TapeAnswers
- FinalizedLoop
- child-processes.ts
- ingest-crash.worker.ts
- pglite-directory-fixtures.ts
- in-memory-source.ts
- ProcessItems
- signal-backup.worker.ts
- ledger/plain-data.ts
- spawnChild
- mutation-evidence.d.mts
- api.ts
- AsyncLocalStorage
- adapter.ts
- runner/process.ts
- ledger-storage.test.ts
- pageBench
- refcount-model.ts
- mounted-admin.test.ts
- config-check.ts
- aborted
- core-block-parsed.ts
- PageState
- vitest
- PageApiChannel
- ApiChannel
- NodeFS
- ledger-state.test.ts
- LedgerPackage
- api-server.test.ts
- node-set.test.ts
- opt-out.test.ts
- range.ts
- ledger/types.ts
- start-umbradb.ts
- NodeBlockSource
- PgTransactionHistoryStorage
- ledger/ledger-tasks.test.ts
- contract-modules.test.ts
- sweep-tapes.ts
- chain-process.test.ts
- backup/restore.ts
- ref_node_timers
- core-block-commit.test.ts
- column-rules.ts
- fetch-fixtures.ts
- cli/command.ts
- process-build.ts
- contract-data-checks.ts
- node.test.ts
- adapter-fixtures.ts
- .value
- database-parts.ts
- refcount-restart.ts
- slow-block-harness.ts
- refused-configuration.test.ts
- loop-stop-harness.ts
- run.test.ts
- interfaces/transaction-history-storage.ts
- validate.ts
- process-harness.ts
- column-rules.test.ts
- builds.ts
- refcount-conversion.ts
- chain-events-decode.test.ts
- core-settings.ts
- cbor.ts
- admin/types.ts
- server.ts
- chain-data.test.ts
- backup-fixtures.ts
- resolver-boundary.ts
- boundary.test.ts
- graph.ts
- surface.test.ts
- retirement.test.ts
- ChannelEndpoint
- .from
- mapping.ts
- core-ledger-state.ts
- transform-checks.ts
- loop.test.ts
- BlockRef
- both-backends.test.ts
- real-tapes.ts
- ref_node_fs
- Problem
- data
- .off
- graph.py
- ADDED Requirements
- core-ledger-state.test.ts
- node-source-status.test.ts
- .slowBlockMs
- .disconnect
- mutation-per-adapter.mjs
- .#startup
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- twox.ts
- Design — v1.1.0: Quint model checking
- .boolean
- openssl
- facade-merge-loader.ts
- core-block-fetch.test.ts
- test-processes.test.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- crash-worker.ts
- fs.ts
- refused
- history
- table
- code
- .put
- T
- ADDED Requirements
- post-block-update/oracle/main.rs
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- Requirement: BK-1 Backup
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- README.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- Boundaries, threats and controls
- Requirement: DT-3 The contents hash
- Design — Sprint 4: Watermarks
- explore.md
- ROADMAP.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
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
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
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
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
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
- 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone
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
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- 00082 — Two processes making their first start at once on one PostgreSQL server race on the module roles
- bug-report.md
- feature-request.md
- Requirement: RN-16 Chain-data reads name their view and height
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Test wallets
- Requirement: RN-13 SIGTERM stops cleanly
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 458 edges
2. `UmbraError` - 357 edges
3. `ModuleDeclaration` - 210 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 139 edges
6. `NodeClient` - 116 edges
7. `Database` - 105 edges
8. `BlockRef` - 105 edges
9. `startUmbraDB()` - 103 edges
10. `ReadHandle` - 98 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: A callback fails during startup` --references--> `UmbraError`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/deterministic-postgresql/errors.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (382 total, 37 thin omitted)

### Community 0 - "declaration.ts"
Cohesion: 0.02
Nodes (258): ConfigRow, CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput (+250 more)

### Community 1 - "UmbraError"
Cohesion: 0.02
Nodes (195): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions (+187 more)

### Community 10 - "module-api.ts"
Cohesion: 0.03
Nodes (110): coreHeaders, HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions (+102 more)

### Community 100 - "BlockItems"
Cohesion: 0.07
Nodes (17): QueuedBlock, ItemSink, BlockItems, LateUse, LoopPause, LoopPaused, LoopPauses, LoopPausesOptions (+9 more)

### Community 101 - "determinism-checks.ts"
Cohesion: 0.11
Nodes (28): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, TestLink, directPublic(), refusalOf(), startPrivate() (+20 more)

### Community 102 - "core-ledger-state/sql.ts"
Cohesion: 0.11
Nodes (34): StateRow, StoredState, SweepPhase, sqlRefcountTables(), allGreyKeys(), bytesOf(), changedNodes(), clearGrey() (+26 more)

### Community 105 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (24): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+16 more)

### Community 106 - "PrivateTransport"
Cohesion: 0.09
Nodes (18): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), privateSideProblems() (+10 more)

### Community 108 - "networks.ts"
Cohesion: 0.07
Nodes (34): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+26 more)

### Community 109 - "browser.test.ts"
Cohesion: 0.08
Nodes (35): Reachable, RestoreAttempt, PageRestore, PageRequest, heldClock, continuedProblems(), midChainProblems(), networkProblems() (+27 more)

### Community 11 - "startUmbraDB"
Cohesion: 0.02
Nodes (126): UmbraDBStarted, join(), normalize(), resolve(), text(), transportReader(), transportReaderRule(), startUmbraDB() (+118 more)

### Community 111 - "paused-harness.ts"
Cohesion: 0.12
Nodes (29): Body, PausedExpectation, Read, Reader, Running, a176Project(), keeperModule(), keepingPause() (+21 more)

### Community 112 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 115 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 117 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 118 - "version-checks.ts"
Cohesion: 0.15
Nodes (29): Boundary, CallRecord, CountingNode, Select, UpgradeCase, Walk, Answers, toHex() (+21 more)

### Community 119 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 12 - "messages.ts"
Cohesion: 0.03
Nodes (96): PrivateLinkAddress, PrivateLinkConnect, EndpointOptions, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected (+88 more)

### Community 120 - "ref_node_events"
Cohesion: 0.08
Nodes (23): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+15 more)

### Community 121 - "page.ts"
Cohesion: 0.08
Nodes (29): LinkRecord, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp(), beginCore(), element() (+21 more)

### Community 122 - ".concat"
Cohesion: 0.07
Nodes (22): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+14 more)

### Community 123 - "code-registry.ts"
Cohesion: 0.10
Nodes (30): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+22 more)

### Community 126 - "reason"
Cohesion: 0.07
Nodes (28): TransactionHistoryStorage, reason(), 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it, Evidence, Problem, Suggested fix, Impact, Non-goals (+20 more)

### Community 127 - "items.ts"
Cohesion: 0.10
Nodes (15): BlockHeaderItem, BodyExtrinsic, CoreBlockHeader, CoreBlockItems, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry (+7 more)

### Community 129 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.07
Nodes (22): ReadPool, rollBack(), 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED) (+14 more)

### Community 13 - "process-backends.ts"
Cohesion: 0.04
Nodes (112): SourceClass, Touches, Cbor, DigestRow, DigestRows, Reader, Fault, FaultRun (+104 more)

### Community 130 - "height-versioned.property.test.ts"
Cohesion: 0.12
Nodes (23): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+15 more)

### Community 131 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 133 - "accepted-hash-checks.ts"
Cohesion: 0.12
Nodes (24): startHashDecision, a165Run, Attempt, privateCursorHeight(), a165Problems(), contentsOf(), cursorOf(), headerHash() (+16 more)

### Community 134 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (24): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Run() (+16 more)

### Community 135 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 136 - "crash.test.ts"
Cohesion: 0.11
Nodes (24): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+16 more)

### Community 138 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.07
Nodes (27): GreyPicker, sweepReset(), 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents (+19 more)

### Community 139 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 14 - "tape/index.ts"
Cohesion: 0.04
Nodes (96): Recorded, BoundaryReading, Link, RecordingProblem, TapeProblem, TransformError, TransformProblem, readRequest (+88 more)

### Community 140 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+14 more)

### Community 142 - "node-bridge.ts"
Cohesion: 0.11
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 143 - "readiness.test.ts"
Cohesion: 0.12
Nodes (23): Decision, ask(), statusWhen(), probedThroughHold(), seenIn(), configWhen(), valid(), probedThrough() (+15 more)

### Community 144 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 145 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 146 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 148 - ".send"
Cohesion: 0.14
Nodes (10): Cdp, ChromeBrowser, ChromeTab, chrome(), chrome(), chromePath(), exitsWithin(), launchChrome() (+2 more)

### Community 149 - "validation.test.ts"
Cohesion: 0.10
Nodes (17): DeclarationRule, Case, ShapeCase, Stats, schemaName(), first(), validateWith(), module() (+9 more)

### Community 15 - "host.ts"
Cohesion: 0.04
Nodes (89): LoadLedger, LedgerStateItem, RetainedState, LedgerName, LedgerTask, LedgerTaskBlock, ParsedTransaction, StateSummary (+81 more)

### Community 150 - "ledger-sweep.test.ts"
Cohesion: 0.15
Nodes (14): GreyView, SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, BYTE_ORDER(), bigints() (+6 more)

### Community 151 - "lockstep-refusals.test.ts"
Cohesion: 0.16
Nodes (22): Entry, LockstepCondition, LockstepInstance, LockstepOptions, LockstepRefusal, PublicCore, A118Observation, MismatchObservation (+14 more)

### Community 152 - "binding.test.ts"
Cohesion: 0.13
Nodes (20): TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, a113Problems(), a113Run() (+12 more)

### Community 156 - "block-fetch-decode.test.ts"
Cohesion: 0.14
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 157 - "sqlite-warning.test.ts"
Cohesion: 0.10
Nodes (17): EmitWarning, WarningHook, ChildResult, QuietRun, isSqliteWarning(), quietImport(), runQuietChild(), PGLITE_LOCK_SUFFIX (+9 more)

### Community 159 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 16 - "hex"
Cohesion: 0.04
Nodes (94): nodeKeys, StoredNode, Reader, NodeKeyTape, Written, GenesisNodes, Disposable, NodeBatch (+86 more)

### Community 160 - "pglite-outside-reads.ts"
Cohesion: 0.14
Nodes (15): LoadOutcome, OutsideRead, Traced, PgliteTestDatabase, PgliteTestServer, pgliteBackend(), expectNoOutsideReads(), outsideReads() (+7 more)

### Community 162 - "refcount.ts"
Cohesion: 0.14
Nodes (17): ComputedBlock, KeyCounts, RefcountStatement, refcountStep, RefcountTables, bytesOf(), chunksOf(), hexOf() (+9 more)

### Community 164 - "browser-harness.ts"
Cohesion: 0.17
Nodes (22): PageBackup, PageEvent, PageLink, ProcessName, StatusBody, apiChannel(), backupThrough(), byDeadline() (+14 more)

### Community 167 - "digest.test.ts"
Cohesion: 0.13
Nodes (20): ChangeKind, tableChanges, TouchedRow, changeOf(), concat(), sameBytes(), hex(), hex() (+12 more)

### Community 168 - "ProcessHandle"
Cohesion: 0.11
Nodes (10): ProcessHandle, PrivateProcess, CountingLink, Hold, stoppedWith(), privateModule(), needsModule(), heldAt() (+2 more)

### Community 169 - "signal-ignored-fixtures.ts"
Cohesion: 0.13
Nodes (18): ListenedRun, WorkerSignals, listenerProblems(), namesUnder(), pacedNode(), runWorkerInChild(), signalLines(), sigusr2Ignored() (+10 more)

### Community 17 - "NodeClient"
Cohesion: 0.05
Nodes (71): CoreChainBinding, FinalizedHeightOptions, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription (+63 more)

### Community 171 - "sweepStep"
Cohesion: 0.13
Nodes (14): SweepTables, writeBlock(), addRootCounts(), insertEvents(), insertSegmentResults(), insertStateRow(), hexOf(), merged() (+6 more)

### Community 172 - "version-table.ts"
Cohesion: 0.18
Nodes (20): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+12 more)

### Community 173 - "ingest-faults.test.ts"
Cohesion: 0.15
Nodes (16): ProcessCondition, A84Observation, LoggedRetry, OutageObservation, RetrySample, a84Run(), a84Tape(), askingAgain() (+8 more)

### Community 174 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 175 - "package-startup-checks.ts"
Cohesion: 0.16
Nodes (15): ChangedFile, GenesisFixture, installationCopy, PackageStartup, StartPackageProcess, expectProcessChecks(), expectWorkerChecks(), genesisOf() (+7 more)

### Community 176 - "config-hash-checks.ts"
Cohesion: 0.14
Nodes (14): A162Options, a162Run, HeaderSeen, RetargetProxy, a162Problems(), asLogin(), formsOf(), headersOf() (+6 more)

### Community 179 - "ProcessAdmin"
Cohesion: 0.20
Nodes (4): ProcessAdmin, Heartbeat, writerLockHeld(), beat()

### Community 18 - "record-and-replay.test.ts"
Cohesion: 0.03
Nodes (67): Answer, Handler, Received, ConnectionFrames, Failure, Variant, WrongRecording, Script (+59 more)

### Community 180 - "Process"
Cohesion: 0.18
Nodes (3): Process, asksForChannels(), signalCause()

### Community 182 - "chain-events-source.test.ts"
Cohesion: 0.13
Nodes (8): NodeCallOptions, EventsRunner, RecordingClient, open(), quiet(), chain, closing, SYSTEM_EVENTS_STORAGE

### Community 183 - "checkShape"
Cohesion: 0.31
Nodes (10): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+2 more)

### Community 186 - "Lockstep"
Cohesion: 0.16
Nodes (3): Lockstep, downText(), holds()

### Community 187 - "HoldingRelay"
Cohesion: 0.16
Nodes (4): Report, HoldingRelay, ReportRelay, sendable()

### Community 189 - "backbone/part-migrations.test.ts"
Cohesion: 0.20
Nodes (15): FoldedPart, RecordedMigration, earlierBackup(), earlierBootstrapSql(), earlierRefusalProblems(), earlierRows(), earlierRowsSql(), recorded() (+7 more)

### Community 19 - "InMemoryBlockSource"
Cohesion: 0.04
Nodes (94): InMemoryBlockSource, LoopInput, ProcessingEnd, ProcessStatus, IngestOptions, Flaky, Q142Observation, A43Case (+86 more)

### Community 193 - "cursor-table.property.test.ts"
Cohesion: 0.16
Nodes (16): CursorValue, Access, Block, BlockFails, Counts, Write, canonicalText(), expectValue() (+8 more)

### Community 194 - "listening.test.ts"
Cohesion: 0.13
Nodes (8): TestCertificates, adminOrigin(), libraryCore(), privateData(), readerOf(), until(), waitsForLockstep(), CONFIG_SCHEMA

### Community 196 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 197 - "pglite-timeouts.test.ts"
Cohesion: 0.17
Nodes (12): Run, Job, WorkerEvent, expectNeverCutOffNorHung(), settings(), apiRead(), engine(), report() (+4 more)

### Community 198 - "private/lockstep-wait.test.ts"
Cohesion: 0.24
Nodes (15): OpenTransaction, ExpectedWait, WaitSample, a117Problems(), firstWait(), heldTransactions(), lockstepCore(), loginOf() (+7 more)

### Community 199 - "in8.ts"
Cohesion: 0.24
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 2 - "migrate.ts"
Cohesion: 0.02
Nodes (201): Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner, Difference (+193 more)

### Community 20 - "restore-content-defined.test.ts"
Cohesion: 0.04
Nodes (97): EntryView, RecordedView, BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest (+89 more)

### Community 200 - "shims.test.ts"
Cohesion: 0.19
Nodes (9): BrowserRun, PrivateInstance, crossedError, StartRun, PgliteMemoryParts, hexOf(), jsonSafe(), umbradb:configuration (+1 more)

### Community 205 - "intake.test.ts"
Cohesion: 0.25
Nodes (11): PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), follow(), heights(), readProblems() (+3 more)

### Community 206 - "read-height.property.test.ts"
Cohesion: 0.20
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+2 more)

### Community 207 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 208 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 209 - "stats-module.ts"
Cohesion: 0.25
Nodes (11): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), "on-db-write"(), migrations (+3 more)

### Community 21 - "client.test.ts"
Cohesion: 0.03
Nodes (58): Connection, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure, HandSocket, HandSockets, FakeNode (+50 more)

### Community 214 - "admin/lifecycle.test.ts"
Cohesion: 0.15
Nodes (9): Child, shownDatabase(), heldPort(), startChild(), startWorker(), hostEndsByItself(), ADMIN_GENESIS, REPOSITORY (+1 more)

### Community 216 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 219 - "answerAdmin"
Cohesion: 0.21
Nodes (8): Validator, answerAdmin(), schemaFile(), text(), validatorOf(), get(), body(), ajv

### Community 22 - "loop.ts"
Cohesion: 0.04
Nodes (91): PointName, HeightRange, Callback, CallbackFailure, ParallelPoint, PointArguments, PointRun, PointSchedule (+83 more)

### Community 220 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 222 - "sha256"
Cohesion: 0.26
Nodes (6): sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 223 - "startWorkerProcess"
Cohesion: 0.18
Nodes (8): ProcessView, Scope, CallMethod, FromProcessWorker, ToProcessWorker, connectLink(), post(), startWorkerProcess()

### Community 224 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 228 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 23 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (75): demoLink, Envelope, MessagePortLike, PrivateLinkChannel, EngineInput, controlledTimers, PeerEnd, PeerMessage (+67 more)

### Community 230 - "ws-mutual-tls.test.ts"
Cohesion: 0.23
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 232 - "TapeAnswers"
Cohesion: 0.32
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 24 - "FinalizedLoop"
Cohesion: 0.04
Nodes (29): EntryBoundary, Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, Startup, SkipsAfterReconnect (+21 more)

### Community 25 - "child-processes.ts"
Cohesion: 0.03
Nodes (80): CdpEvent, Download, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, RepositoryFile, Cancellable (+72 more)

### Community 252 - "ingest-crash.worker.ts"
Cohesion: 0.24
Nodes (8): CrashEvent, CrashJob, report(), tipWriter(), handle, job, orphanGuard, poll

### Community 253 - "pglite-directory-fixtures.ts"
Cohesion: 0.29
Nodes (8): ProcessObservation, StartVia, committedIn(), processOn(), processProblems(), rowsIn(), S, control

### Community 26 - "in-memory-source.ts"
Cohesion: 0.04
Nodes (66): UmbraDBHandle, InMemoryItems, InMemorySourceOptions, Wait, CloseHelper, NetworkRuleName, RestoreJob, Logged (+58 more)

### Community 262 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 269 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 27 - "spawnChild"
Cohesion: 0.03
Nodes (79): ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, BlockImport, ChildResult (+71 more)

### Community 279 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 28 - "api.ts"
Cohesion: 0.04
Nodes (57): UmbraConfig, BlockWriteHandle, ReadHandle, SchemaWriteHandle, ErrorCode, cursorTable, CursorTableOptions, heightVersionedTable (+49 more)

### Community 29 - "adapter.ts"
Cohesion: 0.03
Nodes (75): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+67 more)

### Community 3 - "runner/process.ts"
Cohesion: 0.02
Nodes (203): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdminOptions, DigestRow (+195 more)

### Community 30 - "ledger-storage.test.ts"
Cohesion: 0.04
Nodes (87): ingest, Call, SeenLoad, RestartEvent, RestartJob, retentionSeen, LedgerTx, TasksRun (+79 more)

### Community 300 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 31 - "refcount-model.ts"
Cohesion: 0.04
Nodes (58): Node, BlockKind, BlockScript, BoundaryRewrite, Dice, DrivenBlock, GeneratedBlock, GeneratedState (+50 more)

### Community 32 - "mounted-admin.test.ts"
Cohesion: 0.05
Nodes (71): gate, SecretHashes, Compared, ConnectSeen, PortPeer, Expected, SubscriptionSeen, Client (+63 more)

### Community 33 - "config-check.ts"
Cohesion: 0.04
Nodes (74): CheckFinding, CheckStep, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, ConfigFinding (+66 more)

### Community 339 - "aborted"
Cohesion: 0.40
Nodes (3): DoesNotHold, EndsTheRun, aborted()

### Community 34 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (78): BlockBody, BlockParsed, BlockParsedOptions, TransactionParser, ChainTransaction, ChainEvent, EventPhase, ScaleValue (+70 more)

### Community 35 - "vitest"
Cohesion: 0.03
Nodes (53): Served, Lockfile, Manifest, Upstream, Pem, Leftover, RemovedName, ReportedTest (+45 more)

### Community 36 - "ledger-state.test.ts"
Cohesion: 0.04
Nodes (75): BrowserConfiguration, ProcessConfiguration, ApplyOutput, LedgerEvent, TransactionResult, VmLog, transactionSpec, ledgerItemsSeen (+67 more)

### Community 37 - "LedgerPackage"
Cohesion: 0.05
Nodes (41): LedgerPackage, StateHandle, LedgerEngine, LedgerTaskFailed, Driver, stagenetReplay, hexOf(), idOf() (+33 more)

### Community 38 - "api-server.test.ts"
Cohesion: 0.04
Nodes (60): ApiRegistry, ChainDataAnswer, ChainDataView, HttpHandler, HttpRoute, ModuleRegistration, AcceptsDuplicates, AddsExtensions (+52 more)

### Community 39 - "node-set.test.ts"
Cohesion: 0.04
Nodes (61): NodeSetFault, NodeSetOptions, NodeTableCheck, ChildReader, ChildVisitor, ContentDefinition, ContentDefinedBuildOptions, StoredRow (+53 more)

### Community 4 - "opt-out.test.ts"
Cohesion: 0.02
Nodes (174): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, CheckedMigration, CanonicalEncodingError, ContentOptions (+166 more)

### Community 41 - "range.ts"
Cohesion: 0.04
Nodes (62): NodeSubscription, Refusal, BoundaryBlockReading, BoundaryOptions, TapeBuilder, TapeBuilderOptions, Arguments, Command (+54 more)

### Community 42 - "ledger/types.ts"
Cohesion: 0.05
Nodes (53): ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerPackageOptions, V9Logs, LoadAdapter (+45 more)

### Community 43 - "start-umbradb.ts"
Cohesion: 0.05
Nodes (71): readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork, UmbraDBOptions, UmbraDBReason (+63 more)

### Community 44 - "NodeBlockSource"
Cohesion: 0.05
Nodes (32): BlockEventSource, RuntimeMetadataView, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, PreparedBlock, QueueRunner (+24 more)

### Community 45 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (53): MergeEntriesFn, TransactionHistoryEntry, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, rowToEntry(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema (+45 more)

### Community 46 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.04
Nodes (67): SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, bindLedgerTasks(), boundHost() (+59 more)

### Community 47 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (62): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+54 more)

### Community 48 - "sweep-tapes.ts"
Cohesion: 0.06
Nodes (53): CoreLedgerStateOptions, RefcountCheck, RefcountFault, NodeBatch, FixtureRun, FixtureRunOptions, StoredCheck, Reader (+45 more)

### Community 49 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (54): Job, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Failing, Flaky (+46 more)

### Community 5 - "backup/restore.ts"
Cohesion: 0.02
Nodes (110): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes (+102 more)

### Community 50 - "ref_node_timers"
Cohesion: 0.05
Nodes (49): Message, ReadResult, Pending, Ended, rawClient, Escape, publicState, Refused (+41 more)

### Community 52 - "core-block-commit.test.ts"
Cohesion: 0.05
Nodes (58): BlockRow, StandInOptions, Commit, AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock(), hex() (+50 more)

### Community 53 - "column-rules.ts"
Cohesion: 0.04
Nodes (72): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog (+64 more)

### Community 54 - "fetch-fixtures.ts"
Cohesion: 0.08
Nodes (63): ArgType, BlockOptions, CallSpec, RUNTIME, Decoded, FetchSeen, Watched, a168Tape() (+55 more)

### Community 55 - "cli/command.ts"
Cohesion: 0.05
Nodes (52): CommandHandler, CommandIo, MainProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch (+44 more)

### Community 56 - "process-build.ts"
Cohesion: 0.05
Nodes (58): ReadOnlyDatabase, EngineBuild, EngineNetwork, AdminRun, Answered, Answerer, Expected, Hold (+50 more)

### Community 58 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (60): CoreContractStatesOptions, ContractStateRow, DefinedModule, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+52 more)

### Community 59 - "node.test.ts"
Cohesion: 0.05
Nodes (29): Metadata, Step, Frame, RawClient, Failure, Variant, TapeClock, main() (+21 more)

### Community 6 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (122): ApplyInput, ChainOutcome, StoredNode, CallTx, Upstream, contractFixture, Ledger, RawPackage (+114 more)

### Community 60 - ".value"
Cohesion: 0.09
Nodes (42): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+34 more)

### Community 61 - "database-parts.ts"
Cohesion: 0.07
Nodes (34): PglitePathParts, PostgresParts, PostgresPartsInput, PrivateBackend, SessionSeen, Pause, SkipsLockstep, A112Observation (+26 more)

### Community 62 - "refcount-restart.ts"
Cohesion: 0.06
Nodes (50): BatchJson, databaseNow, Hold, Light, Line, NodeSetKeeper, Observed, observedRun (+42 more)

### Community 63 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (50): BlockItemSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+42 more)

### Community 64 - "refused-configuration.test.ts"
Cohesion: 0.07
Nodes (53): EngineConfig, Start, Refusal, Start, startAdminServer(), startProcess(), adminCore(), adminSnapshot() (+45 more)

### Community 65 - "loop-stop-harness.ts"
Cohesion: 0.08
Nodes (45): NodeClientOptions, ConnectSocket, A169Observation, LoopStopScenario, Outage, SourceOf, A167Observation, CheckOf (+37 more)

### Community 68 - "run.test.ts"
Cohesion: 0.06
Nodes (42): ConfigCheckReport, RunningCommand, statsConfig, runArguments(), runProcessCommand(), configText(), coreSettings(), inChild() (+34 more)

### Community 69 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (40): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, JsonEncoded (+32 more)

### Community 7 - "validate.ts"
Cohesion: 0.02
Nodes (129): RevisionSettings, PlainArray, PlainDataNode, PlainDataRule, Walk, RedactableConfig, RedactionForms, SecretForm (+121 more)

### Community 70 - "process-harness.ts"
Cohesion: 0.06
Nodes (37): ResolvedGraph, MisuseListener, MisuseReports, ProcessContexts, PublishRefusal, Seen, RunnerBackend, Pipeline (+29 more)

### Community 71 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (30): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TreeNode, TypeRule, DesignTable (+22 more)

### Community 72 - "builds.ts"
Cohesion: 0.06
Nodes (43): AdminStarter, PrivateIntakeOptions, DatabaseParts, AdminRunOptions, A176Options, TickerConfig, PausableConfig, CheckTarget (+35 more)

### Community 73 - "refcount-conversion.ts"
Cohesion: 0.09
Nodes (46): FileEntries, FixtureConfig, Reach, ContractRow, conversionRun, Released, storedKeep, RestorableBackup (+38 more)

### Community 74 - "chain-events-decode.test.ts"
Cohesion: 0.09
Nodes (41): eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, LedgerScenarioOptions (+33 more)

### Community 75 - "core-settings.ts"
Cohesion: 0.05
Nodes (48): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, Absent, DeepReadonly (+40 more)

### Community 76 - "cbor.ts"
Cohesion: 0.08
Nodes (43): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+35 more)

### Community 77 - "admin/types.ts"
Cohesion: 0.08
Nodes (39): adminRoutes, AdminEndpoint, AdminPart, ChainView, DeclarationView, InstanceStatus, ItemView, ModuleTableStatus (+31 more)

### Community 78 - "server.ts"
Cohesion: 0.08
Nodes (33): MountedAdminAnswer, AdminSeams, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions (+25 more)

### Community 79 - "chain-data.test.ts"
Cohesion: 0.09
Nodes (46): itemsSeen, BlockSpec, EventSpec, Json, Scenario, chainBlock, browserChain, a91Problems() (+38 more)

### Community 8 - "backup-fixtures.ts"
Cohesion: 0.04
Nodes (100): BackupBackend, BackupDatabase, killedRestore, TickerHandle, TickerProcess, BackupOnSignal, LoopClass, Pausable (+92 more)

### Community 80 - "resolver-boundary.ts"
Cohesion: 0.07
Nodes (41): TypeCheckFinding, TypeCheckResult, Finding, Access, AllowedRead, Boundary, Crossing, Guard (+33 more)

### Community 81 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 82 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 83 - "surface.test.ts"
Cohesion: 0.07
Nodes (45): Document, EntryInput, Renamed, Surface, SurfaceAmendment, changelogEntryProblems(), entryTerms(), namesWord() (+37 more)

### Community 84 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 85 - "ChannelEndpoint"
Cohesion: 0.09
Nodes (19): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), discard(), isChannel(), queuedSlowProblems() (+11 more)

### Community 86 - ".from"
Cohesion: 0.05
Nodes (38): Buffer, Hash, hex(), hex(), hex(), hex(), hex(), execute() (+30 more)

### Community 87 - "mapping.ts"
Cohesion: 0.07
Nodes (33): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+25 more)

### Community 88 - "core-ledger-state.ts"
Cohesion: 0.09
Nodes (36): BlockLedgerSource, LedgerBinding, retainedStates, CoreRevision, applyBlock(), boundLedger(), chainOutcomesOf(), computeBlock() (+28 more)

### Community 89 - "transform-checks.ts"
Cohesion: 0.09
Nodes (24): Failure, Variant, TapeError, until(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape() (+16 more)

### Community 9 - "loop.test.ts"
Cohesion: 0.03
Nodes (117): EntryRange, GraphInput, LockstepWait, LoopEnd, SlowBlockEvent, PastFaultCase, RefusalCase, Contexts (+109 more)

### Community 91 - "BlockRef"
Cohesion: 0.09
Nodes (17): BlockRef, CommitOutcome, HeldHeight, Fetching, Recorder, LateRedelivery, Outcomes, AlwaysLost (+9 more)

### Community 93 - "both-backends.test.ts"
Cohesion: 0.08
Nodes (25): DeterminismBackend, TestDatabase, TestServer, Backend, outcome(), declared(), hex(), hashOf() (+17 more)

### Community 94 - "real-tapes.ts"
Cohesion: 0.08
Nodes (33): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+25 more)

### Community 96 - "ref_node_fs"
Cohesion: 0.10
Nodes (29): BaselineLoad, Comparison, CommitOptions, PostgresRun, BenchEnv, ManualOpts, TinybenchOpts, Backend (+21 more)

### Community 285 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 90 - "data"
Cohesion: 0.05
Nodes (43): params(), data(), 7. The module API, 0. Baseline and decisions, 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4) (+35 more)

### Community 103 - ".off"
Cohesion: 0.05
Nodes (35): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases (+27 more)

### Community 110 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.08
Nodes (22): 1. Schema, ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract (+14 more)

### Community 161 - "core-ledger-state.test.ts"
Cohesion: 0.11
Nodes (16): boundLedgerParser(), itemsOf(), insertNodes(), applied(), bound(), query(), refusing(), applied() (+8 more)

### Community 163 - "node-source-status.test.ts"
Cohesion: 0.09
Nodes (15): a, b, fence(), open(), pass(), quiet(), close(), chain (+7 more)

### Community 190 - ".slowBlockMs"
Cohesion: 0.15
Nodes (14): 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix, 00043 — slow-block-outside.negative-control.test.ts's 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+6 more)

### Community 201 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 203 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 204 - ".#startup"
Cohesion: 0.13
Nodes (5): privateLinkOf(), sourceOf(), withTables(), losingCommits(), landingCommits()

### Community 210 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (12): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+4 more)

### Community 215 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 218 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 225 - ".boolean"
Cohesion: 0.18
Nodes (11): 4.1 Column types, 4.2 Rules, 4.3 Data that is not a function of the chain: `deterministic: false`, 4. Deterministic PostgreSQL, 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order (+3 more)

### Community 226 - "openssl"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 227 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 261 - "test-processes.test.ts"
Cohesion: 0.28
Nodes (7): namesRunner(), runnerStarts(), sources(), valueNames(), REPOSITORY, RUNNER, TESTS

### Community 271 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 352 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 40 - "refused"
Cohesion: 0.03
Nodes (79): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+71 more)

### Community 51 - "history"
Cohesion: 0.03
Nodes (68): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+60 more)

### Community 57 - "table"
Cohesion: 0.04
Nodes (66): side(), migrations(), deferred(), table(), version(), Engineering rules, 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights (+58 more)

### Community 66 - "code"
Cohesion: 0.04
Nodes (58): code(), Added, 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit (+50 more)

### Community 67 - ".put"
Cohesion: 0.04
Nodes (54): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+46 more)

### Community 95 - "T"
Cohesion: 0.05
Nodes (41): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+33 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 104 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 107 - "package.json"
Cohesion: 0.05
Nodes (38): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+30 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 128 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points, Requirement: RN-2 The runner does only its five duties (+22 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 153 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 155 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 166 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 170 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric` (+12 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 184 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 185 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 188 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 191 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 192 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 195 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 202 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 211 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 212 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 213 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 217 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 221 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 229 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 233 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 234 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 235 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 236 - "README.md"
Cohesion: 0.29
Nodes (3): Choosing a database, Launching it, stats-module

### Community 237 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 238 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 239 - "Boundaries, threats and controls"
Cohesion: 0.18
Nodes (11): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+3 more)

### Community 240 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 241 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 242 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 243 - "ROADMAP.md"
Cohesion: 0.20
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 244 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 245 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 246 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 247 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 248 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 249 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 250 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 254 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 255 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 256 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 257 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 258 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 259 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 263 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 264 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 265 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 266 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 267 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 268 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 270 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 272 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 273 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 274 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 275 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 276 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 277 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 278 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 280 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 282 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 283 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 284 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 286 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 287 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 288 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 289 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 290 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 291 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 292 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 293 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 294 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 295 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 296 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 297 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 298 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 299 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 301 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 302 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 303 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 304 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 305 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 306 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 307 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 308 - "00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone"
Cohesion: 0.40
Nodes (4): 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone, Problem, Resolution, Suggested fix

### Community 309 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 310 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 311 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 312 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 313 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 314 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 315 - "00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask"
Cohesion: 0.40
Nodes (4): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix

### Community 316 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 317 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 318 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 319 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 320 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 321 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 322 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 323 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 324 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 325 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 326 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 327 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 328 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 329 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 330 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 331 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 332 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 333 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 334 - "00082 — Two processes making their first start at once on one PostgreSQL server race on the module roles"
Cohesion: 0.40
Nodes (4): 00082 — Two processes making their first start at once on one PostgreSQL server race on the module roles, Evidence, Problem, Suggested fix

### Community 335 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 336 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 337 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 338 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 340 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 342 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 343 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 344 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 345 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 346 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 347 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 348 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.50
Nodes (4): Requirement: RN-13 SIGTERM stops cleanly, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable, Scenario: SIGTERM while the loop waits on an unreachable node

### Community 349 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 350 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning (+33 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-8785`, `RFC-3339`, `RFC-8785`, `RFC-9110`, `RFC-6455` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4351 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `declaration.ts`, `UmbraError`, `migrate.ts`, `runner/process.ts`, `opt-out.test.ts`, `backup/restore.ts`, `adapter-fixtures.ts`, `validate.ts`, `backup-fixtures.ts`, `loop.test.ts`, `module-api.ts`, `messages.ts`, `process-backends.ts`, `tape/index.ts`, `host.ts`, `hex`, `NodeClient`, `record-and-replay.test.ts`, `InMemoryBlockSource`, `restore-content-defined.test.ts`, `client.test.ts`, `loop.ts`, `channel-queue.test.ts`, `child-processes.ts`, `in-memory-source.ts`, `spawnChild`, `api.ts`, `adapter.ts`, `ledger-storage.test.ts`, `refcount-model.ts`, `mounted-admin.test.ts`, `config-check.ts`, `core-block-parsed.ts`, `ledger-state.test.ts`, `api-server.test.ts`, `node-set.test.ts`, `ledger/types.ts`, `start-umbradb.ts`, `NodeBlockSource`, `ledger/ledger-tasks.test.ts`, `contract-modules.test.ts`, `sweep-tapes.ts`, `chain-process.test.ts`, `ref_node_timers`, `core-block-commit.test.ts`, `fetch-fixtures.ts`, `cli/command.ts`, `process-build.ts`, `contract-data-checks.ts`, `node.test.ts`, `database-parts.ts`, `refcount-restart.ts`, `slow-block-harness.ts`, `refused-configuration.test.ts`, `loop-stop-harness.ts`, `run.test.ts`, `interfaces/transaction-history-storage.ts`, `process-harness.ts`, `column-rules.test.ts`, `builds.ts`, `refcount-conversion.ts`, `chain-events-decode.test.ts`, `core-settings.ts`, `admin/types.ts`, `server.ts`, `chain-data.test.ts`, `resolver-boundary.ts`, `boundary.test.ts`, `surface.test.ts`, `retirement.test.ts`, `mapping.ts`, `core-ledger-state.ts`, `transform-checks.ts`, `both-backends.test.ts`, `real-tapes.ts`, `ref_node_fs`, `BlockItems`, `determinism-checks.ts`, `core-ledger-state/sql.ts`, `cold-boot-recovery.integration.test.ts`, `package.json`, `networks.ts`, `browser.test.ts`, `paused-harness.ts`, `Worker`, `release-version.ts`, `cbor.property.test.ts`, `version-checks.ts`, `browser/build.ts`, `ref_node_events`, `code-registry.ts`, `height-versioned.property.test.ts`, `pg-tx-history-adapter.ts`, `accepted-hash-checks.ts`, `documents.ts`, `crash.test.ts`, `read-gate.ts`, `restore-private.ts`, `node-bridge.ts`, `readiness.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `validation.test.ts`, `ledger-sweep.test.ts`, `lockstep-refusals.test.ts`, `binding.test.ts`, `block-fetch-decode.test.ts`, `sqlite-warning.test.ts`, `pglite-outside-reads.ts`, `core-ledger-state.test.ts`, `node-source-status.test.ts`, `digest.test.ts`, `ProcessHandle`, `ingest-faults.test.ts`, `transaction-history-storage.property.test.ts`, `package-startup-checks.ts`, `excluded-not-exported.test.ts`, `chain-events-source.test.ts`, `backbone/part-migrations.test.ts`, `cursor-table.property.test.ts`, `listening.test.ts`, `statementsOf`, `pglite-timeouts.test.ts`, `private/lockstep-wait.test.ts`, `in8.ts`, `shims.test.ts`, `mutation-per-adapter.mjs`, `intake.test.ts`, `read-height.property.test.ts`, `web-lock.ts`, `admin/lifecycle.test.ts`, `twox.ts`, `answerAdmin`, `history.property.test.ts`, `facade-merge-loader.ts`, `ws-mutual-tls.test.ts`, `core-block-fetch.test.ts`, `pglite-directory-fixtures.ts`, `test-processes.test.ts`?**
  _High betweenness centrality (0.225) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8785`, `RFC-3339`, `RFC-8785` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.016695156695156695 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `declaration.ts`, `migrate.ts`, `runner/process.ts`, `opt-out.test.ts`, `backup/restore.ts`, `accepted-hash-checks.ts`, `validate.ts`, `backup-fixtures.ts`, `loop.test.ts`, `module-api.ts`, `startUmbraDB`, `messages.ts`, `process-backends.ts`, `tape/index.ts`, `readiness.test.ts`, `host.ts`, `NodeClient`, `InMemoryBlockSource`, `restore-content-defined.test.ts`, `validation.test.ts`, `loop.ts`, `channel-queue.test.ts`, `client.test.ts`, `binding.test.ts`, `in-memory-source.ts`, `lockstep-refusals.test.ts`, `api.ts`, `FinalizedLoop`, `refcount-model.ts`, `mounted-admin.test.ts`, `config-check.ts`, `refcount.ts`, `core-ledger-state.test.ts`, `api-server.test.ts`, `node-set.test.ts`, `refused`, `range.ts`, `ledger/types.ts`, `start-umbradb.ts`, `NodeBlockSource`, `version-table.ts`, `ingest-faults.test.ts`, `contract-modules.test.ts`, `chain-process.test.ts`, `ref_node_timers`, `core-block-commit.test.ts`, `checkShape`, `process-build.ts`, `table`, `backbone/part-migrations.test.ts`, `slow-block-harness.ts`, `refused-configuration.test.ts`, `statementsOf`, `process-harness.ts`, `shims.test.ts`, `builds.ts`, `core-settings.ts`, `.#startup`, `cbor.ts`, `web-lock.ts`, `graph.ts`, `aborted`, `mapping.ts`, `browser/src/config/load.ts`, `core-ledger-state.ts`, `BlockRef`, `both-backends.test.ts`, `sha256`, `PrivateTransport`, `version-checks.ts`, `ref_node_events`, `pglite-directory-fixtures.ts`, `items.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.017392212130702578 - nodes in this community are weakly interconnected._