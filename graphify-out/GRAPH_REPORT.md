# Graph Report - UmbraDB

## Corpus Check
- 1044 files · ~1,521,765 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 11114 nodes · 32971 edges · 349 communities (316 shown, 33 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2614 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `56b0ed73e3ccc49a` (1044 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- InMemoryBlockSource
- db/errors.ts
- fetch-fixtures.ts
- Process
- determinism-checks.ts
- page.ts
- browser.test.ts
- src/ledger/identity.ts
- cli/command.ts
- release-version.test.ts
- browser/build.ts
- core-block-commit.test.ts
- postgres/transaction-history-storage.ts
- PointName
- pg-tx-history-adapter.ts
- code-registry.ts
- backup/restore.ts
- accepted-hash-checks.ts
- config/plain-data.ts
- net.test.ts
- ws-mutual-tls.test.ts
- redact.ts
- restore-private.ts
- history-startup.ts
- check-required-tests.ts
- core-config.test.ts
- legacy-excluded.test.ts
- TransactionHistoryEntry
- failures.ts
- node-bridge.ts
- read-gate.ts
- digest.test.ts
- run.test.ts
- ModuleDeclaration
- child-processes.test.ts
- Design — Sprint 1: project setup + TemporalKV
- TapeNode
- type-check.ts
- block-fetch-decode.test.ts
- NodeClient
- fixtures/configuration.ts
- .closed
- containers.test.ts
- intake.test.ts
- version-table.ts
- chrome.ts
- key-handling-checks.ts
- module-api.test.ts
- lockstep-refusals.test.ts
- documents.test.ts
- JsonValue
- binding.test.ts
- browser-harness.ts
- client.test.ts
- devnet-upgrade.test.ts
- PortSocket
- Lockstep
- public-items.test.ts
- BlockRef
- src/config/load.ts
- RuntimeMetadata
- checkShape
- Buffer
- HeldHeight
- read-height.property.test.ts
- ws.ts
- order.property.test.ts
- history.property.test.ts
- chain-events-source.test.ts
- lockstep.ts
- adapter-fixtures.ts
- core-chain-events.ts
- lockstep-reads.test.ts
- private/lockstep-wait.test.ts
- worker-threads-worker.ts
- buffer.ts
- Worker
- FinalizedLoop
- .send
- Heartbeat
- tape/index.ts
- sha256
- .#close
- node-format.ts
- stats.ts
- tls.test.ts
- loop.test.ts
- worker-threads.test.ts
- backup-fixtures.ts
- runner/process.ts
- mutation-evidence.d.mts
- child-processes.parent.ts
- AsyncLocalStorage
- cbor.ts
- adapter.ts
- pageBench
- worker-threads-host.ts
- range.ts
- admin-harness.ts
- LedgerPackage
- builder.test.ts
- items.ts
- CliBackend
- UmbraError
- https.ts
- NodeFS
- roles.ts
- SlowToReportPorts
- writer-lock-checks.ts
- module-tables.ts
- contract-modules.test.ts
- ingest
- ingest-harness.ts
- connectWebSocket
- column-rules.ts
- process-context.test.ts
- contract-data-checks.ts
- transform-checks.ts
- vitest
- PgTransactionHistoryStorage
- declaration.ts
- changes.property.test.ts
- core-block-commit.ts
- core-transport.ts
- api-server.test.ts
- ledger-storage.test.ts
- loop.ts
- slow-block-harness.ts
- startup-stop-harness.ts
- chain-data.test.ts
- builds.ts
- pause-fixtures.ts
- history.test.ts
- host.ts
- mapping.ts
- config/history.ts
- ledger-sweep.test.ts
- version
- chain-events-decode.test.ts
- config-check.ts
- boundary.test.ts
- interfaces/transaction-history-storage.ts
- version-checks.ts
- ledger-tasks-checks.ts
- core-private-source.test.ts
- cold-boot-recovery.integration.test.ts
- graph.ts
- retirement.test.ts
- height-versioned.test.ts
- core-settings.ts
- zero-timeouts-checks.ts
- real-tapes.ts
- file-mode.test.ts
- migrate.ts
- validate.test.ts
- process-worker.ts
- config-hash-checks.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- test/postgres/setup.ts
- T
- private/backends.ts
- core-ledger-state.ts
- networks.ts
- migrate.test.ts
- validate.ts
- entries.ts
- .concat
- .position
- Problem
- .from
- ADDED Requirements
- .slowBlockMs
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- .boolean
- mutation-per-adapter.mjs
- UmbraDB third-party component inventory (SBOM)
- refused
- pack-install.mjs
- path.ts
- Performance — design
- signal-backup.worker.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- system
- startContainer
- orphan-watcher.mjs
- crash-worker.ts
- history
- .put
- code
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- graph.py
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- Scalability ceilings (v1.0.0)
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- UmbraDB
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- UmbraDB module guide
- Roadmap
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- Requirement: BK-1 Backup
- ADDED Requirements
- REMOVED Requirements
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — Sprint 4: Watermarks
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- Design — v1.1.0: Quint model checking
- explore.md
- Backups
- UmbraDB software supply-chain directory
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
- Tasks — v1.0.0-infosec-signoff
- Contributing
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Storage Algebra Lean M3a Watermarks Sprint
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-infosec-signoff
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- Vendored ledger builds
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
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
- bug-report.md
- feature-request.md
- GC architecture and query-tracing: research findings
- manifest.json
- 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor
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
- bin
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
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 341 edges
2. `UmbraError` - 305 edges
3. `ModuleDeclaration` - 174 edges
4. `FinalizedLoop` - 131 edges
5. `InMemoryBlockSource` - 113 edges
6. `NodeClient` - 113 edges
7. `Database` - 97 edges
8. `BlockRef` - 94 edges
9. `ReadHandle` - 85 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (349 total, 33 thin omitted)

### Community 0 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (178): InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job, WorkerEvent, ChainBuildOptions (+170 more)

### Community 1 - "db/errors.ts"
Cohesion: 0.02
Nodes (138): BenchEnv, PostgresOptions, CommittedHeight, Database, ReadOnlyDatabase, ReadOptions, DurabilityProbeOptions, DurabilityViolation (+130 more)

### Community 10 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (107): ProcessCondition, Scenario, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded (+99 more)

### Community 100 - "Process"
Cohesion: 0.13
Nodes (7): PauseHold, Process, isBlockEventSource(), messageOf(), namedStartDb(), nodeClientClosed(), nodeSignals()

### Community 101 - "determinism-checks.ts"
Cohesion: 0.13
Nodes (31): PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, a113Run(), against(), withCore() (+23 more)

### Community 103 - "page.ts"
Cohesion: 0.07
Nodes (29): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog(), backUp() (+21 more)

### Community 105 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 106 - "src/ledger/identity.ts"
Cohesion: 0.11
Nodes (29): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), text(), checkLedgerPackage() (+21 more)

### Community 107 - "cli/command.ts"
Cohesion: 0.11
Nodes (27): CommandHandler, CommandIo, MainProcess, RestoreCommandSeams, CommandResult, backupArguments(), backupCommand(), checkArguments() (+19 more)

### Community 108 - "release-version.test.ts"
Cohesion: 0.11
Nodes (33): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+25 more)

### Community 109 - "browser/build.ts"
Cohesion: 0.08
Nodes (25): BrowserBuildOptions, BrowserControl, CheckedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+17 more)

### Community 11 - "core-block-commit.test.ts"
Cohesion: 0.03
Nodes (93): BlockWriteHandle, SchemaWriteHandle, OwnPart, SchemaPlan, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable (+85 more)

### Community 113 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (21): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+13 more)

### Community 114 - "PointName"
Cohesion: 0.08
Nodes (18): ItemSink, PointName, LateUse, HeightFailure, Misuse, SlowBlockCondition, Accepts, Rest (+10 more)

### Community 116 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 118 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 12 - "backup/restore.ts"
Cohesion: 0.04
Nodes (98): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+90 more)

### Community 120 - "accepted-hash-checks.ts"
Cohesion: 0.12
Nodes (25): startHashDecision, A165Options, a165Run, Attempt, privateCursorHeight(), a165Problems(), contentsOf(), cursorOf() (+17 more)

### Community 121 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 122 - "net.test.ts"
Cohesion: 0.12
Nodes (15): NetworkBroker, IncomingMessage, Server, NetworkMessage, WebSocket, createServer(), connect(), listen() (+7 more)

### Community 123 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (21): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+13 more)

### Community 125 - "redact.ts"
Cohesion: 0.12
Nodes (20): RedactionForms, SecretForm, TextPattern, Needs, findings(), credentialsIn(), decoded(), kindOf() (+12 more)

### Community 126 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+14 more)

### Community 128 - "history-startup.ts"
Cohesion: 0.10
Nodes (22): HistoryRule, AppliedMigration, Holder, Started, StartupOptions, graphInputOf(), load(), noHeight() (+14 more)

### Community 129 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 13 - "core-config.test.ts"
Cohesion: 0.04
Nodes (81): adminRoutes, AdminServeOptions, AdminStartOptions, AdminAnswer, AdminEndpoint, AdminPart, AdminSnapshot, AdminView (+73 more)

### Community 130 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 131 - "TransactionHistoryEntry"
Cohesion: 0.14
Nodes (8): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 133 - "failures.ts"
Cohesion: 0.13
Nodes (18): ConfigFinding, ReasonCode, Unwrapped, findingText(), refusalFindings(), configurationFindings(), configurationRefusalLines(), isConfigurationRefusal() (+10 more)

### Community 134 - "node-bridge.ts"
Cohesion: 0.12
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 135 - "read-gate.ts"
Cohesion: 0.15
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 138 - "digest.test.ts"
Cohesion: 0.13
Nodes (21): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+13 more)

### Community 139 - "run.test.ts"
Cohesion: 0.13
Nodes (16): RunningCommand, statsConfig, write(), adminPortIn(), exitWithin(), runCoreSettings(), runInChild(), statsModule() (+8 more)

### Community 14 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (98): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+90 more)

### Community 140 - "child-processes.test.ts"
Cohesion: 0.10
Nodes (20): Kill, Orphaned, SourceFile, alive(), bystander(), childrenOf(), commandOf(), expectAllEnd() (+12 more)

### Community 145 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.09
Nodes (22): Key, Sql, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap (+14 more)

### Community 146 - "TapeNode"
Cohesion: 0.14
Nodes (5): Outage, TapeClock, TapeNode, hasField(), SYSTEM_CLOCK

### Community 147 - "type-check.ts"
Cohesion: 0.15
Nodes (14): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), moduleSpecifier() (+6 more)

### Community 148 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 15 - "NodeClient"
Cohesion: 0.05
Nodes (66): NodeSourceOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+58 more)

### Community 151 - "fixtures/configuration.ts"
Cohesion: 0.14
Nodes (16): BrowserConfiguration, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration(), param(), privateConfiguration() (+8 more)

### Community 152 - ".closed"
Cohesion: 0.12
Nodes (14): NodeSocketEvents, HandSocket, connectWebSocket(), "on-compute"(), scriptedSockets(), DEFAULT_HEARTBEAT_MS, 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence (+6 more)

### Community 154 - "containers.test.ts"
Cohesion: 0.12
Nodes (13): Started, FailsOnceStarted, SourceFile, parentWithContainer(), LABEL_ATTEMPT, LABEL_PID, LABEL_REPOSITORY, REPOSITORY (+5 more)

### Community 155 - "intake.test.ts"
Cohesion: 0.16
Nodes (12): PrivateSeen, A114Observation, A116Observation, TestLink, a114Problems(), a116Problems(), follow(), heights() (+4 more)

### Community 156 - "version-table.ts"
Cohesion: 0.18
Nodes (20): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+12 more)

### Community 157 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 158 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 16 - "module-api.test.ts"
Cohesion: 0.03
Nodes (75): ModuleApiServer, ModuleApiStart, StartedModuleApi, ApiRegistry, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions (+67 more)

### Community 163 - "lockstep-refusals.test.ts"
Cohesion: 0.23
Nodes (17): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+9 more)

### Community 164 - "documents.test.ts"
Cohesion: 0.19
Nodes (16): MarkdownLink, TextFile, changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems(), markdownLinks(), notAPath() (+8 more)

### Community 165 - "JsonValue"
Cohesion: 0.12
Nodes (17): JsonValue, 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file) (+9 more)

### Community 167 - "binding.test.ts"
Cohesion: 0.17
Nodes (15): A113Observation, A156Observation, Binding, Created, Outcome, a113Problems(), a156Problems(), a156Run() (+7 more)

### Community 169 - "browser-harness.ts"
Cohesion: 0.27
Nodes (16): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+8 more)

### Community 17 - "client.test.ts"
Cohesion: 0.03
Nodes (50): NodeRetry, HandSockets, Answer, FakeNode, Handler, Received, recorded, ManualTimers (+42 more)

### Community 170 - "devnet-upgrade.test.ts"
Cohesion: 0.19
Nodes (11): Side, TapeAnswers, FoundTape, found(), nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf() (+3 more)

### Community 171 - "PortSocket"
Cohesion: 0.20
Nodes (6): PortSocket, pair(), 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 176 - "Lockstep"
Cohesion: 0.18
Nodes (4): CoreTransportOptions, Lockstep, downText(), holds()

### Community 179 - "public-items.test.ts"
Cohesion: 0.14
Nodes (10): TestDatabase, A155Observation, Outcome, a155Problems(), jsonSafe(), outcomeOf(), umbraIn(), HEADER (+2 more)

### Community 18 - "BlockRef"
Cohesion: 0.04
Nodes (34): BlockEventSource, BlockLedgerSource, HeadWait, NodeBlockSource, Prefetch, QueuedBlock, LedgerBinding, NodeSubscription (+26 more)

### Community 180 - "src/config/load.ts"
Cohesion: 0.17
Nodes (11): LoadOptions, invalid(), isFile(), loadConfig(), modulesOf(), DEFAULT_CONFIG_FILE, MODULES_EXPORT, TYPESCRIPT_SYNTAX (+3 more)

### Community 181 - "RuntimeMetadata"
Cohesion: 0.17
Nodes (5): MetadataNode, RuntimeMetadata, OwnStateMetadata, hexOf(), walkOver()

### Community 182 - "checkShape"
Cohesion: 0.34
Nodes (8): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 183 - "Buffer"
Cohesion: 0.16
Nodes (8): Buffer, Hash, createHash(), 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 184 - "HeldHeight"
Cohesion: 0.16
Nodes (10): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence (+2 more)

### Community 187 - "read-height.property.test.ts"
Cohesion: 0.20
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+2 more)

### Community 188 - "ws.ts"
Cohesion: 0.18
Nodes (6): Emitter, Frame, Listener, PortUpgrade, RawData, WebSocketServer

### Community 19 - "order.property.test.ts"
Cohesion: 0.04
Nodes (93): GraphInput, PointRun, PastFaultCase, RefusalCase, CallEvent, Recorder, CheckName, GraphSpec (+85 more)

### Community 193 - "history.property.test.ts"
Cohesion: 0.20
Nodes (11): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+3 more)

### Community 195 - "chain-events-source.test.ts"
Cohesion: 0.19
Nodes (7): NodeCallOptions, RecordingClient, open(), quiet(), chain, closing, SYSTEM_EVENTS_STORAGE

### Community 199 - "lockstep.ts"
Cohesion: 0.23
Nodes (8): InstanceView, PrivateInstance, Entry, LockstepInstance, LockstepOptions, LockstepRefusal, byId(), privateInstancesOf()

### Community 2 - "adapter-fixtures.ts"
Cohesion: 0.03
Nodes (148): ApplyInput, ApplyOutput, ChainOutcome, StateSummary, StoredNode, CallTx, LedgerHeight, LedgerTx (+140 more)

### Community 20 - "core-chain-events.ts"
Cohesion: 0.05
Nodes (74): BodyExtrinsic, ExtrinsicCall, BlockBody, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType (+66 more)

### Community 200 - "lockstep-reads.test.ts"
Cohesion: 0.22
Nodes (9): Pause, Q142Observation, SkipsLockstep, PRIVATE_ROWS_SQL(), pauseGate(), pausing(), q142Run(), until() (+1 more)

### Community 201 - "private/lockstep-wait.test.ts"
Cohesion: 0.31
Nodes (12): ExpectedWait, a117Problems(), firstWait(), lockstepCore(), loginOf(), rowsIn(), sampleWait(), shown() (+4 more)

### Community 203 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 204 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 21 - "FinalizedLoop"
Cohesion: 0.04
Nodes (27): Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, Startup, SkipsAfterReconnect, SkipsUnseen (+19 more)

### Community 218 - "Heartbeat"
Cohesion: 0.31
Nodes (5): Heartbeat, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 22 - "tape/index.ts"
Cohesion: 0.05
Nodes (69): Recorded, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId, Json (+61 more)

### Community 220 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 23 - "node-format.ts"
Cohesion: 0.05
Nodes (64): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+56 more)

### Community 230 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 237 - "tls.test.ts"
Cohesion: 0.28
Nodes (4): Pem, TestCertificates, mutualTlsOptions(), makeCertificates()

### Community 24 - "loop.test.ts"
Cohesion: 0.05
Nodes (74): LockstepWait, Contexts, Faults, LostCommit, Seen, AtGate, LoopClass, RunnerDatabase (+66 more)

### Community 25 - "backup-fixtures.ts"
Cohesion: 0.06
Nodes (62): BackupBackend, BackupDatabase, killedRestore, TickerConfig, WORKER, SignalEvent, SignalJob, cliProject (+54 more)

### Community 26 - "runner/process.ts"
Cohesion: 0.03
Nodes (48): BlockItemSource, Bound, ChainCheck, ChainCheckInput, ChainIdentity, ChainSource, ConfiguredGenesis, CoreChainBinding (+40 more)

### Community 260 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 261 - "child-processes.parent.ts"
Cohesion: 0.29
Nodes (6): ParentJob, child, CHILDREN, exited, job, lines

### Community 27 - "cbor.ts"
Cohesion: 0.05
Nodes (80): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+72 more)

### Community 28 - "adapter.ts"
Cohesion: 0.04
Nodes (64): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+56 more)

### Community 283 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 284 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 29 - "range.ts"
Cohesion: 0.04
Nodes (73): Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments (+65 more)

### Community 3 - "admin-harness.ts"
Cohesion: 0.03
Nodes (152): AdminChannel, FromAdmin, ToAdmin, AdminServer, redactor, ProcessConfig, AdminRun, Answered (+144 more)

### Community 30 - "LedgerPackage"
Cohesion: 0.06
Nodes (39): LedgerName, LedgerPackage, LedgerTaskBlock, StateHandle, Held, LedgerEngine, LedgerTaskFailed, stagenetReplay (+31 more)

### Community 31 - "builder.test.ts"
Cohesion: 0.04
Nodes (40): ConnectionFrames, Failure, Variant, WrongRecording, Metadata, Step, Frame, RawClient (+32 more)

### Community 318 - "items.ts"
Cohesion: 0.67
Nodes (3): BlockHeaderItem, CoreBlockHeader, CoreBlockItems

### Community 32 - "UmbraError"
Cohesion: 0.04
Nodes (34): LoadedConfig, LoadOptions, PgliteLockUse, JobQueue, PgliteDatabase, BoundedRead, ReadPool, Session (+26 more)

### Community 33 - "roles.ts"
Cohesion: 0.04
Nodes (59): MigrationPart, Difference, PlannedSchema, Provision, QualifiedTable, SchemaMigration, SchemaModule, SchemaTable (+51 more)

### Community 34 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (60): Held, PgliteLockUse, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, acquirePgliteLock() (+52 more)

### Community 35 - "module-tables.ts"
Cohesion: 0.05
Nodes (56): CaptureColumn, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, ColumnType (+48 more)

### Community 36 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (62): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+54 more)

### Community 37 - "ingest"
Cohesion: 0.06
Nodes (64): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, ingest, SweepModel, TableSnapshot, FixtureNode (+56 more)

### Community 38 - "ingest-harness.ts"
Cohesion: 0.06
Nodes (65): plainData, BlockHeader, NodeClientOptions, SourceShared, CrashEvent, CrashJob, IngestOptions, SourceClass (+57 more)

### Community 39 - "connectWebSocket"
Cohesion: 0.05
Nodes (38): ConnectSocket, Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault (+30 more)

### Community 4 - "column-rules.ts"
Cohesion: 0.02
Nodes (131): CaptureState, CheckedMigration, CatalogColumn, CatalogOptions, CatalogTable, ConsistentRead, AllowedRule, Because (+123 more)

### Community 40 - "process-context.test.ts"
Cohesion: 0.05
Nodes (41): Revision, EntryRange, ResolvedGraph, StartedModuleApi, MisuseListener, MisuseReports, ProcessContexts, ProcessContextsInput (+33 more)

### Community 41 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (66): ContractStateRow, CoreContractStatesOptions, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+58 more)

### Community 42 - "transform-checks.ts"
Cohesion: 0.08
Nodes (48): Failure, Variant, TransformError, CallRecord, NotifyRecord, recordKind, SubscriptionId, CallSelection (+40 more)

### Community 43 - "vitest"
Cohesion: 0.04
Nodes (44): Finding, RepositoryFile, LockResult, Upstream, ReportedTest, processProblems(), canPin(), pinViolations() (+36 more)

### Community 46 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (57): TransactionHistoryStorage, PgTransactionHistoryStorage, Added, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation) (+49 more)

### Community 47 - "declaration.ts"
Cohesion: 0.04
Nodes (54): DefinedModule, KnownPointsOnly, TableDeclaration, DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase (+46 more)

### Community 48 - "changes.property.test.ts"
Cohesion: 0.05
Nodes (57): Chain, ChainOptions, DigestRow, Op, States, TableName, captureFunction(), hex() (+49 more)

### Community 49 - "core-block-commit.ts"
Cohesion: 0.06
Nodes (54): RestoreChain, RestoreSeams, BackupCommandOptions, BackupOutcome, commandTarget, ReadDatabaseOptions, Chain, RestoreCommandOptions (+46 more)

### Community 5 - "core-transport.ts"
Cohesion: 0.03
Nodes (112): PublicSide, ResultColumn, Session, TransportLimits, TransportTls, Committed, Hello, HelloAck (+104 more)

### Community 50 - "api-server.test.ts"
Cohesion: 0.06
Nodes (49): ChainDataAnswer, ChainDataView, HttpHandler, HttpRoute, AcceptsDuplicates, AddsExtensions, AddsHeaders, AppendsVersion (+41 more)

### Community 51 - "ledger-storage.test.ts"
Cohesion: 0.07
Nodes (51): ChildReader, LedgerEvent, TransactionResult, VmLog, ledgerItemsSeen, SeenLoad, RestartEvent, RestartJob (+43 more)

### Community 52 - "loop.ts"
Cohesion: 0.07
Nodes (46): ProcessContext, HeightRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments, PointSchedule (+38 more)

### Community 53 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (50): LoopInput, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+42 more)

### Community 54 - "startup-stop-harness.ts"
Cohesion: 0.06
Nodes (40): ProcessHandle, SignalTarget, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StopBy (+32 more)

### Community 56 - "chain-data.test.ts"
Cohesion: 0.07
Nodes (50): BlockParsed, ChainEvent, itemsSeen, BlockSpec, EventSpec, Json, transactionSpec, Phase (+42 more)

### Community 57 - "builds.ts"
Cohesion: 0.06
Nodes (42): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, PrivateProcess, PrivateRefusal (+34 more)

### Community 58 - "pause-fixtures.ts"
Cohesion: 0.06
Nodes (39): BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable, PausableConfig, PausableOptions, RecorderGlobals (+31 more)

### Community 59 - "history.test.ts"
Cohesion: 0.07
Nodes (48): versionEntry, Simulation, Start, Case, canonicalJson(), dataHash(), rowOf(), versionText() (+40 more)

### Community 6 - "host.ts"
Cohesion: 0.03
Nodes (99): Path, LedgerTask, AppliedState, ApplyBlock, BlockId, EngineHolding, EngineOptions, EvictionRefused (+91 more)

### Community 60 - "mapping.ts"
Cohesion: 0.07
Nodes (38): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+30 more)

### Community 61 - "config/history.ts"
Cohesion: 0.08
Nodes (43): CoreVersion, CoreSettings, HistoryCode, HistoryContext, ProvidesRow, Span, SettingsSchema, UpgradeEntry (+35 more)

### Community 62 - "ledger-sweep.test.ts"
Cohesion: 0.08
Nodes (29): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, NodeBatch, Block, MemoryTables (+21 more)

### Community 63 - "version"
Cohesion: 0.04
Nodes (47): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+39 more)

### Community 64 - "chain-events-decode.test.ts"
Cohesion: 0.10
Nodes (38): eventsRuntime, Field, PalletMetadata, Registry, RuntimeShape, StorageSpec, LedgerScenarioOptions, fill() (+30 more)

### Community 65 - "config-check.ts"
Cohesion: 0.07
Nodes (38): CheckFinding, CheckStep, ConfigCheckReport, StepName, StepReport, StepStatus, DatabaseState, configCheck() (+30 more)

### Community 66 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+34 more)

### Community 67 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (37): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+29 more)

### Community 68 - "version-checks.ts"
Cohesion: 0.10
Nodes (37): MetadataBlock, RuntimeMetadataEntry, OwnStateMetadata, Boundary, CallRecord, CountingNode, MetadataSelector, Select (+29 more)

### Community 69 - "ledger-tasks-checks.ts"
Cohesion: 0.08
Nodes (37): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses(), expectedCallArgs(), plainWatchModule() (+29 more)

### Community 7 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (70): PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes, PublicConfiguration (+62 more)

### Community 70 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (31): MergeEntriesFn, PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath() (+23 more)

### Community 71 - "graph.ts"
Cohesion: 0.08
Nodes (45): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts, ResolvedRange (+37 more)

### Community 72 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 73 - "height-versioned.test.ts"
Cohesion: 0.09
Nodes (31): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+23 more)

### Community 74 - "core-settings.ts"
Cohesion: 0.06
Nodes (40): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+32 more)

### Community 75 - "zero-timeouts-checks.ts"
Cohesion: 0.09
Nodes (34): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+26 more)

### Community 76 - "real-tapes.ts"
Cohesion: 0.08
Nodes (35): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+27 more)

### Community 77 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (30): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+22 more)

### Community 8 - "migrate.ts"
Cohesion: 0.04
Nodes (96): Transaction, CapturedTable, AppliedRow, Runnable, Settling, StartupInput, MultiStatementRunner, BlockWrites (+88 more)

### Community 81 - "validate.test.ts"
Cohesion: 0.07
Nodes (35): ConfigRule, EntryRef, CursorRow, Expected, defineModule(), declarations(), input(), refusal() (+27 more)

### Community 82 - "process-worker.ts"
Cohesion: 0.09
Nodes (28): BrowserRun, PrivateInstance, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, Scope, crossedError, FromProcessWorker (+20 more)

### Community 84 - "config-hash-checks.ts"
Cohesion: 0.07
Nodes (21): Report, A162Options, a162Run, HeaderSeen, HeldLink, HoldingRelay, ReportRelay, RetargetProxy (+13 more)

### Community 85 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.05
Nodes (40): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+32 more)

### Community 86 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 87 - "T"
Cohesion: 0.06
Nodes (37): Absent, n(), T(), input(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced) (+29 more)

### Community 89 - "private/backends.ts"
Cohesion: 0.11
Nodes (18): PrivateBackend, SessionSeen, A112Observation, Wiring, TransportProxy, pgliteBackend(), schemaPlan(), CASES (+10 more)

### Community 9 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (110): BlockParsedOptions, BlockTransaction, LoadLedger, TransactionParser, LedgerStateItem, RetainedState, retainedStates, CoreRevision (+102 more)

### Community 90 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 92 - "migrate.test.ts"
Cohesion: 0.06
Nodes (31): SchemaItem, MigrationRow, PartOptions, TestPart, identityRow(), captured(), undigested(), providesRows() (+23 more)

### Community 95 - "validate.ts"
Cohesion: 0.11
Nodes (37): HistoryFinding, CursorRule, Finding, Issue, Plain, coreSettingsSchema(), pathOf(), closest() (+29 more)

### Community 97 - "entries.ts"
Cohesion: 0.07
Nodes (32): CoreLedgerVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+24 more)

### Community 98 - ".concat"
Cohesion: 0.07
Nodes (24): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+16 more)

### Community 242 - ".position"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 266 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 112 - ".from"
Cohesion: 0.08
Nodes (26): hexOf(), hex(), hex(), hex(), hex(), bytesOf(), bytesOf(), hexOf() (+18 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage, ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section (+19 more)

### Community 159 - ".slowBlockMs"
Cohesion: 0.13
Nodes (17): 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix, 00043 — slow-block-outside.negative-control.test.ts's 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 160 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (16): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+8 more)

### Community 161 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 186 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 213 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 215 - "refused"
Cohesion: 0.22
Nodes (10): refused(), When a callback fails, Requirement: AE-3 States and conditions, Scenario: A fault of the build's declarations ends the process, Scenario: A paused loop, Scenario: A refused configuration ends the process, Scenario: A refused start stays up, Requirement: PP-4 The process transport (+2 more)

### Community 219 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 238 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 245 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 246 - "signal-backup.worker.ts"
Cohesion: 0.32
Nodes (7): report(), handle, job, orphanGuard, source, termination, watch

### Community 250 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 251 - "system"
Cohesion: 0.33
Nodes (7): fakePackage(), regular(), system(), Chain events, transactions and their outcomes, Requirement: CD-5 `core-block-parsed` parses each block once, Scenario: A system transaction between regular ones, Scenario: A transaction no event accounts for

### Community 252 - "startContainer"
Cohesion: 0.43
Nodes (7): guardContainers(), guardPid(), watcherInput(), removeAttempt(), startContainer(), startContainers(), 0. Pins and verification

### Community 280 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 320 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 44 - "history"
Cohesion: 0.04
Nodes (64): integer(), history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+56 more)

### Community 45 - ".put"
Cohesion: 0.03
Nodes (62): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+54 more)

### Community 55 - "code"
Cohesion: 0.04
Nodes (54): up(), code(), name, 8. Migration, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.4 — Public surface, contracts, and DX (G1–G4, G20) (+46 more)

### Community 93 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (34): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change) (+26 more)

### Community 96 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 102 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.06
Nodes (30): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+22 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 110 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.06
Nodes (29): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased] (+21 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 115 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (30): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+22 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+23 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 137 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 143 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 144 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 149 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.09
Nodes (17): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+9 more)

### Community 150 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 162 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 166 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 168 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 172 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 173 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 174 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 175 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 177 - "UmbraDB module guide"
Cohesion: 0.12
Nodes (15): Blocks from the node, Contract states and contract logs, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Private modules, Reading through `db`, Running a module with the `umbradb` command (+7 more)

### Community 178 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 189 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.14
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 190 - "Requirement: BK-1 Backup"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 191 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 192 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 196 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 197 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 198 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 202 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 206 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 207 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 208 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 209 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.17
Nodes (11): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live` (+3 more)

### Community 211 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 212 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 214 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 216 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 217 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.18
Nodes (10): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds, 8. CI (+2 more)

### Community 221 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 222 - "Backups"
Cohesion: 0.20
Nodes (9): A backup at the core's stop, A backup of a running process (SIGUSR2), A private process and a changed public configuration, Backups, Restoring a backup, The database, UmbraDB operator guide, What a backup holds (+1 more)

### Community 223 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 224 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 225 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 226 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 227 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 228 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 231 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 232 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 233 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 234 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 235 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 236 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 239 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 240 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.25
Nodes (7): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Suggested fix, Suggested fix

### Community 241 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 243 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 244 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 248 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 249 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 253 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 254 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 255 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 256 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 257 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 258 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 259 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 263 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 264 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 265 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 267 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 268 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 269 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 270 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 271 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 272 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 273 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 274 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 275 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 276 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 277 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 278 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 279 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 281 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 282 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 285 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 286 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 287 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 288 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 289 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 290 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 291 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 292 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 293 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 294 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 295 - "00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask"
Cohesion: 0.40
Nodes (4): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix

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

### Community 306 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 307 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 308 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 309 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 310 - "00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor"
Cohesion: 0.50
Nodes (3): 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor, Evidence, Suggested fix

### Community 311 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 312 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 313 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 314 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 315 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 316 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 317 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 325 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 326 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 78 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 91 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3813 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `InMemoryBlockSource`, `db/errors.ts`, `adapter-fixtures.ts`, `admin-harness.ts`, `column-rules.ts`, `core-transport.ts`, `host.ts`, `core-private-source.test.ts`, `migrate.ts`, `core-ledger-state.ts`, `fetch-fixtures.ts`, `core-block-commit.test.ts`, `backup/restore.ts`, `core-config.test.ts`, `ModuleDeclaration`, `NodeClient`, `module-api.test.ts`, `client.test.ts`, `order.property.test.ts`, `tape/index.ts`, `node-format.ts`, `loop.test.ts`, `backup-fixtures.ts`, `runner/process.ts`, `cbor.ts`, `adapter.ts`, `builder.test.ts`, `UmbraError`, `roles.ts`, `writer-lock-checks.ts`, `module-tables.ts`, `contract-modules.test.ts`, `ingest`, `ingest-harness.ts`, `connectWebSocket`, `process-context.test.ts`, `contract-data-checks.ts`, `transform-checks.ts`, `declaration.ts`, `changes.property.test.ts`, `api-server.test.ts`, `ledger-storage.test.ts`, `slow-block-harness.ts`, `startup-stop-harness.ts`, `chain-data.test.ts`, `builds.ts`, `pause-fixtures.ts`, `history.test.ts`, `mapping.ts`, `ledger-sweep.test.ts`, `chain-events-decode.test.ts`, `config-check.ts`, `boundary.test.ts`, `interfaces/transaction-history-storage.ts`, `version-checks.ts`, `ledger-tasks-checks.ts`, `cold-boot-recovery.integration.test.ts`, `retirement.test.ts`, `height-versioned.test.ts`, `core-settings.ts`, `zero-timeouts-checks.ts`, `real-tapes.ts`, `file-mode.test.ts`, `validate.test.ts`, `process-worker.ts`, `test/postgres/setup.ts`, `private/backends.ts`, `networks.ts`, `migrate.test.ts`, `entries.ts`, `determinism-checks.ts`, `browser.test.ts`, `src/ledger/identity.ts`, `cli/command.ts`, `release-version.test.ts`, `browser/build.ts`, `.from`, `postgres/transaction-history-storage.ts`, `PointName`, `pg-tx-history-adapter.ts`, `code-registry.ts`, `accepted-hash-checks.ts`, `config/plain-data.ts`, `net.test.ts`, `ws-mutual-tls.test.ts`, `redact.ts`, `restore-private.ts`, `history-startup.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `failures.ts`, `node-bridge.ts`, `read-gate.ts`, `package.json`, `digest.test.ts`, `run.test.ts`, `child-processes.test.ts`, `type-check.ts`, `block-fetch-decode.test.ts`, `containers.test.ts`, `intake.test.ts`, `key-handling-checks.ts`, `lockstep-refusals.test.ts`, `documents.test.ts`, `binding.test.ts`, `devnet-upgrade.test.ts`, `public-items.test.ts`, `src/config/load.ts`, `mutation-per-adapter.mjs`, `read-height.property.test.ts`, `history.property.test.ts`, `excluded-not-exported.test.ts`, `chain-events-source.test.ts`, `lockstep.ts`, `lockstep-reads.test.ts`, `private/lockstep-wait.test.ts`, `Heartbeat`, `tls.test.ts`, `worker-threads.test.ts`?**
  _High betweenness centrality (0.239) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InMemoryBlockSource` be split into smaller, more focused modules?**
  _Cohesion score 0.022736105713175282 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `InMemoryBlockSource`, `db/errors.ts`, `history-startup.ts`, `admin-harness.ts`, `column-rules.ts`, `core-transport.ts`, `failures.ts`, `core-private-source.test.ts`, `migrate.ts`, `core-ledger-state.ts`, `fetch-fixtures.ts`, `core-block-commit.test.ts`, `backup/restore.ts`, `core-config.test.ts`, `ModuleDeclaration`, `NodeClient`, `module-api.test.ts`, `client.test.ts`, `BlockRef`, `order.property.test.ts`, `FinalizedLoop`, `tape/index.ts`, `loop.test.ts`, `backup-fixtures.ts`, `runner/process.ts`, `cbor.ts`, `version-table.ts`, `range.ts`, `builder.test.ts`, `host.ts`, `roles.ts`, `writer-lock-checks.ts`, `module-tables.ts`, `contract-modules.test.ts`, `lockstep-refusals.test.ts`, `ingest-harness.ts`, `binding.test.ts`, `process-context.test.ts`, `transform-checks.ts`, `declaration.ts`, `changes.property.test.ts`, `core-block-commit.ts`, `api-server.test.ts`, `public-items.test.ts`, `src/config/load.ts`, `RuntimeMetadata`, `checkShape`, `loop.ts`, `slow-block-harness.ts`, `UmbraDB module guide`, `pause-fixtures.ts`, `history.test.ts`, `mapping.ts`, `config/history.ts`, `config-check.ts`, `version-checks.ts`, `ledger-tasks-checks.ts`, `graph.ts`, `height-versioned.test.ts`, `core-settings.ts`, `zero-timeouts-checks.ts`, `validate.test.ts`, `process-worker.ts`, `sha256`, `migrate.test.ts`, `validate.ts`, `entries.ts`, `src/ledger/identity.ts`, `PointName`, `accepted-hash-checks.ts`, `config/plain-data.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `db/errors.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.022063492063492063 - nodes in this community are weakly interconnected._