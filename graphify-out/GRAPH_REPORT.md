# Graph Report - UmbraDB

## Corpus Check
- 1074 files · ~1,504,330 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11243 nodes · 34237 edges · 329 communities (299 shown, 30 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2645 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `d9dd1e09d75bd8d6` (1074 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- InMemoryBlockSource
- core-config.test.ts
- declaration.ts
- release-version.ts
- src/ledger/identity.ts
- networks.ts
- core.ts
- .concat
- pg-tx-history-adapter.ts
- browser.test.ts
- core-block-commit.test.ts
- browser/build.ts
- change-capture.ts
- node-fields-harness.ts
- accepted-hash-checks.ts
- example-checks.ts
- code-registry.ts
- loop.ts
- restore-private.ts
- paused-harness.ts
- documents.ts
- read-gate.ts
- relays.ts
- check-required-tests.ts
- tape/index.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- backup/restore.ts
- ledger-sweep.test.ts
- node-bridge.ts
- net.test.ts
- pglite-lock.ts
- TransactionHistoryEntry
- column-rules.ts
- cbor.property.test.ts
- Buffer
- ledger/metadata.ts
- core-private-source.ts
- signal-ignored-fixtures.ts
- .from
- ref_node_crypto
- block-fetch-decode.test.ts
- version-table.ts
- chrome.ts
- TapeBuilder
- checkShape
- runner/process.ts
- BlockItems
- browser-harness.ts
- FinalizedLoop
- PortSocket
- ws-mutual-tls.test.ts
- config/plain-data.test.ts
- validation.test.ts
- Design — CORE-ARCH: the standalone indexer's core architecture
- Design — Sprint 1: project setup + TemporalKV
- sweep.ts
- NodeClient
- statementsOf
- sha256
- no-indexer-or-wallet-sdk.test.ts
- worker-threads.test.ts
- client.test.ts
- retention.ts
- LoopPauses
- worker-threads-worker.ts
- buffer.ts
- Worker
- admin-harness.ts
- ingest-harness.ts
- .send
- TapeAnswers
- 5. Runner
- sweepStep
- 3. Block source and ingest
- .value
- transport-intake.test.ts
- type-check.ts
- .name
- builder.test.ts
- ledger/plain-data.ts
- pglite.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- vitest
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- node-format.ts
- pageBench
- opt-out.test.ts
- ref_node_path
- writer-lock-checks.ts
- HeightActivity
- migrate.ts
- LedgerPackage
- https.ts
- NodeFS
- module-tables.ts
- contract-modules.test.ts
- ledger/ledger-tasks.test.ts
- config-check.ts
- UmbraError
- backup/backup.ts
- interfaces/transaction-history-storage.ts
- process-context.test.ts
- connectWebSocket
- validate.ts
- contract-data-checks.ts
- cli-fixtures.ts
- pause-fixtures.ts
- transform-checks.ts
- range.ts
- chain-placement.test.ts
- Process
- Database
- private/backends.ts
- config/history.ts
- ledger-tapes.ts
- db/errors.ts
- PgTransactionHistoryStorage
- cbor.ts
- NodeBlockSource
- slow-block-harness.ts
- ledger-storage.test.ts
- mapping.ts
- adapter-fixtures.ts
- sweep-tapes.ts
- process-worker.ts
- spawnChild
- graph.ts
- zero-timeouts-checks.ts
- containers.test.ts
- transport-faults.test.ts
- private-transport.ts
- boundary.test.ts
- api-server.test.ts
- version-checks.ts
- read-only-database.test.ts
- graph.test.ts
- retirement.test.ts
- page.ts
- file-mode.test.ts
- core-transport.ts
- binding.test.ts
- intake.test.ts
- ledger/types.ts
- builds.ts
- messages.ts
- lockstep-refusals.test.ts
- module-rules.ts
- public-database.ts
- fetch-fixtures.ts
- pack-install.mjs
- core-ledger-state.ts
- test/postgres/setup.ts
- signal-backup.test.ts
- real-tapes.ts
- halted
- Problem
- version
- ADDED Requirements
- cold-boot-recovery.integration.test.ts
- restoreBackup
- UmbraDB module guide
- .slowBlockMs
- Boundaries, threats and controls
- UmbraDB
- core-ledger-state.test.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- UmbraDB third-party component inventory (SBOM)
- scoped-review-manifest
- path.ts
- midnight-env — reproducible PREPROD dev environment
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- fresh-instance.mjs
- crash-worker.ts
- history
- .put
- code
- ADDED Requirements
- T
- core-private-source.test.ts
- graph.py
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- README.md
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- After 0.10.0
- Contributing
- UmbraDB in a browser
- UmbraDB operator guide
- stats-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Midnight Foundation Security Policy
- UmbraDB — project instructions
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
- lib.sh
- Vendored ledger builds
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00023 — The blocks table's height partitions end at 5,000,000
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
- 00054 — A slow-block test hung inside PGlite for over an hour
- bug-report.md
- feature-request.md
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
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
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 372 edges
2. `UmbraError` - 314 edges
3. `ModuleDeclaration` - 177 edges
4. `FinalizedLoop` - 133 edges
5. `InMemoryBlockSource` - 120 edges
6. `NodeClient` - 113 edges
7. `Database` - 100 edges
8. `BlockRef` - 95 edges
9. `ReadHandle` - 89 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Suggested fix` --references--> `validateDeclarations()`  [INFERRED]
  docs/issues/00020-reserved-word-module-ids.md → src/modules/validation.ts
- `Problem` --references--> `checkParent()`  [INFERRED]
  docs/issues/00028-parent-check-passes-a-gap.md → src/backbone/core-block-commit/core-block-commit.ts

## Import Cycles
- None detected.

## Communities (329 total, 30 thin omitted)

### Community 0 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (177): ProcessReason, InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job, WorkerEvent (+169 more)

### Community 1 - "core-config.test.ts"
Cohesion: 0.03
Nodes (154): AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin (+146 more)

### Community 10 - "declaration.ts"
Cohesion: 0.03
Nodes (113): Outcome, BlockHeaderItem, BodyExtrinsic, BlockBody, BlockItemSource, CoreBlockHeader, CoreBlockItems, CoreLedgerVersion (+105 more)

### Community 102 - "release-version.ts"
Cohesion: 0.12
Nodes (35): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+27 more)

### Community 104 - "src/ledger/identity.ts"
Cohesion: 0.11
Nodes (29): ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSourceSettings, V9Logs, checkLedgerPackage(), checkLedgerPackages(), checkPackageFiles() (+21 more)

### Community 105 - "networks.ts"
Cohesion: 0.07
Nodes (32): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, Answers (+24 more)

### Community 106 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 107 - ".concat"
Cohesion: 0.07
Nodes (23): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+15 more)

### Community 108 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (24): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+16 more)

### Community 109 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 11 - "core-block-commit.test.ts"
Cohesion: 0.03
Nodes (91): BlockWriteHandle, SchemaPlan, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue (+83 more)

### Community 110 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 111 - "change-capture.ts"
Cohesion: 0.11
Nodes (25): CapturedTable, CaptureState, GuardTableRow, optOut, captureDefinitions(), capturedTables(), captureFunctionName(), captureReady() (+17 more)

### Community 112 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (26): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+18 more)

### Community 115 - "accepted-hash-checks.ts"
Cohesion: 0.11
Nodes (25): startHashDecision, a165Run, Attempt, TestDatabase, privateCursorHeight(), startStop(), a165Problems(), contentsOf() (+17 more)

### Community 116 - "example-checks.ts"
Cohesion: 0.11
Nodes (21): Served, BlockImport, ChildResult, CodeBlock, installedProject, isolationProblems(), serveCommand(), allowedSource() (+13 more)

### Community 118 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 12 - "loop.ts"
Cohesion: 0.04
Nodes (94): ProcessContext, CommitOutcome, HeldHeight, Invoke, LockstepWait, LoopEnd, LoopInput, Progress (+86 more)

### Community 120 - "restore-private.ts"
Cohesion: 0.14
Nodes (24): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, runRestore() (+16 more)

### Community 121 - "paused-harness.ts"
Cohesion: 0.15
Nodes (25): Body, PausedExpectation, Read, Reader, Running, keepingPause(), pausedOf(), pausedProblems() (+17 more)

### Community 122 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 124 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 127 - "relays.ts"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 129 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 13 - "tape/index.ts"
Cohesion: 0.04
Nodes (77): BoundaryReading, Link, TapeBuilderOptions, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId (+69 more)

### Community 130 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 131 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 132 - "backup/restore.ts"
Cohesion: 0.12
Nodes (21): PrivateChecks, PublicConfiguration, PublicIdentity, Checked, PublicSide, RestoreChain, Restored, RestoreInput (+13 more)

### Community 133 - "ledger-sweep.test.ts"
Cohesion: 0.15
Nodes (15): SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelBatch, ModelSnapshot, sweepReset() (+7 more)

### Community 134 - "node-bridge.ts"
Cohesion: 0.12
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 135 - "net.test.ts"
Cohesion: 0.13
Nodes (13): NetworkBroker, IncomingMessage, Server, NetworkMessage, createServer(), listen(), pagePort(), unlisten() (+5 more)

### Community 137 - "pglite-lock.ts"
Cohesion: 0.14
Nodes (19): CreatedDirectory, Held, PgliteLockUse, acquirePgliteLock(), directoryPath(), lockHeld(), openFailed(), pgliteLockFile() (+11 more)

### Community 138 - "TransactionHistoryEntry"
Cohesion: 0.15
Nodes (11): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, rowToEntry(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+3 more)

### Community 14 - "column-rules.ts"
Cohesion: 0.02
Nodes (105): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+97 more)

### Community 140 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 142 - "Buffer"
Cohesion: 0.11
Nodes (10): Emitter, Frame, Listener, PortUpgrade, RawData, WebSocket, WebSocketServer, Buffer (+2 more)

### Community 146 - "ledger/metadata.ts"
Cohesion: 0.13
Nodes (9): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, OwnStateMetadata, contentStateOf(), hexOf() (+1 more)

### Community 147 - "core-private-source.ts"
Cohesion: 0.13
Nodes (17): PrivateShared, PrivateSourceOptions, StartHashes, bindingRefusal(), bytesOfHex(), hex(), listed(), needsLockstepRefusal() (+9 more)

### Community 148 - "signal-ignored-fixtures.ts"
Cohesion: 0.11
Nodes (19): IgnoredJob, ListenedRun, WorkerSignals, listenerProblems(), namesUnder(), pacedTape(), signalLines(), sigusr2Ignored() (+11 more)

### Community 15 - ".from"
Cohesion: 0.03
Nodes (92): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+84 more)

### Community 150 - "ref_node_crypto"
Cohesion: 0.14
Nodes (20): ChangeKind, tableChanges, TouchedRow, digestBlock(), encodeCanonical(), changeOf(), concat(), isCheckpointHeight() (+12 more)

### Community 151 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 155 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerRow, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins() (+13 more)

### Community 156 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 158 - "TapeBuilder"
Cohesion: 0.16
Nodes (7): Refusal, TapeBuilder, RecordingError, withBuilder(), frameText(), whenClosed(), 11. Refusals and halts (IN-12)

### Community 159 - "checkShape"
Cohesion: 0.25
Nodes (11): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+3 more)

### Community 16 - "runner/process.ts"
Cohesion: 0.03
Nodes (74): OpenedConfig, OpenedFacts, AdminStarter, BlockEventSource, QueuedBlock, ChainCheck, ChainCheckInput, ChainIdentity (+66 more)

### Community 160 - "BlockItems"
Cohesion: 0.14
Nodes (10): BlockItems, LateUse, EagerItems, EagerLoop, KeptItems, KeptLoop, revisionAt(), reporting() (+2 more)

### Community 169 - "browser-harness.ts"
Cohesion: 0.27
Nodes (16): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+8 more)

### Community 17 - "FinalizedLoop"
Cohesion: 0.03
Nodes (37): EntryBoundary, Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, Startup, SkipsAfterReconnect (+29 more)

### Community 170 - "PortSocket"
Cohesion: 0.20
Nodes (6): PortSocket, pair(), 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 171 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (12): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+4 more)

### Community 174 - "config/plain-data.test.ts"
Cohesion: 0.14
Nodes (9): PlainDataRule, Row, failures(), refusal(), thrown(), valueOf(), A26, files (+1 more)

### Community 175 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 176 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.15
Nodes (11): BackupText, blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence, 15. Relation to the existing design documents (+3 more)

### Community 177 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 179 - "sweep.ts"
Cohesion: 0.13
Nodes (11): CoreLedgerStateOptions, GreyPicker, GreyView, SweepPhase, FixtureRunOptions, BYTE_ORDER(), writeSweep(), GREY_TABLE (+3 more)

### Community 18 - "NodeClient"
Cohesion: 0.05
Nodes (67): NodeSourceOptions, CoreChainBinding, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+59 more)

### Community 180 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 183 - "sha256"
Cohesion: 0.22
Nodes (7): Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 187 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 188 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 19 - "client.test.ts"
Cohesion: 0.03
Nodes (52): Connection, NodeClientOptions, NodeRetry, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets (+44 more)

### Community 192 - "retention.ts"
Cohesion: 0.23
Nodes (8): retainedStates, CoreRevision, revisionsOf(), coreRevisionsOf(), releasedBy(), retainedFrom(), retentionWindow(), revision()

### Community 193 - "LoopPauses"
Cohesion: 0.23
Nodes (3): LoopPaused, LoopPauses, watched()

### Community 195 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 196 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 2 - "admin-harness.ts"
Cohesion: 0.03
Nodes (151): DatabaseParts, PostgresPartsInput, TransportReader, ProcessConfig, ProcessState, AdminRun, AdminRunOptions, Answered (+143 more)

### Community 20 - "ingest-harness.ts"
Cohesion: 0.04
Nodes (84): BlockHeader, SourceShared, ingest, IngestOptions, SourceClass, watched, retentionSeen, WindowBackup (+76 more)

### Community 202 - "TapeAnswers"
Cohesion: 0.32
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 21 - "5. Runner"
Cohesion: 0.04
Nodes (88): PointName, Callback, CallbackFailure, ParallelPoint, PointArguments, PointRun, PointSchedule, ReasonCode (+80 more)

### Community 211 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 215 - "3. Block source and ingest"
Cohesion: 0.31
Nodes (9): Bound, ConfiguredGenesis, bindCoreBlockFetch(), bindCoreChain(), bytesOf(), configuredGenesisOf(), readOnlyDatabase(), 3. Block source and ingest (+1 more)

### Community 22 - ".value"
Cohesion: 0.05
Nodes (73): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+65 more)

### Community 224 - "type-check.ts"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 23 - "builder.test.ts"
Cohesion: 0.04
Nodes (51): ManualTimers, ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Metadata, Step (+43 more)

### Community 234 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 24 - "pglite.ts"
Cohesion: 0.04
Nodes (52): ConfiguredDatabase, ConfiguredDatabaseOptions, DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight (+44 more)

### Community 246 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 25 - "vitest"
Cohesion: 0.03
Nodes (60): Finding, Lockfile, Manifest, RepositoryFile, Upstream, Leftover, RemovedName, ReportedTest (+52 more)

### Community 254 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 26 - "node-format.ts"
Cohesion: 0.05
Nodes (59): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+51 more)

### Community 268 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 27 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (76): PlacedRefusal, Refusal, Chain, ChainOptions, DigestRow, Op, States, TableName (+68 more)

### Community 28 - "ref_node_path"
Cohesion: 0.07
Nodes (56): RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, TickerConfig, ledgerBackup, cliProject, checkLedgerPackage() (+48 more)

### Community 29 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (58): PostgresOptions, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PostgresTestServer, PauseReport, startWriter() (+50 more)

### Community 293 - "HeightActivity"
Cohesion: 0.60
Nodes (3): HeightActivity, NeverClears, NeverClears

### Community 3 - "migrate.ts"
Cohesion: 0.03
Nodes (125): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Settling, StartupInput, Difference, PlannedSchema (+117 more)

### Community 30 - "LedgerPackage"
Cohesion: 0.05
Nodes (38): LedgerPackage, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, StagenetBlockJson, StagenetFixtureJson, stagenetReplay (+30 more)

### Community 31 - "module-tables.ts"
Cohesion: 0.05
Nodes (53): CaptureColumn, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead, ColumnType (+45 more)

### Community 32 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (68): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+60 more)

### Community 33 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.04
Nodes (70): TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, bindLedgerTasks() (+62 more)

### Community 34 - "config-check.ts"
Cohesion: 0.04
Nodes (68): CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, RunOptions, RunSeams, LoadedConfig (+60 more)

### Community 35 - "UmbraError"
Cohesion: 0.04
Nodes (48): LoadedConfig, LoadOptions, databaseTarget, PgliteLockUse, ReadHandle, BoundedRead, UmbraError, PointCallbacks (+40 more)

### Community 36 - "backup/backup.ts"
Cohesion: 0.06
Nodes (66): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+58 more)

### Community 37 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.04
Nodes (56): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+48 more)

### Community 38 - "process-context.test.ts"
Cohesion: 0.05
Nodes (44): Revision, ResolvedGraph, StartedModuleApi, MisuseListener, ProcessContexts, ProcessContextsInput, ProcessItems, PublishRefusal (+36 more)

### Community 39 - "connectWebSocket"
Cohesion: 0.05
Nodes (41): Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+33 more)

### Community 4 - "validate.ts"
Cohesion: 0.02
Nodes (151): RevisionSettings, LedgerTableSettings, TransportReaderSettings, DatabasePartsInput, Entry, PrivateCoreSettings, PublicCoreSettings, RedactableConfig (+143 more)

### Community 40 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (68): ContractStateRow, CoreContractStatesOptions, DefinedModule, CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine (+60 more)

### Community 41 - "cli-fixtures.ts"
Cohesion: 0.05
Nodes (54): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, CommandResult, CheckTarget, CliBackend (+46 more)

### Community 42 - "pause-fixtures.ts"
Cohesion: 0.05
Nodes (54): backupSignalRelay, SignalSource, stopSignal, BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable (+46 more)

### Community 43 - "transform-checks.ts"
Cohesion: 0.07
Nodes (51): Failure, Variant, TapeError, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange (+43 more)

### Community 44 - "range.ts"
Cohesion: 0.04
Nodes (61): NodeSubscription, ConnectSocket, Outage, BoundaryBlockReading, BoundaryOptions, Arguments, Command, TapeCommandIo (+53 more)

### Community 45 - "chain-placement.test.ts"
Cohesion: 0.07
Nodes (59): ChainEvent, ScaleValue, Field, PalletMetadata, Registry, RuntimeShape, StorageSpec, decodeExtrinsics() (+51 more)

### Community 47 - "Process"
Cohesion: 0.06
Nodes (23): ConfigFinding, CoreTransport, RetryCode, PauseHold, Process, RetryCondition, SignalTarget, publicLockstepOf() (+15 more)

### Community 48 - "Database"
Cohesion: 0.05
Nodes (47): Database, Snapshot, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer (+39 more)

### Community 49 - "private/backends.ts"
Cohesion: 0.06
Nodes (47): PostgresParts, SessionSeen, A162Options, a162Run, HeaderSeen, Escape, publicState, Refused (+39 more)

### Community 5 - "config/history.ts"
Cohesion: 0.03
Nodes (143): ConfigFacts, CoreVersion, CoreEntryInput, CoreSettings, CoreSettingsBase, EntryBuilder, EntryConfig, EntryHeights (+135 more)

### Community 50 - "ledger-tapes.ts"
Cohesion: 0.06
Nodes (62): BlockParsed, BlockParsedOptions, TransactionParser, itemsSeen, BlockSpec, EventSpec, Json, Scenario (+54 more)

### Community 51 - "db/errors.ts"
Cohesion: 0.06
Nodes (48): PostgresConnection, PostgresOptions, SslMode, ReadOnlyDatabase, ReadOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning (+40 more)

### Community 52 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (52): TransactionHistoryStorage, PgTransactionHistoryStorage, capitalize(), reason(), [0.9.5] - 2026-07-25 — "Penumbra", Added, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface) (+44 more)

### Community 53 - "cbor.ts"
Cohesion: 0.07
Nodes (54): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+46 more)

### Community 54 - "NodeBlockSource"
Cohesion: 0.07
Nodes (14): HeadWait, NodeBlockSource, Prefetch, PreparedBlock, QueueRunner, EventsRunner, NoWindow, Refetches (+6 more)

### Community 55 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (51): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+43 more)

### Community 56 - "ledger-storage.test.ts"
Cohesion: 0.08
Nodes (48): ChildReader, SeenLoad, RestartEvent, RestartJob, LedgerTx, childRefKeys(), readChildren(), a106Problems() (+40 more)

### Community 57 - "mapping.ts"
Cohesion: 0.06
Nodes (40): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+32 more)

### Community 6 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (117): StoredNode, recordedGenesis, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot (+109 more)

### Community 60 - "sweep-tapes.ts"
Cohesion: 0.09
Nodes (47): FixtureRun, SweepModel, TableSnapshot, FixtureNode, FakeState, RefusalData, hex(), refusalHalt() (+39 more)

### Community 61 - "process-worker.ts"
Cohesion: 0.06
Nodes (42): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, privateIntake, CommandBuildOptions, PgliteMemoryParts, PglitePathParts (+34 more)

### Community 62 - "spawnChild"
Cohesion: 0.05
Nodes (42): ParentJob, Kill, Orphaned, SourceFile, LockResult, Pem, dockerExec(), startWorker() (+34 more)

### Community 63 - "graph.ts"
Cohesion: 0.07
Nodes (51): OwnPart, ItemDeclaration, Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing (+43 more)

### Community 65 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (36): Settings, Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings() (+28 more)

### Community 66 - "containers.test.ts"
Cohesion: 0.06
Nodes (37): BenchEnv, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, TlsPostgres, guardContainers(), removeAttempt() (+29 more)

### Community 67 - "transport-faults.test.ts"
Cohesion: 0.08
Nodes (36): Message, TestCertificates, Ended, rawClient, codeOf(), splitAddress(), startCoreTransport(), hexOf() (+28 more)

### Community 68 - "private-transport.ts"
Cohesion: 0.07
Nodes (24): TransportLimits, TransportTls, HelloAck, JsonValue, ReadResult, StatementResult, Pending, PrivateTransport (+16 more)

### Community 69 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 7 - "api-server.test.ts"
Cohesion: 0.03
Nodes (108): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ApiRegistry, Connection, HeadersArgument, ModuleApiServer (+100 more)

### Community 70 - "version-checks.ts"
Cohesion: 0.10
Nodes (38): Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk, Answers (+30 more)

### Community 71 - "read-only-database.test.ts"
Cohesion: 0.05
Nodes (31): Case, Phase, HeldRead, Job, Outcome, Reads, Step, OffersReadOnly (+23 more)

### Community 72 - "graph.test.ts"
Cohesion: 0.07
Nodes (43): EntryRange, GraphInput, HeightRange, PastFaultCase, RefusalCase, schemaPlan(), blockAt(), logsProvider() (+35 more)

### Community 73 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 74 - "page.ts"
Cohesion: 0.06
Nodes (37): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, Scope, CallMethod, crossedError (+29 more)

### Community 75 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (31): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+23 more)

### Community 77 - "core-transport.ts"
Cohesion: 0.07
Nodes (26): CoreTransportOptions, InstanceView, Session, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions (+18 more)

### Community 78 - "binding.test.ts"
Cohesion: 0.08
Nodes (38): PrivateIntakeOptions, PublicWakes, builtInNetwork, A165Options, PrivateBackend, A113Observation, A156Observation, Binding (+30 more)

### Community 79 - "intake.test.ts"
Cohesion: 0.09
Nodes (32): PrivateSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation, A116Observation, TestLink (+24 more)

### Community 8 - "ledger/types.ts"
Cohesion: 0.03
Nodes (100): LoadLedger, LedgerStateItem, RetainedState, LedgerName, LedgerSource, ApplyInput, ApplyOutput, ChainOutcome (+92 more)

### Community 82 - "builds.ts"
Cohesion: 0.09
Nodes (31): PrivateProcess, PrivateRefusal, Pause, Q142Observation, SkipsLockstep, InstancesOptions, instancesRun, adminOrigin() (+23 more)

### Community 83 - "messages.ts"
Cohesion: 0.07
Nodes (36): Committed, MessageFault, MessageType, Parsed, Read, bytesOf(), decodeParameter(), decodeValue() (+28 more)

### Community 87 - "lockstep-refusals.test.ts"
Cohesion: 0.10
Nodes (37): LockstepCondition, PublicCore, A118Observation, MismatchObservation, ExpectedWait, WaitSample, hashAt(), inMemoryBlock() (+29 more)

### Community 88 - "module-rules.ts"
Cohesion: 0.07
Nodes (30): Runnable, CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, settle() (+22 more)

### Community 89 - "public-database.ts"
Cohesion: 0.10
Nodes (21): PrivateBlockSource, SourceTransport, PublicDatabase, PublicSide, PublicSideOptions, TransportPosition, readConfigHash(), readConfigRows() (+13 more)

### Community 9 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (110): NodeCallOptions, ProcessCondition, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME (+102 more)

### Community 90 - "pack-install.mjs"
Cohesion: 0.09
Nodes (35): Surface, SmokeFailure, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12() (+27 more)

### Community 91 - "core-ledger-state.ts"
Cohesion: 0.08
Nodes (36): BlockLedgerSource, LedgerBinding, applyBlock(), boundLedger(), bytesOf(), chainOutcomesOf(), contractsOf(), deployedBelow() (+28 more)

### Community 93 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 95 - "signal-backup.test.ts"
Cohesion: 0.08
Nodes (24): WORKER, SignalEvent, SignalJob, RunningCommand, statsConfig, relayOf(), write(), chainNode() (+16 more)

### Community 96 - "real-tapes.ts"
Cohesion: 0.09
Nodes (33): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+25 more)

### Community 123 - "halted"
Cohesion: 0.09
Nodes (25): refused(), halted(), The node on `/status`, 7. Storage helpers, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions (+17 more)

### Community 252 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 64 - "version"
Cohesion: 0.05
Nodes (48): backUp(), side(), migrations(), version(), 1. Overview, Appendix A. Reference, Requirement: MD-1 A module is a declaration the host imports, Scenario: A declaration with an unknown point name (+40 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.06
Nodes (37): 5. WalletState envelope, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll (+29 more)

### Community 101 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (25): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed(), ledgerV8NodeEntry() (+17 more)

### Community 117 - "restoreBackup"
Cohesion: 0.10
Nodes (28): readPrivateBinding(), backupAtStop(), isEmptyDatabase(), load(), notEmpty(), restoreBackup(), checkRecordedMigrations(), restoreGrants() (+20 more)

### Community 136 - "UmbraDB module guide"
Cohesion: 0.08
Nodes (25): params(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations, 16. Upgrades (+17 more)

### Community 152 - ".slowBlockMs"
Cohesion: 0.11
Nodes (18): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+10 more)

### Community 157 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 166 - "UmbraDB"
Cohesion: 0.12
Nodes (18): text(), transportReader(), Backup and restore, Check and run, Configuration files, Create a project, Example: loading `stats-module`, Install UmbraDB (+10 more)

### Community 167 - "core-ledger-state.test.ts"
Cohesion: 0.13
Nodes (11): boundLedgerParser(), bindCoreLedgerState(), itemsOf(), writeBlock(), applied(), bound(), query(), refusing() (+3 more)

### Community 178 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (14): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+6 more)

### Community 182 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 186 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 191 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 205 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.18
Nodes (8): createReadStream(), bindCoreChainEvents(), 11. Chain data, 13. Contract data, 16. Browser, 19. Close-out, 6. Storage helpers, Tasks — CORE-ARCH: the standalone indexer's core architecture

### Community 206 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 208 - "scoped-review-manifest"
Cohesion: 0.20
Nodes (10): explain(), explainRefusal(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation (+2 more)

### Community 227 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 232 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.29
Nodes (7): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 236 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 237 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.29
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 294 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 304 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 46 - "history"
Cohesion: 0.04
Nodes (66): integer(), history(), n(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()` (+58 more)

### Community 58 - ".put"
Cohesion: 0.04
Nodes (53): coreTxResultsOnParse(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window (+45 more)

### Community 59 - "code"
Cohesion: 0.04
Nodes (56): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+48 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 85 - "T"
Cohesion: 0.05
Nodes (40): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Scenario: Version and timestamp addressing agree, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 6.1 — P3 is the differential gate's replay-equivalence / fold anchor (documentation, no new test code) (+32 more)

### Community 92 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (12): height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), CORE_PRIVATE_SOURCE_MIGRATIONS, PUBLIC_POLL_MS (+4 more)

### Community 99 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 114 - "package.json"
Cohesion: 0.06
Nodes (33): bin, umbradb, bugs, url, description, optional, engines, node (+25 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 141 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 143 - "README.md"
Cohesion: 0.11
Nodes (15): [0.10.0] - 2026-10-27, Added, Breaking changes, Changelog, [Unreleased], Choosing a database, At each start, Best blocks: worked on early, never stored (+7 more)

### Community 144 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 145 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+15 more)

### Community 149 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.09
Nodes (17): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+9 more)

### Community 153 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 154 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 162 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 165 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 168 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 172 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 173 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 181 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 184 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 185 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 189 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 190 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 194 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 198 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 199 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 200 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 5. Full-sync soak + load-under-concurrent-prune (G10), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring (+3 more)

### Community 203 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 204 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 207 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 209 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 210 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 212 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 213 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 214 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

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

### Community 221 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 222 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 223 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 225 - "After 0.10.0"
Cohesion: 0.22
Nodes (9): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Feature modules, Later core work, Non-goals, Release gates still to run (+1 more)

### Community 228 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 229 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 230 - "UmbraDB operator guide"
Cohesion: 0.25
Nodes (8): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The transport reader, TLS to PostgreSQL: `ssl`, UmbraDB operator guide

### Community 231 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 233 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 235 - "Our Pledge"
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

### Community 241 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 242 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 243 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 244 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 245 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 247 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 249 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 250 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 251 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 253 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 255 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 256 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 257 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 258 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 259 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 260 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 261 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 262 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 263 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 264 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 265 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 266 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 267 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

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

### Community 274 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 275 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 276 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 277 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 278 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 279 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 280 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 281 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 282 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 283 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 284 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 285 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 286 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 287 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 288 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 289 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 290 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 291 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 292 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

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

### Community 300 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 301 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 302 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 303 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 76 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 97 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3760 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `InMemoryBlockSource`, `core-config.test.ts`, `admin-harness.ts`, `migrate.ts`, `validate.ts`, `config/history.ts`, `adapter-fixtures.ts`, `api-server.test.ts`, `ledger/types.ts`, `fetch-fixtures.ts`, `declaration.ts`, `core-block-commit.test.ts`, `loop.ts`, `tape/index.ts`, `column-rules.ts`, `.from`, `runner/process.ts`, `NodeClient`, `client.test.ts`, `ingest-harness.ts`, `5. Runner`, `builder.test.ts`, `pglite.ts`, `node-format.ts`, `opt-out.test.ts`, `ref_node_path`, `writer-lock-checks.ts`, `LedgerPackage`, `module-tables.ts`, `contract-modules.test.ts`, `ledger/ledger-tasks.test.ts`, `config-check.ts`, `UmbraError`, `backup/backup.ts`, `interfaces/transaction-history-storage.ts`, `process-context.test.ts`, `connectWebSocket`, `contract-data-checks.ts`, `cli-fixtures.ts`, `pause-fixtures.ts`, `transform-checks.ts`, `chain-placement.test.ts`, `Process`, `Database`, `private/backends.ts`, `ledger-tapes.ts`, `db/errors.ts`, `cbor.ts`, `slow-block-harness.ts`, `ledger-storage.test.ts`, `mapping.ts`, `sweep-tapes.ts`, `spawnChild`, `zero-timeouts-checks.ts`, `containers.test.ts`, `transport-faults.test.ts`, `private-transport.ts`, `boundary.test.ts`, `version-checks.ts`, `read-only-database.test.ts`, `graph.test.ts`, `retirement.test.ts`, `file-mode.test.ts`, `core-transport.ts`, `binding.test.ts`, `intake.test.ts`, `builds.ts`, `messages.ts`, `lockstep-refusals.test.ts`, `pack-install.mjs`, `core-ledger-state.ts`, `core-private-source.test.ts`, `test/postgres/setup.ts`, `signal-backup.test.ts`, `real-tapes.ts`, `cold-boot-recovery.integration.test.ts`, `release-version.ts`, `src/ledger/identity.ts`, `networks.ts`, `core.ts`, `pg-tx-history-adapter.ts`, `browser.test.ts`, `browser/build.ts`, `node-fields-harness.ts`, `package.json`, `accepted-hash-checks.ts`, `example-checks.ts`, `code-registry.ts`, `restore-private.ts`, `documents.ts`, `read-gate.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `backup/restore.ts`, `ledger-sweep.test.ts`, `node-bridge.ts`, `net.test.ts`, `cbor.property.test.ts`, `ref_node_crypto`, `block-fetch-decode.test.ts`, `BlockItems`, `excluded-not-exported.test.ts`, `core-ledger-state.test.ts`, `ws-mutual-tls.test.ts`, `config/plain-data.test.ts`, `validation.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `retention.ts`, `LoopPauses`, `transport-intake.test.ts`?**
  _High betweenness centrality (0.230) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InMemoryBlockSource` be split into smaller, more focused modules?**
  _Cohesion score 0.021912350597609563 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `InMemoryBlockSource`, `core-config.test.ts`, `admin-harness.ts`, `migrate.ts`, `backup/restore.ts`, `config/history.ts`, `validate.ts`, `api-server.test.ts`, `ledger/types.ts`, `pglite-lock.ts`, `declaration.ts`, `core-block-commit.test.ts`, `loop.ts`, `fetch-fixtures.ts`, `tape/index.ts`, `runner/process.ts`, `FinalizedLoop`, `ledger/metadata.ts`, `core-private-source.ts`, `ingest-harness.ts`, `NodeClient`, `client.test.ts`, `5. Runner`, `pglite.ts`, `vitest`, `version-table.ts`, `opt-out.test.ts`, `ref_node_path`, `writer-lock-checks.ts`, `checkShape`, `contract-modules.test.ts`, `module-tables.ts`, `config-check.ts`, `ledger/ledger-tasks.test.ts`, `backup/backup.ts`, `TapeBuilder`, `process-context.test.ts`, `core-ledger-state.test.ts`, `pause-fixtures.ts`, `transform-checks.ts`, `range.ts`, `config/plain-data.test.ts`, `Process`, `Database`, `validation.test.ts`, `private/backends.ts`, `db/errors.ts`, `statementsOf`, `cbor.ts`, `NodeBlockSource`, `sha256`, `slow-block-harness.ts`, `mapping.ts`, `process-worker.ts`, `graph.ts`, `zero-timeouts-checks.ts`, `containers.test.ts`, `transport-faults.test.ts`, `private-transport.ts`, `version-checks.ts`, `read-only-database.test.ts`, `graph.test.ts`, `core-transport.ts`, `binding.test.ts`, `lockstep-refusals.test.ts`, `module-rules.ts`, `public-database.ts`, `3. Block source and ingest`, `core-ledger-state.ts`, `core-private-source.test.ts`, `src/ledger/identity.ts`, `accepted-hash-checks.ts`, `restoreBackup`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `core-config.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02511415525114155 - nodes in this community are weakly interconnected._