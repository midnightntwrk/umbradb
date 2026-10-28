# Graph Report - UmbraDB

## Corpus Check
- 1057 files · ~1,489,381 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11160 nodes · 33948 edges · 335 communities (302 shown, 33 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2624 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `807dae860d21e0a4` (1057 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- column-rules.ts
- migrate.ts
- tape/index.ts
- Design — Sprint 1: project setup + TemporalKV
- config-check.ts
- validate.ts
- browser.test.ts
- page.ts
- config/plain-data.ts
- release-version.test.ts
- config/history.ts
- browser/build.ts
- redact.ts
- node-fields-harness.ts
- src/ledger/identity.ts
- shims.test.ts
- version-checks.ts
- test/postgres/setup.ts
- process-worker.ts
- refused-configuration.test.ts
- code-registry.ts
- pg-tx-history-adapter.ts
- PrivateTransport
- Lockstep
- fixtures/configuration.ts
- documents.ts
- vitest
- node-bridge.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- cbor.ts
- read-gate.ts
- vendored-ledger-v9.test.ts
- core-transport.ts
- digest.test.ts
- threat-model.test.ts
- .concat
- cbor.property.test.ts
- pack-install.mjs
- admin/serve.ts
- sweep.ts
- runner/process.ts
- block-fetch-decode.test.ts
- example-checks.ts
- connection-state.test.ts
- ledger-sweep.test.ts
- declarations.ts
- chrome.ts
- intake.test.ts
- chain-process.test.ts
- childRefKeys
- lockstep-refusals.test.ts
- node-format.ts
- .head
- version-table.ts
- NodeClient
- ws-mutual-tls.test.ts
- backupSignalRelay
- surface.test.ts
- FakeNode
- ReadHandle
- statementsOf
- browser-harness.ts
- describeNodeStoreExports
- RuntimeMetadata
- browser/serve.ts
- web-lock.ts
- process-admin.ts
- version-selection.test.ts
- worker-threads.test.ts
- text.test.ts
- LoopPauses
- history.property.test.ts
- InMemoryBlockSource
- contract-data-checks.ts
- decodeChildren
- lockstep-reads.test.ts
- worker-threads-worker.ts
- Worker
- .send
- adapter-fixtures.ts
- transport-intake.test.ts
- cbor.test.ts
- TapeAnswers
- records.ts
- type-check.ts
- ProcessItems
- client.test.ts
- node-store-suite.ts
- core-block-parsed.ts
- ledger/plain-data.ts
- adapter.ts
- mutation-evidence.d.mts
- node-run.ts
- NetworkBroker
- AsyncLocalStorage
- change-capture.ts
- api-server.ts
- range.ts
- chain-placement.test.ts
- backup/restore.ts
- database-parts.ts
- BlockLedgerSource
- host.ts
- https.ts
- NodeFS
- pause-fixtures.ts
- backup-fixtures.ts
- transform-checks.ts
- ref_node_crypto
- private/backends.ts
- NodeBlockSource
- spawnChild
- Database
- loop.test.ts
- backup/backup.ts
- mapping.ts
- entries.ts
- PgTransactionHistoryStorage
- .value
- slow-block-harness.ts
- validate.test.ts
- .from
- admin-harness.ts
- interfaces/transaction-history-storage.ts
- declaration.ts
- private/lockstep-wait.test.ts
- LedgerPackage
- order.property.test.ts
- configured.ts
- declaration
- validation.ts
- UmbraError
- sweep-tapes.ts
- paused-harness.ts
- binding.test.ts
- process-context.test.ts
- signal-backup.test.ts
- networks.ts
- graph.ts
- Process
- boundary.test.ts
- api-server.test.ts
- record-and-replay.test.ts
- BlockRef
- cold-boot-recovery.integration.test.ts
- net.test.ts
- src/index.ts
- retirement.test.ts
- file-mode.test.ts
- ledger/load.ts
- contract-modules.test.ts
- transaction-history-storage.property.test.ts
- ingest-harness.ts
- core-ledger-state.ts
- LedgerEngine
- ledger/types.ts
- worker-host.test.ts
- zero-timeouts-checks.ts
- FinalizedLoop
- restore-private.ts
- config-hash-checks.ts
- startup-stop-harness.ts
- ledger-tasks-checks.ts
- real-tapes.ts
- core.ts
- .closed
- Proposal — Sprint 3: CheckpointStore
- ADDED Requirements
- T
- ledger/ledger-tasks.test.ts
- UmbraDB module guide
- .slowBlockMs
- refused
- core-ledger-state.test.ts
- following
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- fault
- twox.ts
- Design — v1.1.0: Quint model checking
- UmbraDB third-party component inventory (SBOM)
- v9
- scoped-review-manifest
- encodeRow
- path.ts
- midnight-env — reproducible PREPROD dev environment
- orphan-watcher.mjs
- firstRegularAtParentTime
- read-only-checks.ts
- fresh-instance.mjs
- crash-worker.ts
- history
- .put
- code
- version
- ADDED Requirements
- graph.py
- ADDED Requirements
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- README.md
- Boundaries, threats and controls
- scripts
- stryker.conf.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- UmbraDB software supply-chain directory
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.9.5] - 2026-07-25 — "Penumbra"
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- try.sh
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- Contributing
- UmbraDB operator guide
- stats-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
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
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true
- 00045 — Mutual TLS does not bind a certificate to an instance id
- 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy
- 00047 — Resource limits are per message or connection, not per service
- 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance
- 00049 — A141's "within 2 s" on PostgreSQL fails once under load
- 00050 — A165's race step on PostgreSQL with a transport failed once under load
- 00051 — The transport's instance id is any text: line breaks reach the core's log
- 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents
- bug-report.md
- feature-request.md
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails
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
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 359 edges
2. `UmbraError` - 310 edges
3. `ModuleDeclaration` - 175 edges
4. `FinalizedLoop` - 131 edges
5. `InMemoryBlockSource` - 119 edges
6. `NodeClient` - 113 edges
7. `Database` - 99 edges
8. `BlockRef` - 95 edges
9. `ReadHandle` - 88 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `Evidence` --references--> `tableRefusals()`  [INFERRED]
  docs/issues/00013-nondeterministic-collations-differ-on-pglite.md → src/deterministic-postgresql/column-rules.ts

## Import Cycles
- None detected.

## Communities (335 total, 33 thin omitted)

### Community 0 - "column-rules.ts"
Cohesion: 0.02
Nodes (175): DumpInput, CaptureColumn, CheckedMigration, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions (+167 more)

### Community 1 - "migrate.ts"
Cohesion: 0.02
Nodes (164): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference (+156 more)

### Community 10 - "tape/index.ts"
Cohesion: 0.04
Nodes (114): ProcessCondition, EventSpec, Scenario, transactionSpec, ArgType, BlockOptions, CallSpec, chainBlock (+106 more)

### Community 100 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.05
Nodes (36): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+28 more)

### Community 103 - "config-check.ts"
Cohesion: 0.08
Nodes (30): CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, ConfigFinding, LoadedConfig (+22 more)

### Community 104 - "validate.ts"
Cohesion: 0.11
Nodes (33): ConfigRule, CursorRule, Issue, Plain, SettingsSchema, coreSettingsSchema(), closest(), configFindings() (+25 more)

### Community 105 - "browser.test.ts"
Cohesion: 0.09
Nodes (34): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+26 more)

### Community 106 - "page.ts"
Cohesion: 0.07
Nodes (28): PageState, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog(), backUp(), beginCore() (+20 more)

### Community 108 - "config/plain-data.ts"
Cohesion: 0.09
Nodes (26): PlainArray, plainData, PlainDataNode, PlainDataRule, Walk, ConfigContext, Row, copyArray() (+18 more)

### Community 109 - "release-version.test.ts"
Cohesion: 0.11
Nodes (33): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+25 more)

### Community 11 - "config/history.ts"
Cohesion: 0.03
Nodes (116): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreSettings, HistoryCode, HistoryContext, HistoryFinding, HistoryInput (+108 more)

### Community 110 - "browser/build.ts"
Cohesion: 0.08
Nodes (25): BrowserBuildOptions, BrowserControl, CheckedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+17 more)

### Community 112 - "redact.ts"
Cohesion: 0.11
Nodes (25): RedactionForms, SecretForm, TextPattern, Needs, findings(), configRedactor(), credentialsIn(), decoded() (+17 more)

### Community 113 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (25): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+17 more)

### Community 114 - "src/ledger/identity.ts"
Cohesion: 0.12
Nodes (28): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages() (+20 more)

### Community 115 - "shims.test.ts"
Cohesion: 0.10
Nodes (18): Buffer, BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText(), charCodes() (+10 more)

### Community 116 - "version-checks.ts"
Cohesion: 0.12
Nodes (22): MetadataBlock, RuntimeMetadataEntry, OwnStateMetadata, Boundary, CallRecord, CountingNode, MetadataSelector, Select (+14 more)

### Community 118 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 119 - "process-worker.ts"
Cohesion: 0.12
Nodes (22): ProcessView, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, openedProcess, adminAnswer() (+14 more)

### Community 12 - "refused-configuration.test.ts"
Cohesion: 0.03
Nodes (113): ProcessConfig, AdminRun, Answered, Hold, Observation, ProbeRecord, Start, Child (+105 more)

### Community 120 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 121 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 122 - "PrivateTransport"
Cohesion: 0.12
Nodes (9): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), rowsOf() (+1 more)

### Community 124 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 125 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (21): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, PglitePathParts, core(), databaseOf() (+13 more)

### Community 128 - "documents.ts"
Cohesion: 0.12
Nodes (26): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+18 more)

### Community 13 - "vitest"
Cohesion: 0.02
Nodes (76): Finding, Lockfile, Manifest, RepositoryFile, Upstream, Finding, Leftover, RemovedName (+68 more)

### Community 132 - "node-bridge.ts"
Cohesion: 0.11
Nodes (19): StoredNode, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 133 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 134 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 136 - "cbor.ts"
Cohesion: 0.09
Nodes (22): ColumnMode, DateTimeFields, Mode, PathNode, Task, ScalarColumnType, compareBytes(), daysInMonth() (+14 more)

### Community 137 - "read-gate.ts"
Cohesion: 0.15
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 138 - "vendored-ledger-v9.test.ts"
Cohesion: 0.16
Nodes (23): NodeRoot, freeAll(), bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free() (+15 more)

### Community 14 - "core-transport.ts"
Cohesion: 0.03
Nodes (97): ResultColumn, Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, Message (+89 more)

### Community 140 - "digest.test.ts"
Cohesion: 0.13
Nodes (22): ChangeKind, tableChanges, TouchedRow, digestBlock(), encodeArrayHead(), changeOf(), concat(), isCheckpointHeight() (+14 more)

### Community 141 - "threat-model.test.ts"
Cohesion: 0.14
Nodes (23): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+15 more)

### Community 142 - ".concat"
Cohesion: 0.11
Nodes (14): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+6 more)

### Community 143 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 146 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 147 - "admin/serve.ts"
Cohesion: 0.14
Nodes (14): AdminChannel, AdminServeOptions, ToAdmin, AdminAnswer, Heartbeat, isMessage(), serveAdmin(), lastTick() (+6 more)

### Community 148 - "sweep.ts"
Cohesion: 0.12
Nodes (13): GreyView, SweepPhase, SweepTables, byBytes(), BYTE_ORDER(), hexOf(), merged(), sweepStep() (+5 more)

### Community 15 - "runner/process.ts"
Cohesion: 0.03
Nodes (80): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, PointName, CallbackFailure (+72 more)

### Community 150 - "block-fetch-decode.test.ts"
Cohesion: 0.14
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), concatBytes(), encodeCompact() (+9 more)

### Community 151 - "example-checks.ts"
Cohesion: 0.17
Nodes (16): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+8 more)

### Community 152 - "connection-state.test.ts"
Cohesion: 0.14
Nodes (9): Connection, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets, handClient(), DEFAULT_HEARTBEAT_MS (+1 more)

### Community 156 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (12): SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints(), compare() (+4 more)

### Community 157 - "declarations.ts"
Cohesion: 0.11
Nodes (10): Accepts, Rest, WithKnownPoints, WithUnknownPoint, schemaName(), module(), userModules(), refusal() (+2 more)

### Community 158 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 159 - "intake.test.ts"
Cohesion: 0.20
Nodes (11): PrivateSeen, A114Observation, A116Observation, TestLink, a114Problems(), a114Run(), a116Problems(), heights() (+3 more)

### Community 16 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (84): BlockHeaderItem, CoreBlockHeader, LedgerTable, BlockContext, InMemoryItems, InMemorySourceOptions, Wait, StandInOptions (+76 more)

### Community 160 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 161 - "lockstep-refusals.test.ts"
Cohesion: 0.22
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+10 more)

### Community 162 - "node-format.ts"
Cohesion: 0.21
Nodes (14): Child, Readable, TableNode, node(), childKey(), concat(), encodeChild(), encodeChildren() (+6 more)

### Community 166 - ".head"
Cohesion: 0.27
Nodes (14): Writer, checkSafeInteger(), encodeColumnScalar(), encodeGeneric(), encodeOne(), enter(), fail(), kindOf() (+6 more)

### Community 168 - "version-table.ts"
Cohesion: 0.21
Nodes (18): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+10 more)

### Community 17 - "NodeClient"
Cohesion: 0.05
Nodes (67): HeadSubscriber, NodeCallOptions, NodeClient, Pending, State, Subscription, Waiter, NodeBlock (+59 more)

### Community 175 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (12): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+4 more)

### Community 177 - "backupSignalRelay"
Cohesion: 0.15
Nodes (10): backupSignalRelay, SignalSource, stopSignal, BackupSignals, TickerOptions, PausableOptions, inferSide(), processOf() (+2 more)

### Community 178 - "surface.test.ts"
Cohesion: 0.20
Nodes (15): Surface, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12(), section12Surface() (+7 more)

### Community 18 - "ReadHandle"
Cohesion: 0.03
Nodes (68): BlockWriteHandle, ReadHandle, exclusiveJob, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+60 more)

### Community 181 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 182 - "browser-harness.ts"
Cohesion: 0.32
Nodes (14): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+6 more)

### Community 183 - "describeNodeStoreExports"
Cohesion: 0.22
Nodes (3): NodeStoreExports, NodeStoreSubject, describeNodeStoreExports()

### Community 186 - "RuntimeMetadata"
Cohesion: 0.19
Nodes (4): MetadataNode, RuntimeMetadata, OwnStateMetadata, hexOf()

### Community 187 - "browser/serve.ts"
Cohesion: 0.21
Nodes (10): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), CONTENT_TYPES (+2 more)

### Community 188 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 19 - "process-admin.ts"
Cohesion: 0.05
Nodes (90): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+82 more)

### Community 192 - "version-selection.test.ts"
Cohesion: 0.35
Nodes (13): Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts(), haltOf() (+5 more)

### Community 194 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 197 - "text.test.ts"
Cohesion: 0.23
Nodes (6): BackupText, blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir

### Community 198 - "LoopPauses"
Cohesion: 0.23
Nodes (3): LoopPaused, LoopPauses, watched()

### Community 199 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 2 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (132): InMemoryBlockSource, ProcessingEnd, ProcessStatus, Flaky, ProcessObservation, ChangedFile, GenesisFixture, installationCopy (+124 more)

### Community 20 - "contract-data-checks.ts"
Cohesion: 0.04
Nodes (92): BlockTransaction, CoreContractLogsFastOptions, UnsureLog, UnsureReason, CoreContractLogsFullOptions, ContractStateRow, CoreContractStatesOptions, DefinedModule (+84 more)

### Community 200 - "decodeChildren"
Cohesion: 0.31
Nodes (6): Reader, decodeChild(), decodeChildren(), readChild(), readChildList(), taggedRootKey()

### Community 201 - "lockstep-reads.test.ts"
Cohesion: 0.22
Nodes (9): Pause, Q142Observation, SkipsLockstep, PRIVATE_ROWS_SQL(), pauseGate(), pausing(), q142Run(), until() (+1 more)

### Community 203 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 21 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (81): CallTx, DeployTx, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot (+73 more)

### Community 215 - "cbor.test.ts"
Cohesion: 0.24
Nodes (9): CanonicalEncodingFailure, CanonicalValue, toHex(), expectFailure(), failure(), hexOf(), rowHex(), RFC-3339 (+1 more)

### Community 216 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 22 - "records.ts"
Cohesion: 0.05
Nodes (60): RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError, Connection (+52 more)

### Community 223 - "type-check.ts"
Cohesion: 0.33
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 23 - "client.test.ts"
Cohesion: 0.03
Nodes (54): ConnectSocket, Outage, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, TapeNode (+46 more)

### Community 232 - "node-store-suite.ts"
Cohesion: 0.31
Nodes (7): StoredNode, Disposable, NodeBatch, hasEmbeddedChild(), hex(), nodesOf(), sortedHex()

### Community 24 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (82): BodyExtrinsic, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions, TransactionParser, ChainTransaction (+74 more)

### Community 241 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 25 - "adapter.ts"
Cohesion: 0.04
Nodes (66): ContractLog, AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent (+58 more)

### Community 250 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 251 - "node-run.ts"
Cohesion: 0.47
Nodes (5): NodeRunResult, withDevelopmentOptIn(), hex(), nodeRun(), PATIENCE_MS

### Community 26 - "change-capture.ts"
Cohesion: 0.04
Nodes (73): CapturedTable, CaptureState, GuardTableRow, optOut, Op, States, TableName, captureDefinitions() (+65 more)

### Community 27 - "api-server.ts"
Cohesion: 0.04
Nodes (63): ModuleApiServer, ModuleApiStart, StartedModuleApi, Connection, HeadersArgument, ModuleApiServerOptions, ModuleApiStart, StartedModuleApi (+55 more)

### Community 28 - "range.ts"
Cohesion: 0.04
Nodes (71): BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command (+63 more)

### Community 29 - "chain-placement.test.ts"
Cohesion: 0.06
Nodes (75): ChainEvent, ScaleValue, BlockSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+67 more)

### Community 3 - "backup/restore.ts"
Cohesion: 0.02
Nodes (119): PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes, PublicConfiguration (+111 more)

### Community 30 - "database-parts.ts"
Cohesion: 0.04
Nodes (61): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, DatabaseParts, PostgresParts, PostgresPartsInput (+53 more)

### Community 31 - "host.ts"
Cohesion: 0.06
Nodes (50): LoadLedger, LedgerStateItem, LedgerName, ChainOutcome, LedgerPackageOptions, NodeBatch, AppliedState, ApplyBlock (+42 more)

### Community 32 - "pause-fixtures.ts"
Cohesion: 0.05
Nodes (60): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, PausesInsideTheHeight (+52 more)

### Community 33 - "backup-fixtures.ts"
Cohesion: 0.08
Nodes (51): BackupBackend, BackupDatabase, killedRestore, cliProject, isEmptyDatabase(), catalogOf(), connectionOf(), hashOf() (+43 more)

### Community 34 - "transform-checks.ts"
Cohesion: 0.07
Nodes (54): Failure, Variant, TapeError, TransformError, recordKind, CallSelection, NotificationRange, fakeResult() (+46 more)

### Community 35 - "ref_node_crypto"
Cohesion: 0.04
Nodes (55): SslMode, driverConnectionOptions, PostgresConnection, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule (+47 more)

### Community 37 - "private/backends.ts"
Cohesion: 0.06
Nodes (46): PrivateBackend, SessionSeen, PublicCore, Pem, TestCertificates, InstancesOptions, instancesRun, Escape (+38 more)

### Community 38 - "NodeBlockSource"
Cohesion: 0.06
Nodes (23): CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeSubscription, PreparedBlock, QueueRunner (+15 more)

### Community 39 - "spawnChild"
Cohesion: 0.04
Nodes (57): Served, ParentJob, Kill, Orphaned, SourceFile, Run, WorkerEvent, LockResult (+49 more)

### Community 4 - "Database"
Cohesion: 0.03
Nodes (113): Database, PostgresOptions, Snapshot, LoadOutcome, OutsideRead, Traced, WriterProcess, Opened (+105 more)

### Community 40 - "loop.test.ts"
Cohesion: 0.05
Nodes (50): WaitingInRead, AtGate, WaitsInTransaction, LoopClass, SeenCall, Broken, FailingAfter, Given (+42 more)

### Community 41 - "backup/backup.ts"
Cohesion: 0.05
Nodes (64): BackupInput, BackupSeams, BackupTarget, BackupWritten, ManifestHistoryRow, ManifestMigration, ManifestTool, PgliteDump (+56 more)

### Community 42 - "mapping.ts"
Cohesion: 0.05
Nodes (49): ResultType, TestBackend, Case, HeldRead, Job, Outcome, Reads, Step (+41 more)

### Community 43 - "entries.ts"
Cohesion: 0.03
Nodes (62): LedgerTableSettings, TransportReaderSettings, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder (+54 more)

### Community 44 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (56): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built) (+48 more)

### Community 46 - ".value"
Cohesion: 0.09
Nodes (39): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef (+31 more)

### Community 47 - "slow-block-harness.ts"
Cohesion: 0.08
Nodes (52): BlockEventSource, BlockItemSource, LoopInput, MisuseReports, StatusBody, Times, Wait, askedSource (+44 more)

### Community 48 - "validate.test.ts"
Cohesion: 0.05
Nodes (51): EntryRef, CursorRow, Expected, Row, databaseText(), refusal(), validateConfig(), findings() (+43 more)

### Community 49 - ".from"
Cohesion: 0.06
Nodes (54): recordedGenesis, Side, FreshInstanceRequest, FreshInstanceResult, FoundTape, Tape, in8Problems(), hexOf() (+46 more)

### Community 5 - "admin-harness.ts"
Cohesion: 0.03
Nodes (108): adminRoutes, FromAdmin, AdminServer, AdminStarter, AdminStartOptions, AdminEndpoint, AdminPart, AdminSnapshot (+100 more)

### Community 50 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (42): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+34 more)

### Community 51 - "declaration.ts"
Cohesion: 0.05
Nodes (40): QueuedBlock, versionEntry, ItemSink, KnownPointsOnly, ModuleDeclaration, TableDeclaration, BlockItems, LateUse (+32 more)

### Community 52 - "private/lockstep-wait.test.ts"
Cohesion: 0.07
Nodes (53): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, ExpectedWait, A155Observation, Outcome, directPublic() (+45 more)

### Community 53 - "LedgerPackage"
Cohesion: 0.06
Nodes (35): LedgerPackage, StateHandle, Settled, StagenetBlockJson, StagenetFixtureJson, stagenetReplay, parsedOf(), expectSmallStateReloadsByKey() (+27 more)

### Community 54 - "order.property.test.ts"
Cohesion: 0.06
Nodes (53): PointArguments, CallEvent, Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, dispatch() (+45 more)

### Community 55 - "configured.ts"
Cohesion: 0.07
Nodes (46): BackupFacts, ReadDatabaseOptions, ConfiguredDatabase, databaseTarget, CreatedDirectory, Held, PgliteLockUse, readCursor() (+38 more)

### Community 56 - "declaration"
Cohesion: 0.07
Nodes (50): GraphInput, PastFaultCase, RefusalCase, Pipeline, resolveGraph(), keysModule(), contractLogs(), declaration() (+42 more)

### Community 58 - "validation.ts"
Cohesion: 0.06
Nodes (42): DeclarationRule, PlacedDeclaration, Plain, Shape, Case, ShapeCase, Stats, checkItem() (+34 more)

### Community 6 - "UmbraError"
Cohesion: 0.03
Nodes (85): LoadedConfig, LoadOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, ConfiguredDatabaseOptions (+77 more)

### Community 60 - "sweep-tapes.ts"
Cohesion: 0.10
Nodes (48): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData (+40 more)

### Community 61 - "paused-harness.ts"
Cohesion: 0.07
Nodes (42): LoadOptions, A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running (+34 more)

### Community 62 - "binding.test.ts"
Cohesion: 0.07
Nodes (43): startHashDecision, A165Options, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding (+35 more)

### Community 63 - "process-context.test.ts"
Cohesion: 0.06
Nodes (32): Revision, EntryRange, MisuseListener, ProcessContexts, PublishRefusal, RunnerBackend, AllowsOutside, AllowsTwice (+24 more)

### Community 64 - "signal-backup.test.ts"
Cohesion: 0.06
Nodes (37): WORKER, SignalEvent, SignalJob, IgnoredJob, RunningCommand, statsConfig, startWorker(), report() (+29 more)

### Community 65 - "networks.ts"
Cohesion: 0.05
Nodes (46): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+38 more)

### Community 66 - "graph.ts"
Cohesion: 0.07
Nodes (49): Edge, GraphFacts, GraphPart, GraphRule, HeightRange, MidChain, Missing, RangeCheck (+41 more)

### Community 67 - "Process"
Cohesion: 0.09
Nodes (9): CoreTransport, PauseHold, Process, messageOf(), nodeClientClosed(), nodeSignals(), get(), losingCommits() (+1 more)

### Community 68 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 69 - "api-server.test.ts"
Cohesion: 0.07
Nodes (33): ApiRegistry, ModuleApiServer, ChainDataAnswer, HttpHandler, HttpRoute, AcceptsDuplicates, AddsExtensions, AddsHeaders (+25 more)

### Community 7 - "record-and-replay.test.ts"
Cohesion: 0.02
Nodes (75): NodeRetry, Answer, Handler, Received, recorded, ManualTimers, ConnectionFrames, Recorded (+67 more)

### Community 70 - "BlockRef"
Cohesion: 0.08
Nodes (27): BlockRef, CommitOutcome, HeldHeight, Fetching, Recorder, LateRedelivery, Outcomes, AlwaysLanded (+19 more)

### Community 71 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (30): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+22 more)

### Community 72 - "net.test.ts"
Cohesion: 0.08
Nodes (20): IncomingMessage, Server, Emitter, Frame, Listener, PortSocket, PortUpgrade, RawData (+12 more)

### Community 73 - "src/index.ts"
Cohesion: 0.08
Nodes (38): Outcome, UmbraConfig, FieldKind, FieldSchema, ItemDeclaration, Lifetime, ChainDataView, ApiRequest (+30 more)

### Community 75 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 76 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (32): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+24 more)

### Community 77 - "ledger/load.ts"
Cohesion: 0.08
Nodes (29): LedgerReleasePackage, V9Logs, oracleCase, loadLedgerPackage(), createV8Adapter(), createV9Adapter(), createV9Rc3Adapter(), cost() (+21 more)

### Community 78 - "contract-modules.test.ts"
Cohesion: 0.07
Nodes (32): FastLogReader, LogSite, Program, V9Raw, Freeable, LoadAdapter, bytesOfHex(), decode() (+24 more)

### Community 79 - "transaction-history-storage.property.test.ts"
Cohesion: 0.07
Nodes (23): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, ReplayableStorage, capitalize(), abortErrorLike(), capitalize(), applyCommand(), replay() (+15 more)

### Community 8 - "ingest-harness.ts"
Cohesion: 0.04
Nodes (122): Manifest, Restored, RestoreInput, BlockHeader, NodeClientOptions, SourceShared, CrashEvent, CrashJob (+114 more)

### Community 81 - "core-ledger-state.ts"
Cohesion: 0.08
Nodes (38): retainedStates, CoreRevision, applyBlock(), boundLedger(), bytesOf(), chainOutcomesOf(), contractsOf(), deployedBelow() (+30 more)

### Community 82 - "LedgerEngine"
Cohesion: 0.12
Nodes (15): LedgerTask, EngineOptions, LedgerEngine, LedgerTaskFailed, hexOf(), idOf(), same(), sameBytes() (+7 more)

### Community 83 - "ledger/types.ts"
Cohesion: 0.08
Nodes (36): ApplyInput, ApplyOutput, LedgerEvent, LedgerTaskBlock, LogItem, ParsedTransaction, StateSummary, TransactionResult (+28 more)

### Community 86 - "worker-host.test.ts"
Cohesion: 0.06
Nodes (33): RetainedState, EvictionRefused, LedgerWorkerFailure, SlowStep, TestLoaderData, computeBlock(), isEvictionRefused(), errorOf() (+25 more)

### Community 87 - "zero-timeouts-checks.ts"
Cohesion: 0.09
Nodes (28): Settings, Job, Outcome, apiRead(), engine(), report(), setUp(), idleBlock() (+20 more)

### Community 9 - "FinalizedLoop"
Cohesion: 0.03
Nodes (65): Callback, EntryBoundary, ParallelPoint, PointRun, PointSchedule, Activity, FinalizedLoop, HeightActivity (+57 more)

### Community 90 - "restore-private.ts"
Cohesion: 0.09
Nodes (31): RestoreSeams, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome, RestoreJob, FileProcess, privateBackup (+23 more)

### Community 91 - "config-hash-checks.ts"
Cohesion: 0.07
Nodes (21): Report, A162Options, a162Run, HeaderSeen, HeldLink, HoldingRelay, ReportRelay, RetargetProxy (+13 more)

### Community 93 - "startup-stop-harness.ts"
Cohesion: 0.07
Nodes (24): ChainCheck, ChainCheckInput, RunOptions, RunSeams, transportReaderFacts, BlockSource, ProcessHandle, ProcessInput (+16 more)

### Community 94 - "ledger-tasks-checks.ts"
Cohesion: 0.10
Nodes (32): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, ProcessBackend, countMainThreadParses(), plainWatchModule() (+24 more)

### Community 95 - "real-tapes.ts"
Cohesion: 0.08
Nodes (30): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+22 more)

### Community 99 - "core.ts"
Cohesion: 0.11
Nodes (27): BaselineLoad, Comparison, CommitOptions, PostgresRun, BenchEnv, ManualOpts, TinybenchOpts, Backend (+19 more)

### Community 174 - ".closed"
Cohesion: 0.15
Nodes (10): connectWebSocket(), "on-compute"(), 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix, The node on `/status`, 7. Storage helpers (+2 more)

### Community 239 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 101 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 117 - "T"
Cohesion: 0.07
Nodes (29): T(), input(), 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible) (+21 more)

### Community 123 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.10
Nodes (23): bindLedgerTasks(), boundHost(), frozen(), hasLedgerTasks(), resultsOf(), withItems(), withLedgerTaskPoints(), withLedgerTasks() (+15 more)

### Community 149 - "UmbraDB module guide"
Cohesion: 0.09
Nodes (23): params(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 13. Providing items to other modules, 14. Private modules, 15. Migrations, 16. Upgrades, 2.1 The declaration (+15 more)

### Community 153 - ".slowBlockMs"
Cohesion: 0.11
Nodes (18): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+10 more)

### Community 154 - "refused"
Cohesion: 0.11
Nodes (20): refused(), 12. When a callback fails, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked (+12 more)

### Community 172 - "core-ledger-state.test.ts"
Cohesion: 0.13
Nodes (11): boundLedgerParser(), bindCoreLedgerState(), itemsOf(), writeBlock(), applied(), bound(), query(), refusing() (+3 more)

### Community 180 - "following"
Cohesion: 0.15
Nodes (16): text(), transportReader(), cursorRead(), following(), 17. Trying a module against another node, Backup and restore, Configuration files, Example: loading `stats-module` (+8 more)

### Community 184 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (13): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+5 more)

### Community 189 - "fault"
Cohesion: 0.14
Nodes (13): fault(), modules(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants (+5 more)

### Community 193 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 206 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 210 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 212 - "v9"
Cohesion: 0.22
Nodes (10): regular(), v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix, 6. Blocks, events and transactions, Requirement: CD-5 `core-block-parsed` parses each block once (+2 more)

### Community 218 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 224 - "encodeRow"
Cohesion: 0.20
Nodes (9): encodeRow(), render(), run(), compareKeys(), expectedChanges(), refusal(), failureReason(), failure() (+1 more)

### Community 234 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 238 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.29
Nodes (7): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 267 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 297 - "firstRegularAtParentTime"
Cohesion: 0.60
Nodes (3): parentTimeOf(), firstRegularAtParentTime(), parentTimestampMs()

### Community 298 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 299 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 310 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 36 - "history"
Cohesion: 0.03
Nodes (70): history(), n(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+62 more)

### Community 45 - ".put"
Cohesion: 0.03
Nodes (59): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+51 more)

### Community 57 - "code"
Cohesion: 0.04
Nodes (55): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+47 more)

### Community 74 - "version"
Cohesion: 0.05
Nodes (44): version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5) (+36 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 98 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 107 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.06
Nodes (30): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict, Benchmarks (+22 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+19 more)

### Community 135 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 144 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 145 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+15 more)

### Community 155 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 164 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 165 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 169 - "README.md"
Cohesion: 0.14
Nodes (11): Choosing a database, Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages (+3 more)

### Community 170 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (18): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+10 more)

### Community 171 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 173 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 190 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 191 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 196 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 202 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 208 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 209 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 211 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 213 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 217 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 219 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 220 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 221 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 222 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 226 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 227 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.22
Nodes (8): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Problem, Suggested fix, Suggested fix

### Community 228 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 229 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Restore on the other backend, Spec delta — `backups` capability

### Community 230 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 231 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 233 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 235 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 236 - "UmbraDB operator guide"
Cohesion: 0.25
Nodes (8): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The transport reader, TLS to PostgreSQL: `ssl`, UmbraDB operator guide

### Community 237 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 240 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 242 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 243 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 244 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 245 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 246 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 247 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 248 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 249 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 254 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 255 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 256 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 257 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 258 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 259 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 260 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 261 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

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

### Community 268 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 269 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 270 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 271 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 272 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 273 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 274 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 275 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 276 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 277 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 278 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 279 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 280 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 281 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 282 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 283 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 284 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.40
Nodes (4): 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 285 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.40
Nodes (4): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Suggested fix

### Community 286 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 287 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 288 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 289 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 290 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 291 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 292 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 293 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 294 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 295 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 296 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 300 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 301 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 302 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 303 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 304 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 305 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 306 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 307 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 308 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 59 - "package.json"
Cohesion: 0.04
Nodes (56): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+48 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 96 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `RFC-3339` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3714 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `column-rules.ts`, `migrate.ts`, `InMemoryBlockSource`, `backup/restore.ts`, `Database`, `admin-harness.ts`, `UmbraError`, `record-and-replay.test.ts`, `ingest-harness.ts`, `FinalizedLoop`, `tape/index.ts`, `config/history.ts`, `refused-configuration.test.ts`, `core-transport.ts`, `runner/process.ts`, `chain-process.test.ts`, `NodeClient`, `ReadHandle`, `process-admin.ts`, `contract-data-checks.ts`, `adapter-fixtures.ts`, `records.ts`, `client.test.ts`, `core-block-parsed.ts`, `adapter.ts`, `change-capture.ts`, `chain-placement.test.ts`, `database-parts.ts`, `pause-fixtures.ts`, `backup-fixtures.ts`, `transform-checks.ts`, `ref_node_crypto`, `private/backends.ts`, `spawnChild`, `loop.test.ts`, `backup/backup.ts`, `mapping.ts`, `entries.ts`, `slow-block-harness.ts`, `validate.test.ts`, `.from`, `interfaces/transaction-history-storage.ts`, `declaration.ts`, `private/lockstep-wait.test.ts`, `LedgerPackage`, `order.property.test.ts`, `declaration`, `validation.ts`, `package.json`, `sweep-tapes.ts`, `paused-harness.ts`, `binding.test.ts`, `process-context.test.ts`, `signal-backup.test.ts`, `networks.ts`, `boundary.test.ts`, `api-server.test.ts`, `BlockRef`, `cold-boot-recovery.integration.test.ts`, `net.test.ts`, `src/index.ts`, `retirement.test.ts`, `file-mode.test.ts`, `ledger/load.ts`, `contract-modules.test.ts`, `transaction-history-storage.property.test.ts`, `core-ledger-state.ts`, `ledger/types.ts`, `worker-host.test.ts`, `zero-timeouts-checks.ts`, `restore-private.ts`, `startup-stop-harness.ts`, `ledger-tasks-checks.ts`, `real-tapes.ts`, `core.ts`, `config-check.ts`, `browser.test.ts`, `config/plain-data.ts`, `release-version.test.ts`, `browser/build.ts`, `redact.ts`, `node-fields-harness.ts`, `src/ledger/identity.ts`, `shims.test.ts`, `version-checks.ts`, `test/postgres/setup.ts`, `code-registry.ts`, `pg-tx-history-adapter.ts`, `ledger/ledger-tasks.test.ts`, `Lockstep`, `documents.ts`, `node-bridge.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `read-gate.ts`, `vendored-ledger-v9.test.ts`, `digest.test.ts`, `threat-model.test.ts`, `cbor.property.test.ts`, `admin/serve.ts`, `block-fetch-decode.test.ts`, `example-checks.ts`, `connection-state.test.ts`, `ledger-sweep.test.ts`, `declarations.ts`, `intake.test.ts`, `lockstep-refusals.test.ts`, `node-format.ts`, `excluded-not-exported.test.ts`, `core-ledger-state.test.ts`, `ws-mutual-tls.test.ts`, `backupSignalRelay`, `surface.test.ts`, `statementsOf`, `web-lock.ts`, `version-selection.test.ts`, `twox.ts`, `worker-threads.test.ts`, `text.test.ts`, `LoopPauses`, `history.property.test.ts`, `lockstep-reads.test.ts`, `transport-intake.test.ts`, `cbor.test.ts`, `node-store-suite.ts`, `firstRegularAtParentTime`?**
  _High betweenness centrality (0.230) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `column-rules.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017542168674698794 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `column-rules.ts`, `migrate.ts`, `InMemoryBlockSource`, `backup/restore.ts`, `Database`, `admin-harness.ts`, `record-and-replay.test.ts`, `ingest-harness.ts`, `cbor.ts`, `FinalizedLoop`, `config/history.ts`, `refused-configuration.test.ts`, `tape/index.ts`, `core-transport.ts`, `runner/process.ts`, `chain-process.test.ts`, `NodeClient`, `ReadHandle`, `process-admin.ts`, `contract-data-checks.ts`, `client.test.ts`, `core-block-parsed.ts`, `change-capture.ts`, `api-server.ts`, `range.ts`, `declarations.ts`, `pause-fixtures.ts`, `backup-fixtures.ts`, `lockstep-refusals.test.ts`, `ref_node_crypto`, `transform-checks.ts`, `private/backends.ts`, `NodeBlockSource`, `version-table.ts`, `backup/backup.ts`, `mapping.ts`, `loop.test.ts`, `core-ledger-state.test.ts`, `slow-block-harness.ts`, `validate.test.ts`, `declaration.ts`, `private/lockstep-wait.test.ts`, `statementsOf`, `configured.ts`, `declaration`, `RuntimeMetadata`, `validation.ts`, `web-lock.ts`, `paused-harness.ts`, `binding.test.ts`, `process-context.test.ts`, `graph.ts`, `api-server.test.ts`, `BlockRef`, `src/index.ts`, `core-ledger-state.ts`, `ledger/types.ts`, `zero-timeouts-checks.ts`, `restore-private.ts`, `config-check.ts`, `validate.ts`, `config/plain-data.ts`, `src/ledger/identity.ts`, `shims.test.ts`, `version-checks.ts`, `PrivateTransport`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024621906974848153 - nodes in this community are weakly interconnected._