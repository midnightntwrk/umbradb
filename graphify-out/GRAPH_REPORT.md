# Graph Report - UmbraDB

## Corpus Check
- 1298 files · ~1,836,314 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13422 nodes · 41714 edges · 403 communities (367 shown, 36 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3487 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `a6f222e5a62c0551` (1298 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- ledger-graph-tapes.ts
- admin-harness.ts
- ref_node_fs
- process-worker.ts
- backup/backup.ts
- redact.ts
- backup/restore.ts
- src/config/load.ts
- channel-queue.test.ts
- cold-boot-recovery.integration.test.ts
- networks.ts
- paused-harness.ts
- Worker
- node-set.test.ts
- NodeClient
- release-version.ts
- sweep-fixture.test.ts
- real-tapes.ts
- browser/build.ts
- TransactionHistoryEntry
- core-digest.ts
- configuration-refusal.test.ts
- resolver-boundary.ts
- config/history.ts
- file-modes.ts
- units.test.ts
- checks.test.ts
- .value
- version-checks.ts
- postgres/transaction-history-storage.ts
- core-chain.ts
- code-registry.ts
- core-private-source.test.ts
- shadow-schema.test.ts
- documents.ts
- pg-tx-history-adapter.ts
- ws
- transcripts.ts
- read-gate.ts
- cbor.property.test.ts
- test/postgres/setup.ts
- recovery.test.ts
- BlockRef
- interfaces/transaction-history-storage.ts
- api-socket.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- checkShape
- surface.test.ts
- core-block-parsed.ts
- changes.property.test.ts
- node-bridge.ts
- pack-install.mjs
- backbone/part-migrations.test.ts
- harness.ts
- tape/index.ts
- core-block-fetch/metadata.ts
- library-documents.test.ts
- worker-storage.test.ts
- version-table.ts
- chrome.ts
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- ingest-faults.test.ts
- declaration.ts
- listening.test.ts
- text.test.ts
- loop.ts
- read-height.property.test.ts
- version-selection.test.ts
- LoopPauses
- ws-mutual-tls.test.ts
- statementsOf
- startUmbraDB
- ModuleDeclaration
- api-session.test.ts
- quiet-host.child.ts
- core.ts
- hex
- api-answers.ts
- crash.worker.ts
- browser/serve.ts
- core-transport.ts
- SubscriptionConnection
- Heartbeat
- history.property.test.ts
- .send
- openPostgres
- Design — Sprint 1: project setup + TemporalKV
- TapeAnswers
- api.ts
- TestLink
- contract-data-checks.ts
- extrinsics.ts
- loop.test.ts
- signal-backup.worker.ts
- LedgerPackage
- vendored-ledger-files.test.ts
- host.ts
- mutation-evidence.d.mts
- RuntimeMetadata
- StartedModuleApi
- TransportProxy
- api-server.test.ts
- migrate.ts
- FinalizedLoop
- validation.ts
- record-and-replay.test.ts
- chain-placement.test.ts
- resolve.ts
- mounted-admin.test.ts
- column-rules.ts
- PageApiChannel
- CliBackend
- NodeFS
- UmbraError
- Keeping
- core-ledger-state/sql.ts
- adapter.ts
- process-backends.ts
- messages.ts
- ref_node_timers
- configured.ts
- validate.ts
- connectWebSocket
- process-admin.ts
- coreEntry
- .from
- core-block-commit.test.ts
- range.ts
- builds.ts
- Process
- refcount-model.ts
- determinism/contents-hash.ts
- refused-configuration.test.ts
- ledger/types.ts
- runner/process.ts
- containers.test.ts
- src/db/postgres.ts
- refcount-restart.ts
- adapter-fixtures.ts
- ledger-storage.test.ts
- ProcessHandle
- ledger/ledger-tasks.test.ts
- cbor.ts
- transform-checks.ts
- boundary.test.ts
- slow-block-harness.ts
- database-parts.ts
- start-umbradb.ts
- declaration
- InMemoryBlockSource
- node.test.ts
- core-ledger-state.ts
- loop-stop-harness.ts
- client.test.ts
- PgTransactionHistoryStorage
- binding.test.ts
- core-settings.ts
- column-rules.test.ts
- node-fields-harness.ts
- pause-fixtures.ts
- mapping.ts
- restore-ledger.ts
- restore-content-defined.test.ts
- entries.ts
- graph.ts
- retirement.test.ts
- chain-process.test.ts
- vitest
- height-versioned.test.ts
- page.ts
- transport.test.ts
- browser.test.ts
- example-checks.ts
- process-harness.ts
- private/lockstep-wait.test.ts
- pglite.ts
- ADDED Requirements
- Acceptance — TOKEN-METADATA: MIP-0018 token metadata from contract logs
- Problem
- data
- ADDED Requirements
- graph.py
- ADDED Requirements
- .slowBlockMs
- T
- local-preprod-sync.mjs
- connectChannel
- .disconnect
- fixtures/configuration.ts
- conformance-gate.mjs
- mutation-per-adapter.mjs
- tabReport
- twox.ts
- Design — v1.1.0: Quint model checking
- facade-merge-loader.ts
- shiftedSource
- scoped-review-manifest
- readBody
- midnight-env — reproducible PREPROD dev environment
- path.ts
- The laws of UmbraDB's storage helpers
- orphan-watcher.mjs
- fresh-instance.mjs
- package-keys-walk.mjs
- crash-worker.ts
- history
- code
- .put
- table
- .off
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- README.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Requirement: DT-3 The contents hash
- Design — Sprint 4: Watermarks
- [0.10.0] - 2026-10-27
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Boundaries, threats and controls
- Design — Sprint 2: Transaction/Lease
- Proposal — TOKEN-METADATA: MIP-0018 token metadata from contract logs (`token-metadata`)
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- UmbraDB in a browser
- ROADMAP.md
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- After 0.10.0
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Requirement: CF-4 Every field is data, operational or secret
- Acceptance — v1.0.0-durable-checkpoint-cursor
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
- Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Requirement: TM-6 Keys and values follow the MIP's rules
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
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
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
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- 00084 — The contents hash's key-ordered read splices its page size into `LIMIT`
- 00085 — The fast contract-log provider limits mid-chain use: development-only, and it halts on partial transactions
- bug-report.md
- feature-request.md
- Requirement: BK-1 Backup
- MODIFIED Requirements
- Requirement: TM-5 A payload is accepted whole or rejected whole
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes
- 00083 — Four timing-bound tests fail when the machine runs several test lanes at once
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Test wallets
- Requirement: TM-18 The module's routes answer from finalized data
- Requirement: TM-1 An opt-in public module that can start at any height
- Requirement: TM-3 Candidates are found by event type and exact name
- Spec — capability `formal-completion`
- renovate.json
- start-stack.sh
- Spec — `token-metadata` capability
- Requirement: TM-12 A color resolves to an identity by the kind held
- Requirement: TM-19 Changed identities are notified after commit
- Requirement: TM-21 Payload bytes and served values are untrusted
- Requirement: TM-7 Records belong to the emitting contract, and colors are computed
- Requirement: TM-9 Every answer states its coverage
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 465 edges
2. `UmbraError` - 357 edges
3. `ModuleDeclaration` - 213 edges
4. `InMemoryBlockSource` - 179 edges
5. `FinalizedLoop` - 139 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `Database` - 104 edges
9. `startUmbraDB()` - 103 edges
10. `PROCESS_BACKENDS` - 102 edges

## Surprising Connections (you probably didn't know these)
- `Non-goals (what this change does NOT cover)` --references--> `ParsedTransaction`  [INFERRED]
  openspec/changes/token-metadata/proposal.md → src/ledger/types.ts
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `D9. Testing (proposal Q-4)` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/token-metadata/design.md → src/runner/in-memory-source.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (403 total, 36 thin omitted)

### Community 0 - "ledger-graph-tapes.ts"
Cohesion: 0.03
Nodes (182): CoreLedgerStateOptions, RefcountFault, NodeBatch, FixtureRun, FixtureRunOptions, Reader, Seen, TableSnapshot (+174 more)

### Community 1 - "admin-harness.ts"
Cohesion: 0.02
Nodes (158): MountedAdminAnswer, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions (+150 more)

### Community 10 - "ref_node_fs"
Cohesion: 0.04
Nodes (88): CommandHandler, CommandIo, MainProcess, RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, TickerHandle (+80 more)

### Community 100 - "process-worker.ts"
Cohesion: 0.08
Nodes (29): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, Scope, crossedError, StartRun, ToProcessWorker (+21 more)

### Community 101 - "backup/backup.ts"
Cohesion: 0.09
Nodes (37): BackupSeams, BackupTarget, BackupWritten, PgliteDump, SnapshotSeams, Environment, PgDumpTool, BackupCommandOptions (+29 more)

### Community 105 - "redact.ts"
Cohesion: 0.08
Nodes (32): RedactionForms, SecretForm, TextPattern, Needs, findings(), databaseText(), configRedactor(), credentialsIn() (+24 more)

### Community 106 - "backup/restore.ts"
Cohesion: 0.09
Nodes (31): RestoreChain, RestoreInput, RestoreSeams, RestoreTarget, Chain, RestoreCommandOptions, RestoreOutcome, RestoreJob (+23 more)

### Community 107 - "src/config/load.ts"
Cohesion: 0.08
Nodes (27): ImportedConfig, LoadOptions, Row, configModules(), configModuleUrl(), configPath(), importConfig(), invalid() (+19 more)

### Community 11 - "channel-queue.test.ts"
Cohesion: 0.03
Nodes (79): ChannelEndpoint, EndpointEvents, EndpointOptions, Envelope, MessagePortLike, CoreChannels, Received, CarrierEvents (+71 more)

### Community 111 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (24): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+16 more)

### Community 112 - "networks.ts"
Cohesion: 0.07
Nodes (34): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+26 more)

### Community 115 - "paused-harness.ts"
Cohesion: 0.12
Nodes (29): Body, PausedExpectation, Read, Reader, a176Project(), keeperModule(), keepingPause(), pausedOf() (+21 more)

### Community 116 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 119 - "node-set.test.ts"
Cohesion: 0.07
Nodes (30): StoredRow, Tables, contentsHashOf(), changedRow(), database(), databaseSql(), hexOf(), keyOf() (+22 more)

### Community 12 - "NodeClient"
Cohesion: 0.04
Nodes (77): NodeSourceOptions, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription (+69 more)

### Community 120 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 123 - "sweep-fixture.test.ts"
Cohesion: 0.10
Nodes (21): ChildReader, ChildVisitor, Driver, readChildList(), readChildren(), applyInput(), at(), batchText() (+13 more)

### Community 124 - "real-tapes.ts"
Cohesion: 0.09
Nodes (29): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+21 more)

### Community 125 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 126 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 127 - "core-digest.ts"
Cohesion: 0.10
Nodes (30): TableDigest, TableDigestRow, CapturedTable, ChangeKind, tableChanges, TouchedRow, capturedOf(), digestBlock() (+22 more)

### Community 128 - "configuration-refusal.test.ts"
Cohesion: 0.10
Nodes (25): ProcessReason, ReasonCode, RetryCode, Unwrapped, UnexpectedCursor, RetryCondition, StatusFacts, configurationFindings() (+17 more)

### Community 129 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 13 - "config/history.ts"
Cohesion: 0.03
Nodes (111): CoreVersion, CoreSettings, versionEntry, ConfigHashRow, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions (+103 more)

### Community 130 - "file-modes.ts"
Cohesion: 0.09
Nodes (25): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+17 more)

### Community 132 - "units.test.ts"
Cohesion: 0.12
Nodes (26): BackupInput, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool, DumpInput, Restored (+18 more)

### Community 133 - "checks.test.ts"
Cohesion: 0.09
Nodes (24): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, optOut, Case, checkFunctionsSql() (+16 more)

### Community 134 - ".value"
Cohesion: 0.15
Nodes (16): MetadataField, MetadataType, Primitive, ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), hexOf() (+8 more)

### Community 135 - "version-checks.ts"
Cohesion: 0.11
Nodes (21): MetadataNode, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk, OwnStateMetadata (+13 more)

### Community 136 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+11 more)

### Community 137 - "core-chain.ts"
Cohesion: 0.10
Nodes (27): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, WaitingListener, ConfigRow, bindCoreBlockFetch(), bindCoreChain() (+19 more)

### Community 138 - "code-registry.ts"
Cohesion: 0.11
Nodes (27): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+19 more)

### Community 14 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (72): PrivateBlockSource, PrivateChecks, privateIntake, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes (+64 more)

### Community 140 - "shadow-schema.test.ts"
Cohesion: 0.07
Nodes (11): CheckedMigration, hex(), COLUMN_TYPE_RULES, TABLE_RULES, CHANGED, EXPECTED_CBOR, EXPECTED_HASH, MODULE_M (+3 more)

### Community 141 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 142 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 144 - "ws"
Cohesion: 0.10
Nodes (10): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+2 more)

### Community 145 - "transcripts.ts"
Cohesion: 0.11
Nodes (23): FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw, LogItem, VmLog (+15 more)

### Community 146 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 147 - "cbor.property.test.ts"
Cohesion: 0.10
Nodes (28): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, hex(), hex() (+20 more)

### Community 148 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 149 - "recovery.test.ts"
Cohesion: 0.11
Nodes (20): Armed, CommitArm, CommitFault, CommitProxy, Pair, Fault, holds(), tailOf() (+12 more)

### Community 15 - "BlockRef"
Cohesion: 0.04
Nodes (54): BlockLedgerSource, HeadWait, NodeBlockSource, Prefetch, QueuedBlock, NodeSubscription, NodeHeader, BlockItems (+46 more)

### Community 150 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 151 - "api-socket.ts"
Cohesion: 0.15
Nodes (25): coreHeaders, ModuleApiStart, MountedApiSeams, ChannelConnectOptions, ModuleApiLimits, ServedConnection, ModuleApiHandlerOptions, ModuleApiServerOptions (+17 more)

### Community 154 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 155 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 156 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 157 - "checkShape"
Cohesion: 0.17
Nodes (18): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+10 more)

### Community 159 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 16 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (99): BodyExtrinsic, BlockBody, BlockItemSource, CoreBlockItems, MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions (+91 more)

### Community 161 - "changes.property.test.ts"
Cohesion: 0.10
Nodes (24): Op, States, TableName, encodeCanonical(), sha256(), text(), blockAgrees(), compareKeys() (+16 more)

### Community 162 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 166 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 168 - "backbone/part-migrations.test.ts"
Cohesion: 0.15
Nodes (20): FoldedPart, RecordedMigration, isObject(), readManifestLine(), earlierBackup(), earlierBootstrapSql(), earlierRefusalProblems(), earlierRows() (+12 more)

### Community 169 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 17 - "tape/index.ts"
Cohesion: 0.04
Nodes (79): Recorded, Link, TapeBuilderOptions, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest (+71 more)

### Community 172 - "core-block-fetch/metadata.ts"
Cohesion: 0.29
Nodes (14): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 173 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 174 - "worker-storage.test.ts"
Cohesion: 0.16
Nodes (13): StoredNode, StagenetBlockJson, StagenetFixtureJson, Nodes, bytes(), at(), input(), rows() (+5 more)

### Community 175 - "version-table.ts"
Cohesion: 0.18
Nodes (20): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+12 more)

### Community 176 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 177 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 178 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 179 - "ingest-faults.test.ts"
Cohesion: 0.15
Nodes (15): ProcessCondition, A84Observation, LoggedRetry, OutageObservation, RetrySample, a84Run(), askingAgain(), fastClient() (+7 more)

### Community 18 - "declaration.ts"
Cohesion: 0.03
Nodes (80): StatsRow, Outcome, UmbraConfig, BlockWriteHandle, ReadHandle, SchemaWriteHandle, OwnPart, cursorTable (+72 more)

### Community 180 - "listening.test.ts"
Cohesion: 0.12
Nodes (10): Pem, TestCertificates, linkTo(), adminOrigin(), configWhen(), readerOf(), until(), waitsForLockstep() (+2 more)

### Community 184 - "text.test.ts"
Cohesion: 0.16
Nodes (9): BackupText, createReadStream(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir (+1 more)

### Community 19 - "loop.ts"
Cohesion: 0.04
Nodes (98): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+90 more)

### Community 191 - "read-height.property.test.ts"
Cohesion: 0.16
Nodes (12): TestDatabase, HeldRead, Job, Outcome, Reads, Step, concurrent(), queued() (+4 more)

### Community 194 - "version-selection.test.ts"
Cohesion: 0.26
Nodes (15): Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts(), haltOf() (+7 more)

### Community 195 - "LoopPauses"
Cohesion: 0.18
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 198 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 199 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 2 - "startUmbraDB"
Cohesion: 0.01
Nodes (184): Job, Run, moduleFacts(), refused(), backupAtStop(), text(), transportReader(), transportReaderRule() (+176 more)

### Community 20 - "ModuleDeclaration"
Cohesion: 0.03
Nodes (64): OpenedConfig, OpenedFacts, ChainIdentity, HistoryCheck, HistoryRow, HistoryRule, PlacedEntry, AppliedMigration (+56 more)

### Community 205 - "api-session.test.ts"
Cohesion: 0.18
Nodes (12): connectionRules, moduleApiHandlers, answerRequest(), moduleApiFetch(), responseOf(), serve(), throwing(), unreadableAmount() (+4 more)

### Community 206 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 207 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 21 - "hex"
Cohesion: 0.05
Nodes (80): nodeKeys, FreshInstanceRequest, FreshInstanceResult, StoredNode, Reader, Written, GenesisNodes, Disposable (+72 more)

### Community 211 - "api-answers.ts"
Cohesion: 0.23
Nodes (13): HeadersArgument, LifecycleStatus, answerNotServing(), byteLength(), isCoreHeader(), lifecycleBody(), lifecycleHeaders(), notServingResponse() (+5 more)

### Community 213 - "crash.worker.ts"
Cohesion: 0.18
Nodes (11): CrashCall, CrashEvent, CrashOptions, CrashJob, crashModule(), hex(), CRASH_POINTS, build (+3 more)

### Community 215 - "browser/serve.ts"
Cohesion: 0.22
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 22 - "core-transport.ts"
Cohesion: 0.03
Nodes (71): PrivateLinkAddress, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransport, CoreTransportOptions (+63 more)

### Community 220 - "SubscriptionConnection"
Cohesion: 0.31
Nodes (4): SubscriptionCarrier, SubscriptionConnection, errorMessage(), socketConnection()

### Community 221 - "Heartbeat"
Cohesion: 0.24
Nodes (7): Heartbeat, HeartbeatOptions, TimerHandle, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 222 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 23 - "openPostgres"
Cohesion: 0.04
Nodes (77): PostgresOptions, Snapshot, WriterProcess, Job, WorkerEvent, Phase, PostgresTestDatabase, PostgresTestServer (+69 more)

### Community 234 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.20
Nodes (10): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+2 more)

### Community 239 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 24 - "api.ts"
Cohesion: 0.04
Nodes (70): Database, ReadOptions, Settings, Case, LoadOutcome, OutsideRead, Traced, Opened (+62 more)

### Community 25 - "contract-data-checks.ts"
Cohesion: 0.05
Nodes (95): ContractLog, CoreContractLogsFastOptions, CoreContractLogsFullOptions, CoreContractStatesOptions, ContractStateRow, LogEventType, DefinedModule, contractScenario (+87 more)

### Community 253 - "extrinsics.ts"
Cohesion: 0.29
Nodes (8): ExtrinsicCall, MetadataPallet, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), isCompactU64(), TIMESTAMP

### Community 26 - "loop.test.ts"
Cohesion: 0.04
Nodes (78): CommitOutcome, HeldHeight, LockstepWait, Contexts, Faults, LostCommit, Outcomes, Seen (+70 more)

### Community 264 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 27 - "LedgerPackage"
Cohesion: 0.04
Nodes (59): ApplyOutput, LedgerPackage, LedgerTask, LedgerTaskBlock, StateHandle, StateSummary, EngineOptions, LedgerEngine (+51 more)

### Community 272 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 28 - "host.ts"
Cohesion: 0.04
Nodes (66): LoadLedger, LedgerStateItem, RetainedState, LedgerName, ChainOutcome, ParsedTransaction, AppliedState, ApplyBlock (+58 more)

### Community 283 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 286 - "StartedModuleApi"
Cohesion: 0.29
Nodes (3): StartedModuleApi, FetchHandler, ModuleApiServer

### Community 29 - "api-server.test.ts"
Cohesion: 0.04
Nodes (76): ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode, ApiRequest, ApiResponse, ApiRoutes, HttpHandler (+68 more)

### Community 3 - "migrate.ts"
Cohesion: 0.03
Nodes (139): Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference, PlannedSchema (+131 more)

### Community 30 - "FinalizedLoop"
Cohesion: 0.04
Nodes (28): Activity, FinalizedLoop, HeightRun, LoopObserver, Startup, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction (+20 more)

### Community 31 - "validation.ts"
Cohesion: 0.03
Nodes (90): DeclarationRule, PlacedDeclaration, Plain, Chain, ChainOptions, DigestRow, Case, ShapeCase (+82 more)

### Community 32 - "record-and-replay.test.ts"
Cohesion: 0.03
Nodes (49): Answer, FakeNode, Handler, Received, recorded, ConnectionFrames, Failure, Variant (+41 more)

### Community 33 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (90): BlockSpec, EventSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+82 more)

### Community 34 - "resolve.ts"
Cohesion: 0.04
Nodes (90): ConfigFacts, CoreChainFacts, RestoreBase, CommandBuildOptions, CheckState, ConfigCheckOptions, CommandConfig, ProcessSide (+82 more)

### Community 35 - "mounted-admin.test.ts"
Cohesion: 0.04
Nodes (79): UmbraDBOptions, gate, SecretHashes, SecretVariant, Compared, ConnectSeen, PortPeer, Expected (+71 more)

### Community 36 - "column-rules.ts"
Cohesion: 0.03
Nodes (96): CaptureState, ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType (+88 more)

### Community 37 - "UmbraError"
Cohesion: 0.04
Nodes (72): ImportedConfig, LoadedConfig, LoadOptions, ConfiguredDatabase, databaseTarget, PostgresConnection, PostgresOptions, PgliteLockUse (+64 more)

### Community 38 - "core-ledger-state/sql.ts"
Cohesion: 0.04
Nodes (78): ComputedBlock, NodeSetFault, NodeSetOptions, NodeTableCheck, KeyCounts, RefcountCheck, RefcountStatement, refcountStep (+70 more)

### Community 39 - "adapter.ts"
Cohesion: 0.04
Nodes (69): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+61 more)

### Community 4 - "process-backends.ts"
Cohesion: 0.03
Nodes (139): LedgerHost, contentsHash, ingest, IngestOptions, SourceClass, Call, recordedGenesis, TasksRun (+131 more)

### Community 40 - "messages.ts"
Cohesion: 0.04
Nodes (55): PublicSide, Committed, HelloAck, JsonValue, MessageFault, MessageType, ReadResult, StatementResult (+47 more)

### Community 41 - "ref_node_timers"
Cohesion: 0.05
Nodes (62): IgnoredJob, ListenedRun, WorkerSignals, cliProject, Renamed, RunningCommand, statsConfig, runArguments() (+54 more)

### Community 42 - "configured.ts"
Cohesion: 0.04
Nodes (65): ConfiguredDatabaseOptions, commandTarget, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, CreatedDirectory (+57 more)

### Community 43 - "validate.ts"
Cohesion: 0.04
Nodes (78): plainData, ConfigContext, ConfigRule, CursorRule, EntryRef, EntryView, Issue, Plain (+70 more)

### Community 44 - "connectWebSocket"
Cohesion: 0.04
Nodes (55): ConnectSocket, Outage, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, BoundaryBlockReading (+47 more)

### Community 45 - "process-admin.ts"
Cohesion: 0.05
Nodes (72): NetworkShown, AllowedDetail, PrivateSideFacts, ProcessAdminOptions, RevisionSettings, DigestRow, ModuleFacts, NodeFacts (+64 more)

### Community 46 - "coreEntry"
Cohesion: 0.05
Nodes (60): coreEntry, EngineInput, NetworkRuleName, ChannelCoreOptions, ChannelPrivateOptions, Link, Hold, Signal (+52 more)

### Community 47 - ".from"
Cohesion: 0.03
Nodes (57): Buffer, Hash, RefcountModel, ModelBatch, ModelSnapshot, SweepModel, SweepComparison, SweepComparisonSeen (+49 more)

### Community 48 - "core-block-commit.test.ts"
Cohesion: 0.04
Nodes (59): BlockHeaderItem, BlockRow, CoreBlockHeader, StandInOptions, Commit, AlwaysLanded, blockHeaderOf(), checkParent() (+51 more)

### Community 49 - "range.ts"
Cohesion: 0.04
Nodes (62): Refusal, TapeBuilder, Arguments, Command, CompletenessRange, RecordingError, Final, Height (+54 more)

### Community 5 - "builds.ts"
Cohesion: 0.03
Nodes (123): AdminStarter, PglitePathParts, PostgresParts, ReadOnlyDatabase, A176Options, KeeperGlobals, PrivateBackend, SessionSeen (+115 more)

### Community 50 - "Process"
Cohesion: 0.06
Nodes (14): ProcessAdmin, PauseHold, LibraryChecks, Process, Resolved, openedCursorHeight(), isBlockEventSource(), retryOf() (+6 more)

### Community 51 - "refcount-model.ts"
Cohesion: 0.05
Nodes (50): Node, BlockKind, BlockScript, BoundaryRewrite, Dice, DrivenBlock, GeneratedBlock, GeneratedState (+42 more)

### Community 52 - "determinism/contents-hash.ts"
Cohesion: 0.06
Nodes (53): CaptureColumn, SchemaTable, ContentFunction, ContentOptions, TableContent, ModuleColumn, ModuleContentsError, ModuleContentsFailure (+45 more)

### Community 53 - "refused-configuration.test.ts"
Cohesion: 0.06
Nodes (61): EngineConfig, WorkerWithStreams, Answered, Start, Refusal, Start, listenError(), startAdminServer() (+53 more)

### Community 54 - "ledger/types.ts"
Cohesion: 0.06
Nodes (53): ManifestLine, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerPackageOptions, V9Logs, LoadAdapter, AdapterWorkerRequest (+45 more)

### Community 55 - "runner/process.ts"
Cohesion: 0.04
Nodes (44): AdminSeams, ChainCheck, ChainCheckInput, NodeWait, RunOptions, RunSeams, SignalSource, stopSignal (+36 more)

### Community 56 - "containers.test.ts"
Cohesion: 0.04
Nodes (53): BenchEnv, driverConnectionOptions, PostgresConnection, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, TlsPostgres (+45 more)

### Community 57 - "src/db/postgres.ts"
Cohesion: 0.05
Nodes (39): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, BoundedRead, DriverError, Outcome, ReadPool (+31 more)

### Community 59 - "refcount-restart.ts"
Cohesion: 0.05
Nodes (55): BatchJson, ContentsHash, databaseNow, Hold, Light, Line, NodeSetKeeper, Observed (+47 more)

### Community 6 - "adapter-fixtures.ts"
Cohesion: 0.03
Nodes (129): ApplyInput, Freeable, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot (+121 more)

### Community 60 - "ledger-storage.test.ts"
Cohesion: 0.07
Nodes (56): LedgerEvent, TransactionResult, ledgerItemsSeen, SeenLoad, retentionSeen, LedgerTx, Reader, TableNode (+48 more)

### Community 61 - "ProcessHandle"
Cohesion: 0.05
Nodes (53): demoLink, PrivateLinkChannel, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork (+45 more)

### Community 62 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (52): Path, CallArgsItem, CallArguments, V9Raw, described(), differs(), key(), plainDataProblem() (+44 more)

### Community 63 - "cbor.ts"
Cohesion: 0.07
Nodes (53): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+45 more)

### Community 64 - "transform-checks.ts"
Cohesion: 0.08
Nodes (42): Failure, Variant, TransformError, recordKind, SubscribeRecord, SubscriptionId, CallSelection, NotificationRange (+34 more)

### Community 65 - "boundary.test.ts"
Cohesion: 0.07
Nodes (49): DesignTable, RowCoverage, ModuleReference, Finding, rule(), collationsWritten(), componentCode(), componentExports() (+41 more)

### Community 66 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): BlockEventSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+41 more)

### Community 67 - "database-parts.ts"
Cohesion: 0.05
Nodes (48): CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState (+40 more)

### Community 68 - "start-umbradb.ts"
Cohesion: 0.07
Nodes (51): Finding, readOptions, GoneCwdResult, addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding() (+43 more)

### Community 69 - "declaration"
Cohesion: 0.06
Nodes (52): GraphInput, PastFaultCase, RefusalCase, keysModule(), contractLogs(), declaration(), logsProvider(), reader() (+44 more)

### Community 7 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (120): InMemoryBlockSource, InMemoryItems, Wait, EngineBuild, EngineNetwork, ProcessingEnd, ProcessStatus, Job (+112 more)

### Community 71 - "node.test.ts"
Cohesion: 0.05
Nodes (21): Metadata, Step, Frame, RawClient, Failure, Variant, TapeClock, expectAnswersByOccurrence() (+13 more)

### Community 72 - "core-ledger-state.ts"
Cohesion: 0.07
Nodes (44): LedgerBinding, retainedStates, CoreRevision, ledgerVersionOf(), bindLedgerParser(), boundLedgerParser(), applyBlock(), bindCoreLedgerState() (+36 more)

### Community 73 - "loop-stop-harness.ts"
Cohesion: 0.08
Nodes (45): SignalTarget, A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation (+37 more)

### Community 74 - "client.test.ts"
Cohesion: 0.05
Nodes (29): NodeClientOptions, NodeRetry, HandSocket, HandSockets, ManualTimers, RecordAndReplayOptions, connectWebSocket(), "on-compute"() (+21 more)

### Community 75 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (49): TransactionHistoryStorage, PgTransactionHistoryStorage, Added, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 5. WalletState envelope (+41 more)

### Community 76 - "binding.test.ts"
Cohesion: 0.06
Nodes (49): startHashDecision, a165Run, Attempt, A113Observation, A156Observation, Binding, Created, Outcome (+41 more)

### Community 77 - "core-settings.ts"
Cohesion: 0.04
Nodes (47): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, Absent, DeepReadonly (+39 more)

### Community 78 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (30): Because, columnVerdict, DefaultPart, keyOrder, TableRule, TypeRule, DesignTable, becauseOf() (+22 more)

### Community 8 - "node-fields-harness.ts"
Cohesion: 0.03
Nodes (125): NodeCallOptions, Scenario, RecordingClient, A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector (+117 more)

### Community 81 - "pause-fixtures.ts"
Cohesion: 0.06
Nodes (37): backupSignalRelay, BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable, PausableOptions, RecorderGlobals (+29 more)

### Community 82 - "mapping.ts"
Cohesion: 0.06
Nodes (36): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+28 more)

### Community 83 - "restore-ledger.ts"
Cohesion: 0.08
Nodes (43): CrashEvent, CrashJob, watched, RestartEvent, RestartJob, WindowBackup, ReadableDatabase, RestoreBuild (+35 more)

### Community 84 - "restore-content-defined.test.ts"
Cohesion: 0.08
Nodes (43): FileRow, ledgerBackup, FileProcess, privateBackup, PublicSetting, PublicSide, PublicSideOptions, isEmptyDatabase() (+35 more)

### Community 86 - "entries.ts"
Cohesion: 0.05
Nodes (45): DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+37 more)

### Community 87 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 88 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 89 - "chain-process.test.ts"
Cohesion: 0.07
Nodes (32): WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Failing, Flaky, Seen (+24 more)

### Community 9 - "vitest"
Cohesion: 0.02
Nodes (104): Served, ParentJob, Kill, Orphaned, SourceFile, Run, WorkerEvent, Lockfile (+96 more)

### Community 90 - "height-versioned.test.ts"
Cohesion: 0.09
Nodes (31): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+23 more)

### Community 91 - "page.ts"
Cohesion: 0.06
Nodes (34): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+26 more)

### Community 92 - "transport.test.ts"
Cohesion: 0.08
Nodes (28): Message, Ended, rawClient, Escape, publicState, Refused, confinementProblems(), endedWithin() (+20 more)

### Community 93 - "browser.test.ts"
Cohesion: 0.08
Nodes (41): Reachable, RestoreAttempt, PageBackup, PageEvent, PageLink, PageRestore, ProcessName, StatusBody (+33 more)

### Community 94 - "example-checks.ts"
Cohesion: 0.08
Nodes (30): TypeCheckFinding, TypeCheckResult, Finding, BlockImport, ChildResult, CodeBlock, installedProject, configCompilerOptions() (+22 more)

### Community 95 - "process-harness.ts"
Cohesion: 0.08
Nodes (30): EntryRange, MisuseListener, PgliteTestServer, Seen, RunnerBackend, ContextsClass, Process, a141Problems() (+22 more)

### Community 96 - "private/lockstep-wait.test.ts"
Cohesion: 0.09
Nodes (42): LockstepCondition, OpenTransaction, A118Observation, MismatchObservation, ExpectedWait, WaitSample, hashAt(), inMemoryBlock() (+34 more)

### Community 97 - "pglite.ts"
Cohesion: 0.09
Nodes (18): AsyncLocalStorage, AsyncResource, MultiStatementRunner, Job, JobQueue, Outcome, PgliteDatabase, ServerErrorFields (+10 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+27 more)

### Community 170 - "Acceptance — TOKEN-METADATA: MIP-0018 token metadata from contract logs"
Cohesion: 0.10
Nodes (20): 1. Starting and storing (TM-1, TM-2, TM-20), 2. Finding candidates (TM-3, TM-4), 3. The decoder (TM-5, TM-6, TM-21), 4. Binding, outcomes and colors (TM-7, TM-8, TM-12), 5. State (TM-9 … TM-11), 6. Serving (TM-13 … TM-19), 7. Safety (TM-21), 8. Conformance and the real chain (+12 more)

### Community 291 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 99 - "data"
Cohesion: 0.06
Nodes (39): params(), n(), data(), 7. The module API, 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants, 2.4 Migrations: one per part (O-2) (+31 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 113 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 121 - ".slowBlockMs"
Cohesion: 0.07
Nodes (30): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+22 more)

### Community 167 - "T"
Cohesion: 0.10
Nodes (21): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 0. Schema (+13 more)

### Community 189 - "local-preprod-sync.mjs"
Cohesion: 0.21
Nodes (17): commitOf(), configText(), docker(), dockerHas(), dockerLater(), imageDigests(), main(), nodeRpc() (+9 more)

### Community 196 - "connectChannel"
Cohesion: 0.22
Nodes (11): discard(), isChannel(), connectChannel(), 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard, Evidence, Problem, Suggested fix, 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once (+3 more)

### Community 197 - ".disconnect"
Cohesion: 0.15
Nodes (14): fault(), Suggested fix, 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants (+6 more)

### Community 200 - "fixtures/configuration.ts"
Cohesion: 0.20
Nodes (13): core(), databaseOf(), defineConfig(), coreConfiguration(), param(), privateConfiguration(), configuration, CORE_MODULES (+5 more)

### Community 203 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 204 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 212 - "tabReport"
Cohesion: 0.29
Nodes (13): apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+5 more)

### Community 214 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 219 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 225 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 238 - "shiftedSource"
Cohesion: 0.47
Nodes (4): failingSource(), lookalike(), shiftedSource(), flakySource()

### Community 243 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 256 - "readBody"
Cohesion: 0.25
Nodes (8): bodyTooLarge(), fetchBody(), utf8Text(), readBody(), 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 258 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 265 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 270 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.29
Nodes (6): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers

### Community 307 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 348 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 349 - "package-keys-walk.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 367 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 58 - "history"
Cohesion: 0.04
Nodes (63): history(), revision(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+55 more)

### Community 70 - "code"
Cohesion: 0.04
Nodes (56): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+48 more)

### Community 79 - ".put"
Cohesion: 0.04
Nodes (47): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+39 more)

### Community 80 - "table"
Cohesion: 0.05
Nodes (51): bindCoreChainEvents(), side(), migrations(), table(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails (+43 more)

### Community 85 - ".off"
Cohesion: 0.04
Nodes (49): Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25) (+41 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning (+33 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+31 more)

### Community 110 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 139 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 158 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 163 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 164 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 165 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+15 more)

### Community 171 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 181 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 182 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 185 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 186 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+9 more)

### Community 187 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.11
Nodes (17): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4, 2. G9 — the four crash tests (+9 more)

### Community 188 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 190 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 192 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 193 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 201 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 202 - "ADDED Requirements"
Cohesion: 0.13
Nodes (15): ADDED Requirements, Requirement: TM-11 A tombstone deletes its field, and an emptied identity vanishes, Requirement: TM-13 Only defined keys are served, Requirement: TM-16 Identities are grouped by symbol within one contract, Requirement: TM-20 Stored rows are a pure function of the chain, Requirement: TM-2 Stored rows are facts of each block's own logs, Requirement: TM-4 An unknown serialization fails the block, Requirement: TM-8 Every candidate's outcome is stored (+7 more)

### Community 208 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 209 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 210 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 216 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 217 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 218 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 223 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 224 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 226 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 227 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.17
Nodes (11): 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents, 7. `core-arch` criteria rewritten by this change, 8. Required test ids (+3 more)

### Community 229 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 230 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 231 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 232 - "README.md"
Cohesion: 0.29
Nodes (3): Choosing a database, Launching it, stats-module

### Community 233 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 235 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 236 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 237 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 241 - "[0.10.0] - 2026-10-27"
Cohesion: 0.20
Nodes (9): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changed since `v0.10.0-rc.2`: ledger nodes reclaimed by reference counting (`ledger-refcount`), Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface) (+1 more)

### Community 242 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 244 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 245 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 246 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 247 - "Boundaries, threats and controls"
Cohesion: 0.20
Nodes (10): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+2 more)

### Community 248 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure, Design — Sprint 2: Transaction/Lease (+1 more)

### Community 249 - "Proposal — TOKEN-METADATA: MIP-0018 token metadata from contract logs (`token-metadata`)"
Cohesion: 0.20
Nodes (9): Capabilities, Decisions taken (2026-11-05), Impact, Modified Capabilities, New Capabilities, Non-goals (what this change does NOT cover), Proposal — TOKEN-METADATA: MIP-0018 token metadata from contract logs (`token-metadata`), What changes (+1 more)

### Community 250 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 251 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 252 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 254 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 255 - "ROADMAP.md"
Cohesion: 0.22
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 257 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 259 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 260 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 261 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.22
Nodes (8): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution, Design — v1.0.0-perf-baseline

### Community 262 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 263 - "After 0.10.0"
Cohesion: 0.22
Nodes (9): 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals, Release gates still to run (+1 more)

### Community 266 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 267 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 268 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 269 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 271 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 273 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 274 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 275 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 276 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 277 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 278 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases, Spec delta — `configuration` capability

### Community 279 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 280 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 281 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 282 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 284 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 288 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 289 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 290 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 292 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 293 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 294 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 295 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 296 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 297 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 298 - "Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`), What changes, Why

### Community 299 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 300 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 301 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 302 - "Requirement: TM-6 Keys and values follow the MIP's rules"
Cohesion: 0.33
Nodes (6): Requirement: TM-6 Keys and values follow the MIP's rules, Scenario: Exact bytes (A3), Scenario: Image (A6), Scenario: Integer widths (A4), Scenario: Invalid keys and values (R5), Scenario: Values that are not tombstones (A5)

### Community 303 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 304 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 305 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 306 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 308 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 309 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 310 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 311 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 312 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 313 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 314 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 315 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 316 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 317 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 318 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 319 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 320 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 321 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 322 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 323 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.40
Nodes (4): 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 324 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 325 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 326 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 327 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 328 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 329 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 330 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 331 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 332 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 333 - "00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail"
Cohesion: 0.40
Nodes (4): 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix

### Community 334 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 335 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 336 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 337 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 338 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 339 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 340 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 341 - "00084 — The contents hash's key-ordered read splices its page size into `LIMIT`"
Cohesion: 0.40
Nodes (4): 00084 — The contents hash's key-ordered read splices its page size into `LIMIT`, Evidence, Problem, Suggested fix

### Community 342 - "00085 — The fast contract-log provider limits mid-chain use: development-only, and it halts on partial transactions"
Cohesion: 0.40
Nodes (4): 00085 — The fast contract-log provider limits mid-chain use: development-only, and it halts on partial transactions, Evidence, Problem, Suggested fix

### Community 343 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 344 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 345 - "Requirement: BK-1 Backup"
Cohesion: 0.40
Nodes (5): Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`

### Community 346 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 347 - "Requirement: TM-5 A payload is accepted whole or rejected whole"
Cohesion: 0.40
Nodes (5): Requirement: TM-5 A payload is accepted whole or rejected whole, Scenario: A header with no records (R1), Scenario: A record past byte 256 (R2), Scenario: A valid record followed by an invalid one (R6), Scenario: Non-zero bytes after the end (R3)

### Community 350 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 351 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 352 - "00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes"
Cohesion: 0.50
Nodes (3): 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes, Evidence, Suggested fix

### Community 353 - "00083 — Four timing-bound tests fail when the machine runs several test lanes at once"
Cohesion: 0.50
Nodes (3): 00083 — Four timing-bound tests fail when the machine runs several test lanes at once, Problem, Suggested fix

### Community 354 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 355 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 356 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 357 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 358 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 359 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 360 - "Requirement: TM-18 The module's routes answer from finalized data"
Cohesion: 0.50
Nodes (4): Requirement: TM-18 The module's routes answer from finalized data, Scenario: A large integer, Scenario: A withdrawn identity, Scenario: Before the first commit

### Community 361 - "Requirement: TM-1 An opt-in public module that can start at any height"
Cohesion: 0.50
Nodes (4): Requirement: TM-1 An opt-in public module that can start at any height, Scenario: A v8 block, Scenario: Added to a database synced from 0, Scenario: Started at the head with the fast log provider

### Community 362 - "Requirement: TM-3 Candidates are found by event type and exact name"
Cohesion: 0.50
Nodes (4): Requirement: TM-3 Candidates are found by event type and exact name, Scenario: A log of another type, Scenario: Another version's name, Scenario: Trailing zeros dropped by the source

### Community 363 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 364 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 371 - "Requirement: TM-12 A color resolves to an identity by the kind held"
Cohesion: 0.67
Nodes (3): Requirement: TM-12 A color resolves to an identity by the kind held, Scenario: A held shielded coin, Scenario: The other kind

### Community 372 - "Requirement: TM-19 Changed identities are notified after commit"
Cohesion: 0.67
Nodes (3): Requirement: TM-19 Changed identities are notified after commit, Scenario: A block with two identities, Scenario: After a restart

### Community 373 - "Requirement: TM-21 Payload bytes and served values are untrusted"
Cohesion: 0.67
Nodes (3): Requirement: TM-21 Payload bytes and served values are untrusted, Scenario: A hostile payload, Scenario: A script URI

### Community 374 - "Requirement: TM-7 Records belong to the emitting contract, and colors are computed"
Cohesion: 0.67
Nodes (3): Requirement: TM-7 Records belong to the emitting contract, and colors are computed, Scenario: Separate identities (S6), Scenario: The color formula

### Community 375 - "Requirement: TM-9 Every answer states its coverage"
Cohesion: 0.67
Nodes (3): Requirement: TM-9 Every answer states its coverage, Scenario: Started at the head, Scenario: Synced from genesis

### Community 376 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-8949`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4446 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ledger-graph-tapes.ts`, `admin-harness.ts`, `migrate.ts`, `process-backends.ts`, `builds.ts`, `adapter-fixtures.ts`, `InMemoryBlockSource`, `node-fields-harness.ts`, `ref_node_fs`, `channel-queue.test.ts`, `NodeClient`, `config/history.ts`, `core-private-source.test.ts`, `BlockRef`, `core-block-parsed.ts`, `tape/index.ts`, `declaration.ts`, `loop.ts`, `ModuleDeclaration`, `hex`, `core-transport.ts`, `openPostgres`, `api.ts`, `contract-data-checks.ts`, `loop.test.ts`, `host.ts`, `api-server.test.ts`, `validation.ts`, `record-and-replay.test.ts`, `chain-placement.test.ts`, `resolve.ts`, `mounted-admin.test.ts`, `UmbraError`, `core-ledger-state/sql.ts`, `adapter.ts`, `messages.ts`, `ref_node_timers`, `configured.ts`, `validate.ts`, `connectWebSocket`, `process-admin.ts`, `coreEntry`, `.from`, `core-block-commit.test.ts`, `refcount-model.ts`, `determinism/contents-hash.ts`, `refused-configuration.test.ts`, `ledger/types.ts`, `runner/process.ts`, `containers.test.ts`, `src/db/postgres.ts`, `refcount-restart.ts`, `ledger-storage.test.ts`, `ledger/ledger-tasks.test.ts`, `cbor.ts`, `transform-checks.ts`, `boundary.test.ts`, `slow-block-harness.ts`, `database-parts.ts`, `start-umbradb.ts`, `declaration`, `node.test.ts`, `core-ledger-state.ts`, `loop-stop-harness.ts`, `client.test.ts`, `binding.test.ts`, `core-settings.ts`, `column-rules.test.ts`, `pause-fixtures.ts`, `mapping.ts`, `restore-ledger.ts`, `restore-content-defined.test.ts`, `entries.ts`, `retirement.test.ts`, `chain-process.test.ts`, `height-versioned.test.ts`, `transport.test.ts`, `browser.test.ts`, `example-checks.ts`, `process-harness.ts`, `private/lockstep-wait.test.ts`, `redact.ts`, `backup/restore.ts`, `src/config/load.ts`, `cold-boot-recovery.integration.test.ts`, `networks.ts`, `paused-harness.ts`, `Worker`, `node-set.test.ts`, `release-version.ts`, `sweep-fixture.test.ts`, `real-tapes.ts`, `browser/build.ts`, `core-digest.ts`, `configuration-refusal.test.ts`, `resolver-boundary.ts`, `units.test.ts`, `checks.test.ts`, `version-checks.ts`, `postgres/transaction-history-storage.ts`, `code-registry.ts`, `package.json`, `shadow-schema.test.ts`, `documents.ts`, `pg-tx-history-adapter.ts`, `read-gate.ts`, `cbor.property.test.ts`, `test/postgres/setup.ts`, `recovery.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `surface.test.ts`, `changes.property.test.ts`, `node-bridge.ts`, `backbone/part-migrations.test.ts`, `harness.ts`, `library-documents.test.ts`, `worker-storage.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `ingest-faults.test.ts`, `listening.test.ts`, `excluded-not-exported.test.ts`, `text.test.ts`, `read-height.property.test.ts`, `version-selection.test.ts`, `LoopPauses`, `ws-mutual-tls.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `api-session.test.ts`, `twox.ts`, `Heartbeat`, `history.property.test.ts`, `facade-merge-loader.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ledger-graph-tapes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.029404761904761906 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `ledger-graph-tapes.ts`, `admin-harness.ts`, `startUmbraDB`, `migrate.ts`, `process-backends.ts`, `builds.ts`, `adapter-fixtures.ts`, `InMemoryBlockSource`, `ref_node_fs`, `channel-queue.test.ts`, `NodeClient`, `config/history.ts`, `core-private-source.test.ts`, `BlockRef`, `core-block-parsed.ts`, `declaration.ts`, `loop.ts`, `ModuleDeclaration`, `core-transport.ts`, `openPostgres`, `api.ts`, `contract-data-checks.ts`, `loop.test.ts`, `LedgerPackage`, `api-server.test.ts`, `FinalizedLoop`, `validation.ts`, `record-and-replay.test.ts`, `resolve.ts`, `mounted-admin.test.ts`, `column-rules.ts`, `core-ledger-state/sql.ts`, `messages.ts`, `ref_node_timers`, `configured.ts`, `validate.ts`, `connectWebSocket`, `process-admin.ts`, `coreEntry`, `core-block-commit.test.ts`, `range.ts`, `Process`, `refcount-model.ts`, `determinism/contents-hash.ts`, `refused-configuration.test.ts`, `ledger/types.ts`, `runner/process.ts`, `containers.test.ts`, `src/db/postgres.ts`, `ProcessHandle`, `ledger/ledger-tasks.test.ts`, `cbor.ts`, `transform-checks.ts`, `slow-block-harness.ts`, `database-parts.ts`, `start-umbradb.ts`, `declaration`, `core-ledger-state.ts`, `client.test.ts`, `binding.test.ts`, `core-settings.ts`, `pause-fixtures.ts`, `mapping.ts`, `restore-ledger.ts`, `entries.ts`, `graph.ts`, `chain-process.test.ts`, `height-versioned.test.ts`, `transport.test.ts`, `process-harness.ts`, `private/lockstep-wait.test.ts`, `pglite.ts`, `backup/backup.ts`, `backup/restore.ts`, `src/config/load.ts`, `configuration-refusal.test.ts`, `units.test.ts`, `checks.test.ts`, `version-checks.ts`, `core-chain.ts`, `shadow-schema.test.ts`, `checkShape`, `changes.property.test.ts`, `backbone/part-migrations.test.ts`, `version-table.ts`, `ingest-faults.test.ts`, `statementsOf`, `shiftedSource`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024239486122894196 - nodes in this community are weakly interconnected._