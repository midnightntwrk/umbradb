# Graph Report - UmbraDB

## Corpus Check
- 1054 files · ~1,559,163 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 80 file(s) not represented in the graph (top: .lean 25, .patch 18, (none) 14)

## Summary
- 11061 nodes · 33634 edges · 301 communities (271 shown, 30 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 3486 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `1a9fccfb9dc5e639` (1054 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionHistoryStorage
- postgres/checkpoint-store.ts
- core-transport.ts
- sweep-tapes.ts
- backup/restore.ts
- process-worker.ts
- chain-events-decode.test.ts
- plain-data.ts
- browser/build.ts
- Lockstep
- postgres/transaction-lease.ts
- PgChainArchiveStore
- code-registry.ts
- chrome.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- fixtures/configuration.ts
- Buffer
- records.ts
- config/history.ts
- .value
- worker-threads.test.ts
- range.ts
- readiness.test.ts
- ChainArchiveStore
- sweep.ts
- ledger-sweep.test.ts
- cli/restore.ts
- vitest
- block-fetch-decode.test.ts
- core-block-fetch/metadata.ts
- package-identity.test.ts
- page.ts
- core-ledger-state.test.ts
- postgres/chain-archive-store.ts
- childRefKeys
- ReadHandle
- commit-proxy.ts
- Registry
- tx-replay-decoder.ts
- cbor.ts
- no-indexer-or-wallet-sdk.test.ts
- PortSocket
- ws-mutual-tls.test.ts
- RuntimeMetadata
- Worker
- fetch-fixtures.ts
- checkShape
- web-lock.ts
- midnight-env — reproducible PREPROD dev environment
- runner/process.ts
- history.property.test.ts
- ConnectionError
- retention.ts
- sha256
- process-admin.ts
- extrinsics.ts
- postgres-image.test.ts
- test/postgres/setup.ts
- refused-configuration.test.ts
- createClient
- adapter-fixtures.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- BlockRef
- Heartbeat
- FinalizedLoop
- restore-ledger.ts
- change-capture.ts
- core-private-source.test.ts
- BlockLedgerSource
- https.ts
- NodeFS
- tape/index.ts
- ledger/types.ts
- column-rules.ts
- runMigrations
- adapter.ts
- chain-placement.test.ts
- core-block-parsed.ts
- module-api.ts
- validate.test.ts
- builder.test.ts
- ledger-storage.test.ts
- loop.test.ts
- node-format.ts
- declaration.ts
- contract-data-checks.ts
- writer-lock-checks.ts
- api-server.test.ts
- chain-process.test.ts
- range.test.ts
- key-checks.ts
- LedgerPackage
- ledger-tapes.ts
- backup-fixtures.ts
- process-context.test.ts
- src/index.ts
- ValidationError
- config-check.ts
- transform-checks.ts
- private/backends.ts
- harness.ts
- cli/command.ts
- validation.ts
- .from
- mapping.ts
- networks.ts
- TransactionHandle
- declaration
- 12. Ledger
- core-block-commit.test.ts
- backup/backup.ts
- record-and-replay.test.ts
- node/client.test.ts
- loop.ts
- boundary.test.ts
- binding.test.ts
- ref_node_fs
- db/migrate.ts
- slow-block-harness.ts
- zero-timeouts-checks.ts
- lockstep-refusals.test.ts
- graph.ts
- spawnChild
- Storage Algebra Lean Formalization — Approved Design and Status
- browser.test.ts
- NodeClient
- PointName
- validate.ts
- UmbraError
- real-tapes.ts
- net.test.ts
- translatePostgresError
- version-checks.ts
- node/errors.ts
- worker-storage.test.ts
- ref_node_crypto
- admin-harness.ts
- core-settings.ts
- order.property.test.ts
- builds.ts
- refused
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- decode.ts
- Tasks — v1.0.0-infosec-signoff
- ADDED Requirements
- mutation-per-adapter.mjs
- twox.ts
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- .slowBlockMs
- pack-install.mjs
- Full-Chain Storage
- path.ts
- schemaName
- .boolean
- Performance — design
- .closed
- orphan-watcher.mjs
- read-only-checks.ts
- graph.py
- Full-Chain Storage — Design
- core-ledger-state.ts
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- UmbraDB module guide
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ROADMAP.md
- ADDED Requirements
- REMOVED Requirements
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Roadmap
- compilerOptions
- README.md
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.1.0: Quint model checking
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Repository agent policy
- Our Pledge
- Midnight infra verification checklist
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- UmbraDB — project instructions
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — v1.0.0-perf-baseline
- Acceptance — v1.1.0: Quint model checking
- Midnight Foundation Security Policy
- lib.sh
- Vendored ledger builds
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- bug-report.md
- feature-request.md
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- GC architecture and query-tracing: research findings
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- graphify/run.sh
- build-in-container.sh
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
- package.json
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 341 edges
2. `UmbraError` - 295 edges
3. `ModuleDeclaration` - 166 edges
4. `FinalizedLoop` - 116 edges
5. `InMemoryBlockSource` - 102 edges
6. `NodeClient` - 99 edges
7. `Database` - 95 edges
8. `PgTransactionLeaseLayer` - 93 edges
9. `runMigrations()` - 90 edges
10. `BlockRef` - 87 edges

## Surprising Connections (you probably didn't know these)
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `The honest-test pattern (what makes each required test non-vacuous)` --references--> `ChunkMissingError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/checkpoint-store.ts
- `CheckpointStore: content-addressed snapshots` --references--> `ManifestCorruptError`  [INFERRED]
  README.md → src/interfaces/checkpoint-store.ts
- `Scenario: A connection failure during any method surfaces as ConnectionError` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → src/interfaces/storage-errors.ts
- `2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2)` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/v1.0.0-recovery-testing/tasks.md → src/interfaces/storage-errors.ts

## Import Cycles
- None detected.

## Communities (301 total, 30 thin omitted)

### Community 0 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (197): EntryContent, EntryLifecycle, MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStatus, TransactionHistoryStorage, JsonEncoded, PgTransactionHistoryStorage (+189 more)

### Community 1 - "postgres/checkpoint-store.ts"
Cohesion: 0.01
Nodes (197): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointSummary, ChunkIntegrityError, ChunkMissingError, ContentHash, ManifestCorruptError (+189 more)

### Community 10 - "core-transport.ts"
Cohesion: 0.03
Nodes (100): PublicSide, Session, TransportLimits, TransportTls, Committed, Hello, HelloAck, JsonValue (+92 more)

### Community 100 - "sweep-tapes.ts"
Cohesion: 0.14
Nodes (31): TableSnapshot, FixtureNode, startLedgerWorker(), hex(), insertionOrder(), firstVersion(), hex(), runFixture() (+23 more)

### Community 102 - "backup/restore.ts"
Cohesion: 0.13
Nodes (26): RestoreTarget, MetaCommands, Piece, State, StatementSplitter, isBlockLedgerSource(), firstLine(), hex() (+18 more)

### Community 104 - "process-worker.ts"
Cohesion: 0.12
Nodes (21): Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, openedProcess, privateIntake, CommandBuildOptions (+13 more)

### Community 105 - "chain-events-decode.test.ts"
Cohesion: 0.10
Nodes (24): MetadataField, MetadataType, MetadataVariant, RuntimeMetadataView, RecordTypes, ScaleValue, writeEventRows(), namedField() (+16 more)

### Community 106 - "plain-data.ts"
Cohesion: 0.10
Nodes (22): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+14 more)

### Community 107 - "browser/build.ts"
Cohesion: 0.09
Nodes (23): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+15 more)

### Community 108 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 11 - "postgres/transaction-lease.ts"
Cohesion: 0.03
Nodes (118): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionFaultError, TransactionHandleInvalidError, TransactionLeaseError (+110 more)

### Community 111 - "PgChainArchiveStore"
Cohesion: 0.17
Nodes (12): BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, VerifierKeyObservationRecord, PgChainArchiveStore, assertHex32() (+4 more)

### Community 112 - "code-registry.ts"
Cohesion: 0.12
Nodes (25): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+17 more)

### Community 113 - "chrome.ts"
Cohesion: 0.14
Nodes (12): Cdp, CdpEvent, ChromeBrowser, ChromeTab, PageRequest, chrome(), chrome(), chromePath() (+4 more)

### Community 114 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 115 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 116 - "fixtures/configuration.ts"
Cohesion: 0.12
Nodes (19): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration() (+11 more)

### Community 117 - "Buffer"
Cohesion: 0.10
Nodes (18): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+10 more)

### Community 119 - "records.ts"
Cohesion: 0.13
Nodes (23): TapeError, TapeProblem, TransformProblem, DisconnectRecord, changedLines(), checkRecord(), isPlainObject(), kindOf() (+15 more)

### Community 12 - "config/history.ts"
Cohesion: 0.03
Nodes (117): CoreVersion, CoreSettings, versionEntry, HistoryCode, HistoryContext, HistoryInput, HistoryOptions, HistoryRule (+109 more)

### Community 120 - ".value"
Cohesion: 0.20
Nodes (10): Primitive, ScaleReader, ValueReader, blockTimeOf(), bytesArgument(), decodeChainEvents(), littleEndian(), Requirement: set is an idempotent, unconditional overwrite (Law W1) (+2 more)

### Community 121 - "worker-threads.test.ts"
Cohesion: 0.09
Nodes (13): Listener, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread, parentPort (+5 more)

### Community 124 - "range.ts"
Cohesion: 0.09
Nodes (20): HeadSubscriber, Final, Height, RangeRecording, RangeStats, checkOptions(), isHeight(), isPositive() (+12 more)

### Community 125 - "readiness.test.ts"
Cohesion: 0.13
Nodes (17): ReadinessFacts, ProcessState, gate, Decision, ReadinessCase, readinessOf(), ae4(), caseText() (+9 more)

### Community 126 - "ChainArchiveStore"
Cohesion: 0.09
Nodes (10): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents, `transactions` (chain_archive) (+2 more)

### Community 127 - "sweep.ts"
Cohesion: 0.13
Nodes (11): GreyView, SweepPhase, SweepTables, byBytes(), BYTE_ORDER(), hexOf(), merged(), sweepStep() (+3 more)

### Community 128 - "ledger-sweep.test.ts"
Cohesion: 0.18
Nodes (13): SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, writeSweep(), bigints(), compare() (+5 more)

### Community 129 - "cli/restore.ts"
Cohesion: 0.14
Nodes (17): RestoreSeams, Environment, BackupCommandOptions, BackupOutcome, commandTarget, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome (+9 more)

### Community 13 - "vitest"
Cohesion: 0.03
Nodes (74): Database, ConsistentRead, CheckTarget, CliBackend, Snapshot, TestDatabase, LoadOutcome, OutsideRead (+66 more)

### Community 130 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+9 more)

### Community 131 - "core-block-fetch/metadata.ts"
Cohesion: 0.29
Nodes (14): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 132 - "package-identity.test.ts"
Cohesion: 0.15
Nodes (19): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+11 more)

### Community 135 - "page.ts"
Cohesion: 0.14
Nodes (16): PageState, ProcessView, CallMethod, appendLog(), element(), onEvent(), render(), startWorker() (+8 more)

### Community 136 - "core-ledger-state.test.ts"
Cohesion: 0.11
Nodes (10): retainedStates, boundLedgerParser(), bindCoreLedgerState(), itemsOf(), revisionsOf(), writeBlock(), bound(), CORE_LEDGER_STATE_MIGRATIONS (+2 more)

### Community 137 - "postgres/chain-archive-store.ts"
Cohesion: 0.14
Nodes (15): BlobRole, BlockBundle, BlockMeta, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult (+7 more)

### Community 138 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 14 - "ReadHandle"
Cohesion: 0.03
Nodes (86): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue (+78 more)

### Community 140 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 145 - "Registry"
Cohesion: 0.31
Nodes (8): Field, Registry, metadataWith(), metadataV14(), midnightMetadata(), some(), text(), vec()

### Community 146 - "tx-replay-decoder.ts"
Cohesion: 0.18
Nodes (16): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+8 more)

### Community 15 - "cbor.ts"
Cohesion: 0.03
Nodes (117): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+109 more)

### Community 152 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.19
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 153 - "PortSocket"
Cohesion: 0.21
Nodes (5): PortSocket, 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 154 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 156 - "RuntimeMetadata"
Cohesion: 0.17
Nodes (5): MetadataNode, RuntimeMetadata, OwnStateMetadata, contentStateOf(), hexOf()

### Community 157 - "Worker"
Cohesion: 0.21
Nodes (3): Worker, 9.2 Browser build (BR), 9. Backups and browser

### Community 16 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (102): ProcessCondition, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded, FetchSeen (+94 more)

### Community 160 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 162 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 167 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 17 - "runner/process.ts"
Cohesion: 0.03
Nodes (68): Bound, ChainIdentity, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, CoreTransport (+60 more)

### Community 173 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 18 - "ConnectionError"
Cohesion: 0.02
Nodes (117): ConnectionError, T(), Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 3 continued — the change-level cold audit rounds: the tests were honest, the ENFORCEMENT wasn't) (+109 more)

### Community 180 - "retention.ts"
Cohesion: 0.26
Nodes (9): CoreLedgerStateOptions, CoreRevision, GreyPicker, coreRevisionsOf(), releasedBy(), retainedFrom(), retentionWindow(), history() (+1 more)

### Community 188 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 19 - "process-admin.ts"
Cohesion: 0.04
Nodes (100): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+92 more)

### Community 195 - "extrinsics.ts"
Cohesion: 0.27
Nodes (8): ExtrinsicCall, MetadataPallet, callOf(), callVariants(), decodeExtrinsic(), decodeExtrinsics(), isCompactU64(), TIMESTAMP

### Community 196 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 2 - "test/postgres/setup.ts"
Cohesion: 0.02
Nodes (173): JsonValue, KvRow, BatchSpec, CurrentState, InvariantResult, C5AnyFn, CurrentState, GcPass (+165 more)

### Community 20 - "refused-configuration.test.ts"
Cohesion: 0.03
Nodes (103): ProcessConfig, AdminRun, Answered, Start, Child, Refusal, Start, listenError() (+95 more)

### Community 21 - "createClient"
Cohesion: 0.04
Nodes (75): AnySql, RolloverBucket, RolloverTable, UmbraDBSql, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration (+67 more)

### Community 22 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (94): DeployTx, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost (+86 more)

### Community 223 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 23 - "BlockRef"
Cohesion: 0.04
Nodes (38): BlockHeaderItem, BlockEventSource, BlockItemSource, CoreBlockHeader, CoreBlockItems, HeadWait, NodeBlockSource, Prefetch (+30 more)

### Community 24 - "FinalizedLoop"
Cohesion: 0.04
Nodes (34): Activity, CommitOutcome, FinalizedLoop, HeightRun, HeldHeight, LoopObserver, Startup, SkipsAfterReconnect (+26 more)

### Community 25 - "restore-ledger.ts"
Cohesion: 0.04
Nodes (66): BlockHeader, Connection, NodeCallOptions, NodeClientOptions, NodeRetry, State, NodeRuntimeVersion, ConnectSocket (+58 more)

### Community 26 - "change-capture.ts"
Cohesion: 0.04
Nodes (88): CapturedTable, CaptureState, OwnPart, SchemaPlan, FieldKind, FieldSchema, ItemDeclaration, Lifetime (+80 more)

### Community 27 - "core-private-source.test.ts"
Cohesion: 0.04
Nodes (60): PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, SourceTransport, PublicDatabase, PublicIdentity, PublicSideOptions, PublicWakes (+52 more)

### Community 28 - "tape/index.ts"
Cohesion: 0.05
Nodes (62): BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilderOptions, RecordingProblem, readRequest, RequestId (+54 more)

### Community 29 - "ledger/types.ts"
Cohesion: 0.04
Nodes (73): LoadLedger, TransactionParser, LedgerStateItem, RetainedState, LedgerName, ApplyOutput, ChainOutcome, LedgerPackageOptions (+65 more)

### Community 3 - "column-rules.ts"
Cohesion: 0.02
Nodes (161): BackupInput, CaptureColumn, CheckedMigration, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions (+153 more)

### Community 30 - "runMigrations"
Cohesion: 0.03
Nodes (99): DurabilityContractError, TransactionPoolerDetectedError, MigrationLockTimeoutError, runMigrations(), Audit (round 1) — the confirmation-bias control paid off, 8. Migration, 1. Durability contract, 2. Forward-only / no-downgrade migration contract (+91 more)

### Community 31 - "adapter.ts"
Cohesion: 0.03
Nodes (74): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+66 more)

### Community 32 - "chain-placement.test.ts"
Cohesion: 0.04
Nodes (77): ContractLog, BlockTransaction, CoreContractLogsFastOptions, UnsureLog, FastLogReader, LoadAdapter, LogSite, Program (+69 more)

### Community 33 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (77): BodyExtrinsic, BlockBody, BlockParsed, BlockParsedOptions, ChainTransaction, ChainEvent, EventPhase, itemsSeen (+69 more)

### Community 34 - "module-api.ts"
Cohesion: 0.04
Nodes (61): ModuleApiServer, ModuleApiStart, StartedModuleApi, ApiRegistry, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions (+53 more)

### Community 35 - "validate.test.ts"
Cohesion: 0.03
Nodes (78): coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+70 more)

### Community 36 - "builder.test.ts"
Cohesion: 0.04
Nodes (44): ManualTimers, ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata (+36 more)

### Community 37 - "ledger-storage.test.ts"
Cohesion: 0.06
Nodes (77): Call, SeenLoad, RestartEvent, RestartJob, retentionSeen, LedgerTx, recordedGenesis, ProcessBackend (+69 more)

### Community 38 - "loop.test.ts"
Cohesion: 0.05
Nodes (59): Contexts, Faults, LostCommit, Seen, Seen, AtGate, LoopClass, RunnerDatabase (+51 more)

### Community 39 - "node-format.ts"
Cohesion: 0.06
Nodes (54): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+46 more)

### Community 4 - "declaration.ts"
Cohesion: 0.03
Nodes (135): RestoreInput, DefinedModule, KnownPointsOnly, ModuleDeclaration, TableDeclaration, BlockSource, InMemoryBlockSource, InMemoryItems (+127 more)

### Community 40 - "contract-data-checks.ts"
Cohesion: 0.06
Nodes (68): ContractStateRow, CoreContractStatesOptions, contractScenario, ContractScenarioOptions, LogLine, Program, Ran, ScenarioTx (+60 more)

### Community 41 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (59): Held, PgliteLockUse, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, acquirePgliteLock() (+51 more)

### Community 42 - "api-server.test.ts"
Cohesion: 0.05
Nodes (55): ChainDataAnswer, ChainDataView, ApiRequest, HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, AppendsVersion (+47 more)

### Community 43 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (49): ChainCheck, ChainCheckInput, RunOptions, RunSeams, SignalSource, stopSignal, ProcessHandle, ProcessInput (+41 more)

### Community 44 - "range.test.ts"
Cohesion: 0.05
Nodes (43): Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+35 more)

### Community 45 - "key-checks.ts"
Cohesion: 0.07
Nodes (66): PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, Admission, AdmittedSeen, Blocking (+58 more)

### Community 46 - "LedgerPackage"
Cohesion: 0.06
Nodes (32): LedgerPackage, StateHandle, LedgerEngine, Settled, StagenetBlockJson, StagenetFixtureJson, stagenetReplay, hexOf() (+24 more)

### Community 47 - "ledger-tapes.ts"
Cohesion: 0.06
Nodes (71): BlockSpec, EventSpec, Json, transactionSpec, eventsRuntime, PalletMetadata, Phase, RuntimeShape (+63 more)

### Community 48 - "backup-fixtures.ts"
Cohesion: 0.08
Nodes (46): BackupBackend, BackupDatabase, killedRestore, TickerConfig, cliProject, catalogOf(), dockerExec(), hashOf() (+38 more)

### Community 49 - "process-context.test.ts"
Cohesion: 0.05
Nodes (37): Revision, ResolvedGraph, StartedModuleApi, MisuseListener, MisuseReports, ProcessContexts, ProcessContextsInput, ProcessItems (+29 more)

### Community 5 - "src/index.ts"
Cohesion: 0.03
Nodes (162): CheckpointStore, CheckpointStoreError, CheckpointStoreErrorCode, HistoryOptions, PruneResult, Retryability, SharedStorageErrorCode, StorageError (+154 more)

### Community 50 - "ValidationError"
Cohesion: 0.05
Nodes (56): ValidationError, EnvelopeCorruptError, EnvelopeVersionUnsupportedError, WalletStateEnvelope, WalletStateEnvelopeError, decode(), encode(), safeNonEmptyString() (+48 more)

### Community 51 - "config-check.ts"
Cohesion: 0.06
Nodes (48): CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, TypeCheckFinding, TypeCheckResult (+40 more)

### Community 52 - "transform-checks.ts"
Cohesion: 0.09
Nodes (42): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, baseRecords() (+34 more)

### Community 53 - "private/backends.ts"
Cohesion: 0.06
Nodes (37): PrivateBackend, SessionSeen, TestDatabase, Pause, Q142Observation, A155Observation, Outcome, A112Observation (+29 more)

### Community 54 - "harness.ts"
Cohesion: 0.09
Nodes (47): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+39 more)

### Community 55 - "cli/command.ts"
Cohesion: 0.07
Nodes (43): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, CommandResult, backupArguments(), backupCommand() (+35 more)

### Community 56 - "validation.ts"
Cohesion: 0.05
Nodes (48): DeclarationRule, PlacedDeclaration, Plain, Validator, Case, ShapeCase, Stats, first() (+40 more)

### Community 57 - ".from"
Cohesion: 0.05
Nodes (43): AdmittedKey, KeyRegistryOptions, Run, RunKey, TestKey, admittedOf(), bytesOfHex(), idText() (+35 more)

### Community 58 - "mapping.ts"
Cohesion: 0.06
Nodes (44): ResultColumn, ResultType, Case, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject() (+36 more)

### Community 59 - "networks.ts"
Cohesion: 0.05
Nodes (55): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, ConfiguredLedgerTable (+47 more)

### Community 6 - "TransactionHandle"
Cohesion: 0.02
Nodes (140): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, AsOf, AssertExact (+132 more)

### Community 60 - "declaration"
Cohesion: 0.07
Nodes (50): GraphInput, PastFaultCase, RefusalCase, keysModule(), contractLogs(), declaration(), logsProvider(), reader() (+42 more)

### Community 61 - "12. Ledger"
Cohesion: 0.06
Nodes (43): LedgerReleasePackage, ApplyInput, StateSummary, V9Logs, LedgerHeight, AdapterWorkerAnswer, AdapterWorkerRequest, OracleState (+35 more)

### Community 62 - "core-block-commit.test.ts"
Cohesion: 0.05
Nodes (40): Commit, Committed, TestBackend, HeldRead, Job, Outcome, Reads, Step (+32 more)

### Community 63 - "backup/backup.ts"
Cohesion: 0.07
Nodes (49): BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool (+41 more)

### Community 64 - "record-and-replay.test.ts"
Cohesion: 0.06
Nodes (31): TapeBuilder, Arguments, Command, RecordingError, ConnectionFrames, RecordAndReplayOptions, RecordAndReplayResult, ReplaySession (+23 more)

### Community 65 - "node/client.test.ts"
Cohesion: 0.05
Nodes (30): Answer, FakeNode, Handler, Received, recorded, result(), bytes(), caught() (+22 more)

### Community 66 - "loop.ts"
Cohesion: 0.08
Nodes (42): PendingKey, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+34 more)

### Community 67 - "boundary.test.ts"
Cohesion: 0.08
Nodes (44): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+36 more)

### Community 68 - "binding.test.ts"
Cohesion: 0.07
Nodes (42): A113Observation, A156Observation, Binding, Created, Outcome, PrivateSeen, A114Observation, A116Observation (+34 more)

### Community 69 - "ref_node_fs"
Cohesion: 0.05
Nodes (34): Finding, Upstream, GuardViolation, Pem, TestCertificates, ReportedTest, filesUnder(), patchesOf() (+26 more)

### Community 7 - "db/migrate.ts"
Cohesion: 0.03
Nodes (131): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference (+123 more)

### Community 70 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (43): HeightActivity, LoopInput, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead (+35 more)

### Community 71 - "zero-timeouts-checks.ts"
Cohesion: 0.08
Nodes (39): Settings, Run, Job, WorkerEvent, Outcome, openBlockWrites(), commitHeight(), commitHeight() (+31 more)

### Community 72 - "lockstep-refusals.test.ts"
Cohesion: 0.07
Nodes (38): LockstepCondition, Report, LockstepWait, A118Observation, MismatchObservation, ExpectedWait, WaitSample, ReportRelay (+30 more)

### Community 73 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck (+39 more)

### Community 74 - "spawnChild"
Cohesion: 0.06
Nodes (38): ParentJob, Kill, Orphaned, SourceFile, LockResult, startWorker(), guardPid(), alive() (+30 more)

### Community 75 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.04
Nodes (47): Absent, n(), 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 1. Executive conclusion (+39 more)

### Community 76 - "browser.test.ts"
Cohesion: 0.09
Nodes (39): BrowserBuild, Reachable, pageBench, PageEvent, ProcessName, StatusBody, PageServer, midChainProblems() (+31 more)

### Community 77 - "NodeClient"
Cohesion: 0.12
Nodes (18): NodeSourceOptions, NodeClient, finalizedHeight(), positive(), isRecord(), bytesParameter(), hashParameter(), blockUnavailable() (+10 more)

### Community 78 - "PointName"
Cohesion: 0.06
Nodes (30): ItemSink, PointName, BlockItems, HeightFailure, Misuse, SlowBlockCondition, CallEvent, A43Case (+22 more)

### Community 79 - "validate.ts"
Cohesion: 0.09
Nodes (40): HistoryFinding, ConfigRule, CursorRule, Finding, Issue, Plain, SettingsSchema, TestKeysRuleOptions (+32 more)

### Community 8 - "UmbraError"
Cohesion: 0.03
Nodes (101): LoadedConfig, LoadOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresOptions, ReadDatabaseOptions, ConfiguredDatabase (+93 more)

### Community 80 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 81 - "net.test.ts"
Cohesion: 0.08
Nodes (22): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade (+14 more)

### Community 84 - "translatePostgresError"
Cohesion: 0.09
Nodes (31): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, ClockRegressionError, PgDriverError (+23 more)

### Community 85 - "version-checks.ts"
Cohesion: 0.13
Nodes (32): builtInNetwork, LedgerTable, CountingNode, MetadataSelector, Select, Walk, Answers, builtInLedgerTable() (+24 more)

### Community 87 - "node/errors.ts"
Cohesion: 0.08
Nodes (25): Pending, Subscription, Waiter, connectionFailure, NodeCallMethod, NodeMethod, SubscribeMethod, SocketFailure (+17 more)

### Community 88 - "worker-storage.test.ts"
Cohesion: 0.09
Nodes (25): NodeStore, StoredNode, EngineOptions, BridgeServer, bridgeStore, Growable, Nodes, bridgeMemory() (+17 more)

### Community 89 - "ref_node_crypto"
Cohesion: 0.07
Nodes (28): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, integer(), checkFunctionsSql() (+20 more)

### Community 9 - "admin-harness.ts"
Cohesion: 0.04
Nodes (102): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+94 more)

### Community 91 - "core-settings.ts"
Cohesion: 0.06
Nodes (34): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+26 more)

### Community 94 - "order.property.test.ts"
Cohesion: 0.09
Nodes (33): PointRun, Recorder, CheckName, GraphSpec, ModuleSpec, Pipeline, TESTED, byBytes() (+25 more)

### Community 97 - "builds.ts"
Cohesion: 0.10
Nodes (30): AdminStarter, PrivateProcess, PrivateRefusal, PublicCoreOptions, TestKeyConfig, KeyCrashJob, PrivacyOptions, privacyRun (+22 more)

### Community 101 - "refused"
Cohesion: 0.06
Nodes (31): refused(), When a callback fails, 7. Storage helpers, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-5 `/status` and `/config` contents (+23 more)

### Community 141 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (16): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 2. Database API (+8 more)

### Community 143 - "decode.ts"
Cohesion: 0.29
Nodes (17): blockAnswer(), byteArrayAnswer(), bytesAnswer(), bytesListAnswer(), countParameter(), frozenCopy(), hashAnswer(), headerAnswer() (+9 more)

### Community 148 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.12
Nodes (13): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1 (+5 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.12
Nodes (14): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+6 more)

### Community 159 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 165 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 177 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 183 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 185 - ".slowBlockMs"
Cohesion: 0.22
Nodes (9): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 16. Whole system, 5. Runner, Requirement: RN-17 A slow block is reported, never cut off, Scenario: A slow callback (+1 more)

### Community 187 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 201 - "Full-Chain Storage"
Cohesion: 0.22
Nodes (7): 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 4. How to run it, 5. Acceptance criteria status, 6. Known limitations, Full-Chain Storage

### Community 205 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 211 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 213 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 229 - ".closed"
Cohesion: 0.33
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 240 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 265 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 92 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 95 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 99 - "core-ledger-state.ts"
Cohesion: 0.10
Nodes (33): applyBlock(), boundLedger(), bytesOf(), contractsOf(), deployedBelow(), hex(), maintainedOf(), parentTimeOf() (+25 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 122 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.07
Nodes (22): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change) (+14 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 133 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric` (+12 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 142 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 144 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 147 - "UmbraDB module guide"
Cohesion: 0.12
Nodes (16): Blocks from the node, Contract states and contract logs, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Reading through `db` (+8 more)

### Community 149 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 151 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 158 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 161 - "ROADMAP.md"
Cohesion: 0.14
Nodes (9): For historical reference only, Tasks — superseded by per-sprint openspec changes, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity (+1 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 164 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 166 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 169 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 170 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 171 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 174 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 175 - "README.md"
Cohesion: 0.30
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 176 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.17
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 179 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 181 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 182 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 184 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 186 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 189 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 190 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 191 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 192 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 193 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 194 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 197 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 198 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 199 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 200 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 202 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 203 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 204 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 207 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 208 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 209 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 210 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 212 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 214 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 215 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 216 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 217 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 218 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 219 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 220 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 221 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 222 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 225 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 226 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 227 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 228 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 230 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 231 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 232 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 233 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 234 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 235 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 236 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 237 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 238 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 241 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 242 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 243 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.40
Nodes (5): Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not), Rework (class 3 continued — cross-vendor cold audit, rounds 2-4), Rework (class 3 — cross-vendor audit caught real correctness defects post-self-verify)

### Community 244 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 245 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 246 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 247 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 248 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 249 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 250 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 251 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 252 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 253 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 254 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 255 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 256 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 257 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 258 - "00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 259 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.40
Nodes (4): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Suggested fix

### Community 260 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 261 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 262 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 263 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 264 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 266 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 267 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 268 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 269 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 270 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 271 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 272 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 273 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 274 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 82 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 86 - "package.json"
Cohesion: 0.05
Nodes (40): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+32 more)

### Community 90 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+29 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

## Knowledge Gaps
- **54 isolated node(s):** `RFC-6455`, `RFC-3339`, `RFC-8785`, `RFC-8785`, `RFC-3339` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3639 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionHistoryStorage`, `postgres/checkpoint-store.ts`, `test/postgres/setup.ts`, `column-rules.ts`, `declaration.ts`, `src/index.ts`, `TransactionHandle`, `db/migrate.ts`, `UmbraError`, `admin-harness.ts`, `core-transport.ts`, `postgres/transaction-lease.ts`, `config/history.ts`, `ReadHandle`, `cbor.ts`, `fetch-fixtures.ts`, `runner/process.ts`, `process-admin.ts`, `refused-configuration.test.ts`, `createClient`, `adapter-fixtures.ts`, `restore-ledger.ts`, `change-capture.ts`, `core-private-source.test.ts`, `tape/index.ts`, `ledger/types.ts`, `adapter.ts`, `chain-placement.test.ts`, `core-block-parsed.ts`, `validate.test.ts`, `builder.test.ts`, `ledger-storage.test.ts`, `loop.test.ts`, `node-format.ts`, `contract-data-checks.ts`, `writer-lock-checks.ts`, `api-server.test.ts`, `chain-process.test.ts`, `range.test.ts`, `key-checks.ts`, `LedgerPackage`, `backup-fixtures.ts`, `process-context.test.ts`, `ValidationError`, `config-check.ts`, `transform-checks.ts`, `private/backends.ts`, `cli/command.ts`, `validation.ts`, `.from`, `mapping.ts`, `networks.ts`, `declaration`, `12. Ledger`, `core-block-commit.test.ts`, `backup/backup.ts`, `record-and-replay.test.ts`, `node/client.test.ts`, `boundary.test.ts`, `binding.test.ts`, `ref_node_fs`, `slow-block-harness.ts`, `zero-timeouts-checks.ts`, `lockstep-refusals.test.ts`, `spawnChild`, `browser.test.ts`, `PointName`, `real-tapes.ts`, `net.test.ts`, `translatePostgresError`, `version-checks.ts`, `package.json`, `node/errors.ts`, `worker-storage.test.ts`, `ref_node_crypto`, `core-settings.ts`, `order.property.test.ts`, `builds.ts`, `core-ledger-state.ts`, `sweep-tapes.ts`, `backup/restore.ts`, `process-worker.ts`, `chain-events-decode.test.ts`, `plain-data.ts`, `browser/build.ts`, `Lockstep`, `code-registry.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `worker-threads.test.ts`, `readiness.test.ts`, `ledger-sweep.test.ts`, `block-fetch-decode.test.ts`, `package-identity.test.ts`, `core-ledger-state.test.ts`, `Tasks — v1.0.0-infosec-signoff`, `no-indexer-or-wallet-sdk.test.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `web-lock.ts`, `twox.ts`, `midnight-env — reproducible PREPROD dev environment`, `excluded-not-exported.test.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `retention.ts`, `postgres-image.test.ts`?**
  _High betweenness centrality (0.283) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-6455`, `RFC-3339`, `RFC-8785` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionHistoryStorage` be split into smaller, more focused modules?**
  _Cohesion score 0.01556420233463035 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `cli/restore.ts`, `column-rules.ts`, `package-identity.test.ts`, `declaration.ts`, `db/migrate.ts`, `core-ledger-state.test.ts`, `core-transport.ts`, `config/history.ts`, `vitest`, `ReadHandle`, `decode.ts`, `cbor.ts`, `runner/process.ts`, `fetch-fixtures.ts`, `process-admin.ts`, `refused-configuration.test.ts`, `UmbraDB module guide`, `BlockRef`, `FinalizedLoop`, `restore-ledger.ts`, `change-capture.ts`, `core-private-source.test.ts`, `RuntimeMetadata`, `tape/index.ts`, `chain-placement.test.ts`, `checkShape`, `web-lock.ts`, `validate.test.ts`, `module-api.ts`, `loop.test.ts`, `writer-lock-checks.ts`, `api-server.test.ts`, `chain-process.test.ts`, `process-context.test.ts`, `config-check.ts`, `transform-checks.ts`, `private/backends.ts`, `validation.ts`, `.from`, `mapping.ts`, `networks.ts`, `sha256`, `declaration`, `core-block-commit.test.ts`, `backup/backup.ts`, `12. Ledger`, `node/client.test.ts`, `loop.ts`, `binding.test.ts`, `slow-block-harness.ts`, `zero-timeouts-checks.ts`, `lockstep-refusals.test.ts`, `graph.ts`, `NodeClient`, `validate.ts`, `version-checks.ts`, `node/errors.ts`, `ref_node_crypto`, `core-ledger-state.ts`, `backup/restore.ts`, `process-worker.ts`, `plain-data.ts`, `range.ts`, `readiness.test.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `postgres/checkpoint-store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.014568040654997177 - nodes in this community are weakly interconnected._