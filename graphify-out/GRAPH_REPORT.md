# Graph Report - UmbraDB

## Corpus Check
- 1105 files · ~1,544,187 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11514 nodes · 34942 edges · 340 communities (310 shown, 30 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2798 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `2b4a365eac6b1cd9` (1105 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- declaration.ts
- adapter-fixtures.ts
- tape/index.ts
- node-format.ts
- example-checks.ts
- boundary.test.ts
- release-version.ts
- conformance-gate.mjs
- ref_node_url
- redact.ts
- process-worker.ts
- page.ts
- code-registry.ts
- core-block-commit.test.ts
- deterministic-postgresql/index.ts
- core-private-source.test.ts
- ledger-sweep.test.ts
- checks.test.ts
- src/ledger/identity.ts
- Buffer
- documents.ts
- mapping.ts
- pg-tx-history-adapter.ts
- process-build.ts
- Lockstep
- read-gate.ts
- BlockRef
- version-checks.ts
- vendored-ledger-v9.test.ts
- Writer
- describeNodeStoreExports
- browser.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- items.ts
- restore-private.ts
- failures.ts
- .value
- NodeClient
- chain-events-decode.test.ts
- height-versioned.property.test.ts
- pglite-lock.ts
- transcripts.ts
- Design — START-UMBRADB: UmbraDB as a library
- .concat
- admin-harness.ts
- block-fetch-decode.test.ts
- harness.ts
- core-block-fetch/metadata.ts
- version-table.ts
- lockstep-refusals.test.ts
- column-rules.ts
- ledger-table-config.test.ts
- LoopPauses
- placement.ts
- opt-out.test.ts
- ws-mutual-tls.test.ts
- Design — Sprint 1: project setup + TemporalKV
- statementsOf
- postgres-tls-server.ts
- core-block-fetch.test.ts
- core.ts
- web-lock.ts
- db/api.ts
- extrinsics.ts
- Session
- readiness.test.ts
- no-indexer-or-wallet-sdk.test.ts
- worker-threads.test.ts
- midnight-env — reproducible PREPROD dev environment
- UmbraError
- NodeBlockSource
- worker-threads-worker.ts
- Worker
- stats-module.ts
- client.test.ts
- childRefKeys
- sweepStep
- component-table.test.ts
- runner/process.ts
- TapeAnswers
- core-transport.ts
- postgres-image.test.ts
- checkParent
- builder.test.ts
- ledger/plain-data.ts
- block-context.ts
- vendored-ledger-files.test.ts
- .from
- mutation-evidence.d.mts
- AsyncLocalStorage
- ref_node_fs
- FinalizedLoop
- ledger-storage.test.ts
- validate.ts
- InMemoryBlockSource
- LedgerPackage
- Heartbeat
- exitWithin
- builds.ts
- CliBackend
- https.ts
- NodeFS
- vitest
- core-config.test.ts
- range.ts
- ModuleDeclaration
- config-check.ts
- process-admin.ts
- cli/command.ts
- .read
- host.ts
- ledger/ledger-tasks.test.ts
- pause-fixtures.ts
- Process
- backup/backup.ts
- refused-configuration.test.ts
- PgTransactionHistoryStorage
- order.property.test.ts
- interfaces/transaction-history-storage.ts
- node-fields-harness.ts
- ref_node_timers
- loop-stop-harness.ts
- validation.ts
- entries.ts
- loop.ts
- slow-block-harness.ts
- net.test.ts
- change-capture.ts
- src/db/postgres.ts
- api-server.test.ts
- replay-check.ts
- writer-lock-checks.ts
- openPostgres
- transform-checks.ts
- chain-process.test.ts
- contract-data-checks.ts
- graph.ts
- backup/restore.ts
- binding.test.ts
- cbor.ts
- retirement.test.ts
- core-ledger-state/sql.ts
- file-mode.test.ts
- 12. Exported surface and command (LS-1, LS-6)
- browser/build.ts
- public-database.ts
- in-memory-source.ts
- transaction-history-storage.property.test.ts
- checkShape
- process-backends.ts
- ReadHandle
- api-timeouts.test.ts
- config/plain-data.ts
- events-fixtures.ts
- pglite.ts
- cold-boot-recovery.integration.test.ts
- config/history.ts
- real-tapes.ts
- cli/run.ts
- test/postgres/setup.ts
- pack-install.mjs
- networks.ts
- private/lockstep-wait.test.ts
- paused-harness.ts
- ADDED Requirements
- .connected
- version
- graph.py
- ADDED Requirements
- .slowBlockMs
- transportReader
- UmbraDB module guide
- T
- backupAtStop
- mapping.test.ts
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- UmbraDB third-party component inventory (SBOM)
- path.ts
- node-bridge.test.ts
- test-processes.test.ts
- parseJsonLossless
- crash-worker.ts
- .put
- history
- code
- refused
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- README.md
- ADDED Requirements
- Requirements
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Boundaries, threats and controls
- scripts
- stryker.conf.json
- ADDED Requirements
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-16 Chain-data reads name their view and height
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
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
- Requirement: CF-4 Every field is data, operational or secret
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.9.5] - 2026-07-25 — "Penumbra"
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- stats-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
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
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
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
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- start-stack.sh
- repository
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
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 374 edges
2. `UmbraError` - 318 edges
3. `ModuleDeclaration` - 178 edges
4. `FinalizedLoop` - 133 edges
5. `InMemoryBlockSource` - 124 edges
6. `NodeClient` - 113 edges
7. `Database` - 101 edges
8. `BlockRef` - 98 edges
9. `ReadHandle` - 91 edges
10. `NodeBlockSource` - 81 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
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

## Communities (340 total, 30 thin omitted)

### Community 0 - "declaration.ts"
Cohesion: 0.02
Nodes (195): ContractLog, BodyExtrinsic, BlockBody, BlockParsed, BlockParsedOptions, BlockTransaction, ChainTransaction, ChainEvent (+187 more)

### Community 1 - "adapter-fixtures.ts"
Cohesion: 0.03
Nodes (164): ApplyInput, ApplyOutput, StateSummary, StoredNode, V9Logs, BlockSpec, Json, transactionSpec (+156 more)

### Community 10 - "tape/index.ts"
Cohesion: 0.04
Nodes (85): Recorded, Failure, Variant, Failure, Variant, RecordingProblem, TapeError, TapeProblem (+77 more)

### Community 100 - "node-format.ts"
Cohesion: 0.12
Nodes (24): Child, Reader, Readable, Reader, TableNode, node(), childKey(), concat() (+16 more)

### Community 101 - "example-checks.ts"
Cohesion: 0.08
Nodes (25): Served, Finding, BlockImport, ChildResult, CodeBlock, installedProject, isolationProblems(), serveCommand() (+17 more)

### Community 103 - "boundary.test.ts"
Cohesion: 0.13
Nodes (34): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+26 more)

### Community 105 - "release-version.ts"
Cohesion: 0.12
Nodes (35): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+27 more)

### Community 109 - "conformance-gate.mjs"
Cohesion: 0.07
Nodes (27): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), check, checker (+19 more)

### Community 11 - "ref_node_url"
Cohesion: 0.02
Nodes (100): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+92 more)

### Community 110 - "redact.ts"
Cohesion: 0.10
Nodes (28): RedactionForms, SecretForm, TextPattern, Needs, findings(), databaseText(), isMemoryDatabase(), configRedactor() (+20 more)

### Community 111 - "process-worker.ts"
Cohesion: 0.11
Nodes (25): BrowserRun, databaseTarget, ProcessView, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker (+17 more)

### Community 112 - "page.ts"
Cohesion: 0.07
Nodes (28): PageState, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog(), backUp(), beginCore() (+20 more)

### Community 116 - "code-registry.ts"
Cohesion: 0.10
Nodes (29): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+21 more)

### Community 117 - "core-block-commit.test.ts"
Cohesion: 0.09
Nodes (24): StandInOptions, Commit, Committed, blockFetchStandIn(), standInHeader(), standInItems(), a145Stored(), blockAt() (+16 more)

### Community 118 - "deterministic-postgresql/index.ts"
Cohesion: 0.13
Nodes (24): Settings, Outcome, openBlockWrites(), setUp(), idleBlock(), migrated(), part(), seenAt() (+16 more)

### Community 12 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (73): PrivateBlockSource, PrivateChecks, privateIntake, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision (+65 more)

### Community 120 - "ledger-sweep.test.ts"
Cohesion: 0.13
Nodes (16): SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel (+8 more)

### Community 121 - "checks.test.ts"
Cohesion: 0.09
Nodes (23): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+15 more)

### Community 122 - "src/ledger/identity.ts"
Cohesion: 0.13
Nodes (25): ManifestLine, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages(), checkPackageFiles() (+17 more)

### Community 123 - "Buffer"
Cohesion: 0.10
Nodes (18): Buffer, BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText(), charCodes() (+10 more)

### Community 124 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 125 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 127 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 13 - "process-build.ts"
Cohesion: 0.04
Nodes (99): ProcessingEnd, ProcessStatus, Q142Observation, A43Case, A43Observation, Outcome, CoreSeen, testBuild (+91 more)

### Community 131 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 132 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 133 - "BlockRef"
Cohesion: 0.13
Nodes (10): BlockRef, CommitOutcome, HeldHeight, Fetching, Recorder, LateRedelivery, Outcomes, DropsHeld (+2 more)

### Community 134 - "version-checks.ts"
Cohesion: 0.12
Nodes (20): Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk, copyVendoredLedger() (+12 more)

### Community 135 - "vendored-ledger-v9.test.ts"
Cohesion: 0.16
Nodes (25): NodeRoot, freeAll(), bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free() (+17 more)

### Community 137 - "Writer"
Cohesion: 0.10
Nodes (14): DurabilityWarning, ReadPool, Writer, WriterStart, commitRolledBack(), rollBack(), Binding constraints, Dependencies (+6 more)

### Community 138 - "describeNodeStoreExports"
Cohesion: 0.12
Nodes (11): FreshInstanceRequest, FreshInstanceResult, StoredNode, Disposable, NodeBatch, NodeStoreExports, NodeStoreSubject, runInFreshInstance() (+3 more)

### Community 14 - "browser.test.ts"
Cohesion: 0.04
Nodes (97): BrowserBuild, EventSpec, Reachable, RestoreAttempt, PageBackup, pageBench, PageEvent, PageRestore (+89 more)

### Community 140 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 141 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 142 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 144 - "items.ts"
Cohesion: 0.12
Nodes (11): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata (+3 more)

### Community 145 - "restore-private.ts"
Cohesion: 0.16
Nodes (21): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+13 more)

### Community 146 - "failures.ts"
Cohesion: 0.13
Nodes (19): ConfigFinding, ProcessReason, ReasonCode, Unwrapped, StatusFacts, configurationRefused(), findingText(), refusalFindings() (+11 more)

### Community 148 - ".value"
Cohesion: 0.20
Nodes (9): MetadataType, ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), 6. Blocks, events and transactions, Requirement: set rejects an invalid value with ValidationError before any statement (+1 more)

### Community 15 - "NodeClient"
Cohesion: 0.05
Nodes (73): NodeSourceOptions, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription (+65 more)

### Community 150 - "chain-events-decode.test.ts"
Cohesion: 0.11
Nodes (21): MetadataField, Primitive, writeEventRows(), canonicalJson(), hexOf(), littleEndian(), insertEventRows(), fill() (+13 more)

### Community 151 - "height-versioned.property.test.ts"
Cohesion: 0.16
Nodes (17): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+9 more)

### Community 153 - "pglite-lock.ts"
Cohesion: 0.14
Nodes (19): CreatedDirectory, Held, PgliteLockUse, Job, acquirePgliteLock(), directoryPath(), lockHeld(), openFailed() (+11 more)

### Community 154 - "transcripts.ts"
Cohesion: 0.14
Nodes (18): Program, V9Raw, LoadAdapter, bytesOfHex(), decode(), decoded(), freeGot(), literalAt() (+10 more)

### Community 156 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.09
Nodes (19): MainProcess, 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout, 2. Architecture (+11 more)

### Community 158 - ".concat"
Cohesion: 0.12
Nodes (12): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+4 more)

### Community 16 - "admin-harness.ts"
Cohesion: 0.03
Nodes (99): FromAdmin, AdminServer, AdminStartOptions, AdminRun, AdminRunOptions, Answerer, Expected, gate (+91 more)

### Community 160 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 161 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 163 - "core-block-fetch/metadata.ts"
Cohesion: 0.29
Nodes (14): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 164 - "version-table.ts"
Cohesion: 0.18
Nodes (20): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+12 more)

### Community 165 - "lockstep-refusals.test.ts"
Cohesion: 0.22
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+10 more)

### Community 17 - "column-rules.ts"
Cohesion: 0.02
Nodes (101): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+93 more)

### Community 173 - "ledger-table-config.test.ts"
Cohesion: 0.27
Nodes (16): Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts(), haltOf() (+8 more)

### Community 174 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 179 - "placement.ts"
Cohesion: 0.20
Nodes (14): MetadataVariant, RuntimeMetadataView, RecordTypes, ScaleValue, callVariant(), carried(), is(), placeTransactions() (+6 more)

### Community 18 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (72): CheckedMigration, ModuleContentsError, ModuleTable, PageOptions, ConsistentRead, PlacedRefusal, Refusal, RefusalCode (+64 more)

### Community 180 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 181 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 182 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 184 - "postgres-tls-server.ts"
Cohesion: 0.20
Nodes (10): SslMode, driverConnectionOptions, PostgresConnection, TlsPostgres, makeCertificates(), startTlsPostgres(), noHeight(), readError() (+2 more)

### Community 186 - "core-block-fetch.test.ts"
Cohesion: 0.14
Nodes (5): LedgerTable, coreBlockFetchOnFetch(), isBlockItemSource(), blockContext(), KNOWN_NETWORKS

### Community 187 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 188 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 19 - "db/api.ts"
Cohesion: 0.03
Nodes (76): BlockWriteHandle, Database, ReadOnlyDatabase, SchemaWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable (+68 more)

### Community 192 - "extrinsics.ts"
Cohesion: 0.20
Nodes (12): ExtrinsicCall, MetadataPallet, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), decodeExtrinsics(), isCompactU64() (+4 more)

### Community 193 - "Session"
Cohesion: 0.21
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 194 - "readiness.test.ts"
Cohesion: 0.23
Nodes (10): Decision, ae4(), caseText(), readinessProblems(), observedProblems(), ready(), readyWhen(), NOT_READY (+2 more)

### Community 196 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 197 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 198 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 2 - "UmbraError"
Cohesion: 0.03
Nodes (136): LoadedConfig, LoadOptions, PostgresConnection, PostgresOptions, Transaction, ReadTimeoutSetting, AppliedRow, MigrationPart (+128 more)

### Community 20 - "NodeBlockSource"
Cohesion: 0.04
Nodes (43): BlockEventSource, BlockLedgerSource, HeadWait, NodeBlockSource, Prefetch, QueuedBlock, NodeCallOptions, NodeSubscription (+35 more)

### Community 204 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 207 - "stats-module.ts"
Cohesion: 0.32
Nodes (10): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+2 more)

### Community 21 - "client.test.ts"
Cohesion: 0.03
Nodes (53): NodeClientOptions, NodeSocketEvents, HandSocket, HandSockets, Answer, FakeNode, Handler, Received (+45 more)

### Community 211 - "childRefKeys"
Cohesion: 0.38
Nodes (3): ChildReader, childRefKeys(), readChildren()

### Community 218 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 219 - "component-table.test.ts"
Cohesion: 0.18
Nodes (7): DesignTable, RowCoverage, typeScriptFiles(), OPENERS, ROWS, SUITE, REPOSITORY

### Community 22 - "runner/process.ts"
Cohesion: 0.04
Nodes (78): ConfigFacts, OpenedConfig, Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, CoreChainBinding (+70 more)

### Community 220 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 23 - "core-transport.ts"
Cohesion: 0.03
Nodes (77): Session, TransportLimits, TransportTls, Committed, Hello, HelloAck, JsonValue, MessageFault (+69 more)

### Community 230 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 233 - "checkParent"
Cohesion: 0.31
Nodes (8): AlwaysLanded, checkParent(), sameBytes(), hashAt(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 24 - "builder.test.ts"
Cohesion: 0.03
Nodes (46): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step, Frame (+38 more)

### Community 242 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 243 - "block-context.ts"
Cohesion: 0.29
Nodes (5): LateUse, revisionAt(), h(), P, Q

### Community 244 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 25 - ".from"
Cohesion: 0.03
Nodes (84): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+76 more)

### Community 254 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "ref_node_fs"
Cohesion: 0.06
Nodes (65): BackupBackend, BackupDatabase, killedRestore, TickerConfig, WORKER, SignalEvent, cliProject, ProcessObservation (+57 more)

### Community 27 - "FinalizedLoop"
Cohesion: 0.04
Nodes (25): Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, Startup, SkipsAfterReconnect, SkipsUnseen (+17 more)

### Community 28 - "ledger-storage.test.ts"
Cohesion: 0.05
Nodes (83): Restored, LedgerEvent, TransactionResult, ledgerItemsSeen, Call, SeenLoad, RestartEvent, RestartJob (+75 more)

### Community 29 - "validate.ts"
Cohesion: 0.04
Nodes (80): coreEntry, HistoryFinding, ConfigRule, CursorRule, EntryRef, Finding, Issue, Plain (+72 more)

### Community 3 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (131): EntryRange, GraphInput, InMemoryBlockSource, LockstepWait, Flaky, PastFaultCase, RefusalCase, Contexts (+123 more)

### Community 30 - "LedgerPackage"
Cohesion: 0.05
Nodes (42): LedgerEventKind, LedgerPackage, LedgerTaskBlock, NodeStore, StateHandle, LedgerEngine, LedgerTaskFailed, Settled (+34 more)

### Community 31 - "builds.ts"
Cohesion: 0.05
Nodes (69): PrivateProcess, PrivateRefusal, PrivateSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation (+61 more)

### Community 32 - "vitest"
Cohesion: 0.05
Nodes (51): AdminStarter, DatabaseParts, PglitePathParts, PostgresPartsInput, A168RunOptions, PrivateBackend, SessionSeen, PublicCore (+43 more)

### Community 33 - "core-config.test.ts"
Cohesion: 0.05
Nodes (61): adminRoutes, AdminChannel, AdminServeOptions, ToAdmin, AdminAnswer, AdminEndpoint, AdminPart, AdminSnapshot (+53 more)

### Community 34 - "range.ts"
Cohesion: 0.04
Nodes (63): ConnectSocket, Outage, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, BoundaryBlockReading (+55 more)

### Community 35 - "ModuleDeclaration"
Cohesion: 0.05
Nodes (49): OpenedFacts, ModuleDeclaration, ProcessContext, Revision, ResolvedGraph, StartedModuleApi, LoopInput, ModuleApi (+41 more)

### Community 36 - "config-check.ts"
Cohesion: 0.04
Nodes (66): RestoreSeams, BackupCommandOptions, BackupOutcome, CheckFinding, CheckState, CheckStep, ConfigCheckSeams, StepName (+58 more)

### Community 37 - "process-admin.ts"
Cohesion: 0.06
Nodes (71): AllowedDetail, PrivateSideFacts, ProcessAdminOptions, RevisionSettings, DigestRow, ModuleFacts, NodeFacts, PartTable (+63 more)

### Community 38 - "cli/command.ts"
Cohesion: 0.04
Nodes (56): CommandHandler, CommandIo, ConfigCheckReport, CommandResult, CheckTarget, statsConfig, backupArguments(), backupCommand() (+48 more)

### Community 39 - ".read"
Cohesion: 0.05
Nodes (64): SchemaPlan, Chain, ChainOptions, DigestRow, identityRow(), captured(), captureFunction(), hex() (+56 more)

### Community 4 - "host.ts"
Cohesion: 0.03
Nodes (106): LoadLedger, TransactionParser, LedgerName, ChainOutcome, LedgerPackageOptions, LedgerTask, ParsedTransaction, AppliedState (+98 more)

### Community 40 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (61): TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses() (+53 more)

### Community 41 - "pause-fixtures.ts"
Cohesion: 0.06
Nodes (52): BackupOnSignal, LoopClass, Pausable, PausableConfig, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop (+44 more)

### Community 42 - "Process"
Cohesion: 0.07
Nodes (14): ProcessAdmin, CoreTransport, transportReaderFacts, PauseHold, Process, SignalTarget, recordedHistory(), openedCursorHeight() (+6 more)

### Community 45 - "backup/backup.ts"
Cohesion: 0.07
Nodes (56): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+48 more)

### Community 46 - "refused-configuration.test.ts"
Cohesion: 0.06
Nodes (54): ProcessConfig, Answered, Start, Refusal, Start, runArguments(), runProcessCommand(), startProcess() (+46 more)

### Community 47 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (54): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers (+46 more)

### Community 48 - "order.property.test.ts"
Cohesion: 0.05
Nodes (49): PointName, PointRun, HeightFailure, Misuse, SlowBlockCondition, CallEvent, Recorder, EagerItems (+41 more)

### Community 49 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (42): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+34 more)

### Community 5 - "node-fields-harness.ts"
Cohesion: 0.03
Nodes (130): ProcessCondition, A168Observation, A168Phase, Expected, GatedConnector, StatusReader, ArgType, BlockOptions (+122 more)

### Community 50 - "ref_node_timers"
Cohesion: 0.06
Nodes (42): Message, MessageType, Ended, rawClient, Escape, publicState, Refused, hexOf() (+34 more)

### Community 51 - "loop-stop-harness.ts"
Cohesion: 0.08
Nodes (45): watched, A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation (+37 more)

### Community 52 - "validation.ts"
Cohesion: 0.04
Nodes (55): LedgerTableSettings, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, PlacedDeclaration, Plain, Absent, DeepReadonly (+47 more)

### Community 53 - "entries.ts"
Cohesion: 0.04
Nodes (50): BrowserConfiguration, PrivateInstance, ProcessConfiguration, DatabasePartsInput, PgliteMemoryParts, TransportReader, CoreEntryInput, CoreSettingsBase (+42 more)

### Community 54 - "loop.ts"
Cohesion: 0.07
Nodes (48): HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments, PointSchedule (+40 more)

### Community 55 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (50): BlockItemSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+42 more)

### Community 56 - "net.test.ts"
Cohesion: 0.06
Nodes (27): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortSocket (+19 more)

### Community 58 - "change-capture.ts"
Cohesion: 0.08
Nodes (41): TableDigest, TableDigestRow, CapturedTable, CaptureState, GuardTableRow, optOut, capturedOf(), digestBlock() (+33 more)

### Community 59 - "src/db/postgres.ts"
Cohesion: 0.07
Nodes (43): BenchEnv, DurabilityProbeOptions, DurabilityViolation, ProbeSession, Outcome, DriverError, Outcome, PostgresOptions (+35 more)

### Community 6 - "api-server.test.ts"
Cohesion: 0.02
Nodes (111): ModuleApiServer, ModuleApiStart, StartedModuleApi, ApiRegistry, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions (+103 more)

### Community 60 - "replay-check.ts"
Cohesion: 0.07
Nodes (40): Link, TapeBuilder, TapeBuilderOptions, Arguments, Command, TapeCommandIo, RecordingError, SessionEnd (+32 more)

### Community 61 - "writer-lock-checks.ts"
Cohesion: 0.08
Nodes (42): WriterProcess, WorkerEvent, PauseReport, blocksIn(), cleanUp(), firstOf(), startWriterProcess(), workDirectory() (+34 more)

### Community 62 - "openPostgres"
Cohesion: 0.07
Nodes (31): PostgresParts, Snapshot, Phase, PostgresTestDatabase, PostgresTestServer, Job, openPgliteOn(), openPostgres() (+23 more)

### Community 64 - "transform-checks.ts"
Cohesion: 0.10
Nodes (34): TransformError, NotificationRange, baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape(), expectVariantOutput(), forkRecords() (+26 more)

### Community 65 - "chain-process.test.ts"
Cohesion: 0.06
Nodes (39): Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+31 more)

### Community 66 - "contract-data-checks.ts"
Cohesion: 0.09
Nodes (48): CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx (+40 more)

### Community 67 - "graph.ts"
Cohesion: 0.07
Nodes (49): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+41 more)

### Community 68 - "backup/restore.ts"
Cohesion: 0.08
Nodes (35): PublicIdentity, Checked, PublicSide, RestoreChain, RestoreInput, RestoreTarget, BackupText, createReadStream() (+27 more)

### Community 69 - "binding.test.ts"
Cohesion: 0.08
Nodes (39): a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome (+31 more)

### Community 7 - "cbor.ts"
Cohesion: 0.03
Nodes (126): CaptureColumn, CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode (+118 more)

### Community 70 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 71 - "core-ledger-state/sql.ts"
Cohesion: 0.09
Nodes (41): StateRow, StoredState, GreyView, SweepPhase, writeBlock(), addRootCounts(), allGreyKeys(), bytesOf() (+33 more)

### Community 72 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (32): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+24 more)

### Community 73 - "12. Exported surface and command (LS-1, LS-6)"
Cohesion: 0.07
Nodes (37): OwnPart, FieldKind, FieldSchema, ItemDeclaration, Lifetime, Case, ShapeCase, Stats (+29 more)

### Community 74 - "browser/build.ts"
Cohesion: 0.06
Nodes (33): BrowserBuildOptions, BrowserControl, checkedLedgers, TypeCheckFinding, TypeCheckResult, browserLedgerEntry(), browserPlugin(), buildBrowser() (+25 more)

### Community 75 - "public-database.ts"
Cohesion: 0.07
Nodes (36): ConfiguredDatabase, ConfiguredDatabaseOptions, BlockRow, PublicSide, PublicSideOptions, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions (+28 more)

### Community 76 - "in-memory-source.ts"
Cohesion: 0.07
Nodes (32): InMemoryItems, InMemorySourceOptions, Wait, RestoreJob, CrashCall, CrashEvent, CrashOptions, CrashObservation (+24 more)

### Community 77 - "transaction-history-storage.property.test.ts"
Cohesion: 0.07
Nodes (22): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, ReplayableStorage, capitalize(), abortErrorLike(), capitalize(), applyCommand(), replay() (+14 more)

### Community 78 - "checkShape"
Cohesion: 0.07
Nodes (35): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+27 more)

### Community 8 - "process-backends.ts"
Cohesion: 0.04
Nodes (110): CoreLedgerStateOptions, GreyPicker, itemsSeen, Scenario, FixtureRun, FixtureRunOptions, ingest, SourceClass (+102 more)

### Community 80 - "ReadHandle"
Cohesion: 0.06
Nodes (21): ReadHandle, PointCallbacks, BlockFails, Height, Accepts, Rest, WithKnownPoints, WithUnknownPoint (+13 more)

### Community 83 - "api-timeouts.test.ts"
Cohesion: 0.08
Nodes (23): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, Seen, pgliteBackend() (+15 more)

### Community 84 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (32): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, copyArray(), copyObject() (+24 more)

### Community 86 - "events-fixtures.ts"
Cohesion: 0.12
Nodes (32): eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, LedgerScenarioOptions (+24 more)

### Community 87 - "pglite.ts"
Cohesion: 0.10
Nodes (20): ReadOptions, MultiStatementRunner, Job, JobQueue, PgliteDatabase, ServerErrorFields, handleClosed(), statementRefused() (+12 more)

### Community 89 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 9 - "config/history.ts"
Cohesion: 0.03
Nodes (118): CoreVersion, CoreSettings, versionEntry, HistoryCheck, HistoryCode, HistoryContext, HistoryRule, ProvidesRow (+110 more)

### Community 91 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 92 - "cli/run.ts"
Cohesion: 0.07
Nodes (30): backupSignalRelay, RunOptions, SignalSource, stopSignal, BackupSignals, TickerOptions, PausableOptions, SignalJob (+22 more)

### Community 93 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (28): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+20 more)

### Community 95 - "pack-install.mjs"
Cohesion: 0.09
Nodes (35): Surface, SmokeFailure, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12() (+27 more)

### Community 96 - "networks.ts"
Cohesion: 0.06
Nodes (36): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+28 more)

### Community 97 - "private/lockstep-wait.test.ts"
Cohesion: 0.08
Nodes (21): Report, ExpectedWait, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, a117Problems(), firstWait() (+13 more)

### Community 98 - "paused-harness.ts"
Cohesion: 0.11
Nodes (32): ProcessHandle, A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running (+24 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+26 more)

### Community 152 - ".connected"
Cohesion: 0.09
Nodes (21): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The node on `/status`, The transport reader, TLS to PostgreSQL: `ssl` (+13 more)

### Community 63 - "version"
Cohesion: 0.05
Nodes (48): side(), migrations(), version(), 1. Overview, Appendix A. Reference, Requirement: MD-1 A module is a declaration the host imports, Scenario: A declaration with an unknown point name, 4. `load` — full verification, no exceptions (+40 more)

### Community 104 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 115 - ".slowBlockMs"
Cohesion: 0.07
Nodes (28): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+20 more)

### Community 126 - "transportReader"
Cohesion: 0.08
Nodes (26): text(), transportReader(), transportReaderRule(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 4. Configuration (+18 more)

### Community 147 - "UmbraDB module guide"
Cohesion: 0.08
Nodes (26): hexBytes(), params(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations (+18 more)

### Community 157 - "T"
Cohesion: 0.09
Nodes (22): T(), input(), 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible) (+14 more)

### Community 159 - "backupAtStop"
Cohesion: 0.09
Nodes (20): backupAtStop(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds, Writing a backup, 15. Backups and browser (+12 more)

### Community 172 - "mapping.test.ts"
Cohesion: 0.16
Nodes (6): mapRows(), mapValue(), identity(), RESULT_COLUMNS, RESULT_TYPES, RFC-3339

### Community 185 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 195 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 202 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 214 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 231 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 237 - "node-bridge.test.ts"
Cohesion: 0.28
Nodes (8): decodeNodes(), encodeNodes(), answering(), key(), node(), query(), BRIDGE_LAYOUT, NODES_SQL

### Community 238 - "test-processes.test.ts"
Cohesion: 0.28
Nodes (7): namesRunner(), runnerStarts(), sources(), valueNames(), REPOSITORY, RUNNER, TESTS

### Community 259 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 314 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 43 - ".put"
Cohesion: 0.03
Nodes (60): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+52 more)

### Community 44 - "history"
Cohesion: 0.04
Nodes (62): history(), n(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+54 more)

### Community 57 - "code"
Cohesion: 0.04
Nodes (55): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+47 more)

### Community 85 - "refused"
Cohesion: 0.07
Nodes (40): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 17. Trying a module against another node (+32 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 102 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 114 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.06
Nodes (27): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+19 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 130 - "package.json"
Cohesion: 0.07
Nodes (29): bin, umbradb, bugs, url, description, optional, engines, node (+21 more)

### Community 136 - "README.md"
Cohesion: 0.08
Nodes (19): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs, Choosing a database (+11 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 143 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 155 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 162 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 170 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (18): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+10 more)

### Community 171 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 175 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker (+8 more)

### Community 178 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 183 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 189 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 190 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 191 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 199 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 200 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 201 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 203 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 206 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 208 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 209 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 210 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 5. Full-sync soak + load-under-concurrent-prune (G10), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring (+3 more)

### Community 212 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 213 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 215 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 216 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 217 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 221 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 222 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 223 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 224 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 225 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-4 Every field is data, operational or secret, Scenario: A function in the configuration, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: A user module from the configuration file, Scenario: Two `core` revisions with different databases (+1 more)

### Community 226 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 227 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 228 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 229 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 232 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 234 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 235 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 236 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 239 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 240 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 241 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 245 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 246 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 247 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 248 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 249 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 250 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 251 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 252 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 253 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 255 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 257 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 258 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 260 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 261 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 262 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 263 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 264 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 265 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 266 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 267 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 268 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 269 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 270 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 271 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 272 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 273 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 274 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 275 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 276 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 277 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 278 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 279 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 280 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 281 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 282 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 283 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 284 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 285 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 286 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 287 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 288 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 289 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 290 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 291 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 292 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 293 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 294 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 295 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 296 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 297 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 298 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 299 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 300 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 303 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 304 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 305 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 306 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 307 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 308 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 309 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 310 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 311 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 312 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 318 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 79 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped (+32 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8259`, `RFC-3339` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3835 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `declaration.ts`, `adapter-fixtures.ts`, `UmbraError`, `InMemoryBlockSource`, `host.ts`, `node-fields-harness.ts`, `api-server.test.ts`, `cbor.ts`, `process-backends.ts`, `config/history.ts`, `tape/index.ts`, `ref_node_url`, `core-private-source.test.ts`, `process-build.ts`, `browser.test.ts`, `NodeClient`, `admin-harness.ts`, `column-rules.ts`, `opt-out.test.ts`, `db/api.ts`, `NodeBlockSource`, `client.test.ts`, `runner/process.ts`, `core-transport.ts`, `builder.test.ts`, `.from`, `ref_node_fs`, `ledger-storage.test.ts`, `validate.ts`, `builds.ts`, `core-config.test.ts`, `range.ts`, `ModuleDeclaration`, `config-check.ts`, `process-admin.ts`, `cli/command.ts`, `.read`, `ledger/ledger-tasks.test.ts`, `pause-fixtures.ts`, `backup/backup.ts`, `refused-configuration.test.ts`, `order.property.test.ts`, `interfaces/transaction-history-storage.ts`, `ref_node_timers`, `loop-stop-harness.ts`, `validation.ts`, `entries.ts`, `loop.ts`, `slow-block-harness.ts`, `net.test.ts`, `src/db/postgres.ts`, `writer-lock-checks.ts`, `openPostgres`, `transform-checks.ts`, `chain-process.test.ts`, `contract-data-checks.ts`, `backup/restore.ts`, `binding.test.ts`, `retirement.test.ts`, `core-ledger-state/sql.ts`, `file-mode.test.ts`, `12. Exported surface and command (LS-1, LS-6)`, `browser/build.ts`, `public-database.ts`, `in-memory-source.ts`, `transaction-history-storage.property.test.ts`, `ReadHandle`, `api-timeouts.test.ts`, `config/plain-data.ts`, `cold-boot-recovery.integration.test.ts`, `real-tapes.ts`, `cli/run.ts`, `test/postgres/setup.ts`, `pack-install.mjs`, `networks.ts`, `private/lockstep-wait.test.ts`, `paused-harness.ts`, `node-format.ts`, `example-checks.ts`, `boundary.test.ts`, `release-version.ts`, `conformance-gate.mjs`, `redact.ts`, `process-worker.ts`, `code-registry.ts`, `core-block-commit.test.ts`, `deterministic-postgresql/index.ts`, `ledger-sweep.test.ts`, `checks.test.ts`, `src/ledger/identity.ts`, `documents.ts`, `pg-tx-history-adapter.ts`, `package.json`, `Lockstep`, `read-gate.ts`, `version-checks.ts`, `vendored-ledger-v9.test.ts`, `describeNodeStoreExports`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `restore-private.ts`, `failures.ts`, `chain-events-decode.test.ts`, `height-versioned.property.test.ts`, `block-fetch-decode.test.ts`, `harness.ts`, `lockstep-refusals.test.ts`, `excluded-not-exported.test.ts`, `mapping.test.ts`, `ledger-table-config.test.ts`, `LoopPauses`, `ws-mutual-tls.test.ts`, `statementsOf`, `postgres-tls-server.ts`, `mutation-per-adapter.mjs`, `core-block-fetch.test.ts`, `web-lock.ts`, `readiness.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `component-table.test.ts`, `postgres-image.test.ts`, `node-bridge.test.ts`, `test-processes.test.ts`, `block-context.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 19 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020744788504351346 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `declaration.ts`, `InMemoryBlockSource`, `host.ts`, `node-fields-harness.ts`, `api-server.test.ts`, `cbor.ts`, `process-backends.ts`, `config/history.ts`, `tape/index.ts`, `core-private-source.test.ts`, `process-build.ts`, `browser.test.ts`, `NodeClient`, `admin-harness.ts`, `opt-out.test.ts`, `db/api.ts`, `NodeBlockSource`, `client.test.ts`, `runner/process.ts`, `core-transport.ts`, `ref_node_fs`, `FinalizedLoop`, `validate.ts`, `LedgerPackage`, `builds.ts`, `range.ts`, `ModuleDeclaration`, `config-check.ts`, `process-admin.ts`, `ledger/ledger-tasks.test.ts`, `pause-fixtures.ts`, `Process`, `backup/backup.ts`, `refused-configuration.test.ts`, `ref_node_timers`, `validation.ts`, `loop.ts`, `slow-block-harness.ts`, `change-capture.ts`, `src/db/postgres.ts`, `replay-check.ts`, `writer-lock-checks.ts`, `openPostgres`, `transform-checks.ts`, `chain-process.test.ts`, `graph.ts`, `backup/restore.ts`, `binding.test.ts`, `12. Exported surface and command (LS-1, LS-6)`, `public-database.ts`, `checkShape`, `ReadHandle`, `api-timeouts.test.ts`, `config/plain-data.ts`, `pglite.ts`, `process-worker.ts`, `core-block-commit.test.ts`, `deterministic-postgresql/index.ts`, `checks.test.ts`, `src/ledger/identity.ts`, `Buffer`, `mapping.ts`, `BlockRef`, `version-checks.ts`, `Writer`, `items.ts`, `failures.ts`, `pglite-lock.ts`, `backupAtStop`, `version-table.ts`, `lockstep-refusals.test.ts`, `mapping.test.ts`, `ledger-table-config.test.ts`, `statementsOf`, `postgres-tls-server.ts`, `web-lock.ts`, `Session`, `readiness.test.ts`, `checkParent`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `adapter-fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.027522935779816515 - nodes in this community are weakly interconnected._