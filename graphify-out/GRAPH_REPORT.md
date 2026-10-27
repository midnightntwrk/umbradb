# Graph Report - UmbraDB

## Corpus Check
- 969 files · ~1,430,230 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10308 nodes · 29693 edges · 343 communities (306 shown, 37 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2397 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `5d5d62a8034d1f1b` (969 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- chain-placement.test.ts
- admin-harness.ts
- tape/index.ts
- shims.test.ts
- interfaces/transaction-history-storage.ts
- binding.test.ts
- .concat
- code-registry.ts
- mapping.ts
- entries.ts
- TapeRecord
- browser/build.ts
- pg-tx-history-adapter.ts
- ref_node_url
- ws-mutual-tls.test.ts
- checks.test.ts
- config-hash-checks.ts
- fixtures/configuration.ts
- module-tables.ts
- TransactionHistoryEntry
- Registry
- core-chain-events.ts
- browser.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- redact.ts
- runner/process.ts
- 5.1 Layer A: per-key temporal history
- ProcessContexts
- src/db/postgres.ts
- block-fetch-decode.test.ts
- version-table.ts
- lockstep-refusals.test.ts
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- Database
- browser-harness.ts
- package-identity.test.ts
- ledger-checks.ts
- PortSocket
- refused-configuration.test.ts
- core-block-fetch/metadata.ts
- validation.ts
- order.property.test.ts
- validation.test.ts
- statementsOf
- sha256
- 3. Proof-blocking findings
- checkShape
- chrome.ts
- loop.ts
- no-indexer-or-wallet-sdk.test.ts
- web-lock.ts
- ChromeTab
- read-height.property.test.ts
- node-format.ts
- RuntimeMetadata
- transport-intake.test.ts
- private/lockstep-wait.test.ts
- worker-threads-worker.ts
- buffer.ts
- Worker
- chain-process.test.ts
- vitest
- .from
- attempt
- host.ts
- stats.ts
- process-admin.ts
- extrinsics.ts
- .name
- worker-threads.test.ts
- LedgerPackage
- a114Run
- spawnChild
- mutation-evidence.d.mts
- terminationSignal
- NetworkBroker
- AsyncLocalStorage
- loop.test.ts
- ref_node_fs
- typed-config.test.ts
- worker-threads-host.ts
- FinalizedLoop
- core-ledger-state.ts
- EventsRunner
- exitWithin
- migrate.ts
- core-private-source.ts
- node-run.ts
- ledger/types.ts
- https.ts
- NodeFS
- contract-data-checks.ts
- range.ts
- contract-modules.test.ts
- backup/restore.ts
- history
- config-check.ts
- private/backends.ts
- column-rules.ts
- client.test.ts
- history.test.ts
- builds.ts
- declaration.ts
- loop-harness.ts
- PgTransactionHistoryStorage
- ledger-storage.test.ts
- cli/command.ts
- column-rules.test.ts
- ledger-sweep.test.ts
- api-server.test.ts
- boundary.test.ts
- NodeBlockSource
- config/history.ts
- zero-timeouts-checks.ts
- ledger-storage-checks.ts
- validate.ts
- core-block-commit.test.ts
- transform-checks.ts
- private-transport.ts
- UmbraError
- graph.ts
- core-transport.ts
- cbor.ts
- slow-block-harness.ts
- run.test.ts
- core-settings.ts
- transport-faults.test.ts
- version-checks.ts
- adapter-fixtures.ts
- plain-data.ts
- PointName
- retirement.test.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- test/postgres/setup.ts
- validate.test.ts
- real-tapes.ts
- NodeClient
- networks.ts
- cbor.property.test.ts
- process-context.test.ts
- cold-boot-recovery.integration.test.ts
- graph.test.ts
- ReadHandle
- messages.ts
- net.test.ts
- Process
- core-tx-results.ts
- .value
- postgres/transaction-history-storage.ts
- sweep-tapes.ts
- 4. Schema design
- UmbraDB 1.0.0 Release Contracts
- ADDED Requirements
- core-block-parsed.ts
- 2. Points
- decode
- migrations
- .boolean
- UmbraDB module guide
- T
- mutation-per-adapter.mjs
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- twox.ts
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- pack-install.mjs
- .slowBlockMs
- path.ts
- Performance — design
- orphan-watcher.mjs
- Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data
- fresh-instance.mjs
- crash-worker.ts
- leanProblems
- 9.2 Browser build (BR)
- code
- fn
- version
- core-private-source.test.ts
- .put
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- Algebraic Specification of the midnight-pg-store Storage Layer
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- Full-Chain Storage — Design
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- Design — Sprint 4: Watermarks
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB
- stryker.conf.json
- Storage Layer Interface Specification
- chain_archive lineage
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Security policy & threat model
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — Sprint 2: Transaction/Lease
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Full-Chain Storage
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Scalability ceilings (v1.0.0)
- Contributing
- Checkpoint-store composition contract — cursor ordering and replay
- Storage Algebra Lean M3a Watermarks Sprint
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- Backups
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 2: Transaction/Lease
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- bug-report.md
- feature-request.md
- Tasks — Sprint 1: project setup + TemporalKV
- GC architecture and query-tracing: research findings
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
- Environment changelog
- start-stack.sh
- Requirement: RN-3 Callbacks within a point run in a fixed order
- Requirement: RN-5 The block context carries one height's items
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
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 296 edges
2. `UmbraError` - 293 edges
3. `ModuleDeclaration` - 160 edges
4. `FinalizedLoop` - 112 edges
5. `InMemoryBlockSource` - 100 edges
6. `NodeClient` - 99 edges
7. `Database` - 95 edges
8. `BlockRef` - 87 edges
9. `ReadHandle` - 84 edges
10. `NodeBlockSource` - 72 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?` --references--> `Buffer`  [INFERRED]
  docs/research/a1-unbounded-bytea-insert.md → browser/src/shims/buffer.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (343 total, 37 thin omitted)

### Community 0 - "chain-placement.test.ts"
Cohesion: 0.03
Nodes (183): BlockParsed, ProcessCondition, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec (+175 more)

### Community 1 - "admin-harness.ts"
Cohesion: 0.02
Nodes (152): openedProcess, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions (+144 more)

### Community 10 - "tape/index.ts"
Cohesion: 0.04
Nodes (81): Failure, Variant, Failure, Variant, RecordingProblem, TapeError, TapeProblem, TransformProblem (+73 more)

### Community 101 - "shims.test.ts"
Cohesion: 0.09
Nodes (24): PageState, ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker (+16 more)

### Community 102 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.07
Nodes (22): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+14 more)

### Community 103 - "binding.test.ts"
Cohesion: 0.10
Nodes (25): TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), a113Problems() (+17 more)

### Community 104 - ".concat"
Cohesion: 0.08
Nodes (20): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+12 more)

### Community 105 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 107 - "mapping.ts"
Cohesion: 0.11
Nodes (28): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+20 more)

### Community 109 - "entries.ts"
Cohesion: 0.07
Nodes (28): CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+20 more)

### Community 11 - "TapeRecord"
Cohesion: 0.03
Nodes (59): ManualTimers, ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata (+51 more)

### Community 110 - "browser/build.ts"
Cohesion: 0.09
Nodes (23): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+15 more)

### Community 111 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 112 - "ref_node_url"
Cohesion: 0.07
Nodes (23): RepositoryFile, Upstream, canPin(), pinViolations(), repositoryFiles(), filesUnder(), patchesOf(), patchText() (+15 more)

### Community 115 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (21): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+13 more)

### Community 117 - "checks.test.ts"
Cohesion: 0.10
Nodes (21): CheckFunctionsOptions, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName(), integerCheckStatements() (+13 more)

### Community 118 - "config-hash-checks.ts"
Cohesion: 0.11
Nodes (18): Report, A162Options, a162Run, HeaderSeen, ReportRelay, RetargetProxy, a162Problems(), asLogin() (+10 more)

### Community 119 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (20): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, core(), databaseOf(), withDevelopmentOptIn(), defineConfig() (+12 more)

### Community 12 - "module-tables.ts"
Cohesion: 0.04
Nodes (84): CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions (+76 more)

### Community 120 - "TransactionHistoryEntry"
Cohesion: 0.13
Nodes (9): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+1 more)

### Community 121 - "Registry"
Cohesion: 0.16
Nodes (17): NodeCallOptions, RecordingClient, Field, Registry, metadataWith(), open(), quiet(), metadataV14() (+9 more)

### Community 122 - "core-chain-events.ts"
Cohesion: 0.11
Nodes (24): RuntimeMetadataView, bindCoreChainEvents(), boundEventSource(), chainEventsItemOf(), chainEventsOf(), coreChainEventsOnFetch(), metadataView(), runtimeMetadataOf() (+16 more)

### Community 123 - "browser.test.ts"
Cohesion: 0.11
Nodes (25): Reachable, PageEvent, StatusBody, midChainProblems(), networkProblems(), plain(), resumeProblems(), sameHashProblems() (+17 more)

### Community 124 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 125 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 127 - "redact.ts"
Cohesion: 0.13
Nodes (19): RedactionForms, SecretForm, TextPattern, Needs, findings(), credentialsIn(), decoded(), kindOf() (+11 more)

### Community 13 - "runner/process.ts"
Cohesion: 0.03
Nodes (90): ConfigFacts, OpenedConfig, OpenedFacts, ProcessAdminOptions, AdminStarter, EntryView, Bound, ChainCheckInput (+82 more)

### Community 136 - "5.1 Layer A: per-key temporal history"
Cohesion: 0.08
Nodes (23): Key, Version, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap (+15 more)

### Community 138 - "ProcessContexts"
Cohesion: 0.12
Nodes (4): ProcessContexts, ProcessItems, providesProcessItem(), sealed()

### Community 14 - "src/db/postgres.ts"
Cohesion: 0.04
Nodes (88): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, DriverError, Outcome, PostgresOptions, Role (+80 more)

### Community 140 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 145 - "version-table.ts"
Cohesion: 0.18
Nodes (20): LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable() (+12 more)

### Community 146 - "lockstep-refusals.test.ts"
Cohesion: 0.20
Nodes (19): LockstepCondition, A118Observation, MismatchObservation, WaitSample, hexOf(), a118Problems(), a118Run(), coreOn() (+11 more)

### Community 147 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 148 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 15 - "Database"
Cohesion: 0.04
Nodes (97): Database, CaptureColumn, CapturedTable, CaptureState, SchemaPlan, ChangeKind, tableChanges, TouchedRow (+89 more)

### Community 150 - "browser-harness.ts"
Cohesion: 0.19
Nodes (15): BrowserBuild, pageBench, ProcessName, PageServer, call(), eventsOf(), eventWhen(), logOf() (+7 more)

### Community 154 - "package-identity.test.ts"
Cohesion: 0.19
Nodes (16): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+8 more)

### Community 155 - "ledger-checks.ts"
Cohesion: 0.24
Nodes (18): LedgerEvent, TransactionResult, VmLog, ledgerItemsSeen, a106Problems(), a107Problems(), a99Problems(), blockZeroProblems() (+10 more)

### Community 156 - "PortSocket"
Cohesion: 0.18
Nodes (7): PortSocket, pair(), 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix, Contract states and contract logs

### Community 16 - "refused-configuration.test.ts"
Cohesion: 0.04
Nodes (86): ProcessConfig, ProcessHandle, Start, Refusal, Start, TickerProcess, instancesRun, ProcessBackend (+78 more)

### Community 161 - "core-block-fetch/metadata.ts"
Cohesion: 0.14
Nodes (15): MetadataField, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, canonicalJson(), hexOf(), littleEndian() (+7 more)

### Community 162 - "validation.ts"
Cohesion: 0.11
Nodes (17): PlacedDeclaration, Plain, badId, DECLARATION_PROPERTIES, duplicateId, fieldNoKind, ITEM_PROPERTIES, itemNoLifetime (+9 more)

### Community 17 - "order.property.test.ts"
Cohesion: 0.04
Nodes (85): ResolvedRange, Callback, EntryBoundary, ParallelPoint, PointArguments, PointRun, PointSchedule, AppendsVersion (+77 more)

### Community 170 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 173 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 174 - "sha256"
Cohesion: 0.20
Nodes (7): Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 175 - "3. Proof-blocking findings"
Cohesion: 0.13
Nodes (15): Absent, n(), 1. TemporalKV — event-sourced right action with a CAS guard, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant (+7 more)

### Community 178 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 179 - "chrome.ts"
Cohesion: 0.23
Nodes (10): Cdp, CdpEvent, PageRequest, chrome(), chrome(), chromePath(), chromeVersion(), launchChrome() (+2 more)

### Community 18 - "loop.ts"
Cohesion: 0.03
Nodes (59): BlockHeaderItem, BlockEventSource, BodyExtrinsic, BlockBody, CoreBlockHeader, CoreBlockItems, QueuedBlock, BlockItems (+51 more)

### Community 180 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 181 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 187 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 19 - "node-format.ts"
Cohesion: 0.05
Nodes (59): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+51 more)

### Community 192 - "RuntimeMetadata"
Cohesion: 0.19
Nodes (4): RuntimeMetadata, OwnStateMetadata, hexOf(), walkOver()

### Community 193 - "transport-intake.test.ts"
Cohesion: 0.23
Nodes (4): PrivateSeen, A114Observation, A116Observation, TransportProxy

### Community 194 - "private/lockstep-wait.test.ts"
Cohesion: 0.31
Nodes (12): ExpectedWait, a117Problems(), firstWait(), lockstepCore(), loginOf(), rowsIn(), sampleWait(), shown() (+4 more)

### Community 196 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 197 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 2 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (139): BlockItemSource, HistoryOptions, InMemoryBlockSource, InMemoryItems, Wait, LoopEnd, LoopInput, ProcessingEnd (+131 more)

### Community 20 - "vitest"
Cohesion: 0.04
Nodes (45): ReadOnlyDatabase, ReadOptions, ReadTimeoutSetting, ErrorCode, ErrorDetails, ChainDataView, Case, Phase (+37 more)

### Community 21 - ".from"
Cohesion: 0.04
Nodes (71): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+63 more)

### Community 212 - "attempt"
Cohesion: 0.24
Nodes (9): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+1 more)

### Community 22 - "host.ts"
Cohesion: 0.05
Nodes (61): LoadLedger, TransactionParser, LedgerName, LedgerTask, NodeStore, ParsedTransaction, AppliedState, ApplyBlock (+53 more)

### Community 221 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 23 - "process-admin.ts"
Cohesion: 0.05
Nodes (68): AllowedDetail, PrivateSideFacts, ProcessAdmin, RevisionSettings, DigestRow, ModuleFacts, PartTable, PrivateInstanceFacts (+60 more)

### Community 231 - "extrinsics.ts"
Cohesion: 0.31
Nodes (7): ExtrinsicCall, MetadataPallet, blockTimeOf(), callOf(), callVariants(), isCompactU64(), TIMESTAMP

### Community 24 - "LedgerPackage"
Cohesion: 0.05
Nodes (41): RetainedState, LedgerEventKind, LedgerPackage, StateHandle, LedgerEngine, Settled, stagenetReplay, hexOf() (+33 more)

### Community 25 - "spawnChild"
Cohesion: 0.03
Nodes (63): BenchEnv, ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts (+55 more)

### Community 250 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 251 - "terminationSignal"
Cohesion: 0.33
Nodes (5): SignalTarget, terminationSignal(), heldPort(), startChild(), startWorker()

### Community 26 - "loop.test.ts"
Cohesion: 0.04
Nodes (59): LockstepWait, WaitingInRead, Faults, LostCommit, Outcomes, Seen, AtGate, WaitsInTransaction (+51 more)

### Community 27 - "ref_node_fs"
Cohesion: 0.08
Nodes (52): BackupBackend, BackupDatabase, killedRestore, TickerConfig, cliProject, Pem, withNodeRoot(), catalogOf() (+44 more)

### Community 271 - "typed-config.test.ts"
Cohesion: 0.33
Nodes (3): Finding, CONFIG, FIXTURES

### Community 274 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 28 - "FinalizedLoop"
Cohesion: 0.05
Nodes (19): Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, SkipsLockstep, SkipsUnseen, WaitsInTransaction (+11 more)

### Community 29 - "core-ledger-state.ts"
Cohesion: 0.04
Nodes (63): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, LedgerStateItem, retainedStates, CoreRevision, GreyPicker, ContractKeys (+55 more)

### Community 3 - "migrate.ts"
Cohesion: 0.02
Nodes (143): BackupInput, Transaction, AppliedRow, Runnable, Settling, StartupInput, MultiStatementRunner, Difference (+135 more)

### Community 30 - "core-private-source.ts"
Cohesion: 0.06
Nodes (49): ChainCheck, PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, SourceTransport, PublicConfiguration, PublicDatabase, PublicIdentity (+41 more)

### Community 309 - "node-run.ts"
Cohesion: 0.50
Nodes (3): NodeRunResult, hex(), PATIENCE_MS

### Community 31 - "ledger/types.ts"
Cohesion: 0.05
Nodes (59): LoadAdapter, AdapterSpec, LedgerRelease, LedgerReleasePackage, ApplyInput, ChainOutcome, LedgerPackageOptions, LogItem (+51 more)

### Community 32 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (65): ContractStateRow, CoreContractStatesOptions, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+57 more)

### Community 33 - "range.ts"
Cohesion: 0.05
Nodes (55): NodeSubscription, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command, TapeCommandIo, CompletenessRange (+47 more)

### Community 34 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (58): ContractLog, BlockTransaction, CoreContractLogsFastOptions, UnsureLog, FastLogReader, LogSite, Program, UnsureReason (+50 more)

### Community 35 - "backup/restore.ts"
Cohesion: 0.07
Nodes (64): BackupTarget, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool, Checked, Restored (+56 more)

### Community 36 - "history"
Cohesion: 0.04
Nodes (61): Buffer, history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+53 more)

### Community 37 - "config-check.ts"
Cohesion: 0.05
Nodes (53): CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, TypeCheckFinding, TypeCheckResult (+45 more)

### Community 38 - "private/backends.ts"
Cohesion: 0.06
Nodes (51): PrivateBackend, SessionSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A155Observation, Outcome (+43 more)

### Community 39 - "column-rules.ts"
Cohesion: 0.04
Nodes (67): CatalogColumn, CatalogOptions, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog (+59 more)

### Community 4 - "client.test.ts"
Cohesion: 0.02
Nodes (92): Connection, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, Answer (+84 more)

### Community 40 - "history.test.ts"
Cohesion: 0.05
Nodes (59): Simulation, Start, Case, graphInputOf(), resolveGraph(), startChain(), resolve(), builtWith100() (+51 more)

### Community 41 - "builds.ts"
Cohesion: 0.06
Nodes (46): privateIntake, CommandBuildOptions, RunOptions, SignalSource, stopSignal, PrivateOptions, PrivateProcess, PrivateRefusal (+38 more)

### Community 42 - "declaration.ts"
Cohesion: 0.06
Nodes (47): versionEntry, BlockContext, DefinedModule, FieldKind, FieldSchema, ItemSink, KnownPointsOnly, Lifetime (+39 more)

### Community 43 - "loop-harness.ts"
Cohesion: 0.05
Nodes (37): CheckTarget, CliBackend, Snapshot, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase (+29 more)

### Community 44 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (50): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order) (+42 more)

### Community 45 - "ledger-storage.test.ts"
Cohesion: 0.08
Nodes (44): BlockHeader, ingest, IngestOptions, SourceClass, watched, SeenLoad, RestartEvent, RestartJob (+36 more)

### Community 46 - "cli/command.ts"
Cohesion: 0.07
Nodes (46): BackupSeams, RestoreSeams, Environment, BackupCommandOptions, BackupOutcome, CommandHandler, CommandIo, MainProcess (+38 more)

### Community 47 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+24 more)

### Community 49 - "ledger-sweep.test.ts"
Cohesion: 0.07
Nodes (29): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, NodeBatch, Block, MemoryTables (+21 more)

### Community 5 - "api-server.test.ts"
Cohesion: 0.03
Nodes (109): ModuleApiServer, ModuleApiStart, StartedModuleApi, ApiRegistry, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions (+101 more)

### Community 50 - "boundary.test.ts"
Cohesion: 0.08
Nodes (44): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+36 more)

### Community 52 - "NodeBlockSource"
Cohesion: 0.09
Nodes (11): HeadWait, NodeBlockSource, Prefetch, PreparedBlock, QueueRunner, NoWindow, Refetches, TrustsNotifications (+3 more)

### Community 53 - "config/history.ts"
Cohesion: 0.07
Nodes (45): HistoryCode, HistoryContext, HistoryFinding, ProvidesRow, Span, Finding, asNumber(), atOrBelow() (+37 more)

### Community 54 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (35): Settings, Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings() (+27 more)

### Community 55 - "ledger-storage-checks.ts"
Cohesion: 0.07
Nodes (37): ChildReader, BridgeServer, bridgeStore, Growable, childRefKeys(), readChildren(), bridgeMemory(), decodeNodes() (+29 more)

### Community 56 - "validate.ts"
Cohesion: 0.08
Nodes (44): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CursorRule, Issue, Plain, SettingsSchema, UpgradeEntry (+36 more)

### Community 57 - "core-block-commit.test.ts"
Cohesion: 0.08
Nodes (36): SchemaWriteHandle, MigrationPart, ItemDeclaration, ProcessContext, ResolvedGraph, ProcessContextsInput, Commit, Committed (+28 more)

### Community 58 - "transform-checks.ts"
Cohesion: 0.11
Nodes (31): TransformError, NotificationRange, baseRecords(), expectedText(), expectVariantOutput(), forkRecords(), changedLines(), checkTape() (+23 more)

### Community 59 - "private-transport.ts"
Cohesion: 0.08
Nodes (22): PublicSide, TransportLimits, TransportTls, HelloAck, JsonValue, ReadResult, StatementResult, Pending (+14 more)

### Community 6 - "UmbraError"
Cohesion: 0.03
Nodes (90): LoadedConfig, LoadOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresOptions, ReadDatabaseOptions, ConfiguredDatabase (+82 more)

### Community 60 - "graph.ts"
Cohesion: 0.07
Nodes (46): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+38 more)

### Community 61 - "core-transport.ts"
Cohesion: 0.07
Nodes (28): CoreTransportOptions, InstanceView, Session, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions (+20 more)

### Community 63 - "cbor.ts"
Cohesion: 0.09
Nodes (38): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+30 more)

### Community 64 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (38): HeightActivity, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, Observed (+30 more)

### Community 65 - "run.test.ts"
Cohesion: 0.07
Nodes (34): CheckStep, ConfigCheckReport, statsConfig, configCheck(), configText(), coreSettings(), inChild(), inProcess() (+26 more)

### Community 66 - "core-settings.ts"
Cohesion: 0.06
Nodes (40): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys (+32 more)

### Community 67 - "transport-faults.test.ts"
Cohesion: 0.08
Nodes (30): Message, MessageType, TestCertificates, Ended, rawClient, mutualTlsOptions(), makeCertificates(), endedWithin() (+22 more)

### Community 68 - "version-checks.ts"
Cohesion: 0.12
Nodes (32): MetadataBlock, MetadataNode, RuntimeMetadataEntry, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata (+24 more)

### Community 7 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (110): ApplyOutput, StoredNode, recordedGenesis, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject (+102 more)

### Community 70 - "plain-data.ts"
Cohesion: 0.07
Nodes (33): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, sameRow(), copyArray() (+25 more)

### Community 71 - "PointName"
Cohesion: 0.07
Nodes (34): PointName, CallbackFailure, ProcessReason, ReasonCode, Unwrapped, HeightFailure, Misuse, SlowBlockCondition (+26 more)

### Community 72 - "retirement.test.ts"
Cohesion: 0.07
Nodes (39): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), manifestProblems(), mutationProblems() (+31 more)

### Community 73 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 74 - "test/postgres/setup.ts"
Cohesion: 0.06
Nodes (35): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, Sql, SuiteWatchdogTimeoutError, pool() (+27 more)

### Community 78 - "validate.test.ts"
Cohesion: 0.07
Nodes (34): ConfigRule, EntryRef, CursorRow, Expected, declarations(), input(), refusal(), rowInput() (+26 more)

### Community 79 - "real-tapes.ts"
Cohesion: 0.08
Nodes (35): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+27 more)

### Community 8 - "NodeClient"
Cohesion: 0.04
Nodes (83): NodeSourceOptions, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter, NodeBlock (+75 more)

### Community 82 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 84 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (37): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+29 more)

### Community 85 - "process-context.test.ts"
Cohesion: 0.08
Nodes (28): EntryRange, MisuseListener, PublishRefusal, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, serving() (+20 more)

### Community 86 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (24): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+16 more)

### Community 89 - "graph.test.ts"
Cohesion: 0.08
Nodes (34): GraphInput, HeightRange, PastFaultCase, RefusalCase, reader(), backboneWithout(), consumer(), graphInput() (+26 more)

### Community 9 - "ReadHandle"
Cohesion: 0.03
Nodes (78): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue (+70 more)

### Community 90 - "messages.ts"
Cohesion: 0.07
Nodes (32): Committed, MessageFault, Parsed, bytesOf(), decodeParameter(), decodeValue(), describe(), elementType() (+24 more)

### Community 92 - "net.test.ts"
Cohesion: 0.09
Nodes (19): IncomingMessage, Server, Emitter, Frame, Listener, PortUpgrade, RawData, WebSocket (+11 more)

### Community 94 - "Process"
Cohesion: 0.12
Nodes (5): CoreTransport, StartedModuleApi, Process, messageOf(), pause()

### Community 95 - "core-tx-results.ts"
Cohesion: 0.09
Nodes (32): MetadataVariant, BlockParsedOptions, ChainTransaction, ChainEvent, EventPhase, RecordTypes, ScaleValue, decodeExtrinsics() (+24 more)

### Community 96 - ".value"
Cohesion: 0.21
Nodes (14): TypeDef, ScaleError, ScaleReader, ValueReader, decodeExtrinsic(), field(), pallet(), readRuntimeMetadata() (+6 more)

### Community 98 - "postgres/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (22): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+14 more)

### Community 99 - "sweep-tapes.ts"
Cohesion: 0.14
Nodes (31): TableSnapshot, coreLedgerState(), committed(), coreWith(), hex(), insertionOrder(), firstVersion(), hex() (+23 more)

### Community 171 - "4. Schema design"
Cohesion: 0.14
Nodes (14): 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design, v4 rewrite — the rollover runbook, rebuilt from four reproduced failures, run end-to-end for real (+6 more)

### Community 100 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.06
Nodes (33): up(), name, 8. Migration, 1. Durability contract, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 4. Save-retry caveat, 5. Lease limitation (+25 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.06
Nodes (28): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage, ADDED Requirements (+20 more)

### Community 130 - "core-block-parsed.ts"
Cohesion: 0.10
Nodes (21): ledgerVersionOf(), blockBodyOf(), blockParsedOf(), chainHashOf(), coreBlockParsedOnParse(), hexOf(), sameBytes(), heightPartitionsSql() (+13 more)

### Community 139 - "2. Points"
Cohesion: 0.09
Nodes (21): refused(), 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence, 15. Relation to the existing design documents, 2. Points, Design — CORE-ARCH: the standalone indexer's core architecture, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener (+13 more)

### Community 142 - "decode"
Cohesion: 0.11
Nodes (20): decode(), Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Scenario: A future-versioned envelope is rejected cleanly, Scenario: An unknown top-level field is rejected as a typed envelope error (F7), Scenario: Non-JSON bytes are rejected as a typed envelope error, Scenario: Structurally invalid JSON is rejected as a typed envelope error, 0. Specification freeze (+12 more)

### Community 151 - "migrations"
Cohesion: 0.11
Nodes (18): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Migrations, ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser (+10 more)

### Community 152 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 157 - "UmbraDB module guide"
Cohesion: 0.11
Nodes (17): params(), Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Private modules, Process items and APIs, Reading through `db` (+9 more)

### Community 159 - "T"
Cohesion: 0.13
Nodes (17): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Scenario: Version and timestamp addressing agree, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error (+9 more)

### Community 177 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 182 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (12): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface, 3. Modules (+4 more)

### Community 188 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 199 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 206 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 209 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 215 - ".slowBlockMs"
Cohesion: 0.24
Nodes (9): 16. Whole system, 5. Runner, Requirement: CF-4 Every field is data, operational or secret, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases, Requirement: RN-17 A slow block is reported, never cut off, Scenario: A slow callback, Scenario: A slow callback after the commit (+1 more)

### Community 233 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 238 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 272 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 294 - "Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data"
Cohesion: 0.40
Nodes (4): 2. Database API, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Scenario: A function in the configuration, Scenario: A user module from the configuration file

### Community 298 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 310 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 311 - "leanProblems"
Cohesion: 0.50
Nodes (4): leanImports(), leanProblems(), leanTheorems(), retiredLean()

### Community 48 - "code"
Cohesion: 0.04
Nodes (52): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21), The catalog, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog (+44 more)

### Community 51 - "fn"
Cohesion: 0.04
Nodes (51): fn(), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly (+43 more)

### Community 76 - "version"
Cohesion: 0.05
Nodes (40): version(), Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Full-sync soak + load-under-prune (G10), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC) (+32 more)

### Community 77 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (16): bindingRefusal(), hex(), networkRefusal(), sameBytes(), height(), fakePublic(), fakeRead(), hexOf() (+8 more)

### Community 80 - ".put"
Cohesion: 0.06
Nodes (39): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+31 more)

### Community 91 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+23 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+21 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 128 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 129 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.08
Nodes (18): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Superseded — see `Formal/STORAGE_ALGEBRA.md`, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan (+10 more)

### Community 131 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.08
Nodes (25): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+17 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence (+17 more)

### Community 134 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 135 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 141 - "Full-Chain Storage — Design"
Cohesion: 0.09
Nodes (21): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+13 more)

### Community 143 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 144 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 149 - "Design — Sprint 4: Watermarks"
Cohesion: 0.09
Nodes (18): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+10 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 158 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.11
Nodes (16): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+8 more)

### Community 160 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 163 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 164 - "Storage Layer Interface Specification"
Cohesion: 0.12
Nodes (16): 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.1 Transaction/Lease layer (+8 more)

### Community 165 - "chain_archive lineage"
Cohesion: 0.12
Nodes (17): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, CheckpointStore tables, How the two lineages coexist (+9 more)

### Community 166 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 168 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 169 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 172 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 183 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 184 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 189 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 190 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 191 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 195 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 200 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 201 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 202 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.17
Nodes (11): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live` (+3 more)

### Community 203 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 204 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 205 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 207 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 208 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 210 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 211 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 213 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 214 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 216 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 217 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure, Design — Sprint 2: Transaction/Lease (+1 more)

### Community 218 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 219 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 220 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 222 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 223 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 224 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 225 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 226 - "Full-Chain Storage"
Cohesion: 0.22
Nodes (8): 1. Overview / purpose, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 3. Semantic decode: `chain-archive-sync/tx-replay-decoder.ts`, 4. How to run it, 5. Acceptance criteria status, Full-Chain Storage

### Community 227 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 228 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 229 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 230 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.22
Nodes (8): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data`, Scalability ceilings (v1.0.0)

### Community 234 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 235 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 236 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 237 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 241 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 242 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 243 - "Backups"
Cohesion: 0.29
Nodes (6): A backup at the core's stop, Backups, Restoring a backup, UmbraDB operator guide, What a backup holds, Writing a backup

### Community 244 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 245 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 246 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 247 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 248 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 249 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 254 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

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

### Community 259 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 260 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 261 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 262 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease, What changes, Why

### Community 263 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 264 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 265 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 266 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 267 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 268 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 269 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 270 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 273 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 275 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 276 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 277 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 278 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 279 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 280 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 281 - "00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond"
Cohesion: 0.40
Nodes (4): 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix

### Community 282 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 283 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 284 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 285 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 286 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 287 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 288 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 289 - "00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask"
Cohesion: 0.40
Nodes (4): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix

### Community 290 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 291 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 292 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 293 - "Tasks — Sprint 1: project setup + TemporalKV"
Cohesion: 0.40
Nodes (4): 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV

### Community 295 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 299 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 300 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 301 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 302 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 303 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 304 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 305 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 306 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 307 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 308 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 317 - "Requirement: RN-3 Callbacks within a point run in a fixed order"
Cohesion: 0.67
Nodes (3): Requirement: RN-3 Callbacks within a point run in a fixed order, Scenario: A provider finishes before its consumer starts, Scenario: Unrelated modules write in id order

### Community 318 - "Requirement: RN-5 The block context carries one height's items"
Cohesion: 0.67
Nodes (3): Requirement: RN-5 The block context carries one height's items, Scenario: A second put is an error, Scenario: An item reaches a later callback of the same block

### Community 319 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 320 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 62 - "README.md"
Cohesion: 0.05
Nodes (33): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, [0.9.5] - 2026-07-25 — "Penumbra" (+25 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+32 more)

### Community 87 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

## Knowledge Gaps
- **53 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8259`, `RFC-3339` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3584 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `chain-placement.test.ts`, `admin-harness.ts`, `chain-process.test.ts`, `migrate.ts`, `client.test.ts`, `api-server.test.ts`, `UmbraError`, `adapter-fixtures.ts`, `NodeClient`, `ReadHandle`, `tape/index.ts`, `TapeRecord`, `module-tables.ts`, `runner/process.ts`, `src/db/postgres.ts`, `Database`, `refused-configuration.test.ts`, `order.property.test.ts`, `loop.ts`, `node-format.ts`, `.from`, `host.ts`, `process-admin.ts`, `spawnChild`, `loop.test.ts`, `ref_node_fs`, `core-ledger-state.ts`, `ledger/types.ts`, `contract-data-checks.ts`, `contract-modules.test.ts`, `backup/restore.ts`, `config-check.ts`, `private/backends.ts`, `history.test.ts`, `builds.ts`, `declaration.ts`, `loop-harness.ts`, `ledger-storage.test.ts`, `cli/command.ts`, `column-rules.test.ts`, `ledger-sweep.test.ts`, `boundary.test.ts`, `zero-timeouts-checks.ts`, `ledger-storage-checks.ts`, `validate.ts`, `core-block-commit.test.ts`, `transform-checks.ts`, `private-transport.ts`, `core-transport.ts`, `slow-block-harness.ts`, `run.test.ts`, `core-settings.ts`, `transport-faults.test.ts`, `version-checks.ts`, `plain-data.ts`, `PointName`, `retirement.test.ts`, `test/postgres/setup.ts`, `core-private-source.test.ts`, `validate.test.ts`, `real-tapes.ts`, `networks.ts`, `cbor.property.test.ts`, `process-context.test.ts`, `cold-boot-recovery.integration.test.ts`, `graph.test.ts`, `messages.ts`, `net.test.ts`, `postgres/transaction-history-storage.ts`, `sweep-tapes.ts`, `shims.test.ts`, `binding.test.ts`, `code-registry.ts`, `entries.ts`, `browser/build.ts`, `pg-tx-history-adapter.ts`, `ref_node_url`, `ws-mutual-tls.test.ts`, `checks.test.ts`, `core-chain-events.ts`, `browser.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `redact.ts`, `package.json`, `block-fetch-decode.test.ts`, `lockstep-refusals.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `package-identity.test.ts`, `validation.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `excluded-not-exported.test.ts`, `read-height.property.test.ts`, `twox.ts`, `transport-intake.test.ts`, `private/lockstep-wait.test.ts`, `facade-merge-loader.ts`, `worker-threads.test.ts`, `typed-config.test.ts`?**
  _High betweenness centrality (0.260) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `chain-placement.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02666014430720313 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `chain-placement.test.ts`, `admin-harness.ts`, `chain-process.test.ts`, `migrate.ts`, `client.test.ts`, `api-server.test.ts`, `NodeClient`, `ReadHandle`, `ProcessContexts`, `tape/index.ts`, `module-tables.ts`, `runner/process.ts`, `src/db/postgres.ts`, `Database`, `refused-configuration.test.ts`, `version-table.ts`, `loop.ts`, `lockstep-refusals.test.ts`, `vitest`, `host.ts`, `process-admin.ts`, `package-identity.test.ts`, `loop.test.ts`, `FinalizedLoop`, `core-ledger-state.ts`, `core-private-source.ts`, `UmbraDB module guide`, `range.ts`, `contract-modules.test.ts`, `backup/restore.ts`, `validation.ts`, `config-check.ts`, `private/backends.ts`, `history.test.ts`, `declaration.ts`, `validation.test.ts`, `loop-harness.ts`, `ledger-storage.test.ts`, `sha256`, `statementsOf`, `cli/command.ts`, `checkShape`, `NodeBlockSource`, `web-lock.ts`, `config/history.ts`, `zero-timeouts-checks.ts`, `validate.ts`, `core-block-commit.test.ts`, `transform-checks.ts`, `private-transport.ts`, `graph.ts`, `core-transport.ts`, `2. Points`, `cbor.ts`, `RuntimeMetadata`, `slow-block-harness.ts`, `core-settings.ts`, `transport-faults.test.ts`, `version-checks.ts`, `plain-data.ts`, `PointName`, `core-private-source.test.ts`, `validate.test.ts`, `process-context.test.ts`, `graph.test.ts`, `shims.test.ts`, `binding.test.ts`, `mapping.ts`, `checks.test.ts`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.023869071124566713 - nodes in this community are weakly interconnected._